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

# Fixture with-persos :
#   project-a (lister 2 / events e1, e2)
#   brins : b1 (MON, perso_ids=[c2])
#   persos :
#     c1 Cyrano    (CY, direct sur e1,        sans avatar)
#     c2 Roxane    (RO, sur brin b1 → hérité, sans avatar)
#     c3 Christian (CH, non assigné,           avatar 🎭)
#     c4 Valvert   (VA, non assigné,           avatar 👑)
#   e1 : brin_ids=[b1], perso_ids=[c1]
#   e2 : vide
#   Règle à tester : avatars uniques — 🎭 (c3) et 👑 (c4) indisponibles pour c1/c2

db.transaction do
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["00000000-0000-0000-0000-000000000001"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e2"]', now, now])

  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 'Projet A', 'roman', now, now])
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['00000000-0000-0000-0000-000000000001', 0, 1, 2, '["b1"]', '["c1","c2","c3","c4"]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e1', 'Événement 1', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)",
    ['e1', '["b1"]', '["c1"]'])

  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['e2', 'Événement 2', now, now])
  db.execute("INSERT INTO event_props (item_id, brin_ids, perso_ids) VALUES (?, ?, ?)",
    ['e2', '[]', '[]'])

  # b1 possède c2
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['b1', 'Mon brin', 'intrigue', now, now])
  db.execute("INSERT INTO brin_props (item_id, badge, perso_ids) VALUES (?, ?, ?)", ['b1', 'MON', '["c2"]'])

  # c1 : direct sur e1, sans avatar
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c1', 'Cyrano', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)",
    ['c1', 'CY', 'de Bergerac', 'protagoniste'])

  # c2 : sur b1 (hérité par e1), sans avatar
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c2', 'Roxane', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, fonction) VALUES (?, ?, ?, ?)",
    ['c2', 'RO', 'Robin', 'deutéragoniste'])

  # c3 : non assigné, avatar 🎭
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c3', 'Christian', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, avatar, fonction) VALUES (?, ?, ?, ?, ?)",
    ['c3', 'CH', 'de Neuvillette', '🎭', 'adjuvant'])

  # c4 : non assigné, avatar 👑
  db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ['c4', 'Valvert', now, now])
  db.execute("INSERT INTO perso_props (item_id, badge, patronyme, avatar, fonction) VALUES (?, ?, ?, ?, ?)",
    ['c4', 'VA', 'de Valvert', '👑', 'opposant'])

  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'event', 2])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'brin',  1])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['00000000-0000-0000-0000-000000000001', 'perso', 4])
end

db.close
puts "Fixture with-persos rebuilt."
