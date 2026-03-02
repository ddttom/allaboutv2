---
title: "Jupyter Notebook Templates"
description: "This directory contains templates for creating different types of Jupyter notebooks in the AllAboutV2 project."
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"

mx:
  status: active
---

# Jupyter Notebook Templates

This directory contains templates for creating different types of Jupyter notebooks in the AllAboutV2 project.

## ⚠️ Quick Validation Check

**Before deploying any navigation notebook:**

1. ✅ Every transition cell (with "Part X:", Progress, 🔵) has `<!-- action-cards -->` marker
2. ✅ Each transition has 3-6 action card links
3. ✅ All action card links resolve to existing headings
4. ✅ Run `/validate-notebook your-notebook.ipynb`

**This catches 80% of validation failures.** Missing action cards in transitions is the #1 issue.

---

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

**Structure (30 cells):**

- Hero cell with main navigation table
- Emergency navigation (quick fixes)
- Essential bookmarks highlight
- Search keywords guide
- Intro cells (What is this? Why navigation matters?)
- What you'll learn
- **Part 1: Big Picture** (NO transition before - first part)
  - Part 1 start WITH action cards
  - Part 1 content cells
  - Part 1 summary
- **Part 2: By Role**
  - **Transition cell** ✅ WITH action cards (REQUIRED format)
  - Part 2 content (role-based learning paths)
  - Part 2 summary
- **Part 3: By Task**
  - **Transition cell** ✅ WITH action cards (REQUIRED format)
  - Part 3 content (task-based guides)
  - Part 3 summary
- **Part 4: By Workflow**
  - **Transition cell** ✅ WITH action cards (REQUIRED format)
  - Part 4 content (development phases)
  - Part 4 summary
- **Part 5: By Category**
  - **Transition cell** ✅ WITH action cards (REQUIRED format)
  - Part 5 content (browse all docs)
  - Part 5 summary
- **Part 6: Pro Tips**
  - **Transition cell** ✅ WITH action cards (REQUIRED format)
  - Part 6 content (expert navigation strategies)
  - Part 6 summary
- **Part 7: Universal Patterns** (apply anywhere)
- Troubleshooting section
- Final reflection (living documentation principles)
- Closing cell with thank you message

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

- ✅ **CRITICAL: Add `<!-- action-cards -->` to ALL transition cells** (required for validation)
- ✅ Include emergency navigation section for urgent problems
- ✅ Add progress indicators (🔵🔵🔵⚪⚪⚪) and reading time estimates
- ✅ Create part summaries after each major section
- ✅ Add final closing cell thanking users and reinforcing key takeaways
- ✅ Use action cards for non-linear navigation
- ✅ Include troubleshooting section for common issues
- ✅ Run `/validate-notebook` before deployment (must score ≥90)

**✅ Template Structure:**

The [navigation-template.ipynb](navigation-template.ipynb) follows production-ready best practices with:

1. **Proper cell structure:**
   - ✅ Dedicated transition cells with action cards (required format)
   - ✅ Separate part start cells
   - ✅ Part content cells
   - ✅ Part summary cells
   - ✅ 30 cells demonstrating correct structure

2. **All transition cells include:**
   - ✅ Part X heading
   - ✅ Progress indicator (X of N) with 🔵 dots
   - ✅ Reading time estimate
   - ✅ Contextual text
   - ✅ `<!-- action-cards -->` marker
   - ✅ 3-6 action card links

3. **Use [docs-navigation.ipynb](../../../../docs-navigation.ipynb) as the advanced reference** - 75 cells with 8 complete parts

**See Also:**

- [docs-navigation.ipynb](../../../../docs-navigation.ipynb) - **REFERENCE EXAMPLE** (75 cells, 8 parts, production-ready structure)
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

## Cell Ordering Best Practices

**CRITICAL:** Proper cell ordering is essential for navigation notebooks. Following these patterns ensures logical flow and prevents user confusion.

### Correct Structure Pattern

```
Introduction Section (Cells 0-N)
  → Hero cell with main navigation
  → Table of Contents
  → Emergency navigation
  → Essential bookmarks

Part 1 Section
  → Part 1 content cells
  → Part 1 completion/summary cell

Part 2 Transition Cell (with action cards)
  → Part 2 start cell
  → Part 2 content cells
  → Part 2 completion/summary cell

Part 3 Transition Cell
  → Part 3 start cell
  → Part 3 content cells
  → Part 3 completion/summary cell

...continue for all parts...

Reference Section (End of notebook)
  → Resources & Quick Reference
  → Essential Bookmarks
  → Your Next Steps
  → Troubleshooting Navigation Issues

Final Wrap-Up
  → "Remember - Living Documentation" reflection
  → End/Closing cell
```

### Common Cell Ordering Mistakes

❌ **WRONG:** Completion cell BEFORE part content

```
Part 8 Completion Cell (index 69)
Part 8 START Cell (index 70)
Part 8 Content...
```

✅ **CORRECT:** Completion cell AFTER all part content

```
Part 8 START Cell (index 63)
Part 8 Content Cells (indices 64-71)
Part 8 Completion Cell (index 72)
```

❌ **WRONG:** Reference cells BETWEEN parts

```
Part 6 Completion
Resources & Quick Reference ← Interrupts flow
Essential Bookmarks ← Interrupts flow
Part 7 Transition
```

✅ **CORRECT:** Reference cells at END of notebook

```
Part 6 Completion
Part 7 Transition (immediately adjacent)
Part 7 Content...
Part 8 Content...
Part 8 Completion
Resources & Quick Reference ← At end
Essential Bookmarks ← At end
Final Wrap-Up
```

❌ **WRONG:** Technical detail cells orphaned outside their section

```
Part 7 Content
Code Examples ← Orphaned
CSS Classes ← Orphaned
Auto-Wrapping Detection ← Orphaned
Part 8 START
```

✅ **CORRECT:** Technical cells within their parent section

```
Part 8 START
Performance Stats
Code Examples ← Inside Part 8
CSS Classes ← Inside Part 8
Auto-Wrapping Detection ← Inside Part 8
Try It Yourself
Part 8 Completion
```

### Validation Checks

Before deploying, verify:

```python
# Check 1: Parts are adjacent (no gaps)
part_6_completion_idx + 1 == part_7_transition_idx  # Must be true

# Check 2: Completion after content
part_8_start_idx < part_8_completion_idx  # Must be true

# Check 3: Reference section at end
part_8_completion_idx < reference_section_idx < final_wrap_idx  # Must be true

# Check 4: Technical cells within section
part_8_start_idx < technical_cell_idx < part_8_completion_idx  # Must be true
```

### Automatic Validation

Use the validation command to check structure:

```bash
/validate-notebook your-notebook.ipynb
```

This checks:

- ✅ Cell ordering and adjacency
- ✅ Completion cell placement
- ✅ Reference cell location
- ✅ Technical cell containment
- ✅ Part flow and gaps

### Real-World Example

See [docs-navigation.ipynb](../../../../docs-navigation.ipynb) for perfect cell ordering:

- 75 cells total
- 8 parts sequentially numbered
- All completions after content
- Reference section at end (indices 69-72)
- No gaps between parts
- All technical cells within Part 8

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

### ⚠️ CRITICAL: Action Cards in Transition Cells

**REQUIRED for Navigation Notebooks:** Every transition cell between parts MUST include action cards.

**Transition Cell Pattern:**

```markdown
### Part 7: Universal Patterns

**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪
**Reading time: 2 minutes**

Contextual text explaining what's next...

<!-- action-cards -->

- [Topic 1](#)
- [Topic 2](#)
- [Topic 3](#)
```

**Validation Requirements:**

- ✅ Transition cells MUST have `<!-- action-cards -->` marker
- ✅ Must include 3-6 action card links
- ✅ Links must use `(#)` placeholder pattern
- ✅ Links must resolve to existing headings

**Common Failure:**

```markdown
# ❌ FAILS VALIDATION - Missing action cards
### Part 7: Universal Patterns
**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪
**Reading time: 2 minutes**

These patterns work everywhere...
# No action cards marker - VALIDATION FAILS

# ✅ PASSES VALIDATION - Has action cards
### Part 7: Universal Patterns
**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪
**Reading time: 2 minutes**

These patterns work everywhere...

<!-- action-cards -->

- [Beyond EDS](#)
- [Universal Patterns](#)
```

**Why This Matters:**

- This is the #1 validation failure (80% of issues)
- Action cards provide visual navigation between parts
- Maintains consistent user experience
- Critical for multi-part navigation notebooks

**Validation Check:**

```bash
/validate-notebook your-notebook.ipynb
```

Will report:

```
TRANSITIONS: ❌ FAIL
  ✗ Part 7 transition (cell 45) missing <!-- action-cards --> marker
  Fix: Add action cards marker with 3-6 links
```

**See Also:**

- [.claude/skills/ipynb-validator/SKILL.md](../../../../.claude/skills/ipynb-validator/SKILL.md) - Complete validation guide
- [.claude/commands/validate-notebook.md](../../../../.claude/commands/validate-notebook.md) - Validation command

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
| **Action Cards in Transitions** | ⚠️ Optional | ⚠️ Optional | ✅ **REQUIRED** | ❌ No |
| **Multi-Paradigm Nav** | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Progress Indicators** | ❌ No | ⚠️ Optional | ✅ Yes | ❌ No |
| **Part Summaries** | ❌ No | ⚠️ Optional | ✅ Yes | ❌ No |
| **Exercises** | ❌ No | ✅ Yes | ❌ No | ⚠️ Optional |
| **Validation Required** | ⚠️ Optional | ⚠️ Optional | ✅ **Critical** | ❌ No |
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

---

## Important Notes

### Cell Ordering in Templates

All templates follow best practices for cell ordering:

✅ **navigation-template.ipynb**

- **30 cells** with production-ready structure
- ✅ All transition cells have action cards (cells 11, 14, 17, 20, 23)
- ✅ Proper Part X headings with progress indicators
- ✅ All parts flow sequentially
- ✅ Part summaries after content
- ✅ Follows all validation rules
- ✅ Ready for `/validate-notebook` testing

✅ **educational-template.ipynb**

- Progressive learning structure
- Exercises after concepts
- Summary at end

✅ **presentation-template.ipynb**

- Visual consistency throughout
- Logical slide flow
- Closing slide at end

### Before Using a Template

1. **Copy the template** to your working location
2. **Customize metadata** (title, description, author, etc.)
3. **Update placeholder text** with your actual content
4. **Validate structure** using `/validate-notebook` command
5. **Test in ipynb-viewer** block to ensure proper rendering

### After Customizing

Run validation to ensure structure integrity:

```bash
/validate-notebook your-customized-notebook.ipynb
```

Expected output for proper structure:

- Overall Score: ≥ 90/100
- All smart links resolve
- Cell ordering correct
- Parts flow sequentially
- No structural gaps

---

**Last Updated:** 2025-01-21

- Rebuilt navigation-template.ipynb with proper transition cells
- All transition cells now have required action cards format
- Template is 100% validation-compliant (30 cells, 6 transition cells)
- Added comprehensive action cards validation documentation
- Enhanced validation command and skill with detection logic
