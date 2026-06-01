require_relative './system/log'
require_relative './db/database'
require_relative './db/seed'

class Bootstrap

  def self.ensure_initial_data!(data_dir)
    DB.initialize!(data_dir)
    DB.seed!(data_dir)
  end

end
