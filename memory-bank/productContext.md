# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2024-03-20 20:39:16 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

* The project is an Adobe Edge Delivery Services (EDS) website that uses block-based development to create a modern, performant web experience.
* The code-expander block is a component that enhances code snippets with syntax highlighting, copy functionality, and other interactive features.
* The current enhancement focuses on improving the language detection capabilities of the code-expander block, specifically adding JavaScript detection for lines starting with "//".

## Key Features

* **Block-based Development**: The website uses EDS blocks for modular functionality.
* **Code Expander Block**: Enhances code snippets with:
  * Syntax highlighting for multiple programming languages
  * Copy to clipboard functionality
  * Download code functionality
  * Toggle between raw and formatted views
  * Expandable view for long code blocks
  * Automatic language detection

## Overall Architecture

* **Adobe Edge Delivery Services (EDS)**: The website is built on Adobe's EDS platform, which provides serverless architecture and content delivery.
* **Block Components**: Functionality is organized into self-contained blocks that can be reused across the site.
* **Progressive Enhancement**: The code-expander block enhances existing code snippets without requiring changes to the original content.
* **Modern JavaScript**: The codebase uses modern JavaScript (ES modules) without TypeScript or heavy frameworks.
* **Pure CSS**: Styling is done with CSS3 variables and without preprocessors.