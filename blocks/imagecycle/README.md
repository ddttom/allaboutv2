# Imagecycle

The Imagecycle block is a component that displays a rotating carousel of images with automatic and manual navigation options.

## Usage

To use the Imagecycle block, create a table in your Franklin document with the following structure:

| imagecycle |
|------------|
| [Image 1 URL] |
| [Image 2 URL] |
| [Image 3 URL] |
| ... |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with "imagecycle" in the first cell.
2. In subsequent rows, add fully qualified URLs to the images you want to display.
3. You can also use `<a>` tags with `href` attributes containing image URLs.

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the following classes in the `imagecycle.css` file:

- `.imagecycle`: Main container styles
- `.imagecycle-container`: Image container styles
- `.imagecycle-image`: Image styles
- `.imagecycle-indicators`: Indicator container styles
- `.imagecycle-indicator`: Individual indicator styles

## Behavior

- Images rotate automatically every 5 seconds.
- Hovering over an image pauses the rotation.
- Moving the cursor off the image resumes rotation and immediately shows the next image.
- Click on indicators to manually select an image.
- Use left and right arrow keys for manual navigation.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The component uses semantic HTML elements for better screen reader compatibility.

## Suggestions for Improvement

1. Add alt text support for images to improve accessibility.
2. Implement touch swipe gestures for mobile devices.
3. Add options for customizing rotation speed and transition effects.
4. Implement lazy loading for better performance with many images.
5. Add support for captions or titles for each image.