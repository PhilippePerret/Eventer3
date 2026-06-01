require 'minitest/autorun'
require 'fileutils'
require 'tmpdir'
require 'sqlite3'
require_relative '../../../lib/bootstrap'

class SeedTest < Minitest::Test

  def setup
    @test_dir = Dir.mktmpdir('eventer_test_')
    Bootstrap.ensure_initial_data!(@test_dir)
    @db = SQLite3::Database.new(File.join(@test_dir, 'eventer.db'))
    @db.results_as_hash = true
  end

  def teardown
    @db.close
    FileUtils.rm_rf(@test_dir)
  end

  def test_un_projet_existe
    projects = @db.execute("SELECT * FROM items WHERE type = 'project'")
    assert_equal 1, projects.size, "Un projet de démonstration doit exister"
  end

  def test_projet_a_un_event
    project = first_project
    events = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'event'",
      project['id']
    )
    assert_operator events.size, :>=, 1, "Le projet doit contenir au moins un event"
  end

  def test_projet_a_un_brin
    project = first_project
    brins = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'brin'",
      project['id']
    )
    assert_operator brins.size, :>=, 1, "Le projet doit contenir au moins un brin"
  end

  def test_projet_a_un_perso
    project = first_project
    persos = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'perso'",
      project['id']
    )
    assert_operator persos.size, :>=, 1, "Le projet doit contenir au moins un personnage"
  end

  def test_event_a_un_titre_documentaire
    project = first_project
    event = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'event'
       LIMIT 1",
      project['id']
    ).first
    refute_nil   event['title'], "L'event doit avoir un titre"
    refute_empty event['title'], "Le titre de l'event ne doit pas être vide"
  end

  def test_brin_a_un_titre_documentaire
    project = first_project
    brin = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'brin'
       LIMIT 1",
      project['id']
    ).first
    refute_nil   brin['title'], "Le brin doit avoir un titre"
    refute_empty brin['title'], "Le titre du brin ne doit pas être vide"
  end

  def test_perso_a_un_titre_documentaire
    project = first_project
    perso = @db.execute(
      "SELECT i.* FROM items i
       JOIN listers l ON i.lister_id = l.id
       WHERE l.parent_item_id = ? AND i.type = 'perso'
       LIMIT 1",
      project['id']
    ).first
    refute_nil   perso['title'], "Le personnage doit avoir un titre (pseudo)"
    refute_empty perso['title'], "Le pseudo du personnage ne doit pas être vide"
  end

  private

  def first_project
    @db.execute("SELECT * FROM items WHERE type = 'project' LIMIT 1").first
  end

end
