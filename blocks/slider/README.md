# Slider

The Slider component is an image carousel that displays a series of images in a rotating manner.

## Usage

To use the Slider component, create a table in your Franklin document with the following structure:

| slider |
|--------|
| image1_url |
| image2_url |
| image3_url |
| ... |

## Authoring

1. In your Franklin document (Google Docs or Microsoft Word), create a table with one column.
2. The first cell should contain the text "slider".
3. In subsequent rows, add one image URL per cell.

## Styling

The Slider component uses the following CSS classes for styling:

- `.slider-container`: The main container for the slider.
- `.slider-image-container`: Container for the sliding images.
- `.slider-slide`: Individual slide container.
- `.slider-indicators`: Container for the indicator dots.
- `.slider-indicator`: Individual indicator dot.

You can customize these classes in your project's CSS to modify the appearance of the slider.

## Behavior

- Images are randomized on load.
- The slider automatically rotates through images every 15 seconds.
- Rotation pauses when the user hovers over the slider and resumes when the mouse leaves.
- Users can click on indicator dots to navigate to specific slides.

## Accessibility

- Indicator buttons have appropriate aria-labels for screen readers.
- The slider is keyboard navigable through the indicator buttons.

## Suggestions for Improvement

1. Add left and right navigation arrows for manual control.
2. Implement touch swipe functionality for mobile devices.
3. Add an option to control the rotation speed through metadata.
4. Implement lazy loading for better performance with many images.
5. Add caption support for each image.