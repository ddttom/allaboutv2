---
title: "Embed Block - Usage Examples"
description: "Usage examples for the embed EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Embed Block - Usage Examples

This document shows how to use the embed block in Google Docs to seamlessly integrate third-party media and social content. Perfect for embedding YouTube videos, Vimeo content, Twitter posts, and any iframe-based widgets with performance optimization and lazy loading.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Provider-Specific Examples](#provider-specific-examples)
- [Placeholder Images](#placeholder-images)
- [Content Requirements](#content-requirements)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create a simple YouTube embed in Google Docs:

| Embed |
|-------|
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Result:** YouTube video player embedded with 16:9 aspect ratio, lazy loads when scrolled into view. Automatically recognizes YouTube URLs and creates optimized iframe.

---

## Basic Usage

### Minimal Example

The simplest embed with just a URL:

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID |

**Output:** Responsive video player that loads when scrolled into viewport. No extra configuration needed.

### With Placeholder Image

Add a preview image for improved performance:

| Embed |
|-------|
| ![Video preview](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=VIDEO_ID |

**Output:** Custom preview image with play button overlay. Video loads only when clicked. Best for Core Web Vitals optimization.

---

## Provider-Specific Examples

### YouTube Videos

**Standard URL:**

| Embed |
|-------|
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Short URL (youtu.be):**

| Embed |
|-------|
| https://youtu.be/dQw4w9WgXcQ |

**Embed URL:**

| Embed |
|-------|
| https://www.youtube.com/embed/dQw4w9WgXcQ |

All three formats work identically. The block automatically extracts the video ID and creates an optimized embed.

**Features:**

- Lazy loading (loads when scrolled into view)
- Fullscreen support
- Autoplay when clicked (if placeholder used)
- Related videos disabled (`rel=0` parameter)

### Vimeo Videos

| Embed |
|-------|
| https://vimeo.com/123456789 |

**Features:**

- Clean player interface
- Fullscreen support
- Autoplay on click (if placeholder used)
- Responsive 16:9 aspect ratio

### Twitter Posts

| Embed |
|-------|
| https://twitter.com/username/status/1234567890123456789 |

**Features:**

- Full tweet rendering (text, images, links)
- Twitter branding and styling
- Interactive elements (like, retweet, reply)
- Note: Loads slower due to external script dependency

**Important:** Twitter embeds require loading an external widget script (~50KB). This impacts performance more than YouTube/Vimeo embeds.

### Generic Embeds (Unknown Providers)

For providers not specifically supported:

| Embed |
|-------|
| https://example.com/embed/widget-id |

**Result:** Generic 16:9 iframe with standard settings. Works for any embeddable content but requires the provider to allow iframe embedding.

**Limitations:**

- Provider must allow iframe embedding (no X-Frame-Options restrictions)
- No provider-specific optimizations
- Standard permissions only

---

## Placeholder Images

### Why Use Placeholders?

**Benefits:**

- Improved page load performance
- Better Lighthouse scores (95-100)
- User controls when video loads
- Reduces data usage on mobile
- Lower Cumulative Layout Shift (CLS)

**When to use:**

- Above-the-fold videos
- Multiple embeds on same page
- Mobile-first content
- Performance-critical pages

### Creating Placeholders

**Step 1: Get a preview image**

Use a video thumbnail or custom image:

- YouTube: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
- Custom image: Any image file (recommended 800x450px for 16:9)

**Step 2: Add image before URL**

| Embed |
|-------|
| ![Preview image](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Result:** Image displays with centered play button overlay. Click triggers video load with autoplay.

### Placeholder Best Practices

**Image sizing:**

- Recommended: 800x450px (16:9 ratio)
- Minimum: 400x225px
- Maximum: 1600x900px
- Format: WebP preferred, JPEG/PNG acceptable

**Image optimization:**

- Compress images (aim for < 50KB)
- Use appropriate dimensions
- Provide descriptive alt text
- Consider lazy loading for below-fold embeds

---

## Content Requirements

### URL Requirements

**Required format:**

- Full URL including protocol: `https://example.com`
- Valid domain name
- For YouTube: Must include video ID
- For Vimeo: Must include video ID
- For Twitter: Must be full status URL

**Supported URL patterns:**

**YouTube:**

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Vimeo:**

- `https://vimeo.com/123456789`

**Twitter:**

- `https://twitter.com/username/status/1234567890`

**Invalid URLs:**

- Missing protocol: `www.youtube.com/watch?v=VIDEO_ID` ✗
- Incomplete: `youtube.com` ✗
- Wrong domain: `youtube.co/VIDEO_ID` ✗

### Markdown Table Format

**Correct format:**

```
| Embed |
|-------|
| URL_HERE |
```

**With placeholder:**

```
| Embed |
|-------|
| ![Alt text](IMAGE_URL) |
| VIDEO_URL |
```

**Common mistakes:**

- Forgetting "Embed" in header row
- Missing pipe characters
- Multiple URLs in one row (use separate tables)
- Broken image syntax

---

## Best Practices

### Performance Optimization

**1. Use placeholders for above-the-fold embeds**

| Embed |
|-------|
| ![Preview](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=VIDEO_ID |

**Benefit:** Reduces initial page weight by 80-90%. Video loads only when user clicks.

**2. Let below-the-fold embeds lazy load**

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID |

**Benefit:** Automatic lazy loading via Intersection Observer. Loads when scrolled into view.

**3. Limit embeds per page**

- Recommended: 1-3 embeds per page
- Maximum: 5-7 embeds (with lazy loading)
- Too many: Consider linking to dedicated video page

**4. Avoid Twitter embeds when possible**

Twitter embeds load slowest due to external script dependency (~50KB). Consider:

- Screenshot with link as alternative
- Blockquote with manual styling
- Dedicated Twitter feed plugin

### Content Strategy

**1. Provide context around embeds**

Before embed:
"Watch our product demo video to see key features in action:"

| Embed |
|-------|
| https://www.youtube.com/watch?v=PRODUCT_DEMO |

After embed:
"For more tutorials, visit our YouTube channel."

**2. Use descriptive placeholder images**

Good placeholder: Screenshot showing video content or topic
Poor placeholder: Generic play button or blank image

**3. Consider mobile users**

- Videos on mobile use more data
- Placeholders let users decide when to load
- Ensure embeds work on small screens
- Test touch interaction on play button

**4. Accessibility considerations**

- Provide text description of video content
- Ensure transcript available (link separately)
- Use descriptive alt text for placeholder images
- Don't rely solely on video for critical information

### SEO Best Practices

**1. Surround with relevant content**

Search engines can't index video content. Provide:

- Text description of video topic
- Key points covered in video
- Relevant keywords in surrounding text
- Transcript link if available

**2. Schema markup (optional)**

Consider adding VideoObject schema markup for rich results in search.

**3. Video sitemap**

For YouTube videos, ensure they're in your video sitemap for better discoverability.

### When NOT to Use Embeds

**Avoid embeds for:**

- Critical content (provide text alternative)
- Privacy-sensitive pages (third-party tracking)
- Extremely performance-critical pages
- Content requiring offline access
- Regulatory-compliant content (GDPR considerations)

**Better alternatives:**

- Self-hosted videos (for full control)
- Video links (let users choose to visit provider)
- Screenshots with links (for previews)
- Dedicated video pages (reduces page weight)

---

## Troubleshooting

### Issue: Embed not showing

**Problem:** Empty space where embed should be.

**Solutions:**

1. **Check URL format:**
   - Verify URL is complete: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Check for typos in domain
   - Test URL in browser directly

2. **Verify table structure:**

   ```
   | Embed |
   |-------|
   | URL |
   ```

   - Header must say "Embed"
   - Use pipe characters correctly
   - One URL per table

3. **Check provider restrictions:**
   - Some videos disable embedding
   - Geographic restrictions may apply
   - Age-restricted content may not embed

### Issue: Placeholder not clickable

**Problem:** Play button appears but clicking does nothing.

**Solutions:**

1. **Check image format:**
   - Use standard markdown image syntax: `![Alt](URL)`
   - Verify image URL is accessible
   - Ensure image loads successfully

2. **Verify URL on next row:**

   ```
   | Embed |
   |-------|
   | ![Preview](IMAGE.jpg) |
   | https://youtube.com/watch?v=ID |
   ```

   - Video URL must be on separate row
   - Don't combine image and URL in one cell

3. **Test without placeholder:**
   - Remove image temporarily
   - See if embed loads via lazy loading
   - This isolates the issue

### Issue: Twitter embed shows only link

**Problem:** Just a link to tweet, no fancy styling.

**Cause:** Twitter widget.js hasn't loaded yet or failed to load.

**Solutions:**

1. **Wait 2-5 seconds** - Twitter embeds load slower than videos
2. **Check console** - Look for JavaScript errors
3. **Verify Twitter URL** - Must be full status URL
4. **Test URL directly** - Visit Twitter URL to verify tweet exists

### Issue: Video cuts off on mobile

**Problem:** Embed doesn't fit mobile screen.

**Cause:** Likely parent container has fixed width.

**Solutions:**

1. **Check parent container** - Ensure no fixed widths
2. **Verify responsive CSS** - Block should have max-width: 800px
3. **Test in DevTools** - Use mobile device preview

### Issue: Multiple embeds slow page

**Problem:** Page loads slowly with several embeds.

**Solutions:**

1. **Add placeholders** - Especially for above-fold videos

   ```
   | Embed |
   |-------|
   | ![Preview](IMAGE.jpg) |
   | VIDEO_URL |
   ```

2. **Reduce embed count** - Link to video page instead
3. **Avoid Twitter embeds** - Slowest due to external script
4. **Space out embeds** - Lazy loading works better when embeds far apart

---

## Advanced Techniques

### Multiple Embeds on One Page

Space embeds throughout content for optimal performance:

### Introduction

Content introducing the topic...

| Embed |
|-------|
| ![Video 1](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=VIDEO1 |

### Middle Section

More content explaining concepts...

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO2 |

### Conclusion

Final thoughts and summary...

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO3 |

**Best practices:**

- Use placeholder for first video (above fold)
- Let subsequent videos lazy load
- Space embeds with meaningful content between
- Limit to 3-5 per page maximum

### Combining with Other Blocks

**Embed in columns:**

| Columns |
|---------|
| Left column content |
| Embed: https://youtube.com/watch?v=ID |

**After hero section:**

| Hero |
|------|
| Large banner content |

| Embed |
|-------|
| https://youtube.com/watch?v=ID |

**With text sections:**

### Video Tutorial

Watch this step-by-step guide:

| Embed |
|-------|
| https://youtube.com/watch?v=ID |

### Next Steps

After watching, try these exercises...

### Custom Styling (Advanced)

Override default styles in your project's CSS:

`Larger embed max-width`
`.embed {`
`max-width: 1200px;`
`margin: 48px auto;`
`}`

`Custom play button color`
`.embed .embed-placeholder-play button {`
`background: rgba(255, 0, 0, 0.8);`
`border-radius: 50%;`
`}`

`Different aspect ratio`
`.embed.embed-4-3 > div {`
`padding-bottom: 75%; /* 4:3 ratio */`
`}`

Then apply by adding CSS to your project's stylesheet.

### Video Timestamps (YouTube)

Link to specific time in video:

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID&t=90s |

**Result:** Video starts at 1:30 mark when played.

### YouTube Playlists

Embed entire playlist:

| Embed |
|-------|
| https://www.youtube.com/playlist?list=PLAYLIST_ID |

**Note:** Generic embed fallback used. Consider linking to playlist instead of embedding.

---

## Testing Your Embeds

### Visual Testing Checklist

After adding embeds to your page:

1. **Preview on staging site:**
   - Embed appears correctly ✓
   - Aspect ratio is 16:9 ✓
   - No layout shift on load ✓
   - Video controls accessible ✓

2. **Placeholder testing (if used):**
   - Image loads quickly ✓
   - Play button visible and centered ✓
   - Click loads video with autoplay ✓
   - Keyboard accessible (Tab + Enter) ✓

3. **Lazy loading testing (without placeholder):**
   - Embed doesn't load immediately ✓
   - Loads when scrolled into view ✓
   - No unnecessary network requests ✓
   - Smooth loading transition ✓

4. **Mobile testing (< 600px):**
   - Embed scales to screen width ✓
   - Touch interaction works ✓
   - Video controls accessible ✓
   - No horizontal scrolling ✓

5. **Provider testing:**
   - YouTube video plays correctly ✓
   - Vimeo video plays correctly ✓
   - Twitter embed fully renders ✓
   - Generic embeds load properly ✓

6. **Performance testing:**
   - Page load time acceptable ✓
   - Lighthouse score > 90 ✓
   - No layout shift (CLS < 0.1) ✓
   - Time to Interactive < 3s ✓

### Browser Testing

Test in multiple browsers:

- Chrome (Windows, Mac, Android)
- Firefox (Windows, Mac)
- Safari (Mac, iOS)
- Edge (Windows)
- Samsung Internet (Android)

**Expected behavior:**

- Consistent appearance across browsers
- Video playback works everywhere
- Placeholder click works on all platforms
- Lazy loading triggers correctly

---

## Content Examples

### Example 1: Simple YouTube Embed

| Embed |
|-------|
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Use case:** Below-the-fold video tutorial or demonstration

### Example 2: YouTube with Placeholder

| Embed |
|-------|
| ![Tutorial preview](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

**Use case:** Above-the-fold promotional video or hero video

### Example 3: Vimeo Video

| Embed |
|-------|
| https://vimeo.com/123456789 |

**Use case:** Professional video content, portfolio pieces

### Example 4: Twitter Post

| Embed |
|-------|
| https://twitter.com/username/status/1234567890123456789 |

**Use case:** Social proof, testimonials, announcements

### Example 5: Multiple Videos Tutorial

### Getting Started

Welcome to our tutorial series. Follow along with these videos:

**Part 1: Introduction**

| Embed |
|-------|
| ![Part 1](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| https://www.youtube.com/watch?v=VIDEO_ID_1 |

**Part 2: Advanced Techniques**

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID_2 |

**Part 3: Best Practices**

| Embed |
|-------|
| https://www.youtube.com/watch?v=VIDEO_ID_3 |

---

## Integration Examples

### Embed After Hero Section

| Hero |
|------|
| ![Hero image](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| Welcome to Our Platform |
| Watch the video below to learn more |

| Embed |
|-------|
| ![Product demo](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| https://www.youtube.com/watch?v=PRODUCT_DEMO |

### Embed in Content Flow

## Our Story

We started with a simple idea...

| Embed |
|-------|
| https://www.youtube.com/watch?v=STORY_VIDEO |

That idea grew into what you see today...

### Multiple Providers in One Page

## Media Coverage

**Our launch video:**

| Embed |
|-------|
| https://www.youtube.com/watch?v=LAUNCH_VIDEO |

**What people are saying:**

| Embed |
|-------|
| https://twitter.com/reviewer/status/123456 |

**Behind the scenes:**

| Embed |
|-------|
| https://vimeo.com/123456789 |

---

## Related Blocks

**Similar functionality:**

- **Video** - Self-hosted video player (no third-party dependency)
- **Image** - Static image display (alternative to video thumbnail)

**Complementary blocks:**

- **Hero** - Large introductory section before embed
- **Columns** - Side-by-side layout with embeds
- **Cards** - Grid of video thumbnails with embeds

---

## Provider Documentation

### YouTube

- Embed guidelines: https://support.google.com/youtube/answer/171780
- Player parameters: https://developers.google.com/youtube/player_parameters
- Privacy mode: Use `youtube-nocookie.com` domain

### Vimeo

- Embed documentation: https://developer.vimeo.com/player/sdk/embed
- Player parameters: https://vimeo.zendesk.com/hc/en-us/articles/360001494447

### Twitter

- Embed documentation: https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview
- Widget options: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/overview

---

## Version History

- **v1.0** (Current) - Initial embed block implementation
  - Multi-provider support (YouTube, Vimeo, Twitter)
  - Lazy loading with Intersection Observer
  - Click-to-play placeholder functionality
  - Responsive 16:9 aspect ratio
  - Generic iframe fallback

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles
- **[Performance Optimization](../../docs/for-ai/implementation/performance-optimization.md)** - Lazy loading and Core Web Vitals

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Designers
