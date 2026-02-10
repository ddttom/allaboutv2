---
title: "Code Block Rendering Fix Plan"
description: "Plan to fix code block rendering in the ipynb-viewer GitHub markdown overlay"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Code Block Rendering Fix Plan

## The Ask

Fix code block rendering in the ipynb-viewer GitHub markdown overlay so that HTML code examples display with proper line breaks - each HTML tag should appear on its own line, not concatenated into a single line. it should also be indented.

## The Problem

**Current Behavior:**
Code blocks in GitHub markdown files are displaying all on one line:

```
<form id="signup-form"><div class="form-group"><button type="submit">
```

**Expected Behavior:**
Each tag should be on its own line:

```
<form id="signup-form">
  <div class="form-group">
    <button type="submit">
```

**Evidence from Console:**

- Console shows: `[CODE BLOCK 0] Restored 26 Lines` - newlines ARE being extracted
- Console shows: `white-space CSS: pre` - CSS IS correct
- Console shows restoration is successful with proper line counts
- But visual display still shows everything on one line

## Architecture Overview

### File: `/Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/ipynb-viewer/ipynb-viewer.js`

**Function: `parseMarkdown(markdown, repoUrl, branch, currentFilePath)`**

- Lines 19-427: Converts markdown to HTML
- Lines 41-51: Extracts code blocks (```language```) and stores as placeholders
- Lines 46-48: Escapes HTML entities (`<` → `&lt;`, `>` → `&gt;`)
- Lines 382-385: Restores code block placeholders to actual `<pre><code>` HTML
- Lines 399-424: Paragraph processing - wraps content in `<p>` tags unless it's a block element
- Line 404: Pattern to detect block elements: `/^<(h[1-6]|table|ul|ol|blockquote|pre|hr)/`
- Line 413-415: Code blocks (`<pre>`) are preserved with newlines intact

**Function: `createGitHubMarkdownOverlay(githubUrl, title, ...)`**

- Lines 3036-3700: Creates GitHub markdown overlay
- Line 3188: `contentArea` has classes: `ipynb-manual-content-area ipynb-overlay-content ipynb-paged-cell-area`
- Line 3039: Overlay has classes: `ipynb-manual-overlay ipynb-github-md-overlay`
- Line 3426: Calls `parseMarkdown()` to convert markdown to HTML
- Lines 3431-3444: **EXTRACTION PHASE** - Extract code blocks from HTML string BEFORE innerHTML
  - Regex: `/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g`
  - Manual entity decoding: `.replace(/&lt;/g, '<')` etc.
  - Stores decoded text in `codeBlockContents[]` array
- Line 3447: **INSERTION PHASE** - `contentArea.innerHTML = renderedHTML`
  - This is where browser's HTML parser runs
  - Browser may "fix" what it thinks is invalid HTML by inserting `<p>` tags
- Lines 3450-3461: **RESTORATION PHASE** - Replace code block textContent
  - Removes any `<p>` tags browser inserted inside code blocks
  - Sets `codeBlock.textContent = codeBlockContents[index]`

### File: `/Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/ipynb-viewer/ipynb-viewer.css`

**GitHub Markdown Overlay Code Block Styles:**

- Line 1850-1854: `.ipynb-github-md-overlay .ipynb-manual-content-area pre`
  - `white-space: pre !important`
- Line 1856-1861: `.ipynb-github-md-overlay .ipynb-manual-content-area pre code`
  - `white-space: pre !important`
  - `display: block !important`
- Line 1888-1896: Universal fallback rule for ALL code blocks
  - `white-space: pre !important`
  - `display: block !important`

## Current Implementation Issues

### Issue 1: Extraction Working But Display Failing

**Symptoms:**

- Console: "Restored 26 lines" ✅
- Console: "white-space CSS: pre" ✅
- Visual: Everything on one line ❌

**Hypothesis:**
The newlines ARE in the DOM, the CSS IS correct, but something is preventing visual rendering of the line breaks.

### Issue 2: Browser HTML Parser "Fixing" Invalid HTML

**Symptoms:**

- Console BEFORE restoration: `<p><!-- Form fields... -->`
- Browser inserted `<p>` tags inside `<code>` blocks

**Current Fix Attempt:**
Lines 3450-3461 try to strip `<p>` tags before restoration, but it may not be working.

## Debugging Steps for AI Assistant

### Step 1: Verify DOM Structure

Open browser DevTools and inspect a code block element:

```javascript
// In console
const codeBlock = document.querySelector('.ipynb-github-md-overlay pre code');
console.log('textContent:', codeBlock.textContent);
console.log('innerHTML:', codeBlock.innerHTML);
console.log('childNodes:', codeBlock.childNodes);
```

**Check:**

- Does `textContent` contain newlines (`\n` characters)?
- Does `innerHTML` contain `<p>` tags or other unexpected elements?
- Are there multiple text nodes or element nodes?

### Step 2: Verify CSS Application

```javascript
const codeBlock = document.querySelector('.ipynb-github-md-overlay pre code');
const styles = window.getComputedStyle(codeBlock);
console.log('white-space:', styles.whiteSpace);  // Should be "pre"
console.log('display:', styles.display);          // Should be "block"
console.log('font-family:', styles.fontFamily);   // Should be monospace
```

### Step 3: Check Parent Element

```javascript
const pre = document.querySelector('.ipynb-github-md-overlay pre');
const preStyles = window.getComputedStyle(pre);
console.log('PRE white-space:', preStyles.whiteSpace);  // Should be "pre"
console.log('PRE display:', preStyles.display);          // Should be "block"
```

### Step 4: Test Manual Fix

```javascript
// Force textContent refresh
const codeBlock = document.querySelector('.ipynb-github-md-overlay pre code');
const originalText = codeBlock.textContent;
codeBlock.textContent = '';
setTimeout(() => {
  codeBlock.textContent = originalText;
  console.log('Refreshed textContent');
}, 100);
```

### Step 5: Check for CSS Conflicts

```javascript
const codeBlock = document.querySelector('.ipynb-github-md-overlay pre code');
const allStyles = window.getComputedStyle(codeBlock);
console.log('ALL STYLES:', {
  whiteSpace: allStyles.whiteSpace,
  display: allStyles.display,
  lineHeight: allStyles.lineHeight,
  wordWrap: allStyles.wordWrap,
  overflowWrap: allStyles.overflowWrap,
  textOverflow: allStyles.textOverflow
});
```

## Potential Root Causes

### Hypothesis A: innerHTML Normalizing Whitespace

**Problem:** When setting `contentArea.innerHTML = renderedHTML`, the browser normalizes whitespace in certain contexts.

**Test:** Check if using DOMParser is better:

```javascript
const parser = new DOMParser();
const doc = parser.parseFromString(renderedHTML, 'text/html');
contentArea.innerHTML = '';
Array.from(doc.body.childNodes).forEach(node => {
  contentArea.appendChild(node.cloneNode(true));
});
```

### Hypothesis B: Paragraph Processing Breaking Code Blocks

**Problem:** Line 399-424 in `parseMarkdown()` processes paragraphs AFTER code blocks are restored (line 382-385). The pattern at line 404 should catch `<pre>` blocks, but maybe it's not working.

**Test:** Add debug logging to paragraph processing:

```javascript
html = paragraphs.map((para) => {
  const trimmed = para.trim();
  if (blockElementPattern.test(trimmed)) {
    if (preBlockPattern.test(trimmed)) {
      console.log('[PARA] Preserving code block:', trimmed.substring(0, 100));
      return trimmed;  // Preserve newlines
    }
  }
  // ...
});
```

### Hypothesis C: CSS Specificity Issue

**Problem:** Another CSS rule with higher specificity is overriding `white-space: pre`.

**Test:** Add inline style:

```javascript
codeBlock.style.whiteSpace = 'pre';
codeBlock.style.display = 'block';
```

### Hypothesis D: Text Nodes vs Element Nodes

**Problem:** If the code block contains element nodes (like `<p>` tags) instead of a single text node, the whitespace might not render correctly.

**Test:** Check node structure:

```javascript
const codeBlock = document.querySelector('.ipynb-github-md-overlay pre code');
console.log('Child node count:', codeBlock.childNodes.length);
console.log('Child nodes:', Array.from(codeBlock.childNodes).map(n => ({
  type: n.nodeType,
  name: n.nodeName,
  text: n.textContent?.substring(0, 50)
})));
```

## Recommended Fix Strategy

### Option 1: Use Pre-Formatted Text Directly

Instead of trying to fix the HTML after innerHTML, set textContent directly:

```javascript
// After creating contentArea.innerHTML = renderedHTML
const tempDiv = document.createElement('div');
tempDiv.innerHTML = renderedHTML;

// Find all code blocks in temp div
const tempCodeBlocks = tempDiv.querySelectorAll('pre code');
tempCodeBlocks.forEach((codeBlock, index) => {
  if (index < codeBlockContents.length) {
    codeBlock.textContent = codeBlockContents[index];
  }
});

// Now set the cleaned HTML
contentArea.innerHTML = '';
Array.from(tempDiv.childNodes).forEach(node => {
  contentArea.appendChild(node.cloneNode(true));
});
```

### Option 2: Build DOM Manually for Code Blocks

Instead of using innerHTML for code blocks, create them programmatically:

```javascript
// Replace code block placeholders with actual DOM elements
codeBlockContents.forEach((content, index) => {
  const placeholder = `__CODEBLOCK_${index}__`;
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'language-plaintext';
  code.textContent = content;  // textContent preserves newlines
  pre.appendChild(code);

  // Replace placeholder in HTML string with a unique marker
  renderedHTML = renderedHTML.replace(placeholder, `<!--CODEBLOCK_${index}-->`);
});

// Set innerHTML
contentArea.innerHTML = renderedHTML;

// Replace comment markers with actual code elements
const comments = contentArea.querySelectorAll('*');
comments.forEach(elem => {
  // Find comment nodes and replace with code blocks
});
```

### Option 3: Force Re-render

After setting textContent, force a browser re-render:

```javascript
codeBlock.textContent = codeBlockContents[index];
codeBlock.style.display = 'none';
codeBlock.offsetHeight; // Force reflow
codeBlock.style.display = 'block';
```

## Success Criteria

1. Open GitHub markdown overlay with code examples
2. Each HTML tag appears on its own line
3. Code formatting is preserved exactly as in source markdown
4. Console shows no errors
5. CSS `white-space: pre` is applied and effective

## Files to Modify

- `/Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/ipynb-viewer/ipynb-viewer.js`
  - Lines 3431-3461: Code block extraction and restoration logic
  - Possibly lines 19-427: `parseMarkdown()` function

## Additional Context

- This affects ONLY the GitHub markdown overlay (`.ipynb-github-md-overlay`)
- Notebook cell code blocks may work fine (different code path)
- The issue started when trying to fix line break rendering
- Console logs confirm data is correct, so issue is likely in DOM manipulation or CSS application
