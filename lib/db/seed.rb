require 'fileutils'
require_relative 'database'

module DB
  def self.seed!(data_dir)
    db = open(data_dir)
    db.results_as_hash = true
    return db.close if db.execute("SELECT COUNT(*) as n FROM listers").first['n'].to_i > 0

    now          = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
    proj_id      = 'model'
    proj_db_rel  = 'model/eventer.db'
    proj_db_path = File.join(data_dir, proj_db_rel)

    db.transaction do
      db.execute(
        "INSERT INTO listers (id, type, item_ids, updated_at) VALUES (?, ?, ?, ?)",
        [1, 'projects', JSON.generate([proj_id]), now]
      )
      db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [proj_id, 'Projet modèle', 'roman', now, now]
      )
      db.execute(
        "INSERT INTO project_refs (item_id, db_path, folder_path) VALUES (?, ?, ?)",
        [proj_id, proj_db_rel, File.join(data_dir, 'model')]
      )
    end
    db.close

    FileUtils.mkdir_p(File.dirname(proj_db_path))
    DB.initialize_project!(proj_db_path)
    proj_db = DB.open_project(proj_db_path)
    proj_db.results_as_hash = true
    proj_db.transaction do
      proj_db.execute(
        "INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [1, 'events', JSON.generate(['e1']), now, now]
      )
      proj_db.execute(
        "INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
        ['e1', 'Event modèle', now, now]
      )
      proj_db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e1'])
      proj_db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['b1', 'Brin modèle', 'intrigue', now, now]
      )
      proj_db.execute("INSERT INTO brin_props (item_id, badge) VALUES (?, ?)", ['b1', 'BRI'])
      proj_db.execute(
        "INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ['c1', 'Perso modèle', 'adjuvant', now, now]
      )
      proj_db.execute("INSERT INTO perso_props (item_id, badge) VALUES (?, ?)", ['c1', 'PER'])
      proj_db.execute(
        "INSERT INTO project_meta (id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
        [proj_id, 0, 1, 1, JSON.generate(['b1']), JSON.generate(['c1'])]
      )
      proj_db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [proj_id, 'event', 1])
      proj_db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [proj_id, 'brin',  1])
      proj_db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [proj_id, 'perso', 1])
    end
    proj_db.close
  end
end
