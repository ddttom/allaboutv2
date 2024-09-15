# Import Image Viewer Block

This block represents the image viewer of the imported Adobe Lightroom gallery design.

## Usage

The Import Image Viewer block creates a full-screen image viewer with a close button.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word. The block content is generated programmatically.

## Styling

The block uses the following CSS classes:
- `.import-image-viewer`: Main container
- `.import-image-viewer-close`: Close button

Custom styling can be applied by modifying the `import-image-viewer.css` file.

## Behavior

The image viewer appears when activated and can be closed using the close button.

## Accessibility

- The close button is keyboard accessible.
- The viewer traps focus when open for better keyboard navigation.

## Suggestions for Improvement

1. Add support for image zooming and panning.
2. Implement left/right navigation for browsing through multiple images.
3. Add touch swipe support for mobile devices.
4. Implement preloading of adjacent images for smoother navigation.