# IPynb Viewer - Usage Examples

## Example 1: Basic Notebook Display

### Google Docs Table

| IPynb Viewer |
|--------------|
| /notebooks/example.ipynb |

### Result

Displays the notebook with all cells rendered. Markdown cells show formatted text, code cells show syntax-highlighted code with Run buttons.

---

## Example 2: Notebook with Clickable Link

### Google Docs Table

| IPynb Viewer |
|--------------|
| [Interactive Tutorial](/notebooks/tutorial.ipynb) |

### Result

Same as Example 1, but the path is provided as a clickable link in the authoring environment.

---

## Example 3: Paged Variation - Full-Screen Reading Mode

### Google Docs Table

| IPynb Viewer (paged) |
|----------------------|
| /notebooks/tutorial.ipynb |

### Result

Displays a "Start Reading" button that opens a full-screen overlay showing notebook cells one at a time with Previous/Next navigation, page indicator, and keyboard shortcuts (Arrow Left/Right, Escape).

### Features

- Full-screen immersive reading mode (90% viewport)
- Dark backdrop (95% opacity black) for focus
- Smart cell grouping - Instructions shown with their code
- One page at a time (may contain multiple grouped cells)
- Close button (×) in top-right corner
- Previous/Next navigation buttons at bottom
- Page indicator showing logical pages (e.g., "3 / 8")
- Keyboard shortcuts: Arrow Left/Right for navigation, Escape to close
- No page jumping - overlay stays fixed in viewport
- Scrollable cell content area

### Perfect for

- Step-by-step tutorials
- Interactive presentations
- Guided learning experiences
- Focus-required content
- Mobile-friendly reading

---

## Example 4: Autorun Variation - Automatic Code Execution

### Google Docs Table

| IPynb Viewer (autorun) |
|------------------------|
| /notebooks/demo.ipynb |

### Result

Automatically executes all code cells without requiring Run button clicks. Perfect for demos and presentations where code should execute automatically.

### Features

- Automatic execution runs code cells immediately when displayed
- No Run buttons provides a cleaner, presentation-focused interface
- Output always visible shows results by default without user action
- Works in all modes functions in both default view and paged overlay
- Still interactive users can re-run cells by refreshing or modifying code

### Use Cases

- Live presentations where code should execute automatically
- Demonstrations that don't require user interaction
- Educational content with pre-validated output
- Progressive examples that build on each other

---

## Example 5: Notebook Variation - Complete Educational Experience

### Google Docs Table

| IPynb Viewer (notebook) |
|--------------------------|
| /notebooks/course.ipynb |

### Result

Combines manual and paged modes for the complete educational experience with built-in help system, navigation history, bookmarks, and table of contents.

### Features

- Start Reading button opens paged overlay with manual code execution
- Read the Manual button provides access to block documentation
- Manual execution users click Run buttons to execute code cells (no autorun)
- Close button visible (×) button always visible in paged overlay for easy dismissal
- Navigation tree Hierarchical tree panel for exploring notebook structure
- Navigation history Track and revisit up to 25 recently viewed cells and markdown files
- Bookmarks Save favorite pages to localStorage for quick access
- Help system Built-in help documentation accessible via Help button
- Table of contents Hamburger menu with cell headings and visual dividers
- ESC key support pressing ESC closes the topmost overlay

### Perfect for

- Complete interactive tutorials with documentation
- Educational courses requiring reference material
- Complex demonstrations with help documentation
- Training materials with built-in guides

---

## Example 6: Index Variation - Auto-Open Landing Pages

### Google Docs Table

| IPynb Viewer (index) |
|-----------------------|
| /notebooks/documentation-index.ipynb |

### Result

Automatically opens the notebook overlay without requiring a button click after 100ms. Perfect for landing pages and documentation indexes where the notebook IS the primary content.

### Features

- Auto-open on page load Notebook overlay opens automatically (no button required)
- Instant immersion Users immediately enter reading mode without clicking
- All notebook features Includes navigation tree, bookmarks, history, help, and all controls
- Close button visible Users can exit to see the underlying page content
- Minimal friction Removes the extra click to start reading

### When to Use

- ✅ Use index when the notebook is the primary content
- ✅ Use index for landing pages and documentation indexes
- ✅ Use index when you want immediate engagement
- ❌ Use notebook if the page has other content users should see first
- ❌ Use notebook if users should opt-in to the reading experience

### Use Cases

- Documentation landing pages that should open immediately
- Main index pages for large documentation sites
- Welcome screens that guide users through content
- Single-page apps where the notebook IS the entire experience
- Tutorial launchers that start automatically

---

## Example 7: No-Topbar Variation - Immersive Experience

### Google Docs Table

| IPynb Viewer (paged no-topbar) |
|----------------------------------|
| /notebooks/presentation.ipynb |

### Result

Hides the top bar (title and buttons) for a cleaner, more immersive reading experience. Content extends from top of overlay to pagination controls. Can be combined with any display mode.

### Features

- Hidden top bar No title, buttons, or controls visible at the top
- Maximum content area Content extends from top to pagination controls
- Immersive reading Removes visual distractions for focused content consumption
- ESC key still works Users can still exit using ESC key or backdrop click
- Works with any mode Combine with paged, autorun, notebook, or index

### Combinations

| IPynb Viewer (index no-topbar) | - Auto-opens with no top bar - perfect for immersive landing pages
| IPynb Viewer (notebook no-topbar) | - Full notebook experience with hidden top bar
| IPynb Viewer (paged no-topbar) | - Standard paged mode without the top bar

### Use Cases

- Presentations where you want zero UI distraction
- Kiosk displays or embedded content
- Full-screen immersive experiences
- Content that doesn't need navigation controls
- Minimalist reading experiences

---

## Example 8: Complete Notebook with Metadata

### Google Docs Table

| IPynb Viewer (notebook) |
|--------------------------|
| /notebooks/complete-tutorial.ipynb |

### Notebook File Structure

Create this file at `/notebooks/complete-tutorial.ipynb`:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# 🎯 JavaScript Testing Tutorial\n",
        "\n",
        "**Learn JavaScript fundamentals** through interactive examples.\n",
        "\n",
        "<!-- action-cards -->\n",
        "\n",
        "- [Getting Started](#getting-started)\n",
        "- [Working with Arrays](#working-with-arrays)\n",
        "- [Error Handling](#error-handling)"
      ]
    },
    {
      "cell_type": "markdown",
      "source": [
        "## Getting Started\n",
        "\n",
        "Let's start with a simple calculation:"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Simple calculation\n",
        "const a = 10;\n",
        "const b = 20;\n",
        "console.log('Sum:', a + b);\n",
        "return a + b;"
      ]
    },
    {
      "cell_type": "markdown",
      "source": [
        "## Working with Arrays\n",
        "\n",
        "JavaScript arrays can be manipulated and results displayed inline."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "const numbers = [1, 2, 3, 4, 5];\n",
        "const doubled = numbers.map(n => n * 2);\n",
        "console.log('Original:', numbers);\n",
        "console.log('Doubled:', doubled);\n",
        "return doubled;"
      ]
    },
    {
      "cell_type": "markdown",
      "source": [
        "## Error Handling\n",
        "\n",
        "Errors are caught and displayed with helpful messages."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "try {\n",
        "  const result = undefinedVariable + 1;\n",
        "  return result;\n",
        "} catch (error) {\n",
        "  console.error('Caught error:', error.message);\n",
        "  return 'Error handled!';\n",
        "}"
      ]
    }
  ],
  "metadata": {
    "title": "JavaScript Testing Tutorial",
    "description": "Learn JavaScript fundamentals through interactive examples",
    "author": "Tom Cranstoun",
    "date": "January 22, 2025",
    "version": "1.0",
    "category": "tutorial",
    "difficulty": "beginner",
    "duration": "20 minutes",
    "tags": ["tutorial", "javascript", "interactive", "beginner"],
    "license": "MIT",
    "repo": "https://github.com/ddttom/allaboutV2",
    "help-repo": "https://github.com/ddttom/allaboutV2",
    "github-branch": "main",
    "kernelspec": {
      "display_name": "JavaScript",
      "language": "javascript",
      "name": "jslab"
    }
  }
}
```

### Result

Displays the notebook with:

**Header Section:**
- Title: "JavaScript Testing Tutorial" (large, bold, centered)
- Description: "Learn JavaScript fundamentals through interactive examples" (italic, gray)
- Author: "By Tom Cranstoun" (italic, gray)
- Date: "January 22, 2025" (smaller, light gray)
- Version: "1.0" (bold, gray)
- Meta row badges: Category (blue), Difficulty (orange), Duration (purple)
- Tags: Gray badges for each tag
- License: "MIT" (small, gray)

**Content:**
- Hero cell with title, description, and action cards (auto-wrapped)
- Content cells with headings and code cells (auto-wrapped)
- Action cards automatically styled as blue navigation cards
- Links resolve to matching headings at runtime
- All cells rendered with appropriate styling classes

---

## Example 9: EDS Block Testing Notebook

### Google Docs Table

| IPynb Viewer |
|--------------|
| /notebooks/block-test.ipynb |

### Notebook File Structure

Create this file at `/notebooks/block-test.ipynb`:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# EDS Block Testing\n",
        "\n",
        "Use this notebook to test EDS blocks interactively."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Import helper functions\n",
        "const { testBlock } = await import('/scripts/ipynb-helpers.js');\n",
        "\n",
        "// Test an accordion block\n",
        "const content = '<div><div>Section 1</div><div>Content 1</div></div><div><div>Section 2</div><div>Content 2</div></div>';\n",
        "const block = await testBlock('accordion', content);\n",
        "\n",
        "console.log('Block created:', block);\n",
        "return block.outerHTML;"
      ]
    },
    {
      "cell_type": "markdown",
      "source": [
        "## Visual Preview\n",
        "\n",
        "Open a full-screen overlay to see the block in action:"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Import helper functions\n",
        "const { showPreview } = await import('/scripts/ipynb-helpers.js');\n",
        "\n",
        "// Show visual preview in overlay\n",
        "const content = '<div><div>Section 1</div><div>Content 1</div></div><div><div>Section 2</div><div>Content 2</div></div>';\n",
        "await showPreview('accordion', content);\n",
        "\n",
        "return 'Preview opened! Click close or press ESC to dismiss.';"
      ]
    }
  ],
  "metadata": {
    "title": "EDS Block Testing",
    "author": "Tom Cranstoun",
    "date": "January 22, 2025"
  }
}
```

### Result

Displays an interactive testing environment where you can:
- Test EDS blocks using the testBlock() helper function
- View block HTML output directly in the cell output
- Open full-screen previews using showPreview() helper function
- Test responsive behavior with device view buttons
- Debug block decoration and styling

---

## Example 10: Mathematical Calculations

### Google Docs Table

| IPynb Viewer |
|--------------|
| /notebooks/math-demo.ipynb |

### Notebook File Structure

Create this file at `/notebooks/math-demo.ipynb`:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# Mathematical Calculations\n",
        "\n",
        "Demonstrate JavaScript math capabilities."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Calculate factorial\n",
        "function factorial(n) {\n",
        "  if (n <= 1) return 1;\n",
        "  return n * factorial(n - 1);\n",
        "}\n",
        "\n",
        "const result = factorial(5);\n",
        "console.log('5! =', result);\n",
        "return result;"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Generate Fibonacci sequence\n",
        "function fibonacci(n) {\n",
        "  const seq = [0, 1];\n",
        "  for (let i = 2; i < n; i++) {\n",
        "    seq[i] = seq[i - 1] + seq[i - 2];\n",
        "  }\n",
        "  return seq;\n",
        "}\n",
        "\n",
        "const fib = fibonacci(10);\n",
        "console.log('First 10 Fibonacci numbers:', fib);\n",
        "return fib;"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "// Statistical calculations\n",
        "const data = [12, 15, 18, 20, 22, 25, 28, 30];\n",
        "\n",
        "const sum = data.reduce((a, b) => a + b, 0);\n",
        "const avg = sum / data.length;\n",
        "const min = Math.min(...data);\n",
        "const max = Math.max(...data);\n",
        "\n",
        "console.log('Data:', data);\n",
        "console.log('Sum:', sum);\n",
        "console.log('Average:', avg);\n",
        "console.log('Min:', min);\n",
        "console.log('Max:', max);\n",
        "\n",
        "return { sum, avg, min, max };"
      ]
    }
  ],
  "metadata": {
    "title": "Mathematical Calculations",
    "author": "Tom Cranstoun",
    "date": "January 22, 2025"
  }
}
```

### Result

Displays mathematical demonstrations with:
- Factorial calculation with recursive function
- Fibonacci sequence generation with iterative loop
- Statistical calculations (sum, average, min, max)
- Console output showing intermediate values
- Return values displayed in output areas

---

## How to Use These Examples

1. **Create the notebook file** in your project's `/notebooks/` directory
2. **Add the IPynb Viewer block** to your Google Doc with the path
3. **Publish your page** through EDS
4. **Click Run buttons** to execute code interactively (or use autorun for automatic execution)

## Tips for Creating Notebooks

- Keep code cells focused on single tasks
- Use markdown cells to explain what the code does
- Include error handling in complex code
- Test notebooks locally before deploying
- Use console.log() for debugging output
- Return meaningful values from code cells
- Use action cards for navigation between sections
- Add comprehensive metadata for better context
- Leverage auto-wrapping in notebook mode for cleaner content

## Best Practices

1. **Documentation:** Add markdown cells explaining each step
2. **Error Handling:** Wrap risky operations in try-catch
3. **Console Output:** Use console.log() to show intermediate values
4. **Return Values:** Return results you want displayed
5. **Code Organization:** Keep cells short and focused
6. **Testing:** Verify notebooks work before sharing
7. **Metadata:** Include title, author, date, and tags for discoverability
8. **Navigation:** Use action cards and hash links for better user experience
9. **Styling:** Use auto-wrapping or reusable CSS classes for consistent appearance
10. **Help System:** Add help-repo metadata for built-in documentation access

## Advanced Use Cases

### Interactive Tutorials

Create step-by-step coding tutorials where users execute each step. Use paged variation for focused, linear learning experiences with smart cell grouping.

### Data Exploration

Allow users to run calculations and see results without backend code. Perfect for demonstrations, visualizations, and exploratory data analysis.

### Documentation with Examples

Combine explanatory text with runnable code examples. Use notebook variation with help system for complete documentation experience.

### Testing Tools

Provide interactive testing utilities for your EDS blocks using testBlock() and showPreview() helper functions.

### Educational Content

Teach JavaScript concepts with executable examples. Use auto-wrapping for clean markdown authoring and action cards for navigation.

### Presentation Mode

Use paged variation with no-topbar for immersive presentations. Combine with autorun for automatic code execution during demos.

### Landing Pages

Use index variation to automatically open documentation indexes and welcome screens. Perfect for single-page app experiences.
