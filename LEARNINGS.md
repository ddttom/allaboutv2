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
- Metadata: `"repo": "https://github.com/org/repo/tree/main/path/to/files"`
- Result: ipynb-viewer converts to GitHub raw URL and opens in overlay

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "GitHub Markdown Overlay"

---

## Repository URL Pattern in Notebook Metadata

**Rule** (2026-01-13): Use `/blob/main/` pattern in notebook metadata repo URLs, NOT `/tree/main/`. The wrong pattern causes 404 errors when ipynb-viewer transforms URLs to fetch raw content.

**Why it matters:**
- ipynb-viewer transforms GitHub URLs to raw.githubusercontent.com for fetching markdown
- Transformation: `github.com` → `raw.githubusercontent.com`, `/blob/` → `/`
- But `/tree/main/` doesn't transform correctly, creating malformed URLs
- Results in double `/main/` in the URL (one from `tree/main`, one from the path)

**Error example:**
```
❌ Metadata: "repo": "https://github.com/.../tree/main/packages/manuscript/manuscript"
❌ Result:   https://raw.githubusercontent.com/.../tree/main/.../main/chapter-01.md (404)
   Problem:  Double 'main', malformed URL structure
```

**Correct pattern:**
```
✅ Metadata: "repo": "https://github.com/.../blob/main/packages/manuscript/manuscript"
✅ Result:   https://raw.githubusercontent.com/.../main/packages/manuscript/manuscript/chapter-01.md
   Success:  Clean single 'main', correct URL structure
```

**GitHub URL patterns explained:**
- `/tree/main/` = directory listing (web interface)
- `/blob/main/` = file view (web interface) ← **Use this in metadata**
- `/main/` = raw content (API/download)

**Correct transformation flow:**
1. Metadata: `.../blob/main/packages/manuscript/manuscript`
2. ipynb-viewer removes `/blob/`: `.../main/packages/manuscript/manuscript`
3. Appends filename: `.../main/packages/manuscript/manuscript/chapter-01.md`
4. Result: Valid raw content URL ✓

**Documentation:** See `blocks/ipynb-viewer/README.md` section on "Smart Links and GitHub Integration"

---