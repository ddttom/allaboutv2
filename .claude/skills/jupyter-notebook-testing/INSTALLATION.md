# Jupyter Notebook Testing Installation - Browser Only

Setup guide for testing EDS blocks with Jupyter notebooks in the browser.

## Overview

The Jupyter notebook testing system runs **exclusively in the browser** via the ipynb-viewer block on EDS sites. No local installation required!

## Prerequisites

To use the notebook testing system, you need:

- An EDS site with the ipynb-viewer block deployed
- A modern web browser (Chrome, Firefox, Safari, Edge)
- The test.ipynb notebook added to your EDS site

That's it! No Node.js, Python, or Jupyter installation needed.

## Setup

### 1. Deploy ipynb-viewer Block

Ensure the ipynb-viewer block is deployed to your EDS site:

```
blocks/
└── ipynb-viewer/
    ├── ipynb-viewer.js
    ├── ipynb-viewer.css
    └── README.md
```

### 2. Add test.ipynb to Your Site

Place the test.ipynb notebook in your site repository:

```
project/
├── test.ipynb          # Main test notebook
├── blocks/
│   └── ipynb-viewer/
└── scripts/
    └── ipynb-helpers.js
```

### 3. Create Page with ipynb-viewer Block

In your Google Doc or directly in your EDS page:

```
| IPynb Viewer |
|--------------|
| /test.ipynb  |
```

### 4. Open in Browser

1. Publish your page
2. Open the page in your browser
3. The notebook will be displayed with interactive cells

## File Structure

Your project should have:

```
project/
├── test.ipynb                      # Browser-only test notebook
├── scripts/
│   └── ipynb-helpers.js           # Helper functions module
├── blocks/
│   ├── ipynb-viewer/              # Notebook viewer block
│   │   ├── ipynb-viewer.js
│   │   ├── ipynb-viewer.css
│   │   └── README.md
│   ├── accordion/                  # Example block to test
│   │   ├── accordion.js
│   │   ├── accordion.css
│   │   └── README.md
│   └── [other blocks]/
└── styles/                         # EDS core styles
    ├── styles.css
    ├── fonts.css
    └── lazy-styles.css
```

## Verify Setup

### Test 1: Page Loads

Open your EDS page with the ipynb-viewer block:
- ✅ Notebook cells are visible
- ✅ Markdown cells are formatted
- ✅ Code cells have "Run" buttons

### Test 2: Run Cell 1

Click "Run" on the first code cell:

```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

Expected output:
```
✅ Browser environment ready
```

### Test 3: Test a Block

Run a test cell:

```javascript
const block = await window.testBlockFn('accordion', '<div><div>Q</div><div>A</div></div>');
return block.outerHTML;
```

Expected output: Decorated HTML of the accordion block

### Test 4: Generate Preview

Run a preview cell:

```javascript
await window.showPreview('accordion', '<div><div>Q</div><div>A</div></div>');
return '✓ Preview window opened';
```

Expected result:
- ✅ Popup window opens (1200x800)
- ✅ Styled accordion block visible
- ✅ Refresh and close buttons work
- ✅ ESC key closes popup

## Browser Configuration

### Allow Popups

The `showPreview()` function opens popup windows. You may need to allow popups for your domain:

**Chrome:**
1. Click the popup blocked icon in address bar
2. Select "Always allow popups from [your-site]"
3. Reload page and retry

**Firefox:**
1. Click Options in the popup blocked notification
2. Select "Allow popups for [your-site]"
3. Reload page and retry

**Safari:**
1. Safari → Preferences → Websites → Pop-up Windows
2. Find your site and set to "Allow"
3. Reload page and retry

### Browser Console

Open browser console (F12 or Cmd+Option+I) to see:
- Console.log() output from cells
- Error messages
- Debug information

## No Installation Needed!

Unlike traditional Jupyter setups, the browser-only approach requires:

- ❌ No Node.js installation
- ❌ No Python installation
- ❌ No Jupyter installation
- ❌ No TSLab/JSLab kernel
- ❌ No jsdom installation
- ❌ No VS Code extensions

Just deploy the ipynb-viewer block and open notebooks in the browser!

## Development vs End-User

### For Developers

As a developer, you can:
1. Create/edit .ipynb files locally
2. Commit to repository
3. Deploy to EDS site
4. Test in browser

### For End Users

End users can:
1. Open EDS pages with notebooks
2. Read markdown documentation
3. Click "Run" on code cells
4. See results inline
5. Generate popup previews
6. Learn interactively

## Troubleshooting Setup

### Notebook Not Displaying

**Problem:** ipynb-viewer block shows error or blank content

**Solution:**
- Verify .ipynb file is valid JSON
- Check file path in block configuration
- Ensure file is published to EDS site
- Check browser console for errors

### Helper Functions Not Working

**Problem:** `window.testBlockFn is not defined`

**Solution:**
- Run Cell 1 first to initialize
- Verify scripts/ipynb-helpers.js exists
- Check import path: `/scripts/ipynb-helpers.js`
- Check browser console for import errors

### Popups Blocked

**Problem:** `showPreview()` doesn't open window

**Solution:**
- Look for popup blocked indicator in address bar
- Allow popups for your domain
- Retry the preview cell

### Blocks Not Decorating

**Problem:** Popup shows undecorated HTML

**Solution:**
- Verify block JavaScript file exists: `blocks/blockname/blockname.js`
- Check block CSS file exists: `blocks/blockname/blockname.css`
- Check browser console for 404 errors
- Verify base tag origin in popup HTML

## Next Steps

After setup:

1. ✅ Run Cell 1 to initialize environment
2. ✅ Test simple blocks with `testBlockFn()`
3. ✅ Generate popup previews with `showPreview()`
4. ✅ Create your own test scenarios
5. ✅ Share executable notebooks with users

## Resources

- **Main Documentation**: [docs/for-ai/explaining-jupyter.md](../../../docs/for-ai/explaining-jupyter.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)
- **Skill Guide**: [SKILL.md](SKILL.md)
- **ipynb-viewer Block**: [blocks/ipynb-viewer/README.md](../../../blocks/ipynb-viewer/README.md)
