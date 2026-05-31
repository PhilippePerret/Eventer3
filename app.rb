require 'sinatra'
require 'json'
require 'fileutils'
require 'securerandom'
require 'time'
require_relative './lib/bootstrap'

set :public_folder, 'public'

DATA_DIR = File.expand_path('data', __dir__)
DEFAULT_PROJECT = 'demo'

def log(message, printit = true)
  puts message if printit
end

before do
  log "\n=== BEFORE SINATRA ===", false
  log "DATA_DIR: #{DATA_DIR}", false
  Bootstrap.ensure_initial_data!(DATA_DIR)
  log "======================\n", false
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

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end