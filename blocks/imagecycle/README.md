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
3. Ensure all image URLs are fully qualified (complete URLs).

## Styling

The block uses custom CSS classes for styling. The main container has a light blue background. You can customize the appearance by modifying the CSS file.

## Behavior

- Images are randomized on load.
- The carousel automatically rotates every 5 seconds.
- Rotation pauses when the user hovers over an image.
- Rotation resumes immediately after the user moves away from the image.
- Users can navigate using left/right arrow keys.

## Accessibility

- Keyboard navigation is supported for manual image rotation.
- Images have alt text for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add options for different transition effects.
4. Allow customization of rotation speed and background color through block parameters.