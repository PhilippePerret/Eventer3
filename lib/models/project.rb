require 'time'
require_relative './item'

class Project < Item

  class << self

    def minimal_data(id, pos = 100)
      super.merge(
        brins: ['b1'],
        persos: ['p1'],
        lasts_id: {
          item: 0,
          brin: 1,
          perso: 1
        }
      )
    end

    def sublist_keys
      [:brins, :persos]
    end

  end

end