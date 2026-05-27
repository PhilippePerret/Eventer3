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

patch '/data/*' do |requested_path|
  filepath = File.join(DATA_DIR, requested_path)
  halt 404 unless File.exist?(filepath)
  payload = JSON.parse(request.body.read)
  data = JSON.parse(File.read(filepath))
  payload.each { |key, value| data[key] = value }
  data['updated_at'] = Time.now.utc.iso8601
  File.write(filepath, JSON.pretty_generate(data))
  content_type :json
  JSON.generate(ok: true)
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end