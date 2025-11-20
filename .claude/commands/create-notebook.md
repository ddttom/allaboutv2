---
description: Create educational and interactive Jupyter notebooks as SPAs from text content, topics, or concepts. Guides through topic selection, structure planning, content organization, and notebook generation with proper markdown and code cells for display via ipynb-viewer block.
---

# Create Educational Jupyter Notebook

You are helping to create an educational Jupyter notebook designed as an interactive SPA (Single Page Application) to be displayed via the ipynb-viewer block.

## Purpose

This command helps you transform text content, explain topics, or create interactive tutorials as engaging Jupyter notebooks meant for end users, learners, and clients—not for testing EDS blocks.

## Context

The user wants to create a notebook that:
- **Explains or illustrates** concepts, ideas, or topics
- **Engages readers** with interactive code demonstrations
- **Teaches progressively** from simple to complex
- **Displays beautifully** via ipynb-viewer block as an SPA

This is different from testing notebooks, which focus on block decoration testing.

## Related Resources

For comprehensive guidance, see the `jupyter-educational-notebook` skill which includes:
- **SKILL.md** - Complete educational notebook creation guidance
- **EXAMPLES.md** - Real notebook patterns (blog, tutorial, reference, demo)
- **TEMPLATES.md** - Copy-paste templates for different notebook types
- **CONTENT_PATTERNS.md** - Content organization strategies

## Your Task

Guide the user through creating an educational notebook by following these steps:

### Step 1: Understand the Goal

Ask clarifying questions to understand what the user wants to create:

**Questions to ask:**
1. **What topic or content** should this notebook cover?
   - Do they have existing text/article to transform?
   - Are they explaining a specific concept?
   - Are they teaching a skill or process?

2. **Who is the target audience?**
   - End users/clients?
   - Learners/students?
   - Team members?
   - General public?

3. **What notebook type** are they aiming for?
   - **Blog post** - Engaging content with shareability
   - **Tutorial** - Step-by-step learning
   - **Concept explanation** - Deep dive into one topic
   - **Reference guide** - Quick lookup documentation
   - **Interactive demo** - Showcase capabilities quickly

4. **What should the notebook include?**
   - Pure JavaScript examples?
   - EDS block demonstrations?
   - Interactive calculations?
   - Visual comparisons?

### Step 2: Analyze Source Content (if provided)

If the user provides existing text content:

1. **Identify main topics** - What are the 3-5 key themes?
2. **Find natural sections** - Where are the logical breaking points?
3. **Spot examples** - What can be demonstrated with code?
4. **Determine structure** - What pattern fits? (Linear, modular, problem-solution)

### Step 3: Plan the Notebook Structure

Based on the notebook type, plan the structure:

**Blog Post Pattern (30-45 cells):**
```
Cell 1: Title and Introduction
Cell 2: Table of Contents
Cells 3-40: Progressive Parts (Part 1 through Part 8)
Cell 41: Call-to-Action/Contact
```

**Tutorial Pattern (20-30 cells):**
```
Cell 1: Tutorial Header with Objectives
Cell 2: Table of Contents
Part 1: Foundation (3-5 cells)
Part 2: Building (5-7 cells)
Part 3: Testing (3-5 cells)
Part 4: Advanced (3-5 cells)
Summary: (2-3 cells)
```

**Concept Explanation Pattern (15-25 cells):**
```
Cell 1: Concept Header
Cell 2: Problem/Solution Introduction
Cell 3-10: How It Works (alternating markdown/code)
Cell 11-15: Technical Details
Cell 16-20: Best Practices
Cell 21-25: Summary
```

**Reference Guide Pattern (25-40 cells):**
```
Cell 1: Reference Header with Quick Reference Table
Cell 2: Table of Contents
Cells 3-35: Function/Feature Documentation (markdown + code pairs)
Cells 36-40: Summary and Patterns
```

**Interactive Demo Pattern (15-20 cells):**
```
Cell 1: Demo Introduction
Cells 2-15: Quick Demonstrations (mostly code)
Cells 16-18: Experimentation Prompt
Cells 19-20: Next Steps
```

### Step 4: Structure the Content

Organize content following these principles:

**Progressive Disclosure:**
- Part 1: Simple introduction
- Part 2-4: Core content (building complexity)
- Part 5: Summary and next steps

**Content Balance:**
- **Blog/Tutorial:** 60-70% markdown, 30-40% code
- **Concept Explanation:** 55% markdown, 45% code
- **Reference Guide:** 40% markdown, 60% code
- **Demo:** 30% markdown, 70% code

**Engagement Elements:**
- Emojis in section headers (sparingly)
- Tables for comparisons
- Rhetorical questions
- "Try it yourself" moments
- Progressive examples (simple → complete → advanced)

### Step 5: Create the Notebook

Use the NotebookEdit tool to create the .ipynb file with this structure:

**Cell 0 (Markdown) - Title:**
```markdown
# [Emoji] [Title]

[Hook sentence explaining what this is about]

## What is [Topic]?

[2-3 sentences of explanation]

[Benefits with emoji bullets]

## How to Use This [Notebook Type]

[Instructions for readers]

Let's get started! 🚀
```

**Cell 1 (Markdown) - Table of Contents:**
```markdown
## 📋 Table of Contents

- [Part 1: Introduction](#part-1-introduction)
- [Part 2: [Topic]](#part-2-topic)
- [Part 3: [Topic]](#part-3-topic)
- [Resources & Next Steps](#resources-next-steps)
```

**CRITICAL - Hash Link Format:**
- TOC links MUST match h2 header IDs exactly
- IDs are auto-generated from h2 text:
  1. Lowercase
  2. Special chars removed (emojis, punctuation)
  3. Spaces → hyphens
  4. Leading/trailing hyphens removed
- Examples:
  - `## 🚀 Part 1: Introduction` → `#part-1-introduction`
  - `## Resources & Next Steps` → `#resources-next-steps`
  - `## What's New?` → `#whats-new`

**Cell 2 (Markdown) - Part 1 Introduction:**
```markdown
## 🚀 Part 1: [Section Title]

[Explanation paragraph]

### [Subsection]

[Content with context]

[Transition to example]
```

**Cell 3 (Code) - First Example:**
```javascript
// [Clear description of what this demonstrates]
const [variable] = '[value]';

console.log('[descriptive output]:', [variable]);

return [result];
```

**Continue pattern** of alternating markdown explanations with code demonstrations.

**Final Cells - Summary:**
```markdown
## 🎉 [Conclusion/Summary]

What you learned:
✅ [Point 1]
✅ [Point 2]
✅ [Point 3]

### Next Steps

1. **[Action 1]** - [Description]
2. **[Action 2]** - [Description]

### Resources

- [Link 1](#)
- [Link 2](#)
```

### Step 6: Auto-Wrapping in Notebook Mode (NEW)

**When using notebook variation** (`| IPynb Viewer (notebook) |`), you can write **pure markdown** without HTML wrappers! The viewer automatically detects cell types and applies styling.

**Cell Type Detection:**
- **Hero Cell** - First cell (index 0) with `# ` heading → `ipynb-hero-cell`
- **Intro Cell** - Early cells (index ≤ 2) with `## ` heading → `ipynb-content-card` (thick 6px border)
- **Transition Cell** - Short cells (≤3 lines) without headers → `ipynb-transition-card`
- **Content Cell** - All other cells → `ipynb-content-card-thin` (thin 4px border)

**Pure Markdown Example:**
```markdown
# 🎯 Tutorial Title

**Compelling tagline** with additional context

## What You'll Learn

Key concepts and outcomes

---

This is a transition between sections
```

Automatically becomes styled with appropriate divs and classes!

**Benefits:**
- ✅ 90% less code to write
- ✅ Focus on content, not styling
- ✅ Consistent visual presentation
- ✅ Backward compatible with HTML wrappers

**When to use auto-wrapping:**
- Notebook mode (`| IPynb Viewer (notebook) |`)
- Simple content structure
- Fast authoring priority
- Works for BOTH educational AND presentation style notebooks

**When to use manual HTML:**
- Other display modes (paged, autorun, basic)
- Custom styling requirements
- Complex layouts with nested blocks
- Works for BOTH educational AND presentation style notebooks

**Mixing both approaches:**
You can combine auto-wrapping with custom HTML in the same notebook:
- Most cells use pure markdown (auto-wrapped for speed)
- Specific cells use custom HTML for special styling
- Example: Add custom gradient or color to highlight a particular section

```markdown
<!-- Custom HTML for this specific cell -->
<div style="background: #f0f9ff; border-left: 6px solid #3b82f6; padding: 32px; margin: 0; border-radius: 12px;">

## Special Highlighted Section

This cell has custom blue styling to draw attention

</div>
```

**Note:** "Presentation" = non-interactive (no runnable code cells), NOT a display mode. Both educational (interactive code) and presentation (non-interactive) notebooks can use either styling approach.

### Step 7: Code Cell Patterns

Use appropriate code patterns based on what's being demonstrated:

**Visual Block Demonstrations (RECOMMENDED for educational content):**
```javascript
// Use showPreview to create beautiful overlay displays
const { showPreview } = await import('/scripts/ipynb-helpers.js');

const content = '<div><div>[Title/Option 1]</div><div>[Content 1]</div><div>[Title/Option 2]</div><div>[Content 2]</div></div>';

console.log('✨ Displaying visual demonstration...');
await showPreview('[blockname]', content);

return '✓ Visual preview displayed';
```

**Available blocks for demonstrations:**
- `accordion` - Collapsible Q&A, comparisons, before/after
- `cards` - Feature showcases, pro tips, categories
- `tabs` - Tutorial steps, multiple options, variations
- `grid` - Organized layouts, multiple examples
- `table` - Data comparisons, specifications
- `hero` - Key messages, important highlights
- `quote` - Inspirational text, key insights
- `code-expander` - Expandable code examples

**Pure JavaScript Examples:**
```javascript
// Use for general programming concepts
const data = [1, 2, 3, 4, 5];
const doubled = data.map(x => x * 2);

console.log('Original:', data);
console.log('Doubled:', doubled);

return { original: data, doubled };
```

**Interactive Exploration:**
```javascript
// Encourage users to modify values
const yourName = 'World';  // Change this
const emoji = '👋';        // Try different emojis

const greeting = emoji + ' Hello, ' + yourName;
console.log(greeting);

return greeting;
```

**Combining Interactivity with Visual Display:**
```javascript
const { showPreview } = await import('/scripts/ipynb-helpers.js');

// Users can modify these
const option1 = 'First choice';
const option2 = 'Second choice';

const content = '<div><div>Option 1</div><div>' + option1 + '</div><div>Option 2</div><div>' + option2 + '</div></div>';

await showPreview('tabs', content);
return 'Try modifying the options above!';
```

### Step 8: Markdown Best Practices

**Headers with Emojis:**
```markdown
## 🚀 Getting Started
## 💡 Key Insight
## ⚠️ Common Pitfall
## ✅ Best Practice
```

**Tables for Comparisons:**
```markdown
| Feature | Before | After |
|---------|--------|-------|
| Speed | Slow | Fast |
| Code | Complex | Simple |
```

**Lists for Key Points:**
```markdown
**Benefits:**
✅ Easy to use
✅ Fast performance
✅ Great documentation
```

**Code Blocks in Markdown (not executable):**

Use triple backticks in markdown cells for syntax examples that won't execute:
- Start with three backticks and optional language name
- Add your code example
- End with three backticks
- These appear formatted but aren't executable

### Step 9: Finalize and Save

1. **Name the file** - Use descriptive name: `topic-tutorial.ipynb` not `test.ipynb`
2. **Save location** - Root directory or appropriate subfolder
3. **Add metadata** (REQUIRED):
   ```json
   {
     "metadata": {
       "title": "{{GENERATE A GOOD TITLE}}",
       "description": "{{GENERATE A ONE-LINE DESCRIPTION THAT AMPLIFIES THE TITLE}}",
       "author": "{{PICK AUTHOR NAME}}",
       "date": "{{DATE OF FIRST EDIT}}",
       "version": "{{INCREASING WITH EVERY EDIT}}",
       "category": "{{tutorial|reference|demo|concept}}",
       "difficulty": "{{beginner|intermediate|advanced}}",
       "duration": "{{ESTIMATED READING TIME}}",
       "tags": ["tutorial", "javascript", "notebook", "interactive"],
       "license": "MIT"
     }
   }
   ```

   **Field guide:**
   - **Required**: title, description, author, date, version, tags
   - **Optional but recommended**: category, difficulty, duration, license
   - **Display**: Color-coded badges (category=blue, difficulty=orange, duration=purple) and gray tag pills

   **Example:**
   ```json
   {
     "metadata": {
       "title": "The Art of Jupyter Notebooks",
       "description": "A meta-tutorial teaching you how to create engaging, educational notebooks by being one itself",
       "author": "{{PICK AUTHOR NAME}}",
       "date": "2025-01-17",
       "version": "1.4",
       "category": "tutorial",
       "difficulty": "intermediate",
       "duration": "25 minutes",
       "tags": ["tutorial", "javascript", "notebook", "interactive", "educational"],
       "license": "MIT"
     }
   }
   ```

### Step 10: Provide Usage Instructions

After creating the notebook, tell the user:

**How to view:**
```markdown
Add this to your Google Doc:

Basic mode (all cells visible):
| IPynb Viewer |
|--------------|
| /your-notebook.ipynb |

Paged mode (full-screen overlay navigation):
| IPynb Viewer (paged) |
|----------------------|
| /your-notebook.ipynb |

Autorun mode (code executes automatically):
| IPynb Viewer (autorun) |
|------------------------|
| /your-notebook.ipynb |

Notebook mode (complete educational experience):
| IPynb Viewer (notebook) |
|--------------------------|
| /your-notebook.ipynb |
```

**Display mode recommendations:**
- **Basic mode**: Reference guides, quick scanning
- **Paged mode**: Tutorials, step-by-step learning
- **Autorun mode**: Live demonstrations, presentations
- **Notebook mode**: Complete courses with reference docs

**Link navigation:**
All paged modes support hash link navigation:
```markdown
[Jump to Part 3](#part-3)
[See Advanced Topics](#advanced-topics)
```

**How to test locally:**
1. Open the .ipynb file in VS Code with Jupyter extension
2. Click cells to preview markdown
3. Run code cells to test functionality
4. Verify flow and readability

**How to share:**
- Deploy to EDS site
- Share the URL
- Recipients can run code cells interactively
- No installation required for viewers

## Key Principles

**Educational vs Testing:**
- ✅ Focus on explaining and teaching
- ✅ Use engaging, accessible language
- ✅ 60% markdown, 40% code (typically)
- ✅ Progressive complexity
- ❌ Not for testing blocks (use jupyter-notebook-testing skill)
- ❌ Not for debugging
- ❌ Not technical verification

**Content Quality:**
- Start with a hook
- Build complexity gradually
- Pair explanations with demonstrations
- Use console.log() for visibility
- Return meaningful values
- Add "try it yourself" moments

**Structure:**
- Always include Table of Contents
- Use clear part/section headers
- Maintain narrative flow
- End with summary and next steps

## Templates Available

Direct users to TEMPLATES.md for ready-to-use patterns:
- Blog Post Template
- Tutorial Template
- Concept Explanation Template
- Reference Guide Template
- Quick Demo Template

## Need More Help?

For detailed guidance on any aspect:
- **Structure patterns** → EXAMPLES.md in jupyter-educational-notebook skill
- **Content organization** → CONTENT_PATTERNS.md in jupyter-educational-notebook skill
- **Complete examples** → See blog.ipynb and explain.ipynb in project root
- **Display options** → blocks/ipynb-viewer/README.md

---

Now proceed to help the user create their educational notebook. Start by asking clarifying questions to understand their needs, then guide them through the creation process step by step.
