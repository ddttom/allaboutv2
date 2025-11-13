# Jupyter Notebook Testing Troubleshooting - Browser Only

Common issues and solutions when testing EDS blocks with Jupyter notebooks in the browser.

## No Output Displayed

**Problem:** Cell runs successfully (green checkmark) but output cell is empty.

**Cause:** Missing `return` statement.

**Solution:**
```javascript
// ✅ GOOD - Shows output
const block = await window.testBlockFn('accordion', content);
return block.outerHTML;

// ❌ BAD - No output
const block = await window.testBlockFn('accordion', content);
```

**Always use `return` to display results in the output cell!**

## Helper Functions Not Defined

**Problem:** `ReferenceError: window.testBlockFn is not defined`

**Cause:** Cell 1 (initialization cell) not executed.

**Solution:**

1. Always run Cell 1 first when opening the notebook:
```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

2. Check that you see the success message: `✅ Browser environment ready`

3. Then run subsequent cells

**Add reminder in notebook:**
```markdown
## ⚠️ IMPORTANT
**Run Cell 1 first** to initialize helper functions!
```

## Popup Window Blocked

**Problem:** `showPreview()` runs but no window appears.

**Cause:** Browser blocking popups.

**Solution:**

**Chrome:**
1. Look for popup blocked icon in address bar (usually on the right)
2. Click it and select "Always allow popups from [your-site]"
3. Reload page and retry

**Firefox:**
1. Click Options in the popup blocked notification
2. Select "Allow popups for [your-site]"
3. Reload page and retry

**Safari:**
1. Safari → Preferences → Websites → Pop-up Windows
2. Find your site and set to "Allow"
3. Reload page and retry

**Verify:**
```javascript
await window.showPreview('accordion', '<div><div>Q</div><div>A</div></div>');
// Should see: ✓ Preview window opened
// And popup window should appear
```

## CSS Not Loading in Preview

**Problem:** Popup preview shows unstyled content (no colors, no formatting).

**Cause:** Missing CSS file or incorrect path.

**Solutions:**

1. **Verify CSS file exists:**
```bash
ls -la blocks/accordion/accordion.css
# Should exist with content
```

2. **Check browser console in popup:**
   - Open popup window
   - Press F12 to open DevTools
   - Look for 404 errors for CSS files

3. **Verify base tag origin:**
   - The popup uses `<base href>` tag to load CSS
   - Check that origin matches your site URL

4. **Try refresh button:**
   - Click the ↻ Refresh button in popup header
   - This reloads the preview with fresh CSS

## Block Not Decorating

**Problem:** Popup shows raw HTML structure, not decorated block.

**Cause:** Block JavaScript file missing or not executing.

**Solutions:**

1. **Verify block JavaScript exists:**
```bash
ls -la blocks/accordion/accordion.js
# Should exist and export default function
```

2. **Check block export:**
```javascript
// blocks/accordion/accordion.js should have:
export default function decorate(block) {
  // decoration logic
}
```

3. **Check browser console in popup:**
   - Open popup DevTools (F12)
   - Look for import errors or JavaScript errors

4. **Verify module path:**
   - Block JavaScript should be at: `/blocks/blockname/blockname.js`
   - Case-sensitive on production servers!

## Import Errors

**Problem:** `Failed to load module script` or 404 errors.

**Cause:** Incorrect import path.

**Solutions:**

1. **Check helper module path:**
```javascript
// ✅ CORRECT - absolute path from site root
const { initialize } = await import('/scripts/ipynb-helpers.js');

// ❌ INCORRECT - relative path
const { initialize } = await import('./scripts/ipynb-helpers.js');
```

2. **Verify file exists:**
   - Check `scripts/ipynb-helpers.js` is deployed
   - Check path is exactly `/scripts/ipynb-helpers.js`

3. **Check browser console:**
   - Look for 404 errors
   - Verify the full URL being loaded

## Async/Await Errors

**Problem:** `SyntaxError: await is only valid in async functions`

**Cause:** This shouldn't happen! Cells run in async context automatically.

**If you see this:**

```javascript
// ❌ DON'T DO THIS - unnecessary IIFE wrapper
return (async () => {
  const block = await window.testBlockFn('accordion', content);
  return block.outerHTML;
})();

// ✅ DO THIS - simple and clean
const block = await window.testBlockFn('accordion', content);
return block.outerHTML;
```

**Cell code runs in `AsyncFunction` context - just use `await` directly!**

## Notebook Not Displaying

**Problem:** ipynb-viewer block shows error or blank content.

**Causes & Solutions:**

1. **Invalid .ipynb JSON:**
```bash
# Validate JSON syntax
cat test.ipynb | python -m json.tool
# Should output formatted JSON without errors
```

2. **Wrong file path:**
```
# Check block configuration in Google Doc:
| IPynb Viewer |
|--------------|
| /test.ipynb  |  ← Must match actual file path
```

3. **File not published:**
   - Ensure test.ipynb is committed to repository
   - Push changes to Git
   - Verify file appears on EDS site

4. **Check browser console:**
   - F12 to open DevTools
   - Look for fetch errors or JSON parse errors

## Cell Execution Stuck

**Problem:** Cell shows "Running..." but never completes.

**Causes:**

1. **Infinite loop:**
```javascript
// ❌ BAD - hangs forever
while (true) {
  // infinite loop
}

// ✅ GOOD - has exit condition
let count = 0;
while (count < 10) {
  count++;
}
```

2. **Missing return statement:**
```javascript
// Cell may appear stuck if no return
await window.testBlockFn('accordion', content);
// Add: return '✓ Complete';
```

**Solution:** Reload the page to reset all cells.

## Console Output Not Showing

**Problem:** `console.log()` output not visible.

**Cause:** Browser console not open.

**Solution:**

1. Open browser DevTools:
   - Chrome/Firefox: F12 or Cmd+Option+I (Mac)
   - Safari: Cmd+Option+C

2. Go to Console tab

3. Rerun the cell

**Note:** Cell output area shows `return` values, not `console.log()`. Console logs appear in browser DevTools console.

## Popup Window Size Issues

**Problem:** Popup too small or too large.

**Current behavior:** Popup opens at 1200x800 pixels.

**To adjust:** Edit the `showPreview()` function in scripts/ipynb-helpers.js:

```javascript
// Change window size in showPreview():
const popup = window.open(url, '_blank', 'width=1600,height=900,...');
```

## Block Content Not Found

**Problem:** `testBlockFn()` runs but block has no content.

**Cause:** Empty or incorrect content structure.

**Solution:**

```javascript
// ✅ GOOD - proper EDS table structure
const content = `
  <div>
    <div>Question</div>
    <div>Answer</div>
  </div>
`;

// ❌ BAD - empty or wrong structure
const content = '';
const content = '<div>Just one div</div>';
```

**Verify content structure matches block expectations!**

## ESC Key Not Closing Popup

**Problem:** Pressing ESC doesn't close preview popup.

**Cause:** Popup window doesn't have focus.

**Solution:**

1. Click inside the popup window first
2. Then press ESC

**Alternative:** Click the ✕ Close button in popup header.

## Multiple Popups Opening

**Problem:** Running preview cell multiple times opens many popups.

**This is expected behavior.** Each execution opens a new popup.

**To avoid:**
- Close previous popups before running again
- Or use the refresh button (↻) in existing popup

## Notebook Cells Out of Order

**Problem:** Ran cells in wrong order, now getting errors.

**Solution:**

1. Reload the page
2. Run Cell 1 first
3. Run cells sequentially from top to bottom

**Best practice:** Always run cells from top to bottom in order.

## Helper Module Changes Not Reflecting

**Problem:** Updated scripts/ipynb-helpers.js but changes don't appear.

**Cause:** Browser cache.

**Solution:**

1. Hard refresh the page:
   - Chrome/Firefox: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Safari: Cmd+Option+R

2. Or clear browser cache for the site

3. Reload the page

## Block Changes Not Reflecting

**Problem:** Updated block JavaScript/CSS but preview looks the same.

**Causes & Solutions:**

1. **Browser cache:**
   - Hard refresh page (Cmd+Shift+R)
   - Use popup refresh button (↻)

2. **Changes not deployed:**
```bash
# Verify changes committed and pushed
git status
git log --oneline -n 5
```

3. **Wrong block being tested:**
```javascript
// Make sure block name matches
await window.showPreview('accordion', content);  // Tests 'accordion' block
```

## Cross-Origin Issues

**Problem:** Errors about CORS or cross-origin requests.

**Cause:** Trying to load resources from different domain.

**Note:** The `<base>` tag in popups solves most CORS issues by resolving all relative URLs to the parent page's origin.

**If you still see CORS errors:**
- Check that CSS/JS files are on the same domain as the EDS site
- Verify `<base href>` value in popup matches your site

## Getting Help

If you're still stuck:

1. **Check browser console (F12)** - Most errors show here
2. **Verify Cell 1 ran** - Look for "✅ Browser environment ready"
3. **Check file paths** - Case-sensitive, must start with `/`
4. **Try simple example** - Test with helloworld block first
5. **Reload page** - Fresh start often fixes issues
6. **Check examples** - See EXAMPLES.md for working patterns

## Quick Debugging Checklist

```javascript
// 1. Verify helper functions loaded
console.log('testBlockFn available:', typeof window.testBlockFn);
console.log('showPreview available:', typeof window.showPreview);
// Should show: 'function'

// 2. Test basic DOM creation
const div = document.createElement('div');
div.textContent = 'Test';
console.log('DOM working:', div.outerHTML);
// Should show: <div>Test</div>

// 3. Test simple block
const block = await window.testBlockFn('helloworld', '');
console.log('Block created:', block.className);
// Should show: helloworld block

// 4. Return something to verify cell execution
return '✓ All checks passed';
```

## Common Patterns to Avoid

```javascript
// ❌ DON'T: Use IIFE wrappers (unnecessary)
return (async () => { ... })();

// ❌ DON'T: Forget return statement (no output)
const block = await window.testBlockFn(...);

// ❌ DON'T: Use relative import paths
import('../../scripts/helpers.js')

// ✅ DO: Simple async code with return
const block = await window.testBlockFn('accordion', content);
return block.outerHTML;

// ✅ DO: Use absolute import paths
import('/scripts/ipynb-helpers.js')

// ✅ DO: Always run Cell 1 first
```
