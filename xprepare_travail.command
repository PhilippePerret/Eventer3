#!/bin/zsh

DOSSIER="/Users/philippeperret/Programmes/Eventer3"

OPEN_FINDER_WINDOWS=false
PREPARE_TERMINAL_WINDOWS=true
OPEN_EVENTER_SITE=true

open_list_window () {
  local TARGET="$1"
  local BOUNDS="$2"
  local TYPEVIEW="$3"

  osascript <<EOF
tell application "Finder"
  activate
  open POSIX file "$TARGET"
  
  tell front Finder window
    if "$TYPEVIEW" is equal to "list" then 
      set current view to list view
    end
    set toolbar visible to true
    set statusbar visible to true
    set bounds to $BOUNDS
  end tell
end tell
EOF
}

if $OPEN_FINDER_WINDOWS; then
  open_list_window "$DOSSIER/lib" "{304, 30, 1250, 541}" "list"
  open_list_window "$DOSSIER/public" "{1265, 30, 2218, 538}" "list"
  open_list_window "$DOSSIER/tests/e2e" "{2228, 30, 3172, 546}" "list"
fi
# Ouvrer inconditionnellement la fenêtre Finder de l'application
# car maintenant c'est par la commande qu'on lance tout.
open_list_window "$DOSSIER" "{813, 665, 2646, 1197}" "none"


ouvre_iterm_with() {
  local BOUNDS="$1"
  local COMMAND="$2"

  osascript <<EOF
    tell application "iTerm"
      if (count of windows) = 0 then
        create window with default profile
      end if
      tell current session of current window
        write text "$COMMAND"
      end tell

      delay 0.2

      tell front window
          set bounds to $BOUNDS
      end tell
    end tell

EOF
}


# Exemple :
# ouvre_terminal_with "1200 100 800 600" "ls -la"

ouvre_terminal_with() {
  local BOUNDS="$1"
  local command="$2"

  osascript <<EOF
tell application "Terminal"
    activate
    do script "$command"

    delay 0.2

    tell front window
        set bounds to $BOUNDS
    end tell
end tell
EOF
}

# Pour obtenir le zip du code complet
if $PREPARE_TERMINAL_WINDOWS; then
  # ouvre_terminal_with "{2615, 1065, 3413, 1440}" "cd '$DOSSIER';\nzsh xcreate_zip.sh"

  # -- Claude Code (avec iTerm2) --
  ouvre_iterm_with "{1043, 682, 2413, 1357}" "cd '$DOSSIER';\nclaude"
  
  # -- Serveur --
  ouvre_terminal_with "{151, 30, 1249, 751}" "cd '$DOSSIER';\nruby ./app.rb"
  sleep 2
  
  # -- Tests --
  # ouvre_terminal_with "{2433, 30, 3432, 951}" "cd '$DOSSIER/tests';\nnpm run test:all"
fi

# Pour lancer la Wep App Safari qui pointe sur le localhost
if $OPEN_EVENTER_SITE; then
  open /Users/philippeperret/Applications/Eventer.app
fi

# Ouvrir le dossier développement dans VSCode
code "$DOSSIER"

# sleep 1

exit 0