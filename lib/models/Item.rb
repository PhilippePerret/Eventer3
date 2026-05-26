require 'json'
require 'fileutils'
require 'time'

class Item

  class << self

    def create_minimal_data(data_dir, id, pos = 100)
      item = new(minimal_data(id, pos))
      item.save(data_dir)
    end

    def sublist_keys
      []
    end


    def minimal_data(id, pos = 100)
      {
        id: id,
        type: self.name.downcase,
        title: '---',
        hasLister: false,
        items: [],
        lasts_id: {item: 0},
        pos: pos,
        created_at: Time.now.iso8601,
        updated_at: Time.now.iso8601
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

  def json_path(data_dir)
    File.join(data_dir, "#{id}.json")
  end

  def folder_path(data_dir)
    File.join(data_dir, id)
  end

  def save(data_dir)
    FileUtils.mkdir_p(data_dir)

    File.write(
      json_path(data_dir),
      JSON.pretty_generate(data)
    )

    save_lister_data(data_dir) if has_lister?
  end

  def save_lister_data(data_dir)
    FileUtils.mkdir_p(folder_path(data_dir))

    write_sublist(data_dir, :items)

    self.class.sublist_keys.each do |key|
      write_sublist(data_dir, key)
    end
  end

  def write_sublist(data_dir, key)
    File.write(
      File.join(folder_path(data_dir), "__#{key}.json"),
      JSON.pretty_generate(data[key] || [])
    )
  end

end