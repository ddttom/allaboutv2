# Video Block - Usage Examples

This document shows how to use the video block in Google Docs to embed YouTube, Vimeo, and MP4 videos with lazy loading and optional poster images.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

### Simple YouTube Video

| Video |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID |

**Result:** YouTube video with lazy loading. Video loads only when scrolled into view.

### Video with Custom Poster

| Video |
|-------|
| ![Product demonstration video](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=VIDEO_ID |

**Result:** Custom poster image with play button overlay. Clicking loads the video.

### Autoplay Background Video

| Video (autoplay) |
|------------------|
| https://vimeo.com/123456789 |

**Result:** Muted, looping video that autoplays when scrolled into view. Perfect for hero sections.

---

## Basic Usage

### Minimal Example - YouTube

| Video |
|-------|
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Output:** Basic YouTube embed with lazy loading

### Minimal Example - Vimeo

| Video |
|-------|
| https://vimeo.com/123456789 |

**Output:** Basic Vimeo embed with lazy loading

### Minimal Example - MP4

| Video |
|-------|
| https://example.com/video.mp4 |

**Output:** HTML5 video player with controls

---

## Common Patterns

### Pattern 1: Tutorial Video with Poster

Perfect for educational content and how-to guides:

| Video |
|-------|
| ![Getting Started Tutorial video](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| https://www.youtube.com/watch?v=TUTORIAL_ID |

**Best for:** Tutorial pages, documentation, learning centers

**Why use a poster:**

- Custom thumbnail more attractive than YouTube default
- Consistent branding across all videos
- Control over what users see before playing

### Pattern 2: Hero Background Video

Ambient video for landing page hero sections:

| Video (autoplay) |
|------------------|
| https://vimeo.com/HERO_VIDEO_ID |

**Best for:** Homepage heroes, section backgrounds, ambient effects

**Note:** Autoplay videos are always muted (browser requirement)

### Pattern 3: Product Demo with Branded Poster

Showcase products with professional thumbnail:

| Video |
|-------|
| ![New Product Features video](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| https://www.youtube.com/watch?v=PRODUCT_DEMO |

**Best for:** Product pages, feature highlights, marketing content

**Tip:** Use high-quality product images as posters for maximum impact

### Pattern 4: Customer Testimonial

Video testimonials with customer photo poster:

| Video |
|-------|
| ![Customer testimonial from Jane Smith video](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| https://www.youtube.com/watch?v=TESTIMONIAL_ID |

**Best for:** Case studies, testimonial pages, social proof sections

**Tip:** Use customer photo as poster to build trust and recognition

### Pattern 5: Event Recording

Conference talks, webinars, and event recordings:

| Video |
|-------|
| ![Conference 2024 Keynote video](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| https://vimeo.com/EVENT_VIDEO_ID |

**Best for:** Event pages, webinar archives, presentation libraries

### Pattern 6: Multiple Videos in Sequence

Create a video gallery or playlist:

| Video |
|-------|
| ![Episode 1: Introduction video](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=EPISODE_1 |

| Video |
|-------|
| ![Episode 2: Advanced Techniques video](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| https://www.youtube.com/watch?v=EPISODE_2 |

| Video |
|-------|
| ![Episode 3: Best Practices video](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| https://www.youtube.com/watch?v=EPISODE_3 |

**Best for:** Course content, series, step-by-step guides

**Note:** Each video block is independent with its own lazy loading

---

## Content Requirements

### Video URL Requirements

**YouTube Formats (all supported):**

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Vimeo Formats (all supported):**

- `https://vimeo.com/VIDEO_ID`
- `https://player.vimeo.com/video/VIDEO_ID`

**MP4 Requirements:**

- Must be a direct link to `.mp4` file
- File must be accessible (no authentication required)
- Recommended codecs: H.264 for maximum compatibility
- Hosted on same domain OR CORS headers configured

**Not supported:**

- Facebook videos
- Instagram videos
- TikTok videos
- Dailymotion
- Other platforms (may be added in future)

### Poster Image Requirements

**Recommended Specifications:**

- Aspect ratio: 16:9 (e.g., 1920x1080, 1280x720, 800x450)
- File format: JPEG or PNG (WebP also supported)
- File size: < 200KB (will be optimized automatically)
- Minimum width: 800px
- Maximum width: 1920px

**Why this matters:**

- Videos display at 16:9 aspect ratio
- Matching poster prevents layout shift
- Smaller files load faster
- EDS optimization improves performance further

**Image optimization tips:**

1. Crop images to 16:9 before upload
2. Compress images (use TinyPNG, ImageOptim, etc.)
3. Use appropriate dimensions (don't upload 4K images)
4. Provide descriptive alt text for accessibility

### Alt Text Best Practices

**Good alt text patterns:**

```markdown
![Product launch keynote video](poster.jpg)
![Tutorial: Getting Started with EDS video](poster.jpg)
![Customer testimonial from Sarah Johnson video](poster.jpg)
![Behind the scenes at our factory video](poster.jpg)
```

**Bad alt text patterns:**

```markdown
![](poster.jpg)                    ❌ Empty alt text
![video](poster.jpg)                ❌ Generic, not descriptive
![poster](poster.jpg)               ❌ Describes file, not content
![image123.jpg](poster.jpg)         ❌ Filename, not description
```

**Why this matters:**

- Screen readers announce alt text to users
- Helps users decide whether to play video
- Improves SEO and content discoverability
- Required for accessibility compliance

---

## Styling Guidelines

### Visual Appearance

**Default Behavior:**

- Videos centered on page
- Maximum width: 800px
- 32px vertical margin above and below
- 16:9 aspect ratio maintained
- Full-width on mobile devices

**Poster Image Display:**

- Custom image fills video area
- Play button overlay in center
- Clickable anywhere on poster
- Smooth transition to video on click

**Lazy Loading Indicator:**

- Space reserved before video loads
- Prevents page jumping during load
- Improves Core Web Vitals scores
- Invisible to users (seamless experience)

### Responsive Behavior

**Mobile Phones (< 600px):**

- Full-width videos
- Respects parent container width
- 16:9 aspect ratio maintained
- Touch-friendly play button
- Inline playback (no fullscreen takeover)

**Tablets (600px - 1024px):**

- Centered with max-width: 800px
- Proper spacing and margins
- Comfortable viewing size
- Supports landscape and portrait

**Desktop (> 1024px):**

- Same behavior as tablets
- Maximum 800px width
- Centered layout
- Optimal viewing experience

### Autoplay Styling

**Visual Differences:**

- No play button overlay
- Video loads when scrolled into view
- Begins playing automatically (muted)
- No controls visible (seamless background)
- Loops continuously

**Use cases for autoplay:**

- Hero section backgrounds
- Ambient atmospheric videos
- Product demos (muted showcase)
- Visual interest without audio

---

## Best Practices

### Choosing the Right Video Platform

**Use YouTube when:**

- You want video analytics
- Need comment sections
- Want suggested videos
- Public content discovery important
- Free hosting with unlimited bandwidth

**Use Vimeo when:**

- Professional presentation needed
- Privacy and control important
- Cleaner embed (no ads)
- Background video mode needed (Pro account)
- Brand-focused content

**Use MP4 when:**

- Short clips (< 5MB)
- Need offline capability
- No platform dependency
- Custom branding required
- Private/internal content

### Performance Optimization

**1. Always use poster images for above-the-fold videos**

- Faster perceived load time
- User controls when video loads
- Reduces initial bandwidth usage
- Better Core Web Vitals scores

**2. Optimize poster images before upload**

- Compress to < 200KB
- Use correct dimensions (800-1920px wide)
- Choose JPEG for photos, PNG for graphics
- Crop to 16:9 aspect ratio

**3. Limit autoplay videos**

- One autoplay video per page maximum
- Place below the fold when possible
- Consider user experience and bandwidth
- Always provide manual alternative

**4. Keep MP4 files small**

- Compress before hosting (HandBrake, FFmpeg)
- Use H.264 codec for compatibility
- Target 720p or 1080p (not 4K)
- Consider streaming platforms for longer videos

### Accessibility Guidelines

**1. Provide descriptive alt text**

- Describe video content specifically
- Include "video" keyword for context
- Help users decide whether to watch
- Required for WCAG compliance

**2. Enable captions when possible**

- YouTube: Upload caption files
- Vimeo: Add subtitles in settings
- MP4: Include WebVTT caption tracks
- Consider auto-generated captions as baseline

**3. Avoid autoplay with sound**

- Browser policies block this anyway
- Disruptive to user experience
- Accessibility issue for screen reader users
- Autoplay in video block is always muted

**4. Test keyboard navigation**

- Play button focusable with Tab
- Activates with Enter or Space
- Video player controls keyboard accessible
- Fullscreen mode keyboard accessible

### Content Strategy

**Video Length Guidelines:**

- Hero videos: 10-30 seconds (looping background)
- Product demos: 1-3 minutes (key features only)
- Tutorials: 3-10 minutes (focused, single topic)
- Testimonials: 30-90 seconds (concise, authentic)
- Webinars: 30-60 minutes (archived for reference)

**When NOT to Use Video Block:**

- Audio-only content (use audio player instead)
- Live streams (use platform-specific embed)
- Complex playlists (consider blog post with multiple blocks)
- Interactive videos (need custom implementation)

---

## Troubleshooting

### Issue: Video not displaying

**Check these common causes:**

1. **URL format incorrect**
   - Verify URL is complete and correct
   - Test URL in browser directly
   - Check for typos in video ID

2. **Platform not supported**
   - Only YouTube, Vimeo, and MP4 are supported
   - Facebook, Instagram, TikTok not supported
   - Consider uploading to YouTube/Vimeo

3. **Video privacy settings**
   - YouTube: Must be Public or Unlisted
   - Vimeo: Check privacy settings
   - Vimeo: Verify domain whitelist if restricted

### Issue: Poster image not showing

**Check these common causes:**

1. **Image order incorrect**

   ```
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

2. **Image URL not accessible**
   - Test image URL in browser
   - Check image hosting
   - Verify no authentication required

3. **Image optimization failure**
   - Try different image format
   - Reduce file size
   - Verify image is valid (not corrupted)

### Issue: Autoplay not working

**Check these requirements:**

1. **Variation class missing**

   ```
   ✅ Correct:
   | Video (autoplay) |
   |------------------|

   ❌ Wrong:
   | Video |
   |-------|
   ```

2. **Browser autoplay policy**
   - All modern browsers require muted playback
   - User interaction sometimes required first
   - Check browser console for errors

3. **Vimeo background mode**
   - Requires Vimeo Pro or Business account
   - Free accounts don't support background mode
   - Consider YouTube for free autoplay

### Issue: Video quality poor

**Solutions:**

1. **YouTube quality settings**
   - Upload higher quality source
   - YouTube auto-adjusts based on bandwidth
   - Users can manually select quality

2. **Vimeo quality settings**
   - Check upload quality
   - Verify compression settings
   - Consider Plus/Pro for better quality

3. **MP4 quality**
   - Upload higher bitrate file
   - Use H.264 codec, High profile
   - Balance quality vs file size

### Issue: Video not lazy loading

**Check these:**

1. **IntersectionObserver support**
   - Modern browsers only
   - IE11 not supported
   - Check browser console for errors

2. **Poster image present**
   - Videos with posters load on click (not scroll)
   - Remove poster to enable scroll-based lazy loading
   - This is expected behavior

---

## Advanced Techniques

### Custom Video Dimensions

For non-standard aspect ratios (requires CSS):

**Vertical Video (9:16):**

```css
.video.vertical {
  aspect-ratio: 9 / 16;
  max-width: 400px;
}
```

Then use: `Video (vertical)` in markdown

**Square Video (1:1):**

```css
.video.square {
  aspect-ratio: 1 / 1;
  max-width: 600px;
}
```

Then use: `Video (square)` in markdown

### Full-Width Videos

Make videos span full page width (requires CSS):

```css
.video.full-width {
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}
```

Then use: `Video (full-width)` in markdown

### Custom Play Button

Style the play button (requires CSS):

```css
.video .video-placeholder-play button {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.8);
  transform: scale(4); /* Larger button */
}

.video .video-placeholder-play button::before {
  border-left-color: #ffffff;
}
```

### Dark Overlay on Poster

Add subtle overlay to poster images (requires CSS):

```css
.video .video-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
```

### Video with Text Overlay

Combine with other blocks for overlaid text:

| Video (autoplay) |
|------------------|
| https://vimeo.com/BACKGROUND_VIDEO |

### Our Story

We've been creating innovative solutions since 2010.

**Result:** Text appears over/after background video

---

## Integration Examples

### Video After Hero

Common pattern for landing pages:

| Hero |
|------|
| ![Hero background](hero.jpg) |
| # Welcome to Our Platform |
| Discover amazing features |

| Video |
|-------|
| ![Platform overview video](video-poster.jpg) |
| https://www.youtube.com/watch?v=OVERVIEW_VIDEO |

### Multiple Videos in Grid

Create a video gallery (requires section wrapper):

**Section: Video Library**

| Video |
|-------|
| ![Tutorial 1 video](poster1.jpg) |
| https://www.youtube.com/watch?v=TUT1 |

| Video |
|-------|
| ![Tutorial 2 video](poster2.jpg) |
| https://www.youtube.com/watch?v=TUT2 |

| Video |
|-------|
| ![Tutorial 3 video](poster3.jpg) |
| https://www.youtube.com/watch?v=TUT3 |

### Video with Transcript

Provide text alternative for accessibility:

| Video |
|-------|
| ![Product demo video](poster.jpg) |
| https://www.youtube.com/watch?v=DEMO_VIDEO |

**Video Transcript:**

In this video, we demonstrate how to set up your account...

[Full transcript here]

---

## Testing Your Videos

### Visual Testing Checklist

Before publishing:

1. **Video loads correctly:**
   - [ ] Video URL is correct
   - [ ] Video displays when scrolled into view
   - [ ] Clicking play works (if poster present)
   - [ ] Video plays in correct aspect ratio

2. **Poster image (if used):**
   - [ ] Image displays correctly
   - [ ] Play button overlay visible
   - [ ] Clicking anywhere loads video
   - [ ] No layout shift when video loads

3. **Responsive behavior:**
   - [ ] Test on mobile device (< 600px)
   - [ ] Test on tablet (600-1024px)
   - [ ] Test on desktop (> 1024px)
   - [ ] No horizontal scrolling

4. **Accessibility:**
   - [ ] Alt text descriptive and meaningful
   - [ ] Play button keyboard accessible (Tab, Enter)
   - [ ] Video player controls keyboard accessible
   - [ ] Captions available (if applicable)

5. **Performance:**
   - [ ] Video doesn't slow page load
   - [ ] Poster image loads quickly (< 500ms)
   - [ ] No layout jumping during load
   - [ ] Lazy loading working correctly

### Browser Testing

Test in multiple browsers:

- Chrome (Desktop and Mobile)
- Safari (Desktop and iOS)
- Firefox (Desktop)
- Edge (Desktop)

### Platform-Specific Testing

**YouTube:**

- [ ] Video plays correctly
- [ ] Controls visible and functional
- [ ] Fullscreen mode works
- [ ] Quality settings accessible

**Vimeo:**

- [ ] Video plays correctly
- [ ] Controls visible (or hidden for autoplay)
- [ ] Fullscreen mode works
- [ ] Branding appropriate

**MP4:**

- [ ] Video plays in all browsers
- [ ] Controls visible and functional
- [ ] Buffering indicator shows
- [ ] Playback smooth (no stuttering)

---

## Related Blocks

**Complementary blocks:**

- **Hero** - Large introductory section before video
- **Quote** - Pull quotes or testimonials between videos
- **Columns** - Side-by-side content with video
- **Tabs** - Organize multiple videos in tab interface

**Alternative blocks:**

- **Embed** - Generic iframe embed (if video platform not supported)
- **Modal** - Video in popup overlay (future enhancement)

---

## Version History

- **v1.0** (Current) - Initial video block implementation
  - YouTube, Vimeo, MP4 support
  - Lazy loading with IntersectionObserver
  - Poster image support
  - Autoplay variation
  - 16:9 aspect ratio

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation for developers
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Editors
