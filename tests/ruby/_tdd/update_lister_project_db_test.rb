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
    Bootstrap.ensure_initial_data!(@data_dir)
    Bootstrap.ensure_project_data!(@data_dir, 'roman-1')

    db = DB.open_project(@data_dir, 'roman-1')
    now = '2024-01-01T00:00:00'
    db.execute("INSERT OR IGNORE INTO listers (id, type, item_ids, created_at, updated_at) VALUES (10, 'events', '[\"e1\",\"e2\"]', ?, ?)", [now, now])
    db.execute("INSERT OR REPLACE INTO listers (id, type, item_ids, created_at, updated_at) VALUES (10, 'events', '[\"e1\",\"e2\"]', ?, ?)", [now, now])
    db.close
  end

  def test_patch_lister_updates_item_ids_in_project_db
    patch '/api/listers/10?project_id=roman-1',
          JSON.generate({ item_ids: ['e2', 'e1'] }),
          'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status

    get '/api/listers/10?project_id=roman-1'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_equal ['e2', 'e1'], data['item_ids']
  end

end
