$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'
require 'fileutils'

FIXTURE_DIR = File.expand_path('../../fixtures/with-tokens', __FILE__)
UUID        = '00000000-0000-0000-0000-000000000002'
PROJECT_DB  = File.join(FIXTURE_DIR, UUID, 'eventer.db')

FileUtils.rm_rf(FIXTURE_DIR)
FileUtils.mkdir_p(FIXTURE_DIR)

# main.db
DB.initialize!(FIXTURE_DIR)
main_db = SQLite3::Database.new(File.join(FIXTURE_DIR, 'main.db'))
main_db.results_as_hash = true
main_db.execute("INSERT INTO project_refs (id, db_path, folder_path, title) VALUES (?, ?, ?, ?)",
  [UUID, "#{UUID}/eventer.db", nil, 'Projet tokens'])
main_db.close

# eventer.db
DB.initialize_project!(PROJECT_DB)
db = SQLite3::Database.new(PROJECT_DB)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  # Listers
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2","e3"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [3, 'brins', '["b1"]', now, now])

  # project_meta
  db.execute("INSERT INTO project_meta (id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    [UUID, 0, 1, 2, '["b1"]', '["c1","c2"]'])

  # Events
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e1', '/VILLE/ est belle', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids) VALUES (?, ?)", ['e1', '["b1"]'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e2', 'PP arrive à /VILLE/', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e2'])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['e3', 'PPpat arrive à /VILLE/', 'event', now, now])
  db.execute("INSERT INTO event_props (item_id) VALUES (?)", ['e3'])

  # Brin b1 : titre avec token
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['b1', 'Le brin de /VILLE/', 'intrigue', now, now])
  db.execute("INSERT INTO brin_props (item_id, badge) VALUES (?, ?)", ['b1', 'BV'])

  # Perso c1 : Phil / PP — patronyme = Philippe Perret (pour badge + patronyme replacement)
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c1', 'Phil', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme) VALUES (?, ?, ?)", ['c1', 'PP', 'Philippe Perret'])

  # Perso c2 : titre avec token (pour tester remplacement dans titre perso)
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c2', 'Héros de /VILLE/', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge) VALUES (?, ?)", ['c2', 'HR'])

  # Constants
  db.execute("INSERT INTO constants (position, name, value) VALUES (?, ?, ?)", [0, 'VILLE', 'Paris'])

  # Counters
  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['event', 3])
  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['brin',  1])
  db.execute("INSERT INTO counters (item_type, last_val) VALUES (?, ?)", ['perso', 2])
end

db.close
puts "Fixture with-tokens rebuilt."
