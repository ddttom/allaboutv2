# Learnings

Critical insights for AI assistants working on this project. Focus: actionable guidance, not historical changelog.

---

## ipynb-viewer Smart Links

**Rule** (2026-01-13): Tried using full GitHub URLs for markdown links in Jupyter notebooks, but this breaks the ipynb-viewer block's smart link feature. Always use relative paths like `[Preface](preface.md)` instead of full URLs like `[Preface](https://github.com/.../preface.md)`.

**Why it matters:**
- The ipynb-viewer block has a GitHub markdown overlay feature
- It automatically converts relative .md links to GitHub raw URLs using the `repo` metadata
- Full URLs bypass this conversion and don't open in the overlay viewer
- Relative paths keep users in the app with ESC-dismissible overlays

**Correct pattern:**
- Link: `[Chapter 1](chapter-01.md)`
- Metadata: `"repo": "https://github.com/org/repo"` (base URL only, see next section)
- Result: ipynb-viewer converts to GitHub raw URL and opens in overlay

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "GitHub Markdown Overlay"

---

## Repository URL Pattern in Notebook Metadata

**Rule** (2026-01-13, corrected): Use the **base repository URL only**, without `/blob/`, `/tree/`, branch names, or subdirectory paths. The ipynb-viewer adds path components automatically.

**Why it matters:**
- ipynb-viewer constructs full URLs as: `${repoUrl}/blob/${branch}/${filename}`
- Then transforms to raw.githubusercontent.com for fetching content
- If metadata includes branch or path info, you get malformed URLs
- **Critical:** Verify actual file locations in the repository first

**Common errors:**
```
❌ "repo": "https://github.com/org/repo/tree/main/path"
   Problem: Includes /tree/main/ - ipynb-viewer adds /blob/main/ creating duplicates

❌ "repo": "https://github.com/org/repo/blob/main/path"
   Problem: Includes /blob/main/ - gets doubled when ipynb-viewer adds it

❌ "repo": "https://github.com/org/repo/packages/manuscript"
   Problem: Assumes files in subdirectory, but they're at root
```

**Correct pattern:**
```
✅ "repo": "https://github.com/org/repo"

   How ipynb-viewer constructs URLs:
   1. Metadata: https://github.com/org/repo
   2. Add path: /blob/main/chapter-01.md
   3. Full URL: https://github.com/org/repo/blob/main/chapter-01.md
   4. Transform: github.com → raw.githubusercontent.com, /blob/ → /
   5. Final: https://raw.githubusercontent.com/org/repo/main/chapter-01.md ✓
```

**Step-by-step verification:**
1. Find where chapter files actually exist in repository
2. Test raw URL manually: `curl -I https://raw.githubusercontent.com/org/repo/main/chapter-01.md`
3. If 404, files may be in subdirectory - check repository structure
4. Use base repo URL if files at root, or include path if in subdirectory
5. **Never** include `/blob/`, `/tree/`, or branch name in metadata

**GitHub URL patterns:**
- `/tree/main/path` = directory listing (web interface)
- `/blob/main/file` = file view (web interface)
- `/main/file` = raw content (API/download)
- **Metadata should be**: Base repo only (no tree, blob, or branch)

**Real example (invisible-users-manuscript):**
```
Repository structure: Chapter files at root level
✅ Correct: "repo": "https://github.com/.../invisible-users-manuscript"
❌ Wrong:   "repo": "https://github.com/.../invisible-users-manuscript/packages/manuscript/manuscript"
```

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Smart Links and GitHub Integration"

---

## Notebook Heading Levels for VSCode Outline

**Rule** (2026-01-13): All major parts/sections in Jupyter notebooks must use level-2 headings (`##`) to appear in VSCode's notebook outline sidebar. Using level-3 headings (`###`) causes sections to appear as sub-items or be hidden.

**Why it matters:**
- VSCode notebook outline displays level-2 headings (`##`) as main navigation items
- Level-3 headings (`###`) appear nested under level-2 or may not show in outline at all
- Inconsistent heading levels break navigation structure and user experience
- Authors expect all numbered parts (Part 1, Part 2, etc.) to be visible at same outline level

**Common error:**
```markdown
❌ ### 💡 Part 12: What Agent Creators Must Build
   Problem: Level-3 heading doesn't appear in outline as main item

❌ ---## Part 9: The Platform Race
   Problem: Horizontal rule (---) directly attached to heading breaks syntax
```

**Correct pattern:**
```markdown
✅ ## Part 1: The Discovery
✅ ## Part 2: Understanding Invisible Failures
✅ ## Part 3: The Accessibility Connection
✅ ## 💡 Part 12: What Agent Creators Must Build

   All parts use level-2 headings (##) consistently
   Emojis are fine, just maintain ## heading level
```

**How to verify:**
1. Open notebook in VSCode
2. Check outline sidebar (shows notebook structure)
3. All major parts should appear at same indentation level
4. If a part is missing or nested, check heading level in that cell

**VSCode outline hierarchy:**
- `## Heading` = Main outline item (always visible)
- `### Heading` = Sub-item under previous `##` heading
- `#### Heading` = Nested further under `###`

**Real example (invisible-users/notebook.ipynb):**
- **Issue 1**: Part 12 used `###` (level-3) and was missing from outline
  - Fix: Changed to `##` (level-2) for consistency
- **Issue 2**: Part 9 had markdown lines without proper `\n` newline characters
  - Fix: Added `\n` to end of each line (except last) in source array
  - Result: VSCode outline now parses and displays Part 9 correctly

**Technical note on Jupyter notebook line formatting:**
Jupyter notebook cells store markdown source as an array of strings. Each line should end with `\n` (newline character) for proper rendering in most viewers:

```python
# Correct format
"source": [
  "## Part 9: The Platform Race\n",
  "\n",
  "Content here\n"
]

# Broken format (missing newlines)
"source": [
  "## Part 9: The Platform Race",
  "",
  "Content here"
]
```

Missing newlines can cause:
- VSCode outline to skip or misparse headings
- Some markdown renderers to concatenate lines incorrectly
- Inconsistent behavior across different notebook viewers

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Markdown Cells" and VSCode notebook outline behavior

---

## Emojis in Jupyter Notebook Headings Cause Rendering Issues

**Rule** (2026-01-13): Avoid using emojis in Jupyter notebook headings (##, ###, etc.). Emojis can cause text concatenation and spacing issues when notebooks are rendered in ipynb-viewer or other display contexts.

**Why it matters:**
- Emojis between heading markers and text can prevent proper word breaks
- Rendered content may show text running together without spaces
- Different viewers handle emoji rendering inconsistently
- Currency symbols (£, $, €) and punctuation should be preserved - only emoji characters should be removed

**Problem example from screenshot:**
```markdown
❌ ## 💡 Part 12: What Agent Creators Must Build
❌ ### 🛡️ Validation Layers & Guardrails

Result: Text renders as "Validation Layers & GuardrailsThethe six guardrails..."
(no space between heading and following text)
```

**Correct pattern:**
```markdown
✅ ## Part 12: What Agent Creators Must Build
✅ ### Validation Layers & Guardrails

Result: Proper spacing and rendering
```

**What to preserve:**
- Currency symbols: £, $, €, ¥
- Punctuation marks
- Accented characters
- Standard Unicode symbols

**What to remove:**
- Emoji pictographs (😀, 🎉, 💡, etc.)
- Emoji symbols (📚, 🛡️, 🏁, etc.)
- Emoji modifiers and variation selectors

**Technical details:**
- Emojis typically in Unicode ranges U+1F600-U+1F64F (emoticons), U+1F300-U+1F5FF (symbols), U+1F680-U+1F6FF (transport)
- Python regex pattern for removal:
  ```python
  emoji_pattern = re.compile(
      "["
      "\U0001F600-\U0001F64F"  # emoticons
      "\U0001F300-\U0001F5FF"  # symbols & pictographs
      "\U0001F680-\U0001F6FF"  # transport & map
      "]+",
      flags=re.UNICODE
  )
  ```

**Impact on action cards:**
When removing emojis from headings, remember to update action card links to match:
- If heading changes from "💡 Key Insight" to "Key Insight"
- Update corresponding action card link: `[Key Insight](#)` instead of `[💡 Key Insight](#)`
- Smart link resolution requires link text to match heading text (fuzzy matching applies)

**Real example (invisible-users/notebook.ipynb):**
- Removed emojis from 19 cells including headings in cells 1, 7, 37, 38, 40
- Fixed broken action card links after emoji removal
- Validation score restored to 100/100

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Markdown Cells" - heading formatting best practices

---

## Jupyter Notebook Cell Source Must Use Proper Newlines

**Rule** (2026-01-13): Every line in a Jupyter notebook cell's source array must end with `\n` (newline character) except the last line. Storing all content as a single massive string without newlines breaks VSCode outline parsing and prevents sub-headings from being detected.

**Why it matters:**
- VSCode notebook outline parser requires proper line breaks to detect headings
- A cell with content stored as one string (e.g., `"source": ["### Heading..."]`) prevents VSCode from seeing the `###` or `####` sub-headings
- Without newlines, VSCode can't build the outline tree structure
- Users won't see sub-sections when expanding parts in the outline sidebar
- Proper newlines ensure consistent rendering across all notebook viewers

**Problem example (Cell 40 from invisible-users/notebook.ipynb):**
```python
# ❌ WRONG - All content in single string without newlines
"source": [
  "### Platform Race & Identity Delegation**Navigating the competitive landscape (January 2026 update)**The missing piece this chapter described - a universal identity delegation layer - now has **three competing implementations** launched within seven days.---#### What Actually Happened: Seven-Day Acceleration**January 5-11, 2026:** Three major platforms launched agent commerce systems:1. **Agentic Commerce Protocol (ACP)**..."
]

Result: VSCode outline shows no sub-sections when Part is expanded
```

**Correct pattern:**
```python
# ✅ CORRECT - Each line ends with \n, proper structure
"source": [
  "### Platform Race & Identity Delegation\n",
  "\n",
  "**Navigating the competitive landscape (January 2026 update)**\n",
  "\n",
  "The missing piece this chapter described - a universal identity delegation layer - now has **three competing implementations** launched within seven days.\n",
  "\n",
  "---\n",
  "\n",
  "#### What Actually Happened: Seven-Day Acceleration\n",
  "\n",
  "**January 5-11, 2026:** Three major platforms launched agent commerce systems:\n",
  "\n",
  "1. **Agentic Commerce Protocol (ACP)** - OpenAI/Stripe (September 2024, expanded January 2026)\n",
  "   - Open standard (Apache 2.0 license)\n",
  "   - Powers \"Instant Checkout\" in ChatGPT\n",
  "   - 1M+ merchants on Shopify/Etsy\n"
]

Result: VSCode outline shows all 7 sub-sections (####) when Part is expanded
```

**Key formatting rules:**
1. **Every line ends with `\n`** - Except the very last line in the source array
2. **Headings need newlines** - Both before and after heading lines
3. **Horizontal rules need newlines** - `"---\n"` followed by `"\n"`
4. **Paragraphs separated** - Blank line (`"\n"`) between paragraphs
5. **Lists properly formatted** - Newlines after each list item

**How to fix:**
If you have a cell with massive single-line string:
1. Split content at structural boundaries (headings, horizontal rules, paragraphs)
2. Add `\n` to end of each line except the last
3. Verify with VSCode outline - all sub-sections should be visible

**Real example fix (invisible-users/notebook.ipynb Cell 40):**
- **Before**: 1 line (massive string) - 0 sub-sections visible in outline
- **After**: 177 lines (properly formatted) - 7 sub-sections visible in outline
- **Result**: VSCode outline now shows all `####` headings as expandable sub-items

**Common symptoms:**
- Parts appear in VSCode outline but have no sub-sections when expanded
- "The parts need more than one sub section in their expansion"
- Cells with many `####` headings showing as flat content
- Validation passes (100/100) but outline structure is broken

**Validation note:**
The notebook-validator script does NOT catch this issue because:
- It validates smart links, structure, part flow - not visual rendering
- Missing newlines don't break smart links or part detection
- This is a VSCode outline parsing issue, not a structural validation issue

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Markdown Cells" - proper source array formatting for VSCode compatibility

---

## GitHub Raw Content URL Format - No /raw/ in Path

**Rule** (2026-01-13): When converting GitHub repository URLs to raw content URLs, do NOT include `/raw/` in the path. The correct format is `raw.githubusercontent.com/{org}/{repo}/{branch}/{path}`, not `raw.githubusercontent.com/{org}/{repo}/raw/{branch}/{path}`.

**Why it matters:**
- GitHub's raw content server uses a different URL structure than the web interface
- Adding an extra `/raw/` in the path causes 404 errors
- This affects image loading, markdown file fetching, and any direct content access
- The bug was hidden because it only manifests when files are actually fetched

**Common error:**
```javascript
❌ const rawUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/raw/${branch}/${path}`;
   Result: https://raw.githubusercontent.com/org/repo/raw/main/file.svg (404 error)

✅ const rawUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/${branch}/${path}`;
   Result: https://raw.githubusercontent.com/org/repo/main/file.svg (200 OK)
```

**URL format comparison:**
- **Web interface**: `https://github.com/org/repo/blob/main/path/file.svg`
  - Uses `/blob/` to indicate file view
  - Renders file in GitHub's web UI
- **Raw content**: `https://raw.githubusercontent.com/org/repo/main/path/file.svg`
  - No `/blob/` or `/raw/` in path
  - Returns file contents directly
  - Used for fetching, embedding, downloading

**Real example (invisible-users SVG inlining):**
- **Bug**: `https://raw.githubusercontent.com/Digital-Domain-Technologies-Ltd/invisible-users-manuscript/raw/main/illustrations/chapter-02-illustration.svg` → 404
- **Fix**: `https://raw.githubusercontent.com/Digital-Domain-Technologies-Ltd/invisible-users-manuscript/main/illustrations/chapter-02-illustration.svg` → 200

**How the bug occurred:**
1. Code converted repo URL: `github.com` → `raw.githubusercontent.com` ✓
2. Code added path: `/raw/${branch}/${path}` ✗ (extra `/raw/` is wrong)
3. Result: Double "raw" in URL (once in domain, once in path)
4. GitHub raw server returned 404 because path doesn't exist

**Correct conversion pattern:**
```javascript
// From: https://github.com/org/repo
// To:   https://raw.githubusercontent.com/org/repo/main/path/file

const repoUrl = 'https://github.com/org/repo';
const branch = 'main';
const path = 'illustrations/file.svg';

// ✅ Correct
const rawUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/${branch}/${path}`;

// ❌ Wrong - adds /raw/ in path
const wrongUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/raw/${branch}/${path}`;
```

**Testing raw URLs:**
```bash
# Test with curl to verify URL works
curl -I https://raw.githubusercontent.com/org/repo/main/path/file.svg

# Should return: HTTP/2 200
# If returns 404, check for extra /raw/ in path
```

**Where this bug appeared:**
- File: `blocks/ipynb-viewer/ipynb-viewer.js`
- Line: 159 (in `parseMarkdown` function)
- Impact: All images referenced in notebooks were getting 404 errors
- Fix: Removed `/raw/` from path construction

**Related learnings:**
- See "Repository URL Pattern in Notebook Metadata" (earlier in this file)
- Both learnings relate to proper GitHub URL construction
- One focuses on metadata format, this one on raw content URLs

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Smart Links and GitHub Integration" - URL resolution patterns

---