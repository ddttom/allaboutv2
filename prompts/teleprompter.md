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

## 1. Initialization

- open a new panel as the viewport
- Inject `teleprompterSVG` in the top left corner of the viewport
- Read all text in the DOM below the block
  - Treat each text element individually
  - Add a new line after each element
  - Treat 'Edge Delivery Services' as one word
  - Break text into lines of maximum 8 words, breaking lines on . or end of line
- Save the processed text list for later use, export the text list to console.log()

## 2. User Interface

- On `teleprompterSVG` click:
  - Clear viewport to solid black
  - Replace `teleprompterSVG` with `stopSVG`
  - addf a large + and - character in middle columns of top line
- Display count-up timer:
  - Position: Top right corner
  - Format: Minutes and seconds
  - Font size: 34px
  - Start immediately on teleprompter activation

## 3. Text Display

- Font: 24 point, white color
- Alignment: Left-aligned
- Position: Current line at fixed marker point in middle of screen height, use markers: right facing arrow one side of the text, text, then left facing arrow. this indicates the current line, subsequent text below
- Special formatting:
- program defensibly  - line may be undefined
  - Text preceded by "**note**": Light gray color
  - Text preceded by "**action**": Yellow color, when this text becomes current line stop processing until spacebar or esc pressed

## 4. Scrolling Mechanism

- Scroll direction: Top to bottom, moving current up one line
- Scroll interval: Every 4 seconds
- if plus key pressed scroll interval increased by 1 second, flash + character in top line
- if minus key pressed scroll interval decreased by 1 second, flash - character in top line
- Scroll behavior: Smooth transition line by line, all text displayed below current line
- Initial display: First line of text as current line, rest of text below always displayed

## 5. Control Mechanisms

- Start/Stop:
  - Click on `stopSVG`
  - Press 'Esc' key
  - Effect: Stop all activity, restore original window
- Pause/Resume:
  - Press spacebar
  - Effect: Toggle pause/resume for scrolling and timer
- Action text behavior:
  - Pause scrolling when action text becomes current line
  - Wait for spacebar press to resume

## 6. Termination

- When text finishes:
  - Stop all processes
  - Wait for `stopSVG` click or 'Esc' key press

## 7. Performance Considerations

- Ensure smooth scrolling animation
- Optimize for minimal impact on page performance

## 8. Accessibility

- Ensure keyboard controls are fully functional
- Consider adding ARIA labels for SVG elements

## 9. Error Handling

- Gracefully handle cases where text content is empty or unavailable
- Provide user feedback for any processing errors

## 10. Responsiveness

- Ensure proper functioning and layout across different viewport sizes
