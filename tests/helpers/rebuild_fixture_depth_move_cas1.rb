$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

FIXTURE_DIR = File.expand_path('../../fixtures/depth-move-cas1', __FILE__)
DB_PATH = File.join(FIXTURE_DIR, 'eventer.db')

File.delete(DB_PATH) if File.exist?(DB_PATH)
DB.initialize!(FIXTURE_DIR)

db = DB.open(FIXTURE_DIR)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

# Cas 1 : e45 déplacé de Liste #3 vers Liste #5 (sans enfant, même profondeur)
# Résultat attendu : depths inchangés — Liste#2=1, #3=2, #4=3, #5=2
#
#   Liste #3 item_ids : ["e31"]         (e45 retiré)
#   Liste #5 item_ids : ["e88","e45"]   (e45 ajouté)

db.transaction do
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["project-a"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e14","e23"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [3, 'events', '["e31"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [4, 'events', '["e57","e68"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [5, 'events', '["e88","e45"]', now, now])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['project-a', 'Projet A', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['project-a', 0, 1, 2, '[]', '[]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e14', 'Acte 1', now, now])
  db.execute("INSERT INTO event_props (item_id, lister_id) VALUES (?, ?)", ['e14', 3])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e23', 'Acte 2', now, now])
  db.execute("INSERT INTO event_props (item_id, lister_id) VALUES (?, ?)", ['e23', 5])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e31', 'Séquence 1', now, now])
  db.execute("INSERT INTO event_props (item_id, lister_id) VALUES (?, ?)", ['e31', 4])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e45', 'Séquence 2', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e45'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e57', 'Scène 1', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e57'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e68', 'Scène 2', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e68'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e88', 'Séquence 3', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e88'])

  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'event', 88])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'brin',  0])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['project-a', 'perso', 0])
end

db.close
puts "Fixture depth-move-cas1 rebuilt."
