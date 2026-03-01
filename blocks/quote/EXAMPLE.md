---
title: "Quote Block - Usage Examples"
description: "Usage examples for the quote EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Quote Block - Usage Examples

## How to Use in Google Docs

### Example 1: Basic Quote (No Attribution)

Create a table with just the quote text:

| Quote |
|-------|
| The best way to predict the future is to invent it. |

**Result**: A centered quote with automatic quotation marks.

---

### Example 2: Quote with Simple Attribution

Add a second row for the author:

| Quote |
|-------|
| Simplicity is the ultimate sophistication. |
| Leonardo da Vinci |

**Result**: Quote with author name right-aligned, prefixed with em-dash (—).

---

### Example 3: Quote with Citation (Recommended)

Use italics for the author name by wrapping it in asterisks:

| Quote |
|-------|
| Programs must be written for people to read, and only incidentally for machines to execute. |
| *Harold Abelson and Gerald Jay Sussman* |

**Result**: Author name wrapped in proper `<cite>` HTML element (semantic markup).

---

### Example 4: Testimonial

Perfect for customer testimonials:

| Quote |
|-------|
| Working with this team transformed our digital presence. The results exceeded all expectations. |
| *Sarah Johnson, CEO at TechCorp* |

---

### Example 5: Pull Quote in Article

Use to highlight a key statement from your content:

| Quote |
|-------|
| The most important finding from our research was the impact of early intervention on long-term outcomes. |

**Note**: Attribution is optional - perfect for highlighting text from the current article.

---

### Example 6: Inspirational Quote

| Quote |
|-------|
| The best time to plant a tree was 20 years ago. The second best time is now. |
| *Chinese Proverb* |

---

### Example 7: Technical Quote

| Quote |
|-------|
| There are only two hard things in Computer Science: cache invalidation and naming things. |
| *Phil Karlton* |

---

### Example 8: Multiple Paragraph Quote

You can use multiple paragraphs in the quote cell:

| Quote |
|-------|
| First paragraph of the quote goes here. It can be as long as needed. <br><br> Second paragraph continues the thought. The quotation marks will wrap around all content. |
| *Author Name* |

**Note**: Use `<br><br>` in Google Docs or HTML to create paragraph breaks.

---

## Visual Examples

### What It Looks Like

**Simple quote:**

```
    "The best way to predict the future
     is to invent it."
```

**Quote with attribution:**

```
    "Simplicity is the ultimate
     sophistication."
                    —Leonardo da Vinci
```

**Quote with citation:**

```
    "Programs must be written for people
     to read, and only incidentally for
     machines to execute."
                    —Harold Abelson
```

---

## Tips for Authors

1. **Use italics for author names**: Wrap author names in asterisks `*Author*` to create proper semantic `<cite>` markup.

2. **Attribution is optional**: For pull quotes from your own content, you can omit the second row entirely.

3. **Keep it readable**: Quotes are automatically sized at 120% of normal text and limited to 700px width for optimal readability.

4. **Works everywhere**: The block is fully responsive and works on mobile, tablet, and desktop.

5. **Semantic HTML**: The block uses proper `<blockquote>` and `<cite>` elements for accessibility and SEO.

---

## Common Patterns

### Testimonial Section

Create multiple quote blocks in sequence:

| Quote |
|-------|
| Outstanding service and exceptional results. |
| *Client A* |

| Quote |
|-------|
| Highly recommended for any project. |
| *Client B* |

| Quote |
|-------|
| Professional, reliable, and creative. |
| *Client C* |

---

### Article Pull Quote

Insert between paragraphs to highlight key points:

Regular article text here...

| Quote |
|-------|
| This is the main takeaway from the research. |

More article text continues...

---

## Notes

- **Automatic styling**: Quotation marks and em-dash are added automatically via CSS
- **No configuration needed**: Just add the table - it works out of the box
- **Centered layout**: All quotes are centered with optimal width for readability
- **Accessible**: Uses semantic HTML elements for screen readers and SEO
