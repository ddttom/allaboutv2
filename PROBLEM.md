# EDS Block CSS Class Name Conflict - Production Bug Report

## Executive Summary

**Primary Issue:** AI assistant skill documentation lacked warnings about EDS reserved class names, directly causing a production bug.

**What Happened:** An AI coding assistant suggested using `.overlay-container` as a CSS class name without warning that EDS automatically adds this class to parent section elements. This created a CSS conflict that made entire production pages invisible.

**Impact:** Critical - Total loss of page visibility for any page containing overlay blocks.

**Root Cause:** Documentation gap in `.claude/skills/eds-block-development/` - no warnings about EDS automatic class naming conventions existed.

**Fix:** Updated AI assistant skill documentation with prominent warnings, active pattern detection, and real-world examples to prevent future occurrences.

---

## Detailed Summary

Production pages with overlay blocks showed blank white screens due to CSS class name conflicts with EDS's automatic class naming conventions. **The root cause was that AI assistant skill documentation did not warn about EDS reserved class names, allowing the bug to be introduced during development.**

## Problem Description

### Symptoms
- Production pages with overlay blocks displayed completely blank (white screen)
- No JavaScript errors in browser console
- All blocks loaded successfully according to console logs
- `body.appear` class was present
- DOM elements existed but were invisible

### Primary Root Cause: Missing Documentation

**The AI assistant's skill documentation (`.claude/skills/eds-block-development/`) failed to warn about EDS reserved class names.**

When the overlay block was developed:
1. AI assistant suggested using `.overlay-container` as a class name
2. No warnings were provided about EDS automatic class naming
3. The code was written and merged to production
4. The CSS conflict caused production pages to become blank

### Secondary Root Cause: EDS Class Name Collision

**EDS automatically adds `.{blockname}-container` class to the parent `<section>` element of every block.**

The overlay block's CSS defined `.overlay-container` with these properties:
```css
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  opacity: 0;
}
```

When EDS added `overlay-container` class to the parent section, these styles were applied to the entire section instead of the modal backdrop, making the whole page invisible.

## Technical Details

### EDS Automatic Class Addition

From `scripts/aem.js` line 674-686 (`decorateBlock` function):

```javascript
function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');                                    // line 677
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    wrapTextNodes(block);
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);        // line 682
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`); // line 684
  }
}
```

### Actual DOM Structure

```html
<section class="section overlay-container">  <!-- EDS adds overlay-container here -->
  <div class="overlay-wrapper">              <!-- EDS adds overlay-wrapper here -->
    <div class="overlay block">              <!-- EDS adds block here -->
      <!-- Block content -->
    </div>
  </div>
</section>
```

### How the Bug Manifested

1. Overlay block JavaScript created modal backdrop with class `overlay-container`
2. EDS's `decorateBlock()` added `overlay-container` class to parent `<section>`
3. CSS rule `.overlay-container { position: fixed; opacity: 0; }` applied to section
4. Entire section became invisible with fixed positioning
5. Page appeared blank to users

## Complete List of EDS Reserved Class Names

Developers must avoid these class patterns in their blocks:

### Block-Specific (High Risk)
- `.{blockname}-wrapper` - Added to block's parent `<div>` wrapper (aem.js:682)
- `.{blockname}-container` - Added to parent `<section>` element (aem.js:684) **← This caused the bug**

### Global Classes (Medium Risk)
- `.block` - Added to all block elements (aem.js:677)
- `.section` - Added to all sections (aem.js:503)
- `.button-container` - Added to parent elements of buttons (aem.js:430, 439, 448)
- `.default-content-wrapper` - Added to default content wrappers (aem.js:498)

## Solution

### Fix Applied

Renamed all instances of `.overlay-container` to `.overlay-backdrop`:

**Files Modified:**
1. `blocks/overlay/overlay.css` - Renamed CSS class
2. `blocks/overlay/overlay.js` - Updated JavaScript class references

**Changes:**
```css
/* Before (BROKEN) */
.overlay-container {
  position: fixed;
  opacity: 0;
}

/* After (FIXED) */
.overlay-backdrop {
  position: fixed;
  opacity: 0;
}
```

```javascript
// Before (BROKEN)
overlayContainer.className = 'overlay-container';

// After (FIXED)
overlayContainer.className = 'overlay-backdrop';
```

### Safe Naming Patterns

Use these suffixes instead of `-wrapper` or `-container`:
- `.{blockname}-backdrop`
- `.{blockname}-modal`
- `.{blockname}-content`
- `.{blockname}-inner`
- `.{blockname}-grid`
- `.{blockname}-list`
- `.{blockname}-panel`
- `.{blockname}-overlay`

## Prevention

### The Documentation Gap

**Before the fix, AI assistant skill documentation had NO warnings about:**
- EDS automatic class naming conventions
- Reserved class name patterns (`-container`, `-wrapper`)
- Risks of CSS class name conflicts
- Production bugs caused by these conflicts

This meant:
- AI assistants could suggest dangerous class names without warning
- Developers had no knowledge of EDS reserved patterns
- Code reviews couldn't catch the issue (not documented)
- Tests didn't reveal the problem (test.html doesn't mimic section structure)

### Documentation Updates (The Fix)

Updated skills documentation to prevent future occurrences:

1. **`.claude/skills/skill-rules.json`** - Skill activation rules
   - Changed enforcement from "suggest" to **"warn"**
   - Increased priority from "high" to **"critical"**
   - Added dangerous pattern detection for `-container` and `-wrapper` suffixes
   - Added automatic warning messages when these patterns are detected
   - Added runtime detection via regex patterns

2. **`.claude/skills/eds-block-development/SKILL.md`** - Development guide
   - Added **"⚠️ CRITICAL WARNING"** section at the very top (before any code)
   - Added "⚠️ CRITICAL: Avoid EDS Reserved Class Names" in CSS Best Practices
   - Added to "Common Mistakes to Avoid" with real-world production bug example
   - Listed all EDS automatic class additions with line references

3. **`.claude/skills/eds-block-testing/SKILL.md`** - Testing guide
   - Added "Issue: Page is Blank or Invisible" as first troubleshooting item
   - Included debugging steps and console commands
   - Warning about global class styling dangers
   - Real-world example from this bug

4. **`CLAUDE.md`** - Project guide
   - Added "⚠️ CRITICAL: EDS Reserved Class Names" section
   - Explains production bug impact clearly
   - Provides concrete dos and don'ts
   - References detailed documentation

### What Changed

**Before:** AI assistants had zero knowledge of EDS reserved class names
**After:** AI assistants are actively warned at multiple levels:
- Runtime pattern detection in skill rules
- Prominent warnings in skill documentation
- Real-world bug example as teaching moment
- Clear list of safe alternative suffixes

### Debugging Steps for Future Issues

If you encounter a blank page:

1. Open browser console
2. Check if blocks loaded: Look for loading messages
3. Check if `body.appear` exists: `document.body.classList.contains('appear')`
4. Inspect section classes: `document.querySelector('section').className`
5. Look for `{blockname}-container` in the class list
6. Check CSS for conflicting class names
7. Use browser DevTools to inspect computed styles on section elements

## Impact

- **Severity**: Critical - Pages completely unusable
- **User Impact**: Total loss of page visibility
- **Detection**: Not caught in testing because `test.html` doesn't mimic section structure
- **Resolution Time**: ~2 hours of debugging via console inspection

## Recommendations

### For AI Assistant Systems (PRIMARY)

**This bug was caused by inadequate AI assistant documentation. AI coding assistants must:**

1. **Maintain Critical Warning Lists**: Document framework-specific reserved patterns, naming conventions, and gotchas
2. **Active Pattern Detection**: Use skill rules with dangerous pattern regex to warn before code is written
3. **Prominent Placement**: Put critical warnings at the TOP of skill documentation, before any examples
4. **Real-World Examples**: Include actual production bugs as teaching moments
5. **Multi-Level Warnings**: Warn at runtime (skill rules), documentation (skill files), and project level (README/CLAUDE.md)
6. **Regular Audits**: Review skill documentation after production incidents to identify gaps

**What we learned:**
- Documentation gaps in AI assistants directly cause production bugs
- Generic coding guidance isn't enough - framework-specific warnings are critical
- Skill rules should actively detect dangerous patterns, not just suggest best practices
- Real-world bug examples are more effective than theoretical warnings

### For EDS Framework

1. **Document Reserved Classes**: Add prominent warnings in EDS documentation about automatic class naming
2. **Namespace Classes**: Consider adding `eds-` prefix to automatic classes (e.g., `eds-container`, `eds-wrapper`) to prevent conflicts
3. **CSS Isolation**: Consider using more specific selectors or CSS custom properties to reduce global namespace pollution
4. **Developer Warnings**: Add runtime warnings when custom CSS targets EDS-reserved classes

### For Developers

1. **Always avoid** `-container` and `-wrapper` suffixes when naming block classes
2. **Never style** global classes like `.block`, `.section`, or `.button-container` with layout-breaking properties
3. **Test with production HTML** structure, not just `test.html` files
4. **Use browser DevTools** to inspect actual class names applied to elements
5. **Review EDS source code** (`scripts/aem.js`) to understand automatic class additions
6. **Audit AI assistant skills** after production incidents to prevent recurrence

## Files Modified

### Code Fix (Overlay Block)
- `blocks/overlay/overlay.css` - Renamed `.overlay-container` → `.overlay-backdrop`
- `blocks/overlay/overlay.js` - Updated JavaScript class references

### Documentation Fix (AI Assistant Skills)
- `.claude/skills/skill-rules.json` - Added critical warnings and pattern detection
- `.claude/skills/eds-block-development/SKILL.md` - Added prominent warnings at top and throughout
- `.claude/skills/eds-block-testing/SKILL.md` - Added blank page troubleshooting section
- `CLAUDE.md` - Added critical warnings section to project guide
- `PROBLEM.md` - This report documenting the bug and fix

## Testing

After fix:
- ✅ Test.html continues to work correctly
- ✅ Production pages display correctly
- ✅ Overlay functionality works as expected
- ✅ No CSS conflicts with EDS classes
- ✅ Modal backdrop displays and animates properly

## Related Issues

This issue is similar to namespace conflicts in:
- CSS-in-JS libraries
- Web Components shadow DOM
- CSS Modules
- BEM naming conventions

The core problem is **implicit global namespace pollution** without clear documentation or developer warnings.

---

**Report Date**: 2025-01-17
**Affected Versions**: All EDS versions using `decorateBlock()` function
**Fix Status**: ✅ Resolved
**Documentation**: ✅ Updated
