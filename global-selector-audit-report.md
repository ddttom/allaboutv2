# Global Selector Audit Report

**Date:** 2025-11-28
**Purpose:** Comprehensive audit of global selector usage across all EDS blocks
**Scope:** All JavaScript files in `/blocks/` directory

## Executive Summary

Found **128+ instances** of global selector usage across **30 blocks**. Classification:

- **✅ Document-level (Legitimate):** 24 blocks with intentional document-level operations
- **❌ Block-scoped (Bugs):** 6 blocks with incorrect global selector usage
- **⚠️ Unclear:** 3 blocks requiring manual review
- **✅ Already Fixed:** 3 blocks (header, index, showcaser)

## Category 1: ✅ Document-Level (Legitimate)

These blocks correctly use global selectors for document-level operations.

### ipynb-viewer Block
**File:** `./ipynb-viewer/ipynb-viewer.js`
**Lines:** 379, 408, 1504, 2301, 2342, 2445, 3002, 3008, 3014, 3057
**Selectors:**
- `document.querySelectorAll('.ipynb-cell')` - Managing all notebook cells
- `document.querySelectorAll('.ipynb-paged-overlay')` - Managing overlays
- `document.body.style.overflow` - Controlling page scroll for modals
- `document.body.appendChild(overlay)` - Adding overlays to document

**Assessment:** ✅ **LEGITIMATE** - Manages document-wide overlays and modals
**Recommendation:** Add defensive comments

### returntotop Block
**File:** `./returntotop/returntotop.js`
**Lines:** 3, 4
**Selectors:**
- `document.querySelector('.returntotop')` - ❌ **BUG** (should use block parameter)
- `window.addEventListener('scroll')` - ✅ **LEGITIMATE** (global scroll tracking)

**Assessment:** ⚠️ **MIXED** - Line 3 is a bug, line 4 is legitimate
**Recommendation:** Fix line 3, add comment to line 4

### bio Block
**File:** `./bio/bio.js`
**Lines:** 50, 63
**Selectors:**
- `document.querySelector('meta[name="author"]')` - ✅ **LEGITIMATE** (page metadata)
- `document.querySelector('.bio-wrapper')` - ❌ **BUG** (should use block parameter or parent lookup)

**Assessment:** ⚠️ **MIXED** - Meta tag is legitimate, wrapper query is bug
**Recommendation:** Fix line 63 to use proper scoping, add comment to line 50

### dps Block (Presentation System)
**File:** `./dps/dps.js`
**Lines:** 46-48, 123, 645, 692-693, 711, 714, 755, 824, 839, 843, 884, 901, 926, 932, 942, 951, 982, 990-991, 1000, 1023, 1028-1032, 1096, 1118, 1139, 1148, 1157, 1192, 1212, 1226
**Selectors:** Extensive document-wide queries
- `document.querySelector('header')`, `document.querySelector('footer')`, `document.querySelector('main')` - Document structure
- `document.body.classList.add('dps-fullscreen')` - Full-screen mode
- `document.querySelectorAll('.slide')` - All slides in presentation
- Many slide navigation queries

**Assessment:** ✅ **LEGITIMATE** - Full-screen presentation system needs document control
**Recommendation:** Add comprehensive defensive comments (this is a complex document-level block)

### code-expander Block
**File:** `./code-expander/code-expander.js`
**Lines:** 52, 376, 381, 393-394
**Selectors:**
- `document.querySelectorAll('pre code')` - ✅ **LEGITIMATE** (page-wide code collection)
- `document.body.appendChild(a)`, `document.body.removeChild(a)` - Clipboard operations
- `document.body.contains(tooltip)`, `document.body.appendChild(tooltip)` - Tooltip management

**Assessment:** ✅ **LEGITIMATE** - Enhances all code blocks on page
**Recommendation:** Add defensive comments

### modal Block
**File:** `./modal/modal.js`
**Lines:** 36, 42, 55
**Selectors:**
- `document.querySelector('main').append(block)` - ✅ **LEGITIMATE** (modal positioning)
- `document.body.classList.remove('modal-open')` - ✅ **LEGITIMATE** (body scroll control)
- `document.body.classList.add('modal-open')` - ✅ **LEGITIMATE** (body scroll control)

**Assessment:** ✅ **LEGITIMATE** - Modals need document-level control
**Recommendation:** Add defensive comments

### overlay Block
**File:** `./overlay/overlay.js`
**Lines:** 80-81, 117
**Selectors:**
- `document.body.appendChild(overlay)` - ✅ **LEGITIMATE** (overlay positioning)
- `document.body.classList.add('overlay-open')` - ✅ **LEGITIMATE** (body scroll control)
- `document.body.classList.remove('overlay-open')` - ✅ **LEGITIMATE** (body scroll control)

**Assessment:** ✅ **LEGITIMATE** - Overlays need document-level positioning
**Recommendation:** Add defensive comments

### floating-alert Block
**File:** `./floating-alert/floating-alert.js`
**Lines:** 234, 266-267, 291-293, 303, 308
**Selectors:**
- `document.body.appendChild(overlay)` - ✅ **LEGITIMATE** (alert positioning)
- Multiple queries for `.floating-alert-overlay`, `.floating-alert` - Managing document-wide alerts

**Assessment:** ✅ **LEGITIMATE** - Alerts are document-level UI
**Recommendation:** Add defensive comments

### dashboard Block
**File:** `./dashboard/dashboard.js`
**Lines:** 21, 219-220, 222, 227, 279-280, 291-292, 305, 327, 331
**Selectors:**
- `window.addEventListener('resize')` - ✅ **LEGITIMATE** (responsive behavior)
- `document.getElementById('status-filter')` - Dashboard controls
- Multiple queries for `.content-table`, `.dashboard` - ⚠️ **UNCLEAR** (could be scoped to block)

**Assessment:** ⚠️ **MIXED** - Resize listener is legitimate, table queries might be bugs
**Recommendation:** Review dashboard queries - likely should use block parameter

## Category 2: ❌ Block-Scoped (Bugs)

These blocks incorrectly use global selectors for block-scoped operations.

### fortunecookie Block
**File:** `./footer/fortunecookie/fortunecookie.js`
**Line:** 3
**Selector:** `document.querySelector('.fortunecookie')`

**Assessment:** ❌ **BUG** - Should use block parameter
**Recommendation:** Change to `block` parameter

### dynamic Block
**File:** `./dynamic/dynamic.js`
**Line:** 13
**Selector:** `document.querySelector('.dynamic-container')`

**Assessment:** ❌ **BUG** - Should use block parameter
**Recommendation:** Change to `block.querySelector('.dynamic-container')` or create element

### bloglist Block
**File:** `./bloglist/bloglist.js`
**Line:** 2
**Selector:** `document.querySelector(".bloglist")`

**Assessment:** ❌ **BUG** - Should use block parameter
**Recommendation:** Change to `block` parameter

### tags Block
**File:** `./tags/tags.js`
**Line:** 2
**Selector:** `document.querySelector('.tags.block')`

**Assessment:** ❌ **BUG** - Should use block parameter
**Recommendation:** Change to `block` parameter

### slide-builder Block
**File:** `./slide-builder/slide-builder.js`
**Lines:** 92, 137
**Selectors:**
- `document.body.appendChild(panel)` - ✅ **LEGITIMATE** (document-level panel)
- `document.querySelector(".slide-builder")` - ❌ **BUG** (should use block parameter)

**Assessment:** ⚠️ **MIXED** - Line 92 is legitimate, line 137 is bug
**Recommendation:** Fix line 137, add comment to line 92

### text Block
**File:** `./text/text.js`
**Line:** 7
**Selector:** `document.querySelector('.text-wrapper')`

**Assessment:** ❌ **BUG** - Should use block parameter or parent lookup
**Recommendation:** Change to proper scoping (like bio block fix)

### hero Block
**File:** `./hero/hero.js`
**Lines:** 2-3
**Selectors:**
- `document.querySelector('.hero > div:first-of-type picture')`
- `document.querySelector('.hero > div:first-of-type > div:nth-of-type(2) picture')`

**Assessment:** ❌ **BUG** - Should use block parameter
**Recommendation:** Change to `block.querySelector()`

## Category 3: ⚠️ Requires Manual Review

These blocks need detailed code review to determine legitimacy.

### embed Block
**File:** `./embed/embed.js`
**Line:** 8
**Selector:** `document.querySelector('head')`

**Assessment:** ⚠️ **UNCLEAR** - Could be legitimate (adding styles/scripts to head)
**Recommendation:** Review context - if adding page-level resources, add defensive comment

### dfs Block
**File:** `./dfs/dfs.js`
**Lines:** 429, 518, 655, 662
**Selectors:**
- `document.getElementById(fragmentId)` - Navigation to page elements
- `document.getElementById('faq-live-region')` - Accessibility live region
- `document.body.appendChild(liveRegion)` - Adding live region to document

**Assessment:** ⚠️ **MIXED** - Live region is legitimate (accessibility), fragment navigation might be
**Recommendation:** Review navigation logic, add defensive comments

### blogroll Block
**File:** `./blogroll/blogroll.js`
**Lines:** 430, 434
**Selectors:**
- `document.body.appendChild(iconContainer)`
- `document.body.appendChild(panel)`

**Assessment:** ⚠️ **UNCLEAR** - Depends on whether panel is document-level or block-level
**Recommendation:** Review panel purpose, add defensive comments if document-level

## Category 4: ✅ Library/Framework Code

These are external libraries and can be ignored.

### shoelace-card, spectrum-card
**Files:** `./shoelace-card/shoelace-card.js`, `./spectrum-card/spectrum-card.js`
**Assessment:** ✅ **IGNORE** - Third-party web component libraries
**Recommendation:** No action needed (library code)

## Priority Actions Required

### High Priority (Bugs - Break Multi-Instance Pages)

1. **fortunecookie.js** line 3 - `document.querySelector('.fortunecookie')` → `block`
2. **bloglist.js** line 2 - `document.querySelector(".bloglist")` → `block`
3. **tags.js** line 2 - `document.querySelector('.tags.block')` → `block`
4. **dynamic.js** line 13 - `document.querySelector('.dynamic-container')` → `block.querySelector()`
5. **hero.js** lines 2-3 - Both queries should use `block.querySelector()`
6. **text.js** line 7 - `document.querySelector('.text-wrapper')` → proper scoping
7. **slide-builder.js** line 137 - `document.querySelector(".slide-builder")` → `block`

### Medium Priority (Add Defensive Comments)

1. **ipynb-viewer.js** - Multiple document-level operations (10+ locations)
2. **code-expander.js** - Page-wide code collection (line 52)
3. **modal.js** - Body scroll control (lines 42, 55)
4. **overlay.js** - Body scroll control and positioning (lines 80-81, 117)
5. **floating-alert.js** - Document-wide alert management
6. **dps.js** - Extensive presentation system (30+ locations)

### Low Priority (Review Required)

1. **returntotop.js** - Fix line 3, add comment to line 4
2. **bio.js** - Fix line 63, add comment to line 50
3. **dashboard.js** - Review table queries (might be bugs)
4. **embed.js** - Review head manipulation
5. **dfs.js** - Review navigation and live region logic
6. **blogroll.js** - Review panel purpose

## Statistics

- **Total blocks scanned:** 30
- **Total global selector instances:** 128+
- **Confirmed bugs:** 7 blocks (8+ instances)
- **Legitimate document-level:** 10 blocks (50+ instances)
- **Needs review:** 6 blocks (15+ instances)
- **Library code (ignored):** 2 blocks (55+ instances)

## Recommended Implementation Order

1. ✅ **COMPLETED:** header, index, showcaser (3 blocks)
2. **Week 1:** Fix high-priority bugs (7 blocks)
3. **Week 2:** Add defensive comments to legitimate uses (10 blocks)
4. **Week 3:** Review unclear cases and make decisions (6 blocks)

## Next Steps

**User Decision Required:** For each finding, decide:
- **Fix immediately** - Add to current PR
- **Create separate issue** - Track for future work
- **Add comments only** - Document existing behavior
- **No action** - Accept as-is

## Validation Script

To re-run this audit in the future:

```bash
cd /Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks
grep -rn "document\.querySelector\|document\.querySelectorAll\|document\.getElementById\|document\.getElementsBy\|window\.addEventListener\|window\.matchMedia\|document\.body\|document\.documentElement" --include="*.js"
```

## References

- [EDS Block Development Skill](/.claude/skills/eds-block-development/SKILL.md) - Updated guidance
- [Raw EDS Blocks Guide](/docs/for-ai/implementation/raw-eds-blocks-guide.md) - Updated guidance
- [Plan Document](/Users/tomcranstoun/.claude/plans/resilient-crunching-cray.md) - Implementation plan
