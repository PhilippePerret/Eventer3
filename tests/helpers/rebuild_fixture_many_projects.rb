$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

FIXTURE_DIR = File.expand_path('../../fixtures/many-projects', __FILE__)
DB_PATH = File.join(FIXTURE_DIR, 'eventer.db')

File.delete(DB_PATH) if File.exist?(DB_PATH)
DB.initialize!(FIXTURE_DIR)

db = DB.open(FIXTURE_DIR)
db.results_as_hash = true
now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["project-a","project-b","project-c","project-hidden"]', now, now])

  [
    ['project-a',      'Projet A',     'roman',    1],
    ['project-b',      'Projet B',     'scenario', 1],
    ['project-c',      'Projet C',     'roman',    1],
    ['project-hidden', 'Projet caché', 'roman',    0],
  ].each do |id, title, type, active|
    db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [id, title, type, now, now])
    db.execute("INSERT INTO project_props (item_id, state, active, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?)",
      [id, 0, active, '[]', '[]'])
    db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [id, 'event', 0])
    db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [id, 'brin',  0])
    db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [id, 'perso', 0])
  end
end

db.close
puts "Fixture many-projects rebuilt."
