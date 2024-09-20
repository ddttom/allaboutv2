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
- `.imagecycle-container`: Carousel container
- `.imagecycle-image-container`: Image display area (includes a 2px border)
- `.imagecycle-indicators`: Navigation indicators
- `.imagecycle-arrow`: Navigation arrows

The image is displayed within a container that has a 2px solid border, providing a frame-like effect.

## Behavior

- Images are randomized on load.
- Automatic rotation occurs every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Manual navigation is possible using left/right arrow keys or on-screen arrows.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Visual indicators show the current active image.
- On-screen arrows provide additional navigation options.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for better accessibility.
4. Create options for different transition effects.
5. Allow customization of rotation speed and behavior through metadata.
6. Implement ARIA labels for improved screen reader support.