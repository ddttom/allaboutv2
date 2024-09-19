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
3. Ensure that the image URLs are fully qualified (complete URLs).

## Styling

The Imagecycle block uses the following CSS classes for customization:
- `.imagecycle-container`: Main container for the carousel
- `.imagecycle-image-container`: Container for the images
- `.imagecycle-indicators`: Container for the navigation indicators
- `.imagecycle-indicator`: Individual navigation indicator

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves the carousel.
- Users can navigate manually using the indicators or left/right arrow keys.
- The initial image is randomly selected on load.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML structure for better screen reader compatibility.

## Suggestions for Improvement

1. Add alt text support for images to improve accessibility.
2. Implement touch swipe gestures for mobile devices.
3. Add options for customizing rotation speed and transition effects.
4. Create an option to disable autoplay for users who prefer manual navigation.