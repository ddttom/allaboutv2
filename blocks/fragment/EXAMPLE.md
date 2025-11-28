# Fragment Block - Usage Examples

This document shows how to use the fragment block in Google Docs to create reusable content sections that can be embedded across multiple pages. Perfect for disclaimers, announcements, contact information, and any shared content that needs consistent updates.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Creating Fragment Pages](#creating-fragment-pages)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create a simple fragment reference in Google Docs:

| Fragment |
|----------|
| /fragments/disclaimer |

**Result:** The content from `/fragments/disclaimer` page will be fetched and embedded in place of the fragment block. Update once, reflect everywhere.

---

## Basic Usage

### Minimal Example

The simplest fragment block with a path reference:

| Fragment |
|----------|
| /fragments/announcement |

**Output:** Content from the announcement fragment page appears in place of the block.

### Fragment with Link

You can also use a link in the fragment block:

| Fragment |
|----------|
| [Company Footer](/fragments/footer) |

**Output:** Same result - the link href is used as the fragment path.

---

## Creating Fragment Pages

### Step-by-Step Guide

**1. Create Fragment Directory**
- Create a folder called `fragments` in your site (if it doesn't exist)
- This can be done in Google Drive or your content management system

**2. Create Fragment Page**
- Create a new Google Doc in the `/fragments/` folder
- Name it descriptively (e.g., `disclaimer.docx`, `announcement.docx`)
- Add your content using normal EDS formatting

**3. Publish Fragment**
- Publish the fragment page like any other EDS page
- Verify the page is accessible at: `https://yoursite.com/fragments/pagename`

**4. Reference Fragment**
- Add a fragment block to parent pages
- Use path: `/fragments/pagename`
- Fragment content will be embedded automatically

### Example Fragment Page

**File:** `/fragments/disclaimer.docx` in Google Drive

**Content:**
```
## Legal Disclaimer

This website content is for informational purposes only. Always consult
a qualified professional before making decisions based on information
provided here.

*Last updated: November 28, 2025*
```

**Usage on parent pages:**

| Fragment |
|----------|
| /fragments/disclaimer |

---

## Common Patterns

### Pattern 1: Site-Wide Disclaimer

Perfect for legal notices that appear on multiple pages:

**Fragment Page:** `/fragments/disclaimer.docx`

```
### Important Notice

The information provided on this website is for general informational
purposes only. While we strive for accuracy, we make no representations
or warranties of any kind regarding completeness or reliability.

For legal advice, please consult a qualified attorney.
```

**Usage on any page:**

| Fragment |
|----------|
| /fragments/disclaimer |

**Best for:** Legal pages, terms of service, privacy policy notices

### Pattern 2: Announcement Banner

Update once, show everywhere:

**Fragment Page:** `/fragments/announcement.docx`

```
## Special Holiday Sale!

Get 40% off all products this week only. Use code HOLIDAY40 at checkout.
Sale ends December 31st.

[Shop Now](/products)
```

**Usage on landing pages, product pages, etc:**

| Fragment |
|----------|
| /fragments/announcement |

**Best for:** Time-sensitive announcements, seasonal promotions, alerts

### Pattern 3: Contact Information

Maintain consistent contact info across all pages:

**Fragment Page:** `/fragments/contact-info.docx`

```
### Get in Touch

**Email:** support@example.com
**Phone:** 1-800-555-0100
**Address:** 123 Main Street, Anytown, USA

**Business Hours:**
Monday - Friday: 9am - 6pm EST
Saturday: 10am - 4pm EST
Sunday: Closed
```

**Usage on about page, support page, footer:**

| Fragment |
|----------|
| /fragments/contact-info |

**Best for:** Contact pages, about pages, footer sections

### Pattern 4: Common Call-to-Action

Reusable CTA across multiple pages:

**Fragment Page:** `/fragments/cta-signup.docx`

```
## Ready to Get Started?

Join thousands of satisfied customers. Start your free trial today -
no credit card required!

[Start Free Trial](/signup)

30-day money-back guarantee | Cancel anytime | No hidden fees
```

**Usage on landing pages, blog posts, product pages:**

| Fragment |
|----------|
| /fragments/cta-signup |

**Best for:** Lead generation, conversion optimization, consistent messaging

### Pattern 5: Complex Fragment with Blocks

Fragments can contain other EDS blocks:

**Fragment Page:** `/fragments/product-features.docx`

| Cards |
|-------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Lightning Fast |
| Optimized performance with edge delivery and intelligent caching |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Easy Authoring |
| Create content in familiar tools like Google Docs and Word |
| ![](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| Scalable |
| Built on edge computing for unlimited scale and global reach |

**Usage on product pages, marketing pages:**

| Fragment |
|----------|
| /fragments/product-features |

**Best for:** Consistent feature showcases, product comparisons, marketing content

---

## Content Requirements

### Fragment Path Requirements

**Required format:**
- Must start with `/`
- Path must exist on your site
- Fragment page must be published

**Good fragment paths:**
- `/fragments/disclaimer`
- `/fragments/contact-info`
- `/fragments/announcement`
- `/support/common-questions`

**Avoid:**
- Relative paths: `fragments/disclaimer` (missing leading `/`)
- External URLs: `https://example.com/fragments/disclaimer` (unless intentional cross-site reference)
- Invalid paths: `/fragments/nonexistent` (page doesn't exist)

### Fragment Content Requirements

**Content types supported:**
- Plain text and paragraphs
- Rich text (bold, italic, links)
- Headings (H2, H3, etc.)
- Images with proper paths
- Lists (bulleted, numbered)
- Any EDS blocks (cards, tabs, accordion, etc.)
- Multiple sections

**Important notes:**
1. **Images in fragments:**
   - Use images uploaded to fragment page
   - EDS will automatically resolve image paths
   - Images appear correctly when fragment embedded

2. **Links in fragments:**
   - Absolute paths work: `/products`
   - Relative paths work: `../about`
   - External links work: `https://example.com`

3. **Blocks in fragments:**
   - Any block can be used in fragments
   - Blocks are fully decorated when fragment loads
   - Functionality preserved (tabs work, accordions work, etc.)

### Fragment Page Structure

**Best practices for fragment pages:**

1. **Keep fragments focused:**
   - One clear purpose per fragment
   - Avoid mixing unrelated content
   - Make fragments self-contained

2. **Consider fragment size:**
   - Smaller fragments load faster
   - < 10KB HTML recommended
   - Large fragments impact performance

3. **Plan for updates:**
   - Fragment updates affect all parent pages
   - Test changes on staging first
   - Consider versioning for major changes

---

## Best Practices

### Content Strategy

**1. Identify reusable content**
- Look for content that appears on multiple pages
- Find content that changes frequently
- Identify content requiring consistency

**Good candidates for fragments:**
- Legal disclaimers (appears on many pages)
- Contact information (frequent updates)
- Announcements (time-sensitive, changes often)
- Common CTAs (consistent messaging)

**Poor candidates for fragments:**
- Unique page content
- Rarely updated content
- Page-specific information
- Content with many variations

**2. Organize fragments logically**
- Use clear, descriptive names
- Group related fragments
- Maintain fragment directory structure

**Example organization:**
```
/fragments/
├── legal/
│   ├── disclaimer.docx
│   ├── privacy-notice.docx
│   └── terms-summary.docx
├── marketing/
│   ├── cta-trial.docx
│   ├── cta-demo.docx
│   └── testimonials.docx
└── site/
    ├── contact-info.docx
    ├── social-links.docx
    └── newsletter-signup.docx
```

**3. Version fragments for major changes**
- Breaking changes? Create new fragment
- Use versioned names: `cta-signup-v2`
- Migrate parent pages gradually
- Keep old fragment until migration complete

**4. Monitor fragment usage**
- Track which pages use each fragment
- Document fragment dependencies
- Plan updates considering impact
- Test updates on staging first

### Performance Optimization

**1. Keep fragments small**
- Aim for < 5KB HTML per fragment
- Large fragments slow page load
- Split large content into multiple fragments if needed

**2. Limit fragments per page**
- 1-3 fragments per page recommended
- Too many fragments = many HTTP requests
- Consider inline content for rarely updated sections

**3. Optimize fragment content**
- Compress images in fragments
- Use appropriate image dimensions
- Minimize blocks within fragments
- Remove unnecessary formatting

**4. Cache fragments effectively**
- Fragments are cached by browser
- Stable content = long cache TTL
- Frequent updates? Shorter cache TTL
- Use cache-busting query params for urgent updates

### Maintenance Best Practices

**1. Test fragments independently**
- Open fragment page directly: `https://yoursite.com/fragments/name`
- Verify content displays correctly
- Check images and links work
- Test any blocks within fragment

**2. Test fragments on parent pages**
- Preview parent page on staging
- Verify fragment embeds correctly
- Check section styling
- Test responsive behavior

**3. Document fragment usage**
- List pages using each fragment
- Note fragment dependencies
- Document update procedures
- Maintain fragment changelog

**4. Handle errors gracefully**
- Test with invalid paths (404 errors)
- Verify page doesn't break if fragment fails
- Consider fallback content for critical fragments

---

## Troubleshooting

### Issue: Fragment not appearing on page

**Problem:** You added a fragment block but content doesn't show.

**Possible causes:**
1. Fragment path is incorrect
2. Fragment page not published
3. Fragment page doesn't exist

**Solutions:**

**Check fragment path:**
| Fragment |
|----------|
| /fragments/disclaimer |

- Path must start with `/`
- Path must match published page
- No trailing slashes

**Verify fragment page published:**
1. Open fragment URL directly: `https://yoursite.com/fragments/disclaimer`
2. If page loads, fragment exists
3. If 404 error, fragment not published

**Test .plain.html version:**
1. Try: `https://yoursite.com/fragments/disclaimer.plain.html`
2. This is what fragment block fetches
3. Should show plain HTML version

### Issue: Fragment images not loading

**Problem:** Fragment content appears but images are broken.

**Cause:** Image paths in fragment not resolving correctly.

**Solution:**

**In fragment page, images should be:**
- Uploaded to fragment page in Google Docs
- EDS automatically creates relative paths
- Fragment block resolves paths to absolute URLs

**Don't manually edit image paths:**
- Let EDS handle image uploads
- Images appear in fragment directory automatically
- Fragment block fixes paths when embedding

### Issue: Fragment looks different than fragment page

**Problem:** Fragment styling doesn't match when embedded.

**Cause:** Section classes or CSS not transferred correctly.

**Solutions:**

1. **Check section classes:**
   - Fragment's first section classes are transferred to parent section
   - This enables consistent styling
   - Verify classes present in DevTools

2. **Move fragment styles to global CSS:**
   - Fragment-specific styles may not load on parent page
   - Add styles to parent page or global styles.css
   - Use section classes for styling

3. **Test fragment page directly:**
   - Compare fragment page appearance to embedded version
   - Identify missing styles
   - Adjust parent page styles or global styles

### Issue: Fragment loads slowly

**Problem:** Page load delayed by fragment fetching.

**Cause:** Fragment content is large or many fragments on page.

**Solutions:**

1. **Reduce fragment size:**
   - Keep fragments < 5KB HTML
   - Optimize images in fragments
   - Split large fragments into smaller ones

2. **Limit fragments per page:**
   - Use 1-3 fragments per page maximum
   - Consider inline content for stable sections
   - Combine related fragments

3. **Preload critical fragments:**
   - Add to page head (requires developer)
   - Fragments load earlier in page lifecycle
   - Reduces perceived load time

### Issue: Fragment update not showing

**Problem:** You updated fragment but changes don't appear on parent pages.

**Cause:** Browser cache or CDN cache.

**Solutions:**

1. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear cache in browser settings
   - Try incognito/private mode

2. **Wait for cache expiration:**
   - Fragment HTML is cached
   - Cache typically expires in 1-24 hours
   - Subsequent visits see new version

3. **Use cache-busting (developer task):**
   - Add query param: `/fragments/announcement?v=2`
   - Forces fresh fetch
   - Update fragment references on parent pages

---

## Advanced Techniques

### Multiple Fragments on One Page

You can use multiple fragments to build complex pages:

### Header Section

| Fragment |
|----------|
| /fragments/hero-banner |

### Main Content

Your unique page content goes here...

### Features Section

| Fragment |
|----------|
| /fragments/product-features |

### Call to Action

| Fragment |
|----------|
| /fragments/cta-signup |

### Footer

| Fragment |
|----------|
| /fragments/footer |

**Result:** Reusable sections combined with unique content.

### Nested Fragments

Fragments can contain other blocks (not other fragments):

**Fragment with tabs block:**

**File:** `/fragments/product-info.docx`

| Tabs |
|------|
| Overview |
| Product overview content... |
| Features |
| Product features content... |
| Pricing |
| Pricing information... |

**Usage:**

| Fragment |
|----------|
| /fragments/product-info |

**Result:** Embedded tabs block within fragment.

### Fragment Variations

Create multiple versions of similar content:

| Fragment |
|----------|
| /fragments/cta-primary |

| Fragment |
|----------|
| /fragments/cta-secondary |

**Different fragment pages = different variations.**

Use appropriate fragment based on context (homepage vs product page vs blog post).

### Localized Fragments

Support multiple languages with separate fragments:

**English:**

| Fragment |
|----------|
| /fragments/en/disclaimer |

**Spanish:**

| Fragment |
|----------|
| /fragments/es/disclaimer |

**French:**

| Fragment |
|----------|
| /fragments/fr/disclaimer |

**Requires:**
- Separate fragment pages per language
- Language detection logic (or manual page creation)
- Consistent fragment naming convention

### Conditional Fragments

Use different fragments based on context (requires manual page creation):

**Homepage:**

| Fragment |
|----------|
| /fragments/hero-home |

**Product Page:**

| Fragment |
|----------|
| /fragments/hero-product |

**Blog Page:**

| Fragment |
|----------|
| /fragments/hero-blog |

**Different pages reference different fragments based on needs.**

---

## Testing Your Fragments

### Visual Testing Checklist

After creating a fragment:

1. **Test fragment page directly:**
   - Open: `https://yoursite.com/fragments/name`
   - Content displays correctly ✓
   - Images load properly ✓
   - Links work ✓
   - Blocks function correctly ✓

2. **Test on parent page:**
   - Add fragment block to test page
   - Publish and preview
   - Fragment content appears ✓
   - Styling matches expectations ✓
   - No console errors ✓

3. **Test responsive behavior:**
   - Mobile (< 600px): Content reflows ✓
   - Tablet (~768px): Proper layout ✓
   - Desktop (> 1024px): Full display ✓

4. **Test updates:**
   - Update fragment page
   - Publish changes
   - Clear cache and reload parent page
   - Changes appear on parent page ✓

5. **Test error scenarios:**
   - Invalid path: No errors, graceful failure ✓
   - Unpublished fragment: Page doesn't break ✓
   - Missing fragment: No console errors ✓

### Browser Testing

Test fragments in multiple browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (mobile testing)
- Android Chrome (mobile testing)

---

## Content Examples

### Example 1: Simple Text Fragment

| Fragment |
|----------|
| /fragments/disclaimer |

**Fragment content:**
```
*This information is provided for educational purposes only and should
not be considered professional advice. Consult an expert before taking
action based on this content.*
```

### Example 2: Rich Content Fragment

| Fragment |
|----------|
| /fragments/company-info |

**Fragment content:**
```
### About Our Company

Founded in 2020, we're dedicated to delivering exceptional products
and services to our customers worldwide.

**Mission:** To innovate and inspire.
**Values:** Integrity, Excellence, Customer Focus

[Learn More](/about)
```

### Example 3: Fragment with Images

| Fragment |
|----------|
| /fragments/team-intro |

**Fragment content:**
```
## Meet Our Team

![Team Photo](https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png)

We're a passionate team of experts committed to your success.
Get to know the people behind the brand.

[Meet the Team](/about/team)
```

### Example 4: Fragment with Cards Block

| Fragment |
|----------|
| /fragments/services |

**Fragment content (services.docx):**

| Cards |
|-------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Consulting |
| Expert guidance for your business challenges |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Implementation |
| Hands-on help getting your solution deployed |
| ![](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| Support |
| Ongoing assistance to ensure your success |

---

## Related Blocks

**Complementary functionality:**
- **Section Metadata** - Control section-level styling around fragments
- **Columns** - Arrange fragments in multi-column layouts
- **Accordion** - Collapsible sections (can use fragments inside)
- **Tabs** - Tabbed content (can use fragments inside tab panels)

**When to use fragments vs other approaches:**
- **Use fragments:** Content appears on multiple pages, needs consistent updates
- **Use sections:** Unique content per page, no reuse needed
- **Use blocks:** Interactive components, not just content embedding

---

## Version History

- **v1.0** (Current) - Initial fragment block documentation
  - Basic fragment embedding
  - Media path resolution
  - Section class transfer
  - Full block support within fragments

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles
- **[AEM Fragment Documentation](https://www.aem.live/developer/block-collection/fragment)** - Official fragment reference

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Site Administrators
