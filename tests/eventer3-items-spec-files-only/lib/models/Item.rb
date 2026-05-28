require 'json'
require 'fileutils'
require 'time'

class Item

  class << self

    def create_minimal_data(parent_lister_dir, id, pos = 100)
      item = new(minimal_data(id, pos))
      item.save(parent_lister_dir)
    end

    def sublist_keys
      []
    end

    def minimal_data(id, pos = 100)
      {
        id: id,
        type: self.name.downcase,
        title: '---',
        active: true,
        hasLister: false,
        item_ids: [],
        lasts_id: { item: 0 },
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

  def lister_file_path(parent_lister_dir)
    File.join(parent_lister_dir, "#{id}.json")
  end

  def lister_folder_path(parent_lister_dir)
    File.join(parent_lister_dir, id)
  end

  def items_file_path(parent_lister_dir)
    File.join(parent_lister_dir, '__items.json')
  end

  def save(parent_lister_dir)
    FileUtils.mkdir_p(parent_lister_dir)
    save_item_data(parent_lister_dir)
    save_lister_data(parent_lister_dir) if has_lister?
  end

  def save_item_data(parent_lister_dir)
    items_path = items_file_path(parent_lister_dir)
    items = File.exist?(items_path) ? JSON.parse(File.read(items_path), symbolize_names: true) : []
    index = items.find_index { |item| item[:id] == id }
    item_data = data.reject { |key, _| [:item_ids, :brin_ids, :perso_ids, :items, :brins, :persos, :lasts_id].include?(key) }
    index ? items[index] = item_data : items << item_data
    File.write(items_path, JSON.pretty_generate(items))
  end

  def save_lister_data(parent_lister_dir)
    lister_dir = lister_folder_path(parent_lister_dir)
    FileUtils.mkdir_p(lister_dir)
    File.write(lister_file_path(parent_lister_dir), JSON.pretty_generate(lister_data))
    write_sublist(lister_dir, :items)
    self.class.sublist_keys.each { |key| write_sublist(lister_dir, key) }
  end

  def lister_data
    data.select { |key, _| [:id, :title, :active, :type, :nature, :scale, :item_ids, :brin_ids, :perso_ids, :lasts_id, :options, :created_at, :updated_at].include?(key) }
  end

  def write_sublist(lister_dir, key)
    FileUtils.mkdir_p(lister_dir)
    File.write(File.join(lister_dir, "__#{key}.json"), JSON.pretty_generate(data[key] || []))
  end

end
