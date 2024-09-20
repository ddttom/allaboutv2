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
3. Ensure all image URLs are fully qualified.

## Styling

The block uses custom CSS classes for styling. The main container has a light blue background.

## Behavior

- Images are randomized on load.
- Rotates through images every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Supports keyboard navigation (left/right arrow keys).

## Accessibility

- Images have alt text for screen readers.
- Keyboard navigation enhances accessibility for users who can't use a mouse.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transitions between images.
3. Allow customization of rotation speed and background color through metadata.
4. Add play/pause controls for user interaction.