#!/bin/bash

# setup-aem.sh
# Script to set up AEM development environment inside a Dev Container
# Based on: https://www.theaemmaven.com/post/developing-aem-inside-a-dev-container

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "Checking for required tools..."
for tool in docker code; do
  if ! command_exists $tool; then
    echo "Error: $tool is not installed. Please install it and try again."
    exit 1
  fi
done

# Create a new directory for the project
PROJECT_DIR="aem-dev-container"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone the AEM WKND Guides repository
echo "Cloning AEM WKND Guides repository..."
git clone https://github.com/adobe/aem-guides-wknd.git
cd aem-guides-wknd

# Create .devcontainer directory
mkdir -p .devcontainer

# Create devcontainer.json file
cat << EOF > .devcontainer/devcontainer.json
{
  "name": "AEM Dev Container",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/juan-ayala/devcontainer-features/aem-sdk:1": {}
  },
  "forwardPorts": [4502, 4503, 8080],
  "postCreateCommand": "echo 'AEM Dev Container is ready!'"
}
EOF

echo "Dev Container configuration created."

# Prompt user to download AEM SDK
echo "Please download the AEM SDK from Adobe's Software Distribution site"
echo "and place it in the .devcontainer folder."
read -p "Press Enter when you have completed this step..."

# Instructions for the user
echo ""
echo "Setup complete. To start developing:"
echo "1. Open this project in Visual Studio Code"
echo "2. Use the 'Remote-Containers: Reopen in Container' command"
echo "3. Once the container is ready, use these commands in the terminal:"
echo "   - start-aem author    (to start AEM author instance)"
echo "   - start-aem publish   (to start AEM publish instance)"
echo "   - start-aem dispatcher (to start AEM dispatcher)"
echo ""
echo "For more information, visit:"
echo "https://www.theaemmaven.com/post/developing-aem-inside-a-dev-container"
