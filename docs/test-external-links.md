---
title: "External Links Test"
description: "This file tests the new external link functionality in the ipynb-viewer GitHub markdown overlay."
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# External Links Test

This file tests the new external link functionality in the ipynb-viewer GitHub markdown overlay.

## Test Cases

### 1. Angle-Bracket URLs

These should be clickable links that open in new tabs:

See <https://github.com> for more info.

Check out <https://www.anthropic.com> for AI research.

Multiple links: <https://google.com> and <https://github.com>.

### 2. Markdown External Links

These should also be clickable and open in new tabs:

Visit [GitHub](https://github.com) for code repositories.

Learn about [Anthropic](https://www.anthropic.com) and AI safety.

Check [Google](https://google.com) for search.

### 3. Mixed Formats

Both formats should work together:

Use [Google](https://google.com) or <https://github.com> for resources.

Research at <https://www.anthropic.com> or [OpenAI](https://openai.com).

### 4. URLs in Code (Should NOT Convert)

These should remain as literal text:

```
<https://example.com>
Visit https://github.com
```

Inline code: `<https://example.com>` should not be clickable.

### 5. Internal Links (Should Remain Internal)

These should scroll within the page, not open new tabs:

See [Test Case 1](#1-angle-bracket-urls) above.

Jump to [Test Case 3](#3-mixed-formats).

### 6. Relative Markdown Links (Should Open Overlay)

These should open markdown overlays, not new tabs:

See [README](../README.md) for project info.

Check [Architecture Guide](for-ai/implementation/block-architecture-standards.md).

### 7. Long URLs

Test wrapping with long URLs:

<https://github.com/ddttom/allaboutv2/blob/main/blocks/ipynb-viewer/block-architecture.md>

Visit [this really long URL](https://github.com/ddttom/allaboutv2/blob/main/blocks/ipynb-viewer/ipynb-viewer.js) for the implementation.

### 8. URLs in Headings

## Check <https://example.com> for details

### Visit [GitHub](https://github.com) for code

## Expected Behavior

All angle-bracket URLs should:
- ✅ Be clickable
- ✅ Open in new tab
- ✅ Have security attributes (`target="_blank" rel="noopener noreferrer"`)
- ✅ Show external link icon (↗)
- ✅ Be styled in blue GitHub link color
- ✅ Underline on hover

All external markdown links should:
- ✅ Be clickable
- ✅ Open in new tab
- ✅ Have security attributes
- ✅ Show external link icon (↗)
- ✅ Be styled consistently

Code blocks and inline code should:
- ❌ NOT be clickable
- ✅ Remain as literal text

Internal hash links should:
- ✅ Navigate within the page
- ❌ NOT open new tab

Relative markdown links should:
- ✅ Open markdown overlay
- ❌ NOT open new tab

## Testing Instructions

1. Open a notebook with GitHub overlay mode in ipynb-viewer
2. Navigate to this markdown file (test-external-links.md)
3. Click each type of link
4. Verify behavior matches expected results above
5. Check browser console for errors
6. Test in Safari, Chrome, and Firefox

## Security Validation

All external links should have:
- `target="_blank"` attribute (opens new tab)
- `rel="noopener noreferrer"` attribute (security best practice)
  - `noopener`: Prevents new tab from accessing `window.opener`
  - `noreferrer`: Doesn't send referrer header to external site

Inspect links in browser DevTools to verify attributes are present.

## Accessibility Validation

Test with keyboard navigation:
- Tab to focus links
- Enter to activate links
- Verify external links announce "opens in new tab" to screen readers
- Check color contrast (blue on white should meet WCAG AA)

## Edge Cases

### URL with Angle Brackets in Text (Non-URL)

This should NOT be converted to a link:

Array<string> type annotation

Generic<T> function

### Escaped Angle Brackets

This should display as literal text:

\<https://example.com\>

### Multiple Angle Brackets

<https://example1.com> and <https://example2.com> and <https://example3.com>

### URL at Start of Line

<https://github.com> is a great platform.

### URL at End of Line

Check out this link: <https://github.com>

### URL in List

- <https://github.com>
- <https://www.anthropic.com>
- <https://google.com>

### URL in Blockquote

> See <https://github.com> for code.
>
> Visit [Anthropic](https://www.anthropic.com) for AI.

## Success Criteria

✅ All angle-bracket URLs clickable
✅ All external markdown links clickable
✅ All links open in new tab
✅ Security attributes present on all external links
✅ External link icon visible on all external links
✅ Code blocks unchanged (URLs remain literal)
✅ Inline code unchanged (URLs remain literal)
✅ Internal hash links navigate within page
✅ Relative markdown links open overlay
✅ No console errors
✅ Styling consistent with GitHub
✅ Hover effects work
✅ Keyboard navigation works
✅ Screen reader announces new tab

---

**Test File Version**: 1.0
**Created**: 2026-01-14
**Purpose**: Validate external link functionality in ipynb-viewer GitHub markdown overlay
