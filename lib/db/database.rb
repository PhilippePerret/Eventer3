require 'sqlite3'
require 'fileutils'

module DB

  DB_FILENAME = 'main.db'

  # Registre global : projets + paramètres app UNIQUEMENT
  SCHEMA = <<~SQL
    CREATE TABLE IF NOT EXISTS project_refs (
      id          TEXT PRIMARY KEY,
      title       TEXT,
      db_path     TEXT,
      folder_path TEXT
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  SQL

  # Données complètes et isolées d'un projet
  PROJECT_SCHEMA = <<~SQL
    CREATE TABLE IF NOT EXISTS listers (
      id         INTEGER PRIMARY KEY,
      type       TEXT,
      nature     TEXT,
      scale      TEXT,
      item_ids   TEXT DEFAULT '[]',
      options    TEXT DEFAULT '{}',
      path       TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS items (
      id         TEXT PRIMARY KEY,
      title      TEXT,
      type       TEXT,
      color      TEXT,
      checked    INTEGER DEFAULT 0,
      duration   INTEGER,
      path       TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS project_meta (
      id           TEXT NOT NULL,
      state        INTEGER DEFAULT 0,
      active       INTEGER DEFAULT 1,
      year         INTEGER,
      lister_id    INTEGER,
      brin_ids     TEXT DEFAULT '[]',
      perso_ids    TEXT DEFAULT '[]',
      link_targets TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS event_props (
      item_id   TEXT PRIMARY KEY REFERENCES items(id),
      lister_id INTEGER DEFAULT NULL,
      state     INTEGER DEFAULT 0,
      brin_ids  TEXT DEFAULT '[]',
      perso_ids TEXT DEFAULT '[]',
      meteo     TEXT,
      effet     TEXT,
      lieu      TEXT,
      dyndate   TEXT,
      is_script INTEGER DEFAULT 0,
      css       TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS brin_props (
      item_id   TEXT PRIMARY KEY REFERENCES items(id),
      badge     TEXT,
      perso_ids TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS perso_props (
      item_id   TEXT PRIMARY KEY REFERENCES items(id),
      badge     TEXT,
      patronyme TEXT,
      avatar    TEXT,
      fonction  TEXT,
      genre     TEXT,
      birthyear INTEGER
    );

    CREATE TABLE IF NOT EXISTS counters (
      item_type  TEXT PRIMARY KEY,
      last_val   INTEGER DEFAULT 0
    );
  SQL

  def self.path(data_dir)
    File.join(data_dir, DB_FILENAME)
  end

  def self.open(data_dir)
    db = SQLite3::Database.new(path(data_dir))
    db.foreign_keys = true
    db
  end

  def self.initialize!(data_dir)
    FileUtils.mkdir_p(data_dir)
    db = open(data_dir)
    db.results_as_hash = true
    SCHEMA.split(';').each do |stmt|
      stmt = stmt.strip
      db.execute(stmt) unless stmt.empty?
    end
    db.close
  end

  def self.open_project(db_path)
    db = SQLite3::Database.new(db_path)
    db.foreign_keys = true
    db
  end

  def self.initialize_project!(db_path)
    FileUtils.mkdir_p(File.dirname(db_path))
    db = open_project(db_path)
    db.results_as_hash = true
    PROJECT_SCHEMA.split(';').each do |stmt|
      stmt = stmt.strip
      db.execute(stmt) unless stmt.empty?
    end
    _migrate_project_db!(db)
    db.close
  end

  # ── Migrations privées ──────────────────────────────────────────

  def self._migrate_project_db!(db)
    # Ajoute project_meta si absent (pour DBs existantes)
    begin
      db.execute("SELECT 1 FROM project_meta LIMIT 1")
    rescue SQLite3::Exception
      db.execute(<<~SQL)
        CREATE TABLE IF NOT EXISTS project_meta (
          id           TEXT NOT NULL,
          state        INTEGER DEFAULT 0,
          active       INTEGER DEFAULT 1,
          year         INTEGER,
          lister_id    INTEGER,
          brin_ids     TEXT DEFAULT '[]',
          perso_ids    TEXT DEFAULT '[]',
          link_targets TEXT DEFAULT '[]'
        )
      SQL
    end
    # Migrations colonnes manquantes
    [
      "ALTER TABLE event_props ADD COLUMN css  TEXT DEFAULT '[]'",
      "ALTER TABLE event_props ADD COLUMN lieu  TEXT",
    ].each do |migration|
      begin
        db.execute(migration)
      rescue SQLite3::Exception => e
        raise unless e.message.include?('duplicate column name')
      end
    end
  end
  private_class_method :_migrate_project_db!

  def self._migrate_project_data_to_eventer!(main_db, proj, data_dir)
    db_path   = proj['db_path']
    full_path = db_path.start_with?('/') ? db_path : File.join(data_dir, db_path)
    return unless File.exist?(full_path)

    proj_db = open_project(full_path)
    proj_db.results_as_hash = true
    _migrate_project_db!(proj_db)

    project_id = proj['item_id']
    brin_ids  = JSON.parse(proj['brin_ids']  || '[]') rescue []
    perso_ids = JSON.parse(proj['perso_ids'] || '[]') rescue []

    # project_meta
    existing_meta = proj_db.execute("SELECT 1 FROM project_meta LIMIT 1").first
    unless existing_meta
      proj_db.execute(
        "INSERT INTO project_meta (id, state, active, year, lister_id, brin_ids, perso_ids) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [project_id, proj['state'].to_i, (proj['active'].nil? ? 1 : proj['active'].to_i),
         proj['year'], proj['lister_id'], JSON.generate(brin_ids), JSON.generate(perso_ids)]
      )
    end

    now = Time.now.strftime('%Y-%m-%dT%H:%M:%S')

    # Brins
    brin_ids.each do |bid|
      next if proj_db.execute("SELECT 1 FROM items WHERE id = ? LIMIT 1", [bid]).first
      brow = main_db.execute("SELECT * FROM items WHERE id = ? LIMIT 1", [bid]).first
      next unless brow
      proj_db.execute(
        "INSERT OR IGNORE INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [bid, brow['title'], brow['type'], brow['color'], brow['checked'].to_i, brow['created_at'] || now, brow['updated_at'] || now]
      )
      bprow = main_db.execute("SELECT * FROM brin_props WHERE item_id = ? LIMIT 1", [bid]).first rescue nil
      if bprow
        proj_db.execute(
          "INSERT OR IGNORE INTO brin_props (item_id, badge, perso_ids) VALUES (?, ?, ?)",
          [bid, bprow['badge'], bprow['perso_ids'] || '[]']
        )
      end
    end

    # Persos
    perso_ids.each do |cid|
      next if proj_db.execute("SELECT 1 FROM items WHERE id = ? LIMIT 1", [cid]).first
      crow = main_db.execute("SELECT * FROM items WHERE id = ? LIMIT 1", [cid]).first
      next unless crow
      proj_db.execute(
        "INSERT OR IGNORE INTO items (id, title, type, color, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cid, crow['title'], crow['type'], crow['color'], crow['checked'].to_i, crow['created_at'] || now, crow['updated_at'] || now]
      )
      pprow = main_db.execute("SELECT * FROM perso_props WHERE item_id = ? LIMIT 1", [cid]).first rescue nil
      if pprow
        proj_db.execute(
          "INSERT OR IGNORE INTO perso_props (item_id, badge, patronyme, avatar, fonction, genre, birthyear) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [cid, pprow['badge'], pprow['patronyme'], pprow['avatar'], pprow['fonction'], pprow['genre'], pprow['birthyear']]
        )
      end
    end

    # Counters
    %w[brin perso].each do |itype|
      crow = main_db.execute("SELECT last_val FROM counters WHERE project_id = ? AND item_type = ? LIMIT 1", [project_id, itype]).first rescue nil
      next unless crow
      proj_db.execute("INSERT OR IGNORE INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)", [project_id, itype, crow['last_val']])
    end

    proj_db.close
  end
  private_class_method :_migrate_project_data_to_eventer!

end
