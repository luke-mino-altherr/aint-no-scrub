#!/bin/bash

npm run build
cd dist
git init
git add -A
git commit -m "deploy"
git push -f git@github.com:luke-mino-altherr/aint-no-scrub.git master:gh-pages
