# Recent Changes - 2025-01-18

## Summary

Fixed notebook variation behavior for both the `overlay` and `ipynb-viewer` blocks to ensure close buttons are visible and autorun is removed for better user control. Added comprehensive documentation to distinguish between the three overlay types (paged, manual, and preview) and fixed ESC key handling with proper event listener cleanup. Simplified preview overlay in notebook mode to show only close button for cleaner interface. Added repository metadata support for linking .md files in notebooks.

## Changes by Block

### 1. Overlay Block (`blocks/overlay/`)

**Issue:** Requested to add notebook variation support with visible close button and no autorun.

**Changes Made:**
- Added notebook variation detection (checks for `.notebook` class)
- Documented that notebook variation works identically to default overlay
- Added test case to `test.html` for notebook variation
- Updated README with notebook variation documentation

**Files Modified:**
- `blocks/overlay/overlay.js` - Added variation detection and comments
- `blocks/overlay/README.md` - Added notebook variation documentation section
- `blocks/overlay/test.html` - Added Test 7 for notebook variation

**Result:** Overlay block notebook variation displays trigger button with visible close button (no autorun).

---

### 2. IPynb-Viewer Block (`blocks/ipynb-viewer/`)

**Issue:** Notebook variation was auto-running JavaScript and hiding the close button in overlays.

#### 2.1 Removed Autorun from Notebook Variation

**Problem:**
- Notebook variation automatically executed code cells on page load
- Line 945: `const shouldAutorun = isAutorun || isNotebook;`
- This caused unwanted automatic execution

**Solution:**
- Changed line 946 to: `const shouldAutorun = isAutorun;`
- Removed `isNotebook` from autorun condition
- Updated comments to reflect manual execution behavior

**Result:** Notebook variation now requires users to click "Run" buttons to execute code.

#### 2.2 Made Close Button Visible in Paged Overlay

**Problem:**
- Lines 462-464 hid the close button when `isNotebookMode` was true
- Users couldn't close the paged overlay easily

**Solution:**
- Removed close button hiding logic (lines 461-462)
- Updated comments to reflect close button is always visible
- Updated function documentation

**Result:** Close (×) button now visible in paged overlay for all variations.

#### 2.3 Fixed Event Listener Memory Leak

**Problem:**
- Line 585-589: `closeOverlay()` function never removed the keyHandler event listener
- This caused memory leaks from stacking event listeners
- Multiple handlers checking `isOverlayOpen` flag on every keypress
- Potential race conditions and ESC key not working reliably

**Solution:**
- Added `document.removeEventListener('keydown', keyHandler);` to `closeOverlay()` function (line 590)
- Proper cleanup ensures only one active handler at a time
- Prevents memory leaks and improves performance

**Result:** ESC key works reliably in paged overlay, no memory leaks from stacked event listeners.

---

### 3. IPynb Helpers (`scripts/ipynb-helpers.js`)

**Issues:**
1. Preview overlay header was hidden in notebook mode
2. ESC key didn't work reliably
3. ESC key in paged overlay closed preview overlay instead
4. Users confused about the two different overlay types

#### 3.1 Removed Header Hiding

**Problem:**
- Line 104: `<div class="ipynb-preview-header${isInNotebookMode ? ' hidden' : ''}">`
- Header (with close button and responsive controls) was hidden in notebook mode

**Solution:**
- Removed `isInNotebookMode` check
- Removed `isInNotebookMode` variable (line 54-55)
- Removed unused `.ipynb-preview-header.hidden` CSS rule

**Result:** Preview overlay header with close button and responsive controls always visible.

#### 3.2 Fixed ESC Key Handling

**Problem:**
- ESC handler was attached to overlay element only
- When focus moved to content inside overlay, ESC key didn't work

**Solution:**
- Changed ESC handler from overlay element to document (line 184)
- Added `cleanupAndClose()` function for proper cleanup (lines 177-180)
- Handler removes itself when overlay closes (prevents memory leaks)

**Result:** ESC key works from anywhere on page when overlay is open.

#### 3.3 Fixed ESC Key Hierarchy

**Problem:**
- Both preview and paged overlays listened for ESC
- Pressing ESC in paged overlay closed both overlays

**Solution:**
- Added overlay visibility checks (lines 152-167)
- ESC handler checks for visible `.ipynb-paged-overlay` and `.ipynb-manual-overlay`
- Only closes preview if no other overlays are visible

**Result:** ESC key respects overlay hierarchy - closes paged/manual overlays first, then preview.

#### 3.4 Added Overlay Type Disambiguation

**Problem:**
- Users couldn't distinguish between the three different overlay types
- Documentation didn't clearly explain paged, manual, and preview overlays
- Confusion about which controls belong to which overlay

**Solution:**
- Added comprehensive "Understanding the Three Overlay Types" section to README
- Clearly documented **paged overlay**: Start Reading button, Previous/Next controls, page navigation
- Clearly documented **manual overlay**: Read the Manual button, scrollable documentation, no pagination
- Clearly documented **preview overlay**: Run button trigger, responsive view buttons, no pagination
- Explained overlay hierarchy when multiple are open simultaneously
- Documented ESC key behavior for each overlay type

**Result:** Users can now clearly understand the difference between reading mode, documentation, and code execution previews.

#### 3.5 Simplified Preview Overlay in Notebook Mode

**Problem:**
- Preview overlay showed responsive view buttons (Mobile/Tablet/Desktop) in notebook mode
- These extra controls were unnecessary and cluttered the interface
- Users only needed the close button in notebook mode
- Preview overlay at 95vh height covered pagination buttons underneath

**Solution:**
- Added notebook mode detection (lines 58-59)
- Conditionally build controls HTML - only close button in notebook mode (lines 82-88)
- Skip view switching event listeners in notebook mode (line 135)
- Reduced preview overlay height from 95vh to 75vh (lines 93, 96)
- Result: Clean, minimal preview overlay with pagination buttons visible

**Result:** Preview overlay in notebook mode shows only the close (×) button, and pagination buttons remain visible and clickable underneath.

#### 3.6 Added Repository Metadata Support with Automatic .md Linking

**Problem:**
- Markdown links to .md files in notebooks had no way to reference the repository
- Links would be relative to the notebook location, not the repository
- No helper function to access repository URL from code cells
- Manual link construction was error-prone and verbose

**Solution:**
- Added `repo` optional metadata field to notebook JSON (e.g., "https://github.com/username/repo")
- Added `getRepoUrl()` helper function in scripts/ipynb-helpers.js (lines 20-35)
- Updated `parseMarkdown()` to accept repoUrl parameter (line 12)
- Added automatic .md link conversion in parseMarkdown (lines 96-107):
  - Only converts when `repo` metadata is provided (graceful fallback to relative links)
  - Detects .md file links in markdown cells
  - Skips absolute URLs (http://, https://)
  - Converts to full GitHub blob URLs (`repo/blob/main/path.md`)
  - Opens converted links in new tab with proper security attributes
- Updated `createMarkdownCell()` to pass repoUrl (line 169)
- Updated `createPagedOverlay()` to pass repoUrl (line 438)
- Updated ipynb-viewer block to extract repo from metadata (lines 832-835, 967-968)
- Updated both docs-navigation.ipynb and explain.ipynb with repo metadata
- Comprehensive documentation in README with examples

**Result:** Notebooks automatically convert .md file links to full repository URLs, making documentation references seamless and maintainable.

---

## Testing Checklist

### Overlay Block
- ✅ Default overlay: trigger button, close button visible
- ✅ Notebook variation: trigger button, close button visible, no autorun
- ✅ ESC key closes overlay
- ✅ Click backdrop closes overlay
- ✅ Test 7 in test.html validates behavior

### IPynb-Viewer Block - Notebook Variation
- ✅ "Start Reading" button shows (no autorun)
- ✅ Close (×) button visible in paged overlay
- ✅ "Run" buttons visible in code cells
- ✅ Manual execution required
- ✅ ESC closes paged overlay (not preview overlay)

### IPynb-Viewer Block - Preview Overlays
- ✅ Header with controls always visible
- ✅ Close (×) button visible
- ✅ Responsive view buttons (Mobile/Tablet/Desktop) visible
- ✅ ESC key closes overlay (unless paged/manual overlay is open)
- ✅ ESC key closes paged overlay first, then preview
- ✅ Click backdrop closes overlay

---

## File Summary

**Modified Files:**
1. `blocks/overlay/overlay.js` - Added notebook variation detection
2. `blocks/overlay/README.md` - Documented notebook variation
3. `blocks/overlay/test.html` - Added test case
4. `blocks/ipynb-viewer/ipynb-viewer.js` - Removed autorun, made close button visible, added event listener cleanup
5. `blocks/ipynb-viewer/README.md` - Updated documentation with overlay type disambiguation
6. `scripts/ipynb-helpers.js` - Fixed preview overlay controls and ESC key handling

**Lines of Code Changed:** ~100 lines across 6 files

---

## Migration Guide

### If Using Notebook Variation

**Before (OLD behavior):**
- Notebook variation auto-executed code on page load
- Close button hidden in paged overlay
- Preview overlay header hidden in notebook mode

**After (NEW behavior):**
- Notebook variation requires manual "Run" button clicks
- Close button visible in all overlays
- Preview overlay header always visible with full controls

**Action Required:**
- Review your notebook content
- Update instructions to tell users to click "Run" buttons
- If you need automatic execution, use the `autorun` variation explicitly

### If Using Preview Overlays

**Before (OLD behavior):**
- ESC key only worked when overlay had focus
- Preview overlay header hidden in notebook mode
- ESC in paged overlay closed preview overlay

**After (NEW behavior):**
- ESC key works from anywhere on page
- Preview overlay header always visible
- ESC respects overlay hierarchy

**Action Required:**
- No changes needed - improved behavior is backward compatible

---

## Technical Details

### ESC Key Event Flow

**Old Implementation:**
```javascript
// Attached to overlay element only
overlay.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') overlay.remove();
});
```

**New Implementation:**
```javascript
// Attached to document with hierarchy check
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    const pagedVisible = pagedOverlay?.style.display !== 'none';
    const manualVisible = manualOverlay?.style.display !== 'none';
    if (!pagedVisible && !manualVisible) {
      cleanupAndClose();
    }
  }
};
document.addEventListener('keydown', handleEscape);
```

### Autorun Logic

**Old Implementation:**
```javascript
const shouldAutorun = isAutorun || isNotebook; // Notebook mode triggered autorun
```

**New Implementation:**
```javascript
const shouldAutorun = isAutorun; // Only explicit autorun variation triggers autorun
```

### Close Button Visibility

**Old Implementation:**
```javascript
if (isNotebookMode) {
  closeButton.style.display = 'none'; // Hidden in notebook mode
}
```

**New Implementation:**
```javascript
// Close button is now always visible (notebook mode fix)
// Previously hidden in notebook mode, now always shown for better UX
```

---

## Breaking Changes

⚠️ **BREAKING:** Notebook variation no longer autoruns code cells. If you need automatic execution, use the `autorun` variation instead:

```
| IPynb Viewer (autorun) |
|------------------------|
| /path/to/notebook.ipynb |
```

✅ **NON-BREAKING:** All other changes are enhancements and don't break existing functionality.

---

## Version Info

- **Date:** 2025-01-18
- **Blocks Affected:** `overlay`, `ipynb-viewer`
- **Scripts Affected:** `ipynb-helpers.js`
- **Backward Compatibility:** Mostly compatible (notebook variation behavior changed)
