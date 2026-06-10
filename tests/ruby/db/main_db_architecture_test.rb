require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require_relative '../../../lib/db/database'
require_relative '../../../lib/bootstrap'

class MainDbArchitectureTest < Minitest::Test

  def setup
    @data_dir = Dir.mktmpdir('eventer_main_db_test_')
    DB.initialize!(@data_dir)
  end

  def teardown
    FileUtils.rm_rf(@data_dir)
  end

  def test_main_db_filename_is_main_db
    assert DB.path(@data_dir).end_with?('main.db'),
      "DB principale doit s'appeler main.db, pas #{File.basename(DB.path(@data_dir))}"
  end

  def test_project_props_has_db_path_column
    db = DB.open(@data_dir)
    cols = db.execute("PRAGMA table_info(project_props)").map { |r| r[1] }
    db.close
    assert_includes cols, 'db_path', "project_props doit avoir colonne db_path"
  end

  def test_project_props_has_folder_path_column
    db = DB.open(@data_dir)
    cols = db.execute("PRAGMA table_info(project_props)").map { |r| r[1] }
    db.close
    assert_includes cols, 'folder_path', "project_props doit avoir colonne folder_path"
  end

  def test_open_project_takes_direct_path
    db_path = File.join(@data_dir, 'roman-1', 'eventer.db')
    DB.initialize_project!(db_path)

    db = DB.open_project(db_path)
    assert db.is_a?(SQLite3::Database)
    db.close
  end

  def test_initialize_project_creates_db_at_any_path
    db_path = File.join(@data_dir, 'sous', 'dossier', 'quelconque', 'eventer.db')

    DB.initialize_project!(db_path)

    assert File.exist?(db_path), "DB projet doit être créée à #{db_path}"
    db = DB.open_project(db_path)
    tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").map { |r| r[0] }
    db.close
    %w[listers items event_props brin_props perso_props counters].each do |t|
      assert_includes tables, t, "DB projet doit avoir table #{t}"
    end
  end

  def test_ensure_project_data_takes_direct_path
    db_path = File.join(@data_dir, 'roman-1', 'eventer.db')

    Bootstrap.ensure_project_data!(db_path)

    assert File.exist?(db_path), "ensure_project_data! doit créer la DB au chemin fourni"
  end

  def test_ensure_project_data_idempotent
    db_path = File.join(@data_dir, 'roman-1', 'eventer.db')
    Bootstrap.ensure_project_data!(db_path)

    db = DB.open_project(db_path)
    db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES ('e99', 'Test', '2024-01-01', '2024-01-01')")
    db.close

    Bootstrap.ensure_project_data!(db_path)

    db = DB.open_project(db_path)
    row = db.execute("SELECT id FROM items WHERE id = 'e99'").first
    db.close
    assert_equal 'e99', row&.first, "ensure_project_data! ne doit pas effacer les données existantes"
  end

end
