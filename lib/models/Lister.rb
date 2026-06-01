require 'json'
require 'fileutils'

class Lister

  class << self

    def create_minimal_data(data_dir)
      lister = new(minimal_data, data_dir: data_dir)
      lister.save
      lister.create_minimal_items
    end

  end

  attr_reader :data

  def initialize(data, data_dir:, parent_context_path: nil)
    @data = data
    @data_dir = data_dir
    @parent_context_path = parent_context_path
  end

  def id
    data[:id]
  end

  def context_path
    [@parent_context_path, "lof-#{id}"].compact.join('/')
  end

  def folder_path
    File.join(@data_dir, context_path)
  end

  def json_path
    File.join(@data_dir, "#{context_path}.json")
  end

  def save
    FileUtils.mkdir_p(folder_path)
    File.write(json_path, JSON.pretty_generate(data))
  end

  def save_items(items)
    File.write(File.join(folder_path, '__items.json'), JSON.pretty_generate(items))
  end

  def create_minimal_items
    save_items({})
  end

end
