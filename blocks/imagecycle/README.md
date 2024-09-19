# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized images.

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
3. Ensure that the image URLs are fully qualified (starting with "https://").

## Styling

The Imagecycle block uses the following CSS classes for customization:
- `.imagecycle-container`
- `.imagecycle-image-container`
- `.imagecycle-image`
- `.imagecycle-indicators`
- `.imagecycle-indicator`

## Behavior

- Images are randomized on load.
- The carousel rotates through images every 5 seconds.
- Rotation stops when hovering over the image and resumes immediately after moving away.
- Clicking on indicators allows manual image selection.
- Keyboard navigation is supported using left and right arrow keys.

## Accessibility

- Keyboard navigation is supported for manual image rotation.
- The component uses semantic HTML structure for better screen reader compatibility.

## Suggestions for Improvement

1. Add alt text support for images to improve accessibility.
2. Implement touch swipe gestures for mobile devices.
3. Add options for customizing rotation speed and transition effects.
4. Implement lazy loading for better performance with many images.
5. Add support for captions or descriptions for each image.