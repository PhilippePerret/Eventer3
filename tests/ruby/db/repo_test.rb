require 'minitest/autorun'
require 'fileutils'
require 'tmpdir'
require_relative '../../../lib/bootstrap'
require_relative '../../../lib/db/repo'

class RepoTest < Minitest::Test

  def setup
    @test_dir = Dir.mktmpdir('eventer_test_')
    Bootstrap.ensure_initial_data!(@test_dir)
  end

  def teardown
    FileUtils.rm_rf(@test_dir)
  end

  # --- find_lister ---

  def test_find_lister_racine
    lister = DB::Repo.find_lister(@test_dir, 'lof-projects')
    refute_nil lister
    assert_equal ['demo-projet'], lister[:item_ids]
  end

  def test_find_lister_enfant_events
    lister = DB::Repo.find_lister(@test_dir, 'lof-projects/lof-demo-projet')
    refute_nil lister
    assert_equal ['e1'], lister[:item_ids]
  end

  def test_find_lister_enfant_brins
    lister = DB::Repo.find_lister(@test_dir, 'lof-projects/lof-demo-projet', type: 'brins')
    refute_nil lister
    assert_equal ['b1'], lister[:item_ids]
  end

  def test_find_lister_inexistant
    lister = DB::Repo.find_lister(@test_dir, 'lof-projects/lof-inexistant')
    assert_nil lister
  end

  # --- find_items ---

  def test_find_items_projets
    items = DB::Repo.find_items(@test_dir, 'lof-projects')
    assert_includes items.keys, 'demo-projet'
    assert_equal 'Projet démo', items['demo-projet']['title']
    assert_equal 'project', items['demo-projet']['type']
  end

  def test_find_items_events
    items = DB::Repo.find_items(@test_dir, 'lof-projects/lof-demo-projet')
    assert_includes items.keys, 'e1'
    assert_equal 'Premier événement', items['e1']['title']
  end

  def test_find_items_brins
    items = DB::Repo.find_items(@test_dir, 'lof-projects/lof-demo-projet', filename: '__brins.json')
    assert_includes items.keys, 'b1'
    assert_equal 'Fil rouge', items['b1']['title']
    assert_equal 'FIL', items['b1']['badge']
  end

  # --- save_lister ---

  def test_save_lister_met_a_jour_item_ids
    DB::Repo.save_lister(@test_dir, 'lof-projects', item_ids: ['demo-projet', 'x'])
    lister = DB::Repo.find_lister(@test_dir, 'lof-projects')
    assert_equal ['demo-projet', 'x'], lister[:item_ids]
  end

  # --- upsert_item ---

  def test_upsert_item_met_a_jour_le_titre
    DB::Repo.upsert_item(@test_dir, 'lof-projects/lof-demo-projet', { 'id' => 'e1', 'title' => 'Titre modifié' })
    items = DB::Repo.find_items(@test_dir, 'lof-projects/lof-demo-projet')
    assert_equal 'Titre modifié', items['e1']['title']
  end

  def test_upsert_item_cree_un_nouvel_item
    DB::Repo.upsert_item(@test_dir, 'lof-projects/lof-demo-projet', { 'id' => 'e2', 'title' => 'Deuxième événement', 'type' => 'event' })
    items = DB::Repo.find_items(@test_dir, 'lof-projects/lof-demo-projet')
    assert_includes items.keys, 'e2'
    assert_equal 'Deuxième événement', items['e2']['title']
  end

  # --- find_item_lister ---

  def test_find_item_lister_retourne_events
    lister = DB::Repo.find_item_lister(@test_dir, 'demo-projet')
    refute_nil lister
    assert_includes lister[:item_ids], 'e1'
  end

  def test_find_item_lister_inclut_brins_lister_id
    lister = DB::Repo.find_item_lister(@test_dir, 'demo-projet')
    assert_equal 'demo-projet-brins', lister[:brins_lister_id]
  end

  def test_find_item_lister_inexistant_retourne_nil
    lister = DB::Repo.find_item_lister(@test_dir, 'inexistant')
    assert_nil lister
  end

  # --- create_lister ---

  def test_create_lister_cree_un_lister
    result = DB::Repo.create_lister(@test_dir, type: 'events', parent_item_id: 'demo-projet')
    refute_nil result[:id]
    lister = DB::Repo.find_lister_by_id(@test_dir, result[:id])
    refute_nil lister
  end

  # --- find_lister_by_id ---

  def test_find_lister_by_id_inclut_id
    lister = DB::Repo.find_lister_by_id(@test_dir, 'projects')
    assert_equal 'projects', lister[:id]
  end

  def test_find_lister_by_id_inclut_brins_lister_id
    lister = DB::Repo.find_lister_by_id(@test_dir, 'demo-projet-events')
    assert_equal 'demo-projet-brins', lister[:brins_lister_id]
  end

  def test_find_lister_by_id_sans_brins_pas_de_brins_lister_id
    lister = DB::Repo.find_lister_by_id(@test_dir, 'projects')
    assert_nil lister[:brins_lister_id]
  end

  # --- find_items_by_lister_id ---

  def test_find_items_by_lister_id_brin_ids_est_un_array
    items = DB::Repo.find_items_by_lister_id(@test_dir, 'demo-projet-events')
    assert_kind_of Array, items['e1']['brin_ids']
  end

  # --- create_item avec id fourni ---

  def test_create_item_avec_id_fourni
    item = DB::Repo.create_item(@test_dir, 'projects', { 'id' => 'mon-projet', 'title' => 'Mon Projet', 'type' => 'project' })
    assert_equal 'mon-projet', item['id']
    items = DB::Repo.find_items_by_lister_id(@test_dir, 'projects')
    assert_includes items.keys, 'mon-projet'
  end

end
