require 'time'
require_relative './Item'

class Project < Item

  class << self

    def minimal_data(id, pos = 100)
      super.merge(
        id: id,
        type: 'project',
        title: 'Projet modèle',
        active: true,
        hasLister: true,
        item_ids: [],
        brin_ids: [],
        perso_ids: [],
        items: [],
        brins: [],
        persos: [],
        lasts_id: { item: 0, brin: 0, perso: 0 },
        pos: pos
      )
    end

    def sublist_keys
      [:brins, :persos]
    end

  end

end
