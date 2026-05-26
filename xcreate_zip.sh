#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP_PATH="$ROOT_DIR/eventer3-light.zip"

cd "$ROOT_DIR"

rm -f "$ZIP_PATH"

zip -r "$ZIP_PATH" \
  app.rb \
  dev \
  lib \
  public \
  tests \
  README.md \
  -x "*.DS_Store" \
  -x "__MACOSX/*" \
  -x "*node_modules"

echo "ZIP créé : $ZIP_PATH"
