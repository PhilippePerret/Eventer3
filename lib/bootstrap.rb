require 'fileutils'
require_relative './system/log'
require_relative './db/database'
require_relative './db/seed'

class Bootstrap

  def self.ensure_initial_data!(data_dir)
    DB.initialize!(data_dir)
    DB.seed!(data_dir)
    ensure_themes!(data_dir)
  end

  def self.ensure_project_data!(db_path)
    DB.initialize_project!(db_path)
  end

  def self.ensure_themes!(data_dir)
    themes_dir = File.join(data_dir, 'themes')
    FileUtils.mkdir_p(themes_dir)
    return unless Dir.glob(File.join(themes_dir, '*.css')).empty?
    File.write(File.join(themes_dir, 'default.css'), <<~CSS)
      /* Eventer3 - Styles par défaut */
      .titre {
        font-size: 2em;
        text-decoration: underline;
      }
      .note-rouge {
        margin-left: 10vw;
        font-size: 0.75em;
        color: red;
      }
    CSS
  end

end
