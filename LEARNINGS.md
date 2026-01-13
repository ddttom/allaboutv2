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