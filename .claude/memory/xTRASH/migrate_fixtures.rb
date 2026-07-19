#!/usr/bin/env ruby
# One-shot: crée les per-project DBs pour chaque fixture.
# Copie events + listers de main.db vers {project_id}/eventer.db
# Met à jour project_props.db_path avec chemin relatif.

require 'sqlite3'
require 'json'
require 'fileutils'
require 'set'

FIXTURES_DIR = File.expand_path('tests/fixtures', __dir__)

# Extraire PROJECT_SCHEMA de database.rb
db_source = File.read(File.expand_path('lib/db/database.rb', __dir__))
PROJECT_SQL = db_source.match(/PROJECT_SCHEMA\s*=\s*<<~SQL\n(.*?)\n\s*SQL/m)&.captures&.first
abort "ERROR: impossible d'extraire PROJECT_SCHEMA" unless PROJECT_SQL

def open_db(path)
  db = SQLite3::Database.new(path)
  db.results_as_hash = true
  db
end

def apply_migrations(db)
  [
    "ALTER TABLE event_props ADD COLUMN css  TEXT DEFAULT '[]'",
    "ALTER TABLE event_props ADD COLUMN lieu  TEXT",
    "ALTER TABLE project_props ADD COLUMN db_path     TEXT",
    "ALTER TABLE project_props ADD COLUMN folder_path TEXT",
  ].each do |sql|
    begin
      db.execute(sql)
    rescue SQLite3::Exception => e
      raise unless e.message.include?('duplicate column name')
    end
  end
end

def create_project_db(path)
  FileUtils.mkdir_p(File.dirname(path))
  FileUtils.rm_f(path)
  db = SQLite3::Database.new(path)
  db.results_as_hash = true
  PROJECT_SQL.split(';').each do |stmt|
    s = stmt.strip
    db.execute(s) unless s.empty?
  end
  db
end

def collect_event_lister_ids(main_db, root_lister_id)
  visited = Set.new
  queue   = [root_lister_id.to_i]
  until queue.empty?
    lid = queue.shift
    next if visited.include?(lid)
    visited.add(lid)
    row = main_db.execute("SELECT item_ids FROM listers WHERE id = ?", [lid]).first
    next unless row
    JSON.parse(row['item_ids'] || '[]').each do |item_id|
      ep = main_db.execute("SELECT lister_id FROM event_props WHERE item_id = ?", [item_id]).first
      if ep && ep['lister_id'] && !ep['lister_id'].to_s.strip.empty?
        queue << ep['lister_id'].to_i
      end
    end
  end
  visited.to_a
end

def migrate_fixture(fixture_path)
  main_db_path = File.join(fixture_path, 'main.db')
  return unless File.exist?(main_db_path) && File.size(main_db_path) > 0

  main_db = open_db(main_db_path)

  begin
    apply_migrations(main_db)
  rescue => e
    puts "  WARN migrations: #{e.message}"
  end

  pp_rows = begin
    main_db.execute("SELECT * FROM project_props")
  rescue SQLite3::Exception
    puts "  pas de project_props, skip"
    main_db.close
    return
  end

  pp_rows.each do |pp|
    project_id = pp['item_id']
    lister_id  = pp['lister_id']

    rel_path  = "#{project_id}/eventer.db"
    proj_path = File.join(fixture_path, rel_path)
    proj_db   = create_project_db(proj_path)

    if lister_id && !lister_id.to_s.strip.empty?
      lister_ids   = collect_event_lister_ids(main_db, lister_id)
      all_item_ids = []
      lister_ids.each do |lid|
        row = main_db.execute("SELECT item_ids FROM listers WHERE id = ?", [lid]).first
        all_item_ids += JSON.parse(row['item_ids'] || '[]') if row
      end
      all_item_ids.uniq!

      lister_ids.each do |lid|
        row = main_db.execute("SELECT * FROM listers WHERE id = ?", [lid]).first
        next unless row
        proj_db.execute(
          "INSERT OR IGNORE INTO listers (id, type, nature, scale, item_ids, options, path, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
          [row['id'], row['type'], row['nature'], row['scale'],
           row['item_ids'], row['options'], row['path'],
           row['created_at'], row['updated_at']]
        )
      end

      all_item_ids.each do |iid|
        item = main_db.execute("SELECT * FROM items WHERE id = ?", [iid]).first
        next unless item
        proj_db.execute(
          "INSERT OR IGNORE INTO items (id, title, type, color, checked, duration, path, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
          [item['id'], item['title'], item['type'], item['color'],
           item['checked'], item['duration'], item['path'],
           item['created_at'], item['updated_at']]
        )
        ep = main_db.execute("SELECT * FROM event_props WHERE item_id = ?", [iid]).first
        if ep
          proj_db.execute(
            "INSERT OR IGNORE INTO event_props (item_id, lister_id, state, brin_ids, perso_ids, meteo, effet, lieu, dyndate, is_script, css) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [ep['item_id'], ep['lister_id'], ep['state'],
             ep['brin_ids'], ep['perso_ids'],
             ep['meteo'], ep['effet'], ep['lieu'],
             ep['dyndate'], ep['is_script'], ep['css'] || '[]']
          )
        end
      end

      puts "  #{project_id} → #{rel_path} (#{lister_ids.size} lister(s), #{all_item_ids.size} events)"
    else
      puts "  #{project_id} → #{rel_path} (DB vide — pas de lister events)"
    end

    proj_db.close
    main_db.execute("UPDATE project_props SET db_path = ? WHERE item_id = ?", [rel_path, project_id])
  end

  main_db.close
end

Dir.glob(File.join(FIXTURES_DIR, '*')).sort.each do |fixture_path|
  next unless File.directory?(fixture_path)
  name = File.basename(fixture_path)
  puts "=== #{name} ==="
  migrate_fixture(fixture_path)
end

puts "\nTerminé."
