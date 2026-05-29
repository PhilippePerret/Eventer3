require_relative './Lister'
require_relative './project'

class Projects < Lister

  class << self

    def minimal_data
      {
        id: 'projects',
        title: 'Liste des projets',
        type: 'project',
        item_ids: ['modele'],
        perso_ids: [],
        brin_ids: [],
        lasts_id: { item: 0, brin: 0, perso: 0 }
      }
    end

  end

  def create_minimal_items
    save_items(Item.minimal_data_items)
  end

end
