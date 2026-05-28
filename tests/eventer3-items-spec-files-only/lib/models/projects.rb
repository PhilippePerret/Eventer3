require_relative './Lister'
require_relative './project'

class Projects < Lister

  class << self

    def minimal_data
      {
        id: 'projects',
        title: 'Liste des projets',
        active: true,
        type: 'project',
        nature: 'none',
        scale: 'none',
        item_ids: ['demo'],
        brin_ids: [],
        perso_ids: [],
        lasts_id: { item: 1, brin: 0, perso: 0 },
        options: { colorizeItemsWithFirstBrin: false },
        created_at: Time.now.iso8601,
        updated_at: Time.now.iso8601
      }
    end

  end

  def create_minimal_items(data_dir)
    Project.create_minimal_data(lister_folder_path(data_dir), 'demo', 100)
  end

end
