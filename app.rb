require 'sinatra'
require 'json'
require 'fileutils'
require 'securerandom'

require_relative './lib/data_store'
require_relative './lib/eventer_store'
require_relative './lib/project_store'
require_relative './lib/bootstrap'
require_relative './lib/app_helpers'

set :public_folder, 'public'

DATA_DIR = File.expand_path('data', __dir__)
DEFAULT_PROJECT = 'demo'

helpers AppHelpers

before do
  Bootstrap.ensure_initial_data!(DATA_DIR)
  content_type :json if request.path_info.start_with?('/projects', '/events', '/child')
end

get '/' do
  content_type :html
  send_file File.join(settings.public_folder, 'index.html')
end

get '/projects' do
  project_store.projects.to_json
end

post '/projects' do
  payload = read_json_payload
  project = project_store.create(payload['name'].to_s)

  {
    status: 'ok',
    project: project,
    filename: "#{project[:id]}.json"
  }.to_json
end

patch '/projects/:project' do
  payload = read_json_payload
  project = project_store.update(params[:project], payload)

  {
    status: 'ok',
    project: project
  }.to_json
end

delete '/projects/:project' do
  project_store.archive(params[:project])

  {
    status: 'ok',
    project: params[:project],
    active: false
  }.to_json
end

post '/projects/reorder' do
  project_store.reorder(read_json_payload['order'] || [])

  { status: 'ok' }.to_json
end

post '/projects/order' do
  project_store.reorder(read_json_payload['order'] || [])

  { status: 'ok' }.to_json
end

get '/events' do
  project = params[:project] || DEFAULT_PROJECT
  child_path = params[:path] || ''

  eventer_store.load_with_navigation(project, child_path).to_json
end

post '/events' do
  project = params[:project] || DEFAULT_PROJECT
  child_path = params[:path] || ''

  eventer_store.save(project, child_path, read_json_payload)

  {
    status: 'ok',
    project: project,
    path: child_path
  }.to_json
end

post '/child' do
  payload = read_json_payload

  child_path = eventer_store.ensure_child(
    params[:project] || DEFAULT_PROJECT,
    params[:path] || '',
    payload['eventId'],
    payload['title'].to_s
  )

  {
    status: 'ok',
    project: params[:project] || DEFAULT_PROJECT,
    path: child_path
  }.to_json
end
