# Learnings

Critical insights for AI assistants working on this project. Focus: actionable guidance, not historical changelog.

---

## ipynb-viewer: Tree Navigation Must Include All Heading Levels

**Rule** (2026-01-14): When extracting headings for tree navigation, include ALL heading levels (h1, h2, h3), not just h2. Filtering out h3 headings creates invisible gaps in the navigation tree.

**Why it matters:**

- Notebooks often use h3 (###) for subsections within parts
- Users expect ALL headings to appear in the navigation tree
- Missing h3 headings breaks the logical flow of content
- Example: "Part 1: The Discovery" → "The Pagination Problem" (h3) → "The Broader Investigation" (h3)

**Bug that occurred:**

```javascript
// ❌ WRONG - Excludes h3 headings
const partHeading = lines.find((line) => {
  const trimmed = line.trim();
  return trimmed.startsWith('##') && !trimmed.startsWith('###');
});
```

This explicitly filtered OUT h3 headings with the condition `!trimmed.startsWith('###')`, causing cells like "The Pagination Problem" and "The Broader Investigation" to disappear from the tree.

**Correct pattern:**

```javascript
// ✅ CORRECT - Includes all heading levels
const partHeading = lines.find((line) => {
  const trimmed = line.trim();
  return trimmed.startsWith('#'); // Matches h1, h2, h3, h4, etc.
});
```

**Impact:** All notebook cells with headings now appear in tree navigation, maintaining complete structural visibility.

**Documentation:** See `blocks/ipynb-viewer/ipynb-viewer.js` lines 1448-1473 (extractHeadingFromRaw function)

**Commit:** 4a13457e

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

## ipynb-viewer: Distinguish Markdown Cells from Repository Navigation

**Rule** (2026-01-14): When a user reports spacing issues in "ipynb-viewer", always clarify which structure they're referring to. There are two completely different areas with different CSS rules.

**Why it matters:**

- The ipynb-viewer block has two distinct UI areas with separate CSS classes
- "Markdown cells" and "Repository view" are visually adjacent but structurally different
- Applying fixes to the wrong area wastes time and creates confusion
- User language like "repository view" can be ambiguous without context

**Two distinct structures:**

1. **Markdown Cell Content** (main content area)
   - Class: `.ipynb-markdown-cell .ipynb-cell-content`
   - Contains: Rendered notebook markdown (paragraphs, lists, headings, code blocks)
   - Styling: Paragraph margins (`p`), line-height, list spacing (`ul`, `ol`, `li`)
   - Location: Central/right content area (blue background in overlays)
   - CSS lines: 209-311 in ipynb-viewer.css

2. **Repository Navigation Tree** (sidebar)
   - Class: `.ipynb-nav-tree-panel`, `.ipynb-nav-tree-item`
   - Contains: Tree structure with folders, files, and navigation items
   - Styling: Tree item padding, gap between items, background colors
   - Location: Left sidebar (dark background)
   - CSS lines: 1939-2117 in ipynb-viewer.css

**Common confusion patterns:**

```
❌ User: "The spacing in repository view is too much"
   AI assumes: They mean the navigation tree sidebar
   AI applies: Changes to .ipynb-nav-tree-item padding
   Reality: User meant the markdown content rendering (cells)
   Result: Wrong CSS changed, issue persists

✅ User: "The spacing in repository view is too much"
   AI asks: "Do you mean the markdown cell content (blue area) or the navigation tree (left sidebar)?"
   User clarifies: "The markdown cells"
   AI applies: Changes to .ipynb-markdown-cell p margin and line-height
   Result: Correct fix applied
```

**How to clarify when user mentions "spacing" or "repository":**

Use AskUserQuestion to clarify with visual descriptions:

```javascript
{
  "question": "Which area has the spacing issue?",
  "options": [
    {
      "label": "Markdown cell content",
      "description": "The main content area showing rendered notebook text, lists, headings"
    },
    {
      "label": "Repository navigation tree",
      "description": "The left sidebar with folder/file listings"
    },
    {
      "label": "Both areas",
      "description": "Both the content and navigation need spacing adjustments"
    }
  ]
}
```

**CSS reference for each structure:**

**Markdown Cell Content:**

- Paragraphs: `.ipynb-markdown-cell .ipynb-cell-content p { margin: 0.25em 0; }`
- Line height: `.ipynb-markdown-cell .ipynb-cell-content { line-height: 1.4; }`
- Headings: `.ipynb-markdown-cell h1/h2/h3 { margin-top: 0.75rem; margin-bottom: 0.25rem; }`
- Lists: `.ipynb-markdown-cell ul/ol { margin: 0.5rem 0; }`
- List items: `.ipynb-markdown-cell li { margin: 0; }`
- List paragraphs: `.ipynb-markdown-cell li p { margin: 0; }`

**Repository Navigation Tree:**

- Tree items: `.ipynb-nav-tree-item { padding: 0.5rem 1rem; gap: 0.5rem; }`
- Root nodes: `.ipynb-nav-tree-item[data-type="root"] { margin-bottom: 0.25rem; }`

**Real example (2026-01-14):**

- **Issue**: User showed screenshot saying "repository view" spacing too deep
- **Confusion**: AI assumed navigation tree sidebar needed fixing
- **Reality**: User meant markdown cell content (the rendered notebook content)
- **Fix**: Added clarifying question, then adjusted paragraph margins, line-height, and heading spacing in markdown cells
- **Result**: Correct CSS modified after clarification

**Best practice:**

1. When user mentions "spacing" without specifying area, ask for clarification
2. Use visual descriptions in questions (not just class names)
3. Reference screenshots if provided to confirm which area
4. Check CSS line numbers to ensure changes target correct structure

**Documentation:** See `blocks/ipynb-viewer/block-architecture.md` section on "Key Components" - Navigation Tree vs Markdown Rendering

---

## ipynb-viewer: Refactor Duplicate Implementations into Unified Functions

**Rule** (2026-01-14): When you discover duplicate code implementations in separate contexts (like paged overlay vs GitHub markdown overlay), refactor them into a single reusable factory function. Don't debug duplicate implementations - unify them first.

**Why it matters:**

- Duplicate implementations create debugging nightmares - you don't know which code is running
- Separate implementations make it hard to identify context (notebook mode vs GitHub mode)
- Code duplication violates DRY principle and increases maintenance burden
- Unified functions enable centralized logging and consistent behavior

**Real example - Home button duplication (2026-01-14):**

**Problem:**

```javascript
// Paged overlay (lines 1984-2016) - Notebook mode home button
let homeButton;
if (isNotebookMode) {
  homeButton = document.createElement('button');
  homeButton.className = 'ipynb-overlay-button ipynb-home-button';
  // ... setup code ...
  homeButton.addEventListener('click', (e) => {
    // Navigate to cell 0
  });
}

// GitHub markdown overlay (lines 2994-3012) - GitHub mode home button
const homeButton = document.createElement('button');
homeButton.className = 'ipynb-overlay-button ipynb-home-button';
// ... setup code ...
homeButton.addEventListener('click', (e) => {
  // Navigate to first markdown
});
```

**Issues with this approach:**

- Two separate button creation processes with near-identical code
- Debug logs unclear which button was clicked
- Can't tell if user is in notebook mode or GitHub mode
- Changes need to be applied to both implementations
- Wasted time debugging "which button is this?"

**Solution:**

Create a unified factory function with context tracking:

```javascript
/**
 * Create unified home button for both paged overlay and GitHub markdown overlay
 * @param {Object} config - Configuration object
 * @param {string} config.context - Context identifier ('notebook' or 'github')
 * @param {Function} config.onClick - Click handler function
 * @param {string} [config.ariaLabel='Go home'] - Aria label for accessibility
 * @returns {HTMLElement} Home button element
 */
function createHomeButton(config) {
  const { context, onClick, ariaLabel = 'Go home' } = config;

  const homeButton = document.createElement('button');
  homeButton.type = 'button';
  homeButton.className = 'ipynb-overlay-button ipynb-home-button';
  homeButton.innerHTML = '🏠';
  homeButton.setAttribute('aria-label', ariaLabel);
  homeButton.setAttribute('title', 'Home');
  homeButton.setAttribute('data-context', context); // Track context

  console.log(`[HOME BUTTON] Created button for context: ${context}`);

  homeButton.addEventListener('click', (e) => {
    console.log(`[HOME BUTTON] Clicked in context: ${context}`);
    e.preventDefault();
    e.stopPropagation();

    // Clear URL hash
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Call context-specific handler
    onClick(e);
  });

  return homeButton;
}
```

**Usage in paged overlay (notebook mode):**

```javascript
homeButton = createHomeButton({
  context: 'notebook',
  ariaLabel: 'Go to first cell',
  onClick: () => {
    paginationState.currentPage = 0;
    updatePageDisplay(true);
  },
});
```

**Usage in GitHub markdown overlay:**

```javascript
homeButton = createHomeButton({
  context: 'github',
  ariaLabel: 'Go to first page',
  onClick: () => {
    closeOverlay();
    const homeOverlay = createGitHubMarkdownOverlay(firstPageUrl, firstPageTitle, helpRepoUrl, branch, parentHistory);
    homeOverlay.openOverlay();
  },
});
```

**Benefits of unified approach:**

1. **Context clarity**: `data-context` attribute and logs show which mode is active
2. **DRY principle**: Common code (hash clearing, event handling) in one place
3. **Easier debugging**: Centralized logging with context identification
4. **Consistent behavior**: Hash clearing, event handling identical in both modes
5. **Maintainability**: Changes apply to all usages automatically
6. **Flexibility**: Context-specific behavior via onClick callback

**Pattern recognition:**

When you see code like this:

```javascript
// In function A
const button = createElement();
button.addEventListener('click', () => { /* do thing A */ });

// In function B
const button = createElement();
button.addEventListener('click', () => { /* do thing B */ });
```

Refactor to:

```javascript
function createButton(config) {
  const button = createElement();
  button.setAttribute('data-context', config.context);
  button.addEventListener('click', () => {
    console.log(`Clicked in context: ${config.context}`);
    config.onClick();
  });
  return button;
}

// Usage
createButton({ context: 'A', onClick: () => { /* do thing A */ } });
createButton({ context: 'B', onClick: () => { /* do thing B */ } });
```

**Best practice:**

1. Identify duplicate implementations early (code review, grep for similar patterns)
2. Create factory function with context parameter
3. Add centralized logging with context identification
4. Use callbacks for context-specific behavior
5. Add `data-*` attributes to track context in DOM
6. Refactor both usages to use unified function

**Documentation:** See `blocks/ipynb-viewer/ipynb-viewer.js` lines 2904-2963 for complete implementation

---

## ipynb-viewer: Markdown Ordered Lists Require list-style-type: none

**Rule** (2026-01-14): Jupyter notebook markdown cells that use ordered lists (1., 2., 3.) must have `list-style-type: none` applied to prevent duplicate numbering. The markdown parser already includes the numbers in the content, and browser auto-numbering creates visual duplication.

**Why it matters:**

- Jupyter notebook markdown stores explicit numbers: `1. They're invisible to site owners`
- Markdown parser converts to: `<ol><li>They're invisible to site owners</li></ol>`
- Browser's default ordered list styling adds its own `1.` marker before each `<li>`
- Result: `1. 1. They're invisible to site owners` (duplicate numbers)
- This is visually confusing and breaks the intended formatting

**Problem pattern:**

```markdown
Markdown source in notebook cell:
1. They're invisible to site owners
1. Your interface is partly invisible to them

Browser renders as:
1. 1. They're invisible to site owners
2. 1. Your interface is partly invisible to them
```

**Solution:**

```css
/* Remove browser's auto-numbering for ordered lists since content already contains numbers */
.ipynb-markdown-cell ol {
  list-style-type: none;
}
```

**Result:**

```
Displays correctly as:
1. They're invisible to site owners
1. Your interface is partly invisible to them
```

**Regression history:**

- **Original fix**: Commit 57a4b3d3 (2026-01-14 12:25) - Added `list-style-type: none`
- **Regression**: Commit 7f6dd772 (2026-01-14 15:06) - Accidentally removed rule during blockquote styling updates
- **Re-fixed**: Commit e4ecc9c1 (2026-01-14, refactor branch) - Restored the rule

**Why the regression occurred:**

The CSS rule was accidentally deleted when updating blockquote styles for `.ipynb-github-md-overlay`. The deletion happened in the same block of changes and wasn't related to the blockquote updates - it was an editing mistake during conflict resolution or manual deletion.

**Prevention pattern:**

When modifying CSS files with many similar selectors:

1. **Before editing**: Note nearby rules that should NOT be touched
2. **During editing**: Make surgical changes - only modify target selectors
3. **After editing**: Review diff to ensure no unintended deletions
4. **Watch for**: Rules that are separated by blank lines getting accidentally removed

**Common mistake pattern:**

```diff
 /* Blockquote styling */
 .selector1 { ... }

-/* Important rule */
-.selector2 { ... }  ← Accidentally deleted
-
 .selector3 { ... }
```

**Best practice:**

If you need to modify multiple related selectors (like adding `.ipynb-github-md-overlay` to blockquote rules), make changes to ONLY those selectors. Don't delete or modify unrelated rules even if they're in the same CSS section.

**Documentation:** See `blocks/ipynb-viewer/ipynb-viewer.css` lines 302-305 for current implementation

---

## ipynb-viewer: parseMarkdown() Uses <br> Tags, Not <p> Tags

**Rule** (2026-01-14): The `parseMarkdown()` function in ipynb-viewer converts double newlines to `<br><br>` tags, NOT `<p>` tags. When targeting spacing in GitHub markdown overlays, you must target `<br>` elements, not `<p>` elements.

**Why it matters:**

- CSS rules targeting `p` elements have zero effect because no `<p>` elements exist
- The excessive spacing comes from `<br><br>` tags creating large gaps
- This is a fundamental architecture decision in the markdown parser
- Debugging "why isn't my CSS working?" wastes hours if you don't know this

**Problem pattern:**

```css
/* ❌ WRONG - No effect because parseMarkdown doesn't create <p> tags */
.ipynb-github-md-overlay .ipynb-manual-content-area p {
  margin: 0.15rem 0 !important;
}
```

**Root cause in code:**

```javascript
// File: blocks/ipynb-viewer/ipynb-viewer.js, line 397
// Line breaks - only convert double newlines to paragraph breaks
html = html.replace(/\n\n+/g, '<br><br>'); // Double+ newlines become paragraph breaks
html = html.replace(/\n/g, ' '); // Single newlines become spaces
```

**Correct solution:**

```css
/* ✅ CORRECT - Target br elements which actually exist */
.ipynb-github-md-overlay .ipynb-manual-content-area br {
  display: block !important;
  margin: 0.15rem 0 !important;
  line-height: 0.15rem !important;
}

/* Hide consecutive br tags to remove double-br spacing */
.ipynb-github-md-overlay .ipynb-manual-content-area br + br {
  display: none !important;
}
```

**Why this architecture exists:**

- Simple markdown parser without complex paragraph detection
- `<br><br>` is easier to generate than proper `<p>` wrapping
- Works consistently across all markdown content types
- Minimal parsing logic - just regex replacements

**Impact of this discovery:**

- **Before**: 5 attempts to fix spacing, all targeting `p` elements → no effect
- **After**: Targeting `br` elements → spacing fixed immediately
- **Time wasted**: ~1 hour debugging why CSS wasn't applying
- **Root cause**: Assumptions about HTML structure without inspecting generated output

**How to verify HTML structure:**

1. Open browser DevTools (F12)
2. Inspect the content area element
3. Look at the actual HTML generated by `parseMarkdown()`
4. Check what elements exist (br vs p vs div)
5. Write CSS rules for the actual structure, not the assumed structure

**Real example (2026-01-14):**

- **User report**: "Spacing in GitHub markdown is too much" (5 times)
- **Initial attempts**: Targeted `p` elements, added `!important`, reduced margins progressively
- **Problem**: Rules had zero effect because no `<p>` elements exist
- **Discovery**: Inspected code at line 397, found `<br><br>` pattern
- **Solution**: Target `br` elements and hide consecutive pairs
- **Result**: Spacing fixed immediately

**Best practice:**

When debugging CSS that "isn't applying":

1. **Verify the HTML structure** - Use DevTools to inspect actual DOM
2. **Don't assume** - Just because you expect `<p>` tags doesn't mean they exist
3. **Check the renderer** - Look at how content is generated (parseMarkdown, renderCell, etc.)
4. **Test in isolation** - Add a bright background color to verify selector matches
5. **Read the source** - 5 minutes reading code beats 1 hour of trial-and-error

**Documentation:**
- Parser implementation: `blocks/ipynb-viewer/ipynb-viewer.js` lines 395-400
- CSS fix: `blocks/ipynb-viewer/ipynb-viewer.css` lines 1819-1864
- Commit: c10eed55

---
