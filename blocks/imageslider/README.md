# Image Slider

The Image Slider is a Franklin block that displays a rotating carousel of images with automatic and manual navigation options.

## Usage

To use the Image Slider, create a table in your Franklin document with the following structure:

| imageslider |
|-------------|
| image_url_1 |
| image_url_2 |
| image_url_3 |
| ...         |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with one column.
2. The first cell should contain "imageslider" (without quotes).
3. Each subsequent cell should contain a fully qualified URL to an image.

## Styling

The Image Slider uses the following CSS classes for customization:
- `.imageslider-container`: The main container for the slider.
- `.imageslider-image`: The image element.
- `.imageslider-indicators`: The container for placement indicators.
- `.indicator`: Individual placement indicator dots.

## Behavior

- Images are displayed one at a time and rotate automatically every 5 seconds.
- Images are randomized on load.
- Hovering over the image stops the rotation.
- Moving the cursor off the image immediately advances to the next image and resumes rotation.
- Left and right arrow keys can be used for manual navigation.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML elements for better screen reader compatibility.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for images to improve accessibility.
4. Create options for different transition effects between images.
5. Allow customization of rotation speed and image size through block metadata.