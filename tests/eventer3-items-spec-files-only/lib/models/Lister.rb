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

  def lister_file_path(parent_dir)
    File.join(parent_dir, "#{id}.json")
  end

  def lister_folder_path(parent_dir)
    File.join(parent_dir, id)
  end

  def save(parent_dir)
    FileUtils.mkdir_p(lister_folder_path(parent_dir))
    File.write(lister_file_path(parent_dir), JSON.pretty_generate(data))
    write_sublist(lister_folder_path(parent_dir), :items)
    self.class.sublist_keys.each { |key| write_sublist(lister_folder_path(parent_dir), key) }
  end

  def write_sublist(lister_dir, key)
    FileUtils.mkdir_p(lister_dir)
    File.write(File.join(lister_dir, "__#{key}.json"), JSON.pretty_generate(data[key] || []))
  end

end
