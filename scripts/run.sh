#!/bin/zsh

# Tuer tous les processus ruby (au cas où, mais violent)
# pkill -9 ruby
# pkill -f 'app.rb'
pkill -9 $(lsof -ti:46001)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"


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

# -- Serveur --
ouvre_terminal_with "{151, 30, 1249, 751}" "cd '$APP_DIR';\nruby ./app.rb"

sleep 2

open /Users/philippeperret/Applications/Eventer3.app
