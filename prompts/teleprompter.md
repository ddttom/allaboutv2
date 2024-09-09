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

The code should read all text in the DOM below the block, saving text for later display.
The block should inject the contents of teleprompterSVG  in the top left corner of the viewport.
when the teleprompterSVG is clicked, the viewport should be cleared to solid black replacing the teleprompterSVG with the stopSVG.
A count up timer in minutes and seconds should appear in the top right corner of the window, font size 34px. it should start counting up immediately.
if the stopSVG is clicked, or the esc key pressed, all activity should stop and the original window should be restored.

the space bar should stop/start all activity, scrolling, timer
the block should show text left-aligned, in a 24 point font, in white, scroll from the top to the bottom., it show show one line with arrows at either side as the current line in the middle line of the viewport, another 6 lines should be shown below as a preview of what is coming, every 10 seconds the text should advance by one line
any text preceded with **note** should be displayed in a light gray color.
any text preceded by **action** should be displayed in yellow, and will cause the scrolling to stop when it becomes the current line, waiting for the space bar
when the text finishes, the code should stop, waiting for the stop icon to be clicked, or the esc key pressed.
