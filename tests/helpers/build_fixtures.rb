#!/usr/bin/env ruby
require 'json'
require 'sqlite3'
require_relative '../../lib/db/database'

FIXTURES_DIR = File.expand_path('../fixtures', __dir__)

ITEM_TYPE_FOR = {
  'projects' => 'project',
  'events'   => 'event',
  'brins'    => 'brin',
  'persos'   => 'perso'
}

ID_PREFIX_FOR = {
  'event' => 'e',
  'brin'  => 'b',
  'perso' => 'p'
}

def ts
  Time.now.strftime('%Y-%m-%dT%H:%M:%S')
end

def insert_lister(db, id:, type:, parent_item_id: nil, item_ids: [])
  db.execute(
    "INSERT OR IGNORE INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, type, parent_item_id, JSON.generate(item_ids), ts, ts]
  )
end

def insert_item(db, id:, lister_id:, type:, data: {})
  db.execute(
    "INSERT OR IGNORE INTO items (id, lister_id, title, type, color, checked, duration, depth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, lister_id, data['tt'] || id, type, data['co'], data['ch'] ? 1 : 0, data['du'], 1, ts, ts]
  )
  case type
  when 'project'
    db.execute("INSERT OR IGNORE INTO project_props (item_id, active) VALUES (?, ?)",
      [id, data['ac'] == false ? 0 : 1])
  when 'event'
    db.execute("INSERT OR IGNORE INTO event_props (item_id, brin_ids) VALUES (?, ?)",
      [id, JSON.generate(data['bi'] || [])])
  when 'brin'
    db.execute("INSERT OR IGNORE INTO brin_props (item_id, badge) VALUES (?, ?)",
      [id, data['bg'] || ''])
  when 'perso'
    db.execute("INSERT OR IGNORE INTO perso_props (item_id, badge) VALUES (?, ?)",
      [id, data['bg'] || ''])
  end
end

def process_events_lister(db, lister_id:, dir:, parent_item_id:, item_ids:)
  insert_lister(db, id: lister_id, type: 'events', parent_item_id: parent_item_id, item_ids: item_ids)

  items_data = File.exist?(File.join(dir, '__items.json')) ? JSON.parse(File.read(File.join(dir, '__items.json'))) : {}
  max_val = 0

  item_ids.each do |item_id|
    insert_item(db, id: item_id, lister_id: lister_id, type: 'event', data: items_data[item_id] || {})
    max_val = [$1.to_i, max_val].max if item_id =~ /^e(\d+)$/

    child_dir  = File.join(dir, "lof-#{item_id}")
    child_file = File.join(dir, "lof-#{item_id}.json")
    next unless File.exist?(child_dir)

    child_data     = File.exist?(child_file) ? JSON.parse(File.read(child_file)) : {}
    child_item_ids = child_data['item_ids'] || []
    process_events_lister(db, lister_id: "#{item_id}-events", dir: child_dir,
                          parent_item_id: item_id, item_ids: child_item_ids)
  end

  db.execute(
    "INSERT OR REPLACE INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)",
    [parent_item_id, 'event', max_val]
  ) if max_val > 0
end

def process_typed_lister(db, lister_id:, type:, dir:, parent_item_id:, item_ids:, filename:)
  insert_lister(db, id: lister_id, type: type, parent_item_id: parent_item_id, item_ids: item_ids)
  item_type = ITEM_TYPE_FOR[type]
  prefix    = ID_PREFIX_FOR[item_type]
  file      = File.join(dir, filename)
  return unless File.exist?(file)

  data    = JSON.parse(File.read(file))
  max_val = 0
  item_ids.each do |item_id|
    insert_item(db, id: item_id, lister_id: lister_id, type: item_type, data: data[item_id] || {})
    max_val = [$1.to_i, max_val].max if prefix && item_id =~ /^#{prefix}(\d+)$/
  end
  db.execute(
    "INSERT OR REPLACE INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)",
    [parent_item_id, item_type, max_val]
  ) if max_val > 0
end

# ---- Main ----

Dir.glob(File.join(FIXTURES_DIR, '*')).select { |d| File.directory?(d) }.sort.each do |fixture_dir|
  name    = File.basename(fixture_dir)
  db_path = File.join(fixture_dir, 'eventer.db')

  File.delete(db_path) if File.exist?(db_path)
  DB.initialize!(fixture_dir)

  root_file = File.join(fixture_dir, 'lof-projects.json')
  unless File.exist?(root_file)
    puts "skip #{name} (no lof-projects.json)"
    next
  end

  root_data    = JSON.parse(File.read(root_file))
  project_ids  = root_data['item_ids'] || []
  projects_dir = File.join(fixture_dir, 'lof-projects')
  projects_items_file = File.join(projects_dir, '__items.json')
  projects_data = File.exist?(projects_items_file) ? JSON.parse(File.read(projects_items_file)) : {}

  db = SQLite3::Database.new(db_path)
  db.results_as_hash = true
  db.foreign_keys = true

  db.transaction do
    insert_lister(db, id: 'projects', type: 'projects', item_ids: project_ids)

    project_ids.each do |project_id|
      insert_item(db, id: project_id, lister_id: 'projects', type: 'project', data: projects_data[project_id] || {})

      project_dir  = File.join(projects_dir, "lof-#{project_id}")
      project_file = File.join(projects_dir, "lof-#{project_id}.json")
      next unless File.exist?(project_dir) || File.exist?(project_file)

      lister_data = File.exist?(project_file) ? JSON.parse(File.read(project_file)) : {}
      event_ids   = lister_data['item_ids']  || []
      brin_ids    = lister_data['brin_ids']  || []
      perso_ids   = lister_data['perso_ids'] || []

      process_events_lister(db, lister_id: "#{project_id}-events", dir: project_dir,
                            parent_item_id: project_id, item_ids: event_ids)

      if File.exist?(File.join(project_dir, '__brins.json')) || !brin_ids.empty?
        process_typed_lister(db, lister_id: "#{project_id}-brins", type: 'brins',
                             dir: project_dir, parent_item_id: project_id,
                             item_ids: brin_ids, filename: '__brins.json')
      end

      if File.exist?(File.join(project_dir, '__persos.json')) || !perso_ids.empty?
        process_typed_lister(db, lister_id: "#{project_id}-persos", type: 'persos',
                             dir: project_dir, parent_item_id: project_id,
                             item_ids: perso_ids, filename: '__persos.json')
      end
    end
  end

  db.close
  puts "Built: fixtures/#{name}/eventer.db"
end
