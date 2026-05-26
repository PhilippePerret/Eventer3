require_relative './models/projects'

class Bootstrap

  def self.ensure_initial_data!(data_dir)

    log "\n=== BOOTSTRAP ==="
    log "data_dir: #{data_dir}"

    exists = File.exist?(File.join(data_dir, 'projects.json'))

    log "projects.json existe ? #{exists}"

    return if exists

    log '-> création données minimales'

    Projects.create_minimal_data(data_dir)

    log '-> FIN bootstrap'

  end

end