require_relative 'database'

module DB
  def self.seed!(data_dir)
    db = open(data_dir)
    db.results_as_hash = true
    return db.close if db.execute("SELECT COUNT(*) as n FROM listers").first['n'].to_i > 0

    now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

    db.transaction do
      db.execute(
        "INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [1, 'projects', '["model"]', now, now]
      )
      db.execute(
        "INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [2, 'events', '["e1"]', now, now]
      )

      db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['model', 'Projet modèle', 'roman', now, now]
      )
      db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['e1', 'Event modèle', nil, now, now]
      )
      db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['b1', 'Brin modèle', 'intrigue', now, now]
      )
      db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['p1', 'Perso modèle', 'adjuvant', now, now]
      )

      db.execute(
        "INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
        ['model', 0, 1, 2, '["b1"]', '["p1"]']
      )
      db.execute(
        "INSERT INTO event_props (item_id, depth, lister_id) VALUES (?, ?, ?)",
        ['e1', 1, nil]
      )
      db.execute("INSERT INTO brin_props  (item_id, badge) VALUES (?, ?)", ['b1', 'BRI'])
      db.execute("INSERT INTO perso_props (item_id, badge) VALUES (?, ?)", ['p1', 'PER'])

      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['model', 'event', 1])
      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['model', 'brin',  1])
      db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['model', 'perso', 1])
    end

    db.close
  end
end
