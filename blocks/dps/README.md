# Dynamic Presentation System (DPS) Block

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Features
- Full-screen presentation mode
- Keyboard-based navigation
- Multiple images per slide with arrow key navigation
- Image sequence support
- Full viewport height image support
- Presenter notes with toggle functionality
- Timer with warning system
- Responsive design
- Print-friendly handout mode

## Content Structure
| Title | Subtitle | Timer (minutes) | Content | Presenter Notes |
| :---- | :------- | :-------------- | :------ | :-------------- |
| Presentation Title | Optional subtitle | 25 | Main content | Presenter notes |
| Slide Title | Introduction text | | Bullet points | Notes for this slide |
| | | | Multiple images | Additional guidance |
| | | | SVG illustrations | Key points to cover |

## Navigation
- **Arrow Keys**: Navigate between slides
- **Space**: Toggle timer pause/play
- **Escape**: Toggle navigation bar
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes

### Image Sequence Navigation
- Use left/right arrow keys to navigate through multiple images
- Images maintain aspect ratio and use full viewport height
- Smooth transitions between images
- Navigation wraps around at sequence ends

### Presenter Notes
- Appears in bottom left third of viewport (31.25% width)
- Light grey background with dark text for readability
- Supports HTML formatting:
  - Bullet points
  - Bold text (highlighted in blue)
  - Code blocks
  - Line breaks
- Toggle visibility with + and - keys
- State persists across slide changes
- Hidden by default on startup
- Excluded from print mode

## Styling
- Modern, clean design
- Responsive layout
- Consistent typography
- Smooth transitions
- Print-optimized handouts

## Performance
- Optimized image loading
- Efficient DOM updates
- Smooth animations
- Minimal dependencies

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Authoring Guidelines
1. Start with a configuration row containing title, subtitle, and timer duration
2. Each subsequent row represents a slide
3. Use the fourth column for images or illustrations
4. Add presenter notes in the fifth column
5. Multiple images in the fourth column will create an image sequence
6. Use HTML formatting in presenter notes for better organization

## Troubleshooting
- If images don't load, check the image URLs
- If presenter notes don't toggle, ensure no other keyboard shortcuts are active
- For print issues, use the browser's print preview
- If timer doesn't start, ensure you've advanced past the first slide

## Notes
- Presenter notes support HTML formatting for better organization
- Images maintain aspect ratio while using available space
- Timer starts automatically after first slide
- Print mode excludes presenter notes and navigation elements

## Implementation

### Files

- `dps.js` - JavaScript implementation
- `dps.css` - CSS styling
- `README.md` - Documentation (this file)

### Content Structure

Content authors should structure their content as follows:

```
| DPS                |                       |            |                    |                     |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Presentation Title | Presentation Subtitle | 25 (timer) |                    |                     |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or SVG    | Presenter Notes 1   |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | Image(s) or SVG    | Presenter Notes 2   |

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
5. **Fifth column**: Presenter notes
   - Private notes visible only to the presenter
   - Toggle visibility with + and - keys
   - Notes state (hidden/visible) persists across slides
   - Appears in bottom left quarter of viewport
   - Automatically updates when changing slides

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
- Plus (+) key: Show presenter notes
- Minus (-) key: Hide presenter notes

#### Image Sequence Navigation
- Right arrow shows next image in the sequence
- Left arrow shows previous image in the sequence
- When reaching the last image, right arrow advances to next slide
- When at the first image, left arrow goes to previous slide
- Smooth fade transition between images

#### Presenter Notes
- Notes appear in bottom left third of viewport (31.25% of viewport width)
- Semi-transparent background for readability
- Toggle visibility with + and - keys
- State persists across slide changes
- Hidden by default on startup
- Not included in print mode

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

The block implements several performance optimizations:
- Efficient DOM manipulation
- Optimized image sequence transitions
- Minimal reflows and repaints
- Event delegation for improved interaction handling
- Smart state management for presentation controls
