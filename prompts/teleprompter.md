# teleprompter

Create a franklin block named teleprompter

use the following JS after export default async function decorate(block) has been opened

```js
const teleprompterSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Camera body -->
  <rect x="60" y="70" width="80" height="60" fill="#333333" />
  
  <!-- Lens -->
  <circle cx="100" cy="100" r="20" fill="#4a4a4a" />
  <circle cx="100" cy="100" r="15" fill="#333333" />
  
  <!-- Teleprompter screen -->
  <rect x="40" y="40" width="120" height="90" fill="#87CEEB" stroke="#000000" stroke-width="2" />
  
  <!-- Text lines on screen -->
  <line x1="50" y1="60" x2="150" y2="60" stroke="#000000" stroke-width="2" />
  <line x1="50" y1="80" x2="150" y2="80" stroke="#000000" stroke-width="2" />
  <line x1="50" y1="100" x2="150" y2="100" stroke="#000000" stroke-width="2" />
  
  <!-- Stand -->
  <rect x="90" y="130" width="20" height="40" fill="#555555" />
  <rect x="70" y="170" width="60" height="10" fill="#555555" />
</svg>`;>

const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <!-- White background circle -->
    <circle cx="300" cy="300" r="290" fill="white" />
    
    <!-- Red border -->
    <circle cx="300" cy="300" r="290" fill="none" stroke="#c1121f" stroke-width="20" />
    
    <!-- STOP text -->
    <text x="300" y="330" font-family="Arial, sans-serif" font-size="140" font-weight="bold" text-anchor="middle" fill="black">STOP</text>
  </svg>`;

```

![Teleprompter UI Design](teleprompter.png)

**Goal:** Create a Franklin block named "teleprompter" with the functionalities described below.

**Functionality:**

* **Initialization:**  
  * Open a new panel as the viewport.  
  * Inject the provided teleprompterSVG code in the top left corner of the viewport.  
  * Read all text content in the DOM below the block.  
    * Treat each text element individually.  
    * Combine "Edge Delivery Services" into one word.  
    * Break text into lines with a maximum of 8 words each, considering periods (".") and line breaks.  
  * Save the processed text list for later use.  
  * Export the processed text list to the console using console.log().  
* **User Interface:**  
  * On click of the teleprompterSVG:  
    * Clear the viewport to a solid black background.  
    * Replace the teleprompterSVG with the provided stopSVG code.
  * Display a count-up timer in the top right corner:  
    * Format: Minutes and seconds.  
    * Font size: 34px.  
    * Start immediately when the teleprompter is activated.  
* **Text Display:**  
  * Font: 24 point, white color.  
  * Alignment: Left-aligned.  
  * Special formatting:  
    * Text preceded by "**note**": Display in light gray color.  
  * Handle potential undefined variables gracefully.  
* **Scrolling Mechanism:**  
  * Scroll direction: Top to bottom, moving the current line up one position.  
  * Trigger scrolling with the mouse wheel.  
  * Smoothly transition line by line.  
  * Display the first line as the current line initially, with the rest of the text visible below.  
* **Control Mechanisms:**  
  * Start/Stop:  
    * Clicking on the stopSVG.  
    * Pressing the "Esc" key.  
    * Stop all activity and restore the original window.  
  * Pause/Resume:  
    * Pressing the spacebar.  
    * Toggle pause/resume for the timer.  
* **Termination:**  
  * When the text finishes scrolling:  
    * Stop all processes.  
    * Wait for a click on the stopSVG or press of the "Esc" key.  
* **Performance:**  
  * Ensure smooth scrolling animation with minimal impact on page performance.  
* **Accessibility:**  
  * Keyboard controls should be fully functional.  
  * Consider adding ARIA labels for the SVG elements.  
* **Error Handling:**  
  * Handle cases with empty or unavailable text content gracefully.  
  * Provide user feedback for any processing errors.  
* **Responsiveness:**  
  * Ensure proper functioning and layout across different viewport sizes.

**Additional Notes:**

* The provided code snippets (teleprompterSVG and stopSVG) should be included as strings within the prompt.  
