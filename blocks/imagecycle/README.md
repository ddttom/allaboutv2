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
- `.imagecycle-wrapper`: Container for images
- `.imagecycle-image`: Individual image container
- `.imagecycle-indicators`: Container for placement indicators
- `.imagecycle-indicator`: Individual placement indicator

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation stops when hovering over the image.
- Rotation resumes immediately after moving the cursor away from the image.
- Users can navigate manually using left and right arrow keys.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Visual indicators show the current image position.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for better accessibility.
4. Create options for customizing rotation speed and transition effects.