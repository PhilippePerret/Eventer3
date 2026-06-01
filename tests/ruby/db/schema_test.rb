require 'minitest/autorun'
require 'fileutils'
require 'tmpdir'
require 'sqlite3'
require_relative '../../../lib/bootstrap'

class SchemaTest < Minitest::Test

  EXPECTED_TABLES = %w[listers items project_props event_props brin_props perso_props counters].freeze

  def setup
    @test_dir = Dir.mktmpdir('eventer_test_')
  end

  def teardown
    FileUtils.rm_rf(@test_dir)
  end

  def test_bootstrap_cree_la_base_sqlite
    Bootstrap.ensure_initial_data!(@test_dir)
    assert File.exist?(db_path), "La base SQLite doit exister dans #{@test_dir}"
  end

  def test_base_contient_toutes_les_tables
    Bootstrap.ensure_initial_data!(@test_dir)
    tables = open_db { |db| db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").flatten }
    EXPECTED_TABLES.each do |table|
      assert_includes tables, table, "La table '#{table}' doit exister"
    end
  end

  private

  def db_path
    File.join(@test_dir, 'eventer.db')
  end

  def open_db
    db = SQLite3::Database.new(db_path)
    result = yield db
    db.close
    result
  end

end
