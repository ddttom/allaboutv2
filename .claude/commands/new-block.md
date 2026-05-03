---
description: Create a new EDS block following Content Driven Development (CDD) process

mx:
  canonicalUri: https://raw.githubusercontent.com/ddttom/allaboutv2/main/.claude/commands/new-block.md
---

You are creating a new EDS block. Follow these steps:

1. **Invoke the content-driven-development skill** to start the CDD process
2. The skill will guide you through:
   - Content model design
   - Test content creation
   - Block implementation
   - Testing and validation

**IMPORTANT**:

- Never skip the CDD process when creating new blocks
- Author needs come before developer needs
- Always create test content before writing code

Uae this patter to create and document the new block:

─ blocks/                         # 📝 DIRECT DEVELOPMENT
    └── {component-name}/
        ├── {component-name}.js     # Source code (edit directly)
        ├── {component-name}.css    # Source styles (edit directly)
        ├── README.md               # Documentation for Content Author
        ├── test.html               # Test file
        └── example.md              # Content author example of the component

If the user provides a block name as an argument, use it. Otherwise, ask the user:
"What would you like to name this new block?"

After getting the block name, invoke the content-driven-development skill and begin the process.
