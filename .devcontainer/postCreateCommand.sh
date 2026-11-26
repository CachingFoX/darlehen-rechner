#/bin/bash

if [ -f package.json ]; then
  npm install
fi

if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi
