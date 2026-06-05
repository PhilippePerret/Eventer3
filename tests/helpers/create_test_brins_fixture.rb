$LOAD_PATH.unshift File.expand_path('../../../lib', __FILE__)
require_relative '../../lib/db/database'

DATA_DIR = File.expand_path('../../../data', __FILE__)

db_path = DB.path(DATA_DIR)
File.delete(db_path) if File.exist?(db_path)

DB.initialize!(DATA_DIR)

db = DB.open(DATA_DIR)
db.results_as_hash = true

now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

db.transaction do
  # Listers
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [1, 'projects', '["test-brins"]', now, now])
  db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [2, 'events', '["e1","e3","e2"]', now, now])

  # Project item
  db.execute("INSERT INTO items (id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ['test-brins', 'Projet Brins Test', 'roman', now, now])

  # Event items
  [['e1','Event 1'],['e2','Event 2'],['e3','Event 3']].each do |id, title|
    db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [id, title, now, now])
  end

  # Brin items
  brins = [
    ['b1', 'Brin A', 'intrigue',    '#e74c3c'],
    ['b2', 'Brin B', 'accessoire',  '#2ecc71'],
    ['b3', 'Brin C', 'personnage',  '#3498db'],
    ['b4', 'Brin D', 'enquête',     '#f1c40f'],
  ]
  brins.each do |id, title, type, color|
    db.execute("INSERT INTO items (id, title, type, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, type, color, now, now])
  end

  # project_props
  db.execute("INSERT INTO project_props (item_id, state, active, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?)",
    ['test-brins', 0, 1, 2, '["b1","b2","b3","b4"]', '[]'])

  # event_props
  db.execute("INSERT INTO event_props (item_id, lister_id, brin_ids) VALUES (?, ?, ?)",
    ['e1', nil, '["b1","b2"]'])
  db.execute("INSERT INTO event_props (item_id, lister_id, brin_ids) VALUES (?, ?, ?)",
    ['e2', nil, '["b2","b3"]'])
  db.execute("INSERT INTO event_props (item_id, lister_id, brin_ids) VALUES (?, ?, ?)",
    ['e3', nil, '[]'])

  # brin_props
  [['b1','BRA'],['b2','BRB'],['b3','BRC'],['b4','BRD']].each do |id, badge|
    db.execute("INSERT INTO brin_props (item_id, badge) VALUES (?, ?)", [id, badge])
  end

  # counters
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['test-brins', 'event', 3])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['test-brins', 'brin',  4])
  db.execute("INSERT INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", ['test-brins', 'perso', 0])
end

db.close
