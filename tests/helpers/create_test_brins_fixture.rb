$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'
require 'fileutils'

DATA_DIR = File.expand_path('../../../data', __FILE__)

db_path = DB.path(DATA_DIR)
File.delete(db_path) if File.exist?(db_path)

project_dir = File.join(DATA_DIR, 'test-brins')
FileUtils.rm_rf(project_dir) if File.exist?(project_dir)

DB.initialize!(DATA_DIR)

db = DB.open(DATA_DIR)
db.results_as_hash = true

now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

PROJECT_ID      = 'test-brins'
PROJECT_DB_REL  = 'test-brins/eventer.db'
PROJECT_DB_PATH = File.join(DATA_DIR, PROJECT_DB_REL)

db.execute(
  "INSERT INTO project_refs (id, title, db_path, folder_path) VALUES (?, ?, ?, ?)",
  [PROJECT_ID, 'Projet Brins Test', PROJECT_DB_REL, File.join(DATA_DIR, 'test-brins')]
)
db.close

# Créer le project DB avec les events + brins
DB.initialize_project!(PROJECT_DB_PATH)
proj_db = DB.open_project(PROJECT_DB_PATH)
proj_db.results_as_hash = true

brins = [
  ['b1', 'Brin A', 'intrigue',   '#e74c3c', 'BRA'],
  ['b2', 'Brin B', 'accessoire', '#2ecc71', 'BRB'],
  ['b3', 'Brin C', 'personnage', '#3498db', 'BRC'],
  ['b4', 'Brin D', 'enquête',    '#f1c40f', 'BRD'],
]

proj_db.transaction do
  # Lister events (id=2, référencé par project_meta.lister_id)
  proj_db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e3","e2"]', now, now])

  # Event items
  [['e1','Event 1'],['e2','Event 2'],['e3','Event 3']].each do |id, title|
    proj_db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [id, title, now, now])
  end

  # event_props
  proj_db.execute("INSERT INTO event_props (item_id, brin_ids) VALUES (?, ?)", ['e1', '["b1","b2"]'])
  proj_db.execute("INSERT INTO event_props (item_id, brin_ids) VALUES (?, ?)", ['e2', '["b2","b3"]'])
  proj_db.execute("INSERT INTO event_props (item_id, brin_ids) VALUES (?, ?)", ['e3', '[]'])

  # Brin items + props
  brins.each do |id, title, type, color, badge|
    proj_db.execute("INSERT INTO items (id, title, type, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, type, color, now, now])
    proj_db.execute("INSERT INTO brin_props (item_id, badge) VALUES (?, ?)", [id, badge])
  end

  # project_meta
  proj_db.execute(
    "INSERT INTO project_meta (id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    [PROJECT_ID, 0, 1, 2, '["b1","b2","b3","b4"]', '[]']
  )

  # counters (sans project_id)
  proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['event', 3])
  proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['brin',  4])
  proj_db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['perso', 0])
end

proj_db.close
