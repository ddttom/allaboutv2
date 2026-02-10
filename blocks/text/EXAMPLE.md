---
title: "Text Block - Google Docs Example"
description: "Usage examples for the text EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Text Block - Google Docs Example

## How to Use in Google Docs

### Basic Usage

The text block enables dynamic text rendering with template expressions. Simply add the block to your page with text content:

| Text |
|------|
| Your content here with optional expressions |

The block will automatically:

- Render all standard text content
- Process any template expressions found in the text
- Expand variables from `window.siteConfig`
- Execute custom expression functions

### Template Expression Syntax

Template expressions use double curly braces with this format:

`{{expressionName, arguments}}`

**Available Expressions:**

- `{{expand, $NAMESPACE:VARIABLE$}}` - Expand a single variable
- `{{expandlist, $VAR1$, $VAR2$, $VAR3$}}` - Expand multiple variables as a list
- `{{expandprofile, $name$; $title$; $bio$; $linkedinurl$; $linkedintitle$}}` - Create a formatted profile

### Example 1: Simple Text with Variable Expansion

**Google Doc Content:**

| Text |
|------|
| Welcome to {{expand, $page:title$}}! This page is about {{expand, $meta:category$}}. |

**Expected Output:**

If `window.siteConfig` contains:

- `$page:title$` = "My Website"
- `$meta:category$` = "Documentation"

Result: "Welcome to My Website! This page is about Documentation."

### Example 2: Static Text (No Expressions)

**Google Doc Content:**

| Text |
|------|
| This is a simple text block without any dynamic content. Just plain text that will be displayed as-is. |

**Expected Output:**

"This is a simple text block without any dynamic content. Just plain text that will be displayed as-is."

### Example 3: Expanding a List of Variables

**Google Doc Content:**

| Text |
|------|
| {{expandlist, $system:year$, $system:month$, $system:day$}} |

**Expected Output:**

If current date is November 28, 2025:

```
2025
11
28
```

(Each value on a new line)

### Example 4: Profile Expansion

**Google Doc Content:**

| Text |
|------|
| {{expandprofile, $profile:name$; $profile:title$; $profile:bio$; $profile:linkedinurl$; $profile:linkedintitle$}} |

**Expected Output:**

If `window.siteConfig` contains profile data:

```html
<div>
  <h2>Tom Cranstoun</h2>
  <h3>Senior Developer</h3>
  <p>Experienced developer specializing in Edge Delivery Services</p>
  <a href="https://linkedin.com/in/tomcranstoun" title="Connect on LinkedIn">
    https://linkedin.com/in/tomcranstoun
  </a>
</div>
```

### Example 5: Mixed Content

**Google Doc Content:**

| Text |
|------|
| # About This Page<br><br>Page created on {{expand, $system:dateinenglish$}}.<br>Reading time: {{expand, $page:readspeed$}} minutes.<br><br>Category: {{expand, $meta:category$}} |

**Expected Output:**

```
# About This Page

Page created on November 28, 2025.
Reading time: 5 minutes.

Category: Tutorial
```

## Common Variables Available

### System Variables

- `$system:date$` - Current ISO date/time
- `$system:year$` - Current year
- `$system:month$` - Current month (numeric)
- `$system:day$` - Current day
- `$system:time$` - Current time
- `$system:dateinenglish$` - Formatted date (e.g., "November 28, 2025")
- `$system:monthinfull$` - Month name (e.g., "November")
- `$system:monthinshort$` - Month abbreviation (e.g., "Nov")
- `$system:environment$` - Current environment (dev/stage/prod)
- `$system:locale$` - Browser locale
- `$system:timezone$` - User timezone

### Page Variables

- `$page:title$` - Page title
- `$page:name$` - Page path name
- `$page:location$` - Full page URL
- `$page:url$` - Canonical URL
- `$page:path$` - Page path
- `$page:wordcount$` - Total word count
- `$page:readspeed$` - Estimated reading time (minutes)

### Metadata Variables

- `$meta:category$` - Page category
- `$meta:contenttechnology$` - Content technology tag
- Custom metadata keys defined in your page

## Common Usage Patterns

### In Headers with Dynamic Dates

**Google Doc:**

| Text |
|------|
| Last updated: {{expand, $system:dateinenglish$}} |

**Result:**

"Last updated: November 28, 2025"

### In Copyright Notices

**Google Doc:**

| Text |
|------|
| © {{expand, $system:year$}} Tom Cranstoun. All rights reserved. |

**Result:**

"© 2025 Tom Cranstoun. All rights reserved."

### Reading Time Indicators

**Google Doc:**

| Text |
|------|
| Estimated reading time: {{expand, $page:readspeed$}} min |

**Result:**

"Estimated reading time: 5 min"

### Dynamic Breadcrumbs

**Google Doc:**

| Text |
|------|
| You are here: {{expand, $page:name$}} |

**Result:**

"You are here: /docs/tutorial"

## Styling Notes

- The text block inherits global text styles
- Expressions are replaced inline with their output
- No special CSS styling is applied by default
- Profile expansion creates semantic HTML with heading and paragraph tags
- List expansion adds `<br>` tags between items

## Notes for Authors

- **Template Safety**: Unknown variables expand to their literal text (e.g., `$unknown$` stays as is)
- **No Configuration**: Block automatically processes all expressions
- **Real-time Data**: System variables reflect current date/time at page render
- **Flexible Format**: Mix static text with any number of expressions
- **Fallback Behavior**: If expression not found, original text is preserved with console warning

## Common Issues

### Expressions Not Expanding

**Problem:** Template expressions appear as literal text

**Solutions:**

- Verify syntax: `{{expressionName, args}}` (no spaces around commas in expression name)
- Check variable exists in `window.siteConfig`
- Ensure expression name is registered (expand, expandlist, expandprofile)
- Check browser console for warnings about missing expressions

### Variables Show as Literal Text

**Problem:** `$variable$` appears instead of value

**Solutions:**

- Variable doesn't exist in `window.siteConfig`
- Check variable spelling and namespace
- Verify config files are loading (check /config/variables.json)
- Use browser console to inspect `window.siteConfig`

### Profile Not Formatting Correctly

**Problem:** Profile expansion creates unexpected HTML

**Solutions:**

- Use semicolons (`;`) to separate profile arguments
- Provide all 5 arguments: name, title, bio, linkedinurl, linkedintitle
- Ensure each variable exists in siteConfig
- Check that arguments are trimmed (no extra spaces)

### List Items Not on Separate Lines

**Problem:** Expandlist shows items inline instead of separate lines

**Solutions:**

- This is expected behavior - list items are separated by `<br>` tags
- Use comma-separated variable list
- Each item will be on a new line in the rendered output

## For Developers

### Creating Custom Expressions

Add new expressions in `/plusplus/src/clientExpressions.js`:

`Custom Expression Example`
`import { createExpression } from '/plusplus/plugins/expressions/src/expressions.js';`
`createExpression('myExpression', ({ args }) => {`
`// Process args and return string or HTMLElement`
`return \`Processed: \${args}\`;`
`});`

### Expression Renderer API

Renderers receive an object with:

- `name` - Expression name
- `args` - Argument string after expression name
- `parent` - Parent DOM node
- `root` - Root element being processed
- `context` - Optional context data

Renderers can return:

- `HTMLElement` - Inserted into DOM with expression name as class
- `string` - Inserted as text node
- `undefined` - Nothing inserted (preserves original text)

### Variable Access Pattern

Access configuration variables:

`Variable Access`
`const value = window.siteConfig?.[variableName] || fallbackValue;`

### Expression Regex

Default expression regex: `/{{\s*(\w+)\s*(?:,\s*([^}]+))?}}/g`

- Matches: `{{name}}` or `{{name, arguments}}`
- Whitespace insensitive around name
- Arguments: everything after comma until closing braces

### HTML Structure

The block processes text nodes recursively:

`Text Processing`
`<div class="text block">`
`<!-- Original text with {{expressions}} -->`
`<!-- Becomes: -->`
`Text before <span class="expand">expanded value</span> text after`
`</div>`

## Advanced Usage

### Nested Expressions in Rich Content

**Google Doc:**

| Text |
|------|
| # Welcome to {{expand, $page:title$}}<br><br>**Published:** {{expand, $system:dateinenglish$}}<br>**Category:** {{expand, $meta:category$}}<br><br>This content was created for {{expand, $meta:contenttechnology$}} developers. |

### Conditional Display Based on Variables

While expressions don't support conditionals directly, you can create custom expressions with conditional logic:

`Conditional Expression Example`
`createExpression('ifCategory', ({ args }) => {`
`const [category, text] = args.split(',').map(s => s.trim());`
`const pageCategory = window.siteConfig?.['$meta:category$'];`
`return pageCategory === category ? text : '';`
`});`

**Usage:**

| Text |
|------|
| {{ifCategory, Tutorial, This is a tutorial page!}} |

### Dynamic Links with Variables

**Google Doc:**

| Text |
|------|
| View more at: {{expand, $page:url$}} |

### Internationalization

Configure locale-specific variables in `/config/variables.json`:

`i18n Variables`
`{`
`"data": [`
`{ "Item": "$i18n:welcome$", "Value": "Welcome" },`
`{ "Item": "$i18n:readmore$", "Value": "Read More" }`
`]`
`}`

**Usage:**

| Text |
|------|
| {{expand, $i18n:welcome$}} to our site! |

## Related Resources

- **Expression Plugin**: `/plusplus/plugins/expressions/src/expressions.js`
- **Custom Expressions**: `/plusplus/src/clientExpressions.js`
- **Variables System**: `/plusplus/src/variables.js`
- **Config Files**: `/config/variables.json`
- **GitHub Reference**: https://github.com/vtsaplin/franklin-expressions/

| metadata        |                                                                 |
| :-------------- | :-------------------------------------------------------------- |
| title           | Text Block Examples                                             |
| description     | Examples demonstrating the Text block with template expressions and variable expansion |
| json-ld         | article                                                         |
| author          | Tom Cranstoun                                                   |
| contenttechnology | EDS                                                           |
| category        | Documentation                                                   |
| longdescription | This page demonstrates various usage examples of the Text block, showing how it processes template expressions, expands variables from window.siteConfig, and creates dynamic content. Includes expression syntax, custom expression creation, and troubleshooting for developers. |
