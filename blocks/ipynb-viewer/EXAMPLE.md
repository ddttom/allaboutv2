# IPynb Viewer - Usage Examples

## Example 1: Basic Notebook Display

### Google Docs Table

| IPynb Viewer |
|--------------|
| /notebooks/example.ipynb |

### Result

Displays the notebook with all cells rendered. Markdown cells show formatted text, code cells show syntax-highlighted code with Run buttons.

---

## Example 2: With Link

### Google Docs Table

| IPynb Viewer |
|--------------|
| [Interactive Tutorial](/notebooks/tutorial.ipynb) |

### Result

Same as Example 1, but the path is provided as a clickable link in the authoring environment.

---

## Example 3: Sample Notebook Content

### Create this file: `/notebooks/example.ipynb`

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# JavaScript Testing Example\n",
        "\n",
        "This notebook demonstrates **interactive JavaScript** execution in EDS.\n",
        "\n",
        "Click the **Run** button on any code cell to execute it."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
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
      "metadata": {},
      "source": [
        "## Working with Arrays\n",
        "\n",
        "JavaScript arrays can be manipulated and results displayed inline."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
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
      "metadata": {},
      "source": [
        "## Error Handling\n",
        "\n",
        "Errors are caught and displayed with helpful messages."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "try {\n",
        "  // This will cause an error\n",
        "  const result = undefinedVariable + 1;\n",
        "  return result;\n",
        "} catch (error) {\n",
        "  console.error('Caught error:', error.message);\n",
        "  return 'Error handled!';\n",
        "}"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## DOM Manipulation\n",
        "\n",
        "You can interact with the page DOM (use with caution)."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "// Query DOM elements\n",
        "const blockCount = document.querySelectorAll('.block').length;\n",
        "console.log('Number of blocks on page:', blockCount);\n",
        "return blockCount;"
      ]
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "JavaScript (Node.js)",
      "language": "javascript",
      "name": "javascript"
    },
    "language_info": {
      "name": "javascript",
      "version": "14.0.0"
    },
    "title": "JavaScript Testing Example"
  },
  "nbformat": 4,
  "nbformat_minor": 4
}
```

---

## Example 4: EDS Block Testing Notebook

### Create this file: `/notebooks/block-test.ipynb`

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# EDS Block Testing\n",
        "\n",
        "Use this notebook to test EDS blocks interactively."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "// Find all blocks on the page\n",
        "const blocks = document.querySelectorAll('.block');\n",
        "console.log('Total blocks:', blocks.length);\n",
        "\n",
        "blocks.forEach((block, index) => {\n",
        "  console.log(`Block ${index + 1}:`, block.className);\n",
        "});\n",
        "\n",
        "return `Found ${blocks.length} blocks`;"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## Check Block Properties"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "// Inspect the first block\n",
        "const firstBlock = document.querySelector('.block');\n",
        "\n",
        "if (firstBlock) {\n",
        "  const info = {\n",
        "    className: firstBlock.className,\n",
        "    childCount: firstBlock.children.length,\n",
        "    hasDataAttributes: Object.keys(firstBlock.dataset).length > 0\n",
        "  };\n",
        "  \n",
        "  console.log('Block info:', info);\n",
        "  return info;\n",
        "} else {\n",
        "  console.log('No blocks found');\n",
        "  return null;\n",
        "}"
      ]
    }
  ],
  "metadata": {
    "title": "EDS Block Testing"
  }
}
```

---

## Example 5: Mathematical Calculations

### Create this file: `/notebooks/math-demo.ipynb`

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# Mathematical Calculations\n",
        "\n",
        "Demonstrate JavaScript math capabilities."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
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
      "metadata": {},
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
      "metadata": {},
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
    "title": "Mathematical Calculations"
  }
}
```

---

## Example 6: String Manipulation

### Create this file: `/notebooks/strings.ipynb`

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# String Manipulation Examples\n",
        "\n",
        "Working with text in JavaScript."
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "// Text transformations\n",
        "const text = 'hello world from javascript';\n",
        "\n",
        "console.log('Original:', text);\n",
        "console.log('Uppercase:', text.toUpperCase());\n",
        "console.log('Title Case:', text.replace(/\\b\\w/g, c => c.toUpperCase()));\n",
        "console.log('Reversed:', text.split('').reverse().join(''));\n",
        "\n",
        "return text.toUpperCase();"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": [
        "// Word counting\n",
        "const paragraph = 'This is a sample paragraph. It has multiple sentences. Let\\'s count the words!';\n",
        "\n",
        "const wordCount = paragraph.split(/\\s+/).length;\n",
        "const sentenceCount = paragraph.split(/[.!?]+/).filter(s => s.trim()).length;\n",
        "const charCount = paragraph.length;\n",
        "\n",
        "console.log('Words:', wordCount);\n",
        "console.log('Sentences:', sentenceCount);\n",
        "console.log('Characters:', charCount);\n",
        "\n",
        "return { wordCount, sentenceCount, charCount };"
      ]
    }
  ],
  "metadata": {
    "title": "String Manipulation"
  }
}
```

---

## How to Use These Examples

1. **Create the notebook file** in your project's `/notebooks/` directory
2. **Add the IPynb Viewer block** to your Google Doc with the path
3. **Publish your page** through EDS
4. **Click Run buttons** to execute code interactively

## Tips for Creating Notebooks

- Keep code cells focused on single tasks
- Use markdown cells to explain what the code does
- Include error handling in complex code
- Test notebooks locally before deploying
- Use console.log() for debugging output
- Return meaningful values from code cells

## Best Practices

1. **Documentation**: Add markdown cells explaining each step
2. **Error Handling**: Wrap risky operations in try-catch
3. **Console Output**: Use console.log() to show intermediate values
4. **Return Values**: Return results you want displayed
5. **Code Organization**: Keep cells short and focused
6. **Testing**: Verify notebooks work before sharing

## Advanced Use Cases

### Interactive Tutorials
Create step-by-step coding tutorials where users execute each step.

### Data Exploration
Allow users to run calculations and see results without backend code.

### Documentation with Examples
Combine explanatory text with runnable code examples.

### Testing Tools
Provide interactive testing utilities for your EDS blocks.

### Educational Content
Teach JavaScript concepts with executable examples.
