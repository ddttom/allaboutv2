# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized order and interactive features.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| Imagecycle |
|------------|
| ![Image 1](https://example.com/image1.jpg) |
| ![Image 2](https://example.com/image2.jpg) |
| ![Image 3](https://example.com/image3.jpg) |

## Authoring

1. In Google Docs or Microsoft Word, create a table with "Imagecycle" in the first cell.
2. Add images to subsequent rows, one image per row.
3. Ensure that image URLs are fully qualified (complete URLs).

## Styling

The Imagecycle block uses the following CSS classes for customization:
- `.imagecycle`: Main container
- `.imagecycle-container`: Wrapper for images and indicators
- `.imagecycle-image-container`: Container for the current image
- `.imagecycle-indicators`: Container for placement indicators

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation stops when hovering over the image.
- Rotation resumes immediately after moving the cursor away from the image.
- Keyboard navigation: Use left and right arrow keys to manually rotate images.

## Accessibility

- Keyboard navigation support improves accessibility for users who rely on keyboard input.
- Consider adding alt text to images for screen reader compatibility.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transition effects between images.
3. Allow customization of rotation speed through block options.
4. Add play/pause controls for user-controlled rotation.