require_relative './models/projects'

class Bootstrap

  def self.log(message)
    puts message if Object.const_defined?(:DATA_DIR)
  end

  def self.ensure_initial_data!(data_dir)
    log "\n=== BOOTSTRAP ==="
    log "data_dir: #{data_dir}"
    projects_path = File.join(data_dir, 'projects.json')
    items_path = File.join(data_dir, 'projects', '__items.json')
    exists = File.exist?(projects_path)
    log "projects.json existe ? #{exists}"
    if File.exist?(projects_path) && File.exist?(items_path)
      begin
        data = JSON.parse(File.read(projects_path))
        items = JSON.parse(File.read(items_path))
        item_ids = data['item_ids']
        item_data_ids = items.map { |item| item['id'] }
        valid = item_ids.is_a?(Array) && item_ids.all? { |item_id| item_data_ids.include?(item_id) }
        log "Données valides ? #{valid}"
        return if valid
      rescue JSON::ParserError
        log 'Données invalides'
      end
    end
    log '-> création données minimales requises'
    Projects.create_minimal_data(data_dir)
    log '-> FIN bootstrap'
  end

end
