# Tabs Block - Usage Examples

This document shows how to use the tabs block in Google Docs to create accessible tabbed interfaces for organizing related content. Perfect for product features, documentation sections, FAQs, and multi-section information displays.

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

Create a simple tabs interface in Google Docs:

| Tabs |
|------|
| Overview |
| Welcome to our platform! This section provides an introduction to key concepts and getting started information. |
| Features |
| Explore our comprehensive feature set including advanced capabilities, integrations, and customization options. |
| Pricing |
| View our flexible pricing plans designed for teams of all sizes, from startups to enterprises. |

**Result:** An accessible tabbed interface with three tabs. Click tabs to switch between content panels. First tab is selected by default.

---

## Basic Usage

### Minimal Example

The simplest tabs block with two tabs:

| Tabs |
|------|
| Tab 1 |
| Content for the first tab |
| Tab 2 |
| Content for the second tab |

**Output:** Two clickable tabs with corresponding content panels.

### Standard Example

Tabs with descriptive labels and rich content:

| Tabs |
|------|
| Getting Started |
| Follow our step-by-step guide to get up and running quickly. We'll walk you through installation, configuration, and your first project. |
| Documentation |
| Comprehensive technical documentation covering API references, configuration options, and advanced usage patterns. |
| Support |
| Access our support resources including community forums, knowledge base articles, and direct contact options. |

**Output:** Three tabs with detailed content in each panel.

---

## Common Patterns

### Pattern 1: Product Features Tabs

Perfect for showcasing different product features or capabilities:

| Tabs |
|------|
| Performance |
| Lightning-fast load times with edge delivery and optimized caching. Achieve perfect Lighthouse scores with minimal effort. |
| Authoring |
| Content creators use familiar tools like Google Docs and Microsoft Word. No technical knowledge required. |
| Scalability |
| Built on edge computing infrastructure for unlimited scale and global distribution. Handle traffic spikes effortlessly. |
| Security |
| Enterprise-grade security with automatic HTTPS, DDoS protection, and compliance certifications. |

**Best for:** Landing pages, product pages, feature comparisons

### Pattern 2: Documentation Sections

Organize documentation into logical sections:

| Tabs |
|------|
| Installation |
| Install the package using npm: npm install package-name. Verify installation by running the version command. |
| Configuration |
| Configure your project by creating a config.js file in the root directory. Set environment variables for production deployment. |
| API Reference |
| Complete API documentation including endpoints, parameters, response formats, and authentication methods. |
| Troubleshooting |
| Common issues and solutions. Check this section first before opening a support ticket. |

**Best for:** Developer documentation, technical guides, knowledge bases

### Pattern 3: FAQ Sections

Group related questions by category:

| Tabs |
|------|
| General |
| What is Edge Delivery Services? How does it work? Who should use it? |
| Technical |
| What browsers are supported? How do I integrate with my CMS? Can I use custom JavaScript? |
| Billing |
| How much does it cost? What payment methods do you accept? Can I cancel anytime? |
| Support |
| How do I get help? What support channels are available? What are your support hours? |

**Best for:** FAQ pages, help centers, support documentation

### Pattern 4: Step-by-Step Instructions

Break complex processes into manageable steps:

| Tabs |
|------|
| Step 1: Setup |
| Create a new project directory and initialize your repository. Install required dependencies using your package manager. |
| Step 2: Configuration |
| Configure your build settings and environment variables. Set up your development and production environments. |
| Step 3: Development |
| Start the development server and begin building your application. Use hot reload for rapid iteration. |
| Step 4: Deployment |
| Build your production assets and deploy to your hosting provider. Configure your CDN and monitoring. |

**Best for:** Tutorials, onboarding guides, setup wizards

### Pattern 5: Settings or Preferences

Organize related settings into logical groups:

| Tabs |
|------|
| Account |
| Manage your account settings including email, password, and profile information. |
| Notifications |
| Control how and when you receive notifications via email, SMS, and push notifications. |
| Privacy |
| Manage your privacy settings, data sharing preferences, and visibility controls. |
| Integrations |
| Connect third-party services and manage API access tokens for integrated applications. |

**Best for:** Settings pages, user preferences, admin panels

---

## Content Requirements

### Tab Label Requirements

**Recommended:**

- Length: 1-3 words
- Clear and descriptive
- Unique within the tabs block
- Use title case

**Why this matters:**

- Tab labels become button text
- Used to generate unique IDs
- Displayed in horizontal list (limited space on mobile)

**Good tab labels:**

- Overview, Features, Pricing
- Getting Started, Advanced, API
- Installation, Configuration, Usage

**Avoid:**

- Very long labels (wrap or get cut off)
- Duplicate labels (causes ID conflicts)
- Special characters (may affect ID generation)

### Panel Content Requirements

**Content types supported:**

- Plain text (automatically wrapped in paragraphs)
- Rich text (headings, bold, italic, links)
- Images (inline with text)
- Lists (bulleted, numbered)
- Code blocks (formatted as text)
- Multiple paragraphs

**Content length:**

- No strict limits
- Panel scrolls if content exceeds container height
- Keep concise for better user experience
- Aim for 1-3 paragraphs per tab

**Formatting tips:**

1. Use headings to structure long content
2. Keep paragraphs short and scannable
3. Use lists for multiple points
4. Include images to break up text
5. Add links to related resources

### Accessibility Requirements

**Always provide:**

- Descriptive tab labels (not just "Tab 1", "Tab 2")
- Meaningful content in each panel
- Alt text for any images
- Proper heading hierarchy within panels

**Avoid:**

- Empty panels (always include content)
- Image-only panels (provide text context)
- Overly technical labels (use plain language)

---

## Styling Guidelines

### Visual Consistency

**Tab List:**

- Horizontal arrangement
- 8px gap between tabs
- Border around each tab
- Selected tab blends with panel below

**Tab Buttons:**

- Unselected: Light background with border
- Selected: White background, bottom border blends with panel
- Hover: Darker background (unselected tabs only)
- Font weight: Bold

**Tab Panels:**

- White background
- Border on all sides
- 16px padding
- Seamless connection with selected tab

### Responsive Behavior

**Mobile (< 600px):**

- Tab list scrolls horizontally
- Tabs maintain readable size
- Touch-friendly tap targets
- Panel content stacks naturally

**Tablet (600px - 1024px):**

- Tabs typically fit on one line
- Comfortable spacing
- No major layout changes

**Desktop (> 1024px):**

- Full horizontal tab display
- Hover states visible
- Optimal reading width

**How it works:**

- Tabs use flexbox with `flex: 0 0 max-content`
- No wrapping or stacking
- Horizontal scrolling when needed
- Browser provides scroll indicators

---

## Best Practices

### Content Strategy

**1. Organize logically**

- Group related content together
- Order tabs by importance or natural flow
- Put most important content in first tab
- Limit to 3-6 tabs (not too many)

**2. Keep labels concise**

- 1-3 words per tab label
- Use action words when appropriate
- Maintain consistent labeling style
- Avoid abbreviations (use full words)

**3. Balance content length**

- Similar content amounts across tabs
- Not too brief (at least 2-3 sentences)
- Not too long (use sub-pages if needed)
- Break up long content with headings

**4. Consider user journey**

- What do users need first?
- What questions do they have?
- What actions should they take?
- Guide them through the flow

### Accessibility First

**1. Descriptive labels**

- "Overview" not "Info"
- "Getting Started" not "Start"
- "API Reference" not "API"

**2. Keyboard accessible**

- Tab key moves to/from tab list
- Enter/Space activates tab
- All functionality available without mouse

**3. Screen reader friendly**

- Tab list announced properly
- Selection state communicated
- Panel content associated with tab
- Logical reading order maintained

**4. Visual clarity**

- Clear selected state
- Sufficient color contrast
- Visible focus indicators
- Touch-friendly tap targets

### Performance Optimization

**Content loading:**

- All tabs loaded upfront (no lazy loading)
- Fast tab switching (no network requests)
- Minimal JavaScript overhead
- CSS handles panel visibility

**Image optimization:**

- Compress images before upload
- Use appropriate image dimensions
- Provide alt text
- Consider lazy loading for images in non-visible panels

### When NOT to Use Tabs

**Avoid tabs for:**

- Single content item (no need for tabs)
- Very long content (use separate pages)
- Complex hierarchies (use nested navigation)
- Frequently referenced content (users shouldn't have to switch tabs often)

**Better alternatives:**

- **Accordion** - For collapsible content where multiple sections can be open
- **Sections** - For linear content that should be scanned top-to-bottom
- **Separate pages** - For distinct topics with deep content
- **Cards** - For visual browsing of multiple items

---

## Troubleshooting

### Issue: All content visible at once

**Problem:** You see all tab content stacked vertically instead of hidden in tabs.

**Cause:** Tabs block not properly decorated or CSS not loaded.

**Solution:**

1. Verify table format in Google Docs is correct
2. Check that first row has "Tabs" in it
3. Ensure each subsequent row represents one tab
4. Verify CSS is loaded on the page

### Issue: Clicking tabs doesn't switch content

**Problem:** Tab buttons are visible but clicking does nothing.

**Cause:** JavaScript not loaded or errors in console.

**Solution:**

1. Check browser console for errors (F12)
2. Verify tabs.js is loaded (check Network tab)
3. Ensure no JavaScript errors on page
4. Test in different browser

### Issue: Tab labels too long on mobile

**Problem:** Tab buttons wrap or get cut off on mobile devices.

**Cause:** Tab labels are too long for horizontal layout.

**Solutions:**

1. **Shorten tab labels** (best solution):
   - "Getting Started" → "Start"
   - "Documentation" → "Docs"
   - "Frequently Asked Questions" → "FAQ"

2. **Accept horizontal scrolling** (default behavior):
   - Tab list scrolls horizontally on mobile
   - This is the intended design

3. **Use custom CSS** (advanced):

   ```css
   .tabs .tabs-list button {
     font-size: 0.875rem; /* Smaller text */
     padding: 6px 12px; /* Less padding */
   }
   ```

### Issue: Duplicate tab labels causing problems

**Problem:** Two tabs have same label, causing ID conflicts.

**Cause:** Tab IDs generated from labels must be unique.

**Solution:**

- Make labels unique: "Overview" and "Overview 2"
- Or use different labels: "Overview" and "Summary"
- Check console for duplicate ID warnings

### Issue: Content cut off in tab panel

**Problem:** Panel content is truncated or scrollbar doesn't appear.

**Cause:** Panel overflow setting or parent container constraints.

**Solutions:**

1. **Check for overflow: auto** (should be default):
   - Tab panels scroll when content is too long
   - This is the intended behavior

2. **Verify parent container** (advanced):
   - Ensure parent has height defined
   - Check for overflow: hidden on parents

3. **Test panel scrolling:**
   - Add more content to a panel
   - Verify scrollbar appears
   - Scroll to see all content

### Issue: First tab not selected by default

**Problem:** No tab appears selected on page load.

**Cause:** JavaScript decoration issue or ARIA attributes not set.

**Solution:**

1. Check browser console for errors
2. Inspect first tab button in DevTools
3. Verify `aria-selected="true"` is set
4. Verify first panel has `aria-hidden="false"`

---

## Advanced Techniques

### Tabs with Rich Content

Include images, lists, and formatting within tab panels:

| Tabs |
|------|
| Features |
| ![](feature-icon.png) **Key Features:** Bullet list of features, Bold text for emphasis, Links to detailed pages |
| Screenshots |
| ![](screenshot1.png) Image of the interface, ![](screenshot2.png) Another view |
| Video Tour |
| ![](video-thumbnail.png) Watch our 5-minute product tour to see everything in action |

**Result:** Each tab can have rich, formatted content including multiple images.

### Linking to Specific Tabs

While deep linking isn't built-in, you can guide users to specific tabs:

**In your content:**
"See the Pricing tab below for detailed plans" (users manually click the tab)

**Future enhancement:**
URL hash navigation (#pricing) could be added to jump to specific tabs.

### Combining Tabs with Other Blocks

Use tabs within a larger page structure:

### Product Overview

Brief introduction to the product...

| Tabs |
|------|
| Features |
| Feature content... |
| Pricing |
| Pricing content... |

### Related Resources

Links to additional information...

**Result:** Tabs work seamlessly with surrounding content blocks.

### Custom Styling Examples

Override default styles in your project CSS:

`Blue theme tabs`
`.tabs .tabs-list button[aria-selected="true"] {`
`background-color: #007bff;`
`color: white;`
`border-color: #007bff;`
`}`

`Rounded tab corners`
`.tabs .tabs-list button {`
`border-radius: 8px 8px 0 0;`
`}`

`Larger tab padding`
`.tabs .tabs-list button {`
`padding: 12px 24px;`
`}`

Then apply by adding CSS to your project's styles.

---

## Testing Your Tabs

### Visual Testing Checklist

After creating tabs in Google Docs:

1. **Preview on staging site:**
   - All tabs appear ✓
   - First tab is selected ✓
   - Only one panel visible ✓
   - Tab buttons styled correctly ✓

2. **Interaction testing:**
   - Click each tab ✓
   - Panel content switches ✓
   - Previous panel hides ✓
   - Selected state updates ✓

3. **Mobile testing (< 600px):**
   - Tabs scroll horizontally ✓
   - Touch targets are large enough ✓
   - Panel content is readable ✓
   - No layout issues ✓

4. **Keyboard testing:**
   - Tab key moves to tab list ✓
   - Enter/Space activates tab ✓
   - Focus indicator visible ✓
   - All tabs accessible ✓

5. **Accessibility testing:**
   - Screen reader announces tabs ✓
   - Selection state communicated ✓
   - Panel content associated with tab ✓
   - Keyboard navigation works ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

**Not supported:** Internet Explorer 11

---

## Content Examples

### Example 1: Simple Tabs

| Tabs |
|------|
| Overview |
| Product overview content goes here |
| Features |
| Feature list and descriptions |
| Pricing |
| Pricing plans and options |

### Example 2: Documentation Tabs

| Tabs |
|------|
| Quick Start |
| Get up and running in 5 minutes with our quick start guide |
| Installation |
| Detailed installation instructions for various platforms |
| Configuration |
| Configure your environment and application settings |
| Advanced Usage |
| Advanced patterns and best practices for power users |

### Example 3: FAQ Tabs

| Tabs |
|------|
| General Questions |
| What is this product? Who is it for? How does it work? |
| Technical Questions |
| System requirements, browser support, integration options |
| Billing Questions |
| Pricing, payment methods, refund policy, upgrade process |

---

## Integration Examples

### Tabs After Hero Section

| Hero |
|------|
| ![](hero-image.jpg) |
| Welcome to Our Platform |
| Discover powerful features |

| Tabs |
|------|
| Features |
| Feature content... |
| Benefits |
| Benefits content... |

### Tabs in Multi-Column Layout

Create rich layouts combining tabs with other content:

| Tabs |
|------|
| Documentation |
| Technical docs... |
| Examples |
| Code examples... |

**Sidebar content** (using columns block)

Related resources and quick links...

---

## Related Blocks

**Similar functionality:**

- **Accordion** - Collapsible sections (multiple can be open)
- **Modal** - Overlay content dialogs
- **Cards** - Grid-based content organization

**Complementary blocks:**

- **Hero** - Large introductory section before tabs
- **Quote** - Testimonials or highlights between sections
- **Columns** - Create complex layouts with tabs

---

## Version History

- **v1.0** (Current) - Initial tabs block implementation
  - WAI-ARIA compliant tabbed interface
  - Click-based tab switching
  - Horizontal tab list with scrolling
  - Accessible markup and keyboard support

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles
- **[WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)** - Official accessibility guidelines

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Designers
