$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

FIXTURE_DIR = File.expand_path('../../fixtures/with-persos', __FILE__)
DB_PATH = File.join(FIXTURE_DIR, 'eventer.db')

require 'fileutils'
FileUtils.mkdir_p(FIXTURE_DIR)
File.delete(DB_PATH) if File.exist?(DB_PATH)
DB.initialize!(FIXTURE_DIR)

db = DB.open(FIXTURE_DIR)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["project-a"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2"]', now, now])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['project-a', 'Projet A', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['project-a', 0, 1, 2, '["b1"]', '["c1","c2"]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e1', 'Événement 1', now, now])
  db.execute("INSERT INTO event_props (item_id, depth, brin_ids, perso_ids) VALUES (?, ?, ?, ?)",
    ['e1', 1, '["b1"]', '["c1"]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e2', 'Événement 2', now, now])
  db.execute("INSERT INTO event_props (item_id, depth, brin_ids, perso_ids) VALUES (?, ?, ?, ?)",
    ['e2', 1, '[]', '[]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['b1', 'Mon brin', 'intrigue', now, now])
  db.execute("INSERT INTO brin_props (item_id, badge, perso_ids) VALUES (?, ?, ?)", ['b1', 'MON', '[]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c1', 'Cyrano', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)",
    ['c1', 'CY', 'de Bergerac', 'protagoniste'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c2', 'Roxane', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)",
    ['c2', 'RO', 'Robin', 'deutéragoniste'])

  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'event', 2])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'brin',  1])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'perso', 2])
end

db.close
puts "Fixture with-persos rebuilt."
