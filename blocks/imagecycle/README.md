# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with automatic and manual navigation options.

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
- `.imagecycle-indicators`: Container for navigation indicators

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves the image.
- Users can navigate using left and right arrow keys.
- Placement indicators show the current image position.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Images should include appropriate alt text for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add options for customizing rotation speed and transition effects.
4. Include caption support for each image.
5. Add play/pause controls for user preference.