require 'time'
require 'fileutils'

class Bootstrap
  DEMO_PROJECT_ID = 'demo'
  DEMO_PROJECT_TITLE = 'Projet de démonstration'

  def self.ensure_initial_data!(data_dir)
    # Todo: À faire
  end

  def initialize(store)
    @store = store
  end

  def ensure_initial_data!
    log("check #{@store.data_dir}")

    if @store.data_exists?
      log('data folder exists')
      return
    end

    log('data folder missing')
    create_initial_data
    log('initial data created')
  end

  private

  def create_initial_data
    @store.ensure_data_dir
    FileUtils.mkdir_p(@store.project_folder(DEMO_PROJECT_ID))

    @store.write_json(
      @store.projects_index_path,
      root_eventer
    )
    @store.write_json(@store.project_eventer_path(DEMO_PROJECT_ID), demo_project)
    @store.write_json(@store.events_path(DEMO_PROJECT_ID), demo_events)
    @store.write_json(@store.brins_path(DEMO_PROJECT_ID), demo_brins)
    @store.write_json(@store.persos_path(DEMO_PROJECT_ID), demo_persos)
  end

  def root_eventer
    {
      id: 'projects',
      type: 'projects',
      nature: 'none',
      events: [DEMO_PROJECT_ID],
      brins: [],
      persos: [],
      project_id: nil,
      active: true,
      options: { colorizeEventsWithFirstBrin: true },
      lasts_id: { event: 1, brin: 0, perso: 0 },
      created_at: Time.now.iso8601,
      updated_at: Time.now.iso8601
    }
  end

  def demo_project
    {
      id: DEMO_PROJECT_ID,
      type: 'eventer',
      title: DEMO_PROJECT_TITLE,
      nature: 'roman',
      active: true,
      options: { colorizeEventsWithFirstBrin: true },
      events: ['e1'],
      brins: ['b1'],
      persos: ['p1'],
      project_id: nil,
      lasts_id: { event: 1, brin: 1, perso: 1 },
      created_at: Time.now.iso8601,
      updated_at: Time.now.iso8601
    }
  end

  def demo_events
    [
      {
        id: 'e1',
        title: 'Bienvenue dans Eventer2 — évènement fictif modifiable.',
        brins: ['b1'],
        persos: ['p1'],
        type: ['act'],
        nature: [],
        duration: nil,
        file: '',
        state: 1,
        child: false
      }
    ]
  end

  def demo_brins
    [
      {
        id: 'b1',
        title:  'Brin principal fictif',
        badge:  'PRI',
        color:  '#578ddb',
        type:   'mint',
        persos: ['p1'],
        file: ''
      }
    ]
  end

  def demo_persos
    [
      {
        id: 'p1',
        badge: 'GD',
        avatar: '🙂',
        pseudo: 'Guide',
        patronyme: 'Guide Démo',
        fonctions: ['ment'],
        file: ''
      }
    ]
  end

  def log(message)
    warn("[bootstrap] #{message}")
  end
end
