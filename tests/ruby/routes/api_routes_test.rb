require 'minitest/autorun'
require 'rack/test'
require 'fileutils'
require 'tmpdir'
require 'json'

ENV['RACK_ENV']        = 'test'
ENV['EVENTER_DATA_DIR'] = Dir.mktmpdir('eventer_routes_test_')
require_relative '../../../app'
Bootstrap.ensure_initial_data!(ENV['EVENTER_DATA_DIR'])

class ApiRoutesTest < Minitest::Test
  include Rack::Test::Methods

  def app = Sinatra::Application

  def test_get_lister
    get '/api/listers/projects'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_includes data['item_ids'], 'demo-projet'
  end

  def test_get_lister_inexistant
    get '/api/listers/inexistant'
    assert_equal 404, last_response.status
  end

  def test_get_items
    get '/api/listers/projects/items'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_equal 'Projet démo', data['demo-projet']['title']
  end

  def test_patch_item
    patch '/api/items/e1', JSON.generate({ title: 'Modifié' }), 'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status
    get '/api/listers/demo-projet-events/items'
    data = JSON.parse(last_response.body)
    assert_equal 'Modifié', data['e1']['title']
  end

  def test_post_item
    post '/api/listers/demo-projet-events/items',
         JSON.generate({ title: 'Nouvel event', type: 'event' }),
         'CONTENT_TYPE' => 'application/json'
    assert_equal 201, last_response.status
    data = JSON.parse(last_response.body)
    refute_nil data['id']
  end

  def test_get_item_lister
    get '/api/items/demo-projet/lister'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_includes data['item_ids'], 'e1'
  end

  def test_get_item_lister_inexistant
    get '/api/items/inexistant/lister'
    assert_equal 404, last_response.status
  end

  def test_patch_lister
    patch '/api/listers/projects', JSON.generate({ item_ids: ['demo-projet', 'x'] }), 'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status
    get '/api/listers/projects'
    assert_equal ['demo-projet', 'x'], JSON.parse(last_response.body)['item_ids']
  end

  def test_get_lister_inclut_id
    get '/api/listers/demo-projet-events'
    data = JSON.parse(last_response.body)
    assert_equal 'demo-projet-events', data['id']
  end

  def test_get_lister_inclut_brins_lister_id
    get '/api/listers/demo-projet-events'
    data = JSON.parse(last_response.body)
    assert_equal 'demo-projet-brins', data['brins_lister_id']
  end

  def test_get_item_lister_inclut_brins_lister_id
    get '/api/items/demo-projet/lister'
    data = JSON.parse(last_response.body)
    assert_equal 'demo-projet-brins', data['brins_lister_id']
  end

  def test_post_lister
    post '/api/listers', JSON.generate({ type: 'events', parent_item_id: 'demo-projet' }), 'CONTENT_TYPE' => 'application/json'
    assert_equal 201, last_response.status
    data = JSON.parse(last_response.body)
    refute_nil data['id']
  end

end
