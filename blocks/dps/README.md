# Dynamic Presentation System (DPS) Block

This block transforms a structured table from a Google Doc into an interactive slideshow presentation. It's perfect for creating slide decks directly in a Franklin project without requiring external presentation software.

## Overview

The Dynamic Presentation System (DPS) Block provides:

- A complete slideshow presentation system
- Timer functionality for timed presentations
- Navigation controls
- Fullscreen mode
- Support for bullet points, sub-bullets, and illustrations
- Automatic Q&A slide generation

## Usage

### Document Structure

Create a table in your Google Doc with the following format:

1. **First row (header)**: 
   - First cell should contain "DPS" (this identifies the table as a DPS block)

2. **Second row (configuration)**:
   - Cell 1: Presentation Title
   - Cell 2: Presentation Subtitle (optional)
   - Cell 3: Timer Duration in minutes (default: 25)

3. **Subsequent rows (slides)**:
   - Cell 1: Slide Title
   - Cell 2: Intro Text (optional)
   - Cell 3: Bullet Points (use list formatting to create bullets)
   - Cell 4: Illustration (insert image or SVG)

### Example Table Structure

| DPS              |                    |                                                            |            |
| ---------------- | ------------------ | ---------------------------------------------------------- | ---------- |
| Understanding AI | How it works       | 25                                                         |            |
| ---------------- | ------------------ | ---------------------------------------------------------- | ---------- |
| Introduction     | AI basics overview | • First point<br>• Second point<br>• Third point           | [Image]    |
| ---------------- | ------------------ | ---------------------------------------------------------- | ---------- |
| Data Processing  | How AI learns      | • Training data<br>• Machine learning<br>• Neural networks | [SVG code] |

### SVG Example

For the Data Processing slide, you could include this SVG in cell 4:

```
<svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowMarker" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#34495e" />
    </marker>
  </defs>
  <!-- Brain shape -->
  <path d="M200 50 Q240 45, 260 65 Q280 85, 260 110 Q240 130, 200 125 Q160 130, 140 110 Q120 85, 140 65 Q160 45, 200 50" 
        fill="#BBDEFB" stroke="#3498db" stroke-width="2" />
  <!-- Data input arrow -->
  <path d="M200 20 L200 45" stroke="#3498db" stroke-width="2" marker-end="url(#arrowMarker)" />
  <text x="200" y="15" text-anchor="middle" fill="#34495e" font-size="10">INPUT DATA</text>
  <!-- Processing nodes -->
  <circle cx="180" cy="80" r="10" fill="#3498db" opacity="0.7" />
  <circle cx="220" cy="90" r="10" fill="#3498db" opacity="0.7" />
  <circle cx="190" cy="110" r="10" fill="#3498db" opacity="0.7" />
  <!-- Connections -->
  <path d="M180 80 L220 90" stroke="#34495e" stroke-width="1" />
  <path d="M220 90 L190 110" stroke="#34495e" stroke-width="1" />
  <path d="M180 80 L190 110" stroke="#34495e" stroke-width="1" />
  <!-- Output path -->
  <path d="M200 125 L200 150" stroke="#3498db" stroke-width="2" marker-end="url(#arrowMarker)" />
  <text x="200" y="170" text-anchor="middle" fill="#34495e" font-size="10">OUTPUT PREDICTION</text>
</svg>
```

### Bullet Points and Sub-bullets

Format bullet points in Cell 3 of each slide row:

- Use Franklin's list formatting to create bullet points
- Indent text to create sub-bullets
- Each bullet point can have multiple sub-bullets

For example:

* Main point 1
  * Sub-point 1.1
  * Sub-point 1.2
* Main point 2
  * Sub-point 2.1

### Illustrations

Add illustrations in Cell 4 of each slide row:

- **Images**: Simply insert an image in the cell
- **SVGs**: Insert SVG code directly into the cell as text

## Features

### Timer

The presentation includes a built-in timer:

- Set the duration in minutes in the configuration row
- Start/stop the timer using the timer button
- Visual warning flashes when 2 minutes remain

### Navigation

Navigate through slides using:

- Previous/Next buttons
- Left/Right arrow keys
- Pagination display shows current slide position

### Fullscreen Mode

Toggle fullscreen mode using:

- The fullscreen button in the top-right corner
- ESC key to exit fullscreen mode

## Styling

The DPS block comes with comprehensive styling that includes:

- Responsive design that works on different screen sizes
- Professional slide layouts
- Consistent typography
- Bullet and sub-bullet formatting
- Print styling for handouts

## Technical Notes

- A Q&A slide is automatically added as the final slide
- The block handles different input formats for bullet points
- The presentation system works without external dependencies

## Limitations

- Complex animations are not supported
- Custom slide layouts beyond the default format are not currently supported
- Video content is not directly supported (use images instead)

## Browser Compatibility

The DPS block works in all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Print support for creating handouts
 