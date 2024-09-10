# Enhanced Teleprompter Block

**Goal:** Create an advanced Franklin block named "teleprompter" with the following functionalities and improvements.

* Design Suggestion
![UI Design](teleprompter.png)

## Content Processing

* Read all text content in the DOM below the block.
* Store each text node's content as a separate line in an array called `allLines`.
* Extract the first `<h1>` element as the title.

## Display

* Background: Semi-transparent black (rgba(0, 0, 0, 0.8))
* Dimensions: 80% width, max-width 800px, height 400px
* Position: Fixed, centered on screen
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
  * Automatically start when the block is loaded
* Stop:
  * Press the "Esc" key
  * Hides the teleprompter
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

## Additional Features

* Handle empty content gracefully
* Prevent text from being cut off by using word-wrap
