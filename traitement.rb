# Traitement à appliquer à tous les fichiers d'un dossier et sous-dossier


DOSSIER = File.join('.', 'tests', 'specs', 'e2e')
FILES = Dir.glob("**/*.spec.js", base: DOSSIER)
puts "Nombre de fichier : #{FILES.count}"

REG_SETUP = /import \{ (.+?) \} from '..\/__setup__.js'/
REG_BAD_PRESS = /await (.+?)\.press\((.+?)\)/
GOOD_PRESS = "await press(page, %{key})"
PROBLEMES = []

def w txt, fin = false
  STDOUT.write txt 
  STDOUT.write "\n" if fin
end


def bad_press?(code)
  code.match?(REG_BAD_PRESS)
end

FILES.each_with_index do |path, i|
  w "#{i + 1}. #{path}"
  code = IO.read(File.join(DOSSIER, path))

  if ! (code =~ REG_SETUP)
    PROBLEMES << "Le fichier #{path} ne contient pas le setup"
    next
  end

  # --- Remplacement de l'import si nécessaire ---
  # On part du principe que s'il existe, le fichier a été traité

  contenu = code[REG_SETUP, 1]
  if contenu =~ /press/
    unless bad_press?(code)
      w " --ok", true
      next
    end
  end
  # On modifie l'entête
  code = code.sub(REG_SETUP, "import { #{contenu}, press, getErr } from '../__setup__.js'")
  if bad_press?(code)
    w " -- doit être fixé"
    code.gsub!(REG_BAD_PRESS, 'await press(page, \2)')
    if bad_press?(code)
      PROBLEMES << "#{path} n'a pas pu être fixé"
      w " -- ERROR", true
    else
      IO.write(File.join(DOSSIER, path), code)
      w " -- fixé", true
      # break # pour arrêter au premier
    end
    # puts "\n\nNouveau code"
    # puts code
    # break
  end
end

if PROBLEMES.length > 0
  puts PROBLEMES.join("\n")
end