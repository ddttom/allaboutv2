---
description: Validate Jupyter notebook for production readiness - checks smart links, layout structure, transitions, part flow, cell ordering, and overall quality
---

# Validate Notebook Command

You are validating a Jupyter notebook for production readiness. This command performs comprehensive checks to ensure the notebook is ready for deployment.

## Task

Validate the specified notebook file and generate a detailed report covering:
1. Smart links consistency
2. Layout structure
3. Transition cells with action cards
4. Numbered part/section flow
5. Cell ordering
6. Overall production readiness

## Required Skill

Load the `ipynb-validator` skill for complete validation guidance:
```
Use Skill tool with: ipynb-validator
```

## Validation Steps

### Step 1: Identify the Notebook

If user provided a notebook name:
- Use that file (e.g., `docs-navigation.ipynb`)

If no notebook specified:
- Ask: "Which notebook should I validate?"

### Step 2: Load and Parse

1. Read the notebook JSON file
2. Parse all cells and extract:
   - Cell types and sources
   - All headings (##, ###)
   - All smart links ([text](#))
   - Action card markers (<!-- action-cards -->)
   - Part numbers and titles

### Step 3: Run Comprehensive Validation

Create a Python script that checks:

#### A. Smart Links
```python
# Extract all smart links
smart_links = re.findall(r'\[([^\]]+)\]\(#\)', source)

# Build heading index
headings = {}
for heading in all_headings:
    normalized = normalize_text(heading)
    headings[normalized] = cell_index

# Match links to headings
for link in smart_links:
    normalized_link = normalize_text(link)
    if not find_matching_heading(normalized_link, headings):
        issues.append(f"Broken link: [{link}](#)")
```

#### B. Structure Analysis
```python
# Identify sections
intro_cells = cells[0:first_part_start]
parts = find_all_parts(cells)
conclusion_cells = cells[last_part_end:]

# Validate each part
for part in parts:
    check_part_structure(part)
    check_part_summary(part)
    check_cell_ordering(part)
```

#### C. Transitions
```python
# Find transitions
transitions = []
for i, cell in enumerate(cells):
    if '<!-- action-cards -->' in cell['source']:
        transitions.append({
            'cell': i,
            'has_marker': True,
            'link_count': count_action_links(cell)
        })

# Validate transitions
for part in parts:
    check_transition_before_part(part, transitions)
```

#### D. Part Flow
```python
# Extract part numbers
part_numbers = []
for cell in cells:
    match = re.search(r'Part (\d+):', cell['source'])
    if match:
        part_numbers.append(int(match.group(1)))

# Check sequential
expected = list(range(1, max(part_numbers) + 1))
if part_numbers != expected:
    issues.append(f"Part numbering: {part_numbers} (expected {expected})")
```

### Step 4: Generate Report

Create a comprehensive report with:

```
NOTEBOOK VALIDATION REPORT: {filename}
================================================================

SUMMARY:
  Total Cells: {count}
  Smart Links: {total} ({valid} valid, {broken} broken)
  Parts: {count} ({status})
  Transitions: {count} ({status})
  Overall Score: {score}/100 {status_emoji}

SMART LINKS: {status}
  {details}

STRUCTURE: {status}
  {details}

TRANSITIONS: {status}
  {details}

PART FLOW: {status}
  {details}

CELL ORDERING: {status}
  {details}

PRODUCTION READINESS: {status}
  {details}

ISSUES FOUND: {count}
  {list of issues with cell references}

RECOMMENDATIONS:
  {actionable suggestions}
```

### Step 5: Scoring and Assessment

Calculate scores for each category:

```python
def calculate_smart_links_score():
    if broken_links == 0:
        return 100
    percentage = (valid_links / total_links) * 100
    return max(0, percentage)

def calculate_structure_score():
    score = 100
    if not has_intro: score -= 20
    if not has_conclusion: score -= 10
    if has_gaps: score -= 15
    return max(0, score)

def calculate_transitions_score():
    score = 100
    for part in parts:
        if needs_transition(part) and not has_transition(part):
            score -= 15
        elif has_transition(part) and not has_action_cards(part):
            score -= 10
    return max(0, score)

def calculate_overall_score():
    return (
        smart_links_score * 0.30 +
        structure_score * 0.25 +
        transitions_score * 0.20 +
        part_flow_score * 0.15 +
        ordering_score * 0.10
    )
```

### Step 6: Provide Recommendations

Based on score:

**90-100 (Production Ready):**
- ✅ "Notebook is ready for production deployment"
- List any minor improvements

**75-89 (Minor Fixes Needed):**
- ⚠️ "Minor issues found, quick fixes needed"
- List specific issues with cell references
- Provide fix suggestions

**60-74 (Moderate Issues):**
- ⚠️ "Moderate issues found, review recommended"
- List all issues grouped by category
- Provide detailed fix instructions

**0-59 (Major Rework):**
- ❌ "Major issues found, significant work needed"
- List critical problems
- Suggest systematic review

## Output Format

Present results in a clear, actionable format:

1. **Executive Summary** - Score and overall status
2. **Category Scores** - Individual scores with details
3. **Issues List** - All problems with cell references
4. **Recommendations** - Prioritized fix suggestions
5. **Next Steps** - What to do to reach production ready

## Example Usage

```
User: /validate-notebook docs-navigation.ipynb