# teleprompter

Create a franklin block named teleprompter

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

The teleprompter block should show teleprompterSVG from the js above, in the top left corner of the viewport.

The teleprompter should  read all text in the rest of the DOM, saving it as a list of lines.

when the teleprompter icon is clicked the viewer becomes active, and the viewport should clear to solid black with the stopSVG from the js above, in the top left hand corner of the viewport.  
A count up timer in minutes and seconds should appear in the top right corner of the window. it should count up immediately.

when the stop icon is clicked, or the esc key pressed, all activity should stop and the original window with the teleprompter svg and text should be restored.

When the space bar is first pressed all activity should stop.

the teleprompter should show 4 lines of text at a time, in a 20 point font, in white.

any text preceded with **note** should be displayed in a light gray color.

when the space bar is pressed again, the teleprompter should continue.

when the teleprompter is active, the text should scroll from the top to the bottom.

when the text reaches the bottom, it should stop, waiting for the stop icon to be clicked, or the esc key pressed.

when the stop icon is clicked, or the esc key pressed, all activity should stop and the original window with the teleprompter svg and text should be restored.
