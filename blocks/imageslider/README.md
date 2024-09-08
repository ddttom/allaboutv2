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
- `.imageslider`: The main container
- `.imageslider-container`: The image and indicators container
- `.imageslider-image`: The displayed image
- `.imageslider-indicators`: The container for indicator dots
- `.indicator`: Individual indicator dots

## Behavior

- Images are displayed one at a time and rotate automatically every 5 seconds.
- Hovering over the image pauses the rotation.
- Moving the cursor off the image resumes rotation and immediately moves to the next image.
- Keyboard navigation is supported using left and right arrow keys.
- Images are randomized on initial load.
- Images are clipped to fit within a 400-pixel tall space.

## Accessibility

- Keyboard navigation is supported for manual image switching.
- The alt text for images is set to "Slider image" for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Allow customization of rotation speed and image height through metadata.
4. Add aria-labels and roles for better screen reader support.
5. Implement smooth transitions between images.