#!/bin/bash

# Exit on error
set -e

if [ -n "$GITHUB_TOKEN" ]; then
    echo "Running in CI environment, using GITHUB_TOKEN for authentication"
    # Configure Git to use the GITHUB_TOKEN for authentication
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
else
    echo "Running in local environment, using normal authentication"
fi

# Initialize and update submodules
git submodule update --init --recursive

cd ../internal
git checkout main
echo ""
