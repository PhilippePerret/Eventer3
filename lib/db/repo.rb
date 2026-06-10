require 'json'
require_relative 'database'
require_relative '../bootstrap'

module DB
  module Repo

    # ── Méthodes legacy (context_path) ─────────────────────────────

    def self.find_lister(data_dir, context_path, type: nil)
      with_db(data_dir) do |db|
        row = _find_lister_row(db, context_path, type)
        next nil unless row
        { item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
      end
    end

    def self.find_items(data_dir, context_path, filename: '__items.json')
      lister_type = case filename
        when '__brins.json'  then 'brins'
        when '__persos.json' then 'persos'
        else nil
        end
      with_db(data_dir) do |db|
        lister_row = _find_lister_row(db, context_path, lister_type)
        next {} unless lister_row
        _fetch_items(db, JSON.parse(lister_row['item_ids'] || '[]'))
      end
    end

    def self.save_lister(data_dir, context_path, item_ids:)
      with_db(data_dir) do |db|
        row = _find_lister_row(db, context_path, nil)
        next unless row
        db.execute(
          "UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
          [JSON.generate(item_ids), Time.now.strftime('%Y-%m-%dT%H:%M:%S'), row['id']]
        )
      end
    end

    def self.upsert_item(data_dir, context_path, payload)
      with_db(data_dir) do |db|
        lister_row = _find_lister_row(db, context_path, nil)
        next unless lister_row
        item_id  = payload['id']
        now      = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        existing = db.execute("SELECT id FROM items WHERE id = ?", [item_id]).first
        if existing
          sets, vals = [], []
          %w[title type color checked duration].each do |col|
            next unless payload.key?(col)
            sets << "#{col} = ?"
            v = payload[col]
            vals << (col == 'checked' ? (v ? 1 : 0) : v)
          end
          unless sets.empty?
            db.execute("UPDATE items SET #{sets.join(', ')}, updated_at = ? WHERE id = ?", vals + [now, item_id])
          end
          _update_props(db, item_id, payload)
        else
          db.execute(
            "INSERT INTO items (id, title, type, color, checked, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [item_id, payload['title'], payload['type'], payload['color'],
             payload['checked'] ? 1 : 0, payload['duration'], now, now]
          )
          item_class = _lister_item_class(lister_row['type'])
          _insert_props(db, item_id, payload, item_class)
          item_ids = JSON.parse(lister_row['item_ids'] || '[]')
          item_ids << item_id unless item_ids.include?(item_id)
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
            [JSON.generate(item_ids), now, lister_row['id']])
        end
      end
    end

    # ── Méthodes API ────────────────────────────────────────────────

    # TESTS ONLY — non utilisé par le frontend
    def self.find_item_lister(data_dir, item_id)
      with_db(data_dir) do |db|
        pp_row = db.execute("SELECT * FROM project_props WHERE item_id = ? LIMIT 1", [item_id]).first
        if pp_row && pp_row['lister_id']
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [pp_row['lister_id']]).first
          next nil unless lister_row
          result = { id: lister_row['id'], item_ids: JSON.parse(lister_row['item_ids'] || '[]'), updated_at: lister_row['updated_at'] }
          brin_ids = JSON.parse(pp_row['brin_ids'] || '[]') rescue []
          result[:brins_lister_id] = "#{item_id}-brins" unless brin_ids.empty?
          next result
        end
        ep_row = db.execute("SELECT lister_id FROM event_props WHERE item_id = ? LIMIT 1", [item_id]).first
        next nil unless ep_row && ep_row['lister_id']
        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [ep_row['lister_id']]).first
        next nil unless lister_row
        { id: lister_row['id'], item_ids: JSON.parse(lister_row['item_ids'] || '[]'), updated_at: lister_row['updated_at'] }
      end
    end

    def self.update_lister(data_dir, id, fields, project_id: nil)
      if project_id && fields.key?('item_ids')
        return with_project_db(data_dir, project_id) do |db|
          db.execute(
            "UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
            [JSON.generate(fields['item_ids']), Time.now.strftime('%Y-%m-%dT%H:%M:%S'), id]
          )
        end
      end
      with_db(data_dir) do |db|
        if fields.key?('item_ids')
          if id.to_s.end_with?('-brins')
            project_id = id.to_s.sub(/-brins$/, '')
            db.execute(
              "UPDATE project_props SET brin_ids = ? WHERE item_id = ?",
              [JSON.generate(fields['item_ids']), project_id]
            )
          elsif id.to_s.end_with?('-persos')
            project_id = id.to_s.sub(/-persos$/, '')
            db.execute(
              "UPDATE project_props SET perso_ids = ? WHERE item_id = ?",
              [JSON.generate(fields['item_ids']), project_id]
            )
          else
            db.execute(
              "UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
              [JSON.generate(fields['item_ids']), Time.now.strftime('%Y-%m-%dT%H:%M:%S'), id]
            )
          end
        end
      end
    end

    def self.create_lister(data_dir, type:, parent_item_id:, item_ids: [])
      return { id: "#{parent_item_id}-brins"  } if type == 'brins'
      return { id: "#{parent_item_id}-persos" } if type == 'persos'
      with_db(data_dir) do |db|
        now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        db.execute(
          "INSERT INTO listers (type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?)",
          [type, JSON.generate(item_ids), now, now]
        )
        new_id = db.last_insert_row_id
        if type == 'events'
          ep_row = db.execute("SELECT 1 FROM event_props WHERE item_id = ?", [parent_item_id]).first
          if ep_row
            db.execute("UPDATE event_props SET lister_id = ? WHERE item_id = ?", [new_id, parent_item_id])
          else
            existing = db.execute("SELECT 1 FROM project_props WHERE item_id = ?", [parent_item_id]).first
            if existing
              db.execute("UPDATE project_props SET lister_id = ? WHERE item_id = ?", [new_id, parent_item_id])
            else
              db.execute("INSERT INTO project_props (item_id, lister_id) VALUES (?, ?)", [parent_item_id, new_id])
            end
          end
        end
        { id: new_id }
      end
    end

    def self.find_lister_by_id(data_dir, id, project_id: nil)
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [id]).first
          next nil unless row
          { id: row['id'], item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
        end
      end
      if id.to_s.end_with?('-brins')
        project_id = id.to_s.sub(/-brins$/, '')
        return with_db(data_dir) do |db|
          pp_row = db.execute("SELECT brin_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next nil unless pp_row
          brin_ids = JSON.parse(pp_row['brin_ids'] || '[]') rescue []
          { id: id, item_ids: brin_ids, updated_at: nil }
        end
      end
      if id.to_s.end_with?('-persos')
        project_id = id.to_s.sub(/-persos$/, '')
        return with_db(data_dir) do |db|
          pp_row = db.execute("SELECT perso_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next nil unless pp_row
          perso_ids = JSON.parse(pp_row['perso_ids'] || '[]') rescue []
          { id: id, item_ids: perso_ids, updated_at: nil }
        end
      end
      with_db(data_dir) do |db|
        row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [id]).first
        next nil unless row
        result = { id: row['id'], item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
        pp_row = db.execute("SELECT item_id, brin_ids, perso_ids FROM project_props WHERE lister_id = ? LIMIT 1", [id]).first
        if pp_row
          brin_ids = JSON.parse(pp_row['brin_ids'] || '[]') rescue []
          result[:brins_lister_id] = "#{pp_row['item_id']}-brins" unless brin_ids.empty?
          perso_ids = JSON.parse(pp_row['perso_ids'] || '[]') rescue []
          result[:persos_lister_id] = "#{pp_row['item_id']}-persos" unless perso_ids.empty?
        end
        result
      end
    end

    def self.find_items_by_lister_id(data_dir, lister_id, project_id: nil)
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
          next {} unless lister_row
          _fetch_items(db, JSON.parse(lister_row['item_ids'] || '[]'), with_project_props: false)
        end
      end
      if lister_id.to_s.end_with?('-brins')
        project_id = lister_id.to_s.sub(/-brins$/, '')
        return with_db(data_dir) do |db|
          pp_row = db.execute("SELECT brin_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next {} unless pp_row
          brin_ids = JSON.parse(pp_row['brin_ids'] || '[]') rescue []
          _fetch_items(db, brin_ids)
        end
      end
      if lister_id.to_s.end_with?('-persos')
        project_id = lister_id.to_s.sub(/-persos$/, '')
        return with_db(data_dir) do |db|
          pp_row = db.execute("SELECT perso_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next {} unless pp_row
          perso_ids = JSON.parse(pp_row['perso_ids'] || '[]') rescue []
          _fetch_items(db, perso_ids)
        end
      end
      with_db(data_dir) do |db|
        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
        next {} unless lister_row
        _fetch_items(db, JSON.parse(lister_row['item_ids'] || '[]'))
      end
    end

    def self.update_item(data_dir, item_id, fields, project_id: nil)
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
          sets, vals = [], []
          %w[title type color checked duration].each do |col|
            next unless fields.key?(col)
            sets << "#{col} = ?"
            v = fields[col]
            vals << (col == 'checked' ? (v ? 1 : 0) : v)
          end
          unless sets.empty?
            db.execute("UPDATE items SET #{sets.join(', ')}, updated_at = ? WHERE id = ?", vals + [now, item_id])
          end
          _update_props(db, item_id, fields)
        end
      end
      with_db(data_dir) do |db|
        now  = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        sets, vals = [], []
        %w[title type color checked duration].each do |col|
          next unless fields.key?(col)
          sets << "#{col} = ?"
          v = fields[col]
          vals << (col == 'checked' ? (v ? 1 : 0) : v)
        end
        new_id = fields['id']
        if new_id && new_id != item_id
          db.execute("PRAGMA foreign_keys = OFF")
          begin
            db.execute("UPDATE items SET id = ?, updated_at = ? WHERE id = ?", [new_id, now, item_id])
            %w[project_props event_props brin_props perso_props].each do |tbl|
              db.execute("UPDATE #{tbl} SET item_id = ? WHERE item_id = ?", [new_id, item_id])
            end
            db.execute("UPDATE counters SET project_id = ? WHERE project_id = ?", [new_id, item_id])
          ensure
            db.execute("PRAGMA foreign_keys = ON")
          end
          item_id = new_id
        end
        unless sets.empty?
          db.execute("UPDATE items SET #{sets.join(', ')}, updated_at = ? WHERE id = ?", vals + [now, item_id])
        end
        _update_props(db, item_id, fields)
      end
    end

    def self.create_item(data_dir, lister_id, fields, project_id: nil)
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
          next nil unless lister_row
          item_class = _lister_item_class(lister_row['type'])
          next nil unless item_class
          prefix  = { 'project' => 'p', 'event' => 'e', 'perso' => 'c', 'brin' => 'b' }[item_class] || 'i'
          item_id = fields['id'] || _generate_id(db, project_id, item_class, prefix)
          db.execute(
            "INSERT INTO items (id, title, type, color, checked, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [item_id, fields['title'], fields['type'], fields['color'], 0, fields['duration'], now, now]
          )
          _insert_props(db, item_id, fields, item_class)
          item_ids = JSON.parse(lister_row['item_ids'] || '[]') << item_id
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?", [JSON.generate(item_ids), now, lister_id])
          { 'id' => item_id, 'title' => fields['title'], 'type' => fields['type'] }
        end
      end
      with_db(data_dir) do |db|
        now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

        if lister_id.to_s.end_with?('-brins')
          project_id = lister_id.to_s.sub(/-brins$/, '')
          item_id = fields['id'] || _generate_id(db, project_id, 'brin', 'b')
          db.execute(
            "INSERT INTO items (id, title, type, color, checked, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [item_id, fields['title'], fields['type'], fields['color'], 0, fields['duration'], now, now]
          )
          db.execute("INSERT OR IGNORE INTO brin_props (item_id, badge) VALUES (?, ?)", [item_id, fields['badge']])
          pp_row = db.execute("SELECT brin_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          brin_ids = pp_row ? (JSON.parse(pp_row['brin_ids'] || '[]') rescue []) : []
          brin_ids << item_id unless brin_ids.include?(item_id)
          db.execute("UPDATE project_props SET brin_ids = ? WHERE item_id = ?", [JSON.generate(brin_ids), project_id])
          next { 'id' => item_id, 'title' => fields['title'], 'type' => fields['type'] }
        end

        if lister_id.to_s.end_with?('-persos')
          project_id = lister_id.to_s.sub(/-persos$/, '')
          item_id = fields['id'] || _generate_id(db, project_id, 'perso', 'c')
          db.execute(
            "INSERT INTO items (id, title, type, color, checked, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [item_id, fields['title'], nil, nil, 0, nil, now, now]
          )
          db.execute("INSERT OR IGNORE INTO perso_props (item_id, badge) VALUES (?, ?)", [item_id, fields['badge']])
          pp_row = db.execute("SELECT perso_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          perso_ids = pp_row ? (JSON.parse(pp_row['perso_ids'] || '[]') rescue []) : []
          perso_ids << item_id unless perso_ids.include?(item_id)
          db.execute("UPDATE project_props SET perso_ids = ? WHERE item_id = ?", [JSON.generate(perso_ids), project_id])
          next { 'id' => item_id, 'title' => fields['title'] }
        end

        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
        next nil unless lister_row

        item_class = _lister_item_class(lister_row['type'])
        next nil unless item_class

        project_id = _find_project_id(db, lister_id)
        prefix     = { 'project' => 'p', 'event' => 'e', 'perso' => 'c' }[item_class] || 'i'
        item_id    = fields['id'] || _generate_id(db, project_id, item_class, prefix)

        db.execute(
          "INSERT INTO items (id, title, type, color, checked, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [item_id, fields['title'], fields['type'], fields['color'], 0, fields['duration'], now, now]
        )
        _insert_props(db, item_id, fields, item_class)

        item_ids = JSON.parse(lister_row['item_ids'] || '[]') << item_id
        db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?", [JSON.generate(item_ids), now, lister_id])

        { 'id' => item_id, 'title' => fields['title'], 'type' => fields['type'] }
      end
    end

    def self.delete_item(data_dir, lister_id, item_id)
      with_db(data_dir) do |db|
        now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

        if lister_id.to_s.end_with?('-brins')
          project_id = lister_id.to_s.sub(/-brins$/, '')
          pp_row = db.execute("SELECT brin_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next nil unless pp_row
          brin_ids = JSON.parse(pp_row['brin_ids'] || '[]') rescue []
          next nil unless brin_ids.include?(item_id)
          brin_ids.delete(item_id)
          db.execute("UPDATE project_props SET brin_ids = ? WHERE item_id = ?", [JSON.generate(brin_ids), project_id])
          # Retirer le brin de tous les events qui l'ont assigné
          db.execute("SELECT item_id, brin_ids FROM event_props WHERE brin_ids LIKE ?", ["%#{item_id}%"]).each do |row|
            ev_brin_ids = JSON.parse(row['brin_ids'] || '[]') rescue []
            if ev_brin_ids.include?(item_id)
              ev_brin_ids.delete(item_id)
              db.execute("UPDATE event_props SET brin_ids = ? WHERE item_id = ?", [JSON.generate(ev_brin_ids), row['item_id']])
            end
          end

        elsif lister_id.to_s.end_with?('-persos')
          project_id = lister_id.to_s.sub(/-persos$/, '')
          pp_row = db.execute("SELECT perso_ids FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
          next nil unless pp_row
          perso_ids = JSON.parse(pp_row['perso_ids'] || '[]') rescue []
          next nil unless perso_ids.include?(item_id)
          perso_ids.delete(item_id)
          db.execute("UPDATE project_props SET perso_ids = ? WHERE item_id = ?", [JSON.generate(perso_ids), project_id])

        else
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id.to_i]).first
          next nil unless lister_row
          item_ids = JSON.parse(lister_row['item_ids'] || '[]')
          next nil unless item_ids.include?(item_id.to_s)
          item_ids.delete(item_id.to_s)
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?", [JSON.generate(item_ids), now, lister_id.to_i])
        end

        %w[project event brin perso].each do |type|
          db.execute("DELETE FROM #{type}_props WHERE item_id = ?", [item_id])
        end
        db.execute("DELETE FROM counters WHERE project_id = ?", [item_id])
        db.execute("DELETE FROM items WHERE id = ?", [item_id])
        true
      end
    end

    # ── Helpers privés ──────────────────────────────────────────────

    def self.with_db(data_dir)
      db = DB.open(data_dir)
      db.results_as_hash = true
      result = yield(db)
      db.close
      result
    end
    private_class_method :with_db

    def self.with_project_db(data_dir, project_id)
      db_path = with_db(data_dir) do |db|
        row = db.execute("SELECT db_path FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
        row ? row['db_path'] : nil
      end
      raise "Aucun db_path trouvé pour le projet #{project_id.inspect}" unless db_path
      Bootstrap.ensure_project_data!(db_path)
      proj_db = DB.open_project(db_path)
      proj_db.results_as_hash = true
      result = yield(proj_db)
      proj_db.close
      result
    end
    private_class_method :with_project_db

    def self._lister_item_class(lister_type)
      case lister_type
      when 'projects' then 'project'
      when 'events'   then 'event'
      when 'persos'   then 'perso'
      else nil
      end
    end
    private_class_method :_lister_item_class

    def self._find_project_id(db, lister_id)
      pp_row = db.execute("SELECT item_id FROM project_props WHERE lister_id = ? LIMIT 1", [lister_id]).first
      pp_row ? pp_row['item_id'] : nil
    end
    private_class_method :_find_project_id

    def self._generate_id(db, project_id, item_type, prefix)
      valid_project = project_id && db.execute("SELECT 1 FROM items WHERE id = ? LIMIT 1", [project_id.to_s]).first
      unless valid_project
        val = 1
        val += 1 while db.execute("SELECT 1 FROM items WHERE id = ?", ["#{prefix}#{val}"]).first
        return "#{prefix}#{val}"
      end
      db.execute("INSERT OR IGNORE INTO counters (project_id, item_type, last_val) VALUES (?, ?, 0)", [project_id, item_type])
      db.execute("UPDATE counters SET last_val = last_val + 1 WHERE project_id = ? AND item_type = ?", [project_id, item_type])
      counter_row = db.execute("SELECT last_val FROM counters WHERE project_id = ? AND item_type = ?", [project_id, item_type]).first
      val = counter_row ? counter_row['last_val'] : 1
      val += 1 while db.execute("SELECT 1 FROM items WHERE id = ?", ["#{prefix}#{val}"]).first
      "#{prefix}#{val}"
    end
    private_class_method :_generate_id

    def self._fetch_items(db, item_ids, with_project_props: true)
      return {} if item_ids.empty?
      placeholders = item_ids.map { '?' }.join(', ')
      if with_project_props
        sql = <<~SQL
          SELECT i.id, i.title, i.type, i.color, i.checked, i.duration, i.created_at, i.updated_at,
                 pp.active, pp.state AS project_state,
                 ep.state AS state, ep.meteo, ep.effet, ep.lieu,
                 CASE WHEN ep.item_id IS NOT NULL THEN ep.perso_ids ELSE pp.perso_ids END AS perso_ids,
                 CASE WHEN ep.item_id IS NOT NULL THEN ep.brin_ids  ELSE pp.brin_ids  END AS brin_ids,
                 COALESCE(bp.badge, pers.badge) AS badge,
                 bp.perso_ids AS brin_perso_ids,
                 pers.patronyme, pers.avatar, pers.fonction,
                 COALESCE(ep.lister_id, pp.lister_id) AS lister_id,
                 ep.css
          FROM items i
          LEFT JOIN project_props pp   ON pp.item_id = i.id
          LEFT JOIN event_props   ep   ON ep.item_id = i.id
          LEFT JOIN brin_props    bp   ON bp.item_id = i.id
          LEFT JOIN perso_props   pers ON pers.item_id = i.id
          WHERE i.id IN (#{placeholders})
        SQL
      else
        sql = <<~SQL
          SELECT i.id, i.title, i.type, i.color, i.checked, i.duration, i.created_at, i.updated_at,
                 NULL AS active, NULL AS project_state,
                 ep.state AS state, ep.meteo, ep.effet, ep.lieu,
                 ep.perso_ids AS perso_ids,
                 ep.brin_ids  AS brin_ids,
                 COALESCE(bp.badge, pers.badge) AS badge,
                 bp.perso_ids AS brin_perso_ids,
                 pers.patronyme, pers.avatar, pers.fonction,
                 ep.lister_id AS lister_id,
                 ep.css
          FROM items i
          LEFT JOIN event_props   ep   ON ep.item_id = i.id
          LEFT JOIN brin_props    bp   ON bp.item_id = i.id
          LEFT JOIN perso_props   pers ON pers.item_id = i.id
          WHERE i.id IN (#{placeholders})
        SQL
      end
      rows = db.execute(sql, item_ids)
      hash = {}
      rows.each do |row|
        row['brin_ids']       = JSON.parse(row['brin_ids']       || '[]') rescue []
        row['perso_ids']      = JSON.parse(row['perso_ids']      || '[]') rescue []
        row['brin_perso_ids'] = JSON.parse(row['brin_perso_ids'] || '[]') rescue []
        row['css']            = JSON.parse(row['css']            || '[]') rescue []
        row['active'] = row['active'].nil? ? nil : row['active'].to_i == 1
        hash[row['id']] = row
      end
      ordered = {}
      item_ids.each { |id| ordered[id] = hash[id] if hash[id] }
      ordered
    end
    private_class_method :_fetch_items

    def self._find_lister_row(db, context_path, type)
      segments = context_path.split('/')
      last_id  = segments.last.sub(/^lof-/, '')
      if segments.length == 1
        db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [last_id]).first
      elsif type == 'brins'
        pp_row = db.execute("SELECT brin_ids FROM project_props WHERE item_id = ? LIMIT 1", [last_id]).first
        return nil unless pp_row
        { 'id' => "#{last_id}-brins", 'type' => 'brins', 'item_ids' => (pp_row['brin_ids'] || '[]') }
      else
        pp_row = db.execute("SELECT lister_id FROM project_props WHERE item_id = ? LIMIT 1", [last_id]).first
        return nil unless pp_row && pp_row['lister_id']
        db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [pp_row['lister_id']]).first
      end
    end
    private_class_method :_find_lister_row

    def self._insert_props(db, item_id, payload, item_class)
      case item_class
      when 'project' then db.execute("INSERT OR IGNORE INTO project_props (item_id) VALUES (?)", [item_id])
      when 'event'   then db.execute("INSERT OR IGNORE INTO event_props (item_id) VALUES (?)", [item_id])
      when 'brin'    then db.execute("INSERT OR IGNORE INTO brin_props (item_id, badge) VALUES (?, ?)", [item_id, payload['badge']])
      when 'perso'   then db.execute("INSERT OR IGNORE INTO perso_props (item_id, badge) VALUES (?, ?)", [item_id, payload['badge']])
      end
    end
    private_class_method :_insert_props

    def self._update_props(db, item_id, payload)
      if payload.key?('brin_ids')
        db.execute("UPDATE event_props SET brin_ids = ? WHERE item_id = ?",
          [JSON.generate(payload['brin_ids']), item_id])
      end
      if payload.key?('perso_ids')
        db.execute("UPDATE event_props SET perso_ids = ? WHERE item_id = ?",
          [JSON.generate(payload['perso_ids']), item_id])
        db.execute("UPDATE brin_props  SET perso_ids = ? WHERE item_id = ?",
          [JSON.generate(payload['perso_ids']), item_id])
      end
      if payload.key?('state')
        db.execute("UPDATE event_props SET state = ? WHERE item_id = ?",
          [payload['state'].to_i, item_id])
      end
      if payload.key?('css')
        db.execute("UPDATE event_props SET css = ? WHERE item_id = ?",
          [JSON.generate(payload['css']), item_id])
      end
      if payload.key?('meteo')
        db.execute("UPDATE event_props SET meteo = ? WHERE item_id = ?", [payload['meteo'], item_id])
      end
      if payload.key?('effet')
        db.execute("UPDATE event_props SET effet = ? WHERE item_id = ?", [payload['effet'], item_id])
      end
      if payload.key?('lieu')
        db.execute("UPDATE event_props SET lieu = ? WHERE item_id = ?", [payload['lieu'], item_id])
      end
      if payload.key?('db_path')
        db.execute("UPDATE project_props SET db_path = ? WHERE item_id = ?", [payload['db_path'], item_id])
      end
      if payload.key?('folder_path')
        db.execute("UPDATE project_props SET folder_path = ? WHERE item_id = ?", [payload['folder_path'], item_id])
      end
      if payload.key?('badge')
        db.execute("UPDATE brin_props  SET badge = ? WHERE item_id = ?", [payload['badge'], item_id])
        db.execute("UPDATE perso_props SET badge = ? WHERE item_id = ?", [payload['badge'], item_id])
      end
      if payload.key?('patronyme')
        db.execute("UPDATE perso_props SET patronyme = ? WHERE item_id = ?", [payload['patronyme'], item_id])
      end
      if payload.key?('avatar')
        db.execute("UPDATE perso_props SET avatar = ? WHERE item_id = ?", [payload['avatar'], item_id])
      end
      if payload.key?('fonction')
        db.execute("UPDATE perso_props SET fonction = ? WHERE item_id = ?", [payload['fonction'], item_id])
      end
    end
    private_class_method :_update_props

  end
end
