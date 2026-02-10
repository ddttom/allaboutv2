---
title: "Embed Block"
description: "Documentation for the embed EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Embed Block

A universal content embedding component for seamlessly integrating third-party media and social content directly on your pages. Supports YouTube, Vimeo, Twitter, and generic iframe embeds with lazy loading, performance optimization, and optional placeholder images for improved Core Web Vitals scores.

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

The embed block transforms simple URL links into rich media embeds using provider-specific APIs and optimized iframe configurations. It features intelligent provider detection, lazy loading via Intersection Observer, and optional click-to-play placeholders with custom preview images.

**Primary Use Cases:**

- Video content from YouTube and Vimeo
- Social media posts from Twitter
- Third-party widgets and interactive content
- Generic iframe embeds for unsupported providers
- Performance-optimized media loading with placeholders

**Block Name:** `embed`

**Location:** `/blocks/embed/`

**Files:**

- `embed.js` - Provider detection, lazy loading, and embed generation
- `embed.css` - Responsive aspect ratio, placeholder styling
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Multi-Provider Support**
   - YouTube (youtube.com, youtu.be)
   - Vimeo (vimeo.com)
   - Twitter (twitter.com posts)
   - Generic iframe fallback for unsupported providers
   - Automatic provider detection from URL

2. **Lazy Loading**
   - Intersection Observer API for viewport detection
   - Embeds load only when scrolled into view
   - Reduces initial page load time
   - Improves Core Web Vitals (LCP, CLS)
   - No network requests for off-screen content

3. **Click-to-Play Placeholders**
   - Optional custom preview images
   - Play button overlay
   - Autoplay on click
   - Reduces data usage
   - Improves perceived performance

4. **Responsive Embed**
   - 16:9 aspect ratio maintained
   - Fluid width (100% of container)
   - CSS padding-bottom technique
   - Works on all screen sizes
   - No content jumping or layout shift

5. **Performance Optimized**
   - Lazy iframe loading attribute
   - Deferred script loading for Twitter
   - Minimal JavaScript execution
   - No blocking resources
   - Optimal Lighthouse scores

---

## Technical Architecture

### JavaScript Structure

The embed block uses a configuration-driven approach with provider-specific embed functions:

**1. Provider Configuration (`EMBEDS_CONFIG`)**

Array of provider definitions with match patterns and embed functions:

`Provider Configuration`
`const EMBEDS_CONFIG = [`
`{ match: ['youtube', 'youtu.be'], embed: embedYoutube },`
`{ match: ['vimeo'], embed: embedVimeo },`
`{ match: ['twitter'], embed: embedTwitter },`
`];`

**2. Embed Functions**

Each provider has a dedicated embed function:

- `embedYoutube(url, autoplay)` - YouTube iframe with video ID extraction
- `embedVimeo(url, autoplay)` - Vimeo player iframe
- `embedTwitter(url)` - Twitter blockquote with widget script
- `getDefaultEmbed(url)` - Generic iframe for unknown providers

**3. Loading Strategies**

**With Placeholder (Click-to-Play):**

- Display custom preview image
- Overlay play button
- Click event triggers `loadEmbed()` with autoplay
- Replaces placeholder with iframe

**Without Placeholder (Lazy Loading):**

- Intersection Observer watches block
- Loads embed when entering viewport
- Disconnects observer after loading
- No autoplay

### Key Functions

**loadScript(url, callback, type)**

Dynamically loads external JavaScript (Twitter widgets):

`Load External Script`
`const loadScript = (url, callback, type) => {`
`const head = document.querySelector('head');`
`const script = document.createElement('script');`
`script.src = url;`
`if (type) script.setAttribute('type', type);`
`script.onload = callback;`
`head.append(script);`
`};`

**Purpose:** Loads Twitter widget.js for tweet rendering

**loadEmbed(block, link, autoplay)**

Core loading function that:

1. Checks if embed already loaded (prevents duplicate loading)
2. Matches URL against provider configs
3. Generates provider-specific embed HTML
4. Sets appropriate CSS classes
5. Marks block as loaded

**decorate(block)**

Main decoration function that:

1. Extracts link URL from block
2. Checks for placeholder image
3. Sets up click-to-play if placeholder exists
4. Sets up Intersection Observer if no placeholder
5. Clears block content and prepares for embed

### CSS Architecture

The embed block uses responsive CSS with aspect ratio preservation:

**Aspect Ratio Container:**

- `padding-bottom: 56.25%` - Creates 16:9 aspect ratio (9/16 = 0.5625)
- `position: relative` - Enables absolute positioning of iframe
- `height: 0` - Collapses container (padding creates height)

**Iframe Positioning:**

- `position: absolute` - Overlays padding-based container
- `inset: 0` - Fills entire container (top, right, bottom, left = 0)
- `width: 100%` and `height: 100%` - Responsive sizing

**Placeholder Styling:**

- Absolute positioning fills container
- Play button centered with flexbox
- CSS triangle for play icon
- Transform scale for size adjustment

### Data Flow

```
Markdown Link → EDS Initial DOM → decorate() function
                                          ↓
                              Check for Placeholder Image
                                          ↓
                    ┌─────────────────────┴─────────────────────┐
                    ↓                                             ↓
          With Placeholder                            Without Placeholder
                    ↓                                             ↓
      Show Preview + Play Button                    Intersection Observer
                    ↓                                             ↓
           Click Event Listener                    Wait for Viewport Entry
                    ↓                                             ↓
          loadEmbed(autoplay=true)                  loadEmbed(autoplay=false)
                    ↓                                             ↓
                    └─────────────────────┬─────────────────────┘
                                          ↓
                              Match Provider from URL
                                          ↓
                    ┌─────────────────────┴─────────────────────┐
                    ↓                     ↓                      ↓
            YouTube/Vimeo              Twitter            Unknown Provider
                    ↓                     ↓                      ↓
          16:9 iframe embed      Blockquote + script    Generic iframe
                    ↓                     ↓                      ↓
                    └─────────────────────┬─────────────────────┘
                                          ↓
                              Set CSS Classes & Mark Loaded
                                          ↓
                                Final Rendered Embed
```

---

## Usage

### Basic Markdown Structure

In Google Docs, create a table with the embed block name and a link:

```
| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID |
```

### Content Patterns

**Pattern 1: YouTube Video**

```
| Embed |
|-------|
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |
```

Result: YouTube video player embedded with 16:9 aspect ratio, lazy loaded when scrolled into view.

**Pattern 2: YouTube Short URL**

```
| Embed |
|-------|
| https://youtu.be/dQw4w9WgXcQ |
```

Result: Same as above, supports short URL format.

**Pattern 3: Vimeo Video**

```
| Embed |
|-------|
| https://vimeo.com/123456789 |
```

Result: Vimeo player embedded with autoplay support.

**Pattern 4: Twitter Post**

```
| Embed |
|-------|
| https://twitter.com/username/status/1234567890 |
```

Result: Twitter blockquote with widgets.js for rendering. Note: Twitter may load slowly due to external script dependency.

**Pattern 5: With Placeholder Image**

```
| Embed |
|-------|
| ![Preview](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |
```

Result: Shows custom preview image with play button overlay. Click to load video with autoplay enabled.

**Pattern 6: Generic Embed (Unknown Provider)**

```
| Embed |
|-------|
| https://example.com/embed/widget |
```

Result: Generic 16:9 iframe with default settings.

### Integration Points

**With other blocks:**

- Embed video after hero sections
- Use in columns layout for side-by-side videos
- Combine with text sections for tutorials
- Add to cards for video galleries
- No conflicts with other blocks

**Content Model:**

- Two-cell table: Block name + Link URL
- Optional: Picture element for placeholder
- Link must be valid URL
- Picture must be proper `<picture>` element

---

## Content Structure

### Expected Input (Markdown Table)

The EDS pipeline converts markdown table into this initial DOM structure:

**Without Placeholder:**

```html
<div class="embed block">
  <div>
    <div>
      <a href="https://www.youtube.com/watch?v=VIDEO_ID">
        https://www.youtube.com/watch?v=VIDEO_ID
      </a>
    </div>
  </div>
</div>
```

**With Placeholder:**

```html
<div class="embed block">
  <div>
    <div>
      <picture>
        <source type="image/webp" srcset="preview.webp">
        <img src="preview.jpg" alt="Video preview">
      </picture>
      <a href="https://www.youtube.com/watch?v=VIDEO_ID">
        https://www.youtube.com/watch?v=VIDEO_ID
      </a>
    </div>
  </div>
</div>
```

### Output Structure (After Decoration)

**YouTube Embed (After Loading):**

```html
<div class="block embed embed-youtube embed-is-loaded">
  <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID?rel=0&v=VIDEO_ID&muted=1&autoplay=1"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
      allowfullscreen
      scrolling="no"
      title="Content from Youtube"
      loading="lazy">
    </iframe>
  </div>
</div>
```

**With Placeholder (Before Click):**

```html
<div class="embed block">
  <div class="embed-placeholder">
    <picture>
      <img src="preview.jpg" alt="Video preview">
    </picture>
    <div class="embed-placeholder-play">
      <button type="button" title="Play"></button>
    </div>
  </div>
</div>
```

**Twitter Embed:**

```html
<div class="block embed embed-twitter embed-is-loaded">
  <blockquote class="twitter-tweet">
    <a href="https://twitter.com/user/status/123"></a>
  </blockquote>
</div>
```

Note: Twitter widget.js transforms the blockquote into full tweet display.

### URL Parsing

**YouTube:**

- Standard: `youtube.com/watch?v=VIDEO_ID`
- Short: `youtu.be/VIDEO_ID`
- Embed: `youtube.com/embed/VIDEO_ID`
- Video ID extracted from query param or path

**Vimeo:**

- Standard: `vimeo.com/VIDEO_ID`
- Video ID extracted from pathname

**Twitter:**

- Post: `twitter.com/USER/status/TWEET_ID`
- Full URL used as-is in blockquote

---

## Styling & Customization

### CSS Variables

The embed block uses minimal custom styling, relying on intrinsic aspect ratio CSS:

```css
/* No CSS variables needed - aspect ratio and sizing are hardcoded */
```

### Custom Styling

Override default styles in your project's CSS:

**Adjust Max Width:**

`Custom max-width`
`.embed {`
`max-width: 1200px; /* Larger max width */`
`margin: 48px auto; /* More vertical spacing */`
`}`

**Custom Play Button:**

`Styled play button`
`.embed .embed-placeholder-play button {`
`background: rgba(255, 0, 0, 0.8); /* Red background */`
`border: none;`
`border-radius: 50%;`
`width: 60px;`
`height: 60px;`
`}`
`.embed .embed-placeholder-play button::before {`
`border-left-color: white; /* White triangle */`
`}`

**Different Aspect Ratio:**

`4:3 aspect ratio`
`.embed.embed-4-3 > div {`
`padding-bottom: 75%; /* 3/4 = 0.75 */`
`}`

**Dark Background for Twitter:**

`Dark theme for embeds`
`.embed.embed-twitter {`
`background: #15202b; /* Twitter dark mode */`
`padding: 2rem;`
`border-radius: 8px;`
`}`

### Variations

The embed block currently has **no built-in variations**. All customization is done through CSS overrides.

**Future variation ideas:**

- `embed (square)` - 1:1 aspect ratio for Instagram
- `embed (vertical)` - 9:16 aspect ratio for TikTok/Stories
- `embed (minimal)` - No max-width constraint
- `embed (bordered)` - Border and shadow for visual emphasis

---

## Responsive Behavior

### Mobile Behavior (< 600px)

- Full width of container
- 16:9 aspect ratio maintained
- Touch-friendly play button (large tap target)
- Lazy loading conserves mobile data
- Placeholder images reduce initial load

### Tablet Behavior (600px - 1024px)

- Centered with max-width: 800px
- Aspect ratio preserved
- Smooth scaling
- No layout shift on load

### Desktop Behavior (> 1024px)

- Centered with max-width: 800px
- Hover states on play button
- Keyboard accessible
- Optimal viewing size

### Aspect Ratio Preservation

All embeds maintain 16:9 aspect ratio using CSS padding-bottom technique:

**How it works:**

1. Container has `padding-bottom: 56.25%` (9/16 = 0.5625)
2. Padding is calculated relative to width
3. As width changes, height scales proportionally
4. Iframe positioned absolutely to fill padding-created space

**Benefits:**

- No layout shift (CLS = 0)
- Responsive without JavaScript
- Browser-native behavior
- Works on all screen sizes

### Testing Responsive Behavior

1. Open `test.html` in a browser
2. Resize browser window to various widths
3. Verify aspect ratio maintained at all sizes
4. Check that embeds don't overflow container
5. Test placeholder click on mobile (touch)

---

## Accessibility

### Semantic HTML

The embed block uses proper semantic elements:

**Iframe Embeds:**

- `<iframe>` with descriptive `title` attribute
- `allowfullscreen` attribute for full-screen support
- `allow` attribute for feature permissions

**Play Button:**

- `<button type="button">` for placeholder interaction
- `title` attribute for screen reader context
- Keyboard accessible (Enter/Space)

**Twitter Embeds:**

- `<blockquote>` semantic container
- Link to original tweet (fallback)
- Twitter widget provides full accessibility

### Screen Reader Support

**What works well:**

- Iframe title announces embed content type
- Play button title announces "Play"
- Link to source URL available as fallback
- Twitter blockquote has proper semantic structure

**Screen reader flow:**

1. "Embed region" or "Content from YouTube"
2. Play button: "Play, button"
3. After loading: "Frame, Content from YouTube"

### Keyboard Navigation

**Supported keys:**

- **Tab** - Move focus to play button or iframe
- **Enter/Space** - Activate play button (load video)
- **Iframe content** - Focus enters iframe (video controls accessible)

**Focus Management:**

- Visible focus indicators on play button
- Iframe gains focus after loading
- No keyboard traps
- Logical tab order maintained

### ARIA Attributes

**Current implementation:**

- No custom ARIA attributes
- Relies on semantic HTML (`<iframe>`, `<button>`)
- iframe `title` provides accessible name

**Potential enhancements:**

- `aria-label` on play button for more context
- `role="region"` with `aria-label` on container
- `aria-live` to announce loading state
- `aria-describedby` for embed description

### Alternative Content

**Fallback patterns:**

- Twitter: Link to tweet if widget fails
- Generic embeds: URL visible if iframe blocked
- Placeholder: Image visible if embed fails

---

## Performance

### JavaScript Execution

**Initial decoration:**

- Single setup on page load
- Minimal DOM manipulation
- Lightweight provider detection
- No ongoing event listeners (except placeholder click or observer)

**Per interaction:**

- Click handler loads embed (with placeholder)
- Intersection Observer triggers load (without placeholder)
- URL parsing and HTML string generation
- One-time iframe injection

**Optimization benefits:**

- No embed loaded until needed (lazy loading)
- No external scripts for YouTube/Vimeo
- Twitter script loaded only for Twitter embeds
- Intersection Observer is efficient (native browser API)

### Memory Footprint

**Per embed block:**

- Event listener (click or intersection)
- URL string and provider config lookup
- Minimal memory overhead
- Observer disconnects after loading

**Typical usage:**

- 1-3 embeds per page
- < 2KB JavaScript (minified)
- < 500 bytes CSS (minified)
- Iframe contents isolated (separate memory)

### Network Efficiency

**Initial load:**

- embed.js: ~2KB (minified)
- embed.css: ~500 bytes (minified)
- No external dependencies (except Twitter widget.js if needed)
- No API calls

**With Placeholder:**

- Placeholder image loaded (content-dependent size)
- Video loads only on click
- User controls data usage

**Without Placeholder:**

- Embed loads when entering viewport
- `loading="lazy"` on iframe (additional browser optimization)
- No wasted bandwidth for off-screen embeds

**Twitter Performance:**

- Widget.js: ~50KB (external, loaded only for Twitter embeds)
- Multiple requests for tweet rendering
- Slowest of all embed types

### Loading Strategy

**Lazy Loading Benefits:**

- Reduces initial page weight
- Improves Time to Interactive (TTI)
- Defers non-critical resources
- Prioritizes above-the-fold content

**Placeholder Strategy:**

- Best for Core Web Vitals optimization
- User initiates loading (perceived performance)
- Reduces Largest Contentful Paint (LCP)
- Prevents Cumulative Layout Shift (CLS) with static image

### Lighthouse Impact

Expected Lighthouse scores with embed block:

**With Placeholder (Best):**

- Performance: 95-100
- Accessibility: 90-100 (depends on image alt text)
- Best Practices: 100
- SEO: 90-100 (depends on content)

**Without Placeholder (Lazy Loading):**

- Performance: 90-95 (slight delay for Intersection Observer)
- Accessibility: 90-100
- Best Practices: 100
- SEO: 90-100

**Twitter Embeds:**

- Performance: 70-85 (widget.js overhead)
- Accessibility: 95-100 (Twitter provides good a11y)
- Best Practices: 95-100
- SEO: 85-95

---

## Browser Support

### Supported Browsers

- Chrome/Edge: Last 2 versions ✓
- Firefox: Last 2 versions ✓
- Safari: Last 2 versions ✓
- iOS Safari: Last 2 versions ✓
- Android Chrome: Last 2 versions ✓

### Required Features

- Intersection Observer API (lazy loading)
- ES6 arrow functions
- Template literals
- querySelector/querySelectorAll
- addEventListener
- URLSearchParams (YouTube URL parsing)

**All modern browsers support these features.**

### Internet Explorer 11

**Partial support with polyfills:**

- Intersection Observer: Requires polyfill
- URLSearchParams: Requires polyfill
- Arrow functions: Requires transpilation
- Template literals: Requires transpilation

**Recommendation:** IE11 is not officially supported. Embeds will fail without polyfills.

### Provider Compatibility

**YouTube:**

- All modern browsers ✓
- Mobile browsers ✓
- Fullscreen API varies by browser

**Vimeo:**

- All modern browsers ✓
- Mobile browsers ✓
- Consistent experience

**Twitter:**

- All modern browsers ✓
- Mobile browsers ✓
- Widget.js handles compatibility

**Generic Embeds:**

- Depends on embed provider
- Iframe sandboxing varies by browser
- Test specific use cases

---

## Troubleshooting

### Issue: Embed not appearing

**Symptoms:**

- Empty block where embed should be
- No iframe visible
- Console errors

**Solutions:**

1. **Check URL format:**
   - Verify URL is complete and valid
   - Check for typos in domain
   - Ensure URL starts with https://
   - Test URL in browser directly

2. **Inspect DOM structure:**
   - Use DevTools Elements panel
   - Verify `.embed.block` element exists
   - Check if link (`<a>`) element present
   - Look for `embed-is-loaded` class after loading

3. **Check console for errors:**
   - Look for JavaScript errors
   - Check if embed.js loaded (Network tab)
   - Verify embed.css loaded
   - Look for CORS or CSP errors (for generic embeds)

### Issue: Lazy loading not triggering

**Symptoms:**

- Embed never loads when scrolling
- Block remains empty
- No embed-is-loaded class

**Solutions:**

1. **Check Intersection Observer support:**

   ```javascript
   // In browser console
   'IntersectionObserver' in window
   // Should return true
   ```

2. **Verify block in viewport:**
   - Scroll block fully into view
   - Wait 1-2 seconds
   - Check if observer callback fires

3. **Inspect observer setup:**
   - Check console for errors
   - Verify observer.observe() called
   - Ensure no JavaScript errors before decoration

### Issue: Placeholder click not working

**Symptoms:**

- Click on play button does nothing
- Video doesn't load
- No console errors

**Solutions:**

1. **Check event listener:**

   ```javascript
   // In DevTools, inspect play button element
   getEventListeners($0)
   // Should show 'click' listener
   ```

2. **Verify placeholder structure:**
   - Inspect `.embed-placeholder` element
   - Check for play button element
   - Verify click handler attached to wrapper (not button)

3. **Test with keyboard:**
   - Tab to play button
   - Press Enter or Space
   - Should trigger same load behavior

### Issue: YouTube video not playing

**Symptoms:**

- Iframe loads but video doesn't play
- Black screen or error message
- Video blocked or unavailable

**Solutions:**

1. **Check video ID extraction:**

   ```javascript
   // Test URL parsing
   const url = new URL('https://www.youtube.com/watch?v=VIDEO_ID');
   const usp = new URLSearchParams(url.search);
   console.log('Video ID:', usp.get('v'));
   ```

2. **Verify video availability:**
   - Test URL in separate browser tab
   - Check if video is embeddable (some videos restrict embedding)
   - Look for age restrictions or geographic limitations

3. **Check embed URL:**
   - Inspect iframe `src` attribute
   - Should be: `https://www.youtube.com/embed/VIDEO_ID`
   - Verify no extra parameters breaking playback

### Issue: Twitter embed not rendering

**Symptoms:**

- Blockquote visible but no tweet design
- Just a link to tweet
- Widget.js not loading

**Solutions:**

1. **Check widget.js loaded:**
   - Open Network tab in DevTools
   - Look for `platform.twitter.com/widgets.js`
   - Verify 200 status code

2. **Wait for rendering:**
   - Twitter embeds can take 2-5 seconds to render
   - Widget.js loads asynchronously
   - Check for Twitter API errors in console

3. **Test blockquote structure:**
   - Inspect blockquote HTML
   - Verify link to tweet exists
   - Check class name is `twitter-tweet`

### Issue: Generic embed blocked by CORS

**Symptoms:**

- Console error about CORS
- Iframe refuses to load
- X-Frame-Options or CSP errors

**Solutions:**

1. **Check provider allows iframe:**
   - Not all sites allow embedding
   - Look for X-Frame-Options errors
   - Test URL in standalone iframe

2. **Use provider's embed code:**
   - Many providers have official embed URLs
   - Example: `embed.example.com` instead of `example.com`
   - Check provider documentation

3. **Consider provider-specific block:**
   - For frequently used providers
   - Create custom embed function
   - Add to EMBEDS_CONFIG

### Issue: Aspect ratio not maintained

**Symptoms:**

- Embed too tall or too short
- Layout shifting on resize
- Incorrect proportions

**Solutions:**

1. **Check CSS loaded:**
   - Verify embed.css loaded (Network tab)
   - Look for padding-bottom: 56.25% style
   - Check parent container styles

2. **Inspect container:**
   - Verify wrapper div has padding-bottom
   - Check position: relative on container
   - Ensure iframe has position: absolute

3. **Test responsive behavior:**
   - Resize browser window
   - Verify aspect ratio maintained
   - Check for CSS conflicts with parent elements

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**

   ```
   http://localhost:3000/blocks/embed/test.html
   ```

2. **Visual checks:**
   - All embed types display correctly
   - Aspect ratio is 16:9
   - Placeholder images show play button
   - Twitter embeds render fully

3. **Interaction testing:**
   - Click play button on placeholder embeds
   - Verify autoplay works after click
   - Test lazy loading by scrolling
   - Check embeds load when entering viewport

4. **Responsive testing:**
   - Resize browser to mobile width (< 600px)
   - Verify embeds scale properly
   - Test touch interaction on play button
   - Check tablet width (~768px) behavior
   - Verify desktop width (> 1024px) display

5. **Provider testing:**
   - Test YouTube standard URL
   - Test YouTube short URL (youtu.be)
   - Test Vimeo embed
   - Test Twitter post
   - Test generic embed (unknown provider)

6. **Accessibility testing:**
   - Use keyboard only (Tab, Enter/Space)
   - Test with screen reader
   - Verify iframe titles
   - Check play button accessibility

7. **Browser testing:**
   - Test in Chrome, Firefox, Safari
   - Verify consistent appearance
   - Check for browser-specific issues
   - Test mobile browsers (iOS Safari, Android Chrome)

### DevTools Inspection

**Check embed structure:**

`Inspect loaded embed`
`document.querySelectorAll('.embed.embed-is-loaded').length`
`// Should return count of loaded embeds`

**Verify provider detection:**

`Test provider matching`
`const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';`
`console.log('YouTube:', link.includes('youtube')); // true`

**Test Intersection Observer:**

`Check observer support`
`'IntersectionObserver' in window`
`// Should return true in modern browsers`

**Verify lazy loading attribute:**

`Inspect iframe attributes`
`document.querySelector('.embed iframe').getAttribute('loading')`
`// Should return "lazy"`

**Check Twitter widget loaded:**

`Verify Twitter script`
`document.querySelector('script[src*="twitter.com/widgets.js"]')`
`// Should return script element for Twitter embeds`

### Performance Testing

**Lighthouse Audit:**

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories (Performance, Accessibility, Best Practices)
4. Run audit
5. Verify scores meet expectations

**Network Waterfall:**

1. Open Network tab in DevTools
2. Reload page
3. Observe when embeds load
4. Verify lazy loading delays embed requests
5. Check placeholder images load early

**Core Web Vitals:**

1. Use PageSpeed Insights or Lighthouse
2. Check Largest Contentful Paint (LCP) < 2.5s
3. Verify Cumulative Layout Shift (CLS) < 0.1
4. Confirm First Input Delay (FID) < 100ms

### Automated Testing

**Future implementation:**

- Jest tests for provider detection
- Test URL parsing (YouTube, Vimeo, Twitter)
- Test embed HTML generation
- Test lazy loading logic
- Accessibility tests with axe-core
- Visual regression tests with Playwright

**Example test cases:**

`Embed Block Tests`
`describe('Embed Block', () => {`
`test('detects YouTube provider from URL', () => {});`
`test('detects Vimeo provider from URL', () => {});`
`test('detects Twitter provider from URL', () => {});`
`test('falls back to generic embed for unknown provider', () => {});`
`test('creates placeholder with play button if image present', () => {});`
`test('sets up Intersection Observer if no placeholder', () => {});`
`test('generates correct YouTube embed HTML', () => {});`
`test('generates correct Vimeo embed HTML', () => {});`
`test('generates correct Twitter blockquote', () => {});`
`test('marks block as loaded after embed created', () => {});`
`});`

---

## Dependencies

### Internal Dependencies

1. **None** - The embed block is a standalone EDS component with no internal dependencies on other blocks or utilities.

### External Dependencies

1. **Twitter Widget.js** (Optional - only for Twitter embeds)
   - URL: `https://platform.twitter.com/widgets.js`
   - Used for: Rendering Twitter blockquote as full tweet
   - Loaded: Dynamically when Twitter embed detected
   - Size: ~50KB
   - Note: External dependency, can affect performance

### Browser APIs

- Intersection Observer API (lazy loading)
- URL and URLSearchParams (URL parsing)
- DOM manipulation (querySelector, createElement, addEventListener)
- Flexbox (centering embeds)
- CSS positioning (aspect ratio maintenance)

---

## Future Enhancements

### Planned Features

1. **Additional Providers**
   - Instagram posts
   - TikTok videos
   - Facebook videos
   - LinkedIn posts
   - Spotify embeds
   - SoundCloud tracks

2. **Embed Variations**
   - `embed (square)` - 1:1 aspect ratio (Instagram)
   - `embed (vertical)` - 9:16 aspect ratio (TikTok, Stories)
   - `embed (minimal)` - No max-width constraint
   - `embed (bordered)` - Visual emphasis with border/shadow
   - `embed (background)` - Custom background color

3. **Advanced Features**
   - Deep linking with timestamps (YouTube, Vimeo)
   - Autoplay control (enable/disable)
   - Mute control for autoplay videos
   - Playlist support for YouTube
   - Caption/subtitle support
   - Quality selection (YouTube)

4. **Performance Improvements**
   - Facade pattern (custom player skin with faster load)
   - Connection preloading (`<link rel="preconnect">`)
   - DNS prefetch for embed domains
   - Lazy loading for placeholder images
   - WebP format for placeholders

5. **Accessibility Enhancements**
   - Transcript support for videos
   - Audio description integration
   - Keyboard controls for embedded players
   - ARIA live regions for loading states
   - Focus management after loading

6. **Developer Experience**
   - Configuration options via CSS custom properties
   - Aspect ratio customization
   - Custom provider registration
   - Event hooks (onLoad, onPlay, onError)
   - TypeScript type definitions

### Contributing

To propose enhancements:

1. Create test content in Google Docs
2. Implement feature in JavaScript/CSS
3. Add test cases to test.html
4. Update documentation (README.md, EXAMPLE.md)
5. Submit PR with demo link

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[test.html](./test.html)** - Browser-based testing file
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles
- **[Performance Optimization](../../docs/for-ai/implementation/performance-optimization.md)** - Lazy loading and Core Web Vitals

---

## Security Considerations

### Content Security Policy (CSP)

**Embed block requires CSP allowances:**

- `frame-src` - YouTube, Vimeo, Twitter domains
- `script-src` - Twitter widget.js domain
- `img-src` - Placeholder images, Twitter avatars

**Recommended CSP:**

`Content Security Policy`
`frame-src 'self' https://www.youtube.com https://player.vimeo.com https://platform.twitter.com;`
`script-src 'self' https://platform.twitter.com;`
`img-src 'self' https: data:;`

### Iframe Sandboxing

**Default iframe permissions:**

- `allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"`
- No `sandbox` attribute (full permissions)
- Embeds can: run scripts, access cookies, submit forms

**Security implications:**

- YouTube and Vimeo are trusted providers
- Generic embeds inherit full permissions
- Consider adding `sandbox` attribute for unknown providers

**Enhanced security for generic embeds:**

`Sandboxed iframe for unknown providers`
`<iframe`
`sandbox="allow-scripts allow-same-origin"`
`src="https://untrusted-provider.com/embed"`
`></iframe>`

### XSS Prevention

**URL sanitization:**

- URLs are not sanitized in current implementation
- Potential XSS if attacker controls URL
- EDS should sanitize links before decoration

**Mitigation:**

- Trust only author-provided URLs
- Validate URL format before embedding
- Consider allowlist of domains

### Privacy Considerations

**Third-party tracking:**

- YouTube, Vimeo, Twitter may track users
- Cookies set by embed providers
- User IP addresses shared with providers

**Privacy-enhanced mode:**

- YouTube: Use `youtube-nocookie.com` domain
- Consider privacy-focused embed alternatives
- Inform users of tracking in privacy policy

---

## Version History

- **v1.0** (Current) - Initial implementation
  - Multi-provider support (YouTube, Vimeo, Twitter)
  - Lazy loading with Intersection Observer
  - Click-to-play placeholder functionality
  - Responsive 16:9 aspect ratio
  - Generic iframe fallback
  - Performance optimized with loading="lazy"

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [EXAMPLE.md](./EXAMPLE.md) for usage examples
3. Test with [test.html](./test.html)
4. File issue with detailed reproduction steps

---

**Last Updated:** 2025-11-28
**Block Version:** 1.0
**EDS Compatibility:** Current
**Adobe Source:** Block Collection (https://www.hlx.live/developer/block-collection/embed)
