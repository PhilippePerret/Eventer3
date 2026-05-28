require_relative './models/projects'

class Bootstrap

  def self.ensure_initial_data!(data_dir)
    log "\n=== BOOTSTRAP ==="
    log "data_dir: #{data_dir}"

    lof_json   = File.join(data_dir, 'lof-projects.json')
    items_json = File.join(data_dir, 'lof-projects', '__items.json')

    log "lof-projects.json existe ? #{File.exist?(lof_json)}"
    log "__items.json existe ? #{File.exist?(items_json)}"

    if File.exist?(lof_json) && File.exist?(items_json)
      begin
        lister_data = JSON.parse(File.read(lof_json))
        items       = JSON.parse(File.read(items_json))
        valid = lister_data['item_ids'].is_a?(Array) && items.is_a?(Array) && !items.empty?
        log "Données valides ? #{valid}"
        return if valid
      rescue => e
        log "Erreur lecture données : #{e.message}"
      end
    end

    log '-> création données minimales requises'
    Projects.create_minimal_data
    log '-> FIN bootstrap'
  end

end
