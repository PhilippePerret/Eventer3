require 'minitest/autorun'
require 'rack/test'
require 'fileutils'
require 'tmpdir'
require 'json'

ENV['RACK_ENV'] = 'test'
ENV['EVENTER_DATA_DIR'] = Dir.mktmpdir('eventer_routes_project_test_')
require_relative '../../../app'

class ApiRoutesProjectDbTest < Minitest::Test
  include Rack::Test::Methods

  def app = Sinatra::Application

  def setup
    @data_dir = ENV['EVENTER_DATA_DIR']
    @project_id = 'roman-1'
    @db_path = File.join(@data_dir, @project_id, 'eventer.db')

    Bootstrap.ensure_initial_data!(@data_dir)

    main_db = DB.open(@data_dir)
    main_db.results_as_hash = true
    now = '2024-01-01T00:00:00'
    main_db.execute("INSERT OR REPLACE INTO items (id, title, created_at, updated_at) VALUES (?, 'Roman 1', ?, ?)", [@project_id, now, now])
    main_db.execute("INSERT OR REPLACE INTO project_props (item_id, db_path) VALUES (?, ?)", [@project_id, @db_path])
    main_db.close

    Bootstrap.ensure_project_data!(@db_path)

    db = DB.open_project(@db_path)
    db.execute("INSERT OR IGNORE INTO listers (id, type, item_ids, created_at, updated_at) VALUES (10, 'events', '[\"e1\",\"e2\"]', ?, ?)", [now, now])
    db.execute("INSERT OR REPLACE INTO items (id, title, created_at, updated_at) VALUES ('e1', 'Premier event', ?, ?)", [now, now])
    db.execute("INSERT OR REPLACE INTO items (id, title, created_at, updated_at) VALUES ('e2', 'Deuxième event', ?, ?)", [now, now])
    db.execute("INSERT OR IGNORE INTO event_props (item_id) VALUES ('e1')")
    db.execute("INSERT OR IGNORE INTO event_props (item_id) VALUES ('e2')")
    db.close
  end

  def test_get_lister_with_project_id
    get "/api/listers/10?project_id=#{@project_id}"
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_includes data['item_ids'], 'e1'
    assert_includes data['item_ids'], 'e2'
  end

  def test_get_lister_items_with_project_id
    get "/api/listers/10/items?project_id=#{@project_id}"
    assert_equal 200, last_response.status, "GET items doit retourner 200"
    data = JSON.parse(last_response.body)
    assert_equal 'Premier event',  data.dig('e1', 'title')
    assert_equal 'Deuxième event', data.dig('e2', 'title')
  end

  def test_patch_item_with_project_id
    patch "/api/items/e1?project_id=#{@project_id}",
          JSON.generate({ title: 'Modifié' }),
          'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status

    get "/api/listers/10/items?project_id=#{@project_id}"
    assert_equal 200, last_response.status, "GET items après PATCH doit retourner 200"
    data = JSON.parse(last_response.body)
    assert_equal 'Modifié', data.dig('e1', 'title')
  end

  def test_post_item_with_project_id
    post "/api/listers/10/items?project_id=#{@project_id}",
         JSON.generate({ title: 'Nouvel event', type: 'event' }),
         'CONTENT_TYPE' => 'application/json'
    assert_equal 201, last_response.status
    data = JSON.parse(last_response.body)
    refute_nil data['id']

    get "/api/listers/10/items?project_id=#{@project_id}"
    items = JSON.parse(last_response.body)
    assert_includes items.keys, data['id']
  end

end
