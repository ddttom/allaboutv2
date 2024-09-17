# DAM Block

The DAM (Digital Asset Management) block displays a list of images with associated metadata in a structured format.

## Usage

This block is used to showcase a collection of digital assets with their descriptions, classifications, and tags.

## Authoring

Create a table in your document with the following structure:

| DAM Block Title |
|-----------------|
| Description | Classification | Tag | Image |
| ... | ... | ... | ... |

- The first row contains the block title.
- Subsequent rows contain:
  1. Description of the asset
  2. Classification
  3. Tag
  4. Image (use the 'Image' button in your document editor)

## Styling

The block uses CSS classes for styling:
- `.dam`: Main container
- `.dam-images`: Grid container for images
- `.dam-item`: Individual image item

You can customize the appearance by modifying these classes in the CSS file.

## Behavior

The block processes the table data and generates:
1. A JSON representation of the assets
2. A visual display of the images with their descriptions

## Accessibility

- Images include alt text based on their descriptions for screen readers.
- The JSON output is contained within a `<pre><code>` element for better readability and potential interaction with screen readers.

## Suggestions for Improvement

1. Add filtering options based on classifications or tags.
2. Implement lazy loading for images to improve performance.
3. Add a lightbox feature for viewing larger images.
4. Include a search functionality to find specific assets.