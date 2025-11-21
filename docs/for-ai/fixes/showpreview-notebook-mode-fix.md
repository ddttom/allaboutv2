# showPreview() Notebook Mode Fix

**Date:** 2025-11-21
**Status:** ✅ Fixed
**Files Modified:** 3
**Related Issue:** Cell with `showPreview()` does not run in ipynb-viewer notebook mode

---

## Problem Description

When using `showPreview()` from `/scripts/ipynb-helpers.js` inside a Jupyter notebook displayed in **notebook mode** via the ipynb-viewer block, the preview overlay would not display correctly or would be hidden behind the paged overlay.

### Original Issue

A cell in `docs-navigation.ipynb` (cell ID: 220da5e0) containing:

```javascript
const { showPreview } = await import('/scripts/ipynb-helpers.js');
await showPreview('grid', content);
```

Would execute but the preview overlay would not appear or be visible to the user.

### Root Causes

1. **Timing Issue**: `showPreview()` checked for notebook mode before the paged overlay was fully rendered in the DOM
2. **Z-index Conflict**: Preview overlay used z-index 10000, but paged overlay uses z-index 10001
3. **ESC Key Deadlock**: ESC key handler prevented closing preview overlay when paged overlay was visible
4. **Missing Block**: The example used `grid` block which doesn't exist, causing silent failure
5. **Poor Error Feedback**: No user-friendly error messages when blocks failed to load

---

## Solution

### 1. Fixed Timing Issue (Line 77)

**Added DOM ready delay:**

```javascript
// Wait for DOM to be ready before checking for paged overlay
// This fixes timing issues where the paged overlay hasn't fully rendered yet
await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
```

This ensures the paged overlay is fully in the DOM before we check for notebook mode.

### 2. Fixed Z-index Hierarchy (Line 115)

**Dynamic z-index based on notebook mode:**

```javascript
z-index: ${isNotebookMode ? '99999' : '10000'}
```

- **Notebook mode**: z-index 99999 (appears above paged overlay at 10001)
- **Normal mode**: z-index 10000 (standard stacking)

### 3. Fixed ESC Key Handler (Lines 203-210)

**Simplified ESC handling:**

```javascript
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    // Always close the preview overlay first when ESC is pressed
    // This fixes the hierarchy issue where preview overlay couldn't close
    // when opened from within a paged overlay
    cleanupAndClose();
  }
};
```

**Before:** Complex logic that prevented closing preview if paged overlay was visible
**After:** Always closes preview overlay first (expected behavior)

### 4. Enhanced Error Handling (Lines 239-261)

**User-friendly error messages:**

```javascript
} catch (error) {
  console.error(`❌ Block decoration error for ${blockName}:`, error);
  // Show user-friendly error message in the preview
  const contentArea = overlay.querySelector('.ipynb-preview-content');
  if (contentArea) {
    contentArea.innerHTML = `
      <div style="padding: 20px; color: #d32f2f; background: #ffebee; border-radius: 4px; border-left: 4px solid #d32f2f;">
        <h3 style="margin-top: 0;">❌ Failed to load block: ${blockName}</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p style="margin-bottom: 0;"><em>Check the console for more details.</em></p>
      </div>
    `;
  }
  throw error; // Re-throw so caller knows there was an error
}
```

Now shows clear error messages when blocks fail to load or decorate.

### 5. Added Notebook Mode Tracking (Lines 100-102)

**Data attribute for debugging:**

```javascript
// Set data attribute to indicate notebook mode for z-index adjustment
if (isNotebookMode) {
  overlay.setAttribute('data-notebook-context', 'true');
}
```

Makes it easy to verify notebook mode detection in browser DevTools.

### 6. Fixed Example Cell

**Updated docs-navigation.ipynb cell 220da5e0:**

```javascript
// Before
await showPreview('grid', content);  // ❌ grid block doesn't exist

// After
await showPreview('accordion', content);  // ✅ accordion block exists
```

---

## Files Modified

### 1. [scripts/ipynb-helpers.js](../../../scripts/ipynb-helpers.js)

**Lines Changed:** 75-77, 100-102, 115, 203-210, 239-261

**Changes:**
- Added requestAnimationFrame delay before notebook mode detection
- Added `data-notebook-context` attribute tracking
- Increased z-index to 99999 in notebook mode
- Simplified ESC key handler (always close preview first)
- Enhanced error handling with user-friendly messages

### 2. [docs-navigation.ipynb](../../../docs-navigation.ipynb)

**Cell Modified:** 220da5e0 (index 87)

**Changes:**
- Changed `showPreview('grid', content)` to `showPreview('accordion', content)`
- Updated comment from "Using grid block from EDS" to "Using accordion block from EDS"

### 3. [test-showpreview-simple.html](../../../test-showpreview-simple.html)

**Purpose:** Test page for verifying the fix

**Features:**
- Simulates paged overlay environment (z-index: 10001)
- Uses correct class name `.ipynb-paged-overlay` for detection
- Tests notebook mode detection with `data-notebook-mode="true"`
- Logs execution steps and diagnostics

---

## Testing

### Manual Testing

1. **Navigate to test page:**
   ```
   http://localhost:3000/test-showpreview-simple.html
   ```

2. **Click the test button**
   - Should see status log showing successful import
   - Preview overlay should appear above the dark background
   - Only close button (✕) should be visible in header
   - z-index should be 99999
   - notebook-context attribute should be "true"

3. **Test interactions:**
   - ESC key should close preview overlay (background stays)
   - Click close button (✕) should close preview
   - Click backdrop should close preview

### Automated Testing

Run the debug script:

```bash
python debug_showpreview.py
```

**Expected output:**
```
✓ showPreview imported successfully
✓ Block decorated
✓ Result: ✓ Preview overlay opened for accordion
✓ Overlay found! z-index: 99999, notebook-context: true
```

### Testing in Real Notebook

1. Navigate to docs-navigation notebook
2. Enter notebook mode (paged view)
3. Navigate to cell 220da5e0 (around page 87)
4. Look for "PROGRESSIVE EXAMPLE" comment
5. Click "Run" button
6. Preview overlay should appear with accordion block
7. ESC key should close preview (paged overlay stays open)

---

## Technical Details

### Notebook Mode Detection

**Selector used:**
```javascript
const pagedOverlay = document.querySelector('.ipynb-paged-overlay[data-notebook-mode="true"]');
const isNotebookMode = pagedOverlay !== null;
```

**Requirements for detection:**
1. Element must have class `.ipynb-paged-overlay`
2. Element must have attribute `data-notebook-mode="true"`
3. Element must be in the DOM at the time of check (hence the delay)

### Z-index Hierarchy

| Element | Z-index | Purpose |
|---------|---------|---------|
| Page content | 1 | Normal page elements |
| Paged overlay (notebook mode) | 10001 | Notebook paged interface |
| Preview overlay (normal mode) | 10000 | Block preview outside notebooks |
| **Preview overlay (notebook mode)** | **99999** | Block preview inside notebooks |

### Control Display Logic

**Notebook mode (line 106):**
```javascript
'<button class="ipynb-preview-btn ipynb-close-btn">✕</button>'
```

**Normal mode (lines 107-111):**
```javascript
<button ... data-view="mobile">📱 Mobile</button>
<button ... data-view="tablet">📱 Tablet</button>
<button ... data-view="desktop" class="active">🖥️ Desktop</button>
<div class="ipynb-preview-divider"></div>
<button class="ipynb-preview-btn ipynb-close-btn">✕</button>
```

---

## Related Documentation

- [explaining-jupyter.md](../explaining-jupyter.md) - Interactive Jupyter notebook testing
- [explaining-educational-notebooks.md](../explaining-educational-notebooks.md) - Creating educational notebooks
- [ipynb-viewer README](../../../blocks/ipynb-viewer/README.md) - ipynb-viewer block documentation

---

## Future Enhancements

### Potential Improvements

1. **Grid Block Implementation**
   - Create a simple grid block so the original example works
   - Or document which blocks are available for use with showPreview()

2. **Better Error Recovery**
   - Allow preview to stay open even if block decoration fails
   - Show error inside preview instead of closing

3. **Z-index Management**
   - Centralized z-index constants
   - Dynamic calculation based on all overlays present

4. **Testing**
   - Add automated tests for showPreview in different modes
   - Test ESC key behavior with multiple overlays

---

## Breaking Changes

**None.** This fix is fully backward compatible:

- ✅ Existing uses of `showPreview()` outside notebooks continue to work
- ✅ Z-index in normal mode unchanged (10000)
- ✅ Control display in normal mode unchanged (mobile/tablet/desktop buttons)
- ✅ ESC key behavior improved (no breaking change, just better UX)

---

## Credits

**Fixed by:** Claude (Anthropic)
**Tested by:** User + Playwright automation
**Date:** 2025-11-21

---

## Changelog

### 2025-11-21 - Initial Fix

- ✅ Added DOM ready delay for notebook mode detection
- ✅ Increased z-index to 99999 in notebook mode
- ✅ Simplified ESC key handler
- ✅ Enhanced error handling with user-friendly messages
- ✅ Added notebook context tracking attribute
- ✅ Updated example cell to use accordion block
- ✅ Created test page for verification

---

## Quick Reference

### Using showPreview() in Notebooks

```javascript
// Import the function
const { showPreview } = await import('/scripts/ipynb-helpers.js');

// Use with any existing block
await showPreview('accordion', '<div><div>Title</div><div>Content</div></div>');
await showPreview('cards', '<div><div>Card 1</div><div>Card 2</div></div>');
await showPreview('tabs', '<div><div>Tab 1</div><div>Tab 2</div></div>');

// The preview overlay will:
// - Detect notebook mode automatically
// - Appear above the paged overlay
// - Show only a close button (✕)
// - Close on ESC key
// - Close on backdrop click
```

### Available Blocks for Preview

- ✅ `accordion` - Expandable accordion items
- ✅ `cards` - Card grid layout
- ✅ `tabs` - Tabbed interface
- ✅ `hero` - Hero section
- ✅ `quote` - Styled quotes
- ❌ `grid` - Not implemented (causes error)

---

## Support

For issues or questions:
1. Check the console for error messages
2. Verify block exists in `/blocks/` directory
3. Ensure notebook mode is properly initialized
4. Check DevTools for `data-notebook-context` attribute on overlay
5. Verify z-index in computed styles
