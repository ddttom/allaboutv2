# Universal Editor Setup Script

This script automates the setup process for the Universal Editor Service (UES) and instruments the aem-guides-wknd project for use with the Universal Editor.

## Prerequisites

Before running this script, ensure you have the following installed:

- Git
- Maven
- npm
- AEM SDK
- Universal Editor Service (UES)

## Usage

1. Save the script as `setup_universal_editor.sh`
2. Make it executable:
   ```
   chmod +x setup_universal_editor.sh
   ```
3. Run the script:
   ```
   ./setup_universal_editor.sh
   ```

## Script Actions

The script performs the following actions:

1. Checks for required tools (git, Maven, npm)
2. Creates a new folder called `universal_editor_setup`
3. Clones the aem-guides-wknd repository
4. Updates the following files with Universal Editor attributes:
   - `customheaderlibs.html`: Adds meta tags and script for UES
   - `teaser.html`: Adds AUE attributes to the teaser component
   - `title.html`: Adds AUE attributes to the title component
5. Runs a Maven build to install the updated components

## Post-Script Steps

After running the script, complete the following steps:

1. Start the AEM author instance
2. Start the Universal Editor Service
3. Open and accept SSL certificates for:
   - https://localhost:8000
   - https://localhost:44302
4. Open a page in the Universal Editor to test the updates

## Notes

- This script is based on the setup described in the [Three Laps Around the Universal Editor](https://www.theaemmaven.com/post/three-laps-around-the-universal-editor) article.
- Adjust any paths or URLs if your setup differs from the one described in the article.
- The script uses the `aem-guides-wknd` project as a base. Ensure you have the necessary permissions to clone and modify this repository.

## Troubleshooting

If you encounter any issues:

1. Check that all prerequisites are correctly installed
2. Ensure you have internet access to clone the repository
3. Verify that the paths in the script match your local setup
4. Check the console output for any error messages

For further assistance, refer to the [AEM Documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/home.html) or the [Universal Editor Documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/sites/authoring/universal-editor/introduction.html).
