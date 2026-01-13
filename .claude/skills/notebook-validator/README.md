# Notebook Validator

Generic Jupyter notebook validator for production readiness checking.

## Quick Start

**From command line:**
```bash
python validator.py notebook.ipynb
```

**From Claude Code:**
```
Validate the notebook.ipynb file
```

## Common Usage

```bash
# Basic validation
python validator.py notebook.ipynb

# With expected parts
python validator.py notebook.ipynb --expected-parts 12

# Require transitions
python validator.py notebook.ipynb --require-transitions

# Strict validation
python validator.py notebook.ipynb \
  --expected-parts 10 \
  --require-transitions \
  --check-metadata repo version author

# Quiet mode (just show score)
python validator.py notebook.ipynb --quiet
```

## What It Validates

1. **Smart Links** (30%) - All `[text](#)` links resolve to headings
2. **Structure** (25%) - Proper intro, parts, conclusion
3. **Transitions** (20%) - Action cards between parts (if required)
4. **Part Flow** (15%) - Sequential numbering (1, 2, 3...)
5. **Production** (10%) - Metadata, file size, JSON validity

## Scoring

- **90-100**: ✅ Production ready
- **75-89**: ⚠️  Minor fixes needed
- **60-74**: ⚠️  Moderate issues
- **0-59**: ❌ Major rework required

## Options

```
--expected-parts N          Expected number of parts
--require-transitions       Require action cards in transitions
--min-intro-cells N         Minimum cells before first part (default: 1)
--min-conclusion-cells N    Minimum cells after last part (default: 2)
--check-metadata F1 F2...   Required metadata fields (default: repo)
--quiet                     Suppress detailed output
```

## Examples

**Educational notebook (strict):**
```bash
python validator.py educational.ipynb \
  --expected-parts 10 \
  --require-transitions \
  --check-metadata repo version author last-modified
```

**Documentation notebook (standard):**
```bash
python validator.py docs.ipynb \
  --expected-parts 8 \
  --check-metadata repo
```

**Testing notebook (flexible):**
```bash
python validator.py test.ipynb \
  --min-intro-cells 0 \
  --min-conclusion-cells 0
```

## Via Claude Code

The skill activates automatically when you:
- Mention "validate notebook"
- Reference `.ipynb` files
- Ask to "check notebook quality"

**Example prompts:**
```
Validate the invisible-users/notebook.ipynb file, it should have 12 parts
Check if docs-navigation.ipynb is production ready
Verify notebook quality for educational.ipynb with transitions required
```

## Output Example

```
NOTEBOOK VALIDATION REPORT: notebook.ipynb
==================================================
SUMMARY:
  Total Cells: 44
  Smart Links: 13 (13 valid, 0 broken)
  Parts: 12 (sequential)
  Transitions: 0 (0 with action cards)
  Overall Score: 100/100 ✅ PRODUCTION READY

SMART LINKS: ✅ PASS
  Score: 100/100
  ✓ All 13 smart links resolve correctly

STRUCTURE: ✅ PASS
  Score: 100/100
  ✓ Found 12 parts

PART FLOW: ✅ PASS
  Score: 100/100
  ✓ Parts numbered 1-12 sequentially

PRODUCTION: ✅ PASS
  Score: 100/100
  ✓ Repository URL configured

RECOMMENDATIONS:
  • Notebook is ready for production deployment
  • All validation checks passed
```

## Common Issues

**Broken smart links:**
- Fix: Match link text to heading text exactly
- Use fuzzy matching if needed

**Structure issues:**
- Fix: Add introduction/conclusion cells
- Check part count matches expected

**Missing transitions:**
- Fix: Add `<!-- action-cards -->` marker
- Include 3-6 links after marker

**Part flow problems:**
- Fix: Renumber parts sequentially
- Remove duplicates

## Integration

The validator is integrated with:
- Claude Code (automatic skill activation)
- `ipynb-validator` skill (original version)
- `jupyter-notebook` skills (creation/editing)

## Documentation

- **SKILL.md** - Complete documentation
- **validator.py** - Generic validator script
- **README.md** - This quick reference

## Related Skills

- `ipynb-validator` - Original fixed-parameter validator
- `jupyter-notebook` - Notebook creation/editing
- `jupyter-educational-notebook` - Educational notebook creation

## License

Part of the allaboutV2 project tooling.
