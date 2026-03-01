---
title: "Remove Icon Styles Block"
description: "Documentation for the remove-icon-styles EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Remove Icon Styles Block

## 1. Overview

The Remove Icon Styles block is a utility block that overrides default EDS icon styling constraints without modifying core files. It uses CSS specificity to reset the fixed 24x24px sizing constraints placed on elements with the `.icon` class, allowing icons to be sized according to their natural dimensions or through other styling mechanisms.

### Purpose

- Override default EDS icon size constraints (24x24px)
- Allow natural icon sizing or custom CSS control
- Enable flexible icon usage across the page
- Maintain EDS best practices by not modifying core files

### Key Features

- Global icon style reset
- CSS-based approach (no DOM manipulation)
- Zero visual footprint (invisible block)
- Minimal performance impact

## 2. Content Structure

This is a utility block that doesn't require specific content. Simply add the block anywhere in your document to activate icon style overrides globally.

### Basic Usage

`Markdown Table`
`| Remove-Icon-Styles |`

### EDS Transformation

`Rendered HTML`
`<div class="remove-icon-styles block">`
`<div></div>`
`</div>`

The block makes itself invisible through CSS and adds no visible content to the page.

## 3. Styling

### CSS Architecture

The block uses CSS specificity to override default EDS icon styles:

`CSS Reset Pattern`
`body .icon,`
`main .icon,`
`.section .icon {`
`display: inline;`
`height: auto;`
`width: auto;`
`}`

### Default EDS Icon Styles (Overridden)

`Original Constraints`
`.icon {`
`display: inline-block;`
`height: 24px;`
`width: 24px;`
`}`
``
`.icon img {`
`height: 100%;`
`width: 100%;`
`}`

### Reset Approach

1. **Container Reset**: Changes display from `inline-block` to `inline`, removes fixed dimensions
2. **Image Reset**: Allows images to use natural or specified dimensions
3. **SVG Handling**: Ensures SVG content isn't constrained
4. **Block Invisibility**: Hides the block element itself from view

## 4. Behavior & Functionality

### Core Behavior

The block operates primarily through its CSS file:

1. **Initialization**: Block is decorated and set to `display: none`
2. **CSS Application**: Styles are applied globally to all `.icon` elements
3. **Scope**: Affects all icons on the page, not just those in specific sections

### JavaScript Implementation

`Minimal Decoration Function`
`export default function decorate(block) {`
`block.style.display = 'none';`
`const comment = document.createComment('remove-icon-styles block is active');`
`block.appendChild(comment);`
`}`

**Note**: The JavaScript file exists primarily to fulfill EDS block structure requirements. The actual functionality is implemented in CSS.

### CSS Specificity Strategy

`Specificity Levels`
`body .icon          /* Higher specificity than .icon */`
`main .icon          /* Targets main content area */`
`.section .icon      /* Targets section-level icons */`

This approach ensures the reset styles override default EDS styles without using `!important`.

## 5. Use Cases

### When to Use This Block

1. **Variable Icon Sizes**: When you need icons of different sizes on the same page
2. **Custom Styling**: When you want full CSS control over icon dimensions
3. **SVG Icons**: When working with SVG icons that have their own sizing attributes
4. **Responsive Icons**: When you need icons that scale based on context or viewport
5. **Design Flexibility**: When the 24x24px constraint conflicts with your design system

### When NOT to Use This Block

1. **Consistent 24x24px Icons**: If all icons should be 24x24px (default EDS behavior)
2. **Selective Override**: If you only want to override specific icons (use custom classes instead)
3. **Per-Section Control**: If different sections need different behaviors

## 6. Configuration

### No Configuration Required

This block has no configuration options. It applies globally once added to the page.

### Alternative Approaches

If you need more granular control:

`Custom CSS Class Approach`
`.my-custom-icon.icon {`
`height: 48px;`
`width: 48px;`
`}`

This allows selective icon sizing without removing all default constraints.

## 7. Accessibility

### Size Considerations

When removing icon size constraints, ensure:

- **Minimum Touch Target**: Interactive icons should be at least 44x44px for touch accessibility
- **Visual Clarity**: Icons should be large enough to recognize (typically 16px minimum)
- **Contrast**: Icons should maintain sufficient contrast with backgrounds
- **Alt Text**: Ensure icon images have appropriate alt text or ARIA labels

### Screen Reader Support

`Icon with Proper Alt Text`
`<span class="icon">`
`<img src="icon.svg" alt="Settings">`
`</span>`

### ARIA Considerations

For decorative icons that are purely visual:

`Decorative Icon Pattern`
`<span class="icon" aria-hidden="true">`
`<img src="decorative.svg" alt="">`
`</span>`

## 8. Performance

### Impact Assessment

- **CSS File Size**: ~500 bytes (minimal)
- **JavaScript Execution**: One-time, negligible
- **DOM Manipulation**: Minimal (only hides block element)
- **Render Performance**: No layout recalculation impact
- **Network**: One additional CSS file (cacheable)

### Optimization Notes

- CSS is cached by the browser
- No runtime performance overhead
- No event listeners or observers
- Styles apply at render time through cascade

## 9. Browser Compatibility

### Supported Browsers

- Chrome/Edge: All versions
- Firefox: All versions
- Safari: All versions
- Mobile browsers: Full support

### CSS Features Used

All CSS features used are universally supported:

- `display: inline` - Universal support
- `height: auto` - Universal support
- `width: auto` - Universal support
- CSS specificity - Universal support

### No Polyfills Required

This block uses only standard CSS properties with universal browser support.

## 10. Testing

### Visual Testing

1. Add the block to a page with various icons
2. Verify icons are no longer constrained to 24x24px
3. Check that icons display at their natural or specified sizes
4. Verify the block itself is invisible

### Verification Checklist

- [ ] Block is not visible in the rendered page
- [ ] Icons are no longer forced to 24x24px
- [ ] SVG icons display at their natural aspect ratio
- [ ] CSS cascade is working correctly
- [ ] No console errors
- [ ] Page performance is not affected

### Test Page Setup

`Test Content Structure`
`| Remove-Icon-Styles |`
``
`| Icon |`
`| --- |`
`| :house: |`
``
`| Icon |`
`| --- |`
`| ![Icon](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |`

## 11. Examples

### Example 1: Basic Usage

`Enable Icon Style Reset`
`| Remove-Icon-Styles |`

This single-row table activates the icon style reset for the entire page.

### Example 2: With Custom Icon Styling

`Page with Custom Icon Sizes`
`| Remove-Icon-Styles |`
``
`| Icon |`
`| --- |`
`| :star: |`
``
`.icon.large {`
`font-size: 48px;`
`}`

### Example 3: Responsive Icons

`Responsive Icon Pattern`
`| Remove-Icon-Styles |`
``
`.icon.responsive {`
`  height: 2rem;`
`  width: 2rem;`
`}`
``
`@media (min-width: 768px) {`
`.icon.responsive {`
`height: 3rem;`
`width: 3rem;`
`}`
`}`

## 12. Troubleshooting

### Icons Still Constrained

**Issue**: Icons are still showing at 24x24px
**Solution**:

- Verify the block is present in the page
- Check browser DevTools to confirm CSS is loaded
- Look for more specific CSS rules that might be overriding the reset

### Layout Issues

**Issue**: Page layout changes after adding the block
**Solution**:

- Icons now flow inline instead of inline-block
- Add custom CSS to control icon display behavior
- Consider using `display: inline-block` on specific icons that need it

### SVG Icons Not Displaying Correctly

**Issue**: SVG icons appear too large or small
**Solution**:

- Ensure SVG files have viewBox attributes
- Add width/height attributes to SVG elements
- Use CSS to control SVG icon dimensions explicitly

## 13. Technical Details

### File Structure

`Block Directory`
`remove-icon-styles/`
`├── remove-icon-styles.js   (Minimal decoration)`
`├── remove-icon-styles.css  (Core functionality)`
`└── README.md               (Documentation)`

### CSS Specificity Calculation

`Specificity Weights`
`body .icon          /* (0,0,1,1) = 0011 */`
`.icon               /* (0,0,1,0) = 0010 */`

The block's selectors have higher specificity than the default `.icon` selector.

### Why Not Use !important?

Using CSS specificity instead of `!important`:

- Allows further customization through even more specific selectors
- Follows CSS best practices
- Maintains cascade flexibility
- Easier to debug and override when needed

### Comment Marker

The block adds an HTML comment to indicate activation:

`DOM Comment`
`<!-- remove-icon-styles block is active -->`

This helps with debugging and verification in DevTools.

## 14. Related Documentation

### EDS Core Styling

- Default icon styles: `/styles/styles.css`
- Core EDS documentation: https://www.aem.live/docs/

### Related Blocks

- **Icon Block**: If you need structured icon displays with labels
- **Section Metadata**: For section-specific styling overrides

### Further Reading

- CSS Specificity: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
- EDS Best Practices: https://www.aem.live/developer/block-collection
- Icon Accessibility: https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html

---

**Block Type**: Utility
**Complexity**: Simple
**Dependencies**: None
**Last Updated**: 2025-11-28
