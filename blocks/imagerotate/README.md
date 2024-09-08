# Image Rotate

The Image Rotate block is a Franklin (Adobe Edge Delivery Services) component that displays a rotating carousel of images.

## Usage

This block automatically rotates through a set of images, displaying one image at a time. It includes navigation indicators and responds to user interactions.

## Authoring

In your Google Docs or Microsoft Word document, create a table with the following structure:

| Image Rotate |
|--------------|
| [Image 1 URL] |
| [Image 2 URL] |
| ... |

- The first cell should contain "Image Rotate"
- Each subsequent row should contain an image URL or an `<a>` tag with an `href` attribute containing the image URL

## Styling

The component uses the following CSS classes for customization:
- `.imagerotate-container`: The main container
- `.imagerotate-image`: The displayed image
- `.imagerotate-indicators`: Container for navigation indicators
- `.imagerotate-indicator`: Individual navigation indicator

## Behavior

- Images rotate automatically every 5 seconds
- Rotation pauses on hover and resumes when the mouse leaves
- Clicking on an indicator displays the corresponding image
- Supports keyboard navigation with left and right arrow keys

## Accessibility

- Keyboard navigation is supported for manual image rotation
- Visual indicators show the current active image

## Suggestions for Improvement

1. Add alt text support for better accessibility
2. Implement touch swipe gestures for mobile devices
3. Add options for customizing rotation speed and transition effects
4. Implement lazy loading for better performance with many images
5. Add support for captions or titles for each image