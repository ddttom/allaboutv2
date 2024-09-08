# Slider

A Franklin image slider component that behaves like a carousel.

## Usage

The slider component displays a series of images in a rotating carousel format.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| slider |
|--------|
| https://example.com/image1.jpg |
| https://example.com/image2.jpg |
| https://example.com/image3.jpg |

The first cell should contain "slider", and subsequent rows should contain fully qualified URLs to the images.

## Styling

The component uses the following CSS classes for styling:
- `.slider`: The main container
- `.slider-container`: The image container
- `.slider-indicators`: The container for placement indicators
- `.slider-indicator`: Individual placement indicators

## Behavior

- Images are displayed in a randomized order.
- The slider rotates through each image every 5 seconds.
- Rotation stops when the user hovers over an image and resumes when the mouse leaves.
- Placement indicators show the current image position.

## Accessibility

- Images are set with empty `alt` attributes as they are considered decorative.
- Keyboard navigation is not implemented in this version.

## Suggestions for Improvement

1. Add keyboard navigation for better accessibility.
2. Implement touch swipe functionality for mobile devices.
3. Add options for customizing transition speed and style.
4. Allow for optional captions or titles for each image.
5. Implement lazy loading for better performance with many images.