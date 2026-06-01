require_relative 'database'

module DB
  def self.seed!(data_dir)
    db = open(data_dir)
    db.results_as_hash = true
    return db.close if db.execute("SELECT COUNT(*) as n FROM items WHERE type = 'project'").first['n'].to_i > 0

    now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

    db.transaction do
      db.execute(
        "INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['projects', 'projects', '["demo-projet"]', now, now]
      )
      db.execute(
        "INSERT INTO items (id, lister_id, title, type, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['demo-projet', 'projects', 'Projet modèle', 'project', 0, now, now]
      )
      db.execute("INSERT INTO project_props (item_id) VALUES (?)", ['demo-projet'])

      db.execute(
        "INSERT INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        ['demo-projet-events', 'events', 'demo-projet', '["e1"]', now, now]
      )
      db.execute(
        "INSERT INTO items (id, lister_id, title, type, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['e1', 'demo-projet-events', 'Premier événement', 'event', 1, now, now]
      )
      db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e1'])

      db.execute(
        "INSERT INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        ['demo-projet-brins', 'brins', 'demo-projet', '["b1"]', now, now]
      )
      db.execute(
        "INSERT INTO items (id, lister_id, title, type, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['b1', 'demo-projet-brins', 'Fil rouge', 'brin', 1, now, now]
      )
      db.execute("INSERT INTO brin_props (item_id, badge) VALUES (?, ?)", ['b1', 'FIL'])

      db.execute(
        "INSERT INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        ['demo-projet-persos', 'persos', 'demo-projet', '["p1"]', now, now]
      )
      db.execute(
        "INSERT INTO items (id, lister_id, title, type, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['p1', 'demo-projet-persos', 'Protagoniste', 'perso', 1, now, now]
      )
      db.execute("INSERT INTO perso_props (item_id, badge) VALUES (?, ?)", ['p1', 'PRO'])

      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['demo-projet', 'event', 1])
      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['demo-projet', 'brin', 1])
      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['demo-projet', 'perso', 1])
    end

    db.close
  end
end
