# Imagecycle

The Imagecycle block is a component that displays a rotating set of images with automatic cycling and user interaction features.

## Usage

Add the Imagecycle block to your page using the following structure in your Google Docs or Microsoft Word document:

| Imagecycle |
|------------|
| [Image URL 1] |
| [Image URL 2] |
| [Image URL 3] |
| ... |

## Authoring

1. Create a table with "Imagecycle" in the first cell.
2. Add image URLs in subsequent rows, one per cell.
3. You can use fully qualified URLs or relative paths to images in your project.

## Styling

The block uses the following CSS classes for styling:
- `.imagecycle-container`: Main container for the block
- `.imagecycle-image`: Image element
- `.imagecycle-indicators`: Container for indicator dots
- `.imagecycle-dot`: Individual indicator dot

You can customize the appearance by overriding these classes in your project's CSS.

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation stops when the user hovers over the image.
- Rotation resumes immediately after the user moves the cursor away from the image.
- Users can navigate through images using left and right arrow keys.
- Indicator dots show the current image position.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML elements for better screen reader compatibility.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transitions between images.
3. Allow customization of rotation speed through block metadata.
4. Add alt text support for images to improve accessibility.
5. Implement lazy loading for better performance with many images.