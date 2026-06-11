require 'json'
require 'securerandom'
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
          %w[title type].each do |col|
            next unless payload.key?(col)
            sets << "#{col} = ?"
            vals << payload[col]
          end
          unless sets.empty?
            db.execute("UPDATE items SET #{sets.join(', ')}, updated_at = ? WHERE id = ?", vals + [now, item_id])
          end
        else
          db.execute(
            "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            [item_id, payload['title'], payload['type'], now, now]
          )
          item_ids = JSON.parse(lister_row['item_ids'] || '[]')
          item_ids << item_id unless item_ids.include?(item_id)
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
            [JSON.generate(item_ids), now, lister_row['id']])
        end
      end
    end

    # ── Méthodes API ────────────────────────────────────────────────

    # TESTS ONLY
    def self.find_item_lister(data_dir, item_id)
      with_project_db(data_dir, item_id) do |db|
        meta = db.execute("SELECT * FROM project_meta LIMIT 1").first
        next nil unless meta && meta['lister_id']
        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [meta['lister_id']]).first
        next nil unless lister_row
        result = { id: lister_row['id'], item_ids: JSON.parse(lister_row['item_ids'] || '[]'), updated_at: lister_row['updated_at'] }
        brin_ids  = JSON.parse(meta['brin_ids']  || '[]') rescue []
        perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
        result[:brins_lister_id]  = "#{item_id}-brins"  unless brin_ids.empty?
        result[:persos_lister_id] = "#{item_id}-persos" unless perso_ids.empty?
        result
      end
    end

    def self.open_project_from_db(data_dir, folder_path:, db_path:)
      with_db(data_dir) do |db|
        new_id         = SecureRandom.uuid
        folder_name    = File.basename(folder_path)
        stored_db_path = db_path.start_with?(data_dir + '/') ? db_path.sub("#{data_dir}/", '') : db_path
        db.execute(
          "INSERT INTO project_refs (id, title, db_path, folder_path) VALUES (?, ?, ?, ?)",
          [new_id, folder_name, stored_db_path, folder_path]
        )
        { 'id' => new_id, 'title' => folder_name }
      end
    end

    def self.update_lister(data_dir, id, fields, project_id: nil)
      now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
      if fields.key?('item_ids')
        if id.to_s.end_with?('-brins')
          pid = project_id || id.to_s.sub(/-brins$/, '')
          return with_project_db(data_dir, pid) do |db|
            db.execute("UPDATE project_meta SET brin_ids = ? WHERE id = ?",
              [JSON.generate(fields['item_ids']), pid])
          end
        end
        if id.to_s.end_with?('-persos')
          pid = project_id || id.to_s.sub(/-persos$/, '')
          return with_project_db(data_dir, pid) do |db|
            db.execute("UPDATE project_meta SET perso_ids = ? WHERE id = ?",
              [JSON.generate(fields['item_ids']), pid])
          end
        end
        if project_id
          return with_project_db(data_dir, project_id) do |db|
            db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
              [JSON.generate(fields['item_ids']), now, id])
          end
        end
        with_db(data_dir) do |db|
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
            [JSON.generate(fields['item_ids']), now, id])
        end
      end
    end

    def self.create_lister(data_dir, type:, parent_item_id:, item_ids: [], project_id: nil)
      return { id: "#{parent_item_id}-brins"  } if type == 'brins'
      return { id: "#{parent_item_id}-persos" } if type == 'persos'

      now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
      db_project_id = project_id || parent_item_id
      new_id = with_project_db(data_dir, db_project_id) do |db|
        db.execute("INSERT INTO listers (type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?)",
          [type, JSON.generate(item_ids), now, now])
        lid = db.last_insert_row_id
        meta_row = db.execute("SELECT 1 FROM project_meta WHERE id = ? LIMIT 1", [parent_item_id]).first
        if meta_row
          db.execute("UPDATE project_meta SET lister_id = ? WHERE id = ?", [lid, parent_item_id])
        else
          ep_row = db.execute("SELECT 1 FROM event_props WHERE item_id = ? LIMIT 1", [parent_item_id]).first
          if ep_row
            db.execute("UPDATE event_props SET lister_id = ? WHERE item_id = ?", [lid, parent_item_id])
          else
            db.execute("INSERT INTO event_props (item_id, lister_id) VALUES (?, ?)", [parent_item_id, lid])
          end
        end
        lid
      end
      { id: new_id }
    end

    def self.find_lister_by_id(data_dir, id, project_id: nil)
      if id.to_s.end_with?('-brins')
        pid = project_id || id.to_s.sub(/-brins$/, '')
        return with_project_db(data_dir, pid) do |db|
          meta = db.execute("SELECT brin_ids FROM project_meta LIMIT 1").first
          next nil unless meta
          brin_ids = JSON.parse(meta['brin_ids'] || '[]') rescue []
          { id: id, item_ids: brin_ids, updated_at: nil }
        end
      end
      if id.to_s.end_with?('-persos')
        pid = project_id || id.to_s.sub(/-persos$/, '')
        return with_project_db(data_dir, pid) do |db|
          meta = db.execute("SELECT perso_ids FROM project_meta LIMIT 1").first
          next nil unless meta
          perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
          { id: id, item_ids: perso_ids, updated_at: nil }
        end
      end
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          actual_id = if id.to_s == project_id.to_s
            meta = db.execute("SELECT lister_id FROM project_meta LIMIT 1").first
            meta ? meta['lister_id'] : nil
          else
            id
          end
          next nil unless actual_id
          row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [actual_id]).first
          next nil unless row
          lister_data = { id: row['id'], item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
          meta = db.execute("SELECT brin_ids, perso_ids, link_targets FROM project_meta LIMIT 1").first
          if meta
            brin_ids  = JSON.parse(meta['brin_ids']  || '[]') rescue []
            perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
            lister_data[:brins_lister_id]  = "#{project_id}-brins"  unless brin_ids.empty?
            lister_data[:persos_lister_id] = "#{project_id}-persos" unless perso_ids.empty?
            lts = JSON.parse(meta['link_targets'] || '[]') rescue []
            lister_data[:link_targets] = lts unless lts.empty?
            lister_data[:project_item_id] = project_id
          end
          lister_data
        end
      end
      # Liste des projets — toutes les entrées de project_refs
      with_db(data_dir) do |db|
        item_ids = db.execute("SELECT id FROM project_refs ORDER BY rowid").map { |r| r['id'] }
        { id: id, item_ids: item_ids, updated_at: nil }
      end
    end

    def self.find_items_by_lister_id(data_dir, lister_id, project_id: nil)
      if project_id
        return with_project_db(data_dir, project_id) do |db|
          if lister_id.to_s.end_with?('-brins')
            meta = db.execute("SELECT brin_ids FROM project_meta LIMIT 1").first
            next {} unless meta
            brin_ids = JSON.parse(meta['brin_ids'] || '[]') rescue []
            _fetch_items(db, brin_ids)
          elsif lister_id.to_s.end_with?('-persos')
            meta = db.execute("SELECT perso_ids FROM project_meta LIMIT 1").first
            next {} unless meta
            perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
            _fetch_items(db, perso_ids)
          else
            actual_id = if lister_id.to_s == project_id.to_s
              meta = db.execute("SELECT lister_id FROM project_meta LIMIT 1").first
              meta ? meta['lister_id'] : nil
            else
              lister_id
            end
            next {} unless actual_id
            lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [actual_id]).first
            next {} unless lister_row
            _fetch_items(db, JSON.parse(lister_row['item_ids'] || '[]'))
          end
        end
      end
      if lister_id.to_s.end_with?('-brins')
        pid = lister_id.to_s.sub(/-brins$/, '')
        return with_project_db(data_dir, pid) do |db|
          meta = db.execute("SELECT brin_ids FROM project_meta LIMIT 1").first
          next {} unless meta
          brin_ids = JSON.parse(meta['brin_ids'] || '[]') rescue []
          _fetch_items(db, brin_ids)
        end
      end
      if lister_id.to_s.end_with?('-persos')
        pid = lister_id.to_s.sub(/-persos$/, '')
        return with_project_db(data_dir, pid) do |db|
          meta = db.execute("SELECT perso_ids FROM project_meta LIMIT 1").first
          next {} unless meta
          perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
          _fetch_items(db, perso_ids)
        end
      end
      # Lister des projets (main.db)
      projects = with_db(data_dir) do |db|
        item_ids = db.execute("SELECT id FROM project_refs ORDER BY rowid").map { |r| r['id'] }
        _fetch_project_items(db, item_ids)
      end
      projects.each do |id, item|
        begin
          active = with_project_db(data_dir, id) do |db|
            meta = db.execute("SELECT active FROM project_meta LIMIT 1").first rescue nil
            meta ? meta['active'].to_i : 1
          end
          item['active'] = active
        rescue
          item['active'] = 1
        end
      end
      projects
    end

    def self.update_item(data_dir, item_id, fields, project_id: nil)
      now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
      if project_id
        return with_project_db(data_dir, project_id) do |db|
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
      # Project item (main.db) — title/id changes
      with_db(data_dir) do |db|
        new_id = fields['id']
        if new_id && new_id != item_id
          db.execute("UPDATE project_refs SET id = ? WHERE id = ?", [new_id, item_id])
          item_id = new_id
        end
        if fields.key?('title')
          db.execute("UPDATE project_refs SET title = ? WHERE id = ?", [fields['title'], item_id])
        end
      end
      # Champs projet → project_meta dans eventer.db
      project_meta_keys = %w[link_targets state active year]
      if project_meta_keys.any? { |k| fields.key?(k) }
        with_project_db(data_dir, item_id) do |db|
          _update_project_meta(db, item_id, fields)
        end
      end
    end

    def self.create_item(data_dir, lister_id, fields, project_id: nil)
      now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
      if project_id
        # Brin ou perso dans eventer.db
        if lister_id.to_s.end_with?('-brins')
          return with_project_db(data_dir, project_id) do |db|
            item_id = fields['id'] || _generate_id(db, project_id, 'brin', 'b')
            db.execute(
              "INSERT INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [item_id, fields['title'], fields['type'], fields['color'], 0, now, now]
            )
            db.execute("INSERT OR IGNORE INTO brin_props (item_id, badge) VALUES (?, ?)", [item_id, fields['badge']])
            meta = db.execute("SELECT brin_ids FROM project_meta LIMIT 1").first
            brin_ids = meta ? (JSON.parse(meta['brin_ids'] || '[]') rescue []) : []
            brin_ids << item_id unless brin_ids.include?(item_id)
            if meta
              db.execute("UPDATE project_meta SET brin_ids = ? WHERE id = ?", [JSON.generate(brin_ids), project_id])
            else
              db.execute("INSERT INTO project_meta (id, brin_ids) VALUES (?, ?)", [project_id, JSON.generate(brin_ids)])
            end
            { 'id' => item_id, 'title' => fields['title'], 'type' => fields['type'] }
          end
        end
        if lister_id.to_s.end_with?('-persos')
          return with_project_db(data_dir, project_id) do |db|
            item_id = fields['id'] || _generate_id(db, project_id, 'perso', 'c')
            db.execute(
              "INSERT INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [item_id, fields['title'], nil, nil, 0, now, now]
            )
            db.execute("INSERT OR IGNORE INTO perso_props (item_id, badge) VALUES (?, ?)", [item_id, fields['badge']])
            meta = db.execute("SELECT perso_ids FROM project_meta LIMIT 1").first
            perso_ids = meta ? (JSON.parse(meta['perso_ids'] || '[]') rescue []) : []
            perso_ids << item_id unless perso_ids.include?(item_id)
            if meta
              db.execute("UPDATE project_meta SET perso_ids = ? WHERE id = ?", [JSON.generate(perso_ids), project_id])
            else
              db.execute("INSERT INTO project_meta (id, perso_ids) VALUES (?, ?)", [project_id, JSON.generate(perso_ids)])
            end
            { 'id' => item_id, 'title' => fields['title'] }
          end
        end
        # Event dans eventer.db
        return with_project_db(data_dir, project_id) do |db|
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
          next nil unless lister_row
          item_class = _lister_item_class(lister_row['type'])
          next nil unless item_class
          prefix  = { 'event' => 'e', 'perso' => 'c', 'brin' => 'b' }[item_class] || 'i'
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
      # Nouveau projet (main.db)
      with_db(data_dir) do |db|
        new_id = fields['id'] || SecureRandom.uuid
        db.execute(
          "INSERT INTO project_refs (id, title, db_path, folder_path) VALUES (?, ?, ?, ?)",
          [new_id, fields['title'], fields['db_path'], fields['folder_path']]
        )
        { 'id' => new_id, 'title' => fields['title'] }
      end
    end

    def self.delete_item(data_dir, lister_id, item_id, project_id: nil)
      now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
      if project_id
        if lister_id.to_s.end_with?('-brins')
          return with_project_db(data_dir, project_id) do |db|
            meta = db.execute("SELECT brin_ids FROM project_meta LIMIT 1").first
            next nil unless meta
            brin_ids = JSON.parse(meta['brin_ids'] || '[]') rescue []
            next nil unless brin_ids.include?(item_id)
            brin_ids.delete(item_id)
            db.execute("UPDATE project_meta SET brin_ids = ? WHERE id = ?", [JSON.generate(brin_ids), project_id])
            db.execute("SELECT item_id, brin_ids FROM event_props WHERE brin_ids LIKE ?", ["%#{item_id}%"]).each do |row|
              ev_brin_ids = JSON.parse(row['brin_ids'] || '[]') rescue []
              if ev_brin_ids.include?(item_id)
                ev_brin_ids.delete(item_id)
                db.execute("UPDATE event_props SET brin_ids = ? WHERE item_id = ?", [JSON.generate(ev_brin_ids), row['item_id']])
              end
            end
            db.execute("DELETE FROM brin_props WHERE item_id = ?", [item_id])
            db.execute("DELETE FROM items WHERE id = ?", [item_id])
            true
          end
        end
        if lister_id.to_s.end_with?('-persos')
          return with_project_db(data_dir, project_id) do |db|
            meta = db.execute("SELECT perso_ids FROM project_meta LIMIT 1").first
            next nil unless meta
            perso_ids = JSON.parse(meta['perso_ids'] || '[]') rescue []
            next nil unless perso_ids.include?(item_id)
            perso_ids.delete(item_id)
            db.execute("UPDATE project_meta SET perso_ids = ? WHERE id = ?", [JSON.generate(perso_ids), project_id])
            db.execute("DELETE FROM perso_props WHERE item_id = ?", [item_id])
            db.execute("DELETE FROM items WHERE id = ?", [item_id])
            true
          end
        end
        return with_project_db(data_dir, project_id) do |db|
          lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id.to_i]).first
          next nil unless lister_row
          item_ids = JSON.parse(lister_row['item_ids'] || '[]')
          next nil unless item_ids.include?(item_id.to_s)
          item_ids.delete(item_id.to_s)
          db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?", [JSON.generate(item_ids), now, lister_id.to_i])
          %w[event brin perso].each { |t| db.execute("DELETE FROM #{t}_props WHERE item_id = ?", [item_id]) }
          db.execute("DELETE FROM counters")
          db.execute("DELETE FROM items WHERE id = ?", [item_id])
          true
        end
      end
      # Suppression projet (main.db)
      with_db(data_dir) do |db|
        deleted = db.execute("DELETE FROM project_refs WHERE id = ?", [item_id])
        deleted.changes > 0 ? true : nil
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
        row = db.execute("SELECT db_path, folder_path FROM project_refs WHERE id = ? LIMIT 1", [project_id]).first
        # Fallback legacy
        row ||= begin
          db.execute("SELECT db_path, folder_path FROM project_props WHERE item_id = ? LIMIT 1", [project_id]).first
        rescue SQLite3::Exception
          nil
        end
        next nil unless row
        dp = row['db_path']
        if dp.nil? || dp.to_s.strip.empty?
          fp = row['folder_path']
          (fp && !fp.to_s.strip.empty?) ? File.join(fp, 'eventer.db') : nil
        else
          dp
        end
      end
      if db_path.nil? || db_path.to_s.strip.empty?
        return with_db(data_dir) { |db| yield(db) }
      end
      full_path = db_path.start_with?('/') ? db_path : File.join(data_dir, db_path)
      Bootstrap.ensure_project_data!(full_path)
      proj_db = DB.open_project(full_path)
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
      when 'brins'    then 'brin'
      else nil
      end
    end
    private_class_method :_lister_item_class

    def self._generate_main_id(db, prefix)
      val = 1
      val += 1 while db.execute("SELECT 1 FROM items WHERE id = ?", ["#{prefix}#{val}"]).first
      "#{prefix}#{val}"
    end
    private_class_method :_generate_main_id

    def self._generate_id(db, project_id, item_type, prefix)
      db.execute("INSERT OR IGNORE INTO counters (item_type, last_val) VALUES (?, 0)", [item_type])
      db.execute("UPDATE counters SET last_val = last_val + 1 WHERE item_type = ?", [item_type])
      counter_row = db.execute("SELECT last_val FROM counters WHERE item_type = ?", [item_type]).first
      val = counter_row ? counter_row['last_val'] : 1
      val += 1 while db.execute("SELECT 1 FROM items WHERE id = ?", ["#{prefix}#{val}"]).first
      "#{prefix}#{val}"
    end
    private_class_method :_generate_id

    # Chargement des projets depuis project_refs
    def self._fetch_project_items(db, item_ids)
      return {} if item_ids.empty?
      placeholders = item_ids.map { '?' }.join(', ')
      rows = db.execute(
        "SELECT id, title, db_path, folder_path FROM project_refs WHERE id IN (#{placeholders})",
        item_ids
      )
      hash = {}
      rows.each { |row| hash[row['id']] = { 'id' => row['id'], 'title' => row['title'], 'type' => 'roman', 'db_path' => row['db_path'], 'folder_path' => row['folder_path'] } }
      ordered = {}
      item_ids.each { |id| ordered[id] = hash[id] if hash[id] }
      ordered
    end
    private_class_method :_fetch_project_items

    # Chargement des items d'un projet (eventer.db) — events, brins, persos
    def self._fetch_items(db, item_ids)
      return {} if item_ids.empty?
      placeholders = item_ids.map { '?' }.join(', ')
      sql = <<~SQL
        SELECT i.id, i.title, i.type, i.color, i.checked, i.duration, i.created_at, i.updated_at,
               ep.state, ep.meteo, ep.effet, ep.lieu,
               ep.perso_ids, ep.brin_ids, ep.lister_id, ep.css,
               COALESCE(bp.badge, pers.badge) AS badge,
               bp.perso_ids AS brin_perso_ids,
               pers.patronyme, pers.avatar, pers.fonction
        FROM items i
        LEFT JOIN event_props   ep   ON ep.item_id = i.id
        LEFT JOIN brin_props    bp   ON bp.item_id = i.id
        LEFT JOIN perso_props   pers ON pers.item_id = i.id
        WHERE i.id IN (#{placeholders})
      SQL
      rows = db.execute(sql, item_ids)
      hash = {}
      rows.each do |row|
        row['brin_ids']       = JSON.parse(row['brin_ids']       || '[]') rescue []
        row['perso_ids']      = JSON.parse(row['perso_ids']      || '[]') rescue []
        row['brin_perso_ids'] = JSON.parse(row['brin_perso_ids'] || '[]') rescue []
        row['css']            = JSON.parse(row['css']            || '[]') rescue []
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
      else
        nil
      end
    end
    private_class_method :_find_lister_row

    def self._insert_props(db, item_id, payload, item_class)
      case item_class
      when 'event' then db.execute("INSERT OR IGNORE INTO event_props (item_id) VALUES (?)", [item_id])
      when 'brin'  then db.execute("INSERT OR IGNORE INTO brin_props (item_id, badge) VALUES (?, ?)", [item_id, payload['badge']])
      when 'perso' then db.execute("INSERT OR IGNORE INTO perso_props (item_id, badge) VALUES (?, ?)", [item_id, payload['badge']])
      end
    end
    private_class_method :_insert_props

    def self._update_props(db, item_id, payload)
      if payload.key?('brin_ids')
        db.execute("UPDATE event_props SET brin_ids = ? WHERE item_id = ?", [JSON.generate(payload['brin_ids']), item_id])
      end
      if payload.key?('perso_ids')
        db.execute("UPDATE event_props SET perso_ids = ? WHERE item_id = ?", [JSON.generate(payload['perso_ids']), item_id])
        db.execute("UPDATE brin_props  SET perso_ids = ? WHERE item_id = ?", [JSON.generate(payload['perso_ids']), item_id])
      end
      if payload.key?('state')
        db.execute("UPDATE event_props SET state = ? WHERE item_id = ?", [payload['state'].to_i, item_id])
      end
      if payload.key?('css')
        db.execute("UPDATE event_props SET css = ? WHERE item_id = ?", [JSON.generate(payload['css']), item_id])
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

    def self._update_project_meta(db, project_id, fields)
      cols, vals = [], []
      %w[state active year link_targets].each do |col|
        next unless fields.key?(col)
        cols << col
        v = fields[col]
        vals << (col == 'link_targets' ? JSON.generate(v) : (col == 'active' ? (v ? 1 : 0) : v))
      end
      return if cols.empty?
      existing = db.execute("SELECT 1 FROM project_meta WHERE id = ? LIMIT 1", [project_id]).first
      if existing
        sets = cols.map { |c| "#{c} = ?" }.join(', ')
        db.execute("UPDATE project_meta SET #{sets} WHERE id = ?", vals + [project_id])
      else
        placeholders = (['?'] * (cols.length + 1)).join(', ')
        db.execute("INSERT INTO project_meta (id, #{cols.join(', ')}) VALUES (#{placeholders})", [project_id] + vals)
      end
    end
    private_class_method :_update_project_meta

  end
end
