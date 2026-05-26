require 'json'
require 'fileutils'

class Lister

  class << self

    def create_minimal_data(data_dir)
      lister = new(minimal_data)
      lister.save(data_dir)
      lister.create_minimal_items(data_dir)
    end

    def sublist_keys
      []
    end

  end

  attr_reader :data

  def initialize(data)
    @data = data
  end

  def id
    data[:id]
  end

  def folder_path(data_dir)
    File.join(data_dir, id)
  end

  def json_path(data_dir)
    File.join(data_dir, "#{id}.json")
  end

  def save(data_dir)
    FileUtils.mkdir_p(folder_path(data_dir))

    File.write(
      json_path(data_dir),
      JSON.pretty_generate(data)
    )

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