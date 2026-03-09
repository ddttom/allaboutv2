---
version: "1.0"
description: "ADR #5: Typography standards for PDF generation — widow/orphan prevention and intelligent page break control as universal pattern across all MX publications."
created: 2026-02-18
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: architecture
  partOf: mx-maxine-lives
  tags: [adr, pdf-generation, typography, page-breaks, widow-orphan-prevention, needspace, latex, universal-standards]
  audience: [tech, tech]

  adr:
    number: 5
    title: "Typography Standards for PDF Generation"
    status: accepted
    date: 2026-02-18
    context: "MX publications (Handbook, Corpus, case studies) require professional typography that prevents awkward page breaks. Widows (single lines at top of page), orphans (single lines at bottom of page), and split context (tables/code blocks separated from headings) create poor reading experiences and reduce publication quality."
    decision: "Establish universal typography standards using LaTeX penalty settings and intelligent spacing. Apply widow/orphan prevention (\\widowpenalty=10000, \\clubpenalty=10000) and flexible page bottoms (\\raggedbottom) to all book metadata.yaml files. Use needspace package for tables and code blocks requiring context preservation."
    consequences: "Consistent professional typography across all MX publications. Eliminates single-line orphans and preserves context for tables/code. Universal standards reduce decision-making overhead and establish clear patterns. Requires needspace LaTeX package installation (via tlmgr). May create uneven page bottoms (acceptable trade-off for readability)."

  buildsOn: [pdf-generator, 2026-02-18-png-workflow-for-pdf-generation]
---

# Typography Standards for PDF Generation

## Context

MX OS publishes three main book products:

- **MX: The Handbook** — practical implementation guide
- **MX: The Corpus** — comprehensive reference work
- **Case Studies** — implementation examples and patterns

As of February 2026, these publications required consistent typography standards to ensure professional quality. Specific concerns identified:

### Widow and Orphan Problems

**Widows:** Single lines of a paragraph appearing alone at the top of a page, disconnected from their paragraph.

**Orphans (Clubs):** Single lines of a paragraph appearing alone at the bottom of a page, with the rest continuing on the next page.

Both patterns create poor reading experiences:

- Break the reader's flow
- Look unprofessional
- Suggest careless typesetting
- Reduce publication credibility

### Context Separation Problems

**Tables:** Tables starting on one page with only 1-2 rows visible, then continuing on the next page. The heading that introduces the table is separated from the data.

**Code blocks:** Code examples starting immediately after a heading at the bottom of a page, with only the first line visible before page break. The heading context is lost.

**Paragraphs:** Multi-paragraph explanations breaking awkwardly, with insufficient context on either side of the break.

### The Question

Should typography controls be:

1. **Universal** — same settings in all metadata.yaml files (Handbook, Corpus, case studies)
2. **Per-book** — different settings per publication based on specific needs
3. **Optional** — available but not required, applied when issues arise

## Decision

**We establish universal typography standards applied to all MX publications.**

### Core Settings (Required for All Books)

Add to every book's `datalake/assets/configs/books/{book}/metadata.yaml` file:

```yaml
header-includes: |
  \usepackage{needspace}       # Intelligent space checking

  \widowpenalty=10000          # Prevent widows
  \clubpenalty=10000           # Prevent orphans
  \raggedbottom                # Flexible page bottoms
```

### What These Settings Do

**1. Widow Prevention (`\widowpenalty=10000`)**

- Prevents single lines of a paragraph appearing alone at the top of a page
- LaTeX penalty of 10000 means "try very hard to avoid this"
- Not absolute — LaTeX will still break if no other option exists
- Example: A 5-line paragraph won't leave its last line orphaned on the next page

**2. Orphan/Club Prevention (`\clubpenalty=10000`)**

- Prevents single lines of a paragraph appearing alone at the bottom of a page
- Keeps at least 2 lines together when paragraphs must break across pages
- Same penalty level as widow prevention (consistent policy)
- Example: A paragraph won't start with just one line at the bottom of a page

**3. Flexible Page Bottoms (`\raggedbottom`)**

- Allows pages to end at different vertical positions
- Prevents LaTeX from stretching whitespace to fill pages
- Gives LaTeX flexibility to honor widow/orphan penalties
- Trade-off: some pages may have slightly more white space at bottom

**4. Intelligent Spacing (`needspace` package)**

- Checks available space before placing content
- Moves content to next page if insufficient space remains
- Prevents context separation (table from heading, code from explanation)
- Requires explicit usage in markdown: `\needspace{5\baselineskip}`

### Usage Patterns for needspace

**Small tables (3-5 rows):**

```markdown
The following table shows revenue loss patterns:

\needspace{5\baselineskip}

| Business Type | Lost Revenue |
| ------------- | ------------ |
| Tour Operator | £2,000 per booking |
```

**Code blocks with headings:**

```markdown
Here's the implementation:

\needspace{7\baselineskip}

```bash
npm run illustrations:generate
```

```

**When not to use needspace:**
- Large tables (10+ rows) — use `longtable` environment instead
- Long code blocks (20+ lines) — page breaks are unavoidable
- Single-paragraph explanations — widow/orphan penalties handle these

## Rationale

### Why Universal (Not Per-Book)?

**1. Consistency Across Product Line**
All MX publications represent the same brand and quality level. Readers expect consistent typography whether reading the Handbook, Corpus, or a case study. Universal standards ensure this.

**2. Reduced Decision Overhead**
Developers and content authors shouldn't need to decide typography policy for each publication. Universal standards eliminate "should I add widow prevention to this book?" questions.

**3. Quality is Not Optional**
Professional typography is a baseline requirement, not an enhancement. Making it universal ensures no publication ships with poor page breaks.

**4. Maintenance Simplicity**
One pattern to document, one pattern to apply, one pattern to update if improvements are needed. Per-book settings would multiply maintenance burden.

**5. Future Publications Inherit Quality**
When creating new books, case studies, or white papers, quality typography comes automatically. No need to remember to copy settings from another book.

### Why These Specific Values?

**Penalty 10000 (Not Lower)**
- 10000 is LaTeX's "very bad" penalty level
- Lower values (1000, 5000) allow widows/orphans more easily
- LaTeX will still break pages when necessary (e.g., 30-line paragraph must break somewhere)
- Higher values don't improve behavior — 10000 is effectively "avoid if at all possible"

**Raggedbottom (Not Flushbottom)**
- `\flushbottom` (default) stretches whitespace to align page bottoms
- This conflicts with widow/orphan prevention by reducing LaTeX's flexibility
- `\raggedbottom` allows natural page endings
- For books, ragged bottoms are standard practice

**needspace Package (Not Manual Checking)**
- Manual `\vspace` or `\pagebreak` commands require human judgment
- needspace automates the decision: "is there room for this content?"
- Works dynamically as content changes (adding/removing paragraphs updates page breaks automatically)
- Scales to hundreds of tables/code blocks without manual intervention

## Consequences

### Positive

**1. Professional Typography**
All MX publications meet professional typesetting standards. No widows, no orphans, no awkwardly split context.

**2. Universal Application**
One decision covers all publications. Handbook, Corpus, case studies, future books — all benefit immediately.

**3. Automated Enforcement**
LaTeX enforces the standards automatically during PDF generation. No manual review needed to catch widow/orphan issues.

**4. Context Preservation**
Tables stay with their introductory headings. Code blocks stay with their explanatory paragraphs. Readers always have context.

**5. Future-Proof**
New publications inherit the standards. When MX publishes "The Practitioner's Guide" or "Advanced Patterns," typography quality is guaranteed.

**6. Documented Pattern**
This ADR establishes the "why" behind the settings. Developers understand the rationale, not just the configuration.

### Trade-offs

**1. Uneven Page Bottoms**
`\raggedbottom` means some pages end higher than others. This is standard practice for books but may look unusual to those expecting flush bottoms.

**Mitigation:** This is the correct choice for book typography. Academic publishers, technical publishers, and professional typesetters use ragged bottoms.

**2. Occasional Extra Whitespace**
Widow/orphan prevention and needspace may insert extra vertical space before page breaks to preserve context.

**Mitigation:** Acceptable trade-off. Professional appearance and preserved context matter more than perfectly filled pages.

**3. Installation Requirement**
The `needspace` package must be installed via TeX Live Manager:
```bash
sudo tlmgr install needspace
```

**Mitigation:** One-time installation on build machines. Documented in pdf-generator.cog.md Step 7.6. Standard LaTeX package, widely available.

**4. Manual needspace Usage Required**
Authors must add `\needspace{N\baselineskip}` before critical tables/code blocks. This is not automatic.

**Mitigation:** Documented patterns in pdf-generator.cog.md. Clear guidelines for when/how to use. Benefits outweigh the small authoring overhead.

**5. Not Absolute**
LaTeX penalties are recommendations, not absolute rules. A 50-line paragraph will still break across pages even with widow/orphan prevention.

**Mitigation:** This is correct behavior. LaTeX makes intelligent decisions when conflicts arise. Penalties prevent *unnecessary* widows/orphans, not *all possible* page breaks.

### Documentation Impact

**Updated Files:**

- **pdf-generator.cog.md v1.8.2:** Added Step 7.6 "Control page breaks and typography" with complete needspace usage patterns
- **All book metadata.yaml files:** Require the four core settings (needspace, widowpenalty, clubpenalty, raggedbottom)
- **This ADR:** Canonical reference for typography decisions and rationale

**New Pattern Established:**
When creating new books:

1. Copy metadata.yaml template from existing book
2. Typography settings inherit automatically
3. Use needspace for critical tables/code blocks
4. No additional typography decisions needed

## Alternatives Considered

### Alternative 1: Per-Book Typography Settings

**Approach:** Let each book choose its own widow/orphan prevention and page break policies based on specific needs.

**Rejected because:**

- Creates inconsistency across MX product line
- Increases decision overhead for every new publication
- Some books would inevitably ship without proper typography controls
- No technical reason for different standards — all books benefit equally from widow/orphan prevention
- Maintenance burden: must update settings in N places when improving typography

### Alternative 2: Optional Typography Controls

**Approach:** Make widow/orphan prevention available but not required. Apply when issues are noticed.

**Rejected because:**

- Reactive rather than proactive — fixes problems after they appear in published PDFs
- Quality should be built-in, not bolted on
- Authors shouldn't need to recognize typography issues (that's the typesetting system's job)
- Creates inconsistent quality across publications
- Violates "pit of success" principle — the default should be correct

### Alternative 3: Manual Page Break Control

**Approach:** Use explicit `\pagebreak` or `\newpage` commands where needed rather than automated penalties.

**Rejected because:**

- Doesn't scale — hundreds of potential page break points in each book
- Fragile — adding/removing content breaks manual page break positions
- Requires typography expertise from all authors
- Creates maintenance burden — manual breaks need updating as content changes
- Penalties and needspace automate what manual breaks try to achieve

### Alternative 4: Higher Penalties (e.g., 100000)

**Approach:** Use extremely high penalties to absolutely forbid widows/orphans.

**Rejected because:**

- Causes worse problems — LaTeX stretches pages excessively or gives up entirely
- 10000 is the standard "very bad" penalty level in professional typography
- Higher penalties don't improve behavior, they reduce LaTeX's ability to find good solutions
- Professional typesetters use 10000 — we should follow established practice

### Alternative 5: Different Penalties for Widows vs Orphans

**Approach:** Use different penalty values (e.g., widowpenalty=10000, clubpenalty=5000) based on which is more objectionable.

**Rejected because:**

- Both are equally problematic for professional publications
- Consistent penalties are easier to understand and maintain
- No evidence that asymmetric penalties improve results
- Standard practice uses matching values

## Implementation Notes

### Installation Checklist

For each build machine:

1. **Install needspace package:**

   ```bash
   sudo tlmgr install needspace
   ```

2. **Verify installation:**

   ```bash
   kpsewhich needspace.sty
   ```

   Should return: `/usr/local/texlive/YYYY/texmf-dist/tex/latex/needspace/needspace.sty`

3. **Update all book metadata.yaml files:**
   - Handbook: `datalake/assets/configs/books/handbook/metadata.yaml`
   - Corpus: `datalake/assets/configs/books/corpus/metadata.yaml`
   - Case studies: `datalake/assets/configs/books/case-studies/metadata.yaml`

4. **Regenerate PDFs to verify:**

   ```bash
   npm run pdf:mx-generate      # Handbook
   npm run pdf:corpus-generate   # Corpus
   ```

### Verification Process

After adding typography settings:

1. **Check for LaTeX errors:**
   - PDF generation should complete without "needspace.sty not found" errors
   - No warnings about unresolved penalties

2. **Visual inspection:**
   - Scan PDF for widows (single lines at top of pages)
   - Scan PDF for orphans (single lines at bottom of pages)
   - Verify tables aren't split awkwardly from headings
   - Check code blocks have context preserved

3. **Page count comparison:**
   - Compare page count before/after typography settings
   - Small increase (1-3 pages per 100) is expected and acceptable
   - Large increase (10+ pages) suggests problem with settings

### needspace Usage Guidelines

**When to use needspace:**

- Before tables with 3-10 rows
- Before code blocks following explanatory headings
- Before multi-paragraph explanations with critical continuity

**When NOT to use needspace:**

- Large tables (10+ rows) — use longtable instead
- Long code blocks (20+ lines) — page breaks are inevitable
- Single paragraphs — widow/orphan penalties handle these automatically
- Between every paragraph — excessive and counterproductive

**How much space to request:**

- `\needspace{3\baselineskip}` — minimum (heading + 2 lines)
- `\needspace{5\baselineskip}` — small tables (3-5 rows)
- `\needspace{7\baselineskip}` — code blocks (heading + ~5 lines)
- `\needspace{10\baselineskip}` — medium tables (6-10 rows)

## Status

**Accepted** — Universal typography standards documented and implemented across MX publications.

**Implementation Status:**

- ✅ needspace package installed on build machines
- ✅ pdf-generator.cog.md updated to v1.8.2 with Step 7.6
- ✅ Handbook metadata.yaml updated with typography settings
- ✅ Handbook PDF regenerated and verified (2026-02-18)
- ⏳ Corpus metadata.yaml pending update
- ⏳ Case studies metadata.yaml pending update

**Next Actions:**

1. Apply typography settings to Corpus metadata.yaml
2. Apply typography settings to case studies metadata.yaml
3. Add needspace usage to Handbook/Corpus content where needed
4. Document in authoring guidelines for future publications

---

*"Professional typography is not optional. Widows and orphans belong in Dickens novels, not technical documentation."* — Typography Standards ADR #5
