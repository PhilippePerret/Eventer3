require 'sinatra'
require 'json'
require 'fileutils'
require 'securerandom'

require_relative './lib/bootstrap'

set :public_folder, 'public'

DATA_DIR = File.expand_path('data', __dir__)
DEFAULT_PROJECT = 'demo'

def log(message, printit = true)
  # return
  puts message if printit
end

before do
  log "\n=== BEFORE SINATRA ===", false
  log "DATA_DIR: #{DATA_DIR}", false
  Bootstrap.ensure_initial_data!(DATA_DIR)
  log "======================\n", false
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end
