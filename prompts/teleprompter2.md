# Enhanced Teleprompter Block

## AI Prompt, (c) Tom Cranstoun , 10 Sep 2024, V 1.0

**Goal:** Create an advanced Franklin block named "teleprompter2" with the following functionalities and improvements.

## Initial State

* Display a clickable icon on the page when the document loads
* The teleprompter should not be visible until activated
* Icon design:
  * Use a simple, recognizable teleprompter or text icon (Unicode: &#128217;)
  * Position: Fixed, top left corner of the viewport
  * Size: 48x48 pixels
  * Hover effect: Slight enlargement and opacity change

## Content Processing

* Read all text content in the DOM below the block
* Store each text node's content as a separate line in an array called `allLines`
* Extract the first `<h1>` element as the title

## Display

* Background: Semi-transparent black (rgba(0, 0, 0, 0.8))
* Dimensions: 80% width, max-width 800px, height 400px
* Position: Fixed, centered on screen when activated
* Title:
  * Display at the top of the teleprompter
  * Font: 24px, bold, centered
* Text Display:
  * Font: 20px (base), white color
  * Alignment: Left-aligned
  * Current Line:
    * Font: 28px, bold
    * Displayed at the top
  * Gap: 20px space after the current line
  * Next 3 Lines:
    * Font: 24px
    * Opacity: 0.7 (slightly dimmed)
* Timer:
  * Position: Top right corner
  * Format: Minutes and seconds (MM:SS)
  * Font: 18px
  * Background: Semi-transparent black

## Scrolling Mechanism

* Scroll direction: Bottom to top (new lines appear at the bottom)
* Triggers:
  * Mouse wheel
  * Arrow keys (Up/Down/Left/Right)
* Smooth transition between lines

## Control Mechanisms

* Start:
  * Click on the teleprompter icon
* Stop:
  * Press the "Esc" key
  * Hides the teleprompter and shows the icon again
* Pause/Resume:
  * Press the spacebar
  * Display "PAUSED" message when paused
  * Timer stops counting when paused

## Draggable Functionality

* Make the entire teleprompter draggable
* Use the teleprompter background as the drag handle
* Exclude the text content area from initiating drag

## Styling

* Cursor:
  * 'move' for draggable areas
  * 'default' for text content area
* User selection:
  * Disabled for draggable areas
  * Enabled for text content

## Performance

* Ensure smooth scrolling and dragging with minimal impact on page performance
* Use requestAnimationFrame for timer updates

## Accessibility

* Make the teleprompter focusable
* Ensure all keyboard controls are fully functional
* Add aria labels to the icon for screen readers

## Additional Features

* Handle empty content gracefully
* Prevent text from being cut off by using word-wrap

## Icon Behavior

* When clicked, hide the icon and show the teleprompter
* When teleprompter is closed (Esc key), hide the teleprompter and show the icon again
* Provide a smooth transition between icon and teleprompter states

## Error Handling

* Display a message if no content is available for the teleprompter

Note: Ensure that the teleprompter remains hidden until explicitly activated by clicking the icon.

[//]: # Comments
[//]: # EVERYTHING BELOW IS DOCUMENTATION IGNORE

[//]:#  Version History

[//]: # V 1.0 (10 Sep 2024): Initial release, Tom Cranstoun

[//]: # Dependencies

[//]: # Franklin Core Library (aem.js)
[//]: # * o external libraries required

[//]: #  ## Configuration Options

[//]: #   `scrollSpeed`: Adjusts the speed of text scrolling (default: 1)
[//]: #   `fontSize`: Base font size for the teleprompter text (default: 20px)

[//]: # ## Event Handling

[//]: #  `teleprompter:start`: Fired when the teleprompter starts
[//]: #  `teleprompter:stop`: Fired when the teleprompter stops
[//]: #  `teleprompter:pause`: Fired when the teleprompter is paused

[//]: # ## Performance Considerations

[//]: # Uses `requestAnimationFrame` for smooth scrolling and timer updates
[//]: # Implements efficient DOM manipulation to minimize reflows

[//]: #  ## Browser Compatibility

[//]: # Supports latest versions of Chrome, Firefox, Safari, and Edge
[//]: # IE11 is not supported

[//]: # ## Troubleshooting

[//]: # If the teleprompter doesn't appear, ensure the icon is properly loaded
[//]: # For scrolling issues, check if the content is properly parsed into `allLines` array

[//]: # ## Contributing Guidelines

[//]: # 1. Fork the repository
[//]: # 2. Create a feature branch
[//]: # 3. Submit a pull request with a clear description of changes

[//]: # Note: Always test thoroughly after making changes to ensure compatibility and performance across supported browsers.
