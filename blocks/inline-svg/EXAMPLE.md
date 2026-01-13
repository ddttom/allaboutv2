# Inline SVG Examples

This document provides content authoring examples for the Inline SVG block. Use these patterns in your Google Docs or Microsoft Word documents.

## Basic Usage

### Example 1: Simple Circle SVG

| Inline SVG |
|:-----------|
| `<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"></circle></svg>` |

**Result:** A red circle that scales responsively to container width.

### Example 2: Rectangle and Circle Combination

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 200 200"><rect x="10" y="10" width="180" height="180" fill="blue" /><circle cx="100" cy="100" r="50" fill="yellow" /></svg>` |

**Result:** A blue square with a yellow circle in the center.

### Example 3: Icon Reference (Icon Span)

| Inline SVG |
|:-----------|
| `:icon-arrow:` |

**Result:** Loads the arrow icon from `/icons/arrow.svg` directory.

**Note:** Icon references use the `:icon-name:` syntax, which EDS converts to icon spans.

## Advanced Examples

### Example 4: SVG with Gradient

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 200 200"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" fill="url(#grad1)" /></svg>` |

**Result:** A rectangle filled with a diagonal gradient from yellow to red.

### Example 5: SVG Path Drawing

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100"><path d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z" fill="pink" stroke="red" stroke-width="2"/></svg>` |

**Result:** A heart shape drawn using SVG path commands.

### Example 6: Multiple Shapes with Transparency

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 200 200"><circle cx="60" cy="60" r="50" fill="rgba(255,0,0,0.5)" /><circle cx="140" cy="60" r="50" fill="rgba(0,255,0,0.5)" /><circle cx="100" cy="110" r="50" fill="rgba(0,0,255,0.5)" /></svg>` |

**Result:** Three overlapping semi-transparent circles creating a color blend effect.

## Real-World Use Cases

### Example 7: Decorative Divider

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 1200 100" preserveAspectRatio="none"><path d="M0,50 Q300,10 600,50 T1200,50 L1200,100 L0,100 Z" fill="#1473e6"/></svg>` |

**Result:** A wave-shaped decorative divider in Adobe blue.

**Use Case:** Section separator, header decoration, footer accent.

### Example 8: Logo or Brand Mark

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100"><rect width="40" height="40" x="10" y="10" fill="#FA0F00"/><rect width="40" height="40" x="50" y="50" fill="#FA0F00"/><circle cx="30" cy="70" r="15" fill="#FA0F00"/><circle cx="70" cy="30" r="15" fill="#FA0F00"/></svg>` |

**Result:** An abstract geometric logo in Adobe red.

**Use Case:** Company logo, brand identity, header graphic.

### Example 9: Chart or Diagram

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 300 200"><rect x="20" y="150" width="40" height="30" fill="#4CAF50"/><rect x="80" y="120" width="40" height="60" fill="#2196F3"/><rect x="140" y="80" width="40" height="100" fill="#FF9800"/><rect x="200" y="50" width="40" height="130" fill="#F44336"/><line x1="0" y1="180" x2="300" y2="180" stroke="black" stroke-width="2"/><line x1="20" y1="0" x2="20" y2="200" stroke="black" stroke-width="2"/></svg>` |

**Result:** A simple bar chart with four colored bars and axes.

**Use Case:** Data visualization, infographics, statistics display.

### Example 10: Icon Set (Multiple Icons)

**Icon 1: Home**

| Inline SVG |
|:-----------|
| `:icon-home:` |

**Icon 2: Search**

| Inline SVG |
|:-----------|
| `:icon-search:` |

**Icon 3: Menu**

| Inline SVG |
|:-----------|
| `:icon-menu:` |

**Result:** Loads home, search, and menu icons from `/icons/` directory.

**Use Case:** Navigation elements, UI components, toolbar buttons.

## Complex Patterns

### Example 11: SVG with Animation Classes

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100" class="rotating-icon"><circle cx="50" cy="50" r="40" fill="none" stroke="#1473e6" stroke-width="8" stroke-dasharray="20 10"/></svg>` |

**Result:** A dashed circle that can be animated with CSS.

**CSS Required:**

```css
.rotating-icon {
  animation: rotate 3s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Example 12: SVG with Text

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 300 100"><rect width="300" height="100" fill="#1473e6"/><text x="150" y="55" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">Adobe EDS</text></svg>` |

**Result:** A blue rectangle with white centered text "Adobe EDS".

**Use Case:** Badges, labels, callout boxes, announcement banners.

### Example 13: Interactive SVG (Hover Effects)

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100" class="hover-icon"><circle cx="50" cy="50" r="40" fill="#1473e6" class="icon-circle"/></svg>` |

**Result:** A circle that changes color on hover when styled with CSS.

**CSS Required:**

```css
.hover-icon .icon-circle {
  transition: fill 0.3s ease;
}
.hover-icon:hover .icon-circle {
  fill: #2680eb;
}
```

### Example 14: Responsive SVG with ViewBox

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet"><rect x="0" y="0" width="800" height="200" fill="#f5f5f5"/><circle cx="100" cy="100" r="80" fill="#FA0F00"/><rect x="250" y="20" width="160" height="160" fill="#1473e6"/><polygon points="600,20 680,180 520,180" fill="#34A853"/></svg>` |

**Result:** A banner with multiple shapes that scales proportionally.

**Use Case:** Hero sections, featured content, responsive headers.

## Accessibility Examples

### Example 15: SVG with Title and Description

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Sales Chart</title><desc id="chart-desc">A bar chart showing sales data for Q4 2024</desc><rect x="10" y="40" width="20" height="50" fill="#4CAF50"/><rect x="40" y="30" width="20" height="60" fill="#2196F3"/><rect x="70" y="20" width="20" height="70" fill="#FF9800"/></svg>` |

**Result:** An accessible bar chart with descriptive text for screen readers.

**Best Practice:** Always add title and desc elements for meaningful SVGs.

### Example 16: Decorative SVG (Hidden from Screen Readers)

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100" aria-hidden="true" role="img"><circle cx="50" cy="50" r="40" fill="#e0e0e0"/></svg>` |

**Result:** A decorative circle hidden from assistive technology.

**Best Practice:** Use `aria-hidden="true"` for purely decorative SVGs.

## Troubleshooting Examples

### Example 17: SVG Not Rendering - Missing ViewBox

**Wrong:**

| Inline SVG |
|:-----------|
| `<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"></circle></svg>` |

**Correct:**

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"></circle></svg>` |

**Fix:** Always include `viewBox` attribute for responsive scaling.

### Example 18: SVG Overflow - Fixed Width/Height

**Wrong:**

| Inline SVG |
|:-----------|
| `<svg width="500" height="500"><circle cx="250" cy="250" r="200" fill="blue"></circle></svg>` |

**Correct:**

| Inline SVG |
|:-----------|
| `<svg viewBox="0 0 500 500"><circle cx="250" cy="250" r="200" fill="blue"></circle></svg>` |

**Fix:** Use `viewBox` instead of fixed `width`/`height` for responsive behavior.

## Content Author Quick Reference

### Syntax Summary

**Icon Reference (from /icons/ directory):**

```
| Inline SVG |
|:-----------|
| :icon-name: |
```

**Inline SVG Markup:**

```
| Inline SVG |
|:-----------|
| <svg viewBox="0 0 100 100">...</svg> |
```

### Best Practices for Authors

1. **Always use viewBox** for responsive SVGs
2. **Keep SVG code on one line** in markdown tables
3. **Use semantic icon names** for icon references (`:icon-arrow:`, not `:icon-123:`)
4. **Include title and desc** for meaningful graphics
5. **Use aria-hidden** for decorative graphics
6. **Test SVG markup** in a validator before embedding
7. **Optimize SVG files** before adding to `/icons/` directory
8. **Use relative units** in viewBox (0 0 100 100, not pixels)

### Common Mistakes to Avoid

- Missing `viewBox` attribute (causes scaling issues)
- Fixed `width` and `height` in pixels (not responsive)
- Malformed SVG markup (unclosed tags, syntax errors)
- Missing SVG namespace (should include `xmlns` for standalone SVG)
- Overly complex SVG (performance issues, long load times)
- Using inline styles that can't be overridden (prefer class attributes)

### SVG Validation Tools

- **W3C SVG Validator:** https://validator.w3.org/
- **SVG Path Editor:** https://yqnn.github.io/svg-path-editor/
- **SVGOMG (Optimizer):** https://jakearchibald.github.io/svgomg/

## Additional Resources

### Sample SVG Resources

Use these pre-approved image URLs for examples:

- **Profile Image:** `https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png`
- **Sample Images:**
  - `https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png`
  - `https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg`
  - `https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg`

**Note:** These are raster images; convert to SVG for use with inline-svg block.

### Related Documentation

- **README.md** - Complete technical documentation
- **test.html** - Browser-based testing file
- **inline-svg.js** - JavaScript implementation
- **inline-svg.css** - Styling and layout

### Support

For questions or issues with the inline-svg block:

1. Check **README.md** for detailed technical information
2. Review **test.html** for working examples
3. Validate SVG markup using online tools
4. Check browser console for error messages
5. Report bugs via GitHub issues

---

**Last Updated:** 2025-11-28

**Block Version:** 1.0.0

**Author:** Tom Cranstoun
