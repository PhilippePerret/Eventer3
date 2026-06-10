require 'minitest/autorun'
require 'rack/test'
require 'tmpdir'
require 'fileutils'
require 'json'

ENV['RACK_ENV'] = 'test'
ENV['EVENTER_DATA_DIR'] ||= Dir.mktmpdir('eventer_ul_project_test_')
require_relative '../../../app'

class UpdateListerProjectDbTest < Minitest::Test
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
    now = '2024-01-01T00:00:00'
    db.execute("INSERT OR REPLACE INTO listers (id, type, item_ids, created_at, updated_at) VALUES (10, 'events', '[\"e1\",\"e2\"]', ?, ?)", [now, now])
    db.close
  end

  def test_patch_lister_updates_item_ids_in_project_db
    patch "/api/listers/10?project_id=#{@project_id}",
          JSON.generate({ item_ids: ['e2', 'e1'] }),
          'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status

    get "/api/listers/10?project_id=#{@project_id}"
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_equal ['e2', 'e1'], data['item_ids']
  end

end
