require 'json'

class FixtureBuilder
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

  def initialize(db_path = '../../data/eventer.db')
    require 'sqlite3'
    require 'fileutils'

    full_path = File.expand_path(db_path, __dir__)
    FileUtils.mkdir_p(File.dirname(full_path))

    @db = SQLite3::Database.new(full_path)
    @db.foreign_keys = true
    ensure_schema
  end

  def ensure_schema
    SCHEMA.split(';').each do |stmt|
      stmt = stmt.strip
      @db.execute(stmt) unless stmt.empty?
    end
  end

  def clear_all
    @db.execute("PRAGMA foreign_keys = OFF")
    %w[counters perso_props brin_props event_props project_props items listers].each do |table|
      @db.execute("DELETE FROM #{table}")
    end
    @db.execute("PRAGMA foreign_keys = ON")
  end

  def create_project(id:, title:, brins: [], **opts)
    now = Time.now.iso8601

    @db.execute(
      "INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      ['projects', 'project', '[]', now, now]
    ) if @db.execute("SELECT COUNT(*) FROM listers WHERE id = 'projects'").first.first == 0

    @db.execute(
      "INSERT INTO items (id, lister_id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, 'projects', title, 'project', now, now]
    )

    @db.execute(
      "INSERT INTO project_props (item_id, active, brin_ids) VALUES (?, ?, ?)",
      [id, opts[:active] != false ? 1 : 0, JSON.generate(brins)]
    )

    update_lister_item_ids('projects', id)
    id
  end

  def create_event(project_id:, id:, title:, brins: [], **opts)
    now = Time.now.iso8601
    events_lister_id = "#{project_id}-events"

    ensure_lister(events_lister_id, 'event', project_id)

    @db.execute(
      "INSERT INTO items (id, lister_id, title, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, events_lister_id, title, 'event', now, now]
    )

    @db.execute(
      "INSERT INTO event_props (item_id, brin_ids) VALUES (?, ?)",
      [id, JSON.generate(brins)]
    )

    update_lister_item_ids(events_lister_id, id)
    update_counter(project_id, 'event', id =~ /^e(\d+)$/ ? $1.to_i : 0)
    id
  end

  def create_brin(id:, title:, badge: nil, color: '#d9c8a9', **opts)
    now = Time.now.iso8601

    @db.execute(
      "INSERT INTO items (id, lister_id, title, type, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, nil, title, 'brin', color, now, now]
    )

    @db.execute(
      "INSERT INTO brin_props (item_id, badge) VALUES (?, ?)",
      [id, badge || title[0..2].upcase]
    )

    id
  end

  def close
    @db.close
  end

  private

  def ensure_lister(lister_id, type, parent_item_id)
    now = Time.now.iso8601
    @db.execute(
      "INSERT OR IGNORE INTO listers (id, type, parent_item_id, item_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [lister_id, type, parent_item_id, '[]', now, now]
    )
  end

  def update_lister_item_ids(lister_id, item_id)
    result = @db.execute("SELECT item_ids FROM listers WHERE id = ?", [lister_id])
    return unless result.first

    ids = JSON.parse(result.first[0])
    ids << item_id unless ids.include?(item_id)
    @db.execute("UPDATE listers SET item_ids = ? WHERE id = ?", [JSON.generate(ids), lister_id])
  end

  def update_counter(project_id, item_type, max_val)
    @db.execute(
      "INSERT OR REPLACE INTO counters (project_id, item_type, last_val) VALUES (?, ?, ?)",
      [project_id, item_type, max_val]
    ) if max_val > 0
  end
end
