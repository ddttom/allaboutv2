# Slider

The Slider component is an image carousel that displays a rotating set of images.

## Usage

To use the Slider component, create a table in your Franklin document with the following structure:

| slider |
|--------|
| [Image URL 1] |
| [Image URL 2] |
| [Image URL 3] |
| ... |

## Authoring

1. In your Franklin document (Google Docs or Microsoft Word), create a table.
2. Set the first cell of the table to "slider".
3. In subsequent rows, add one image URL per cell.

## Styling

The Slider component uses the following CSS classes for customization:
- `.slider-container`: Main container for the slider
- `.slider-image-container`: Container for the images
- `.slider-indicators`: Container for the placement indicators

## Behavior

- Images are randomized on load.
- The slider rotates through each image every 15 seconds.
- Rotation stops when the user hovers over the image and resumes when the user moves away.
- Placement indicators show the current active image.

## Dependencies

This component uses the `createOptimizedPicture` function from the `aem.js` script.

## Accessibility

- The slider uses `aria-hidden` attributes to hide non-active images from screen readers.
- Keyboard navigation for the slider should be implemented for better accessibility.

## Suggestions for Improvement

1. Add keyboard navigation to allow users to move through images using arrow keys.
2. Implement touch swipe functionality for mobile devices.
3. Add alt text support for images to improve accessibility.
4. Create an option to display captions for each image.
5. Allow customization of rotation speed through authoring.