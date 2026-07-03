require 'asciidoctor'
require 'asciidoctor/extensions'

class Combo < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl

  named :combo

  STRKEYS_TO_KEY = {
    'alt'     => '⌥',
    'cmd'     => '⌘',
    'ctrl'    => '⌃', 
    'maj'     => '⇧',
    'enter'   => '↩︎',
    'fb'      => '↓',
    'fg'      => '←',
    'fh'      => '↑',
    'fd'      => '→',
    'space'   => '␣',
    'esc'     => '␛',
    'delete'  => '⌦'
  }

  def process(parent, target, attrs)
    if target.match?(/\+/)
      target.split('+')
        .map {|k| %(<kbd style="font-size:1.1em;">#{STRKEYS_TO_KEY[k.downcase] || k}</kbd>) }
        .join('+')
    elsif target.match?(/\//)
      target.split('/')
        .map {|k| %(<kbd style="font-size:1.1em;">#{STRKEYS_TO_KEY[k.downcase] || k}</kbd>) }
        .join('/')
    else
      %(<kbd style="font-size:1.1em;">#{STRKEYS_TO_KEY[target.downcase] || target}</kbd>)
    end
  end
end

Asciidoctor::Extensions.register do
  inline_macro Combo
end