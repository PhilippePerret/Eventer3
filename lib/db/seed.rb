require 'fileutils'
require 'securerandom'
require_relative 'database'

module DB
  def self.seed!(data_dir)
    db = open(data_dir)
    db.results_as_hash = true
    return db.close if db.execute("SELECT COUNT(*) as n FROM project_refs").first['n'].to_i > 0

    now          = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
    proj_id      = SecureRandom.uuid
    proj_db_rel  = "model/eventer.db"
    proj_db_path = File.join(data_dir, proj_db_rel)

    db.execute(
      "INSERT INTO project_refs (id, title, db_path, folder_path) VALUES (?, ?, ?, ?)",
      [proj_id, 'Projet modèle', proj_db_rel, File.join(data_dir, 'model')]
    )
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
        ['e1', 'Acte I', now, now]
      )
      proj_db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e1'])
      proj_db.execute(
        "INSERT INTO project_meta (id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
        [proj_id, 0, 1, 1, '[]', '[]']
      )
      proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['event', 1])
      proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['brin',  0])
      proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['perso', 0])
    end
    proj_db.close
  end
end
