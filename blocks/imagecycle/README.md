# Imagecycle

The Imagecycle block displays a rotating set of images with optional links, featuring automatic cycling and manual navigation controls.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| Imagecycle |
|------------|
| ![Image 1](https://example.com/image1.jpg) |
| [![Image 2](https://example.com/image2.jpg)](https://example.com/link2) |
| ![Image 3](https://example.com/image3.jpg) |

## Authoring

1. Create a table in Google Docs or Microsoft Word.
2. Set the first cell of the first row to "Imagecycle".
3. In subsequent rows, add images or linked images:
   - For a simple image, insert an image in the cell.
   - For a linked image, insert an image and apply a hyperlink to it.

## Styling

The block uses the following CSS classes for customization:
- `.imagecycle-container`: Main container for the block
- `.imagecycle-image`: The displayed image
- `.imagecycle-indicators`: Container for the indicator dots
- `.imagecycle-indicator`: Individual indicator dot

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Clicking a linked image navigates to the specified URL.
- Use left/right arrow keys for manual navigation.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The main image has an alt text of "Cycling image" for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement fade transition effects between images.
3. Allow customization of rotation speed through block options.
4. Add play/pause controls for user interaction.