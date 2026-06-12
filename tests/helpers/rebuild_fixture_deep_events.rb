$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

FIXTURE_DIR = File.expand_path('../../fixtures/deep-events', __FILE__)
DB_PATH = File.join(FIXTURE_DIR, 'eventer.db')

File.delete(DB_PATH) if File.exist?(DB_PATH)
DB.initialize!(FIXTURE_DIR)

db = DB.open(FIXTURE_DIR)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  # Listers
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["00000000-0000-0000-0000-000000000001"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2","e3"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [3, 'events', '["e4","e5"]', now, now])

  # Project
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 'Projet A', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 0, 1, 2, '[]', '[]'])

  # Top-level events (e1 has sub-lister id=3)
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e1', 'Évènement un', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, lister_id) VALUES (?, ?)", ['e1', 3])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e2', 'Évènement deux', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e2'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e3', 'Évènement trois', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e3'])

  # Sub-events under e1
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e4', 'Évènement e4', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e4'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e5', 'Évènement e5', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e5'])

  # Counters
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'event', 5])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'brin',  0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'perso', 0])
end

db.close
puts "Fixture deep-events rebuilt."
