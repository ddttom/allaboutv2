# Image Slider

This component creates an interactive image slider (carousel) that automatically rotates through a set of images.

## Usage

The Image Slider component displays a series of images in a rotating carousel format. It's ideal for showcasing multiple images in a compact, interactive manner.

## Authoring

In your Franklin document, create a table with the following structure:

| imageslider |
|-------------|
| image_url_1 |
| image_url_2 |
| image_url_3 |
| ...         |

Replace `image_url_1`, `image_url_2`, etc., with the full URLs of the images you want to include in the slider.

## Styling

The component uses CSS classes for styling. You can customize the appearance by modifying the following classes in the `imageslider.css` file:

- `.imageslider`: Main container
- `.imageslider-container`: Image container
- `.imageslider-image`: Image element
- `.imageslider-indicators`: Indicator dots container
- `.indicator`: Individual indicator dot

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses when the user hovers over the image.
- Rotation resumes when the user's cursor leaves the image area.
- Images are randomized on initial load.
- Each image is displayed to fit within a 400-pixel tall space, with vertical positioning randomized.

## Dependencies

This component does not have any external dependencies.

## Accessibility

- The component uses semantic HTML for better screen reader compatibility.
- Keyboard navigation for the slider could be added to improve accessibility.

## Suggestions for Improvement

1. Add keyboard navigation (left/right arrow keys) for manual image switching.
2. Implement touch swipe functionality for mobile devices.
3. Add alt text to images for better accessibility.
4. Create options for different transition effects between images.
5. Allow customization of rotation speed and image size through block parameters.
