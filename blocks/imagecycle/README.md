# imagecycle

A block that cycles through a list of images, displaying one at a time with rotation every 5 seconds. Includes hover and keyboard navigation controls.

## Usage

1. Create a table with the first cell as "imagecycle".
2. Add subsequent rows with image URLs.

## Authoring

- Use Google Docs or Microsoft Word to create the table.
- Ensure the first cell is "imagecycle" and subsequent cells contain image URLs.

## Styling

- `.imagecycle-container`: Container for the image.
- `.imagecycle-indicator`: Container for the placement indicators.
- `.dot`: Individual placement indicator.
- `.dot.active`: Active placement indicator.

## Behavior

- Rotates images every 5 seconds.
- Stops rotation on hover, resumes on mouse out.
- Supports left/right arrow keys for manual navigation.

## Accessibility

- Keyboard navigation with left/right arrow keys.
- Visual indicators for current image.