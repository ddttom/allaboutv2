# DAM (Digital Asset Management) Block

The DAM block is a versatile component for managing and displaying digital assets. It provides both a JSON view and a gallery view of the assets, along with selection and copy functionalities.

## Usage

To use the DAM block, create a table in your document with the following structure:

| DAM | Description | Classification | Tag | Image | Additional Info |
|-----|-------------|----------------|-----|-------|-----------------|
| Asset Note | Asset Description | Asset Classification | Asset Tag | Asset Image | Additional Information |

You can add as many rows as needed, each representing a different asset.

## Features

1. **Toggle View**: Switch between JSON and gallery views of the assets.
2. **JSON View**: Displays a colorized JSON representation of the assets.
3. **Gallery View**: Shows a grid of asset cards with images and details.
4. **Selection**: In gallery view, select individual assets or use "Select All" and "Clear Selection" buttons.
5. **Copy JSON**: Copy the JSON data of selected (or all) assets to the clipboard.

## Functionality

### JSON View
- Displays a colorized JSON representation of all assets or selected assets.
- The "Copy JSON" button allows you to copy the displayed JSON data to the clipboard.

### Gallery View
- Displays asset cards in a grid layout.
- Each card shows the asset image, note, description, classification, tag, and additional info.
- Checkboxes allow for individual asset selection.

### Selection Controls
- "Select All": Selects all assets in the gallery view.
- "Clear Selection": Clears all selections in the gallery view.

### Copy JSON
- Copies the JSON data of selected assets (or all assets if none are selected) to the clipboard.
- Provides visual feedback ("Copied!" or "Copy failed") after attempting to copy.

## Styling

The DAM block is styled for a clean and user-friendly interface:
- Responsive grid layout for the gallery view
- Clear button styles for easy interaction
- Smooth transitions between views
- Colorized JSON for improved readability

## Customization

You can customize the appearance of the DAM block by modifying the `dam.css` file. Key areas for customization include:
- Color scheme
- Button styles
- Gallery card layout
- JSON view styling

## Notes

- Ensure that each row in the DAM table has at least 6 cells for proper functionality.
- The block automatically handles cases where no assets are selected, displaying all assets in such scenarios.
- Console logs are included for debugging purposes and can be removed for production use.
