#!/bin/bash
set -e
yarn run build
git add --all
git commit -m 'updating build'
git push