# Betty Carousel Block

The Betty Carousel Block is a sliding carousel component for Adobe Edge Delivery Services (EDS) projects. It provides a simple and customizable way to display a series of slides with automatic advancement and navigation controls.

## Features

- Responsive design
- Automatic slide advancement
- Previous and Next navigation buttons
- Accessibility-friendly
- Smooth transitions between slides

## Usage

To use the Betty Carousel Block in your EDS project, follow these steps:

1. Copy the `betty` folder into your project's `blocks` directory.
2. In your content document, create a block with the class `betty`:

   ```html
   <div class="betty">
     <div>Slide 1 content</div>
     <div>Slide 2 content</div>
     <div>Slide 3 content</div>
   </div>
   ```

3. Each direct child of the `betty` block will become a slide in the carousel.

## Customization

You can customize the appearance and behavior of the Betty Carousel by modifying the `betty.css` file. Some customization options include:

- Changing the transition duration and timing function
- Adjusting the navigation button styles
- Modifying the auto-advance interval (currently set to 5 seconds)

## Accessibility

The Betty Carousel includes basic accessibility features:

- Navigation buttons have appropriate `aria-label` attributes
- Slides use `aria-hidden` to indicate which slide is currently visible

## Performance Considerations

The Betty Carousel is designed to be lightweight and performant. It uses vanilla JavaScript and CSS transitions for smooth animations. The carousel initializes lazily when the block is decorated, ensuring it doesn't impact the initial page load.

## Browser Support

The Betty Carousel should work in all modern browsers that support CSS Flexbox and ES6 JavaScript features.
