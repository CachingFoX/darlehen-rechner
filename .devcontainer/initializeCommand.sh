#!/usr/bin/env bash
set -e

init_file() {
    local file="$1"
    local template="${2:-$1.template}"

    if [ ! -f "$file" ]; then
        if [ ! "$template" ]; then
            cp "$template" "$file"
        else
            touch "$file"
        fi
    fi
}

init_file ".devcontainer/.env"
init_file ".devcontainer/.env.secrets"

echo "✅ finished initializeCommand hook"
