# Imagecycle

The Imagecycle block is a component that displays a rotating carousel of images with manual and automatic navigation options.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| Imagecycle |
| --- |
| ![Image 1](https://example.com/image1.jpg) |
| ![Image 2](https://example.com/image2.jpg) |
| ![Image 3](https://example.com/image3.jpg) |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with one column.
2. The first cell should contain the text "Imagecycle".
3. Each subsequent cell should contain an image or a link to an image.

## Styling

The Imagecycle block uses the following CSS classes for customization:

- `.imagecycle`: The main container for the block
- `.imagecycle-container`: The container for the images
- `.imagecycle-image`: The image element
- `.imagecycle-indicators`: The container for navigation indicators
- `.imagecycle-indicator`: Individual navigation indicator

## Behavior

- Images rotate automatically every 5 seconds.
- Hovering over an image stops the rotation.
- Moving the cursor off the image resumes rotation and immediately moves to the next image.
- Click on indicators to manually navigate to a specific image.
- Use left and right arrow keys for keyboard navigation.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- Visual indicators show the current active image.

## Suggestions for Improvement

1. Add alt text to images for better accessibility.
2. Implement touch swipe gestures for mobile devices.
3. Add options for customizing rotation speed and transition effects.
4. Implement lazy loading for better performance with many images.
5. Add support for captions or descriptions for each image.