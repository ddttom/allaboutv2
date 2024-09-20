# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized images.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| Imagecycle |
|------------|
| [Image 1]  |
| [Image 2]  |
| [Image 3]  |
| ...        |

## Authoring

1. In Google Docs or Microsoft Word, create a table with "Imagecycle" in the first cell.
2. Add images to subsequent rows of the table.
3. Ensure all image URLs are fully qualified.

## Styling

The block uses custom CSS classes for styling. The main container has a light blue background.

## Behavior

- Images are randomized on load.
- The carousel automatically rotates through images every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Users can navigate using left/right arrow keys.

## Accessibility

- Images have appropriate alt text.
- Keyboard navigation is supported.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transitions between images.
3. Allow customization of rotation speed and background color.
4. Add play/pause controls for user interaction.