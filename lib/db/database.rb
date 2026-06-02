require 'sqlite3'
require 'fileutils'

module DB

  DB_FILENAME = 'eventer.db'

  SCHEMA = <<~SQL
    CREATE TABLE IF NOT EXISTS listers (
      id              TEXT PRIMARY KEY,
      type            TEXT,
      nature          TEXT,
      scale           TEXT,
      item_ids        TEXT DEFAULT '[]',
      options         TEXT DEFAULT '{}',
      path            TEXT,
      parent_item_id  TEXT REFERENCES items(id),
      created_at      TEXT,
      updated_at      TEXT
    );

    CREATE TABLE IF NOT EXISTS items (
      id          TEXT PRIMARY KEY,
      lister_id   TEXT REFERENCES listers(id),
      title       TEXT,
      type        TEXT,
      color       TEXT,
      checked     INTEGER DEFAULT 0,
      duration    INTEGER,
      path        TEXT,
      depth       INTEGER DEFAULT 0,
      created_at  TEXT,
      updated_at  TEXT
    );

    CREATE TABLE IF NOT EXISTS project_props (
      item_id  TEXT PRIMARY KEY REFERENCES items(id),
      state    INTEGER DEFAULT 0,
      active   INTEGER DEFAULT 1,
      year     INTEGER,
      brin_ids TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS event_props (
      item_id   TEXT PRIMARY KEY REFERENCES items(id),
      state     INTEGER DEFAULT 0,
      brin_ids  TEXT DEFAULT '[]',
      perso_ids TEXT DEFAULT '[]',
      meteo     TEXT,
      effet     TEXT,
      dyndate   TEXT,
      is_script INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS brin_props (
      item_id   TEXT PRIMARY KEY REFERENCES items(id),
      badge     TEXT,
      perso_ids TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS perso_props (
      item_id    TEXT PRIMARY KEY REFERENCES items(id),
      badge      TEXT,
      patronyme  TEXT,
      avatar     TEXT,
      fonction   TEXT,
      genre      TEXT,
      birthyear  INTEGER
    );

    CREATE TABLE IF NOT EXISTS counters (
      project_id  TEXT NOT NULL REFERENCES items(id),
      item_type   TEXT NOT NULL,
      last_val    INTEGER DEFAULT 0,
      PRIMARY KEY (project_id, item_type)
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
    SCHEMA.split(';').each do |stmt|
      stmt = stmt.strip
      db.execute(stmt) unless stmt.empty?
    end
    db.close
  end

end
