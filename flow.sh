#!/usr/bin/env bash

set -eu

repo_uri="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
remote_name="origin"
main_branch="master"
gh_pages_branch="gh-pages"

git config user.name "$GITHUB_ACTOR"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

npm install drive-db
node data/generator.js

git add data/data.json

set +e  # Grep succeeds with nonzero exit codes to show results.

if git status | grep 'new file\|modified'
then
    set -e
    git commit -am "data updated on - $(date)"
    git remote set-url "$remote_name" "$repo_uri" # includes access token
    git push --force-with-lease "$remote_name" "$gh_pages_branch"
else
    set -e
    echo "No changes since last run"
fi

echo "finish"