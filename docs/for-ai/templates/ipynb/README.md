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

### 4. [navigation-template.ipynb](navigation-template.ipynb)

**Purpose:** Create comprehensive navigation notebooks for complex documentation systems using multi-paradigm navigation.

**Features:**
- ✅ Multi-paradigm navigation (role + task + workflow + category)
- ✅ Progressive disclosure with part summaries
- ✅ Emergency navigation for urgent problems
- ✅ Search keywords guide
- ✅ Action cards for non-linear exploration
- ✅ Progress indicators and reading time estimates
- ✅ Icon legend for visual clarity
- ✅ Troubleshooting section
- ✅ Universal patterns for applying to other projects

**Use When:**
- Documenting complex systems (20+ documents)
- Creating navigation for multiple audiences (4+ roles)
- Building documentation hubs
- Creating learning path systems
- Organizing large documentation sets
- Teaching documentation architecture patterns

**Structure:**
- Hero cell with main action cards
- Table of Contents with time estimates
- Emergency navigation (quick fixes)
- Essential bookmarks highlight
- Search keywords guide
- Icon legend
- Part 1: Overview (documentation ecosystem)
- Part 2: By Role (role-based learning paths)
- Part 3: By Task (task-based guides)
- Part 4: By Workflow (development phases)
- Part 5: By Category (browse all docs)
- Part 6: Pro Tips (expert navigation strategies)
- Part 7: Universal Patterns (apply anywhere)
- Troubleshooting section
- Final reflection (living documentation principles)

**Navigation Paradigms:**
1. **Role-Based** - "I'm a [Developer/Architect/PM/etc.]"
2. **Task-Based** - "I need to build/test/deploy X"
3. **Workflow-Based** - "I'm in the [planning/development/testing] phase"
4. **Category-Based** - "Browse all [implementation/testing/guidelines] docs"

**Living Documentation Principles:**
- Executable truth (validated links and structure)
- Self-verification (action cards validate headings exist)
- Multi-audience design (6+ distinct roles)
- Multi-modal navigation (4 ways to find information)

**When NOT to Use:**
- Simple documentation (< 10 documents)
- Single-audience documentation
- Linear learning paths
- Quick reference guides

**Best Practices:**
- ✅ Include emergency navigation section for urgent problems
- ✅ Add progress indicators (🔵🔵🔵⚪⚪⚪) and reading time estimates
- ✅ Create part summaries after each major section
- ✅ Add final closing cell thanking users and reinforcing key takeaways
- ✅ Use action cards for non-linear navigation
- ✅ Include troubleshooting section for common issues

**See Also:**
- [docs-navigation.ipynb](../../../../docs-navigation.ipynb) - Real-world example (66 cells, 26 docs, complete with closing)
- [docs/for-ai/document-relationship-mapping.md](../../document-relationship-mapping.md) - Cross-reference strategy
- [docs/for-ai/navigation-flows.md](../../navigation-flows.md) - Decision trees
- [docs/for-ai/explaining-educational-notebooks.md](../../explaining-educational-notebooks.md) - Notebook creation guide

**How to Adapt:**
1. Define your documentation domains and categories
2. Identify 4-6 distinct user roles
3. Map 5-8 common tasks
4. Define your workflow phases (typically 4-6)
5. Customize parts and action cards
6. Add role-specific learning paths
7. Create task-specific quick references
8. Add pro tips relevant to your system
9. Add final closing cell with thank you and key takeaways
10. Update all placeholder text with your actual content

---

## Closing Cell Pattern

**Best Practice:** Every navigation notebook should end with a proper closing cell that:

1. **Thanks the user** - Acknowledge their time and effort
2. **Summarizes achievements** - List what they've learned
3. **Provides quick reminders** - Key bookmarks and commands
4. **Encourages action** - "Happy building!" or similar
5. **Attributes the system** - Footer line crediting the documentation system

**Example Structure:**
```markdown
## 📖 End of Documentation Navigator

**Thank you for exploring this guide!**

You've completed the full journey through [System Name]. You now have:

✅ Understanding of all [N] documentation categories
✅ Role-based, task-based, and workflow-based strategies
✅ Knowledge of [N] pro tips

**Quick reminders:**
- Bookmark [doc1.md], [doc2.md], [doc3.md]
- Use commands/tools as needed
- Return when you need guidance

**Happy building! 🚀**

---

*This Documentation Navigator is part of [Project Name].*
```

**Why This Matters:**
- ✅ Provides psychological closure
- ✅ Reinforces key takeaways when fresh in memory
- ✅ Encourages bookmarking essential resources
- ✅ Sets positive tone for applying what was learned
- ✅ Creates sense of completion and achievement

**See Examples:**
- [docs-navigation.ipynb](../../../../docs-navigation.ipynb) - Cell at end after "Remember - This IS Living Documentation"
- [navigation-template.ipynb](navigation-template.ipynb) - Includes example closing cell

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

# For documentation navigation
cp docs/for-ai/templates/ipynb/navigation-template.ipynb my-docs-nav.ipynb

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

| Feature | Presentation | Educational | Navigation | Unstyled |
|---------|-------------|-------------|------------|----------|
| **Custom Styling** | ✅ Full | ❌ None | ⚠️ Optional | ❌ None |
| **Executable Code** | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **EDS Blocks** | ✅ Yes | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional |
| **Visual Consistency** | ✅ Required | ⚠️ Optional | ⚠️ Optional | ❌ Not needed |
| **Action Cards** | ⚠️ Optional | ⚠️ Optional | ✅ Required | ❌ No |
| **Multi-Paradigm Nav** | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Progress Indicators** | ❌ No | ⚠️ Optional | ✅ Yes | ❌ No |
| **Part Summaries** | ❌ No | ⚠️ Optional | ✅ Yes | ❌ No |
| **Exercises** | ❌ No | ✅ Yes | ❌ No | ⚠️ Optional |
| **Best For** | Demos, showcases | Tutorials, courses | Doc navigation, hubs | Testing, prototyping |
| **Audience** | Clients, stakeholders | Learners, students | All roles | Developers |
| **Doc Count** | Any | 1-10 topics | 20+ documents | 1-5 topics |
| **Complexity** | Medium | Medium | High | Low |

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

**Last Updated:** 2025-01-20
