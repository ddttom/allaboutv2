# Image Slider

The Image Slider is a Franklin block that displays a rotating carousel of images with automatic and manual navigation options.

## Usage

To use the Image Slider, create a new block in your Franklin document with the name "imageslider". Add image URLs as separate rows in the block.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| imageslider |
|-------------|
| https://example.com/image1.jpg |
| https://example.com/image2.jpg |
| https://example.com/image3.jpg |

## Styling

The Image Slider uses CSS classes for styling. You can customize the appearance by modifying the `imageslider.css` file.

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses when hovering over the slider.
- Rotation resumes immediately after moving the cursor away from the slider.
- Manual navigation is possible using left and right arrow keys.
- Images are randomly shuffled on load.
- Images are displayed at a fixed height of 400 pixels, with overflow being clipped.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Visual indicators show the current active image.

## Suggestions for Improvement

- Add touch swipe support for mobile devices.
- Implement lazy loading for better performance with many images.
- Add alt text support for better accessibility.
- Consider adding play/pause controls for user preference.