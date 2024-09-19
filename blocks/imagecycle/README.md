# Imagecycle

The Imagecycle block is a Franklin component that displays a rotating image carousel with randomized order and interactive features.

## Usage

To use the Imagecycle block, create a table with one column in your Franklin document. The first cell should contain the text "imagecycle", and subsequent cells should each contain one image.

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Insert a table with one column.
2. In the first cell, type "imagecycle".
3. In each subsequent cell, insert one image.
4. Use fully qualified URLs for the images.

| Imagecycle |
|------------|
| [Image 1]  |
| [Image 2]  |
| [Image 3]  |

## Styling

The Imagecycle block uses the following CSS classes for customization:

- `.imagecycle`: Main container
- `.imagecycle-container`: Image container
- `.imagecycle-image`: Individual image wrapper
- `.imagecycle-indicators`: Indicator container
- `.imagecycle-indicator`: Individual indicator

The block has a light blue background by default.

## Behavior

- Images are randomized on load.
- One image is displayed at a time.
- Images rotate every 5 seconds.
- Rotation pauses on hover and resumes when the mouse leaves.
- Supports keyboard navigation (left/right arrow keys).
- Placement indicators allow direct navigation to specific images.

## Dependencies

This block depends on the `createOptimizedPicture` function from the `aem.js` script.

## Accessibility

- Keyboard navigation is supported.
- Indicators have appropriate aria labels.
- Images should include alt text for screen readers.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Allow customization of rotation speed and transition effects.
4. Add option for autoplay on/off toggle.
5. Implement responsive design for various screen sizes.