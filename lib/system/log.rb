module LOG

  @level = 0

  def self.on(level = 1)  = @level = level
  def self.off            = @level = 0
  def self.level          = @level

  def self.m(level, message)
    puts message if level <= @level
  end

end
