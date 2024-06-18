#!/bin/bash

set -e

if [ -n "$GH_TOKEN" ]; then
    echo "Running in CI environment, using GH_TOKEN for authentication"
    git config --global url."https://${GH_TOKEN}@github.com/".insteadOf "https://github.com/"
elif [ -n "$GITHUB_TOKEN" ]; then
    echo "Running in CI environment, using GITHUB_TOKEN for authentication"
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
else
    echo "Running in local environment, using normal authentication"
fi

git submodule update --init --recursive
cd internal
git checkout main
echo ""
