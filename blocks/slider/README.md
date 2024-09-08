# Slider

The Slider component is an image carousel that displays a series of images in a rotating manner.

## Usage

To use the Slider component, create a table in your Franklin document with the first cell containing "slider" and subsequent rows containing URLs to images.

## Authoring

1. In your Franklin document (Google Docs or Microsoft Word), create a table.
2. In the first cell of the table, enter "slider".
3. In each subsequent row, add a single cell with an image URL.

| slider |
|--------|
| https://example.com/image1.jpg |
| https://example.com/image2.jpg |
| https://example.com/image3.jpg |

## Styling

The Slider component uses the following CSS classes for styling:

- `.slider`: The main container for the slider
- `.slider-container`: Contains all the slides
- `.slider-slide`: Individual slide container
- `.slider-indicators`: Container for slide indicators

You can customize the appearance by modifying these classes in the `slider.css` file.

## Behavior

- Images are randomized on load.
- The slider automatically rotates through images every 15 seconds.
- Rotation pauses when the user hovers over an image and resumes when the mouse leaves.
- Users can manually navigate using the indicator buttons.

## Accessibility

- Indicator buttons have appropriate aria-labels for screen readers.
- The slider is keyboard navigable.

## Suggestions for Improvement

1. Add touch swipe support for mobile devices.
2. Implement lazy loading for better performance with many images.
3. Add options for different transition effects.
4. Allow customization of rotation speed through authoring.