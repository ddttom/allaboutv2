# teleprompter

**Goal:** Create a Franklin block named "teleprompter" with the functionalities described below.

![UI Design](teleprompter.png)

* **Initialization:**
  * Read all text content in the DOM below the block.  
  * Join all text together into one line with ' ' in between each join. then create an array  named `processedtext` lines by scanning the result, a new line every 8 words or earlier if a full stop found
  * Save the `processedtext` list for later use.  
  * Export the `processedtext` list to the console using console.log()
* **Text Display:**  
  * Background:black
  * Font: 24 point, white color.  
  * Alignment: Left-aligned.  
  * Special formatting:  
    * Text preceded by "**note**": Display in light gray color.
  * Timer
    * Display a count-up timer in the top right corner:  
    * Format: Minutes and seconds.  
    * Font size: 34px.  
    * Start counting immediately when the teleprompter is activated.  
* **Scrolling Mechanism:**  
  * Scroll direction: Top to bottom, moving the current line up one position.  
  * Trigger scrolling with the mouse wheel.  
  * Smoothly transition line by line.  
  * Display the first line as the current line initially, with the rest of the text visible below.  
* **Control Mechanisms:**  
  * Start/Stop:  
    * Pressing the "Esc" key.  
    * Stop all activity and restore the original window.  
  * Pause/Resume:  
    * Pressing the spacebar.  
    * Toggle pause/resume for the timer, the seconds should stop counting when paused.  
* **Performance:**  
  * Ensure smooth scrolling animation with minimal impact on page performance.  
* **Accessibility:**  
  * Keyboard controls should be fully functional.  
