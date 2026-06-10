require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require_relative '../../../lib/db/database'
require_relative '../../../lib/db/repo'
require_relative '../../../lib/bootstrap'

class RepoProjectDbTest < Minitest::Test

  def setup
    @data_dir = Dir.mktmpdir('eventer_repo_project_test_')
    DB.initialize!(@data_dir)
    Bootstrap.ensure_project_data!(@data_dir, 'roman-1')

    db = DB.open_project(@data_dir, 'roman-1')
    now = '2024-01-01T00:00:00'
    db.execute("INSERT INTO listers (id, type, item_ids, created_at, updated_at) VALUES (1, 'events', '[\"e1\",\"e2\"]', ?, ?)", [now, now])
    db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES ('e1', 'Premier event', ?, ?)", [now, now])
    db.execute("INSERT INTO items (id, title, created_at, updated_at) VALUES ('e2', 'Deuxième event', ?, ?)", [now, now])
    db.execute("INSERT INTO event_props (item_id) VALUES ('e1')")
    db.execute("INSERT INTO event_props (item_id) VALUES ('e2')")
    db.close
  end

  def teardown
    FileUtils.rm_rf(@data_dir)
  end

  def test_find_lister_by_id_uses_project_db
    lister = DB::Repo.find_lister_by_id(@data_dir, 1, project_id: 'roman-1')
    refute_nil lister
    assert_includes lister[:item_ids], 'e1'
    assert_includes lister[:item_ids], 'e2'
  end

  def test_find_items_by_lister_id_uses_project_db
    items = DB::Repo.find_items_by_lister_id(@data_dir, 1, project_id: 'roman-1')
    assert_equal 'Premier event', items['e1']['title']
    assert_equal 'Deuxième event', items['e2']['title']
  end

  def test_create_item_uses_project_db
    item = DB::Repo.create_item(@data_dir, 1, { 'title' => 'Nouvel event', 'type' => 'event' }, project_id: 'roman-1')
    refute_nil item
    refute_nil item['id']

    items = DB::Repo.find_items_by_lister_id(@data_dir, 1, project_id: 'roman-1')
    assert_includes items.keys, item['id']
    assert_equal 'Nouvel event', items[item['id']]['title']
  end

  def test_update_item_uses_project_db
    DB::Repo.update_item(@data_dir, 'e1', { 'title' => 'Modifié' }, project_id: 'roman-1')

    items = DB::Repo.find_items_by_lister_id(@data_dir, 1, project_id: 'roman-1')
    assert_equal 'Modifié', items['e1']['title']
  end

  def test_find_lister_by_id_without_project_id_uses_main_db
    DB.seed!(@data_dir)
    lister = DB::Repo.find_lister_by_id(@data_dir, 1)
    refute_nil lister
  end

end
