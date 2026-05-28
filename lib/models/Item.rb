require 'json'
require 'time'

class Item

  class << self

    def minimal_data_items
      [minimal_data('modele')]
    end

    def minimal_data(id)
      {
        id: id,
        ty: 'project',
        tt: 'Projet modèle',
        hl: false,
        co: null,
        ca: Time.now.iso8601,
        ua: Time.now.iso8601
      }
    end

  end

  attr_reader :data

  def initialize(data)
    @data = data
  end

  def id
    data[:id]
  end

  def has_lister?
    data[:hasLister] == true
  end

end
