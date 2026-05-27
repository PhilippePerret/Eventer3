require_relative './Lister'
require_relative './project'

class Projects < Lister

  class << self

    def minimal_data
      {
        id: 'projects',
        title: 'Liste des projets',
        type: 'project',
        items: ['demo'],
        lasts_id: { item: 1 }
      }
    end

  end

  def create_minimal_items(data_dir)
    Project.create_minimal_data(
      folder_path(data_dir),
      'demo',
      100
    )
  end

end