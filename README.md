# AllAbout V2 Project

**Author:** Tom Cranstoun  
**GitHub:** [@ddttom](https://github.com/ddttom)

## Overview

This project is built using Adobe Edge Delivery Services (EDS) with a focus on simplicity, performance, and modern web standards. The project intentionally avoids TypeScript and build-heavy frameworks to maintain simplicity and reduce build complexity.

## Development Requirements

- Modern JavaScript (ES modules) without TypeScript
- Pure CSS without preprocessors
- No build-heavy frameworks
- Focus on simplicity and performance
- Clear code organization and documentation
- Minimal dependencies and build steps

## Quick Start

### Development Server

Start the development server for testing blocks and components:

```bash
npm run debug
```

The server will start on `http://localhost:3000` and provide:
- Local file serving with automatic proxy fallback to `https://allabout.network`
- Support for testing EDS blocks in isolation
- Comprehensive MIME type support
- CORS headers for cross-origin requests

### Testing Blocks

Create test files in your block directories:

```
blocks/your-block/
├── your-block.js
├── your-block.css
├── README.md
└── test.html
```

Access your tests at: `http://localhost:3000/blocks/your-block/test.html`

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

- [Development Server Guide](docs/Server-README.md) - Comprehensive server documentation
- [EDS Development Guide](docs/eds.txt) - Complete EDS development reference
- [EDS Best Practices](docs/eds-appendix.txt) - Advanced patterns and techniques

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
