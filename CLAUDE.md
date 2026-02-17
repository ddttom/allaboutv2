---
title: "AI assistant configuration for allabout.network"
description: "Project guide and configuration for Claude Code working on the allabout.network website."
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-17
version: "1.0"
status: active
---

# AllAboutV2 Project Guide

## Quick Reference

### For AI Assistants

- **Comprehensive Documentation**: See `docs/for-ai/` directory (36 detailed guides)
- **Claude Code Tools**: See `.claude/` directory (22 commands, 30 skills, 6 agents, 3 hooks)
- **Start Here**: `docs/for-ai/index.md` for complete navigation
- **Agents**: See `.claude/agents_README.md` for autonomous task handlers
- **Critical Learnings**: See `LEARNINGS.md` for documented mistakes and patterns to avoid

### Common Workflows

- **Create new block**: Use `/new-block <name>` command (follows Content Driven Development)
- **Find reference blocks**: Use `block-collection-and-party` skill to search Block Collection and Block Party
- **Survey available blocks**: Use `block-inventory` skill to understand block palette for authoring
- **Test a block**: Use `/test-block <name>` command or open `test.ipynb` in JSLab
- **Interactive testing**: Use Jupyter notebooks with context-aware execution
- **Create educational notebook**: Use `/create-notebook` for tutorials, guides, and demos
- **Share executable demos**: Use ipynb-viewer block for end-user interaction
- **Review documentation**: Use `/review-docs` command
- **Run all linting**: Use `/lint-all` command or `npm run lint`
- **Deploy custom Cloudflare worker**: See `cloudflare/files/` for CORS and JSON-LD worker

## ⚠️ CRITICAL: Working Directory Verification

**ALWAYS verify your working directory before creating files or folders that you expect to exist.**

### The Problem

When AI assistants cannot find an expected file or folder (like `.claude/`, `blocks/`, `docs/`, etc.), the instinct may be to create it. However, the issue is often that you're **in the wrong directory**, not that the file/folder doesn't exist.

### Required Protocol

Before creating ANY file or folder that should already exist in this project:

1. **Check current working directory**:

   ```bash
   pwd
   ```

2. **Verify you're in project root** by checking for these markers:

   ```bash
   ls -la | grep -E "(\.claude|blocks|package\.json|CLAUDE\.md)"
   ```

   All four should exist in project root.

3. **If markers are missing**, you're in the wrong directory:

   ```bash
   cd /Users/tomcranstoun/Documents/GitHub/allaboutV2
   ```

### Red Flags (Wrong Directory)

- Cannot find `.claude/` directory
- Cannot find `blocks/` directory
- Cannot find `CLAUDE.md` or `README.md`
- Cannot find `package.json`
- `pwd` output shows you're inside `/blocks/`, `/docs/`, or other subdirectory

### Correct Behavior

❌ **WRONG**:

```
Error: .claude/ directory not found
Solution: Creating .claude/ directory...
mkdir .claude
```

✅ **CORRECT**:

```
Error: .claude/ directory not found
Solution: Verify working directory first
pwd
# Output: /Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/hero
# I'm in a subdirectory! Navigate to project root.
cd /Users/tomcranstoun/Documents/GitHub/allaboutV2
# Verify .claude/ exists
ls -la .claude
```

### Project Root

**Absolute path**: `/Users/tomcranstoun/Documents/GitHub/allaboutV2`

All `.claude/` operations, block creation, slash commands, and documentation updates require being in this directory.

## Commands

### NPM Scripts

- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run lint:markdown` - Lint markdown files
- `npm run lint:markdown:fix` - Auto-fix markdown issues
- `npm run lint` - Run all linting (JS + CSS + Markdown)
- `npm run debug` - Run local development server (server.js is READ-ONLY)
- `npm run generate-sitemap:invisible-users` - Generate sitemap for invisible-users section

### Local Testing Workflow (for AI Assistants)

**You do NOT need to commit code for the user to test changes.**

**Correct workflow:**

1. **Make changes** - Edit files using Read/Edit/Write tools
2. **User tests locally** - User runs `npm run debug` and tests in browser at `http://localhost:3000`
3. **Iterate if needed** - Make additional changes based on test results
4. **Commit when validated** - Only commit after changes are tested and working

**Why this matters:**

- Reduces unnecessary commits during debugging
- Keeps git history clean
- Faster iteration cycle (no commit overhead)
- User can test multiple iterations before deciding what to commit

**When to commit:**

- ✅ After user confirms changes work correctly
- ✅ When implementing a complete, tested feature
- ✅ When user explicitly asks for a commit
- ❌ After every single change during debugging
- ❌ To enable testing (user can test without commits)

**Debug code pattern:**

- Add debug logging (`console.log`) during troubleshooting
- User tests with debug logs in browser console
- Remove or comment out debug logs before final commit
- Or: Keep critical debug logs with `// eslint-disable-next-line no-console` if valuable for future debugging

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

## ⚠️ CRITICAL: Cloudflare Worker Two-File Testing System

**The Cloudflare worker MUST follow the two-file testing system** - this is non-negotiable.

### The Two-File Rule

**File 1:** `cloudflare/files/cloudflare-worker.js` - Production worker code
**File 2:** `cloudflare/files/cloudflare-worker.test.js` - Unified test file (unit + integration)

**CRITICAL PRINCIPLE:** All worker functionality must be implemented as **pure JavaScript functions** that can be tested without Cloudflare Workers runtime.

### Why This Matters

The Cloudflare Workers runtime provides APIs like `HTMLRewriter` that are NOT available in Node.js test environments. If you use runtime-specific APIs for core logic, **your code becomes untestable**.

**Production Bug Example (2025-12-12):**

```javascript
// ❌ WRONG - This breaks in tests
export const handlePicturePlaceholder = (element) => {
  element.ontext((text) => {...});  // TypeError: element.ontext is not a function
  element.onendtag(() => {...});    // These methods don't exist in tests
};
```

This code worked in Cloudflare but threw `TypeError: element.ontext is not a function` because HTMLRewriter element handlers can't be tested in Node.js.

### Correct Approach: Pure Functions

**Core logic must be pure JavaScript that takes strings and returns strings:**

```javascript
// ✅ CORRECT - Pure function, fully testable
export const replacePicturePlaceholder = (html) => {
  const pattern = /<div>\s*<div>([^<]*Picture Here[^<]*)<\/div>\s*<\/div>/g;
  const replacement = `<div><img src="${CONFIG.IMAGE_URL}" alt="${CONFIG.ALT}"></div>`;
  return html.replace(pattern, replacement);
};

// Test in Node.js (no Cloudflare runtime needed)
test('replaces Picture Here with image', () => {
  const input = '<div><div>Picture Here</div></div>';
  const output = replacePicturePlaceholder(input);
  expect(output).toContain('<img');
  expect(output).not.toContain('Picture Here');
});
```

### Processing Flow Pattern

**Correct order for worker that needs both string operations and HTMLRewriter:**

```javascript
// 1. Fetch response from origin
let resp = await fetch(request);

// 2. Extract HTML text (consumes body)
let htmlText = await resp.text();

// 3. Apply pure string operations (TESTABLE)
htmlText = replacePicturePlaceholder(htmlText);

// 4. Create new Response with processed text
resp = new Response(htmlText, {
  status: resp.status,
  statusText: resp.statusText,
  headers: resp.headers,
});

// 5. NOW apply HTMLRewriter for runtime-specific features
resp = new HTMLRewriter()
  .on('meta[property="og:title"]', handleOgTitle)
  .transform(resp);

// 6. Add headers and return
return new Response(resp.body, resp);
```

**Key insight:** Pure functions run BEFORE HTMLRewriter, making them testable.

### Testing Requirements

**All tests must be in cloudflare-worker.test.js:**

```javascript
describe('Pure Functions (Unit Tests)', () => {
  test('replacePicturePlaceholder replaces exact match', () => {
    const html = '<div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);
    expect(result).toContain('<img');
  });
});

describe('Integration Tests', () => {
  test('handleRequest processes HTML responses', async () => {
    // Mock fetch, Response, HTMLRewriter
    const response = await handleRequest(mockRequest, mockEnv);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
```

**Test structure:**

- **Unit tests**: Test pure functions with string input/output
- **Integration tests**: Test request flow with mocked Cloudflare APIs
- **NO separate test files**: Everything in one unified test file

### Red Flags (Violations of Two-File Rule)

❌ Using HTMLRewriter element handlers for core logic
❌ Creating separate test files (unit.test.js, integration.test.js)
❌ Code that can't be tested without Cloudflare runtime
❌ Skipping tests because "it needs the runtime"

✅ Pure functions for all transformations
✅ Single unified test file (cloudflare-worker.test.js)
✅ HTMLRewriter only for features that require it
✅ 100% test coverage of pure functions

### Enforcement

**Before modifying worker files, always:**

1. Read `cloudflare/files/TESTING.md` for complete testing guide
2. Read `cloudflare/files/README.md` for implementation patterns
3. Use `/check-cloudflare-tests` command to validate test structure
4. Run `npm test` in `cloudflare/files/` before committing

**See also:**

- Complete testing guide: `cloudflare/files/TESTING.md`
- Implementation patterns: `cloudflare/files/README.md`
- Production test page: `cloudflare/test.html`

### Slash Commands (Claude Code)

**Block Development:**

- `/new-block <name>` - Create a new EDS block following Content Driven Development process
- `/start-cdd` - Start Content Driven Development process for creating or modifying blocks
- `/test-block <name>` - Run tests for a specific EDS block
- `/deploy-block <name>` - Deploy a block from build/ directory to blocks/ directory
- `/check-block <name>` - Analyze a block and provide architecture review and improvement suggestions
- `/check-cloudflare-tests` - Validate Cloudflare worker test structure follows two-file rule
- `/step-commit` - Execute systematic step commit workflow

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
- `/validate-docs` - Validate CLAUDE.md, README.md, and CHANGELOG.md are current before push
- `/dev-docs-update` - Update dev documentation before context compaction
- `/increment-cfw-version` - Increment Cloudflare Worker version
- `/md-fix` - Run markdown linting and fix all issues in the repository

**Content Management:**

- `/update-llms` - Find and update all llms.txt files in the project
- `/update-my-blog` - Find and update all my-blog.json files in the project

See `.claude/README.md` for complete slash command reference (22 total).

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

**cloudflare-worker-test-regenerate.sh** (Enhanced with AI Test Automation)

- **Trigger:** After Edit, MultiEdit, or Write operations on `cloudflare/files/cloudflare-worker.js`
- **Purpose:** Intelligent test automation system with auto-generation and coverage reporting
- **Implementation:** Calls `cloudflare-test-automation.js` for complete test lifecycle management
- **Features:**
  - Detects changes via git diff (new/modified/deleted functions)
  - Auto-generates test stubs for new functions
  - Auto-updates test expectations for modified functions
  - Creates timestamped backups in `cloudflare/backups/` directory (gitignored)
  - Runs all tests (npm test + test:local)
  - Generates comprehensive coverage report
  - Rollback capability if tests fail
- **Benefits:**
  - Ensures tests stay synchronized with worker code
  - Reduces manual test writing effort
  - Provides immediate validation of changes
  - Comprehensive audit trail via coverage reports
  - Safe with backup/rollback mechanism
- **See:** `.claude/hooks/cloudflare-test-automation.README.md` for complete documentation

**pre-commit-changelog.sh** (Git Hook)

- **REQUIRED:** Validates CHANGELOG.md is included in commits (blocks commit if missing)
- **Simple Check:** Verifies CHANGELOG.md is staged before allowing commit
- **Works with Claude Code:** No TTY issues - just checks staged files
- **Workflow:**
  1. Make code changes
  2. Update CHANGELOG.md with your changes
  3. Stage both: `git add . CHANGELOG.md`
  4. Commit: `git commit -m "your message"`
  5. Hook validates CHANGELOG.md is included, allows commit
- **If CHANGELOG.md missing:**
  - Commit blocked with clear instructions
  - Add CHANGELOG.md and amend commit, or use `git commit --amend --no-edit`
- **Bypass:** Use `SKIP_DOC_CHECK=1 git commit -m "message"` if docs truly don't need updating

See `.claude/hooks/CONFIG.md` for configuration and customization.

## CI/CD (GitHub Actions)

The project uses GitHub Actions for continuous integration and deployment.

### Workflows

**ci.yml** - Main CI Pipeline (runs on push to main, all PRs)

- **CHANGELOG Validation**: Ensures CHANGELOG.md updated (blocks merge if missing)
  - Skip with `[skip changelog]` in commit message
- **Linting**: JavaScript (ESLint) and CSS (Stylelint)
- **Testing**: Cloudflare worker tests (unit + integration + local HTML)
- **Security**: npm audit and secret scanning
- **Structure Validation**: Required files and JSON syntax checks
- **Build Verification**: Tests build/ directories if present

**deploy-cloudflare.yml** - Cloudflare Worker Deployment

- **Trigger**: Manual only (workflow_dispatch)
- **Pre-deployment**: Runs all worker tests
- **Deployment**: Uses Wrangler to deploy to Cloudflare
- **Post-deployment**: Smoke tests (site response, CORS headers, worker version)
- **Environments**: Supports staging and production
- **How to deploy**: Go to Actions → Deploy Cloudflare Worker → Run workflow

**pr-checks.yml** - Enhanced PR Validation

- **PR Title**: Validates conventional commit format (feat/fix/docs/chore)
- **Issue Links**: Checks for linked issues (Fixes/Closes/Resolves #123)
- **Documentation**: Warns if large code changes lack doc updates
- **Block Structure**: Validates blocks have required files (JS, CSS, README)
- **File Sizes**: Warns on files >500KB
- **Code Quality**: Detects TODO/console.log/debugger in diffs
- **Change Summary**: Generates detailed PR summary in GitHub UI

### Enforcement Strategy

**Two-Level Enforcement:**

1. **Local (Git Hooks)**: Pre-commit validation - catches issues before commit
2. **CI/CD (GitHub Actions)**: Validates on push/PR - prevents breaking main

### Required Secrets

To enable Cloudflare deployment, add to GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` - API token for Wrangler deployment

### Workflow Status

View workflow runs at: `https://github.com/ddttom/allaboutv2/actions`

## Code Style

- **JS**: Follows Airbnb style guide (eslint-config-airbnb-base)
- **CSS**: Follows stylelint-config-standard
- **Markdown**: Follows standard markdownlint rules with sensible exceptions (see `.markdownlint.json`)
  - MD013 disabled (line length) - too restrictive for documentation
  - MD033 disabled (inline HTML) - needed for EDS blocks
  - MD034 disabled (bare URLs) - common in documentation
  - MD041 disabled (h1 first line) - metadata tables come first
  - MD024 disabled (duplicate headings) - valid for FAQs and multi-section docs
  - MD025 disabled (multiple h1) - valid for long documentation
  - MD036 disabled (emphasis as heading) - stylistic choice in documentation
  - MD040 disabled (fenced code language) - not always necessary for snippets
  - MD060 disabled (dollar signs in code) - false positives with inline code
  - MD045 disabled (no alt text) - legacy content with missing alt text
  - MD055 disabled (table pipe style) - inconsistent table formatting acceptable
  - MD056 disabled (table column count) - complex tables with varying columns
- **Block Structure**: Each block has its own directory with JS/CSS/README (see complete structure in [Block Development](#block-file-structure))
- **Naming**: Use kebab-case for files and block names
- **JS Modules**: Use ES modules with named exports
- **Error Handling**: Use try/catch with custom error types for consistency, graceful degradation
- **DOM Manipulation**: Use vanilla JS DOM methods
- **Async Operations**: Use async/await only (never `.then()`)
- **Imports**: Only import what you use - keep imports clean

### Code Organization Standards

**Function Structure:**
Structure code in three distinct sections:

1. **decorate** - Main block decoration function (exported as default)
2. **sub-components** - Reusable component builders
3. **helpers** - Utility functions

**Function Declarations:**

- Use `function` keyword for pure functions (adds clarity over arrow functions)
- Favor named exports for functions
- Example:

```javascript
// Pure function with function keyword
function createCard(data) {
  return element;
}

// Named export
export { createCard, processData };
```

**Code Cleanliness:**

- No TODOs or placeholders in code - resolve before committing
- Favor iteration and modularization to adhere to DRY principles
- Avoid code duplication through proper abstraction

### Commenting Guidelines

Add comments that explain the "why" and "how", not just the "what":

**What to comment:**

- Purpose of functions or code blocks
- How complex algorithms or logic work
- Assumptions or limitations in the code
- Meaning of important variables or data structures
- Potential edge cases or error handling

**Comment style:**

- Use clear and concise language
- Avoid stating the obvious (don't just restate what the code does)
- Use single-line comments for brief explanations
- Use multi-line comments for longer explanations or function descriptions
- Precede console statements with `// eslint-disable-next-line no-console`

## Configuration Patterns

### Project Standards (AI Assistant Reference)

**Note:** These standards are defined as instruction context for AI assistants.

**Project Information:**

- Developer: Tom Cranstoun
- Company: tom
- Blocks Directory: `/blocks`

**Code Standards:**

- Style Guide: Airbnb (eslint-config-airbnb-base)
- CSS Naming: kebab-case
- JS Modules: ESM
- Markdown: GitHub Flavored Markdown (GFM)

**Sample Resources** (for AI to use when creating examples):

- **Profile Image**: `https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png`
- **Sample Images**:
  - `https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png`
  - `https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg`
  - `https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg`
  - `https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg`
  - `https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png`

When AI assistants create block examples or documentation, they should reference these pre-defined resources rather than inventing new URLs.

### Design System Standards

**Comprehensive design language:** See `docs/for-ai/guidelines/design-system.md`

**Key Design Tokens:**

- Colors, typography, spacing extracted from allabout.network
- CSS custom properties reference (`styles/styles.css`)
- Component design patterns (buttons, links, borders)
- Responsive breakpoints (600px, 900px)
- Implementation guidelines for blocks
- Accessibility standards (WCAG 2.1 AA)

**Essential Values:**

- Primary color: `--link-color: #035fe6`
- Font family: `--body-font-family: roboto, roboto-fallback`
- Most common spacing: `22px` (aligns with body font size)
- Button border-radius: `30px` (distinctive pill shape)
- 8px base spacing system

### Block-Level BLOCKNAME_CONFIG

**Every block JavaScript file must define a CONFIG object at the top:**

```javascript
const BLOCKNAME_CONFIG = {
  // Error messages
  ERROR_MESSAGE: 'Error loading content. Please try again.',
  HTTP_ERROR_MESSAGE: 'HTTP error! status:',

  // File paths
  INPUT_DATA: '/path/to/data.json',

  // Thresholds and timings
  COPY_BUTTON_RESET_DELAY: 2000,
  LONG_DOCUMENT_THRESHOLD: 40,

  // UI text
  BOOK_TITLE: 'Code',
  BUTTON_LABEL: 'Click here',
};

export default async function decorate(block) {
  // Use CONFIG throughout
  const response = await fetch(BLOCKNAME_CONFIG.INPUT_DATA);
  // ...
}
```

**Why this matters:**

- All configuration in one place at the top of the file
- Easy to find and modify settings
- Facilitates translation and localization
- Improves maintainability

### Text String Management

**All unique text strings must be promoted to the top as const variables:**

- Group all text strings together for ease of translation
- Never hardcode user-facing text in the middle of functions
- Use descriptive constant names

```javascript
const BLOCKNAME_CONFIG = {
  // Group all user-facing text
  MESSAGES: {
    LOADING: 'Loading content...',
    ERROR: 'Failed to load',
    SUCCESS: 'Content loaded successfully',
  },
  LABELS: {
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    RESET: 'Reset Form',
  },
};
```

### File Path Configuration

**Files referenced in code should be declared at the top:**

```javascript
const BLOCKNAME_CONFIG = {
  // File paths
  INPUT_DATA: '/data/query-index.json',
  TEMPLATE_PATH: '/templates/card.html',
  ICON_SPRITE: '/icons/sprite.svg',
};

// Use in code
async function loadData() {
  const response = await fetch(BLOCKNAME_CONFIG.INPUT_DATA);
  // ...
}
```

### Sample Image Resources (For AI-Generated Examples)

When AI assistants create block examples or demos, use these pre-defined sample images:

**Available Resources:**

- **Profile Image**: `https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png`
- **Sample Images**:
  - `https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png`
  - `https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg`
  - `https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg`
  - `https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg`
  - `https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png`

**Usage:**

- In `example.json`, `example.csv`, or demo content, use these pre-defined URLs
- Ensures examples work immediately without broken image links
- Maintains consistency across all block documentation

## Architecture

- Project follows Adobe Helix/Franklin (EDS - Edge Delivery Services) architecture
- Blocks are independent web components with isolated functionality
- Configuration in /config directory with environment-specific variables
- Scripts loaded via head.html and scripts.js

**Complete architecture details:** See [EDS Architecture Standards](docs/for-ai/implementation/eds-architecture-standards.md)

### Project Directory Structure

| Directory | Purpose |
|---|---|
| `blocks/` | 49 production-ready EDS blocks (independent web components) |
| `build/` | Development workspace for complex components with external dependencies (Vite) |
| `blogs/` | Blog content organized by category (`ddt/`, `mx/`) |
| `cloudflare/` | Custom Cloudflare Worker implementation (CORS, JSON-LD, metadata) |
| `cogs/` | MX-related COG (Content Object Graph) configurations |
| `config/` | Environment-specific configuration (JSON-LD, tracking) |
| `data/` | Data assets and resources |
| `dev/` | Development resources and utilities |
| `docs/` | Comprehensive documentation (`for-ai/`, `remediation/`) |
| `fonts/` | Font files (Roboto woff2) |
| `icons/` | Icon assets (SVG) |
| `images/` | Image assets |
| `mx/` | MX-related demo content |
| `plusplus/` | Block Party and plugin integrations |
| `scripts/` | Core JavaScript utilities (`aem.js`, `scripts.js`, `delayed.js`) |
| `static/` | Static web assets (CSS, JS) |
| `styles/` | Global stylesheets (`styles.css`, `fonts.css`, `homepage.css`) |
| `tools/` | Development tools (sidekick) |
| `.claude/` | Claude Code configuration (22 commands, 30 skills, 6 agents, 3 hooks) |
| `.github/` | GitHub Actions workflows (CI, PR checks, Cloudflare deploy) |

### Key Root Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | AI assistant project guide (this file) |
| `README.md` | Project overview and setup instructions |
| `CHANGELOG.md` | Comprehensive change history |
| `LEARNINGS.md` | Documented mistakes and patterns to avoid |
| `AGENTS.md` | Agent configurations and documentation |
| `PROJECTSTATE.md` | Current project state tracking |
| `package.json` | NPM configuration (v1.3.0, @adobe/aem-boilerplate) |
| `server.js` | READ-ONLY local development server |
| `.eslintrc.cjs` | ESLint configuration (Airbnb base) |
| `.stylelintrc.json` | Stylelint configuration (standard) |
| `.markdownlint.json` | Markdownlint configuration (12 rules disabled) |

### EDS Content Serving Rules

**CRITICAL: Files in GitHub supersede Google Drive for content serving.**

**How EDS serves content:**
1. **GitHub files are served RAW** - No EDS transforms applied
2. **GitHub takes precedence** - If file exists in both GitHub and Google Drive, GitHub wins
3. **Exceptions:**
   - **`.md` files** - CANNOT be served from GitHub, must be in Google Drive for EDS markdown-to-HTML transformation
   - **Dot-prefixed folders** (`.helix/`, `.github/`, etc.) - CANNOT be served from GitHub

**Practical implications:**
- ✅ `.html` files in GitHub → Served directly from GitHub (no Google Drive sync needed)
- ✅ `.css`, `.js`, `.json` files → Served directly from GitHub
- ✅ Images, PDFs, assets → Served directly from GitHub
- ❌ `.md` files → MUST be in Google Drive for EDS transformation
- ❌ `.helix/` configuration → Not accessible via web

**Content delivery flow:**
```
GitHub (code repository, direct serving for non-.md files)
    ↓
Adobe EDS (transforms .md files from Google Drive)
    ↓
Adobe Fastly CDN (caches transformed content)
    ↓
Cloudflare CDN (adds CORS, metadata enhancements)
    ↓
User's browser
```

**When you add new content:**
1. **For .html/.css/.js files**: Commit to GitHub → Push → File is accessible
2. **For .md files**: Must be in Google Drive for EDS to transform
3. **Cache consideration**: New files may return 404 if CDN cached the not-found response
4. **Solution for cached 404s**: Purge Cloudflare cache for the URL (see [Cache Management](#cache-management))

**Google Drive is NOT required for:**
- Static HTML blogs (like `/blogs/mx/*.html`)
- CSS stylesheets
- JavaScript files
- JSON data files
- Image assets

**Google Drive IS required for:**
- Markdown content that needs EDS transformation
- Content authoring via Google Docs integration

### Cache Management

**When to purge Cloudflare cache:**
- After adding new content files to GitHub
- After updating existing content
- When a URL returns 404 but file exists in GitHub
- After making changes to sitemap or robots.txt

**How to purge Cloudflare cache:**

**Option 1: Cloudflare Dashboard (Easiest)**
1. Log into Cloudflare dashboard
2. Select domain: `allabout.network`
3. Navigate to: Caching → Configuration
4. Click "Purge Cache"
5. Select "Custom Purge" → "Purge by URL"
6. Enter full URL: `https://allabout.network/path/to/file.html`
7. Click "Purge"

**Option 2: Cloudflare API (Automated)**
```bash
# Set environment variables
ZONE_ID="your-cloudflare-zone-id"
API_TOKEN="your-cloudflare-api-token"

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://allabout.network/path/to/file.html"]}'
```

**Option 3: Test with Cache Bypass**
```bash
# Add cache-busting query parameter
curl -I "https://allabout.network/path/to/file.html?v=$(date +%s)"

# Or in browser, add ?v=1 to URL
```

**Common cache issue:**
- Someone accesses URL before file exists → CDN caches 404
- File is added to GitHub → CDN still serves cached 404
- Solution: Purge cache or wait for TTL expiration (4-24 hours)

### Blocks Inventory (49 blocks)

3dcube, accordion, bio, bloglist, blogroll, cards, centreblock, code-expander, columns, comment, counter, dam, dashboard, dfs, dps, dynamic, embed, floating-alert, footer, fortunecookie, fragment, grid, header, helloworld, hero, index, inline-svg, **ipynb-viewer** (largest - 4,946 lines JS, with overlay subsystem), markdown, modal, overlay, quote, raw, react-slide-builder, remove-icon-styles, returntotop, search, shoelace, shoelace-card, showcaser, slide-builder, spectrum-card (build-enhanced), table, tabs, tags, text, video, view-myblog, vue-slide-builder

### Dual-Directory Pattern

- **`/blocks/`** - Production-ready EDS blocks (simple components or deployed build output)
- **`/build/`** - Development workspace for complex components with external dependencies
- See `docs/for-ai/implementation/build-blocks-clarification.md` for details

## Conventions

- Keep code DRY, simple, and accessible
- Add README for each new block with usage examples (see [Documentation Files](#documentation-files) for complete structure)
- Responsive design throughout all components
- Never use Typescript or any Framework like React
- **ALWAYS follow Content Driven Development (CDD)** when creating or modifying blocks
  - Content models before code
  - Test content before implementation
  - Author needs before developer needs
- **Block Variation Strategy**: Consider using variations within existing blocks rather than creating new blocks - improves efficiency and reduces author cognitive overload
- **Code Quality**: No TODOs or placeholders in committed code - resolve before commit
- **Import Cleanliness**: Only import what you use - avoid unused dependencies

## ⚠️ CRITICAL: No Inline CSS

**Never use inline CSS in JavaScript files** - always create CSS in CSS files.

**Why this matters:**

- Separates concerns (structure, presentation, behavior)
- Maintains CSS cacheability
- Enables style reuse
- Follows EDS best practices

**Wrong:**

```javascript
// ❌ Don't do this
element.style.color = 'red';
element.style.display = 'flex';
```

**Correct:**

```javascript
// ✅ Do this - add classes and style in CSS
element.classList.add('highlighted');
```

```css
/* In blockname.css */
.blockname .highlighted {
  color: var(--highlight-color, red);
  display: flex;
}
```

### CSS Variables as Configuration

Use CSS variables at the block level for easy theming and configuration:

```css
/* Block configuration variables */
.blockname {
    --block-spacing: 1rem;
    --block-color: var(--color-primary, #000);
    --block-radius: 0.5rem;
}

/* Use variables throughout */
.blockname-content {
    padding: var(--block-spacing);
    color: var(--block-color);
    border-radius: var(--block-radius);
}

/* Responsive adjustments */
@media (min-width: 768px) {
    .blockname {
        --block-spacing: 2rem;
    }
}
```

### CSS Variation Class Naming

Variations use additional classes, not separate files:

**In markdown:** `BlockName (bold)` becomes `blockname bold` classes

**CSS pattern:**

```css
/* Base block styles */
.blockname {
  /* default styles */
}

/* Variation styles using additional class */
.blockname.bold {
  font-weight: bold;
  /* variation-specific styles */
}

.blockname.large {
  font-size: 1.5rem;
}
```

**Why this matters:**

- One CSS file per block (matches JS pattern)
- Easy to combine variations: `BlockName (bold, large)`
- Maintainability and consistency

## ⚠️ CRITICAL: Single JavaScript File for Block Variations

**Each EDS block must have exactly ONE JavaScript file, regardless of variations.** Use `block.classList.contains('variation-name')` to detect variations.

**NEVER:** Multiple JS files (❌ `blockname.js`, `blockname-variation1.js`)
**ALWAYS:** Single JS file with class detection

**Details:** See [Block Variations](docs/for-ai/eds.md#block-variations) in EDS Fundamentals Guide

## ⚠️ CRITICAL: Event Listeners and DOM Cloning

**Event listeners are NOT copied when using `cloneNode()`**

**The Problem:**

```javascript
element.addEventListener('click', handler);
const clone = element.cloneNode(true);  // ❌ Event listener lost!
```

**The Solution:**
Always re-attach event listeners after cloning:

```javascript
const clonedCell = cell.cloneNode(true);
container.appendChild(clonedCell);

// ✅ Re-attach ALL event listeners
const links = clonedCell.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', handler);
});
```

**ipynb-viewer implementation:** See [ipynb-viewer.js](blocks/ipynb-viewer/ipynb-viewer.js):

- Run buttons (lines 1292-1303)
- Smart links (lines 1347-1388)
- GitHub links (lines 1390-1400)

**General guidance:** See [DOM Manipulation Best Practices](docs/for-ai/guidelines/frontend-guidelines.md#dom-manipulation)

## ⚠️ CRITICAL: ipynb-viewer Smart Link Pattern

**All `.md` links in ipynb-viewer are treated as smart links using the repository URL pattern.**

When a notebook has a `repo` metadata attribute, all `.md` file links are automatically converted to GitHub URLs and opened in overlays.

**CRITICAL Rules:**

- ✅ **DO** use ONLY the GitHub repo URL from notebook metadata
- ✅ **DO** fetch from `raw.githubusercontent.com` (converted from blob URL)
- ❌ **DON'T** try local paths before GitHub
- ❌ **DON'T** hardcode local paths like `/docs/help.md`

**Why this matters:**

- The `repo` attribute in notebook metadata is the single source of truth
- Local development server proxies missing files to production
- Smart links work identically in development and production

**Complete details:** See [ipynb-viewer README](blocks/ipynb-viewer/README.md) sections on:

- Smart Links and GitHub Integration (Section 3: Enhanced Markdown Rendering)
- Help Button and Metadata (Section 6: Three Types of Overlays)
- Link Navigation Implementation (Section 4: Interactive Features)

## ⚠️ CRITICAL: ipynb-viewer Unified Overlay Architecture

**The ipynb-viewer now uses a unified overlay system to eliminate multiple overlay confusion.**

**Branch**: `refactor/ipynb-viewer-unified-overlay` (complete and ready for production)

### The Problem (Before)

Multiple separate overlays caused confusion:
- `createPagedOverlay()` - Paged overlay with notebook cells
- `createGitHubMarkdownOverlay()` - GitHub overlay with markdown files
- `createManualOverlay()` - Manual overlay with help pages

**Issues**:
- Context confusion ("where am I?")
- Duplicate home buttons with different behaviors
- Different navigation systems
- Nested overlays stacking on top of each other
- Complex state management across multiple overlay instances

### The Solution (After)

**Single unified overlay with mode switching:**

```javascript
import { createNotebookOverlay, createMarkdownOverlay } from './overlay/integration.js';

// Create notebook overlay
const notebook = createNotebookOverlay(cells, {
  title: 'My Notebook',
  repo: 'https://github.com/user/repo',
  autorun: false,
});
notebook.show();

// Switch to markdown mode
notebook.updateMode('markdown');
notebook.navigate({
  mode: 'markdown',
  identifier: 'docs/README.md',
  title: 'README',
});
```

### Architecture Benefits

- ✅ **Single overlay, single state** - One source of truth, eliminates "where am I?" confusion
- ✅ **Mode switching** - Change modes (notebook/markdown/manual) without creating new overlays
- ✅ **Unified navigation** - One navigation system for all content types
- ✅ **Centralized hash management** - Single system for URL state (`#mode/identifier`)
- ✅ **Consistent home button** - Always does the same thing regardless of mode

### Core Modules

**Location**: `blocks/ipynb-viewer/overlay/`

1. **unified-overlay.js** - Core overlay with single state and DOM structure
2. **navigation-state.js** - Navigation state management with history tracking
3. **toolbar.js** - Overlay toolbar with navigation controls and mode switching
4. **footer.js** - Overlay footer component
5. **renderers/notebook-renderer.js** - Notebook cell renderer (markdown/code/outputs)
6. **renderers/markdown-renderer.js** - Markdown file renderer with smart links

### Key Features

- ES6 modules with clean imports/exports
- History management (max 50 entries)
- Comprehensive logging with module prefixes (`[HASH]`, `[NAV]`, `[OVERLAY]`)
- Mode-specific renderers with shared utilities
- Fresh implementation (no legacy code or migration)

### Documentation

- **Progress tracking**: `docs/for-ai/ipynb-viewer-refactor-progress.md`
- **Original proposal**: `docs/for-ai/ipynb-viewer-overlay-refactor-proposal.md`
- **Summary**: `docs/for-ai/ipynb-viewer-unified-overlay-summary.md`

## Cloudflare Custom Worker Implementation

**Custom Adobe EDS worker with enhanced features (v1.1.5)** - see `cloudflare/files/`

**What it does:**

- Adds CORS headers to all responses
- Generates JSON-LD structured data from page metadata
- Picture placeholder replacement: Detects "Picture Here" text and replaces with author image server-side
- Intelligent date formatting: Supports UK format (dd/mm/yyyy), month names (Dec/December), and ISO 8601
- Author metadata preservation: Keeps author meta tag for attribution (like LinkedIn)
- Author URL with LinkedIn fallback: Uses LinkedIn meta as fallback when author-url not provided
- Removes EDS error tags and non-social metadata (except author and LinkedIn)
- Removes all HTML comments from HTML responses
- Maintains all standard Adobe EDS functionality

**Version Management:**

- Version defined once in `cloudflare/files/package.json` (single source of truth)
- Worker imports version: `import pkg from './package' with { type: 'json' }`
- Wrangler/esbuild inlines version at build time
- Tests validate version automatically
- Check deployed version: `curl -I https://allabout.network/ | grep cfw`

**Key files:**

- `cloudflare/files/README.md` - Complete implementation guide and deployment instructions
- `cloudflare/files/TESTING.md` - Two-file testing system and pure function approach
- `cloudflare/files/cloudflare-worker.js` - Worker code (Apache License 2.0)
- `cloudflare/files/package.json` - Version source of truth

**Documentation references:**

- General Cloudflare config: `cloudflare/cloudflare.md`
- Custom worker implementation: `cloudflare/files/README.md`
- Testing methodology: `cloudflare/files/TESTING.md`

**Critical metadata pattern:**
Add `| jsonld | article |` to EDS metadata to trigger JSON-LD generation. The worker uses a clever authoring error workaround to detect this trigger.

**Date formatting:**
Authors can enter dates in any format (10/12/2024, 10 December 2024, Dec 10 2024). The worker automatically converts them to ISO 8601 format for search engines.

**Author URL:**
Add `| author-url | https://yoursite.com |` or rely on LinkedIn meta tag fallback. The worker preserves LinkedIn for social media while using it for JSON-LD.

**Deployment:** Follow `cloudflare/files/README.md` steps for prerequisites, environment variables, and deployment workflow.

**Testing:**

- **Automated tests**: `npm test` in `cloudflare/files/` - 63 tests covering all functionality
- **Local HTML test**: `npm run test:local` - processes test.html through pure functions, outputs test-rendered.html
- **Visual testing**: Open `cloudflare/test-rendered.html` locally to inspect transformed HTML
  - HTML transformations work (JSON-LD, metadata cleanup, placeholder replacement, comment removal)
  - CORS/header tests show "⚠️ Requires Cloudflare Worker (headers added at request time, not in HTML)"
- **Production test page**: `https://allabout.network/cloudflare/test.html` - comprehensive live tests

**Two-File Testing Rule:**

- **File 1**: `cloudflare-worker.js` - Production worker code
- **File 2**: `cloudflare-worker.test.js` - Single unified test file (unit + integration)
- **Core Principle**: All functionality as pure JavaScript functions (string → string) testable without Cloudflare runtime
- See `cloudflare/files/TESTING.md` for complete details

**Developer Notes:**

- `robots.txt` - SEO configuration with sitemap directive
  - Points search engines to `https://allabout.network/sitemap.xml`
  - Standard SEO best practice for search engine optimization
- `todo.txt` - Reference example of Cloudflare worker for robots.txt handling
  - Demonstrates intercepting specific paths (`/robots.txt`)
  - Shows custom response generation
  - Example of forwarding other requests to origin
  - Useful template for future worker implementations

## ⚠️ CRITICAL: EDS Reserved Class Names

**NEVER use these class name patterns in blocks:**

- `.{blockname}-container` - EDS automatically adds this to parent `<section>` elements
- `.{blockname}-wrapper` - EDS automatically adds this to block parent `<div>` wrappers

**Why this matters:** Using these patterns causes CSS conflicts that can make entire pages invisible.

**Production bug example:** Using `.overlay-container` with `position: fixed; opacity: 0;` made pages blank because EDS added the class to the section element.

**Safe suffixes to use instead:**

- `-backdrop`, `-modal`, `-panel`, `-inner`, `-grid`, `-list`, `-content`

**See:** `.claude/skills/eds-block-development/SKILL.md` for complete details, `PROBLEM.md` for the bug report, and [CSS Styling Standards](docs/for-ai/implementation/block-architecture-standards.md#3-css-styling-standards) for naming conventions.

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

**Complete CDD methodology:** See [Design Philosophy Guide](docs/for-ai/implementation/design-philosophy-guide.md)

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

### Block File Structure

**Standard structure:** Each block has its own directory with JS, CSS, and documentation files.

**Complete template:** See [Standard File Organization](docs/for-ai/eds-appendix.md#standard-file-organization) in EDS Reference Guide

**Essential files:** `{blockname}.js` (required), `{blockname}.css` (required), `README.md` (required), `example.md` (required)

## Block Development

### JavaScript Requirements

**Architecture patterns:** See [JavaScript Architecture Standards](docs/for-ai/implementation/block-architecture-standards.md#2-javascript-architecture-standards) for complete details on CONFIG object pattern, function structure, error handling, and variation handling.

**Quick reference:** Always define BLOCKNAME_CONFIG at top, organize code in three sections (decorate → sub-components → helpers), use `function` keyword for pure functions.

### CSS Requirements

**No inline CSS:** Always use CSS files, never `element.style` (see [⚠️ CRITICAL: No Inline CSS](#critical-no-inline-css)).

**Standards:** See [CSS Styling Standards](docs/for-ai/implementation/block-architecture-standards.md#3-css-styling-standards) for CSS variables, variation class naming (`.blockname.variation`), and reserved class names to avoid.

### Documentation Files

**Required files:** README.md (14-section structure), EXAMPLE.md (markdown table format), DEMO.md (7-part structure), self-review.md, senior-review.md

**Complete structures:** See [Documentation Requirements](docs/for-ai/eds-appendix.md#documentation-requirements) in EDS Reference Guide

### Data Files

**Data structures:** See [Data File Formats](docs/for-ai/eds-appendix.md#data-file-formats) for JSON feed structure and CSV format requirements.

## EDS-Specific Requirements

### ⚠️ CRITICAL: Markdown Code Snippets Format

**Use single backticks ONLY in demo.md, readme.md, example.md, and review files.**

**DO NOT use triple backticks** - this is an EDS requirement for proper code block rendering.

**Format:**

```
`Title of Code Snippet`
`const example = 'code here';`
`console.log(example);`
```

**Rules:**

- Each pair of single backticks = separate code snippet
- First line within backticks = title of the snippet
- This is a special signal to EDS for code rendering

**Wrong:**

````markdown
```javascript
const code = 'here';
```
````

**Correct:**

```
`JavaScript Example`
`const code = 'here';`
```

### Metadata Table Format

**Important:** Do NOT add a heading before metadata table - place it "silently" at end of demo.md

**Complete structure:** See [Metadata and Documentation](docs/for-ai/eds.md#metadata-and-documentation) in EDS Fundamentals Guide

### Markdown to HTML Transformation

**Key concept:** EDS transforms markdown tables into nested HTML divs. Understanding this helps design better content models.

**Details:** See [Markdown to HTML Transformation](docs/for-ai/eds.md#markdown-to-html-transformation) in EDS Fundamentals Guide

### query-index.json Pattern

**Every EDS folder contains `query-index.json`** for dynamic content access (navigation, blog listings, index pages).

**Details:** See [query-index.json Pattern](docs/for-ai/eds.md#query-indexjson-pattern) in EDS Fundamentals Guide

### E-L-D Loading Pattern

**E-L-D = Eager, Lazy, Delayed** - EDS performance optimization for optimal Lighthouse scores.

**Details:** See [E-L-D Loading Pattern](docs/for-ai/eds.md#e-l-d-loading-pattern) in EDS Fundamentals Guide

### lib-franklin.js → aem.js

**Historical note:** Core library renamed from `lib-franklin.js` to `aem.js`. Use `/scripts/aem.js` import path.

## Block Development Strategy

### Variation Strategy

**Consider variations before creating new blocks:**

- **Improves efficiency**: Reuse existing block logic
- **Reduces author overload**: Fewer blocks to learn
- **Better UX**: Authors familiar with base block can easily use variations

**When to use variations:**

- Similar functionality with different styling
- Same data structure, different presentation
- Related content types (e.g., card, card-large, card-featured)

**When to create new block:**

- Completely different data structure
- Unrelated functionality
- Would require too many conditionals in single block

**Process:**

1. After creating blocks, reiterate to identify variation opportunities
2. Ask: "Could this be a variation of an existing block?"
3. Refactor if yes - consolidate logic, add variation styles

### Response Template for Block Creation

**When documenting block creation, use this format:**

```markdown
# Block: [Name]

## Analysis
[Technical evaluation of requirements]

## Files Generated
- {blockname}.js
- {blockname}.css
- README.md
- example.md
- demo.md
- example.json (if applicable)
- example.csv (if applicable)

## Implementation Details
[Key technical decisions and patterns used]

## Usage Examples
[How authors use the block in markdown]

## Testing Notes
[Testing strategy and validation approach]
```

## Response Timestamps

**All Claude responses must include timestamps and execution duration.**

**Format**:

- **Start**: Begin response with timestamp: `🕒 Response Started: [YYYY-MM-DD HH:MM:SS TIMEZONE]`
- **End**: Conclude response with timestamp and duration:

  ```
  🕒 Response Completed: [YYYY-MM-DD HH:MM:SS TIMEZONE]
  ⏱️  Execution Duration: [X minutes Y seconds]
  ```

**Purpose**: Track response timing for accountability and performance monitoring.

**Implementation**: Automatically handled by `response-timestamps` skill (`.claude/skills/response-timestamps/`).

## Documentation

### Primary Documentation

- **`docs/for-ai/`** - Comprehensive EDS development guides (36 files across 4 subdirectories)
  - Start: `docs/for-ai/index.md` - Complete navigation
  - Learn: `docs/for-ai/getting-started-guide.md` - Role-based paths
  - Core: `docs/for-ai/eds.md` - EDS fundamentals (1,937 lines)

### Claude Code Configuration

- **`.claude/README.md`** - Complete overview (commands, skills, agents, hooks)
- **`.claude/agents_README.md`** - Agent documentation (6 autonomous agents)
- **`.claude/commands/`** - Slash commands for common tasks (22 total)
- **`.claude/skills/`** - Extended capabilities for EDS development (30 total)
- **`.claude/hooks/`** - Development workflow automation (3 active hooks)
  - `CONFIG.md` - Hook configuration and customization guide

### Critical Learnings

- **`LEARNINGS.md`** - Documented mistakes and patterns to avoid
  - **Purpose**: Captures real-world errors made during development to prevent repetition
  - **Current learnings**: ipynb-viewer smart links pattern (use relative paths, not full URLs)
  - **Format**: Rule → Why it matters → Correct pattern → Documentation reference
  - **When to update**: After discovering a mistake that could help future AI assistants
  - **Read this file**: Before working with Jupyter notebooks, ipynb-viewer block, or similar features

### Quick Links

- Architecture standards: `docs/for-ai/implementation/block-architecture-standards.md`
- Testing standards: `docs/for-ai/testing/eds-native-testing-standards.md`
- **Jupyter testing**: `docs/for-ai/explaining-jupyter.md` - Context-aware interactive testing with `initialize()` function (96% smaller Cell 1) and unified API
- **Educational notebooks**: `docs/for-ai/explaining-educational-notebooks.md` - Create tutorials, guides, and interactive demos as SPAs
- **Presentation notebooks**: `docs/for-ai/explaining-presentation-notebooks.md` - Client demos and showcases with embedded HTML/JS
- **ipynb-viewer block**: `blocks/ipynb-viewer/README.md` - Display executable notebooks with autorun, paged, and link navigation
- **ipynb-viewer unified overlay**: `blocks/ipynb-viewer/overlay/README.md` - Unified overlay architecture eliminating multiple overlay confusion
- **Helix Configuration**: `docs/for-ai/helix-config.md` - Complete .helix/config file reference covering CDN integration (Cloudflare), push invalidation, environment configuration, and troubleshooting
- **Custom Cloudflare Worker**: `cloudflare/files/README.md` - Custom Adobe EDS worker implementation (v1.1.5) with CORS headers, JSON-LD generation, picture placeholder replacement, and metadata cleanup. Version managed via package.json single source of truth.
- Security checklist: `docs/for-ai/guidelines/security-checklist.md`
- Frontend guidelines: `docs/for-ai/guidelines/frontend-guidelines.md`

### Site Remediation & SEO Strategy

The reports are created by https://github.com/ddttom/my-pa11y-project

- **Executive Summary**: `docs/remediation/files/00-executive-summary.md` - Complete 121-page audit analysis with 6 prioritized remediation strategies
  - **Note**: Jupyter notebook pages (.ipynb files) excluded from analysis
- **Report Documentation**: `docs/remediation/files/report-layout.md` - Audit report structure, EDS-specific limitations, and notebook exclusion policy
- **Critical Priority** (🔴):
  - `docs/remediation/files/01-critical-accessibility-fixes.md` - WCAG compliance (~~3 pages~~ → 1 page, ~~2-4 hours~~ → 1 hour, notebook pages excluded)
  - `docs/remediation/files/02-image-optimization-strategy.md` - Alt text for 200+ images (12 hours, $1,200, excludes notebooks)
- **High Priority** (🟠):
  - `docs/remediation/files/03-security-headers-implementation.md` - CSP & security headers (30-60 min quick win!)
  - `docs/remediation/files/04-content-freshness-dates.md` - Last-modified dates (12 hours, excludes notebooks)
- **Medium Priority** (🟡):
  - `docs/remediation/files/05-metadata-optimization.md` - Titles & descriptions for 30 pages (8 hours, excludes notebooks)
  - `docs/remediation/files/06-content-quality-improvements.md` - Bottom 10 pages (21 hours, excludes notebooks)
- **Key Discovery**: EDS automatically handles lazy loading and responsive images - audit tool reported false positives

### Testing & Documentation Approaches

**Multiple approaches available:** See [EDS Testing Guide](docs/for-ai/testing/EDS-Architecture-and-Testing-Guide.md) for comprehensive testing strategy.

1. **Traditional test.html** - Browser-based visual testing
   - Full EDS core integration, real browser rendering, user interaction testing

2. **Jupyter Testing Notebooks** - Interactive block development
   - See: [Explaining Jupyter](docs/for-ai/explaining-jupyter.md)
   - Context-aware execution, jsdom virtual DOM, live preview with iframe controls
   - File: `test.ipynb`

3. **Educational Notebooks** - Interactive tutorials and documentation
   - See: [Educational Notebooks Guide](docs/for-ai/explaining-educational-notebooks.md)
   - Create SPAs for teaching/tutorials/blogs with visual block demonstrations
   - Use `/create-notebook` command

4. **Presentation Notebooks** - Client demos and showcases
   - See: [Presentation Notebooks Guide](docs/for-ai/explaining-presentation-notebooks.md)
   - Embedded HTML/JS with EDS blocks, auto-wrapping and action cards

5. **ipynb-viewer Block** - Display notebooks on EDS pages
   - See: [ipynb-viewer README](blocks/ipynb-viewer/README.md)
   - Interactive JavaScript execution, multiple modes (basic, paged, autorun, notebook)
   - Link navigation with hash targets

6. **Automated Tests** - CI/CD integration
   - Jest/Mocha for regression testing
   - Future implementation
