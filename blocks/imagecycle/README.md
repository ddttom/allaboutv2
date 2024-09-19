# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized order and interactive features.

## Usage

To use the Imagecycle block, create a table with one column in your Franklin document. The first cell should contain the text "imagecycle", and subsequent cells should each contain one image.

| Imagecycle |
|------------|
| ![Image 1](https://example.com/image1.jpg) |
| ![Image 2](https://example.com/image2.jpg) |
| ![Image 3](https://example.com/image3.jpg) |

## Authoring

When creating content in Google Docs or Microsoft Word:
1. Insert a table with one column.
2. In the first cell, type "imagecycle".
3. In each subsequent cell, insert an image.

## Styling

The Imagecycle block uses the following CSS classes for customization:
- `.imagecycle`: Main container
- `.imagecycle-container`: Wrapper for images and indicators
- `.imagecycle-image-container`: Container for the current image
- `.imagecycle-indicators`: Container for placement indicators

## Behavior

- Images are randomized on load.
- One image is displayed at a time.
- Images rotate every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Supports keyboard navigation (left/right arrow keys).

## Dependencies

This block depends on the `createOptimizedPicture` function from the `aem.js` script.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Images should have appropriate alt text for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Allow customization of rotation speed through block options.
4. Add play/pause controls for user interaction.