# AllAboutV2 Project Guide

## Quick Reference

### For AI Assistants
- **Comprehensive Documentation**: See `docs/for-ai/` directory (26 detailed guides)
- **Claude Code Tools**: See `.claude/` directory (skills and slash commands)
- **Start Here**: `docs/for-ai/index.md` for complete navigation

### Common Workflows
- **Create new block**: Use `/new-block <name>` command (follows Content Driven Development)
- **Test a block**: Use `/test-block <name>` command
- **Review documentation**: Use `/review-docs` command
- **Run all linting**: Use `/lint-all` command or `npm run lint`

## Commands

### NPM Scripts
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run lint` - Run all linting

### Slash Commands (Claude Code)
- `/new-block <name>` - Create new EDS block with Content Driven Development
- `/start-cdd` - Start Content Driven Development process
- `/test-block <name>` - Run comprehensive tests for a block
- `/deploy-block <name>` - Deploy build-enhanced block to production
- `/lint-all` - Run all linting checks
- `/check-block <name>` - Architecture review and improvement suggestions
- `/check-security` - Run security validation
- `/review-docs` - Navigate EDS documentation

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
- Security checklist: `docs/for-ai/guidelines/security-checklist.md`
- Frontend guidelines: `docs/for-ai/guidelines/frontend-guidelines.md`