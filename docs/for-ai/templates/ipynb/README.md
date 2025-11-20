# Jupyter Notebook Templates

This directory contains templates for creating different types of Jupyter notebooks in the AllAboutV2 project.

## Available Templates

### 1. [presentation-template.ipynb](presentation-template.ipynb)

**Purpose:** Create visually consistent presentation notebooks for client demos, showcases, and documentation.

**Features:**
- ✅ Complete visual consistency with established standards
- ✅ Blue gradient backgrounds on all cells
- ✅ HTML headings with explicit colors (`#0d47a1`)
- ✅ All text styled with `color: #212121` to prevent fading
- ✅ EDS blocks (cards, accordion, tabs) properly wrapped
- ✅ No vertical margins (prevents black gaps)
- ✅ Interactive table of contents with hash links

**Use When:**
- Creating client presentations
- Building product showcases
- Creating documentation presentations
- Making marketing materials
- Building training slides

**Structure:**
- 8 ready-to-use cells
- Hero title, introduction, table of contents
- Example sections with cards, accordion, and tabs blocks
- Conclusion with key takeaways

**See Also:**
- [docs/for-ai/explaining-presentation-notebooks.md](../../explaining-presentation-notebooks.md)
- [.claude/skills/create-presentation/SKILL.md](../../../../.claude/skills/create-presentation/SKILL.md)
- [.claude/commands/create-presentation.md](../../../../.claude/commands/create-presentation.md)

---

### 2. [educational-template.ipynb](educational-template.ipynb)

**Purpose:** Create interactive educational notebooks for tutorials, guides, and teaching materials.

**Features:**
- ✅ Clear learning objectives and prerequisites
- ✅ Step-by-step progressive structure
- ✅ Executable code cells for hands-on practice
- ✅ Exercise sections with hints
- ✅ "What just happened?" explanations after code
- ✅ Advanced topics for deeper learning

**Use When:**
- Creating tutorials for learners
- Building interactive courses
- Writing educational blog posts
- Creating onboarding materials
- Teaching technical concepts

**Structure:**
- Introduction with learning objectives
- Basic concepts with examples
- Hands-on exercises
- Advanced topics
- Conclusion with next steps

**See Also:**
- [docs/for-ai/explaining-educational-notebooks.md](../../explaining-educational-notebooks.md)
- [.claude/skills/jupyter-educational-notebook/SKILL.md](../../../../.claude/skills/jupyter-educational-notebook/SKILL.md)
- [.claude/commands/create-notebook.md](../../../../.claude/commands/create-notebook.md)

---

### 3. [unstyled-template.ipynb](unstyled-template.ipynb)

**Purpose:** Create basic notebooks without custom styling for quick prototyping and testing.

**Features:**
- ✅ Simple markdown and code cells
- ✅ Basic structure with table of contents
- ✅ No custom styling (uses default rendering)
- ✅ Minimal metadata
- ✅ Quick to customize

**Use When:**
- Quick prototyping and experimentation
- Testing EDS blocks without styling
- Creating internal documentation
- Building test cases
- Rapid iteration

**Structure:**
- Simple title and description
- Table of contents
- Content sections with markdown and code
- Basic conclusion

**See Also:**
- [test.ipynb](../../../../test.ipynb) - Example testing notebook
- [docs/for-ai/explaining-jupyter.md](../../explaining-jupyter.md)

---

## Action Cards for Navigation

**NEW:** Create beautiful navigation links using action cards with smart linking:

```markdown
# Getting Started Guide

Learn step by step through these topics.

<!-- action-cards -->

- [Installation](#)
- [Your First Block](#)
- [Advanced Topics](#)
```

**How it works:**
1. Add `<!-- action-cards -->` HTML comment in your markdown cell
2. Follow with a markdown list of links using `(#)` as placeholder
3. Write link text that matches heading text somewhere in your notebook
4. **Links are automatically resolved at runtime** - JavaScript searches all cells for matching headings and updates hrefs
5. All cards use consistent blue styling

**Important:** The `<!-- action-cards -->` marker only applies to the **first list** that follows it. Any subsequent lists in the same cell will remain as normal bullet lists.

**Example:**
```markdown
<!-- In hero cell -->
- [Installation](#)  <!-- Will find "## Installation" or "### Installation Guide" -->
- [Basic Concepts](#)  <!-- Will find "## Part 1: Basic Concepts" -->
```

The link text doesn't need to match exactly - it searches for headings that *contain* your link text.

**Best Practices:**
- ✅ Use specific link text: `[Part 1: Introduction](#)` instead of just `[Introduction](#)`
- ✅ Make link text unique to avoid ambiguity
- ⚠️ If multiple headings match, it picks the **first one found** (in cell order)
- 💡 Tip: Use part numbers or descriptive prefixes to ensure unique matches

**Features:**
- ✅ Pure markdown - no HTML required
- ✅ Works in any cell type (hero, content, intro, transition)
- ✅ **Smart link resolution** - No hardcoded cell IDs needed
- ✅ Automatically finds matching headings at runtime
- ✅ Consistent blue design - professional appearance
- ✅ Perfect for hero cells and section navigation

**When to use:**
- Hero cells with navigation options
- Section introductions linking to parts
- Tutorial navigation between chapters
- Multi-part content flow
- Quick reference navigation

---

## How to Use These Templates

### Option 1: Copy Template Directly

```bash
# For presentations
cp docs/for-ai/templates/ipynb/presentation-template.ipynb my-presentation.ipynb

# For educational notebooks
cp docs/for-ai/templates/ipynb/educational-template.ipynb my-tutorial.ipynb

# For unstyled/testing
cp docs/for-ai/templates/ipynb/unstyled-template.ipynb my-notebook.ipynb
```

### Option 2: Use Slash Commands

**For presentations:**
```
/create-presentation "Your Topic"
```

**For educational notebooks:**
```
/create-notebook
```

### Option 3: Use Skills Directly

**For presentations:**
```
Use the create-presentation skill to create a presentation about [topic]
```

**For educational notebooks:**
```
Use the jupyter-educational-notebook skill to create a tutorial about [topic]
```

---

## Visual Consistency Standards (Presentations Only)

**CRITICAL:** All presentation notebooks MUST follow these standards:

### Colors
- **Headings:** `#0d47a1` (dark blue)
- **Text:** `#212121` (dark grey)
- **Border:** `#0288d1` (blue)
- **Background:** `linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)`

### Typography
- **H2:** `color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;`
- **H3:** `color: #0d47a1; font-size: 26px; font-weight: 700; margin-bottom: 16px;`
- **Body:** `color: #212121;`

### Layout
- **Margins:** `margin: 0 0;` (no vertical gaps)
- **Padding:** `padding: 32px;`
- **Border radius:** `border-radius: 12px;`
- **Border:** `border-left: 6px solid #0288d1;`

### Critical Rules
1. ✅ Use HTML headings, NOT markdown (`##`, `###`)
2. ✅ Wrap EDS blocks INSIDE styled containers
3. ✅ Include `color: #212121` on all gradient divs
4. ❌ No vertical margins (creates black gaps)
5. ❌ No markdown headings (render grey)

---

## Template Comparison

| Feature | Presentation | Educational | Unstyled |
|---------|-------------|-------------|----------|
| **Custom Styling** | ✅ Full | ❌ None | ❌ None |
| **Executable Code** | ❌ No | ✅ Yes | ✅ Yes |
| **EDS Blocks** | ✅ Yes | ⚠️ Optional | ⚠️ Optional |
| **Visual Consistency** | ✅ Required | ⚠️ Optional | ❌ Not needed |
| **Exercises** | ❌ No | ✅ Yes | ⚠️ Optional |
| **Best For** | Demos, showcases | Tutorials, courses | Testing, prototyping |
| **Audience** | Clients, stakeholders | Learners, students | Developers |

---

## Example Notebooks

**Presentation Examples:**
- [docs-navigation-v3.ipynb](../../../../docs-navigation-v3.ipynb) - Perfect visual consistency example

**Educational Examples:**
- [blog.ipynb](../../../../blog.ipynb) - Educational blog post (41 cells)
- [education.ipynb](../../../../education.ipynb) - Tutorial notebook

**Unstyled Examples:**
- [test.ipynb](../../../../test.ipynb) - Testing notebook for EDS blocks

---

## Related Documentation

- **Presentation Notebooks:** [explaining-presentation-notebooks.md](../../explaining-presentation-notebooks.md)
- **Educational Notebooks:** [explaining-educational-notebooks.md](../../explaining-educational-notebooks.md)
- **Jupyter Testing:** [explaining-jupyter.md](../../explaining-jupyter.md)
- **EDS Blocks:** [eds.md](../../eds.md)
- **ipynb-viewer Block:** [blocks/ipynb-viewer/README.md](../../../../blocks/ipynb-viewer/README.md)

---

## Getting Help

### Commands
- `/create-presentation` - Create styled presentation notebook
- `/create-notebook` - Create interactive educational notebook
- `/jupyter-notebook` - Create testing notebook

### Skills
- `create-presentation` - Presentation creation assistance
- `jupyter-educational-notebook` - Educational notebook guidance
- `jupyter-notebook-testing` - Testing notebook help

### Documentation
- See `docs/for-ai/` directory for comprehensive guides
- See `.claude/skills/` for detailed skill documentation
- See `.claude/commands/` for slash command references

---

**Last Updated:** 2025-01-19
