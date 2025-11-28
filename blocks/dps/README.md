# Dynamic Presentation System (DPS) Block

A powerful, full-featured presentation system that transforms structured content from markdown tables into interactive slide decks with advanced features including image sequences, presenter notes, timer controls, and mobile support.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Usage](#usage)
5. [Content Structure](#content-structure)
6. [Styling & Customization](#styling--customization)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)
9. [Performance](#performance)
10. [Browser Support](#browser-support)
11. [Troubleshooting](#troubleshooting)
12. [Testing](#testing)
13. [Dependencies](#dependencies)
14. [Future Enhancements](#future-enhancements)

---

## Overview

The Dynamic Presentation System (DPS) block is a comprehensive presentation framework designed for Adobe Edge Delivery Services (EDS). It transforms simple markdown tables into full-screen, interactive presentations with professional features comparable to traditional presentation software.

**Primary Use Cases:**
- Conference presentations and workshops
- Internal training sessions and webinars
- Product demonstrations and pitches
- Educational lectures and tutorials
- Sales presentations and client meetings
- Board meetings and executive briefings

**Block Name:** `dps`

**Location:** `/blocks/dps/`

**Files:**
- `dps.js` - Core presentation logic (2,044 lines with embedded CSS)
- `dps.css` - Empty placeholder (styles embedded in JS)
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `dev-README.md` - Developer architecture documentation
- `user-README.md` - Author-focused guide
- `test.html` - Browser-based testing

**Key Differentiators:**
- Full-screen immersive presentation mode
- Multi-image sequences with keyboard navigation
- Dedicated presenter notes with resizable panel
- Countdown timer with visual warnings
- Automatic Q&A slide with QR code generation
- Mobile touch gesture support
- Print-friendly handout mode

---

## Features

### Core Capabilities

1. **Full-Screen Presentation Mode**
   - Hides site header, footer, and navigation
   - Forces full viewport utilization (100vw x 100vh)
   - Prevents scrolling and maintains fixed positioning
   - Professional presentation appearance

2. **Multi-Format Content Support**
   - Images (JPEG, PNG, GIF, SVG, WebP)
   - Picture elements with responsive sources
   - Icons (SVG via span elements)
   - iframes for embedded content (videos, interactive demos)
   - HTML-formatted text with lists and emphasis

3. **Image Sequence Navigation**
   - Multiple images per slide displayed in sequence
   - Arrow key navigation through sequence items
   - Smooth transitions between items
   - Container-based architecture prevents visual glitches
   - Full viewport height images with maintained aspect ratio

4. **Presenter Notes System**
   - Resizable notes panel in bottom-left corner
   - Toggle visibility with keyboard shortcuts (+ / -)
   - Enlarged presenter mode (P key) for tablet viewing
   - Dedicated presenter view with slide content included
   - Drag-to-resize functionality
   - Automatic content synchronization

5. **Timer Control**
   - Configurable duration (default: 25 minutes)
   - Countdown display in MM:SS format
   - Auto-start when advancing from first slide
   - Toggle pause/resume with spacebar
   - Visual warning (red flash) at 2 minutes remaining
   - "Time Up!" alert when timer expires

6. **Keyboard Navigation**
   - **Arrow Left/Right**: Navigate slides and sequences
   - **Space**: Toggle timer pause/resume
   - **Escape**: Toggle navigation bar visibility
   - **Plus (+)**: Show presenter notes
   - **Minus (-)**: Hide presenter notes
   - **P**: Toggle enlarged presenter mode

7. **Mobile & Touch Support**
   - Swipe gestures for navigation
   - Touch-friendly button sizes (44x44 minimum)
   - Mobile-optimized layout
   - Floating notes toggle button
   - Responsive breakpoints for all screen sizes

8. **Automatic Q&A Slide**
   - Generated automatically at end of presentation
   - Displays QR code from presentation subtitle URL
   - Clickable link to resources or contact page
   - Consistent styling with thank you message

9. **Print-Friendly Handouts**
   - Print mode with page breaks between slides
   - Hides navigation and interactive elements
   - Preserves content and images
   - Suitable for audience handouts

### Advanced Features

- **iframe Simplified Format**: `iframe https://example.com` (no HTML tags needed)
- **Icon Support**: `<span class="icon icon-name"></span>` references `/icons/name.svg`
- **Mixed Content Sequences**: Combine images, icons, iframes, and SVGs in any order
- **URL Extraction**: Automatically extracts URLs from subtitle for Q&A slide
- **Deduplication Logic**: Prevents duplicate illustrations from HTML quirks
- **Mobile Detection**: Automatic mobile-friendly adjustments

---

## Technical Architecture

### JavaScript Structure

The DPS block follows a clear three-section organization pattern:

#### 1. Core Setup & Configuration (Lines 1-130)

`DPS_CONFIG Object`
`const DPS_CONFIG = {`
`  DEFAULT_TIMER_DURATION: 1800, // 30 minutes in seconds`
`  PRESENTER_NOTES_VISIBLE: false,`
`  ERROR_MESSAGES: {`
`    LOAD_FAILURE: "Failed to load presentation data",`
`    INVALID_DATA: "Invalid presentation data format"`
`  }`
`};`

**Global State Variables:**
- `currentSlideIndex` - Active slide position
- `currentSequenceIndex` - Active image in sequence
- `timerInterval` - Timer interval reference
- `remainingTime` - Countdown seconds remaining
- `hasStartedTimer` - Timer activation flag

#### 2. Content Processing Functions (Lines 130-640)

**Main Decorate Function:**
`export default async function decorate(block)`

**Processing Flow:**
1. Hide header/footer, force full viewport
2. Extract rows from block children
3. Parse presentation data via `parseRows()`
4. Create header, slides container, notes, footer
5. Build slides from parsed content
6. Setup navigation system
7. Initialize timer and presenter toggle
8. Show first slide

**Sub-Components:**
- `createHeader(title, subtitle)` - Header with title/subtitle
- `createPresenterNotesContainer()` - Resizable notes panel
- `createFooter(timerDuration)` - Navigation and timer UI
- `parseRows(rows)` - Extract structured data from table
- `parseIllustration(cell)` - Process images/icons/iframes
- `extractIllustrationItems(content, cell)` - Type-specific extraction

#### 3. Navigation & UI Functions (Lines 640-1270)

**Slide Management:**
- `showSlide(index)` - Display specific slide, hide others
- `updateNavButtons(currentIndex, totalSlides)` - Enable/disable arrows
- `updatePresenterNotes(slideIndex)` - Sync notes content

**Sequence Navigation:**
- `handleSequenceNavigation(direction)` - Navigate within image sequences
- `updateSequence(items, activeIndex)` - Show/hide sequence items

**Timer Functions:**
- `startTimer()` - Begin countdown
- `toggleTimer()` - Pause/resume
- `updateTimer()` - Decrement and display
- `flashTimeWarning()` - Visual alert at 2 minutes

**Presenter Mode:**
- `togglePresenterMode()` - Full presenter view toggle
- `showPresenterNotes()` - Make notes visible
- `hidePresenterNotes()` - Hide notes panel
- `setupResizeHandler()` - Drag-to-resize functionality

**Mobile Support:**
- `setupMobileHandling()` - Touch detection and setup
- `handleSwipe()` - Swipe gesture processing
- `adjustPresenterNotesForMobile()` - Mobile-specific notes UI

#### 4. Embedded CSS Styles (Lines 1270-2044)

**Key CSS Sections:**
- Global resets and full-screen mode
- Grid-based slide layout (40% text, 60% illustration)
- Responsive breakpoints (480px, 768px, 1024px)
- Presenter notes styling
- Print mode formatting
- Mobile optimizations

### CSS Architecture

**Full-Screen Mode:**
`body.dps-fullscreen {`
`  overflow: hidden;`
`  position: fixed;`
`  width: 100%;`
`  height: 100%;`
`}`

**Slide Layout (Grid):**
`.slide-content {`
`  display: grid;`
`  grid-template-areas:`
`    "title title"`
`    "text illustration";`
`  grid-template-columns: 40% 60%;`
`  grid-template-rows: auto 1fr;`
`}`

**Responsive Strategy:**
- Mobile (< 480px): Stacked layout (title, text, illustration)
- Tablet (480-768px): Adjusted grid (45% / 55%)
- Desktop (768-1024px): Full grid (40% / 60%)
- Large Desktop (> 1024px): Optimized spacing

### Data Flow

`Markdown Table in Google Docs`
`↓`
`EDS Transformation → DOM with nested divs`
`↓`
`decorate() Entry Point`
`↓`
`parseRows() → Structured presentation data object`
`↓`
`buildSlides() → Generate slide DOM elements`
`↓`
`setupNavigationSystem() → Attach event handlers`
`↓`
`showSlide(0) → Display first slide`
`↓`
`User Interaction (keyboard/touch/click)`
`↓`
`Navigation Handlers → Update state and DOM`

### Illustration Processing

**Type Detection Priority:**
1. Text patterns: `iframe URL` format
2. DOM elements: `<picture>`, `<iframe>`, `<svg>`, `<img>`
3. Icon spans: `<span class="icon icon-name">`
4. Anchor links: Image URLs in `<a>` tags

**Deduplication Strategy:**
- Set-based identifier tracking
- Content-specific unique IDs (URLs, icon names, content hash)
- Preserves DOM order of first occurrence
- Lightweight safety net against HTML quirks

### QR Code Generation

**API Used:** QR Server API (https://api.qrserver.com)

`function generateQRCode(url, options = {}) {`
`  const qrServerUrl =`
`    'https://api.qrserver.com/v1/create-qr-code/?' +`
`    'size=250x250&' +`
`    'data=' + encodeURIComponent(url);`
`  return qrServerUrl;`
`}`

---

## Usage

### Basic Markdown Structure

In Google Docs or any EDS authoring environment, create a table:

`| DPS                      |                         |    |                    |                      |`
`| :----------------------- | :---------------------- | :- | :----------------- | :------------------- |`
`| Presentation Title       | Subtitle - Contact URL  | 25 |                    |                      |`
`| Slide 1 Title            | Introduction text       | Bullet points | Image URL | Presenter notes  |`
`| Slide 2 Title            | More context            | More bullets  | Image URL | More notes       |`

### Column Definitions

**Row 1 (Configuration Row):**
- **Column 1**: Presentation title (required)
- **Column 2**: Presentation subtitle (optional) - Can include URL: `Subtitle - https://example.com`
- **Column 3**: Timer duration in minutes (default: 25)
- **Columns 4-5**: Leave empty

**Subsequent Rows (Slide Content):**
- **Column 1**: Slide title (required)
- **Column 2**: Introduction text or subtitle (optional)
- **Column 3**: Bullet points or short description
  - Use list formatting for bullets
  - Plain text displays without bullets
  - HTML formatting supported (`<strong>`, `<code>`, etc.)
- **Column 4**: Illustrations (optional)
  - Image URLs
  - Icon spans: `<span class="icon icon-name"></span>`
  - iframe format: `iframe https://example.com/embed`
  - SVG inline markup
  - Multiple items create sequence
- **Column 5**: Presenter notes (optional)
  - Private notes visible only to presenter
  - Toggle with + / - keys

### Image Sequence Example

To create a slide with multiple images:

`| Slide Title | Introduction | Description | Image 1 URL | Notes |`
`| Slide Title |              |             | Image 2 URL |       |`
`| Slide Title |              |             | Image 3 URL |       |`

**Navigation:**
- Right arrow advances through images 1 → 2 → 3
- At image 3, right arrow advances to next slide
- Left arrow goes back through sequence

### iframe Embedding

**Simplified Author Format:**
`iframe https://www.youtube.com/embed/dQw4w9WgXcQ`

**Alternative Formats (also supported):**
- Standard HTML: `<iframe src="https://example.com/embed"></iframe>`
- Franklin link format: `<a href="https://example.com/embed">Link</a>`

### Icon Usage

**Format:**
`<span class="icon icon-methods"></span>`

**Requirements:**
- Icon file must exist: `/icons/methods.svg`
- Icon name extracted from class: `icon-methods` → `methods.svg`
- Alt text auto-generated: "methods Illustration"

---

## Content Structure

### Configuration Row Structure

`| Title | Subtitle | Timer | (empty) | (empty) |`

**Example:**
`| AI Strategy Workshop | Building Intelligent Systems - https://ai.example.com/resources | 45 | | |`

### Standard Slide Structure

`| Slide Title | Intro Text | Bullets/Description | Illustration | Presenter Notes |`

**Example:**
`| Market Analysis | Current trends and forecasts | <ul><li>Growth rate: 23%</li><li>Market size: $45B</li><li>Key players</li></ul> | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Emphasize the rapid growth trajectory. Prepare examples from recent acquisitions. |`

### Q&A Slide (Auto-Generated)

The DPS block automatically creates a closing slide:
- **Title**: "Close"
- **Subtitle**: "Your feedback and questions are valuable"
- **Content**: Thank you message with QR code
- **Link**: Extracted from presentation subtitle URL

**URL Extraction:**
If subtitle contains `Text - https://example.com`, the URL becomes a clickable link in Q&A slide.

---

## Styling & Customization

### CSS Variables

The DPS block uses embedded CSS (lines 1270-2044) with several customizable sections:

**Color Palette (Hardcoded):**
- Primary: `#3498db` (blue)
- Dark: `#2c3e50` (navy)
- Background: `#ecf0f1` (light gray)
- Error/Warning: `#e74c3c` (red)

**Typography:**
- Font: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
- Title size: `28px`
- Body text: `20px`
- Bullet points: `20px`

**Spacing:**
- Slide padding: `20px`
- Grid gap: `20px`
- Footer height: `60px`
- Presenter notes: `25vh` (resizable)

### Customization Options

**To Customize Colors:**
Edit the embedded CSS in `dps.js` (lines 1380-2040):

`/* Header styling */`
`.dps-header {`
`  background-color: #2c3e50; /* Change this */`
`  color: white;`
`}`

**To Adjust Layout:**

`/* Slide content layout */`
`.slide-content {`
`  grid-template-columns: 40% 60%; /* Adjust ratio */`
`}`

**To Modify Timer Warning:**

`// Flash warning when 2 minutes remain`
`if (remainingTime === 120) { /* Change threshold */`
`  flashTimeWarning();`
`}`

### Block Variations

The DPS block currently does not support variations (e.g., `.dps.dark`, `.dps.compact`). All styling is built-in for consistency across presentations.

**Future Enhancement:** Consider adding variation support for:
- Dark theme
- Compact mode (less padding)
- Widescreen layout (different aspect ratio)

---

## Responsive Behavior

### Desktop (> 900px)

- Full grid layout: 40% text, 60% illustration
- Presenter notes: 31.25vw width, 25vh height
- Navigation buttons: Standard size (24px icons)
- Footer: 60px height
- Font sizes: Full scale (title: 28px, body: 20px)

### Tablet (600px - 900px)

- Grid layout: 45% text, 55% illustration
- Presenter notes: 50vw width when expanded
- Touch-friendly navigation (44x44 touch targets)
- Swipe gestures enabled
- Reduced padding: `15px`

### Mobile Portrait (< 600px)

- Stacked layout: Title → Text → Illustration
- Presenter notes: 90vw width, 30vh height
- Floating notes toggle button
- Larger navigation arrows (32px icons)
- Compact header and footer (reduced padding)
- Font sizes scaled down: Title 20px, body 14px

### Mobile Landscape (height < 480px)

- Hybrid layout: Title spans full width, text/illustration side-by-side
- Compact header/footer: 5px padding
- Reduced illustration height
- Smaller fonts for better fit

### Breakpoint Strategy

`/* Mobile (default) */`
`.slide-content { /* stacked layout */ }`

`@media (max-width: 480px) {`
`  /* Smaller mobile devices */`
`}`

`@media (min-width: 768px) and (max-width: 1024px) {`
`  /* Tablets */`
`}`

`@media (max-height: 480px) and (orientation: landscape) {`
`  /* Mobile landscape */`
`}`

---

## Accessibility

### Keyboard Navigation

**Full keyboard accessibility:**
- Arrow keys: Navigate slides and sequences
- Space: Control timer
- Plus/Minus: Show/hide presenter notes
- P: Toggle presenter mode
- Escape: Toggle navigation visibility

**Implementation:**
`document.addEventListener('keydown', (event) => {`
`  if (event.repeat) return; // Prevent key repeat`
`  // Handle all keyboard shortcuts`
`});`

### Screen Reader Support

**ARIA Labels:**
`<button class="nav-arrow prev-slide" aria-label="Previous slide">`

**Semantic HTML:**
- Proper heading hierarchy (`<h1>`, `<h2>`)
- List structure for bullets (`<ul>`, `<li>`)
- Alt text for all images

**Focus Management:**
- Visible focus indicators
- Logical tab order
- Skip links (implicit via keyboard navigation)

### Color Contrast

**WCAG AA Compliance:**
- Text on background: 7.5:1 (black on white)
- Header text: White on #2c3e50 (8.4:1)
- Button states: Clear visual indication

**Testing:**
Use browser DevTools Lighthouse accessibility audit.

### Touch Target Sizes

**Mobile Optimizations:**
`@media (hover: none) and (pointer: coarse) {`
`  .nav-arrow,`
`  .presenter-toggle {`
`    min-height: 44px; /* WCAG recommended */`
`    min-width: 44px;`
`  }`
`}`

### Forced Colors Mode

**High Contrast Support:**
`@media (forced-colors: active) {`
`  .iframe-container {`
`    border: 1px solid CanvasText;`
`  }`
`}`

---

## Performance

### JavaScript Optimization

**Code Organization:**
- Modular functions with single responsibility
- Minimal DOM queries (cached references)
- Event delegation where appropriate
- Efficient state management

**Event Handlers:**
- Debounced resize handling
- Prevents repeated keydown events: `if (event.repeat) return;`
- Passive touch listeners: `{ passive: true }`

### CSS Performance

**Embedded CSS:**
- All styles in JavaScript (no external CSS file)
- Single file load reduces HTTP requests
- Inline reduces render-blocking

**Efficient Selectors:**
- Class-based selectors (fast)
- Minimal use of complex selectors
- No expensive pseudo-selectors

### Image Loading

**Lazy Loading:**
Illustrations can use loading attribute:
`<img loading="lazy" src="..." alt="...">`

**iframe Loading:**
`<iframe src="..." loading="lazy" title="...">`

**Optimization Opportunities:**
- Preload first slide images
- Progressive image loading for sequences
- Intersection Observer for lazy sequence loading

### Memory Management

**Cleanup:**
- Timer interval cleared on component unmount
- Event listeners properly managed
- No memory leaks from circular references

**State Management:**
- Minimal global state variables
- Local state in function closures
- Efficient Set-based deduplication

### Metrics

**Estimated Performance:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: 0 (fixed layout)
- Largest Contentful Paint: < 2.5s (depends on images)

**Lighthouse Scores (Target):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## Browser Support

### Tested Browsers

**Desktop:**
- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Mobile:**
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 14+
- ✅ Firefox Mobile 88+

### Feature Compatibility

**Core JavaScript:**
- ES6 modules (supported by all modern browsers)
- Async/await (widely supported)
- Arrow functions (standard)
- Template literals (standard)

**CSS Features:**
- Grid layout (all modern browsers)
- Flexbox (universal support)
- CSS variables (all modern browsers)
- Media queries (universal)

**DOM APIs:**
- querySelector/querySelectorAll (standard)
- addEventListener (universal)
- classList (standard)
- dataset (standard)

### Polyfills

**Not Required:**
The DPS block uses only standard, widely-supported features.

**IE11 Not Supported:**
- Uses ES6 features
- Relies on modern CSS Grid
- No polyfills provided

### Known Issues

**Safari-Specific:**
- Swipe gestures may conflict with browser back/forward navigation
- Solution: Use touch event prevention

**Firefox-Specific:**
- Print mode may have minor spacing differences
- Solution: Test print output per browser

**Mobile Safari:**
- Full-screen mode may show address bar initially
- Solution: Scroll to top on load (implemented)

---

## Troubleshooting

### Common Issues

#### Slides Not Displaying

**Symptoms:** Blank screen or error message

**Causes:**
1. Invalid table structure (missing configuration row)
2. Insufficient rows (minimum 2 required)
3. JavaScript errors in console

**Solutions:**
1. Check table structure: First row = config, subsequent rows = slides
2. Verify minimum content: Title, subtitle, timer in row 1
3. Open browser DevTools Console for error details

`// Error handling in code`
`if (rows.length < 2) {`
`  block.innerHTML = '<div class="dps-error">Error: DPS block requires at least a configuration row and one slide row.</div>';`
`  return;`
`}`

#### Navigation Not Working

**Symptoms:** Arrow keys or buttons don't change slides

**Causes:**
1. JavaScript errors preventing setup
2. Focus on input element (keyboard captured)
3. Browser extension interference

**Solutions:**
1. Check browser console for errors
2. Click on presentation area to regain focus
3. Disable browser extensions temporarily
4. Verify `setupNavigationSystem()` executed

#### Timer Not Starting

**Symptoms:** Timer shows initial duration but doesn't count down

**Causes:**
1. Still on first slide (timer starts on slide 2)
2. Timer interval not initialized
3. Invalid timer duration value

**Solutions:**
1. Advance to second slide (timer auto-starts)
2. Check console for timer-related errors
3. Verify timer value is numeric in configuration row

`// Timer starts when moving past first slide`
`if (index > 0 && !hasStartedTimer) {`
`  startTimer();`
`  hasStartedTimer = true;`
`}`

#### Images Not Appearing

**Symptoms:** Blank illustration area

**Causes:**
1. Invalid image URL
2. Image loading error (404, CORS)
3. Illustration cell empty or malformed

**Solutions:**
1. Verify image URL is accessible
2. Check browser Network tab for loading errors
3. Use sample URLs from allabout.network domain
4. Ensure image URL is in fourth column

#### Presenter Notes Not Showing

**Symptoms:** Notes panel hidden or not updating

**Causes:**
1. Notes hidden by default (press + to show)
2. No presenter notes in slide data
3. CSS display issue

**Solutions:**
1. Press + key to show notes panel
2. Add content to fifth column of slide row
3. Check `.presenter-notes.hidden` CSS class
4. Verify `updatePresenterNotes()` called on slide change

#### Mobile Swipe Not Working

**Symptoms:** Swipe gestures don't navigate slides

**Causes:**
1. Not detected as touch device
2. Insufficient swipe distance
3. Conflict with browser swipe gestures

**Solutions:**
1. Verify `mobile-device` class on body element
2. Increase swipe distance (threshold: 50px)
3. Disable browser swipe-to-navigate in settings

### Debugging Techniques

**Enable Console Logging:**
Add logging to key functions:

`// eslint-disable-next-line no-console`
`console.log('Current slide index:', currentSlideIndex);`

**Inspect DOM Structure:**
Use DevTools Elements panel to verify:
- `.dps-wrapper` container exists
- `.slide.active` class on current slide
- `.presenter-notes` panel structure

**Check State Variables:**
In DevTools Console:
`window.currentSlideIndex`
`window.remainingTime`

**Network Inspection:**
- Verify image URLs load successfully
- Check iframe URLs resolve
- Monitor CORS errors

### Getting Help

**Resources:**
- Developer documentation: `dev-README.md`
- User guide: `user-README.md`
- Example usage: `EXAMPLE.md`
- Test file: `test.html`

**Reporting Issues:**
Include:
1. Browser and version
2. Console error messages
3. Table structure (markdown)
4. Expected vs actual behavior
5. Screenshots or video if applicable

---

## Testing

### Manual Testing

**Test File:** `test.html`

**Location:** `/blocks/dps/test.html`

**Usage:**
1. Open `test.html` in browser
2. Verify all features:
   - Slide navigation (arrows, keyboard)
   - Image sequences
   - Timer functionality
   - Presenter notes toggle
   - Mobile responsive layout
   - Print mode

### Test Cases

**Navigation:**
- ✅ Arrow keys navigate between slides
- ✅ Navigation buttons work
- ✅ First slide disables prev button
- ✅ Last slide disables next button
- ✅ Sequence navigation stays within slide
- ✅ Sequence end advances to next slide

**Timer:**
- ✅ Timer displays initial duration
- ✅ Timer starts on second slide
- ✅ Spacebar toggles pause/resume
- ✅ Warning flashes at 2 minutes
- ✅ "Time Up!" displays at zero

**Presenter Notes:**
- ✅ + key shows notes
- ✅ - key hides notes
- ✅ P key toggles presenter mode
- ✅ Notes update with slide changes
- ✅ Drag-to-resize works
- ✅ Notes persist across slides

**Content Types:**
- ✅ Images display correctly
- ✅ iframes embed and load
- ✅ Icons render from /icons/ directory
- ✅ SVG inline markup works
- ✅ Bullet points format correctly
- ✅ Q&A slide generates with QR code

**Responsive:**
- ✅ Desktop layout correct
- ✅ Tablet layout adapts
- ✅ Mobile portrait stacks content
- ✅ Mobile landscape hybrid layout
- ✅ Touch gestures work
- ✅ Mobile notes toggle button appears

**Accessibility:**
- ✅ Keyboard navigation complete
- ✅ ARIA labels present
- ✅ Focus indicators visible
- ✅ Color contrast sufficient
- ✅ Touch targets sized correctly

**Print:**
- ✅ Print mode removes navigation
- ✅ Page breaks between slides
- ✅ Content preserved
- ✅ Images print correctly

### Automated Testing (Future)

**Unit Tests:**
- Test `parseRows()` function with various inputs
- Test `formatTime()` with different second values
- Test `extractIllustrationItems()` with different HTML

**Integration Tests:**
- Test full slide navigation flow
- Test timer functionality end-to-end
- Test presenter notes interaction

**E2E Tests:**
- Playwright/Puppeteer tests for browser automation
- Test full presentation flow
- Test mobile touch gestures
- Test keyboard navigation

---

## Dependencies

### EDS Core

**Required:**
- `/scripts/aem.js` - EDS core utilities
- EDS block decoration system

**Used Functions:**
- `createOptimizedPicture()` - Image optimization (not currently used, but available)
- Block decoration lifecycle

### External APIs

**QR Code Generation:**
- API: QR Server API (https://api.qrserver.com)
- Usage: Q&A slide QR code
- No authentication required
- Free tier sufficient

`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=URL`

### Browser APIs

**Standard APIs:**
- DOM manipulation (querySelector, createElement, etc.)
- Event handling (addEventListener)
- Timer functions (setInterval, clearInterval)
- Touch events (touchstart, touchend)
- Print media query (@media print)

**No External Libraries:**
- No jQuery
- No React/Vue
- No animation libraries
- No CSS frameworks

---

## Future Enhancements

### Planned Features

**1. Video Support**
- Embedded video playback
- Video controls integrated with presentation navigation
- Auto-pause when advancing slide

**2. Presenter Tools**
- Next slide preview
- Elapsed time display
- Notes on separate window (dual monitor)
- Audience view vs presenter view

**3. Interactive Elements**
- Live polls and audience questions
- Clickable hotspots on images
- Interactive diagrams
- Form inputs for workshops

**4. Export Options**
- PDF generation
- PowerPoint export
- HTML package download
- Video recording

**5. Collaboration Features**
- Real-time audience participation
- Shared annotation mode
- Q&A submission system
- Live feedback collection

**6. Animation Support**
- Slide transition effects
- Bullet point animations (appear one by one)
- Image zoom and pan
- SVG animation integration

**7. Theme System**
- Pre-built color themes
- Custom CSS variable overrides
- Block variation support (`.dps.dark`, `.dps.minimal`)
- Font customization

**8. Accessibility Enhancements**
- Live captions (speech-to-text)
- Sign language interpreter window
- High contrast mode
- Dyslexia-friendly font option

### Technical Improvements

**Performance:**
- Lazy loading for sequence images
- Intersection Observer for viewport detection
- Preload critical resources
- Service worker for offline presentations

**Code Quality:**
- Extract CSS to separate file
- Modularize JavaScript into smaller files
- Add TypeScript type definitions
- Comprehensive unit test coverage

**Developer Experience:**
- CLI tool for presentation generation
- Live preview during authoring
- Validation tool for table structure
- Template library

### Community Requests

**Author Experience:**
- Visual editor (WYSIWYG)
- Drag-and-drop slide ordering
- Image upload integration
- Template gallery

**Presenter Experience:**
- Rehearsal mode with timing
- Remote control via mobile app
- Laser pointer / annotation tool
- Recording and replay

---

## License

Part of the AllAboutV2 project.

**Developer:** Tom Cranstoun

**Company:** tom

**Last Updated:** 2025-11-28

---

## Related Documentation

- **User Guide:** `user-README.md` - Author-focused guide for creating presentations
- **Developer Guide:** `dev-README.md` - Architectural details and implementation notes
- **Examples:** `EXAMPLE.md` - Practical usage examples with markdown tables
- **Testing:** `test.html` - Browser-based testing file

---

## Quick Reference

**Keyboard Shortcuts:**
- `←` / `→` - Navigate slides/sequences
- `Space` - Toggle timer
- `+` - Show notes
- `-` - Hide notes
- `P` - Presenter mode
- `Esc` - Toggle navigation

**Configuration Row Format:**
`| Title | Subtitle - URL | Timer | | |`

**Slide Row Format:**
`| Title | Intro | Bullets | Image/Icon/iframe | Notes |`

**iframe Format:**
`iframe https://example.com/embed`

**Icon Format:**
`<span class="icon icon-name"></span>`

**Timer Warning:**
- Visual flash at 2 minutes remaining
- "Time Up!" message at zero

**Q&A Slide:**
- Auto-generated
- QR code from subtitle URL
- "Close" title with thank you message
