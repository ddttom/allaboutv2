# Claude Code Configuration for AllAboutV2

This directory contains Claude Code configuration, custom skills, and slash commands tailored for Adobe Edge Delivery Services (EDS) development.

## Directory Structure

```
.claude/
├── README.md                    # This file
├── agents_README.md             # Agent documentation
├── settings.json                # Claude Code configuration
├── commands/                    # Slash commands (20 total)
│   ├── new-block.md            # Create new EDS block with CDD
│   ├── start-cdd.md            # Start Content Driven Development
│   ├── test-block.md           # Test a specific block
│   ├── deploy-block.md         # Deploy build/ block to blocks/
│   ├── find-block-content.md   # Find pages using a block
│   ├── lint-all.md             # Run all linting checks
│   ├── check-block.md          # Architecture review of a block
│   ├── check-security.md       # Security validation
│   ├── review-docs.md          # Navigate EDS documentation
│   ├── jupyter-notebook.md     # Create/edit testing notebooks
│   ├── create-notebook.md      # Create educational notebooks
│   ├── create-presentation.md  # Create presentation notebooks
│   ├── validate-notebook.md    # Validate notebook quality
│   ├── dev-docs.md             # Create strategic plans
│   ├── dev-docs-update.md      # Update dev documentation
│   └── increment-cfw-version.md # Increment Cloudflare worker version
├── agents/                      # Autonomous agents (6 total)
│   ├── code-architecture-reviewer.md
│   ├── code-refactor-master.md
│   ├── documentation-architect.md
│   ├── plan-reviewer.md
│   ├── refactor-planner.md
│   └── web-research-specialist.md
├── hooks/                       # Development workflow automation
│   ├── CONFIG.md               # Hook configuration guide
│   ├── skill-activation-prompt.sh  # Auto-suggest relevant skills
│   ├── skill-activation-prompt.ts
│   ├── post-tool-use-tracker.sh    # Track modified files
│   ├── pre-tool-use-version-check.sh  # Cloudflare worker version monitoring
│   ├── pre-push-validation.sh  # Documentation validation (git hook)
│   └── package.json            # TypeScript dependencies
└── skills/                      # Extended capabilities (27 total)
    ├── building-blocks/         # Create/modify EDS blocks
    ├── content-driven-development/  # CDD process orchestration
    ├── content-modeling/        # Design author-friendly content models
    ├── testing-blocks/          # Comprehensive block testing
    ├── jupyter-notebook-testing/ # Interactive testing with Jupyter
    ├── jupyter-educational-notebook/ # Educational notebook creation
    ├── create-presentation/     # Presentation notebook creation
    ├── ipynb-validator/         # Notebook validation
    ├── block-collection-and-party/  # Find reference implementations
    ├── docs-search/             # Search aem.live documentation
    ├── llms-txt-manager/        # Manage llms.txt and my-blog.json
    ├── cfw-version-monitor/     # Cloudflare worker version monitoring
    ├── eds-block-development/   # EDS block development patterns
    ├── eds-block-testing/       # EDS block testing
    ├── eds-performance-debugging/ # Performance optimization
    ├── frontend-dev-guidelines/ # Frontend patterns
    ├── skill-developer/         # Create custom skills
    ├── skill-creator/           # Skill creation toolkit
    └── [other general skills]   # Theme factory, web testing, etc.
```

## ⚠️ CRITICAL: Working Directory Verification

**ALWAYS verify your working directory before creating files or folders that you expect to exist.**

### The Problem

When Claude cannot find an expected file or folder (like `.claude/`, `blocks/`, `docs/`, etc.), it may be tempting to create it. However, the issue is often that you're **in the wrong directory**, not that the file/folder doesn't exist.

### Required Check Before Creating

Before creating ANY file or folder that should already exist in the project:

1. **Check current working directory**:
   ```bash
   pwd
   ```

2. **Verify project root markers**:
   ```bash
   ls -la | grep -E "(\.claude|blocks|package\.json|CLAUDE\.md)"
   ```

3. **If markers are missing**, navigate to project root:
   ```bash
   cd /Users/tomcranstoun/Documents/GitHub/allaboutV2
   ```

### Red Flags That Indicate Wrong Directory

- Cannot find `.claude/` directory
- Cannot find `blocks/` directory
- Cannot find `CLAUDE.md` or `README.md`
- Cannot find `package.json`
- Path includes `/blocks/`, `/docs/`, or other subdirectories in `pwd` output

### Examples of Incorrect Behavior

❌ **WRONG**:
```
Cannot find .claude/ directory. I will create it.
mkdir .claude
```

✅ **CORRECT**:
```
Cannot find .claude/ directory. Let me verify my working directory first.
pwd
# Output: /Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/hero
# This is a subdirectory! Navigate to project root.
cd /Users/tomcranstoun/Documents/GitHub/allaboutV2
# Now verify .claude/ exists
ls -la .claude
```

### Project Root Path

The project root is: `/Users/tomcranstoun/Documents/GitHub/allaboutV2`

All `.claude/` operations, block creation, and documentation updates should happen from this directory.

## Quick Start

### For EDS Block Development

The recommended workflow follows Content Driven Development (CDD):

1. **Start a new block**:
   ```
   /new-block my-component
   ```
   This invokes the CDD process which guides you through content modeling, test content creation, and implementation.

2. **Or manually start CDD**:
   ```
   /start-cdd
   ```

3. **Test your block**:
   ```
   /test-block my-component
   ```

4. **Deploy to production** (for build-enhanced blocks):
   ```
   /deploy-block my-component
   ```

### For Interactive Testing

- **Create Jupyter notebook**: `/jupyter-notebook`
- **Test blocks interactively** with instant feedback in VS Code
- Generate styled HTML previews with live CSS reload

### For Code Quality

- **Lint all code**: `/lint-all`
- **Review block architecture**: `/check-block my-component`
- **Security audit**: `/check-security`

### For Content Management

- **Update llms.txt files**: `/update-llms` or `node scripts/sync-blog-content.js --target=llms`
- **Update my-blog.json files**: `/update-my-blog` or `node scripts/sync-blog-content.js --target=blog`
  - Auto-creates missing my-blog.json files paired with llms.txt
  - Populates with content from query-index.json
  - Filters by folder context automatically
  - Sets initial date to 2020-01-01 to capture all historical content
- **Update both**: `node scripts/sync-blog-content.js --target=all`

### For Learning & Navigation

- **Explore documentation**: `/review-docs`
- Then ask Claude to use the `docs-search` skill for specific topics

## Skills Overview

### EDS-Specific Skills

**Primary Workflow Skills** (invoke in this order):

1. **content-driven-development**
   - Orchestrates the entire development process
   - Ensures content exists before coding begins
   - Auto-invokes other skills at appropriate times
   - **When**: Starting any new block or major modification

2. **content-modeling**
   - Designs author-friendly content models
   - Auto-invoked by CDD skill when needed
   - **When**: Creating new blocks or changing content structure

3. **building-blocks**
   - Implements the actual block code (JS, CSS)
   - Auto-invoked by CDD skill during implementation phase
   - **When**: Only after content model is defined

4. **testing-blocks**
   - Comprehensive testing (unit, browser, linting, performance)
   - Auto-invoked by CDD skill after implementation
   - Can also be invoked manually for existing blocks
   - **When**: After implementation or for validation

**Support Skills**:

- **block-collection-and-party**: Find similar blocks for reference
- **docs-search**: Search official aem.live documentation
- **jupyter-notebook-testing**: Interactive testing with Jupyter notebooks
- **llms-txt-manager**: Manage llms.txt and my-blog.json files for AI content discovery

### General Skills

These skills are available but not EDS-specific:

- **artifacts-builder**: Create complex HTML artifacts with React/Tailwind
- **canvas-design**: Create visual designs and posters
- **algorithmic-art**: Generate p5.js algorithmic art
- **slack-gif-creator**: Create animated GIFs for Slack
- **theme-factory**: Apply themes to artifacts
- **webapp-testing**: Test local web applications with Playwright
- **skill-creator**: Create new custom skills
- **mcp-builder**: Build Model Context Protocol servers
- **internal-comms**: Write internal communications
- **brand-guidelines**: Apply Anthropic branding

## Slash Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/new-block` | Create a new EDS block following Content Driven Development process | `/new-block hero` |
| `/start-cdd` | Start Content Driven Development process for creating or modifying blocks | `/start-cdd` |
| `/test-block` | Run tests for a specific EDS block | `/test-block hero` |
| `/deploy-block` | Deploy a block from build/ directory to blocks/ directory | `/deploy-block hero` |
| `/find-block-content` | Find pages in the site that use a specific block | `/find-block-content hero` |
| `/lint-all` | Run all linting checks (JavaScript and CSS) across the project | `/lint-all` |
| `/check-block` | Analyze a block and provide architecture review and improvement suggestions | `/check-block hero` |
| `/check-security` | Run security checklist validation based on EDS security guidelines | `/check-security` |
| `/review-docs` | Review and understand the EDS documentation structure in docs/for-AI | `/review-docs` |
| `/jupyter-notebook` | Create or edit Jupyter notebooks for testing EDS blocks interactively | `/jupyter-notebook` |
| `/create-notebook` | Create educational and interactive Jupyter notebooks (tutorials, guides, blogs) | `/create-notebook` |
| `/create-presentation` | Create or update presentation-mode notebooks with embedded HTML/JS blocks | `/create-presentation` |
| `/validate-notebook` | Validate notebook for production readiness (smart links, structure, quality) | `/validate-notebook` |
| `/dev-docs` | Create comprehensive strategic plan with structured task breakdown | `/dev-docs refactor auth` |
| `/dev-docs-update` | Update dev documentation before context compaction | `/dev-docs-update` |
| `/increment-cfw-version` | Increment Cloudflare worker version following semantic versioning | `/increment-cfw-version PATCH` |

## Agents

Specialized autonomous agents for complex, multi-step tasks. See [agents_README.md](agents_README.md) for details.

### Available Agents (6 for EDS)

**Code Quality & Architecture:**
- **code-architecture-reviewer** - Review block implementations and architectural consistency
- **code-refactor-master** - Plan and execute comprehensive refactoring
- **documentation-architect** - Create comprehensive documentation for blocks and features

**Planning & Research:**
- **plan-reviewer** - Review development plans before implementation
- **refactor-planner** - Create comprehensive refactoring strategies
- **web-research-specialist** - Research EDS patterns and solutions online

### How to Use Agents

Ask Claude to use an agent for complex tasks:
```
Use the code-architecture-reviewer agent to review the new carousel block
```

Agents work autonomously and return comprehensive reports when complete.

## Hooks

Active hooks that enhance the development workflow:

### skill-activation-prompt.sh
- **Trigger:** When you submit a prompt
- **Purpose:** Auto-suggests relevant skills based on your message
- **Implementation:** TypeScript-based pattern matching

### post-tool-use-tracker.sh
- **Trigger:** After file edits (Edit, MultiEdit, Write)
- **Purpose:** Tracks modified files for session context
- **Implementation:** Lightweight bash script

### pre-tool-use-version-check.sh
- **Trigger:** Before file edits to `cloudflare/files/cloudflare-worker.js`
- **Purpose:** Warns if `WORKER_VERSION` not incremented when modifying worker
- **Implementation:** Compares current version with git HEAD
- **Action:** Warning only (never blocks operations)

### pre-push-validation.sh (Git Hook)
- **Trigger:** Before `git push` operations
- **Purpose:** Validates CLAUDE.md, README.md, and CHANGELOG.md are current
- **Implementation:** Git pre-push hook
- **Action:** Blocks push if documentation is stale

### Configuration

Hooks are configured in [.claude/settings.json](.claude/settings.json). For advanced customization, see [hooks/CONFIG.md](hooks/CONFIG.md).

## Documentation

### Primary Documentation Location

**`docs/for-ai/`** - Comprehensive EDS development documentation (26 files)

Key documents:
- **index.md** - Complete navigation guide
- **getting-started-guide.md** - Role-based learning paths
- **eds.md** - Core EDS concepts (1,937 lines)
- **implementation/** - Block development guides
- **testing/** - Testing and debugging standards
- **guidelines/** - Project standards and architecture

### Quick Reference

See `docs/for-ai/index.md` for the complete documentation map, or use `/review-docs` to get oriented.

## Development Workflow

### EDS-Native Pattern (Simple Blocks)

For simple components (text blocks, banners, cards):

```
blocks/
└── my-block/
    ├── my-block.js      # Vanilla JavaScript
    ├── my-block.css     # Pure CSS
    ├── README.md        # Documentation
    └── test.html        # Test file
```

**Workflow**:
1. `/new-block my-block` → Creates structure
2. Edit files directly in blocks/
3. `/test-block my-block` → Validate
4. Commit and push

### Build-Enhanced Pattern (Complex Blocks)

For complex components (with external libraries like Shoelace, Chart.js):

```
build/my-block/          # Development
├── my-block.js          # Source with imports
├── my-block.css         # Full CSS
├── package.json         # Dependencies
├── vite.config.js       # Bundler config
└── dist/                # Build output

blocks/my-block/         # Deployment
├── my-block.js          # Bundled (from build)
├── my-block.css         # Stub file
└── README.md            # Documentation
```

**Workflow**:
1. `/new-block my-block` → Creates structure in build/
2. Develop in build/my-block/
3. `/test-block my-block` → Validate
4. `/deploy-block my-block` → Copy to blocks/
5. Commit and push

## Best Practices

### Content Driven Development (CDD)

**ALWAYS follow CDD when creating or modifying blocks:**

1. ✅ Content model first
2. ✅ Test content created before coding
3. ✅ Code against real content
4. ✅ Test with real content

**NEVER**:
- ❌ Start coding without test content
- ❌ Skip the content modeling phase
- ❌ Use placeholder/dummy data for development

### Code Quality

- **Linting**: Run `/lint-all` before committing
- **Testing**: Run `/test-block` after changes
- **Security**: Run `/check-security` periodically
- **Review**: Use `/check-block` for architecture validation

### Architecture

- **Simple blocks**: Use EDS-Native pattern (vanilla JS, no build)
- **Complex blocks**: Use Build-Enhanced pattern (with build process)
- **Decision guidance**: See `docs/for-ai/implementation/design-philosophy-guide.md`

## Integration with CLAUDE.md

This `.claude/` directory extends the guidance in `CLAUDE.md`:

- **CLAUDE.md**: Project-level conventions (code style, naming, architecture)
- **.claude/**: Claude Code-specific tools (skills, commands, workflows)
- **docs/for-ai/**: Comprehensive EDS development documentation

All three should be used together for effective AI-assisted development.

## Customization

### Adding New Commands

Create a new `.md` file in `.claude/commands/`:

```markdown
---
description: Short description of what this command does
---

Detailed instructions for Claude to follow when this command is invoked.
```

### Creating New Skills

Use the `skill-creator` skill:
```
@skill-creator
```

Then follow the prompts to create a custom skill for your specific needs.

## Support

- **Issues**: Report issues at https://github.com/anthropics/claude-code/issues
- **Documentation**: See `docs/for-ai/index.md` for complete EDS documentation
- **Help**: Type `/help` for Claude Code help

---

*This configuration is optimized for Adobe Edge Delivery Services (AEM EDS) development following Content Driven Development principles.*
