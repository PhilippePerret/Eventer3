require 'sinatra'
require 'json'
require 'fileutils'
require 'time'
require_relative './lib/bootstrap'
require_relative './lib/db/repo'
require_relative './lib/system/log'
# LOG.on(1)

set :public_folder, 'public'

DATA_DIR = ENV['EVENTER_DATA_DIR'] || File.expand_path('data', __dir__)

before do
  Bootstrap.ensure_initial_data!(DATA_DIR)
end

get '/data/*' do |requested_path|
  filepath = File.join(DATA_DIR, requested_path)
  halt 404 unless File.exist?(filepath)
  content_type :json
  File.read(filepath)
end

put '/data/*' do |requested_path|
  filepath = File.join(DATA_DIR, requested_path)
  FileUtils.mkdir_p(File.dirname(filepath))
  File.write(filepath, request.body.read)
  content_type :json
  JSON.generate(ok: true)
end

patch '/data/*' do |requested_path|
  filepath = File.join(DATA_DIR, requested_path)
  halt 404 unless File.exist?(filepath)
  payload = JSON.parse(request.body.read)
  data = JSON.parse(File.read(filepath))
  if (requested_path.end_with?('__items.json') || requested_path.end_with?('__brins.json')) && payload.key?('id')
    new_id = payload.delete('id')
    old_id = payload.delete('old_id') { new_id }
    if old_id != new_id && data.key?(old_id)
      data[new_id] = data.delete(old_id)
      data[new_id]['id'] = new_id
    else
      data[new_id] ||= {}
    end
    payload.each { |key, value| data[new_id][key] = value }
    data[new_id]['ua'] = Time.now.utc.iso8601
  else
    payload.each { |key, value| data[key] = value }
    data['updated_at'] = Time.now.utc.iso8601
  end
  File.write(filepath, JSON.pretty_generate(data))
  content_type :json
  JSON.generate(ok: true)
end

get '/api/listers/:id' do
  lister = DB::Repo.find_lister_by_id(DATA_DIR, params[:id])
  halt 404 unless lister
  content_type :json
  JSON.generate(lister)
end

patch '/api/listers/:id' do
  payload = JSON.parse(request.body.read)
  DB::Repo.update_lister(DATA_DIR, params[:id], payload)
  content_type :json
  JSON.generate(ok: true)
end

post '/api/listers' do
  payload = JSON.parse(request.body.read)
  halt 422 unless payload['type'] && payload['parent_item_id']
  result = DB::Repo.create_lister(DATA_DIR, type: payload['type'], parent_item_id: payload['parent_item_id'], item_ids: payload['item_ids'] || [])
  content_type :json
  status 201
  JSON.generate(result)
end

get '/api/listers/:id/items' do
  items = DB::Repo.find_items_by_lister_id(DATA_DIR, params[:id])
  content_type :json
  JSON.generate(items)
end

patch '/api/items/:id' do
  payload = JSON.parse(request.body.read)
  LOG.m(1, "[PATCH /api/items/#{params[:id]}] payload=#{payload.inspect}")
  DB::Repo.update_item(DATA_DIR, params[:id], payload)
  content_type :json
  JSON.generate(ok: true)
end

delete '/api/listers/:lister_id/items/:item_id' do
  result = DB::Repo.delete_item(DATA_DIR, params[:lister_id], params[:item_id])
  halt 404 unless result
  content_type :json
  JSON.generate(ok: true)
end

post '/api/listers/:id/items' do
  payload = JSON.parse(request.body.read)
  item = DB::Repo.create_item(DATA_DIR, params[:id], payload)
  halt 422 unless item
  content_type :json
  status 201
  JSON.generate(item)
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end
