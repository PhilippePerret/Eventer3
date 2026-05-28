require_relative './models/projects'

class Bootstrap

  def self.ensure_initial_data!(data_dir)

    log "\n=== BOOTSTRAP ==="
    log "data_dir: #{data_dir}"

    projects_path = File.join(DATA_DIR, 'projects.json')

    exists = File.exist?(projects_path)
    log "projects.json existe ? #{exists}"

    if File.exist?(projects_path)
      begin
        data = JSON.parse(File.read(projects_path))
        item_ids = data['item_ids']
        valid = item_ids.is_a?(Array) && item_ids.all? do |item_id|
          File.exist?(File.join(DATA_DIR, 'projects', "#{item_id}.json"))
        end
        log "Données valides ? #{valid}"
        return if valid
      end
    end

    log '-> création données minimales requises'

    Projects.create_minimal_data(data_dir)

    log '-> FIN bootstrap'

  end

end