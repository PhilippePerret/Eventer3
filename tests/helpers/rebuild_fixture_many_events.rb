$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

FIXTURE_DIR = File.expand_path('../../fixtures/many-events', __FILE__)
DB_PATH = File.join(FIXTURE_DIR, 'eventer.db')

File.delete(DB_PATH) if File.exist?(DB_PATH)
DB.initialize!(FIXTURE_DIR)

db = DB.open(FIXTURE_DIR)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["00000000-0000-0000-0000-000000000001","00000000-0000-0000-0000-000000000002"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2","e3"]', now, now])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 'Projet A', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 0, 1, 2, '[]', '[]'])

  [['e1', 'Évènement un'], ['e2', 'Évènement deux'], ['e3', 'Évènement trois']].each do |id, title|
    db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [id, title, 'event', now, now])
    db.execute("INSERT INTO event_props (item_id) VALUES (?)", [id])
  end

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000002', 'Projet B', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000002', 0, 1, '[]', '[]'])

  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'event', 3])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'brin',  0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'perso', 0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000002', 'event', 0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000002', 'brin',  0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000002', 'perso', 0])
end

db.close
puts "Fixture many-events rebuilt."
