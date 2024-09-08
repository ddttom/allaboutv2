# Imagerotate

The Imagerotate block is a Franklin widget that displays a rotating image gallery with automatic and manual navigation options.

## Usage

To use the Imagerotate block, create a table in your Franklin document with the following structure:

| Imagerotate |
|-------------|
| Image 1 URL |
| Image 2 URL |
| Image 3 URL |
| ...         |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with at least two rows.
2. The first cell of the first row should contain "Imagerotate" (without quotes).
3. Each subsequent row should contain a fully qualified URL to an image.

## Styling

The Imagerotate block uses the following CSS classes for styling:

- `.imagerotate-container`: The main container for the image rotation widget.
- `.imagerotate-image`: The image element.
- `.imagerotate-indicators`: The container for placement indicators.
- `.imagerotate-indicator`: Individual placement indicator dots.

You can customize the appearance by modifying these classes in your project's CSS.

## Behavior

- Images rotate automatically every 5 seconds.
- Rotation stops when the user hovers over the image.
- Rotation resumes immediately after the user moves the cursor away from the image.
- Users can navigate through images using left and right arrow keys.

## Accessibility

- Keyboard navigation is supported using left and right arrow keys.
- The current image is indicated visually using placement indicators.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add alt text support for images to improve accessibility.
4. Create an option to customize rotation speed and transition effects.