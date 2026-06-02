#!/usr/bin/env sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/apps/web"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh"
fi

cd "$WEB" || exit 1
exec ./node_modules/.bin/prettier --write "$@"
