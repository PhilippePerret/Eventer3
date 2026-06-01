require 'json'
require_relative 'database'

module DB
  module Repo

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
        _fetch_items(db, lister_row['id'], JSON.parse(lister_row['item_ids'] || '[]'))
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
            vals << payload[col]
          end
          unless sets.empty?
            db.execute("UPDATE items SET #{sets.join(', ')}, updated_at = ? WHERE id = ?", vals + [now, item_id])
          end
          _update_props(db, item_id, payload)
        else
          db.execute(
            "INSERT INTO items (id, lister_id, title, type, color, checked, duration, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [item_id, lister_row['id'], payload['title'], payload['type'], payload['color'],
             payload['checked'] ? 1 : 0, payload['duration'], 1, now, now]
          )
          _insert_props(db, item_id, payload)
        end
      end
    end

    def self.find_item_lister(data_dir, item_id)
      with_db(data_dir) do |db|
        row = db.execute(
          "SELECT * FROM listers WHERE parent_item_id = ? AND type NOT IN ('brins','persos') ORDER BY created_at LIMIT 1",
          [item_id]
        ).first
        next nil unless row
        brins_row = db.execute(
          "SELECT id FROM listers WHERE parent_item_id = ? AND type = 'brins' LIMIT 1",
          [item_id]
        ).first
        result = { id: row['id'], item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
        result[:brins_lister_id] = brins_row['id'] if brins_row
        result
      end
    end

    def self.update_lister(data_dir, id, fields)
      with_db(data_dir) do |db|
        if fields.key?('item_ids')
          db.execute(
            "UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?",
            [JSON.generate(fields['item_ids']), Time.now.strftime('%Y-%m-%dT%H:%M:%S'), id]
          )
        end
      end
    end

    def self.create_lister(data_dir, type:, parent_item_id:)
      with_db(data_dir) do |db|
        id  = "#{parent_item_id}-#{type}"
        now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        db.execute(
          "INSERT OR IGNORE INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
          [id, type, parent_item_id, '[]', now, now]
        )
        { id: id }
      end
    end

    def self.find_lister_by_id(data_dir, id)
      with_db(data_dir) do |db|
        row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [id]).first
        next nil unless row
        result = { id: row['id'], item_ids: JSON.parse(row['item_ids'] || '[]'), updated_at: row['updated_at'] }
        if row['parent_item_id']
          brins_row = db.execute(
            "SELECT id FROM listers WHERE parent_item_id = ? AND type = 'brins' LIMIT 1",
            [row['parent_item_id']]
          ).first
          result[:brins_lister_id] = brins_row['id'] if brins_row
        end
        result
      end
    end

    def self.find_items_by_lister_id(data_dir, lister_id)
      with_db(data_dir) do |db|
        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
        next {} unless lister_row
        _fetch_items(db, lister_id, JSON.parse(lister_row['item_ids'] || '[]'))
      end
    end

    def self.update_item(data_dir, item_id, fields)
      with_db(data_dir) do |db|
        now  = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        sets, vals = [], []
        %w[title type color checked duration].each do |col|
          next unless fields.key?(col)
          sets << "#{col} = ?"
          vals << fields[col]
        end
        new_id = fields['id']
        if new_id && new_id != item_id
          db.execute("PRAGMA foreign_keys = OFF")
          begin
            db.execute("UPDATE items SET id = ?, updated_at = ? WHERE id = ?", [new_id, now, item_id])
            %w[project_props event_props brin_props perso_props].each do |tbl|
              db.execute("UPDATE #{tbl} SET item_id = ? WHERE item_id = ?", [new_id, item_id])
            end
            db.execute("UPDATE listers SET parent_item_id = ? WHERE parent_item_id = ?", [new_id, item_id])
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

    def self.create_item(data_dir, lister_id, fields)
      with_db(data_dir) do |db|
        lister_row = db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [lister_id]).first
        next nil unless lister_row
        item_type = fields['type']
        item_id = if fields['id']
          fields['id']
        else
          prefix     = { 'event' => 'e', 'brin' => 'b', 'perso' => 'p', 'project' => 'p' }[item_type] || 'i'
          project_id = lister_row['parent_item_id']
          db.execute("INSERT OR IGNORE INTO counters (project_id, item_type, last_val) VALUES (?, ?, 0)", [project_id, item_type])
          db.execute("UPDATE counters SET last_val = last_val + 1 WHERE project_id = ? AND item_type = ?", [project_id, item_type])
          val = db.execute("SELECT last_val FROM counters WHERE project_id = ? AND item_type = ?", [project_id, item_type]).first['last_val']
          val += 1 while db.execute("SELECT 1 FROM items WHERE id = ?", ["#{prefix}#{val}"]).first
          db.execute("UPDATE counters SET last_val = ? WHERE project_id = ? AND item_type = ?", [val, project_id, item_type])
          "#{prefix}#{val}"
        end
        now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
        db.execute(
          "INSERT INTO items (id, lister_id, title, type, color, checked, duration, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item_id, lister_id, fields['title'], item_type, fields['color'], 0, fields['duration'], 1, now, now]
        )
        _insert_props(db, item_id, fields)
        item_ids = JSON.parse(lister_row['item_ids'] || '[]') << item_id
        db.execute("UPDATE listers SET item_ids = ?, updated_at = ? WHERE id = ?", [JSON.generate(item_ids), now, lister_id])
        { 'id' => item_id, 'title' => fields['title'], 'type' => item_type }
      end
    end

    # -- Helpers privés (reçoivent db, appelés dans un bloc with_db) --

    def self.with_db(data_dir)
      db = DB.open(data_dir)
      db.results_as_hash = true
      result = yield(db)
      db.close
      result
    end
    private_class_method :with_db

    def self._fetch_items(db, lister_id, item_ids)
      rows = db.execute(<<~SQL, [lister_id])
        SELECT i.id, i.title, i.type, i.color, i.checked, i.duration, i.created_at, i.updated_at,
               pp.active, pp.state AS project_state,
               ep.state AS event_state, ep.brin_ids, ep.perso_ids,
               bp.badge, bp.perso_ids AS brin_perso_ids,
               pers.badge AS perso_badge, pers.patronyme, pers.fonction,
               CASE WHEN cl.id IS NOT NULL THEN 1 ELSE 0 END AS hl
        FROM items i
        LEFT JOIN project_props pp   ON pp.item_id = i.id
        LEFT JOIN event_props   ep   ON ep.item_id = i.id
        LEFT JOIN brin_props    bp   ON bp.item_id = i.id
        LEFT JOIN perso_props   pers ON pers.item_id = i.id
        LEFT JOIN listers       cl   ON cl.parent_item_id = i.id AND cl.type NOT IN ('brins','persos')
        WHERE i.lister_id = ?
      SQL
      hash = {}
      rows.each do |row|
        row['brin_ids']  = JSON.parse(row['brin_ids']  || '[]') rescue []
        row['perso_ids'] = JSON.parse(row['perso_ids'] || '[]') rescue []
        row['active']    = row['active'].nil? ? nil : row['active'].to_i == 1
        row['hl']        = row['hl'].to_i == 1
        hash[row['id']] = row
      end
      ordered = {}
      item_ids.each { |id| ordered[id] = hash[id] if hash[id] }
      hash.each     { |id, data| ordered[id] ||= data }
      ordered
    end
    private_class_method :_fetch_items

    def self._find_lister_row(db, context_path, type)
      segments = context_path.split('/')
      last_id  = segments.last.sub(/^lof-/, '')
      if segments.length == 1
        db.execute("SELECT * FROM listers WHERE id = ? LIMIT 1", [last_id]).first
      elsif type
        db.execute("SELECT * FROM listers WHERE parent_item_id = ? AND type = ? LIMIT 1", [last_id, type]).first
      else
        db.execute("SELECT * FROM listers WHERE parent_item_id = ? AND type NOT IN ('brins','persos') LIMIT 1", [last_id]).first
      end
    end
    private_class_method :_find_lister_row

    def self._insert_props(db, item_id, payload)
      case payload['type']
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
      if payload.key?('badge')
        db.execute("UPDATE brin_props  SET badge = ? WHERE item_id = ?", [payload['badge'], item_id])
        db.execute("UPDATE perso_props SET badge = ? WHERE item_id = ?", [payload['badge'], item_id])
      end
    end
    private_class_method :_update_props

  end
end
