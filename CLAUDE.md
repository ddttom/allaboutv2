# AllAboutV2 Project Guide

## Quick Reference

### For AI Assistants
- **Comprehensive Documentation**: See `docs/for-ai/` directory (26 detailed guides)
- **Claude Code Tools**: See `.claude/` directory (skills and slash commands)
- **Start Here**: `docs/for-ai/index.md` for complete navigation

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

### Slash Commands (Claude Code)
- `/new-block <name>` - Create a new EDS block following Content Driven Development process
- `/start-cdd` - Start Content Driven Development process for creating or modifying blocks
- `/test-block <name>` - Run tests for a specific EDS block
- `/deploy-block <name>` - Deploy a block from build/ directory to blocks/ directory
- `/create-notebook` - Create educational/interactive Jupyter notebooks (tutorials, guides, blogs)
- `/lint-all` - Run all linting checks (JavaScript and CSS) across the project
- `/check-block <name>` - Analyze a block and provide architecture review and improvement suggestions
- `/check-security` - Run security checklist validation based on EDS security guidelines
- `/review-docs` - Review and understand the EDS documentation structure in docs/for-AI

See `.claude/README.md` for complete slash command reference.

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
- **`.claude/README.md`** - Skills, commands, and workflow integration
- **`.claude/commands/`** - Slash commands for common tasks
- **`.claude/skills/`** - Extended capabilities for EDS development

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
   - Available blocks: accordion, cards, tabs, grid, table, hero, quote
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