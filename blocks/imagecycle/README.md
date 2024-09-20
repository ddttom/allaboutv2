# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized images.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| Imagecycle |
|------------|
| [Image 1 URL] |
| [Image 2 URL] |
| [Image 3 URL] |
| ... |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with "Imagecycle" in the first cell.
2. Add one image URL per row in the subsequent cells.
3. Ensure all image URLs are fully qualified (complete URLs).

## Styling

The Imagecycle block uses the following CSS classes for customization:

- `.imagecycle`: Main container
- `.imagecycle-carousel`: Carousel container
- `.imagecycle-image-container`: Image container
- `.imagecycle-indicators`: Navigation indicators

## Behavior

- Images are randomized on load.
- The carousel automatically rotates through images every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Users can navigate using left/right arrow keys.

## Accessibility

- Images have appropriate alt text.
- Keyboard navigation is supported for manual image rotation.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transitions between images.
3. Allow customization of rotation speed through metadata.
4. Add play/pause controls for user interaction.