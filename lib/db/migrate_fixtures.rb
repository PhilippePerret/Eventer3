#!/usr/bin/env ruby
# Migration des fixtures vers la nouvelle architecture
# Usage: ruby lib/db/migrate_fixtures.rb [dossier]

require 'sqlite3'
require 'json'
require 'fileutils'
require_relative 'database'

def migrate_dir(dir)
  main_path = File.join(dir, 'main.db')
  return unless File.exist?(main_path)

  puts "Migration: #{dir}"
  main_db = SQLite3::Database.new(main_path)
  main_db.results_as_hash = true

  # 1. Crée project_refs si absente
  begin
    main_db.execute(<<~SQL)
      CREATE TABLE IF NOT EXISTS project_refs (
        item_id     TEXT PRIMARY KEY,
        db_path     TEXT,
        folder_path TEXT,
        lister_id   INTEGER
      )
    SQL
  rescue => e
    puts "  project_refs: #{e.message}"
  end

  # 2. Crée listers si structure est l'ancienne (avec columns en trop)
  # Assure app_settings
  begin
    main_db.execute("CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT)")
  rescue => e; end

  # 3. Migre project_props → project_refs
  begin
    rows = main_db.execute("SELECT * FROM project_props")
    rows.each do |pp|
      existing = main_db.execute("SELECT 1 FROM project_refs WHERE item_id = ? LIMIT 1", [pp['item_id']]).first
      next if existing
      main_db.execute(
        "INSERT INTO project_refs (item_id, db_path, folder_path) VALUES (?, ?, ?)",
        [pp['item_id'], pp['db_path'], pp['folder_path']]
      )
      puts "  project_refs: #{pp['item_id']}"
    end
  rescue => e
    puts "  project_props migration skipped: #{e.message}"
  end

  # 4. Pour chaque projet, migre brins/persos vers eventer.db
  begin
    projects = main_db.execute("SELECT pr.item_id, pr.db_path, pp.state, pp.active, pp.year, pp.lister_id, pp.brin_ids, pp.perso_ids FROM project_refs pr LEFT JOIN project_props pp ON pp.item_id = pr.item_id WHERE pr.db_path IS NOT NULL AND pr.db_path != ''")
    projects.each do |proj|
      migrate_project(main_db, proj, dir)
    end
  rescue => e
    puts "  project migration error: #{e.message}"
  end

  # 5. Met à jour lister_id dans project_refs depuis project_meta
  begin
    main_db.execute("SELECT item_id, db_path FROM project_refs").each do |ref|
      next unless ref['db_path'] && !ref['db_path'].strip.empty?
      ev_path = ref['db_path'].start_with?('/') ? ref['db_path'] : File.join(dir, ref['db_path'])
      next unless File.exist?(ev_path)
      ev_db = SQLite3::Database.new(ev_path)
      ev_db.results_as_hash = true
      begin
        meta = ev_db.execute("SELECT lister_id FROM project_meta LIMIT 1").first
        if meta && meta['lister_id']
          main_db.execute("UPDATE project_refs SET lister_id = ? WHERE item_id = ?", [meta['lister_id'], ref['item_id']])
        end
      rescue => e
      ensure
        ev_db.close
      end
    end
  rescue => e
    puts "  lister_id sync error: #{e.message}"
  end

  main_db.close
  puts "  OK"
end

def migrate_project(main_db, proj, dir)
  db_path   = proj['db_path']
  full_path = db_path.start_with?('/') ? db_path : File.join(dir, db_path)
  return unless File.exist?(full_path)

  project_id = proj['item_id']
  brin_ids   = JSON.parse(proj['brin_ids']  || '[]') rescue []
  perso_ids  = JSON.parse(proj['perso_ids'] || '[]') rescue []

  ev_db = SQLite3::Database.new(full_path)
  ev_db.results_as_hash = true

  # Assure PROJECT_SCHEMA
  DB::PROJECT_SCHEMA.split(';').each do |stmt|
    stmt = stmt.strip
    ev_db.execute(stmt) unless stmt.empty?
  rescue => e
  end

  # Migrations colonnes
  [
    "ALTER TABLE event_props ADD COLUMN css  TEXT DEFAULT '[]'",
    "ALTER TABLE event_props ADD COLUMN lieu  TEXT",
  ].each do |m|
    begin
      ev_db.execute(m)
    rescue SQLite3::Exception => e
      raise unless e.message.include?('duplicate column name')
    end
  end

  now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

  # project_meta
  existing_meta = ev_db.execute("SELECT 1 FROM project_meta LIMIT 1").first
  unless existing_meta
    lister_id = proj['lister_id']
    # Essaye de récupérer le lister_id depuis eventer.db si pas dispo
    if lister_id.nil?
      lr = ev_db.execute("SELECT id FROM listers WHERE type = 'events' LIMIT 1").first rescue nil
      lister_id = lr ? lr['id'] : nil
    end
    ev_db.execute(
      "INSERT INTO project_meta (id, state, active, year, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [project_id,
       proj['state'].to_i,
       (proj['active'].nil? ? 1 : proj['active'].to_i),
       proj['year'],
       lister_id,
       JSON.generate(brin_ids),
       JSON.generate(perso_ids)]
    )
    puts "  project_meta créée pour #{project_id}"
  end

  # Brins
  brin_ids.each do |bid|
    next if ev_db.execute("SELECT 1 FROM items WHERE id = ? LIMIT 1", [bid]).first
    brow = main_db.execute("SELECT * FROM items WHERE id = ? LIMIT 1", [bid]).first rescue nil
    next unless brow
    ev_db.execute(
      "INSERT OR IGNORE INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [bid, brow['title'], brow['type'], brow['color'], brow['checked'].to_i, brow['created_at'] || now, brow['updated_at'] || now]
    )
    bprow = main_db.execute("SELECT * FROM brin_props WHERE item_id = ? LIMIT 1", [bid]).first rescue nil
    if bprow
      ev_db.execute(
        "INSERT OR IGNORE INTO brin_props (item_id, badge, perso_ids) VALUES (?, ?, ?)",
        [bid, bprow['badge'], bprow['perso_ids'] || '[]']
      )
    end
    puts "  brin #{bid} → eventer.db"
  end

  # Persos
  perso_ids.each do |cid|
    next if ev_db.execute("SELECT 1 FROM items WHERE id = ? LIMIT 1", [cid]).first
    crow = main_db.execute("SELECT * FROM items WHERE id = ? LIMIT 1", [cid]).first rescue nil
    next unless crow
    ev_db.execute(
      "INSERT OR IGNORE INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cid, crow['title'], crow['type'], crow['color'], crow['checked'].to_i, crow['created_at'] || now, crow['updated_at'] || now]
    )
    pprow = main_db.execute("SELECT * FROM perso_props WHERE item_id = ? LIMIT 1", [cid]).first rescue nil
    if pprow
      ev_db.execute(
        "INSERT OR IGNORE INTO perso_props (item_id, badge, patronyme, avatar, fonction, genre, birthyear) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cid, pprow['badge'], pprow['patronyme'], pprow['avatar'], pprow['fonction'], pprow['genre'], pprow['birthyear']]
      )
    end
    puts "  perso #{cid} → eventer.db"
  end

  # Counters brins/persos
  %w[brin perso].each do |itype|
    crow = main_db.execute("SELECT last_val FROM counters WHERE project_id = ? AND item_type = ? LIMIT 1", [project_id, itype]).first rescue nil
    next unless crow
    ev_db.execute("INSERT OR IGNORE INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [project_id, itype, crow['last_val']])
  end

  ev_db.close
end

# Point d'entrée
base = ARGV[0] || File.expand_path('../../tests', __dir__)
dirs = Dir.glob(File.join(base, '**', 'main.db')).map { |f| File.dirname(f) }.uniq

# Aussi migrer data/ si présent
data_dir = File.expand_path('../../data', __dir__)
dirs << data_dir if File.exist?(File.join(data_dir, 'main.db'))

dirs.each { |d| migrate_dir(d) }
puts "\nMigration terminée."
