# Notebook Validator Skill

Comprehensive validation of Jupyter notebooks for production readiness with configurable parameters.

## Purpose

Validates notebooks to ensure they meet quality standards before production deployment. Checks smart links, structure, transitions, part flow, cell ordering, and metadata completeness.

## When to Use

Use this skill when you need to:

- Validate a notebook before production deployment
- Check notebook quality and structure
- Verify all smart links resolve correctly
- Ensure consistent part/section numbering
- Validate metadata completeness
- Generate quality reports for notebooks
- Check notebooks meet project standards

## Quick Start

**Basic validation:**

```
Validate the notebook.ipynb file
```

**With expected parts:**

```
Validate docs-navigation.ipynb, it should have 8 parts
```

**With strict requirements:**

```
Validate educational-notebook.ipynb with transitions required
```

## Configuration Options

The validator supports multiple configuration options:

### Expected Parts

Specify how many parts/sections the notebook should have:

```
--expected-parts 12
```

### Require Transitions

Enforce transition cells with action cards between parts:

```
--require-transitions
```

### Introduction Requirements

Set minimum cells before first part:

```
--min-intro-cells 3
```

### Conclusion Requirements

Set minimum cells after last part:

```
--min-conclusion-cells 2
```

### Metadata Requirements

Specify required metadata fields:

```
--check-metadata repo version author last-modified
```

## Validation Categories

### 1. Smart Links (Weight: 30%)

**What it validates:**

- All `[text](#)` links resolve to headings
- Link text matches heading text (fuzzy matching)
- No broken or orphaned links

**Scoring:**

- 100: All links resolve
- 75-99: Minor mismatches
- 50-74: Some broken links
- 0-49: Many broken links

**Common issues:**

- Link text doesn't match heading
- Typos in link or heading text
- Heading was renamed but link wasn't updated

### 2. Structure (Weight: 25%)

**What it validates:**

- Detects numbered parts/sections if present (optional)
- Validates part count only if `--expected-parts` specified
- Introduction section exists (if parts present and threshold set)
- Conclusion section exists (if parts present and threshold set)
- Works with both structured (parts) and free-form notebooks

**Scoring:**

- 100: Perfect structure (or no parts detected with no expectations)
- 80: Minor issues (intro/conclusion)
- 60: Wrong part count (when expected parts specified)
- 0-59: Major structural problems

**Common issues:**

- Part count doesn't match `--expected-parts`
- Too few cells before first part
- Too few cells after last part

**Note:** The validator is flexible - it doesn't require notebooks to have numbered parts.
It only validates structure if parts exist, and only enforces counts when explicitly told.

### 3. Transitions (Weight: 20%)

**What it validates:**

- Transition cells between parts (if required)
- Action cards marker present
- 3-6 action card links
- Links resolve correctly

**Scoring:**

- 100: All transitions valid (or not required)
- 70-99: Some issues
- 0-69: Missing transitions/action cards

**Common issues:**

- Missing `<!-- action-cards -->` marker
- Too few action card links (<3)
- Too many action card links (>6)

### 4. Part Flow (Weight: 15%)

**What it validates:**

- Parts numbered sequentially (1, 2, 3...)
- No duplicate part numbers
- No gaps in numbering

**Scoring:**

- 100: Perfect sequence
- 75: Minor gaps
- 50: Major gaps or duplicates
- 0-49: Severe flow problems

**Common issues:**

- Non-sequential numbering
- Duplicate part numbers
- Missing parts in sequence

### 5. Production Readiness (Weight: 10%)

**What it validates:**

- Required metadata fields present
- Repository URL configured
- File size reasonable (<5MB)
- Valid JSON structure

**Scoring:**

- 100: All metadata complete
- 85: Minor missing fields
- 70: Major missing fields
- 0-69: Critical issues

**Common issues:**

- Missing repo URL
- Large file size
- Missing version or author

## Overall Scoring

**Weighted calculation:**

```
Overall = (Smart Links × 0.30) +
          (Structure × 0.25) +
          (Transitions × 0.20) +
          (Part Flow × 0.15) +
          (Production × 0.10)
```

**Score interpretation:**

- **90-100**: ✅ Production ready
- **75-89**: ⚠️  Minor fixes needed
- **60-74**: ⚠️  Moderate issues
- **0-59**: ❌ Major rework required

## Usage Examples

### Example 1: Basic Validation

```bash
python validator.py notebook.ipynb
```

**Output:**

```
NOTEBOOK VALIDATION REPORT: notebook.ipynb
==================================================
SUMMARY:
  Total Cells: 44
  Smart Links: 13 (13 valid, 0 broken)
  Parts: 12 (sequential)
  Overall Score: 100/100 ✅ PRODUCTION READY

SMART LINKS: ✅ PASS
  ✓ All 13 smart links resolve correctly

STRUCTURE: ✅ PASS
  ✓ Found 12 parts

PART FLOW: ✅ PASS
  ✓ Parts numbered 1-12 sequentially

PRODUCTION: ✅ PASS
  ✓ Repository URL configured

RECOMMENDATIONS:
  • Notebook is ready for production deployment
```

### Example 2: With Expected Parts

```bash
python validator.py docs-navigation.ipynb --expected-parts 8
```

Validates that the notebook has exactly 8 parts/sections.

### Example 3: Strict Validation

```bash
python validator.py educational.ipynb \
  --expected-parts 10 \
  --require-transitions \
  --min-intro-cells 3 \
  --check-metadata repo version author last-modified
```

Validates with strict requirements:

- Must have 10 parts
- Must have transition cells with action cards
- Must have 3+ intro cells
- Must have repo, version, author, and last-modified metadata

### Example 4: Quiet Mode

```bash
python validator.py notebook.ipynb --quiet
```

**Output:**

```
Score: 100/100
```

### Example 5: From Claude Code

When using the skill through Claude Code:

```
Validate the mx-handbook/notebook.ipynb file, it should have 12 parts
```

Claude will:

1. Load the skill
2. Run validator with `--expected-parts 12`
3. Generate comprehensive report
4. Provide recommendations

## Validation Patterns

### Pattern Detection

The validator recognizes multiple heading patterns:

**Part headings:**

```markdown
## Part 1: Introduction
### 💡 Part 12: Conclusion
## Part 3: The Details
```

**Section headings:**

```markdown
## Section 1: Getting Started
### Section 5: Advanced Topics
```

**Transition cells:**

```markdown
### Part 7: Next Steps
**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪
**Reading time: 2 minutes**

Content explaining what's next...

<!-- action-cards -->

- [Topic 1](#)
- [Topic 2](#)
- [Topic 3](#)
```

### Smart Link Matching

**Exact match:**

```markdown
Heading: ### Getting Started
Link: [Getting Started](#)
✓ Match
```

**Fuzzy match:**

```markdown
Heading: ### Getting Started Guide
Link: [Getting Started](#)
✓ Fuzzy match (link text in heading)
```

**Emoji-agnostic:**

```markdown
Heading: ### 💡 Important Concept
Link: [Important Concept](#)
✓ Match (emojis ignored)
```

## Integration with Claude Code

### Automatic Activation

The skill activates automatically when:

**Keywords detected:**

- "validate notebook"
- "check notebook quality"
- "verify notebook structure"
- "notebook production ready"

**File patterns:**

- Working with `.ipynb` files
- References to notebook validation

**Intent patterns:**

- "validate the notebook.ipynb file"
- "check if notebook is production ready"
- "verify notebook quality"

### Usage Flow

1. **User request:**

   ```
   Validate the docs-navigation.ipynb file
   ```

2. **Claude activates skill:**
   - Loads notebook-validator skill
   - Reads notebook file
   - Runs validation

3. **Claude presents results:**
   - Comprehensive report
   - Detailed issues list
   - Specific recommendations
   - Fix suggestions

4. **User can request fixes:**

   ```
   Fix the broken links in cell 23
   ```

## Common Validation Scenarios

### Scenario 1: Educational Notebook

**Requirements:**

- 8-12 parts
- Transitions with action cards
- Complete metadata

**Validation:**

```bash
python validator.py educational.ipynb \
  --expected-parts 10 \
  --require-transitions \
  --check-metadata repo version author
```

### Scenario 2: Documentation Notebook

**Requirements:**

- Sequential sections
- Smart links functional
- Repo URL configured

**Validation:**

```bash
python validator.py docs-navigation.ipynb \
  --min-intro-cells 2 \
  --check-metadata repo
```

### Scenario 3: Presentation Notebook

**Requirements:**

- Visual sections
- No transition requirement
- Basic metadata

**Validation:**

```bash
python validator.py presentation.ipynb \
  --check-metadata repo version
```

### Scenario 4: Testing Notebook

**Requirements:**

- Flexible structure
- Code cells allowed
- Minimal metadata

**Validation:**

```bash
python validator.py test.ipynb \
  --min-intro-cells 0 \
  --min-conclusion-cells 0
```

## Troubleshooting

### Issue: Low Smart Links Score

**Symptoms:**

- Broken links reported
- Link text doesn't match headings

**Solutions:**

1. Check link text matches heading text
2. Look for typos
3. Verify emojis aren't causing issues
4. Use fuzzy matching (automatic)

**Example fix:**

```markdown
# Before (broken):
Heading: ### Getting Started Guide
Link: [Getting Started](#)

# After (fixed):
Link: [Getting Started Guide](#)
```

### Issue: Structure Score Low

**Symptoms:**

- "Expected N parts, found M"
- "No clear introduction section"

**Solutions:**

1. Verify part count matches expected
2. Add introduction cells
3. Add conclusion cells
4. Check part numbering

### Issue: Transitions Required But Missing

**Symptoms:**

- "Missing <!-- action-cards --> marker"
- "Only N action cards (need 3-6)"

**Solutions:**

1. Add `<!-- action-cards -->` marker
2. Add 3-6 links after marker
3. Ensure links use `(#)` placeholder

**Example fix:**

```markdown
# Before (fails):
### Part 7: Next Steps
**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪

Content here...

# After (passes):
### Part 7: Next Steps
**Progress: 7 of 8** 🔵🔵🔵🔵🔵🔵🔵⚪

Content here...

<!-- action-cards -->

- [Topic 1](#)
- [Topic 2](#)
- [Topic 3](#)
```

### Issue: Part Flow Non-Sequential

**Symptoms:**

- "Part N expected, found Part M"
- "Duplicate part numbers"

**Solutions:**

1. Renumber parts sequentially
2. Remove duplicates
3. Fill gaps in numbering

## Best Practices

### For Educational Notebooks

✅ Use consistent part numbering
✅ Include transitions with action cards
✅ Complete all metadata fields
✅ Keep file size under 5MB
✅ Validate before deployment

❌ Don't skip part numbers
❌ Don't have gaps in sequence
❌ Don't leave metadata incomplete
❌ Don't ignore broken links

### For Documentation Notebooks

✅ Sequential sections
✅ Clear introduction
✅ Proper conclusion
✅ All smart links working
✅ Repository URL configured

❌ Don't use transition cells (not needed)
❌ Don't have too few intro cells
❌ Don't skip metadata fields

### For All Notebooks

✅ Test all smart links
✅ Run validation before committing
✅ Address errors before warnings
✅ Keep structure consistent
✅ Update metadata regularly

❌ Don't deploy unvalidated notebooks
❌ Don't ignore validation warnings
❌ Don't skip quality checks

## Related Skills

- **ipynb-validator**: Original skill with fixed parameters
- **jupyter-notebook**: Creating/editing notebooks
- **jupyter-educational-notebook**: Creating educational notebooks
- **create-notebook**: Interactive notebook creation

## See Also

- `.claude/skills/ipynb-validator/SKILL.md` - Original validator
- `blocks/ipynb-viewer/README.md` - Notebook viewer documentation
- `docs/for-ai/explaining-educational-notebooks.md` - Notebook creation guide
