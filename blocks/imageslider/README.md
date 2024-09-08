# Imageslider

The Imageslider component is a carousel-style image slider for Franklin (Adobe Edge Delivery Services) projects.

## Usage

Use this component to display a rotating set of images in a visually appealing manner.

## Authoring

In your Franklin document, create a table with the following structure:

| imageslider |
|-------------|
| image1_url  |
| image2_url  |
| image3_url  |
| ...         |

Replace `image1_url`, `image2_url`, etc., with the full URLs of the images you want to display in the slider.

## Styling

The component uses CSS classes for styling. You can customize the appearance by modifying the `imageslider.css` file.

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves the slider.
- Clicking on an indicator dot jumps to the corresponding image.
- Left and right arrow keys can be used for manual navigation.
- The initial image is randomly selected on load.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Images have appropriate alt text for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add options for different transition effects.
4. Allow customization of rotation speed and behavior through metadata.