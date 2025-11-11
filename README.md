# AllAbout V2 Project

**Author:** Tom Cranstoun  
**GitHub:** [@ddttom](https://github.com/ddttom)

## Overview

This project is built for Adobe Edge Delivery Services (EDS) with a focus on simplicity, performance, and modern web standards. The project intentionally avoids TypeScript and build-heavy frameworks to maintain simplicity and reduce build complexity.

## Development Requirements

- Modern JavaScript (ES modules) without TypeScript
- Pure CSS without preprocessors
- No build-heavy frameworks
- Focus on simplicity and performance
- Clear code organization and documentation
- Minimal dependencies and build steps

## Quick Start

### Development Server

Start the development server designed to improve AI assistant workflows when testing blocks and components:

```bash
npm run debug
```

The server will start on `http://localhost:3000` and provide:
- Local file serving with automatic proxy fallback to `https://allabout.network`
- Support for testing EDS blocks in isolation with immediate feedback
- Comprehensive MIME type support and clear error reporting
- CORS headers for cross-origin requests
- Enhanced logging to help AI assistants understand request flow and debug issues

### Testing Blocks

Create test files in your block directories:

```
blocks/your-block/
├── your-block.js
├── your-block.css
├── README.md
└── test.html
```

**Important**: Test files must use the exact same block structure as EDS to ensure compatibility between local testing and production deployment. Use `.block-name.block` class structure with proper data attributes.

Access your tests at: `http://localhost:3000/blocks/your-block/test.html`

**Interactive Testing with Jupyter Notebooks**: You can also test blocks interactively using Jupyter notebooks with JavaScript (jsdom + JSLab kernel). See [Jupyter Notebook Testing Guide](docs/for-ai/explaining-jupyter.md) for details on this alternative testing approach.

## Project Structure

```
├── blocks/                 # EDS blocks and components
├── docs/                   # Documentation
│   ├── Server-README.md    # Development server documentation
│   ├── eds.txt            # EDS development guide
│   └── eds-appendix.txt   # EDS best practices
├── scripts/               # Core EDS scripts
├── styles/                # Global styles
├── server.js              # Development server
└── package.json           # Project configuration
```

## Available Scripts

- `npm run debug` - Start development server on port 3000
- `npm run lint` - Run ESLint and Stylelint
- `npm run lint:js` - Run ESLint on JavaScript files
- `npm run lint:css` - Run Stylelint on CSS files

## Claude Code Integration

This project includes a complete Claude Code configuration for AI-assisted development:

### Slash Commands
- `/new-block <name>` - Create a new EDS block following Content Driven Development
- `/test-block <name>` - Run tests for a specific block
- `/check-block <name>` - Review block architecture and suggest improvements
- `/deploy-block <name>` - Deploy a block from build/ to blocks/
- `/lint-all` - Run all linting checks
- `/check-security` - Run security checklist validation
- `/start-cdd` - Start Content Driven Development process
- `/review-docs` - Review EDS documentation structure

See [`.claude/README.md`](.claude/README.md) for complete command reference.

### Skills
Auto-activating skills provide inline guidance for:
- **building-blocks** - Creating and modifying EDS blocks
- **content-driven-development** - CDD workflow patterns
- **content-modeling** - Author-friendly content structures
- **testing-blocks** - Block testing strategies
- **eds-block-development** - Complete block development patterns (decorate function, DOM manipulation, error handling)
- **eds-block-testing** - Test file creation and testing workflows
- **eds-performance-debugging** - Performance optimization and debugging techniques
- **jupyter-notebook-testing** - Interactive block testing with Jupyter notebooks, jsdom, and JSLab kernel
- **skill-developer** - Managing Claude Code skills

All skills are tailored specifically for EDS vanilla JavaScript development.

See [`.claude/skills/`](.claude/skills/) for complete skill documentation.

### Agents
Specialized agents for complex tasks:
- **code-architecture-reviewer** - Review code for best practices
- **documentation-architect** - Create comprehensive documentation
- **refactor-planner** - Plan code refactoring strategies
- **web-research-specialist** - Research technical issues

See [`.claude/agents/README.md`](.claude/agents/README.md) for details.

## Development Guidelines

### Code Organization

- Use ES modules for all JavaScript code
- Follow consistent module patterns
- Maintain clear separation of concerns
- Document all blocks and components

### Block Development

Each block should include:
- `blockname.js` - Core functionality
- `blockname.css` - Block-specific styles
- `README.md` - Documentation and usage examples
- 'EXAMPLE.md' - a markdown example, ready to paste into Gdocs
- `test.html` - Development test file

### CSS Best Practices

- Use CSS variables for theming
- Follow mobile-first responsive design
- Use standard breakpoints (600px, 900px, 1200px)
- Never style container elements directly
- Namespace all class names with block name

### JavaScript Best Practices

- Use configuration constants at the top of files
- Implement proper error handling
- Follow async/await patterns
- Use ESLint disable comments for console statements
- Keep functions focused and modular

## Documentation

### Core Documentation
- [Development Server Guide](docs/Server-README.md) - Comprehensive server documentation
- [Block Debugging Guide](docs/debug.md) - Step-by-step debugging guide for AI assistants
- [Fast EDS Development Tutorial](docs/blog.md) - Complete tutorial with real-world examples
- [EDS Development Guide](docs/eds.md) - Complete EDS development reference
- [EDS Best Practices](docs/eds-appendix.md) - Advanced patterns and techniques

### Testing Documentation
- [Jupyter Notebook Testing Guide](docs/for-ai/explaining-jupyter.md) - Interactive block testing with JavaScript, jsdom, and JSLab kernel
- [EDS Native Testing Standards](docs/for-ai/testing/eds-native-testing-standards.md) - Traditional test.html testing patterns

### For AI Assistants
- [Complete AI Documentation Index](docs/for-ai/index.md) - Navigation hub for all 26 EDS development guides

## Security and Performance

- No build process required, if components need build use a separate repo - see https://github.com/ddttom/spectrum-with-eds
- Zero dependencies for core functionality
- Optimized for Core Web Vitals
- Security through proper application hardening
- Minimal attack surface

## Contributing

When contributing to this project:

1. Follow the established development requirements
2. Maintain the focus on simplicity and performance
3. Document all new blocks and components
4. Test thoroughly using the development server
5. Test thoroughly on EDS
6. Ensure code passes linting requirements

## Notes

- Do not use placeholders in markdown documents
- All code should be production-ready and well-documented
- Focus on solving real problems with simple, effective solutions
