# DAM Block

The DAM (Digital Asset Management) block displays a list of images with associated metadata in a JSON format and an image gallery.

## Usage

The DAM block is used to showcase digital assets with their descriptions, classifications, and tags.

## Authoring

Create a table in your Google Docs or Microsoft Word document with the following structure:

| DAM | Description | Classification | Tag | Image |
|-----|-------------|----------------|-----|-------|
| | Asset description | Asset class | Asset tag | Image URL or embed |

- The first cell should contain "DAM" to indicate the block type.
- Each subsequent row represents an asset with its metadata and image.

## Styling

The block uses CSS classes for styling:
- `.dam`: Main container styles
- `.dam pre`: Styles for the JSON output container
- `.dam code`: Styles for the JSON text
- `.dam-gallery`: Styles for the image gallery
- `.dam-gallery img`: Styles for individual images in the gallery

Custom CSS variables can be used to adjust the styling to match your site's theme.

## Behavior

The block processes the table data to create a JSON output and an image gallery:
1. Extracts metadata and image paths from the table.
2. Generates a formatted JSON output displayed in a `<pre><code>` element.
3. Creates an image gallery using the extracted image paths.

## Accessibility

- Images include alt text based on the asset description for screen readers.
- The JSON output is presented in a structured format for easy reading by assistive technologies.

## Suggestions for Improvement

1. Add lazy loading for images to improve performance.
2. Implement a lightbox feature for enlarged image viewing.
3. Add filtering and sorting options for the gallery based on classifications or tags.
4. Implement error handling for missing or invalid image URLs.
5. Add a search functionality to filter assets based on descriptions or metadata.