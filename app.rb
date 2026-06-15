require 'sinatra'
require 'json'
require 'fileutils'
require 'time'
require 'cgi'
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
  content_type requested_path.end_with?('.css') ? 'text/css' : :json
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
  lister = DB::Repo.find_lister_by_id(DATA_DIR, params[:id], project_id: params[:project_id])
  content_type :json
  JSON.generate(lister || { virtual: true })
end

# TESTS ONLY — non utilisé par le frontend
get '/api/items/:id/lister' do
  content_type :json
  lister = DB::Repo.find_item_lister(DATA_DIR, params[:id])
  JSON.generate(lister)
end

get '/api/items/:id/ancestors' do
  content_type :json
  ancestors = DB::Repo.find_item_ancestors(DATA_DIR, params[:project_id], params[:id])
  halt 404 if ancestors.nil?
  JSON.generate({ ancestors: ancestors })
end

patch '/api/listers/:id' do
  payload = JSON.parse(request.body.read)
  DB::Repo.update_lister(DATA_DIR, params[:id], payload, project_id: params[:project_id])
  content_type :json
  JSON.generate(ok: true)
end

post '/api/listers' do
  payload = JSON.parse(request.body.read)
  halt 422 unless payload['type'] && payload['parent_item_id']
  result = DB::Repo.create_lister(DATA_DIR, type: payload['type'], parent_item_id: payload['parent_item_id'], item_ids: payload['item_ids'] || [], project_id: payload['project_id'])
  content_type :json
  status 201
  JSON.generate(result)
end

get '/api/listers/:id/items' do
  items = DB::Repo.find_items_by_lister_id(DATA_DIR, params[:id], project_id: params[:project_id])
  content_type :json
  JSON.generate(items)
end

patch '/api/items/:id' do
  payload = JSON.parse(request.body.read)
  LOG.m(1, "[PATCH /api/items/#{params[:id]}] payload=#{payload.inspect}")
  if (db_path = payload['db_path']) && !db_path.strip.empty?
    Bootstrap.ensure_project_data!(db_path)
  end
  DB::Repo.update_item(DATA_DIR, params[:id], payload, project_id: params[:project_id])
  content_type :json
  JSON.generate(ok: true)
end

get '/api/constants' do
  content_type :json
  JSON.generate(DB::Repo.get_constants(DATA_DIR, params[:project_id]))
end

put '/api/constants' do
  content_type :json
  payload = JSON.parse(request.body.read)
  DB::Repo.save_constants(DATA_DIR, params[:project_id], payload)
  JSON.generate(ok: true)
end

get '/api/listers/:lister_id/items/:item_id/descendants/count' do
  count = DB::Repo.count_descendants(DATA_DIR, params[:project_id], params[:item_id])
  content_type :json
  JSON.generate(count: count)
end

delete '/api/listers/:lister_id/items/:item_id' do
  result = DB::Repo.delete_item(DATA_DIR, params[:lister_id], params[:item_id], project_id: params[:project_id])
  halt 404 unless result
  content_type :json
  JSON.generate(ok: true)
end

post '/api/projects/:id/duplicate' do
  result = DB::Repo.duplicate_project(DATA_DIR, params[:id])
  halt 422 unless result
  content_type :json
  status 201
  JSON.generate(result)
end

post '/api/listers/:id/items' do
  payload = JSON.parse(request.body.read)
  item = DB::Repo.create_item(DATA_DIR, params[:id], payload, project_id: params[:project_id])
  halt 422 unless item
  content_type :json
  status 201
  JSON.generate(item)
end

get '/api/settings/:key' do
  db = DB.open(DATA_DIR)
  db.results_as_hash = true
  row = db.execute("SELECT value FROM app_settings WHERE key = ? LIMIT 1", [params[:key]]).first
  db.close
  content_type :json
  JSON.generate(value: row ? row['value'] : nil)
end

patch '/api/settings/:key' do
  payload = JSON.parse(request.body.read)
  db = DB.open(DATA_DIR)
  db.results_as_hash = true
  db.execute("INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)", [params[:key], payload['value']])
  db.close
  content_type :json
  JSON.generate(ok: true)
end

get '/api/fs' do
  raw  = params[:path]
  path = raw ? File.expand_path(raw) : File.expand_path('~')
  halt 404 unless File.directory?(path)
  entries = Dir.entries(path)
    .reject { |name| name.start_with?('.') }
    .map    { |name| full = File.join(path, name); { name: name, type: File.directory?(full) ? 'directory' : 'file', path: full } }
    .sort_by { |e| e[:name].downcase }
  content_type :json
  JSON.generate(path: path, entries: entries)
end

delete '/api/fs' do
  path = params[:path]
  halt 422 unless path && !path.strip.empty?
  halt 422 unless File.basename(path) == 'eventer.db'
  File.delete(path) if File.exist?(path)
  content_type :json
  JSON.generate(ok: true)
end

get '/api/fs/exists' do
  path = params[:path]
  halt 422 unless path && !path.strip.empty?
  content_type :json
  JSON.generate(exists: File.exist?(path))
end

post '/api/projects/open' do
  payload     = JSON.parse(request.body.read)
  folder_path = payload['folder_path']
  halt 422 unless folder_path && !folder_path.strip.empty?
  db_path = File.join(folder_path, 'eventer.db')
  halt 422 unless File.exist?(db_path)
  result = DB::Repo.open_project_from_db(DATA_DIR, folder_path: folder_path, db_path: db_path)
  content_type :json
  status 201
  JSON.generate(result)
end

post '/api/fs/mkdir' do
  payload = JSON.parse(request.body.read)
  halt 422 unless payload['path'] && !payload['path'].strip.empty?
  FileUtils.mkdir_p(payload['path'])
  content_type :json
  status 201
  JSON.generate(path: payload['path'])
end

get '/api/themes' do
  content_type :json
  themes_dir = File.join(DATA_DIR, 'themes')
  styles = []
  if Dir.exist?(themes_dir)
    Dir.glob(File.join(themes_dir, '*.css')).sort.each do |file|
      css = File.read(file)
      css.scan(/\.([a-zA-Z][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/m) do |name, body|
        label = name.gsub(/[-_]/, ' ').split.map(&:capitalize).join(' ')
        styles << { name: name, label: label, css: body.strip }
      end
    end
  end
  JSON.generate(styles)
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end
