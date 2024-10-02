# AEM Development Environment Setup

This README provides information about the `setup-aem.sh` script, which sets up an AEM development environment inside a Dev Container.

## Overview

The `setup-aem.sh` script automates the process of setting up an AEM development environment using Dev Containers. It's based on the article [Developing AEM Inside a Dev Container](https://www.theaemmaven.com/post/developing-aem-inside-a-dev-container) by The AEM Maven.

## Prerequisites

Before running the script, ensure you have the following tools installed:

- Docker
- Visual Studio Code

## Usage

1. Save the `setup-aem.sh` script in your desired directory.
2. Make the script executable:
   ```
   chmod +x setup-aem.sh
   ```
3. Run the script:
   ```
   ./setup-aem.sh
   ```

## What the Script Does

1. Checks for required tools (Docker and Visual Studio Code).
2. Creates a new directory for the project.
3. Clones the AEM WKND Guides repository.
4. Sets up the Dev Container configuration.
5. Prompts the user to download the AEM SDK.
6. Provides instructions for further setup.

## Post-Script Steps

After running the script:

1. Download the AEM SDK from Adobe's Software Distribution site.
2. Place the AEM SDK in the `.devcontainer` folder of the project.
3. Open the project in Visual Studio Code.
4. Use the "Remote-Containers: Reopen in Container" command in VS Code.
5. Once the container is ready, use these commands in the terminal:
   - `start-aem author` (to start AEM author instance)
   - `start-aem publish` (to start AEM publish instance)
   - `start-aem dispatcher` (to start AEM dispatcher)

## Additional Information

For more detailed information about developing AEM inside a Dev Container, refer to the original article:
[Developing AEM Inside a Dev Container](https://www.theaemmaven.com/post/developing-aem-inside-a-dev-container)

## Troubleshooting

If you encounter any issues:
- Ensure all prerequisites are correctly installed.
- Check that you have the necessary permissions to create directories and clone repositories.
- Verify that you can download the AEM SDK from Adobe's Software Distribution site.

For further assistance, consult the AEM documentation or reach out to your development team.
