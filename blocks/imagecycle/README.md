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
- `.imagecycle-container`: Main container for the carousel
- `.imagecycle-image-container`: Container for the images
- `.imagecycle-image`: Wrapper for individual images
- `.imagecycle-indicators`: Container for navigation indicators

## Behavior

- Images are randomized on load.
- The carousel automatically rotates through images every 5 seconds.
- Rotation pauses when the user hovers over the image.
- Rotation resumes immediately after the user moves away from the image.
- Users can navigate manually using left/right arrow keys.

## Dependencies

This block has no external dependencies.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML structure for better screen reader compatibility.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for images to improve accessibility.
4. Create an option for authors to control rotation speed and randomization.