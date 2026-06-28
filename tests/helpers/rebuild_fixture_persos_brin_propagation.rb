$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'
require 'fileutils'

# Fixture persos-brin-propagation :
#   project-a, brin b1 (B1, perso_ids=[c1]), persos c1 (AA), c2 (BB)
#   e1 : brin_ids=[b1], perso_ids=[]    → marque AA (via brin)
#   e2 : brin_ids=[b1], perso_ids=[]    → marque AA (via brin)
#   e3 : brin_ids=[],   perso_ids=[c1]  → marque AA (DIRECT)
#   e4 : brin_ids=[],   perso_ids=[]    → aucune marque (témoin)

PROJECT_ID  = '00000000-0000-0000-0000-000000000001'
FIXTURE_DIR = File.expand_path('../../fixtures/persos-brin-propagation', __FILE__)
PROJ_DIR    = File.join(FIXTURE_DIR, PROJECT_ID)
DB_PATH     = File.join(PROJ_DIR, 'eventer.db')

FileUtils.rm_rf(FIXTURE_DIR)

# main.db : registre global
DB.initialize!(FIXTURE_DIR)
main = DB.open(FIXTURE_DIR)
main.execute("INSERT INTO project_refs (id, db_path, folder_path, title) VALUES (?, ?, ?, ?)",
  [PROJECT_ID, "#{PROJECT_ID}/eventer.db", '', 'Projet A'])
main.close

# eventer.db : données du projet
DB.initialize_project!(DB_PATH)
db = DB.open_project(DB_PATH)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  db.execute("INSERT INTO project_meta (id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    [PROJECT_ID, 0, 1, 2, '["b1"]', '["c1","c2"]'])

  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2","e3","e4"]', now, now])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['e1', 'Événement 1', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)", ['e1', '["b1"]', '[]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['e2', 'Événement 2', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)", ['e2', '["b1"]', '[]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['e3', 'Événement 3', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)", ['e3', '[]', '["c1"]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['e4', 'Événement 4', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)", ['e4', '[]', '[]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['b1', 'Mon brin', 'brin', now, now])
  db.execute("INSERT INTO brin_props (item_id, badge, perso_ids) VALUES (?, ?, ?)", ['b1', 'B1', '["c1"]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['c1', 'Perso AA', 'perso', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)", ['c1', 'AA', 'Aaa', 'protagoniste'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", ['c2', 'Perso BB', 'perso', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)", ['c2', 'BB', 'Bbb', 'deutéragoniste'])

  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['event', 4])
  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['brin',  1])
  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['perso', 2])
end

db.close
puts "Fixture persos-brin-propagation rebuilt."
