# Test Inline HTML Escaping

## Purpose
This document tests that inline HTML tags are properly escaped in ipynb-viewer markdown rendering, matching GitHub's behavior.

## Test Cases

### 1. Inline HTML Tags (Should Be Escaped)
This has an inline <div>tag</div> that should be displayed as text.

Here's an image tag that should be escaped: <img src="test.jpg" alt="test">

And a script tag: <script>alert('test')</script>

Multiple tags: <div><span>nested</span></div>

### 2. Inline Code (Should Work Correctly)
This inline code `<div>tag</div>` should be displayed in a code element.

More inline code with HTML: `<img src="test.jpg">` and `<script>alert('test')</script>`

### 3. Code Blocks (Should Display HTML With Syntax Highlighting)

```html
<div class="test">
  <span>This is a code block</span>
  <img src="test.jpg" alt="test">
</div>
```

```javascript
const html = '<div>Some HTML</div>';
document.body.innerHTML = html;
```

### 4. Escaped HTML Characters (Should Display As Literal Text)
Previously escaped: \<div> and \</div>

Mixed: \<span>text</span>

### 5. Legitimate Markdown HTML (Should Render Correctly)
**Bold text** and *italic text*

- List item 1
- List item 2
- **Bold in list**
- *Italic in list*

1. **In your work:** Which patterns have you seen?
2. **In your experience:** What frustrated you?
3. *Looking ahead:* How will things change?

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

> Blockquote text

### 6. All Heading Levels (Should Render Correctly)

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Expected Results

1. **Inline HTML tags**: Displayed as escaped text (visible angle brackets)
2. **Inline code**: Rendered as `<code>` elements with content
3. **Code blocks**: Displayed with syntax highlighting, HTML escaped
4. **Escaped chars**: Displayed as literal angle brackets without escaping prefix
5. **Markdown HTML**: Rendered as proper HTML elements (bold, links, images, lists, etc.)
   - Lists with bold/italic formatting work correctly
6. **Heading levels**: All six heading levels (h1-h6) render with proper sizing

## Verification Steps

1. Display this file via ipynb-viewer smart link
2. Inspect rendered HTML in DevTools
3. Confirm:
   - Section 1: Tags visible as text (e.g., "&lt;div&gt;tag&lt;/div&gt;")
   - Section 2: Inline code shows `<code>` elements
   - Section 3: Code blocks show escaped HTML in `<pre><code>` elements
   - Section 4: Literal angle brackets visible (no backslashes)
   - Section 5: HTML elements rendered (not escaped)
   - Section 6: All heading levels (h1-h6) display with decreasing sizes
