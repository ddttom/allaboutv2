# Dynamic Presentation System (DPS) Block

A block for creating interactive presentations directly within AEM/Franklin pages, with automatic fullscreen mode and consistent slide styling.

## Overview

The DPS block transforms a structured table from a Google Doc into a full-screen, interactive slideshow presentation. It adheres to Edge Delivery Services (EDS) best practices with proper namespacing and container usage.

## Features

- Automatic full-screen mode on startup
- Consistent slide layout with 40/60 split for content and illustrations
- Keyboard-based navigation with image sequence support
- Multiple images per slide with arrow key navigation
- Lazy loading of images for improved performance
- Automatic timer start after first slide
- Visual timer warnings and countdown
- Support for bullet points and sub-bullet points with optimized spacing
- Support for mixed content (plain text and bullet points)
- SVG and image illustration support with full viewport height
- Responsive design for all screen sizes
- Print-optimized layout
- Q&A slide automatically added at the end

## Implementation

### Files

- `dps.js` - JavaScript implementation with IntersectionObserver for lazy loading
- `dps.css` - CSS styling
- `README.md` - Documentation (this file)

### Content Structure

Content authors should structure their content as follows:

```
| DPS                |                       |            |                    |
| ------------------ | --------------------- | ---------- | ------------------ |
| Presentation Title | Presentation Subtitle | 25 (timer) |                    |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or SVG    |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | Image(s) or SVG    |
| ...                | ...                   | ...        | ...                |
```

#### Column Definitions

1. **First column**: Slide titles
2. **Second column**: Slide introduction text or subtitle
3. **Third column**: Bullet points and plain text
   - Use document list formatting for bullet points
   - Plain text will be displayed without bullets
   - Line breaks in plain text are preserved
   - HTML formatting (like `<code>` and `<strong>`) is supported
4. **Fourth column**: Images or SVG for illustrations
   - Can contain multiple images that will be shown in sequence
   - Images use full viewport height while maintaining aspect ratio
   - Navigate between images using arrow keys
   - When reaching the last image, right arrow advances to next slide
   - When on first image, left arrow goes to previous slide

## Slide Layout

Each slide follows a consistent layout:

1. **Title Area** (Full width)
   - Large title with bottom border
   - Optional subtitle or introduction text

2. **Content Area** (40% width)
   - Introduction text (if provided)
   - Bullet points with optimized spacing
   - Plain text with preserved formatting
   - Sub-bullet points (if used)

3. **Illustration Area** (60% width)
   - SVG illustrations or images
   - Multiple images shown in sequence
   - Images use full viewport height
   - Maintains aspect ratio
   - Smooth transitions between images

## Content Formatting

### Bullet Points and Text

The third column supports both bullet points and plain text:

1. **Bullet Points**
   - Use document's list formatting
   - Optimized spacing between items
   - Consistent bullet styling
   - Supports sub-bullets

2. **Plain Text**
   - No bullet styling
   - Preserves line breaks
   - Supports HTML formatting
   - Can be mixed with bullet points

3. **Mixed Content**
   - Bullet points and plain text can be used together
   - Maintains original content order
   - Preserves all formatting and spacing

### HTML Support

The following HTML elements are supported in the content:
- `<code>` - Monospace text
- `<strong>` - Bold text
- `<br>` - Line breaks
- Other HTML formatting elements

## Special Slides

### Q&A Slide
- Automatically added as the last slide
- Includes:
  - "Questions & Answers" title
  - "Your feedback and questions are valuable" subtitle
  - Centered question mark icon
  - "Thank You For Your Attention" message

## EDS Best Practices

This block follows these important EDS development principles:

1. **Proper Namespacing**: All class names follow the pattern `blockname-feature-state`
2. **No Container Styling**: Container elements have no styles applied
3. **Semantic Structure**: Uses appropriate semantic elements
4. **Consistent Layout**: Maintains consistent spacing and alignment

## Usage Guide for Authors

1. Create a table in your Google Doc
2. First cell must contain "DPS"
3. Second row contains configuration:
   - Presentation title
   - Subtitle
   - Timer duration in minutes (default: 25)
4. Each subsequent row represents a slide:
   - Title (required)
   - Introduction text (optional)
   - Bullet points and plain text (use document's list formatting for bullets)
   - SVG content or image (optional)

## Advanced Features

### SVG Support

Authors can include SVG code directly in the fourth column. Example:

```svg
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

### Timer Functionality

- Timer starts automatically when advancing past the first slide
- Space bar toggles timer on/off after it has started
- Visual warning (red flash) when 2 minutes remain
- Timer display in MM:SS format
- Timer shows "Time Up!" in red when finished
- Timer state persists during slide navigation

### Navigation

#### Keyboard Controls
- Left Arrow: Previous image in sequence or previous slide if no more images
- Right Arrow: Next image in sequence or next slide if no more images
- Space Bar: Toggle timer (after first slide)
- Escape: Exit fullscreen mode

#### Image Sequence Navigation
- Right arrow shows next image in the sequence
- Left arrow shows previous image in the sequence
- When reaching the last image, right arrow advances to next slide
- When at the first image, left arrow goes to previous slide
- Smooth fade transition between images

### Responsive Design

- Adapts to all screen sizes
- Mobile-optimized layout
- Maintains readability on small screens
- Adjusts illustration sizes automatically

### Print Mode

- Optimized for handouts
- Each slide on a separate page
- Clean layout without navigation elements
- Preserves all content and illustrations

## Compatibility

- Works in all modern browsers
- Follows WCAG accessibility guidelines
- Supports high-DPI displays
- Touch-friendly interface

## Styling

The block uses a consistent color scheme:
- Primary Blue: #3498db
- Dark Blue: #2c3e50
- Light Gray: #ecf0f1
- Warning Red: #e74c3c

All colors and spacing can be customized through CSS variables.

### Performance Optimizations

1. **Lazy Loading**
   - Images are loaded only when they come close to the viewport
   - Uses IntersectionObserver API for efficient loading
   - 50px pre-loading margin for smoother experience
   - Loading attribute set to "lazy" for native browser support
   - Fallback to data-src pattern for older browsers
