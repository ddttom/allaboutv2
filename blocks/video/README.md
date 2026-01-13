# Video Block

An embedded video player block supporting YouTube, Vimeo, and native MP4 videos with lazy loading, optional poster images, and autoplay capabilities. Optimized for performance with IntersectionObserver-based loading.

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

The video block transforms markdown table content into embedded video players, supporting multiple video platforms and formats. It automatically handles platform detection, lazy loading, poster images, and responsive iframe embedding.

**Primary Use Cases:**

- YouTube video embedding with optimized iframes
- Vimeo video integration
- Native MP4 video playback with HTML5 video element
- Hero videos with autoplay and loop
- Video content with custom poster images
- Performance-optimized video loading

**Block Name:** `video`

**Location:** `/blocks/video/`

**Files:**

- `video.js` - Core decoration logic with platform detection
- `video.css` - Responsive video container styling
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

**Source:** Adapted from Adobe EDS Block Collection ([hlx.live/developer/block-collection/video](https://www.hlx.live/developer/block-collection/video))

---

## Features

### Core Capabilities

1. **Multi-Platform Support**
   - YouTube videos (youtube.com, youtu.be URLs)
   - Vimeo videos (vimeo.com URLs)
   - Native MP4 files with HTML5 video element
   - Automatic platform detection from URL

2. **Lazy Loading**
   - IntersectionObserver-based loading
   - Videos load only when entering viewport
   - Reduces initial page load time
   - Improves Core Web Vitals (LCP, CLS)

3. **Poster Image Support**
   - Optional custom poster/thumbnail image
   - Click-to-play interaction with play button overlay
   - EDS image optimization applied automatically
   - 16:9 aspect ratio maintained

4. **Autoplay Variation**
   - Background video mode with autoplay
   - Muted, looping playback
   - No controls (for ambient/hero videos)
   - Plays inline on mobile devices

5. **Responsive Embedding**
   - 16:9 aspect ratio (56.25% padding-bottom)
   - Fluid width containers
   - Proper iframe positioning
   - Mobile-friendly video elements

6. **Performance Optimization**
   - Lazy iframe loading attribute
   - Prevents loading until needed
   - Aspect ratio reservation (prevents CLS)
   - Efficient state management

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function performs the following operations:

1. **Content Extraction**: Extracts video link and optional poster image from block
2. **Placeholder Mode**: If poster image exists, creates click-to-play experience
3. **Lazy Loading Mode**: If no poster, uses IntersectionObserver for viewport-based loading
4. **Platform Detection**: Identifies YouTube, Vimeo, or MP4 from URL
5. **Embed Generation**: Creates appropriate iframe or video element
6. **State Management**: Tracks loading state with `data-embedIsLoaded` attribute

### Platform-Specific Embedding

**YouTube:**

```javascript
function embedYoutube(url, replacePlaceholder, autoplay)
```

- Extracts video ID from URL or pathname
- Supports both youtube.com and youtu.be formats
- Configures iframe parameters:
  - `autoplay=1` for autoplay variation
  - `mute=1` for autoplay (required by browsers)
  - `controls=0` for background videos
  - `loop=1` for autoplay mode
  - `playsinline=1` for mobile inline playback
- Creates responsive iframe wrapper (16:9 aspect ratio)
- Includes proper permissions: autoplay, fullscreen, picture-in-picture

**Vimeo:**

```javascript
function embedVimeo(url, replacePlaceholder, autoplay)
```

- Extracts video ID from pathname
- Configures embed parameters:
  - `autoplay=1` when needed
  - `background=1` for ambient video mode
- Creates responsive iframe with Vimeo player API
- Supports fullscreen and picture-in-picture

**MP4 (Native Video):**

```javascript
function getVideoElement(source, replacePlaceholder, autoplay)
```

- Creates HTML5 `<video>` element
- Adds `controls` attribute by default
- Configures autoplay mode:
  - Muted playback (browser requirement)
  - Loop and playsinline attributes
  - Removes controls for background mode
- Detects MIME type from file extension
- Includes loading state tracking

### Lazy Loading Implementation

```javascript
const observer = new IntersectionObserver((entries) => {
  if (entries.some((e) => e.isIntersecting)) {
    observer.disconnect();
    loadVideoEmbed(block, link, false, block.classList.contains('autoplay'));
    block.classList.remove('lazy-loading');
  }
});
observer.observe(block);
```

**How it works:**

1. Block is observed until it enters viewport
2. Once intersecting, video embed is loaded
3. Observer is disconnected (one-time load)
4. Loading state class is removed

### Poster Image Click-to-Play

When a poster image is provided:

```javascript
const wrapper = document.createElement('div');
wrapper.className = 'video-placeholder';
wrapper.innerHTML = '<div class="video-placeholder-play"><button type="button" title="Play"></button></div>';
wrapper.prepend(placeholder);
wrapper.addEventListener('click', () => {
  loadVideoEmbed(block, link, true, false);
});
```

**User experience:**

1. Poster image displays with play button overlay
2. Entire area is clickable
3. Click replaces poster with actual video player
4. Video begins loading/playing immediately

---

## Usage

### Basic Video Embed

**Markdown (Google Docs):**

```
| Video |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID |
```

**Result:** YouTube video with lazy loading, no poster image

### Video with Poster Image

**Markdown:**

```
| Video |
|-------|
| ![Video thumbnail](https://example.com/poster.jpg) |
| https://www.youtube.com/watch?v=VIDEO_ID |
```

**Result:** Custom poster image with play button overlay, click-to-play

### Autoplay Background Video

**Markdown:**

```
| Video (autoplay) |
|------------------|
| https://vimeo.com/123456789 |
```

**Result:** Muted, looping, autoplay video without controls (perfect for hero sections)

### Native MP4 Video

**Markdown:**

```
| Video |
|-------|
| https://example.com/video.mp4 |
```

**Result:** HTML5 video element with controls

---

## Content Structure

### Block Input Format

The video block expects content in this structure:

**With Poster Image:**

```html
<div class="video">
  <div>
    <picture>
      <img src="poster.jpg" alt="Video thumbnail">
    </picture>
  </div>
  <div>
    <a href="https://youtube.com/watch?v=VIDEO_ID">Video Link</a>
  </div>
</div>
```

**Without Poster Image:**

```html
<div class="video">
  <div>
    <a href="https://youtube.com/watch?v=VIDEO_ID">Video Link</a>
  </div>
</div>
```

### Output HTML Structure

**After decoration (with iframe):**

```html
<div class="video" data-embed-is-loaded="true">
  <div style="padding-bottom: 56.25%; position: relative; height: 0;">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID?rel=0&v=VIDEO_ID"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy"
            title="Content from Youtube">
    </iframe>
  </div>
</div>
```

**With poster (before click):**

```html
<div class="video">
  <div class="video-placeholder">
    <picture>
      <img src="poster.jpg" alt="Video thumbnail">
    </picture>
    <div class="video-placeholder-play">
      <button type="button" title="Play"></button>
    </div>
  </div>
</div>
```

---

## Styling & Customization

### CSS Architecture

The video block uses a mobile-first approach with aspect ratio preservation:

**Container Styling:**

```css
.video {
  width: unset;
  text-align: center;
  max-width: 800px;
  margin: 32px auto;
}
```

- Centered layout with 800px max width
- 32px vertical margin
- Width unset to allow flexibility

**Lazy Loading State:**

```css
.video.lazy-loading {
  aspect-ratio: 16 / 9;
}
```

- Reserves space before video loads
- Prevents Cumulative Layout Shift (CLS)

**Video Element Styling:**

```css
.video video {
  max-width: 100%;
}

.video video[data-loading] {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

- Responsive video sizing
- Aspect ratio during loading

**Poster Placeholder:**

```css
.video .video-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
}

.video .video-placeholder picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- 16:9 aspect ratio maintained
- Image covers full area
- Object-fit prevents distortion

**Play Button:**

```css
.video .video-placeholder-play button {
  transform: scale(3);
  width: 22px;
  height: 22px;
  border: 2px solid;
  border-radius: 20px;
}

.video .video-placeholder-play button::before {
  content: "";
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid;
  /* Creates triangle play icon */
}
```

- CSS-only play button (no image dependency)
- Scales to 3x for visibility
- Triangle shape with pseudo-element

### Customization Examples

**Change Max Width:**

```css
.video {
  max-width: 1200px; /* Wider videos */
}
```

**Full-Width Videos:**

```css
.video {
  max-width: none;
  margin: 0;
}
```

**Custom Play Button Color:**

```css
.video .video-placeholder-play button {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.8);
}

.video .video-placeholder-play button::before {
  border-left-color: #ffffff;
}
```

**Add Dark Overlay to Poster:**

```css
.video .video-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
```

**Adjust Aspect Ratio (non-standard):**

```css
.video.vertical {
  aspect-ratio: 9 / 16; /* Vertical video */
}

.video.square {
  aspect-ratio: 1 / 1; /* Square video */
}
```

---

## Responsive Behavior

### Breakpoint-Free Design

The video block uses a flexible, container-based approach:

**Mobile (< 600px):**

- Full-width container (respects parent width)
- 16:9 aspect ratio maintained
- Play button scales appropriately
- Touch-friendly click target

**Tablet (600px - 1024px):**

- Centered container with max-width: 800px
- Maintains aspect ratio
- Proper iframe sizing

**Desktop (> 1024px):**

- Same behavior as tablet
- Can be overridden with custom max-width
- Optimal viewing experience

### Aspect Ratio Preservation

All video embeds maintain 16:9 aspect ratio using `padding-bottom: 56.25%` technique:

```
56.25% = (9 / 16) * 100%
```

This ensures:

- No layout shift during loading
- Consistent aspect ratio across devices
- Proper iframe positioning with absolute positioning

### Platform-Specific Considerations

**YouTube:**

- Responsive iframe with 16:9 ratio
- Supports portrait mode on mobile
- Fullscreen capabilities maintained

**Vimeo:**

- Same responsive iframe approach
- Background mode for autoplay variation
- Player controls adapt to container size

**MP4:**

- Native `<video>` element responsiveness
- Browser handles aspect ratio automatically
- Controls scale with video size

---

## Accessibility

### Semantic HTML

**Iframe Title Attributes:**

```javascript
title="Content from Youtube"
title="Content from Vimeo"
```

- Screen readers announce video platform
- Helps users understand embedded content

**Button Accessibility:**

```html
<button type="button" title="Play"></button>
```

- Semantic button element (not div)
- `title` attribute provides accessible name
- Keyboard accessible (focusable, Enter/Space activate)

**Image Alt Text:**

```html
<img src="poster.jpg" alt="Video thumbnail">
```

- Poster images should have descriptive alt text
- Describes video content, not just "video thumbnail"

### Keyboard Navigation

**Play Button:**

- Focusable with Tab key
- Activates with Enter or Space
- Visual focus indicator (browser default)

**Video Controls:**

- YouTube/Vimeo players have built-in keyboard support
- HTML5 video element supports keyboard controls
- Fullscreen mode accessible via keyboard

### Screen Reader Considerations

**Recommended Alt Text Patterns:**

```markdown
![Introduction to Product Features video](poster.jpg)
![Tutorial: Getting Started with EDS video](poster.jpg)
![Customer testimonial from Jane Smith video](poster.jpg)
```

**Why this matters:**

- Describes video content specifically
- Includes "video" keyword for context
- Helps screen reader users decide whether to play

### Color Contrast

**Play Button:**

- Default styling uses solid borders and fills
- Ensure sufficient contrast (4.5:1 minimum)
- Test against poster image backgrounds

**Video Captions:**

- YouTube/Vimeo support closed captions
- MP4 videos can include subtitle tracks
- Enable captions by default when possible

---

## Performance

### Lazy Loading Benefits

**Impact on Core Web Vitals:**

1. **Largest Contentful Paint (LCP):**
   - Videos don't block LCP
   - Poster images are optimized via EDS
   - Iframes load with `loading="lazy"` attribute

2. **Cumulative Layout Shift (CLS):**
   - Aspect ratio reservation prevents shifts
   - `.lazy-loading` class reserves space
   - Video elements have `data-loading` state with aspect ratio

3. **Time to Interactive (TTI):**
   - Videos don't execute until viewport intersection
   - JavaScript overhead minimal (IntersectionObserver only)
   - No render-blocking resources

### Load Time Optimization

**Without Poster (Lazy Load):**

```
Page Load → IntersectionObserver watches → Video enters viewport → Iframe loads
```

- Initial page load: ~0ms (no video loading)
- Viewport entry: 100-500ms (iframe creation + platform load)
- Total impact: Minimal until user scrolls to video

**With Poster (Click-to-Play):**

```
Page Load → Poster image displays → User clicks → Video loads
```

- Initial page load: ~100-300ms (optimized poster image)
- Click event: 100-500ms (iframe creation + platform load)
- Total impact: User-controlled, no forced loading

**Autoplay Mode:**

```
Page Load → IntersectionObserver watches → Video enters viewport → Autoplay begins
```

- Same lazy load pattern
- Muted playback begins automatically
- No user interaction required

### Resource Efficiency

**Network Usage:**

- No video loading until needed: ~0 KB initial
- YouTube embed: ~200-500 KB (player + video start)
- Vimeo embed: ~300-600 KB
- MP4 video: Depends on file size, progressive download

**Memory Usage:**

- Minimal until video loads
- Single iframe or video element per block
- IntersectionObserver has negligible overhead

**CPU Usage:**

- JavaScript decoration: < 1ms per block
- Platform detection: Instant (string matching)
- Event listeners: Minimal overhead

### Performance Best Practices

1. **Always use lazy loading** (default behavior)
2. **Provide poster images** when possible (improves perceived performance)
3. **Optimize poster images** (compress, use appropriate dimensions)
4. **Limit autoplay videos** (one per page maximum)
5. **Compress MP4 videos** before hosting
6. **Use YouTube/Vimeo** for large files (offload bandwidth)

---

## Browser Support

### Core Functionality

**Supported Browsers:**

- Chrome/Edge 89+ (full support)
- Firefox 88+ (full support)
- Safari 15+ (full support)
- iOS Safari 15+ (full support)
- Android Chrome 89+ (full support)

**Required Features:**

- IntersectionObserver API (2017+)
- ES6 modules (2015+)
- `async/await` syntax (2017+)
- CSS `aspect-ratio` (2021+, graceful degradation)

### Feature Compatibility

**IntersectionObserver:**

- Supported: All modern browsers (95%+ global coverage)
- Not supported: IE11 (polyfill required)
- Fallback: Load immediately if API unavailable

**CSS Aspect Ratio:**

- Supported: Chrome 88+, Firefox 89+, Safari 15+
- Fallback: Padding-bottom technique (universal support)

**Iframe Lazy Loading:**

- Supported: Chrome 77+, Edge 79+, Firefox 121+
- Not supported: Safari (ignored gracefully)
- Fallback: Browser loads immediately (no breaking issue)

### Platform-Specific Behavior

**YouTube:**

- Autoplay: Requires muted playback (browser policy)
- Fullscreen: Supported on all platforms
- Playlists: Supported via URL parameters

**Vimeo:**

- Background mode: Requires Pro/Business account
- Autoplay: Muted playback required
- Domain restrictions: Check Vimeo privacy settings

**MP4:**

- Codec support: H.264 (universal), VP9 (modern browsers)
- Format support: MP4 container required
- Streaming: Progressive download (not adaptive)

### Mobile Considerations

**iOS Safari:**

- Inline playback: Requires `playsinline` attribute (included)
- Autoplay: Must be muted (configured automatically)
- Fullscreen: Native video player takes over

**Android Chrome:**

- Inline playback: Works by default
- Autoplay: Muted playback required
- Fullscreen: Overlay player with controls

---

## Troubleshooting

### Issue: Video Not Loading

**Symptoms:** Empty space or "Loading..." message indefinitely

**Possible Causes:**

1. **Invalid URL format**
   - Check URL is complete and correct
   - Verify platform support (YouTube, Vimeo, MP4 only)
   - Test URL in browser directly

2. **CORS issues (MP4 only)**
   - MP4 files must be on same domain or have CORS headers
   - Check browser console for CORS errors
   - Host files on same server or configure CORS

3. **Vimeo privacy settings**
   - Video must be public or embeddable
   - Check Vimeo privacy settings
   - Verify domain is whitelisted in Vimeo

**Solutions:**

```javascript
// Debug: Check what URL is being detected
// eslint-disable-next-line no-console
console.log('Video URL:', link);
console.log('Is YouTube:', link.includes('youtube') || link.includes('youtu.be'));
console.log('Is Vimeo:', link.includes('vimeo'));
console.log('Is MP4:', link.includes('.mp4'));
```

### Issue: Poster Image Not Displaying

**Symptoms:** Blank space or immediate video load instead of poster

**Possible Causes:**

1. **Picture element not found**
   - Check markdown table has image before link
   - Verify image URL is valid
   - Inspect HTML structure in browser

2. **Image optimization failure**
   - Check image URL is accessible
   - Verify EDS optimization pipeline
   - Test with different image format

**Solutions:**

```markdown
✅ Correct:
| Video |
|-------|
| ![Poster](image.jpg) |
| https://youtube.com/... |

❌ Wrong:
| Video |
|-------|
| https://youtube.com/... |
| ![Poster](image.jpg) |
```

### Issue: Autoplay Not Working

**Symptoms:** Video loads but doesn't autoplay

**Possible Causes:**

1. **Browser autoplay policy**
   - Browsers block autoplay with sound
   - User hasn't interacted with page yet
   - Browser settings block autoplay

2. **Missing variation class**
   - Must use `Video (autoplay)` in markdown
   - Check class is applied: `video autoplay`

**Solutions:**

```markdown
✅ Correct:
| Video (autoplay) |
|------------------|
| https://vimeo.com/123456789 |

❌ Wrong:
| Video |
|-------|
| https://vimeo.com/123456789?autoplay=1 |
```

**Note:** Autoplay ALWAYS requires muted playback (browser policy)

### Issue: Wrong Aspect Ratio

**Symptoms:** Video appears squashed, stretched, or with black bars

**Possible Causes:**

1. **Non-standard video dimensions**
   - Video is not 16:9 aspect ratio
   - Iframe forces 16:9 container
   - Video maintains original aspect within container

2. **CSS overrides**
   - Custom styles affecting aspect ratio
   - Conflicting padding-bottom values

**Solutions:**

**For vertical videos (9:16):**

```css
.video.vertical {
  aspect-ratio: 9 / 16;
  max-width: 400px; /* Narrower container */
}
```

**For square videos (1:1):**

```css
.video.square {
  aspect-ratio: 1 / 1;
  max-width: 600px;
}
```

### Issue: IntersectionObserver Not Working

**Symptoms:** Videos never load, even when scrolled into view

**Possible Causes:**

1. **Browser doesn't support IntersectionObserver**
   - IE11 or very old browsers
   - Requires polyfill

2. **JavaScript errors**
   - Check browser console for errors
   - Other scripts may be breaking execution

**Solutions:**

Add polyfill for older browsers:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

Fallback implementation:

```javascript
// Check for IntersectionObserver support
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Load video immediately
  loadVideoEmbed(block, link, false, block.classList.contains('autoplay'));
}
```

### Issue: Play Button Not Clickable

**Symptoms:** Clicking poster/play button does nothing

**Possible Causes:**

1. **Event listener not attached**
   - JavaScript error preventing decoration
   - Check browser console

2. **CSS pointer-events conflict**
   - Custom styles blocking clicks
   - Z-index issues

**Solutions:**

Check event listener:

```javascript
// Debug: Verify event listener attached
const wrapper = block.querySelector('.video-placeholder');
console.log('Wrapper found:', wrapper);
console.log('Has click listener:', wrapper.onclick || 'via addEventListener');
```

Fix pointer-events:

```css
.video .video-placeholder {
  pointer-events: auto; /* Ensure clickable */
  cursor: pointer;
}
```

---

## Testing

### Manual Testing Checklist

**Basic Functionality:**

- [ ] YouTube videos load correctly
- [ ] Vimeo videos load correctly
- [ ] MP4 videos load with HTML5 player
- [ ] Videos lazy load when scrolling into view
- [ ] Poster images display before click
- [ ] Play button overlay appears on posters
- [ ] Clicking poster loads video player

**Autoplay Variation:**

- [ ] Autoplay videos are muted
- [ ] Videos loop continuously
- [ ] No controls visible
- [ ] Plays inline on mobile
- [ ] Lazy loads on scroll (not immediately)

**Responsive Behavior:**

- [ ] Videos display correctly on mobile (< 600px)
- [ ] Videos display correctly on tablet (600-1024px)
- [ ] Videos display correctly on desktop (> 1024px)
- [ ] Aspect ratio maintained across viewports
- [ ] No horizontal scrolling introduced

**Accessibility:**

- [ ] Iframe has descriptive title attribute
- [ ] Poster images have descriptive alt text
- [ ] Play button focusable with keyboard
- [ ] Play button activates with Enter/Space
- [ ] Screen reader announces video embed

**Performance:**

- [ ] No Cumulative Layout Shift (CLS) during load
- [ ] Videos don't affect Largest Contentful Paint (LCP)
- [ ] IntersectionObserver working correctly
- [ ] No JavaScript errors in console
- [ ] Poster images optimized (< 200KB)

### Browser Testing

Test in multiple browsers and devices:

**Desktop:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile:**

- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)
- Samsung Internet (if targeting Android)

**Tablet:**

- iPad Safari
- Android Chrome on tablets

### Automated Testing

Use `test.html` file for visual testing:

```bash
# Start local server
npm run debug

# Open test file
open http://localhost:3001/blocks/video/test.html
```

**Test scenarios included:**

1. YouTube video with poster
2. YouTube video without poster (lazy load)
3. Vimeo video with autoplay
4. MP4 native video
5. Multiple videos on same page

### Performance Testing

**Lighthouse Audit:**

```bash
# Run Lighthouse on page with video blocks
lighthouse https://yoursite.com/video-page --view
```

**Expected Scores:**

- Performance: 90+ (videos shouldn't impact until scroll)
- Accessibility: 95+ (ensure iframe titles and alt text)
- Best Practices: 95+
- SEO: 90+

**Network Testing:**

1. Open DevTools → Network tab
2. Reload page
3. Verify video resources NOT loaded initially
4. Scroll to video
5. Verify video loads only when in viewport

---

## Dependencies

### EDS Core Dependencies

**Required:**

- `/scripts/aem.js` - Core EDS library (automatically loaded)
- `/styles/styles.css` - Base EDS styles

**Used Functions:**
None - video block is self-contained

### External Dependencies

**None** - No external libraries required

### Browser APIs Used

**IntersectionObserver:**

- Purpose: Viewport-based lazy loading
- Support: All modern browsers
- Fallback: Load immediately if unavailable

**Fetch API:**

- Purpose: Not used in video block
- N/A

**Event Listeners:**

- `click` - Play button interaction
- `loadedmetadata` - Video element loading state
- `canplay` - Autoplay trigger

### Platform Dependencies

**YouTube:**

- Embeds from: `youtube.com/embed/`
- No API key required for basic embedding
- Privacy-enhanced mode: Not used (could be added)

**Vimeo:**

- Embeds from: `player.vimeo.com/video/`
- No API key required for public videos
- Background mode: Requires Pro/Business account

**Video Codecs:**

- H.264 (MP4) - Universal support
- VP9 (WebM) - Modern browser support
- Check browser codec support if using other formats

---

## Future Enhancements

### Potential Improvements

1. **Additional Platform Support**
   - Dailymotion
   - Wistia
   - Facebook videos
   - Instagram videos
   - TikTok embeds

2. **Advanced Autoplay Controls**
   - Pause when out of viewport
   - Play/pause on scroll
   - Volume fade in/out
   - Multiple autoplay videos with intersection control

3. **Caption Support**
   - SRT/VTT file upload for MP4 videos
   - Multiple language tracks
   - Customizable caption styling
   - Forced captions for accessibility

4. **Playlist Support**
   - YouTube playlists
   - Vimeo showcases
   - Custom MP4 playlists
   - Next video auto-advance

5. **Video Analytics**
   - Play/pause tracking
   - Completion rate
   - Watch time
   - Integration with Google Analytics

6. **Privacy Enhancements**
   - YouTube privacy-enhanced mode (youtube-nocookie.com)
   - Cookie consent integration
   - GDPR-compliant embedding
   - Lazy load consent before loading

7. **Quality Selection**
   - User-controlled video quality
   - Auto-quality based on connection speed
   - Preload settings (none/metadata/auto)

8. **Custom Controls**
   - Branded video player UI
   - Custom play/pause buttons
   - Progress bar styling
   - Volume controls

9. **Picture-in-Picture**
   - Automatic PiP on scroll
   - Custom PiP button
   - Exit PiP handling

10. **Thumbnail Gallery**
    - Video chapters with thumbnails
    - Seek to chapter on click
    - Visual progress indicator

### Known Limitations

1. **16:9 Aspect Ratio**
   - Current implementation forces 16:9 ratio
   - Non-standard ratios show black bars
   - Workaround: Custom CSS variations

2. **Single Video Per Block**
   - One video per block instance
   - Playlists require multiple blocks
   - Future: Playlist variation

3. **No Video Preloading**
   - Videos load only when needed
   - Can't pre-fetch for faster playback
   - Future: Preload attribute option

4. **Limited Autoplay Control**
   - Autoplay is all-or-nothing
   - Can't delay autoplay on scroll
   - Future: Scroll-based autoplay triggers

5. **No A/B Testing Support**
   - Can't test different video variations
   - No built-in conversion tracking
   - Future: Analytics integration

### Contributing

To suggest enhancements or report issues:

1. Check existing issues on project repository
2. Create detailed bug report or feature request
3. Include use case and expected behavior
4. Provide code examples if possible

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Maintainer:** Tom Cranstoun (tom)
**Block Source:** Adobe EDS Block Collection
