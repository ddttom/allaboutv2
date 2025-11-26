# AllAboutV2 Project Guide

## Quick Reference

### For AI Assistants
- **Comprehensive Documentation**: See `docs/for-ai/` directory (26 detailed guides)
- **Claude Code Tools**: See `.claude/` directory (19 commands, 26 skills, 6 agents, 2 hooks)
- **Start Here**: `docs/for-ai/index.md` for complete navigation
- **Agents**: See `.claude/agents_README.md` for autonomous task handlers

### Common Workflows
- **Create new block**: Use `/new-block <name>` command (follows Content Driven Development)
- **Test a block**: Use `/test-block <name>` command or open `test.ipynb` in JSLab
- **Interactive testing**: Use Jupyter notebooks with context-aware execution
- **Create educational notebook**: Use `/create-notebook` for tutorials, guides, and demos
- **Share executable demos**: Use ipynb-viewer block for end-user interaction
- **Review documentation**: Use `/review-docs` command
- **Run all linting**: Use `/lint-all` command or `npm run lint`

## Commands

### NPM Scripts
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run lint` - Run all linting
- `npm run debug` - Run local development server (server.js is READ-ONLY)

## ⚠️ CRITICAL: server.js is READ-ONLY

**NEVER modify server.js** - it is a readonly debug tool for local development.

**Why this matters:**
- `server.js` is a simple static file server with proxy fallback
- It's meant to be a minimal, unchanging debug tool
- Any URL handling must be done in the application code, not the server
- The server only does: serve local files → proxy to production if missing

**When you need URL interception:**
- ✅ **DO** handle URL transformations in the application (e.g., ipynb-viewer)
- ✅ **DO** try multiple fetch strategies in the client code
- ❌ **DON'T** modify server.js to add custom URL routing
- ❌ **DON'T** add special-case handling to server.js

**See:** Smart link handling in `blocks/ipynb-viewer/ipynb-viewer.js` for proper client-side URL resolution

### Slash Commands (Claude Code)
**Block Development:**
- `/new-block <name>` - Create a new EDS block following Content Driven Development process
- `/start-cdd` - Start Content Driven Development process for creating or modifying blocks
- `/test-block <name>` - Run tests for a specific EDS block
- `/deploy-block <name>` - Deploy a block from build/ directory to blocks/ directory
- `/check-block <name>` - Analyze a block and provide architecture review and improvement suggestions

**Notebooks:**
- `/create-notebook` - Create educational/interactive Jupyter notebooks (tutorials, guides, blogs)
- `/create-presentation` - Create or update presentation-mode notebooks with embedded HTML/JS blocks
- `/jupyter-notebook` - Create or edit Jupyter notebooks for testing EDS blocks interactively
- `/validate-notebook` - Validate notebook for production readiness (smart links, structure, quality)

**Project Utilities:**
- `/lint-all` - Run all linting checks (JavaScript and CSS) across the project
- `/check-security` - Run security checklist validation based on EDS security guidelines
- `/review-docs` - Review and understand the EDS documentation structure in docs/for-AI
- `/dev-docs` - Create comprehensive strategic plan with structured task breakdown
- `/find-block-content` - Find pages in the site that use a specific block

See `.claude/README.md` for complete slash command reference (19 total).

### Agents (Claude Code)
For complex, multi-step tasks, use autonomous agents:

**Code Quality & Architecture:**
- `code-architecture-reviewer` - Review block implementations and architectural consistency
- `code-refactor-master` - Refactor blocks, scripts, and code organization
- `documentation-architect` - Document blocks, features, and development patterns

**Planning & Research:**
- `plan-reviewer` - Review implementation plans before starting work
- `refactor-planner` - Plan comprehensive code reorganization
- `web-research-specialist` - Research EDS patterns and best practices

**Usage:** Ask Claude to "Use the [agent-name] agent to [task]"

See `.claude/agents_README.md` for complete agent documentation.

### Hooks (Claude Code)
Active hooks that enhance development workflow:

**skill-activation-prompt.sh**
- Auto-suggests relevant skills based on prompt content
- Runs when you submit a prompt
- TypeScript-based pattern matching

**post-tool-use-tracker.sh**
- Tracks modified files for session context
- Runs after file edits (Edit, MultiEdit, Write)
- Lightweight bash script

See `.claude/hooks/CONFIG.md` for configuration and customization.

## Code Style
- **JS**: Follows Airbnb style guide (eslint-config-airbnb-base)
- **CSS**: Follows stylelint-config-standard
- **Block Structure**: Each block has its own directory with JS/CSS/README
- **Naming**: Use kebab-case for files and block names
- **JS Modules**: Use ES modules with named exports
- **Error Handling**: Use try/catch with graceful degradation
- **DOM Manipulation**: Use vanilla JS DOM methods

## Architecture
- Project follows Adobe Helix/Franklin (EDS - Edge Delivery Services) architecture
- Blocks are independent web components with isolated functionality
- Configuration in /config directory with environment-specific variables
- Scripts loaded via head.html and scripts.js

### Dual-Directory Pattern
- **`/blocks/`** - Production-ready EDS blocks (simple components or deployed build output)
- **`/build/`** - Development workspace for complex components with external dependencies
- See `docs/for-ai/implementation/build-blocks-clarification.md` for details

## Conventions
- Keep code DRY, simple, and accessible
- Add README for each new block with usage examples
- Responsive design throughout all components
- Never use Typescript or any Framework like React
- **ALWAYS follow Content Driven Development (CDD)** when creating or modifying blocks
  - Content models before code
  - Test content before implementation
  - Author needs before developer needs

## ⚠️ CRITICAL: Single JavaScript File for Block Variations

**Each EDS block must have exactly ONE JavaScript file, regardless of variations.**

**NEVER create multiple JavaScript files:**
- ❌ `blockname.js`, `blockname-variation1.js`, `blockname-variation2.js`
- ❌ `view-myblog.js`, `view-myblog-ai.js`

**ALWAYS use class detection in the single JavaScript file:**

```javascript
export default async function decorate(block) {
  // Detect variation by checking for class
  const isVariationA = block.classList.contains('variation-a');

  if (isVariationA) {
    // Handle variation A logic
    const data = await fetchAndFilterData();
    renderVariationA(block, data);
  } else {
    // Handle default variation
    renderStandard(block);
  }
}
```

**Why this matters:**
- **EDS Convention**: System expects one JS file per block
- **Maintainability**: All logic in one place
- **Performance**: No multiple file loads
- **Consistency**: Follows CSS variation pattern

**See:** `.claude/skills/eds-block-development/SKILL.md` and `docs/for-ai/eds.md` for complete details.

## ⚠️ CRITICAL: Event Listeners and DOM Cloning

**Event listeners are NOT copied when using `cloneNode()`**

When working with the ipynb-viewer block or similar components that clone DOM elements:

**The Problem:**
```javascript
// Original element has event listener
element.addEventListener('click', handler);

// Clone does NOT have the event listener
const clone = element.cloneNode(true);  // ❌ Event listener lost!
```

**The Solution:**
Always re-attach event listeners after cloning elements:

```javascript
// After cloning cells in updatePageDisplay()
const clonedCell = cell.cloneNode(true);
container.appendChild(clonedCell);

// ✅ Re-attach ALL event listeners
const links = clonedCell.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', handler);
});
```

**In ipynb-viewer specifically:**
- Smart links (hash `#` navigation) - handlers re-attached in `updatePageDisplay()`
- GitHub markdown links (`.md` files) - handlers re-attached in `updatePageDisplay()`
- Run buttons on code cells - handlers re-attached in `updatePageDisplay()`

**See:** `blocks/ipynb-viewer/ipynb-viewer.js` lines 1292-1303 (run buttons), 1347-1388 (hash links), 1390-1400 (GitHub links)

## ⚠️ CRITICAL: ipynb-viewer Smart Link Pattern

**All `.md` links in ipynb-viewer are treated as smart links using the repository URL pattern.**

When a notebook has a `repo` metadata attribute (e.g., `"repo": "https://github.com/user/repo"`), all `.md` file links are automatically converted to GitHub URLs and opened in overlays:

**How it works:**
1. Markdown links like `[docs](docs/help.md)` are detected
2. Converted to full GitHub URL: `https://github.com/user/repo/blob/main/docs/help.md`
3. Stored in `data-md-url` attribute with `href="#"` to prevent prefetch
4. Click handler fetches from GitHub raw URL and displays in overlay

**CRITICAL: Smart links ALWAYS use GitHub repo URLs**
- ✅ **DO** use ONLY the GitHub repo URL from notebook metadata
- ✅ **DO** fetch from `raw.githubusercontent.com` (converted from blob URL)
- ✅ **DO** rely on the smart link pattern for consistency
- ❌ **DON'T** try local paths before GitHub
- ❌ **DON'T** bypass smart links by fetching local files directly
- ❌ **DON'T** hardcode local paths like `/docs/help.md`

**Why this matters:**
- The `repo` attribute in notebook metadata is the single source of truth
- Local development server proxies missing files to production (including GitHub raw URLs)
- Smart links work identically in development and production
- No special-casing for local vs production environments

**Example - Regular .md link in cell:**
```javascript
// ✅ CORRECT: Uses repo metadata
const cleanPath = 'docs/guide.md';
const fullUrl = `${repoUrl}/blob/main/${cleanPath}`;
const overlay = createGitHubMarkdownOverlay(fullUrl, 'Guide');
```

**Help button uses separate `help-repo` metadata:**
- Notebooks have two repo attributes: `repo` (for content) and `help-repo` (for help docs)
- `help-repo` fallback: help-repo → repo → allaboutV2 default
- This keeps viewer help documentation separate from notebook content
- Example: notebook might be from `user/my-project` but help comes from `ddttom/allaboutV2`

```javascript
// Help button implementation
const helpRepoUrl = notebook.metadata?.['help-repo'] ||
                    notebook.metadata?.repo ||
                    'https://github.com/ddttom/allaboutV2';
const fullUrl = `${helpRepoUrl}/blob/main/docs/help.md`;
```

**See:**
- Help button: `blocks/ipynb-viewer/ipynb-viewer.js` line 1210-1219
- Metadata handling: `blocks/ipynb-viewer/ipynb-viewer.js` line 1991-1999, 2122-2126

## ⚠️ CRITICAL: EDS Reserved Class Names

**NEVER use these class name patterns in blocks:**
- `.{blockname}-container` - EDS automatically adds this to parent `<section>` elements
- `.{blockname}-wrapper` - EDS automatically adds this to block parent `<div>` wrappers

**Why this matters:** Using these patterns causes CSS conflicts that can make entire pages invisible.

**Production bug example:** Using `.overlay-container` with `position: fixed; opacity: 0;` made pages blank because EDS added the class to the section element.

**Safe suffixes to use instead:**
- `-backdrop`, `-modal`, `-panel`, `-inner`, `-grid`, `-list`, `-content`

**See:** `.claude/skills/eds-block-development/SKILL.md` for complete details and `PROBLEM.md` for the bug report.

## Development Workflow

### Content Driven Development (Required)
When creating or modifying blocks, ALWAYS use Content Driven Development:

1. **Use slash command**: `/new-block <name>` or `/start-cdd`
2. **Or invoke skill**: Use the `content-driven-development` skill
3. **Process**: Content model → Test content → Implementation → Testing

**Never skip CDD.** It ensures:
- Author-friendly content models
- Test content exists before coding
- Better PRs with validation links
- Fewer bugs and edge cases

### Simple vs Complex Blocks

**Simple Blocks** (EDS-Native):
- Develop directly in `/blocks/<name>/`
- Vanilla JavaScript, no build process
- For: Text blocks, banners, simple cards

**Complex Blocks** (Build-Enhanced):
- Develop in `/build/<name>/`
- Uses Vite bundler, external libraries allowed
- Deploy to `/blocks/<name>/` when ready
- For: Interactive components, data visualization, design systems

**Decision Guide**: See `docs/for-ai/implementation/design-philosophy-guide.md`

## Documentation

### Primary Documentation
- **`docs/for-ai/`** - Comprehensive EDS development guides (26 files)
  - Start: `docs/for-ai/index.md` - Complete navigation
  - Learn: `docs/for-ai/getting-started-guide.md` - Role-based paths
  - Core: `docs/for-ai/eds.md` - EDS fundamentals (1,937 lines)

### Claude Code Configuration
- **`.claude/README.md`** - Complete overview (commands, skills, agents, hooks)
- **`.claude/agents_README.md`** - Agent documentation (6 autonomous agents)
- **`.claude/commands/`** - Slash commands for common tasks (19 total)
- **`.claude/skills/`** - Extended capabilities for EDS development (26 total)
- **`.claude/hooks/`** - Development workflow automation (2 active hooks)
  - `CONFIG.md` - Hook configuration and customization guide

### Quick Links
- Architecture standards: `docs/for-ai/implementation/block-architecture-standards.md`
- Testing standards: `docs/for-ai/testing/eds-native-testing-standards.md`
- **NEW: Jupyter testing**: `docs/for-ai/explaining-jupyter.md` - Context-aware interactive testing with `initialize()` function (96% smaller Cell 1) and unified API
- **NEW: Educational notebooks**: `docs/for-ai/explaining-educational-notebooks.md` - Create tutorials, guides, and interactive demos as SPAs
- **NEW: ipynb-viewer block**: `blocks/ipynb-viewer/README.md` - Display executable notebooks with autorun, paged, and link navigation
- Security checklist: `docs/for-ai/guidelines/security-checklist.md`
- Frontend guidelines: `docs/for-ai/guidelines/frontend-guidelines.md`

### Testing & Documentation Approaches

**Multiple approaches available:**

1. **Traditional test.html** - Browser-based visual testing
   - Full EDS core integration
   - Real browser rendering
   - User interaction testing

2. **Jupyter Testing Notebooks (JSLab)** - Interactive development testing
   - Context-aware (Node.js and browser modes)
   - jsdom virtual DOM for block decoration
   - Live preview HTML generation with iframe controls
   - Cell-by-cell execution with inline documentation
   - File: `test.ipynb`
   - Focus: Testing EDS blocks

3. **Educational Jupyter Notebooks** - Interactive tutorials and documentation
   - Create tutorials, guides, blog posts as SPAs
   - Transform text into engaging interactive content
   - Progressive learning with demonstrations
   - **Visual block demonstrations** using `showPreview()` for beautiful overlays
   - Available blocks: accordion, cards, tabs, hero, quote (use existing blocks only)
   - **Note:** `showPreview()` now works correctly in notebook mode (fixed 2025-11-21)
   - Use `/create-notebook` command
   - Files: `education.ipynb`, `docs-navigation.ipynb`, `blog.ipynb`
   - Focus: Teaching and explaining concepts with visual engagement

4. **ipynb-viewer Block** - Display notebooks on EDS pages
   - Display .ipynb files on EDS pages
   - Interactive JavaScript execution in browser
   - Multiple display modes: basic, paged, autorun, notebook
   - Link navigation between pages with hash targets
   - Perfect for sharing tutorials, demos, documentation
   - Location: `blocks/ipynb-viewer/`

5. **Automated Tests** - CI/CD integration
   - Jest/Mocha for regression testing
   - Coverage reports
   - Future implementation