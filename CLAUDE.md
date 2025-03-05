# AllAboutV2 Project Guide

## Commands
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run lint` - Run all linting

## Code Style
- **JS**: Follows Airbnb style guide (eslint-config-airbnb-base)
- **CSS**: Follows stylelint-config-standard
- **Block Structure**: Each block has its own directory with JS/CSS/README
- **Naming**: Use kebab-case for files and block names
- **JS Modules**: Use ES modules with named exports
- **Error Handling**: Use try/catch with graceful degradation
- **DOM Manipulation**: Use vanilla JS DOM methods

## Architecture
- Project follows Adobe Helix/Franklin architecture
- Blocks are independent web components with isolated functionality
- Configuration in /config directory with environment-specific variables
- Scripts loaded via head.html and scripts.js

## Conventions
- Keep code DRY, simple, and accessible
- Add README for each new block with usage examples
- Responsive design throughout all components
- Never use Typescript or any Framework live react