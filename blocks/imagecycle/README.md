# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized order and interactive features.

## Usage

To use the Imagecycle block, create a table with one column in your Franklin document. The first cell should contain the text "imagecycle", and subsequent cells should each contain one image.

## Authoring

When creating content for the Imagecycle block in Google Docs or Microsoft Word:

1. Insert a table with one column.
2. In the first cell, type "imagecycle".
3. In each subsequent cell, insert one image.
4. Use fully qualified URLs for the images.

| imagecycle |
|------------|
| [Image 1]  |
| [Image 2]  |
| [Image 3]  |

## Styling

The Imagecycle block uses the following CSS classes for customization:

- `.imagecycle`: Main container
- `.imagecycle-container`: Wrapper for images and indicators
- `.imagecycle-image-container`: Container for the current image
- `.imagecycle-indicators`: Container for placement indicators

You can customize the appearance by modifying these classes in your project's CSS.

## Behavior

- Images are displayed in a randomized order.
- One image is shown at a time.
- Images rotate automatically every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Supports keyboard navigation using left and right arrow keys.

## Dependencies

This block depends on the `aem.js` script for image optimization.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Visual indicators show the current image position.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for better accessibility.
4. Create options for different transition effects.