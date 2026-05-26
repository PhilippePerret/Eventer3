#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP_PATH="$ROOT_DIR/eventer3-app.zip"

cd "$ROOT_DIR"

rm -f "$ZIP_PATH"

zip -r "$ZIP_PATH" \
  app.rb \
  dev \
  lib \
  public \
  README.md \
  -x "*.DS_Store" \
  -x "__MACOSX/*"

echo "ZIP créé : $ZIP_PATH"
