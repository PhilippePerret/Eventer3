require_relative './models/projects'

class Bootstrap

  def self.ensure_initial_data!(data_dir)
    return if File.exist?(File.join(data_dir, 'projects.json'))

    Projects.create_minimal_data(data_dir)
  end

end