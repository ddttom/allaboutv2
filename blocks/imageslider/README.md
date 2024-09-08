# Image Slider

The Image Slider component is a responsive, interactive image carousel that displays a series of images in a rotating manner.

## Usage

To use the Image Slider component, create a table in your Franklin document with the following structure:

| imageslider |
|-------------|
| [Image URL] |
| [Image URL] |
| [Image URL] |

Each row after the header should contain either an image element or an anchor element with an href pointing to the image URL.

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with "imageslider" in the first cell.
2. In subsequent rows, add image URLs or embed images directly.
3. Ensure all image URLs are fully qualified (complete URLs).

## Styling

The component uses CSS classes for styling. You can customize the appearance by modifying the following classes in the `imageslider.css` file:

- `.imageslider-container`
- `.imageslider-image`
- `.imageslider-indicators`
- `.imageslider-dot`

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation stops when the user hovers over the image.
- Rotation resumes immediately after the user moves the cursor away, showing the next image.
- Users can manually navigate using the indicator dots or left/right arrow keys.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML elements for better screen reader compatibility.

## Dependencies

This component does not have any external dependencies.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for better accessibility.
4. Include options for different transition effects.
5. Allow customization of rotation speed and behavior through metadata.