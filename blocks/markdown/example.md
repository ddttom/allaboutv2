# Markdown Block - Usage Examples

This document shows how to use the markdown block in Google Docs to display syntax-highlighted code snippets. Perfect for documentation, tutorials, API examples, and technical content with JavaScript code displays.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create a simple code display in Google Docs:

| Markdown |
|----------|
| const greeting = 'Hello, World!'; |
| console.log(greeting); |

**Result:** JavaScript code with syntax highlighting in a light blue bordered container. Keywords in blue, strings in red, proper monospace formatting.

---

## Basic Usage

### Minimal Example

The simplest markdown block with one line of code:

| Markdown |
|----------|
| function add(a, b) { return a + b; } |

**Output:** Single line of highlighted JavaScript code.

### Standard Example

Multi-line code with proper formatting:

| Markdown |
|----------|
| function calculateTotal(items) { |
|   let total = 0; |
|   for (const item of items) { |
|     total += item.price; |
|   } |
|   return total; |
| } |

**Output:** Multi-line function with indentation, syntax highlighting for keywords, numbers, and function names.

---

## Common Patterns

### Pattern 1: Simple Function Display

Perfect for API documentation and quick examples:

| Markdown |
|----------|
| function validateEmail(email) { |
|   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); |
| } |

**Best for:** Quick reference, API docs, function signatures

### Pattern 2: Code with Comments

Document your code examples with inline comments:

| Markdown |
|----------|
| // This function validates user input |
| function validateInput(data) { |
|   /*Check if data exists and is not empty*/ |
|   if (!data || data.trim() === '') { |
|     return false; |
|   } |
|   return true; |
| } |

**Best for:** Educational content, tutorials, step-by-step guides

### Pattern 3: Variable Declarations

Show configuration or initialization code:

| Markdown |
|----------|
| const API_ENDPOINT = 'https://api.example.com/v1'; |
| const MAX_RETRIES = 3; |
| const TIMEOUT = 5000; |
| let currentUser = null; |

**Best for:** Configuration examples, setup instructions, environment variables

### Pattern 4: Conditional Logic

Demonstrate control flow and decision-making:

| Markdown |
|----------|
| if (user.age >= 18) { |
|   console.log('User is an adult'); |
| } else if (user.age >= 13) { |
|   console.log('User is a teenager'); |
| } else { |
|   console.log('User is a child'); |
| } |

**Best for:** Logic explanation, algorithm documentation, flow examples

### Pattern 5: Array and Loop Examples

Show iteration and data processing:

| Markdown |
|----------|
| const items = [1, 2, 3, 4, 5]; |
| let sum = 0; |
| for (const item of items) { |
|   sum += item; |
| } |
| console.log('Total:', sum); |

**Best for:** Data manipulation, array processing, iteration patterns

---

## Content Requirements

### Code Content Requirements

**Recommended:**

- JavaScript syntax only (other languages not highlighted)
- One line per table cell (or entire code block in one cell)
- Plain text only (no HTML tags)
- Proper quoting for strings (single or double quotes)
- Valid JavaScript syntax for best highlighting

**Why this matters:**

- Block processes text for JavaScript keywords
- Syntax highlighting patterns optimized for JS
- Other languages will display but without highlighting
- Invalid syntax may produce unexpected highlighting

**Good code examples:**

- Function declarations and expressions
- Variable assignments (const, let, var)
- Control structures (if, else, for, while)
- Comments (single-line and multi-line)
- String literals and numbers

**Avoid:**

- HTML or CSS code (no highlighting support)
- Python or other languages (no highlighting support)
- Very long lines (may require horizontal scrolling)
- Complex regex patterns (may confuse highlighter)

### Content Length

**Content length:**

- No strict limits on lines or characters
- Container scrolls if content is very long
- Keep concise for better readability
- Aim for 5-20 lines per code block
- Break very long examples into multiple blocks

**Formatting tips:**

1. Use consistent indentation (2 or 4 spaces)
2. Keep lines under 80 characters when possible
3. Add blank lines for readability
4. Include comments to explain complex logic
5. Break long examples into logical sections

### Accessibility Requirements

**Always provide:**

- Context before code block (what does it do?)
- Descriptive heading for code section
- Explanation of key concepts after code
- Plain text alternative if code is essential to understanding

**Avoid:**

- Code without context or explanation
- Critical information only in code comments
- Assuming all users can read code
- Code-only documentation pages

---

## Styling Guidelines

### Visual Appearance

**Container:**

- Light blue background (#e6f3ff)
- Blue border (#4a90e2)
- Rounded corners (8px)
- Internal padding (20px)

**Code Display:**

- Monospace font (Courier New)
- Font size: 14px
- Line height: 1.5
- White space preserved (pre-wrap)
- Word wrapping enabled

**Syntax Colors:**

- Keywords: Blue (#0000ff)
- Strings: Red (#a31515)
- Comments: Green (#008000)
- Numbers: Teal (#09885a)
- Functions: Brown (#795e26)

### Responsive Behavior

**Mobile (< 768px):**

- Padding reduced to 10px
- Font size maintains readability
- Horizontal scrolling for long lines
- Touch-friendly display

**Tablet (768px - 1024px):**

- Standard padding (20px)
- No major layout changes
- Comfortable reading width

**Desktop (> 1024px):**

- Full padding (20px)
- Optimal code viewing
- Clear syntax visibility

**How it works:**

- CSS media query adjusts padding at 768px breakpoint
- Pre element handles long lines with word-wrap
- Horizontal scrolling available if needed
- Container scales with content

---

## Best Practices

### Content Strategy

**1. Provide context**

- Explain what the code does before showing it
- Add descriptive headings for code sections
- Include follow-up explanations after code
- Link to related documentation

**2. Keep examples focused**

- One concept per code block
- Avoid mixing unrelated code
- Show complete, working examples
- Include necessary imports/setup

**3. Use meaningful names**

- Clear variable names (not x, y, z)
- Descriptive function names
- Avoid abbreviated names
- Follow JavaScript conventions

**4. Add helpful comments**

- Explain why, not just what
- Document complex logic
- Note important details
- Keep comments concise

### Code Quality

**1. Valid syntax**

- Use proper JavaScript syntax
- Close all brackets and quotes
- Match parentheses correctly
- Valid function declarations

**2. Consistent formatting**

- Use consistent indentation
- Add spaces around operators
- Follow style guidelines
- Maintain readable spacing

**3. Working examples**

- Code should be runnable (if complete)
- Avoid syntax errors
- Test examples before publishing
- Verify logic is correct

**4. Appropriate length**

- Not too short (meaningless snippets)
- Not too long (overwhelming)
- Complete enough to understand
- Focused on key concepts

### Accessibility First

**1. Descriptive context**

- Explain code purpose in plain language
- Don't assume code speaks for itself
- Provide text descriptions
- Include usage examples

**2. Readable formatting**

- Good contrast (default colors meet WCAG AA)
- Adequate font size
- Clear spacing
- Monospace font for clarity

**3. Screen reader friendly**

- Pre element announces as code block
- Content read line by line
- Syntax highlighting doesn't interfere
- Alternative text descriptions provided

**4. Keyboard accessible**

- No interactive elements (display only)
- Standard page navigation works
- No keyboard traps
- Focus moves naturally

### When NOT to Use Markdown Block

**Avoid markdown block for:**

- Non-JavaScript code (no highlighting benefit)
- HTML or CSS snippets (use different block)
- Very long code files (use external links)
- Inline code mentions (use regular text formatting)

**Better alternatives:**

- **Text block** - For prose with inline code mentions
- **File links** - For complete source files
- **External docs** - For comprehensive API references
- **Code repositories** - For full project examples

---

## Troubleshooting

### Issue: Code not displaying with colors

**Problem:** Code appears as plain black text without syntax highlighting.

**Cause:** JavaScript or CSS not loaded properly.

**Solution:**

1. Verify table format in Google Docs is correct
2. Check that first row has "Markdown" in it
3. Ensure subsequent rows contain code content
4. Clear cache and reload page
5. Check browser console for errors

### Issue: Container has no background

**Problem:** Code displays without light blue background or border.

**Cause:** CSS not loaded or CSS variables not defined.

**Solution:**

1. Verify markdown.css is loaded (check Network tab)
2. Inspect element to see if styles are applied
3. Check for CSS conflicts with other blocks
4. Ensure no custom CSS is overriding defaults

### Issue: Long lines get cut off

**Problem:** Code lines extend beyond visible area without scrollbar.

**Cause:** White space or overflow settings issue.

**Solution:**

1. **Accept horizontal scrolling** (default behavior):
   - Pre element allows horizontal scroll
   - This is the intended design

2. **Break long lines** (recommended):
   - Keep code lines under 80 characters
   - Add line breaks at logical points
   - Split long strings across lines

3. **Check CSS settings** (advanced):
   - Verify: `white-space: pre-wrap`
   - Verify: `word-wrap: break-word`

### Issue: Keywords not highlighted correctly

**Problem:** JavaScript keywords appear in wrong color or not highlighted.

**Cause:** Only specific keywords are supported.

**Solution:**

- **Supported keywords:** const, let, var, function, return, if, else, for, while, class
- **Not supported:** async, await, try, catch, import, export, etc.
- This is a limitation of the basic syntax highlighter
- Future versions may support more keywords

### Issue: Comments not showing in green

**Problem:** Comments appear in default text color.

**Cause:** Comment format not recognized.

**Solution:**

- Use `//` for single-line comments
- Use `/* */` for multi-line comments
- Ensure space after `//` for best recognition
- Check that comment syntax is valid

### Issue: Indentation looks wrong

**Problem:** Code indentation appears inconsistent or collapsed.

**Cause:** Line trimming in processContent() function.

**Solution:**

1. **Use consistent spacing** (recommended):
   - Use 2 or 4 spaces per indent level
   - Apply same indentation throughout
   - Pre element preserves spacing

2. **Check source format:**
   - Verify Google Docs preserves spaces
   - Check for tab vs space issues
   - Ensure no extra whitespace

---

## Advanced Techniques

### Code with Multiple Functions

Show related functions together:

| Markdown |
|----------|
| function fetchData(url) { |
|   return fetch(url).then(res => res.json()); |
| } |
|  |
| function processData(data) { |
|   return data.map(item => item.value); |
| } |
|  |
| function saveData(data) { |
|   localStorage.setItem('data', JSON.stringify(data)); |
| } |

**Result:** Multiple related functions with blank lines for separation.

### Complex Logic Examples

Demonstrate advanced patterns:

| Markdown |
|----------|
| class DataManager { |
|   constructor() { |
|     this.data = []; |
|   } |
|   add(item) { |
|     this.data.push(item); |
|   } |
|   find(id) { |
|     return this.data.find(item => item.id === id); |
|   } |
| } |

**Result:** Class definition with methods and comments.

### Error Handling Examples

Show try-catch patterns:

| Markdown |
|----------|
| function safeParseJSON(str) { |
|   /*Safely parse JSON with error handling*/ |
|   if (!str) { |
|     return null; |
|   } |
|   return JSON.parse(str); |
| } |

**Result:** Error handling with comments and validation.

### Combining Markdown with Other Blocks

Use markdown blocks within a larger page structure:

### API Reference

The `calculateTotal` function computes the sum of all item prices.

| Markdown |
|----------|
| function calculateTotal(items) { |
|   return items.reduce((sum, item) => sum + item.price, 0); |
| } |

### Usage Example

Call the function with an array of items to get the total price.

**Result:** Code blocks work seamlessly with surrounding text blocks.

### Custom Styling Examples

Override default styles in your project CSS (advanced):

`Light theme`
`.markdown {`
`--markdown-bg-color: #f8f9fa;`
`--markdown-border-color: #dee2e6;`
`}`

`Dark theme`
`.markdown.dark {`
`--markdown-bg-color: #1e1e1e;`
`--markdown-border-color: #3e3e3e;`
`}`
`.markdown.dark .markdown-content {`
`color: #d4d4d4;`
`}`

Then apply by adding CSS to your project's styles.

---

## Testing Your Markdown Blocks

### Visual Testing Checklist

After creating markdown blocks in Google Docs:

1. **Preview on staging site:**
   - Code appears in styled container ✓
   - Syntax highlighting colors visible ✓
   - Border and background present ✓
   - Font is monospace ✓

2. **Syntax verification:**
   - Keywords highlighted in blue ✓
   - Strings highlighted in red ✓
   - Comments highlighted in green ✓
   - Numbers highlighted in teal ✓
   - Function names highlighted in brown ✓

3. **Mobile testing (< 768px):**
   - Padding reduced appropriately ✓
   - Code remains readable ✓
   - Horizontal scrolling works ✓
   - No layout issues ✓

4. **Content testing:**
   - Single-line code displays correctly ✓
   - Multi-line code maintains formatting ✓
   - Comments are highlighted ✓
   - Indentation preserved ✓

5. **Accessibility testing:**
   - Screen reader announces code block ✓
   - Content is readable ✓
   - Sufficient color contrast ✓
   - No keyboard traps ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

**Not supported:** Internet Explorer 11

---

## Content Examples

### Example 1: Simple Function

| Markdown |
|----------|
| function greet(name) { |
|   return 'Hello, ' + name + '!'; |
| } |

### Example 2: Variable Declarations

| Markdown |
|----------|
| const API_KEY = 'abc123'; |
| let userCount = 0; |
| var isActive = true; |

### Example 3: Conditional Logic

| Markdown |
|----------|
| if (score >= 90) { |
|   return 'A'; |
| } else if (score >= 80) { |
|   return 'B'; |
| } else { |
|   return 'C'; |
| } |

### Example 4: Loop Example

| Markdown |
|----------|
| for (let i = 0; i < 10; i++) { |
|   console.log('Count:', i); |
| } |

### Example 5: With Comments

| Markdown |
|----------|
| // Initialize counter |
| let count = 0; |
| /*Loop through items*/ |
| while (count < 5) { |
|   count++; |
| } |

---

## Integration Examples

### Markdown After Heading

### Function Documentation

The `add` function returns the sum of two numbers.

| Markdown |
|----------|
| function add(a, b) { |
|   return a + b; |
| } |

**Parameters:**

- `a` - First number
- `b` - Second number

**Returns:** Sum of a and b

### Markdown in Tutorial Flow

Step 1: Define the function

| Markdown |
|----------|
| function fetchUser(id) { |
|   return fetch('/api/users/' + id); |
| } |

Step 2: Call the function

| Markdown |
|----------|
| const user = fetchUser(123); |
| console.log(user); |

Step 3: Handle the response

Add error handling and data processing as needed.

---

## Related Blocks

**Similar functionality:**

- **Code block** (if available) - Alternative code display
- **Pre block** (if available) - Preformatted text display
- **Text block** - For inline code mentions

**Complementary blocks:**

- **Hero** - Large introductory section before code
- **Quote** - Callouts or important notes
- **Columns** - Create multi-column code layouts

---

## Version History

- **v1.0** (Current) - Initial markdown block implementation
  - Basic JavaScript syntax highlighting
  - HTML entity escaping for security
  - Styled container with CSS variables
  - Responsive design
  - Error handling

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Technical Writers, Developers
