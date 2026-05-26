require 'sinatra'
require 'json'
require 'fileutils'
require 'securerandom'

require_relative './lib/bootstrap'

set :public_folder, 'public'

DATA_DIR = File.expand_path('data', __dir__)
DEFAULT_PROJECT = 'demo'

before do
  Bootstrap.ensure_initial_data!(DATA_DIR)
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end
