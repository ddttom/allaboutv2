# Image Slider

This component creates an interactive image slider that rotates through a set of images.

## Usage

The Image Slider component can be added to a Franklin page using a table structure in a Google Doc or Microsoft Word document.

## Authoring

Create a table with the following structure:

| imageslider |
|-------------|
| [Image URL] |
| [Image URL] |
| [Image URL] |

- The first cell should contain "imageslider" to identify the block.
- Subsequent rows should contain either fully qualified image URLs or `<a>` elements with `href` attributes pointing to image URLs.

## Styling

The component uses the following CSS classes for styling:

- `.imageslider-container`: The main container for the slider.
- `.imageslider-image`: The image element.
- `.imageslider-indicators`: Container for the indicator dots.
- `.indicator`: Individual indicator dots.

## Behavior

- Images are displayed one at a time and rotate every 5 seconds.
- Images are randomized on load.
- Rotation stops when the user hovers over the image and resumes immediately after moving away.
- Keyboard navigation is supported using left and right arrow keys.

## Accessibility

- Keyboard navigation enhances accessibility for users who cannot use a mouse.
- Consider adding appropriate ARIA labels to improve screen reader compatibility.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for images to improve accessibility.
4. Create options for different transition effects between images.
5. Allow customization of rotation speed and other parameters.
