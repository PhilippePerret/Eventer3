require 'minitest/autorun'
require 'rack/test'
require 'tmpdir'
require 'fileutils'
require 'json'

ENV['RACK_ENV'] = 'test'
ENV['EVENTER_DATA_DIR'] ||= Dir.mktmpdir('eventer_fs_settings_test_')
require_relative '../../../app'

class FsAndSettingsTest < Minitest::Test
  include Rack::Test::Methods

  def app = Sinatra::Application

  def setup
    @data_dir = ENV['EVENTER_DATA_DIR']
    Bootstrap.ensure_initial_data!(@data_dir)
    db = DB.open(@data_dir)
    db.execute("DELETE FROM app_settings")
    db.close
    @tmp = Dir.mktmpdir('eventer_fs_test_')
  end

  def teardown
    FileUtils.rm_rf(@tmp)
  end

  # ── app_settings ──────────────────────────────────────────────────

  def test_app_settings_table_exists
    db = DB.open(@data_dir)
    tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").map { |r| r[0] }
    db.close
    assert_includes tables, 'app_settings', "main.db doit avoir la table app_settings"
  end

  def test_get_setting_returns_null_when_not_set
    get '/api/settings/last_path'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_nil data['value']
  end

  def test_patch_setting_stores_value
    patch '/api/settings/last_path',
          JSON.generate({ value: '/Users/test/Documents' }),
          'CONTENT_TYPE' => 'application/json'
    assert_equal 200, last_response.status

    get '/api/settings/last_path'
    data = JSON.parse(last_response.body)
    assert_equal '/Users/test/Documents', data['value']
  end

  def test_patch_setting_updates_existing_value
    patch '/api/settings/last_path',
          JSON.generate({ value: '/premier/chemin' }),
          'CONTENT_TYPE' => 'application/json'
    patch '/api/settings/last_path',
          JSON.generate({ value: '/second/chemin' }),
          'CONTENT_TYPE' => 'application/json'

    get '/api/settings/last_path'
    data = JSON.parse(last_response.body)
    assert_equal '/second/chemin', data['value']
  end

  def test_patch_setting_recent_paths_stores_json
    paths = ['/a/b/c', '/d/e/f']
    patch '/api/settings/recent_paths',
          JSON.generate({ value: JSON.generate(paths) }),
          'CONTENT_TYPE' => 'application/json'

    get '/api/settings/recent_paths'
    data = JSON.parse(last_response.body)
    assert_equal paths, JSON.parse(data['value'])
  end

  # ── GET /api/fs ───────────────────────────────────────────────────

  def test_fs_returns_entries_for_given_path
    FileUtils.mkdir_p(File.join(@tmp, 'sous-dossier'))
    File.write(File.join(@tmp, 'fichier.txt'), 'contenu')

    get "/api/fs?path=#{CGI.escape(@tmp)}"
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_equal @tmp, data['path']
    names = data['entries'].map { |e| e['name'] }
    assert_includes names, 'sous-dossier'
    assert_includes names, 'fichier.txt'
  end

  def test_fs_entries_have_type
    FileUtils.mkdir_p(File.join(@tmp, 'dossier'))
    File.write(File.join(@tmp, 'texte.txt'), '')

    get "/api/fs?path=#{CGI.escape(@tmp)}"
    data = JSON.parse(last_response.body)
    dir_entry  = data['entries'].find { |e| e['name'] == 'dossier' }
    file_entry = data['entries'].find { |e| e['name'] == 'texte.txt' }
    assert_equal 'directory', dir_entry['type']
    assert_equal 'file',      file_entry['type']
  end

  def test_fs_directories_listed_before_files
    FileUtils.mkdir_p(File.join(@tmp, 'zzz-dossier'))
    File.write(File.join(@tmp, 'aaa-fichier.txt'), '')

    get "/api/fs?path=#{CGI.escape(@tmp)}"
    data = JSON.parse(last_response.body)
    types = data['entries'].map { |e| e['type'] }
    last_dir = types.rindex('directory')
    first_file = types.index('file')
    assert last_dir < first_file, "Les dossiers doivent apparaître avant les fichiers"
  end

  def test_fs_skips_hidden_entries
    FileUtils.mkdir_p(File.join(@tmp, '.hidden'))
    File.write(File.join(@tmp, '.dotfile'), '')
    FileUtils.mkdir_p(File.join(@tmp, 'visible'))

    get "/api/fs?path=#{CGI.escape(@tmp)}"
    data = JSON.parse(last_response.body)
    names = data['entries'].map { |e| e['name'] }
    refute_includes names, '.hidden'
    refute_includes names, '.dotfile'
    assert_includes names, 'visible'
  end

  def test_fs_without_path_uses_home_dir
    get '/api/fs'
    assert_equal 200, last_response.status
    data = JSON.parse(last_response.body)
    assert_equal File.expand_path('~'), data['path']
  end

  def test_fs_returns_404_for_nonexistent_path
    get "/api/fs?path=#{CGI.escape('/chemin/qui/nexiste/pas')}"
    assert_equal 404, last_response.status
  end

  def test_fs_entries_include_full_path
    FileUtils.mkdir_p(File.join(@tmp, 'mon-dossier'))

    get "/api/fs?path=#{CGI.escape(@tmp)}"
    data = JSON.parse(last_response.body)
    entry = data['entries'].find { |e| e['name'] == 'mon-dossier' }
    assert_equal File.join(@tmp, 'mon-dossier'), entry['path']
  end

  # ── POST /api/fs/mkdir ────────────────────────────────────────────

  def test_mkdir_creates_directory
    new_dir = File.join(@tmp, 'nouveau-dossier')
    refute File.exist?(new_dir)

    post '/api/fs/mkdir',
         JSON.generate({ path: new_dir }),
         'CONTENT_TYPE' => 'application/json'
    assert_equal 201, last_response.status
    assert File.directory?(new_dir), "Le dossier doit être créé"
  end

  def test_mkdir_creates_nested_directories
    new_dir = File.join(@tmp, 'a', 'b', 'c')

    post '/api/fs/mkdir',
         JSON.generate({ path: new_dir }),
         'CONTENT_TYPE' => 'application/json'
    assert_equal 201, last_response.status
    assert File.directory?(new_dir)
  end

  def test_mkdir_returns_path
    new_dir = File.join(@tmp, 'retour-test')

    post '/api/fs/mkdir',
         JSON.generate({ path: new_dir }),
         'CONTENT_TYPE' => 'application/json'
    data = JSON.parse(last_response.body)
    assert_equal new_dir, data['path']
  end

  def test_mkdir_returns_422_without_path
    post '/api/fs/mkdir', JSON.generate({}), 'CONTENT_TYPE' => 'application/json'
    assert_equal 422, last_response.status
  end

end
