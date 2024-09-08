# Slider

The Slider component is an image carousel that displays a series of images in a rotating manner.

## Usage

To use the Slider component, create a table in your Franklin document with the following structure:

| slider |
|--------|
| [Image URL 1] |
| [Image URL 2] |
| [Image URL 3] |
| ... |

## Authoring

1. In your Google Docs or Microsoft Word document, create a table with one column.
2. The first cell should contain the text "slider".
3. In subsequent rows, add fully qualified URLs to the images you want to include in the slider.

## Styling

The slider can be customized using CSS variables. The main classes used are:

- `.slider-container`: The main container for the slider
- `.slider-image-container`: Container for the images
- `.slider-indicators`: Container for the placement indicators

## Behavior

- Images are randomized on load.
- The slider automatically rotates through images every 15 seconds.
- Rotation stops when the user hovers over the image and resumes when the mouse leaves.
- Placement indicators show the current active image.

## Dependencies

This component does not have any external dependencies.

## Accessibility

- Images have alt text for screen readers.
- The slider can be navigated using keyboard controls (to be implemented).

## Suggestions for Improvement

1. Add keyboard navigation for better accessibility.
2. Implement touch swipe functionality for mobile devices.
3. Add options for different transition effects.
4. Allow customization of rotation speed through authoring.
5. Implement lazy loading for better performance with many images.
