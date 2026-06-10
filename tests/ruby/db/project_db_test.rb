require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require_relative '../../../lib/db/database'
require_relative '../../../lib/bootstrap'

class ProjectDbTest < Minitest::Test

  def setup
    @data_dir = Dir.mktmpdir('eventer_project_db_test_')
    DB.initialize!(@data_dir)
  end

  def teardown
    FileUtils.rm_rf(@data_dir)
  end

  def test_project_db_created_when_not_exists
    project_path = File.join(@data_dir, 'mon-projet', 'eventer.db')
    refute File.exist?(project_path), "La DB projet ne devrait pas exister avant Bootstrap"

    Bootstrap.ensure_project_data!(@data_dir, 'mon-projet')

    assert File.exist?(project_path), "Bootstrap doit créer data/{project_id}/eventer.db"
  end

  def test_project_db_has_correct_schema
    Bootstrap.ensure_project_data!(@data_dir, 'mon-projet')

    db = DB.open_project(@data_dir, 'mon-projet')
    tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").map { |r| r[0] }
    db.close

    %w[listers items event_props brin_props perso_props counters].each do |table|
      assert_includes tables, table, "La DB projet doit avoir la table '#{table}'"
    end
  end

  def test_project_db_not_recreated_when_exists
    Bootstrap.ensure_project_data!(@data_dir, 'mon-projet')

    db = DB.open_project(@data_dir, 'mon-projet')
    db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES ('e99', 'Event test', '2024-01-01', '2024-01-01')")
    db.close

    Bootstrap.ensure_project_data!(@data_dir, 'mon-projet')

    db = DB.open_project(@data_dir, 'mon-projet')
    row = db.execute("SELECT id FROM items WHERE id = 'e99'").first
    db.close
    assert_equal 'e99', row&.first, "Les données existantes doivent être préservées"
  end

  def test_open_project_opens_correct_file
    Bootstrap.ensure_project_data!(@data_dir, 'mon-projet')

    db = DB.open_project(@data_dir, 'mon-projet')
    expected = File.realpath(File.join(@data_dir, 'mon-projet', 'eventer.db'))
    assert_equal expected, db.filename
    db.close
  end

end
