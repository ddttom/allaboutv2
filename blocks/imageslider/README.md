# Image Slider

A responsive image slider component for Franklin (Adobe Edge Delivery Services) projects.

## Usage

This component creates an image slider that automatically rotates through a set of images every 5 seconds. It includes placement indicators and pauses on hover.

## Authoring

In your Franklin document, create a table with the following structure:

| imageslider |
|-------------|
| image_url_1 |
| image_url_2 |
| image_url_3 |
| ...         |

Replace `image_url_x` with the full URL of each image you want to include in the slider.

## Styling

The component uses the following CSS classes for styling:

- `.imageslider-container`: The main container for the slider
- `.imageslider-image`: The image element
- `.imageslider-indicators`: Container for the indicator dots
- `.indicator`: Individual indicator dots

You can customize these classes in the `imageslider.css` file.

## Behavior

- Images rotate automatically every 5 seconds
- Rotation pauses on hover and resumes when the mouse leaves
- Clicking on an indicator dot jumps to the corresponding image
- Supports keyboard navigation with left and right arrow keys

## Accessibility

- Keyboard navigation is supported for manual image switching
- Images have appropriate alt text for screen readers

## Suggestions for Improvement

1. Add touch swipe support for mobile devices
2. Implement lazy loading for better performance with many images
3. Add options for different transition effects between images
4. Allow customization of rotation speed and other parameters through block metadata