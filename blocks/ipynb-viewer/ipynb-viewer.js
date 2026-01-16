/**
 * IPynb Viewer Block
 * Displays Jupyter notebook (.ipynb) files with interactive JavaScript execution
 */

/* eslint-disable no-use-before-define */
// Note: This file uses function hoisting patterns where functions call each other
// before their definitions. This is valid JavaScript and the functions are properly
// hoisted. The complex nested structure makes reordering impractical.

// ============================================================================
// GLOBAL CONSTANTS - Developer-facing error messages (easily searchable)
// ============================================================================
const IPYNB_ERRORS = {
  CONFIG_MISSING_OVERLAY: 'Incomplete code: Configuration object missing. Block cannot initialize.',
  CONFIG_MISSING_GITHUB: 'Incomplete code: Configuration object missing. Cannot display GitHub markdown.',
  CONFIG_MISSING_HELP: 'Help button clicked but configuration object is missing.',
};

// ============================================================================
// MODULE-LEVEL CONSTANTS
// ============================================================================
// SVG Inline Cache (kept at module level for cross-invocation caching)
const SVG_INLINE_CACHE = new Map();

/**
 * Parse markdown text to HTML (enhanced implementation)
 * @param {string} markdown - Markdown text
 * @param {string} [repoUrl] - Optional repository URL for converting .md links
 * @param {string} [branch='main'] - GitHub branch to use for .md links
 * @param {string} [currentFilePath] - Optional current file path for resolving relative links
 * @returns {string} HTML string
 */
function parseMarkdown(markdown, repoUrl = null, branch = 'main', currentFilePath = null) {
  let html = markdown;

  // Filter out LaTeX commands and attributes (lines starting with \ or containing {.attribute})
  // These are LaTeX formatting commands like \newpage, \pagebreak, \addtocontents, etc.
  // and Pandoc/LaTeX class attributes like {.unnumbered .unlisted}
  // that should be ignored in markdown rendering
  html = html.split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      // Remove lines that start with a LaTeX command (backslash followed by letters)
      if (/^\\[a-zA-Z]+/.test(trimmed)) {
        return false;
      }
      // Remove lines that are ONLY LaTeX/Pandoc class attributes like {.unnumbered .unlisted}
      if (/^\{\.[a-zA-Z.\s]+\}$/.test(trimmed)) {
        return false;
      }
      return true;
    })
    .join('\n');

  // Code blocks (triple backticks) - MUST be processed first before other replacements
  const codeBlockPlaceholders = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    // Preserve formatting: escape HTML but keep newlines and indentation
    const escapedCode = code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlockPlaceholders.push(`<pre><code class="language-${lang || 'plaintext'}">${escapedCode}</code></pre>`);
    return placeholder;
  });

  // Extract inline code and protect it with placeholders
  const inlineCodePlaceholders = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
    inlineCodePlaceholders.push(code);
    return placeholder;
  });

  // Handle escaped HTML characters (e.g., \<img>, \:// in documentation examples)
  // These should be rendered as literal text, not actual HTML
  html = html.replace(/\\</g, '&lt;');
  html = html.replace(/\\>/g, '&gt;');
  html = html.replace(/\\:/g, ':');

  // Convert angle-bracket enclosed URLs to markdown link format
  // Must happen BEFORE HTML escaping (line 69) to preserve angle brackets
  // Example: <https://github.com> becomes [https://github.com](https://github.com)
  html = html.replace(/<(https?:\/\/[^>]+)>/g, (match, url) => `[${url}](${url})`);

  // Escape all remaining HTML tags (not in code blocks or inline code)
  // This prevents inline HTML from being rendered, matching GitHub's behavior
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');

  // Tables - must be before line breaks
  const lines = html.split('\n');
  const processedLines = [];
  let inTable = false;
  let tableRows = [];
  let tableRowCount = 0;

  // Helper function to create a table row (defined outside loop to avoid closure issues)
  const createTableRow = (tableCells, isFirstRow) => {
    const tag = isFirstRow ? 'th' : 'td';
    return `<tr>${tableCells.map((cell) => `<${tag}>${cell.trim()}</${tag}>`).join('')}</tr>`;
  };

  lines.forEach((line) => {
    // Check if line is a table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Skip separator rows (|---|---|) - must include | in character class
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) {
        return; // Skip this iteration (equivalent to continue)
      }

      if (!inTable) {
        inTable = true;
        tableRows = [];
        tableRowCount = 0;
      }

      const tableCells = line.split('|').filter((cell) => cell.trim());
      const row = createTableRow(tableCells, tableRowCount === 0);
      tableRows.push(row);
      tableRowCount += 1;
    } else {
      // Not a table row
      if (inTable) {
        // End of table, flush accumulated rows
        processedLines.push(`<table>${tableRows.join('')}</table>`);
        tableRows = [];
        tableRowCount = 0;
        inTable = false;
      }
      processedLines.push(line);
    }
  });

  // Flush any remaining table
  if (inTable && tableRows.length > 0) {
    processedLines.push(`<table>${tableRows.join('')}</table>`);
  }

  html = processedLines.join('\n');

  // Headers (process in order from most specific to least)
  // Add IDs to h2 headers for navigation
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    // Generate ID from text (lowercase, replace spaces with hyphens, remove special chars)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
      .trim();

    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Horizontal rules (must be before bold/italic to avoid conflicts)
  // Matches: ---, ***, or ___ (3 or more, with optional spaces)
  html = html.replace(/^(?:[-*_]\s*){3,}$/gim, '<hr>');

  // Images - process BEFORE links since images use ![alt](url) syntax
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    // Auto-convert PNG illustrations to SVG (pattern: illustrations/*.png → illustrations/*.svg)
    let processedUrl = url;
    if (url.match(/illustrations\/.*\.png$/i)) {
      processedUrl = url.replace(/\.png$/i, '.svg');
    }

    // Resolve image URLs to GitHub raw content if repo available and path is relative
    if (repoUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      let imagePath = processedUrl;

      // Resolve relative paths based on current file location
      if (currentFilePath && !processedUrl.startsWith('/')) {
        // Extract directory from current file
        const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
        const parts = currentDir ? currentDir.split('/') : [];
        const urlParts = processedUrl.replace(/^\.\//, '').split('/');

        // Process path parts
        urlParts.forEach((part) => {
          if (part === '..') {
            if (parts.length > 0) parts.pop();
          } else if (part !== '.' && part !== '') {
            parts.push(part);
          }
        });

        imagePath = parts.join('/');
      } else if (processedUrl.startsWith('/')) {
        // Absolute path from repo root
        imagePath = processedUrl.replace(/^\//, '');
      }

      // Convert to raw GitHub URL
      const rawUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/${branch}/${imagePath}`;
      return `<img src="${rawUrl}" alt="${alt}" class="ipynb-markdown-image" loading="lazy">`;
    }

    // Return inline image with alt text (for absolute URLs or when no repo)
    return `<img src="${processedUrl}" alt="${alt}" class="ipynb-markdown-image" loading="lazy">`;
  });

  // Links - convert .md files to repo URLs if repo is available
  // Process AFTER images (images also use bracket syntax but with ! prefix)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Auto-convert PNG illustrations to SVG (pattern: illustrations/*.png → illustrations/*.svg)
    let processedUrl = url;
    if (url.match(/illustrations\/.*\.png$/i)) {
      processedUrl = url.replace(/\.png$/i, '.svg');
    }

    // Check if it's a .md file and we have a repo URL
    if (repoUrl && processedUrl.endsWith('.md') && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      let cleanPath = processedUrl;

      // Resolve relative paths based on current file location
      if (currentFilePath && !processedUrl.startsWith('/') && !processedUrl.startsWith('http')) {
        // This is a relative path - resolve it based on current file's directory

        // Extract the directory path from the current file (remove filename)
        const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));

        // Combine current directory with relative path
        const parts = currentDir ? currentDir.split('/') : [];
        const urlParts = processedUrl.replace(/^\.\//, '').split('/'); // Remove leading ./ if present

        // Process each part of the URL
        urlParts.forEach((part) => {
          if (part === '..') {
            // Go up one directory
            if (parts.length > 0) {
              parts.pop();
            }
          } else if (part !== '.' && part !== '') {
            // Add directory or filename
            parts.push(part);
          }
        });

        cleanPath = parts.join('/');
      } else if (processedUrl.startsWith('/')) {
        // Absolute path from repo root - remove leading /
        cleanPath = processedUrl.replace(/^\//, '');
      } else {
        // No currentFilePath or already absolute URL
        cleanPath = processedUrl.replace(/^\.?\//, '');
        if ((processedUrl.startsWith('../') || processedUrl.includes('/../')) && !currentFilePath) {
          console.warn('⚠️  Relative path with ".." but no currentFilePath provided:', processedUrl);
        }
      }

      // Build full repo URL using the specified branch
      const fullUrl = `${repoUrl}/blob/${branch}/${cleanPath}`;
      // Mark GitHub markdown links with special class for overlay handling
      // Use href="#" to prevent browser prefetching, store actual URL in data attribute
      return `<a href="#" class="ipynb-github-md-link" data-md-url="${fullUrl}" data-md-path="${cleanPath}" data-repo="${repoUrl}" data-branch="${branch}">${text}</a>`;
    }

    // External links (http/https) - clickable links that open in new tab
    if (processedUrl.startsWith('http://') || processedUrl.startsWith('https://')) {
      return `<a href="${processedUrl}" class="ipynb-external-link" title="Open in new tab: ${processedUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }

    // Hash links - keep as-is for internal navigation
    if (processedUrl.startsWith('#')) {
      return `<a href="${processedUrl}">${text}</a>`;
    }

    // Other file types (.html, .htm, images, etc.) - display as non-clickable text
    // Show the filename/path for documentation purposes (show converted URL)
    return `<span class="ipynb-non-md-link" title="${processedUrl}">${text} <code>(${processedUrl})</code></span>`;
  });

  // Lists - process line by line with nested list support (BEFORE bold/italic)
  const linesWithLists = html.split('\n');
  const processedWithLists = [];
  const listStack = []; // Track nested list state: [{type: 'ol'|'ul', indent: number}]
  let lastIndent = -1;

  linesWithLists.forEach((line) => {
    // Match list items with indentation
    const ulMatch = line.match(/^(\s*)[-*] (.+)$/);
    const olMatch = line.match(/^(\s*)\d+\. (.+)$/);

    if (ulMatch || olMatch) {
      const isUl = !!ulMatch;
      const indent = (ulMatch ? ulMatch[1] : olMatch[1]).length;
      const content = ulMatch ? ulMatch[2] : olMatch[2];
      const listType = isUl ? 'ul' : 'ol';

      // Handle nesting based on indentation
      if (indent > lastIndent) {
        // Starting a new nested list
        if (listStack.length > 0) {
          // Close the previous <li> and open nested list inside it
          const lastItem = processedWithLists[processedWithLists.length - 1];
          if (lastItem && lastItem.endsWith('</li>')) {
            // Remove the closing </li> tag
            processedWithLists[processedWithLists.length - 1] = lastItem.slice(0, -5);
          }
        }
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      } else if (indent < lastIndent) {
        // Closing nested lists
        while (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
          const closed = listStack.pop();
          processedWithLists.push(`</${closed.type}>`);
          // Close the parent <li> that contained the nested list
          if (listStack.length > 0) {
            processedWithLists.push('</li>');
          }
        }

        // Check if we need to start a new list at this level
        if (listStack.length === 0 || listStack[listStack.length - 1].type !== listType) {
          if (listStack.length > 0) {
            // Close existing list at this level
            const closed = listStack.pop();
            processedWithLists.push(`</${closed.type}>`);
          }
          processedWithLists.push(`<${listType}>`);
          listStack.push({ type: listType, indent });
        }
      } else if (listStack.length > 0 && listStack[listStack.length - 1].type !== listType) {
        // Same indent but different list type - close and reopen
        const closed = listStack.pop();
        processedWithLists.push(`</${closed.type}>`);
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      } else if (listStack.length === 0) {
        // First list item
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      }

      processedWithLists.push(`<li>${content}</li>`);
      lastIndent = indent;
    } else {
      // Non-list line - close all open lists
      while (listStack.length > 0) {
        const closed = listStack.pop();
        processedWithLists.push(`</${closed.type}>`);
      }
      processedWithLists.push(line);
      lastIndent = -1;
    }
  });

  // Close any remaining open lists
  while (listStack.length > 0) {
    const closed = listStack.pop();
    processedWithLists.push(`</${closed.type}>`);
  }

  html = processedWithLists.join('\n');

  // Bold (process after lists to allow bold text in list items)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic (process after bold)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes - process line by line (must match raw > character, not &gt;)
  const linesWithBlockquotes = html.split('\n');
  const processedWithBlockquotes = [];
  let inBlockquote = false;

  linesWithBlockquotes.forEach((line) => {
    // Match lines starting with > (raw character, before any HTML encoding)
    const blockquoteMatch = line.match(/^>\s?(.*)$/);

    if (blockquoteMatch) {
      if (!inBlockquote) {
        processedWithBlockquotes.push('<blockquote>');
        inBlockquote = true;
      }
      // Add the line content (without the > prefix)
      processedWithBlockquotes.push(blockquoteMatch[1]);
    } else {
      // Close blockquote if we were in one
      if (inBlockquote) {
        processedWithBlockquotes.push('</blockquote>');
        inBlockquote = false;
      }
      processedWithBlockquotes.push(line);
    }
  });

  // Close any remaining open blockquote
  if (inBlockquote) processedWithBlockquotes.push('</blockquote>');

  html = processedWithBlockquotes.join('\n');

  // Line breaks - wrap paragraphs properly
  // Split by double newlines to identify paragraphs
  const paragraphs = html.split(/\n\n+/);

  // Wrap each paragraph in <p> tags, unless it's already a block element
  // CRITICAL FIX: Add __CODEBLOCK_ pattern to prevent wrapping placeholders in <p> tags
  const blockElementPattern = /^<(h[1-6]|table|ul|ol|blockquote|pre|hr)|__CODEBLOCK_/;
  const preBlockPattern = /^<pre/; // Separate pattern for code blocks that need newlines preserved

  html = paragraphs
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return ''; // Skip empty paragraphs
      if (blockElementPattern.test(trimmed)) {
        // Block element detected
        if (preBlockPattern.test(trimmed)) {
          // Code blocks - preserve all newlines
          return trimmed;
        }
        // Other block elements - convert newlines to spaces
        return trimmed.replace(/\n/g, ' ');
      }
      // Regular paragraph - wrap in <p> and convert single newlines to spaces
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .filter((p) => p) // Remove empty strings
    .join('\n\n'); // Use double newline for better spacing between blocks

  // Restore code blocks (MOVED to after paragraph processing to prevent splitting by newlines)
  codeBlockPlaceholders.forEach((codeBlock, index) => {
    html = html.replace(`__CODEBLOCK_${index}__`, codeBlock);
  });

  // Restore inline code (now as <code> elements with content)
  // Escape HTML entities to display code literally (e.g., `<div>` shows as <div>, not rendered)
  inlineCodePlaceholders.forEach((code, index) => {
    const escapedCode = code
      .replace(/&/g, '&amp;') // Must be first - escape existing ampersands
      .replace(/</g, '&lt;') // Escape less-than
      .replace(/>/g, '&gt;') // Escape greater-than
      .replace(/"/g, '&quot;') // Escape double quotes
      .replace(/'/g, '&#39;'); // Escape single quotes
    html = html.replace(`__INLINECODE_${index}__`, `<code>${escapedCode}</code>`);
  });

  return html;
}

/**
 * Display splash screen image that auto-dismisses after duration
 * @param {string} imageUrl - URL of splash screen image
 * @param {number} minDuration - Display duration in milliseconds (default 4000, should match config.defaultSplashDuration)
 * @returns {Promise<void>} Promise that resolves after splash fades out
 */
function showSplashScreen(imageUrl, minDuration = 4000) {
  // eslint-disable-next-line no-console
  console.log('[SPLASH] showSplashScreen called');
  // eslint-disable-next-line no-console
  console.log('[SPLASH] imageUrl:', imageUrl);
  // eslint-disable-next-line no-console
  console.log('[SPLASH] minDuration:', minDuration);

  return new Promise((resolve) => {
    // eslint-disable-next-line no-console
    console.log('[SPLASH] Creating splash overlay...');

    // Create splash overlay
    const splashOverlay = document.createElement('div');
    splashOverlay.className = 'ipynb-splash-overlay';
    splashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;

    // Create countdown timer
    const countdownTimer = document.createElement('div');
    countdownTimer.setAttribute('aria-live', 'polite');
    countdownTimer.setAttribute('aria-label', 'Countdown timer');
    countdownTimer.style.cssText = `
      position: absolute;
      top: 20px;
      right: 80px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.5);
      color: white;
      font-size: 20px;
      font-weight: bold;
      padding: 10px 16px;
      border-radius: 24px;
      font-family: monospace;
      min-width: 50px;
      text-align: center;
    `;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close splash screen');
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.5);
      color: white;
      font-size: 32px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding: 0;
      transition: all 0.2s ease;
    `;

    // Close button hover effect
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
      closeButton.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      closeButton.style.transform = 'scale(1.1)';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
      closeButton.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      closeButton.style.transform = 'scale(1)';
    });

    // Create image element
    const splashImage = document.createElement('img');
    splashImage.src = imageUrl;
    splashImage.alt = 'Splash screen';
    splashImage.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 8px;
    `;

    splashOverlay.appendChild(countdownTimer);
    splashOverlay.appendChild(closeButton);
    splashOverlay.appendChild(splashImage);
    document.body.appendChild(splashOverlay);
    // eslint-disable-next-line no-console
    console.log('[SPLASH] Splash overlay added to body');

    // Fade in
    requestAnimationFrame(() => {
      splashOverlay.style.opacity = '1';
      // eslint-disable-next-line no-console
      console.log('[SPLASH] Faded in splash overlay');
    });

    const startTime = Date.now();

    // Update countdown timer
    const updateCountdown = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((minDuration - elapsed) / 1000));
      countdownTimer.textContent = `${remaining}s`;

      if (remaining > 0) {
        requestAnimationFrame(updateCountdown);
      }
    };
    updateCountdown();

    // Helper fadeOut function
    const fadeOut = () => {
      // eslint-disable-next-line no-console
      console.log('[SPLASH] fadeOut() - fading out splash');
      splashOverlay.style.opacity = '0';
      setTimeout(() => {
        if (splashOverlay.parentNode) {
          document.body.removeChild(splashOverlay);
          // eslint-disable-next-line no-console
          console.log('[SPLASH] Splash overlay removed from DOM');
        } else {
          // eslint-disable-next-line no-console
          console.log('[SPLASH] Splash overlay already removed from DOM');
        }
      }, 300);
    };

    // Track resolution state and auto-dismiss timer
    let isResolved = false;
    let autoDismissTimer = null;

    // Helper to safely resolve once
    const resolveOnce = (reason) => {
      if (!isResolved) {
        isResolved = true;
        // eslint-disable-next-line no-console
        console.log(`[SPLASH] Resolving promise (${reason})`);
        resolve();
      } else {
        // eslint-disable-next-line no-console
        console.log(`[SPLASH] Promise already resolved, ignoring ${reason}`);
      }
    };

    // Create dismiss function for close button
    const dismiss = () => {
      // eslint-disable-next-line no-console
      console.log('[SPLASH] dismiss() called (close button clicked)');

      // Cancel auto-dismiss timer if it hasn't fired yet
      if (autoDismissTimer !== null) {
        // eslint-disable-next-line no-console
        console.log('[SPLASH] Canceling auto-dismiss timer');
        clearTimeout(autoDismissTimer);
        autoDismissTimer = null;
      }

      // Fade out immediately
      // eslint-disable-next-line no-console
      console.log('[SPLASH] Starting immediate fade out');
      fadeOut();

      // Resolve after fade completes
      setTimeout(() => {
        resolveOnce('manual dismiss');
      }, 350);
    };

    // Wire up close button
    closeButton.addEventListener('click', dismiss);

    // Auto-dismiss after minimum duration and resolve promise
    autoDismissTimer = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('[SPLASH] Auto-dismiss timer fired');
      autoDismissTimer = null; // Timer has fired

      fadeOut();
      // Resolve after fade completes (300ms fade + small buffer)
      setTimeout(() => {
        resolveOnce('auto dismiss');
      }, 350);
    }, minDuration);
  });
}

/**
 * Create help button click handler with two-tier fallback strategy
 * @param {string} repoUrl - Notebook's repository URL
 * @param {string} branch - GitHub branch from metadata
 * @param {Object} overlayContext - Context object containing createGitHubMarkdownOverlay parameters
 * @returns {Function} Async click handler for help button
 */
function createHelpButtonHandler(repoUrl, branch, overlayContext, config) {
  return async () => {
    // Priority order for help.md:
    // 1. First try: allaboutv2 repo main branch (from config fallback)
    // 2. If that fails: try notebook's repo using github-branch metadata

    // If no config provided, cannot show help (config contains all necessary values)
    if (!config) {
      console.error(`[IPYNB-VIEWER] ${IPYNB_ERRORS.CONFIG_MISSING_HELP}`);
      return;
    }

    const fallbackRepo = config.fallbackHelpRepo;
    const fallbackBranch = config.fallbackHelpBranch;
    const fallbackHelpPath = `${fallbackRepo}/blob/${fallbackBranch}/${config.fallbackHelpPath}`;

    // Try fetching from fallback first
    const fallbackRawUrl = fallbackHelpPath.replace('/blob/', '/').replace('github.com', 'raw.githubusercontent.com');

    try {
      const response = await fetch(fallbackRawUrl);
      if (response.ok) {
        // Fallback succeeded - use allaboutv2 main branch
        const helpOverlay = overlayContext.createGitHubMarkdownOverlay(
          fallbackHelpPath,
          config.helpOverlayTitle,
          fallbackRepo,
          fallbackBranch,
          overlayContext.history,
          overlayContext.hideTopbar,
        );
        helpOverlay.openOverlay();
        return;
      }
    } catch (error) {
      // Fallback failed, continue to try notebook repo
      // eslint-disable-next-line no-console
      console.log('[HELP] Fallback help.md not found, trying notebook repo');
    }

    // Fallback failed - try notebook's repo with github-branch
    const notebookHelpPath = `${repoUrl}/blob/${branch}/docs/help.md`;
    const helpOverlay = overlayContext.createGitHubMarkdownOverlay(
      notebookHelpPath,
      'IPynb Viewer Help',
      repoUrl,
      branch,
      overlayContext.history,
      overlayContext.hideTopbar,
    );
    helpOverlay.openOverlay();
  };
}

/**
 * Create dropdown close handler for clicking outside
 * @param {Array} dropdowns - Array of {dropdown, button} objects
 * @returns {Function} Click handler for document
 */
function createDropdownCloseHandler(dropdowns) {
  return (e) => {
    dropdowns.forEach(({ dropdown, button }) => {
      if (dropdown && !dropdown.contains(e.target) && e.target !== button) {
        dropdown.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
      }
    });
  };
}

/**
 * Create tree toggle button click handler
 * @param {HTMLElement} navTreePanel - Navigation tree panel element
 * @param {HTMLElement} treeToggleButton - Tree toggle button element
 * @returns {Function} Click handler for tree toggle button
 */
function createTreeToggleHandler(navTreePanel, treeToggleButton) {
  return () => {
    const isVisible = navTreePanel.style.display !== 'none';
    if (isVisible) {
      // Hide tree - show right arrow (►) to indicate it can be opened
      navTreePanel.style.display = 'none';
      treeToggleButton.innerHTML = '&#9654;'; // Right arrow (►)
      treeToggleButton.setAttribute('aria-expanded', 'false');
      treeToggleButton.setAttribute('title', 'Show Tree');
    } else {
      // Show tree - show left arrow (◄) to indicate it can be closed
      navTreePanel.style.display = '';
      treeToggleButton.innerHTML = '&#9664;'; // Left arrow (◄)
      treeToggleButton.setAttribute('aria-expanded', 'true');
      treeToggleButton.setAttribute('title', 'Hide Tree');
    }
  };
}

/**
 * Fetch SVG content with timeout
 * @param {string} url - URL of SVG file
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<string|null>} SVG text content or null on error
 */
async function fetchSVGContent(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`⚠️ Failed to fetch SVG (HTTP ${response.status}): ${url}`);
      return null;
    }

    const svgText = await response.text();
    return svgText;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn(`⚠️ SVG fetch timeout: ${url}`);
    } else {
      console.warn(`⚠️ Failed to fetch SVG: ${url}`, error);
    }
    return null;
  }
}

/**
 * Sanitize SVG content and add accessibility
 * @param {string} svgText - Raw SVG XML text
 * @param {string} altText - Alt text to add as title
 * @returns {string|null} Sanitized SVG HTML string or null on error
 */
function sanitizeSVG(svgText, altText) {
  try {
    // Parse SVG XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');

    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.warn('⚠️ Invalid SVG XML:', parserError.textContent);
      return null;
    }

    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      console.warn('⚠️ No <svg> element found in SVG content');
      return null;
    }

    // Remove script tags for security
    const scripts = svgElement.querySelectorAll('script');
    scripts.forEach((script) => script.remove());

    // Add title for accessibility if altText provided and no title exists
    if (altText && !svgElement.querySelector('title')) {
      const title = doc.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = altText;
      svgElement.insertBefore(title, svgElement.firstChild);
    }

    // Add class for styling
    svgElement.classList.add('ipynb-markdown-image');

    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  } catch (error) {
    console.warn('⚠️ Failed to sanitize SVG:', error);
    return null;
  }
}

/**
 * Inline SVG illustrations in HTML
 * @param {string} htmlString - HTML string with img tags
 * @param {Object} options - SVG inlining options
 * @param {RegExp} options.pattern - Pattern to match SVG paths (default: /\/illustrations\/[^/]+\.svg$/i)
 * @param {number} options.timeout - Fetch timeout in ms (default: 10000)
 * @returns {Promise<string>} HTML string with inlined SVGs
 */
async function inlineSVGIllustrations(htmlString, options = {}) {
  // Default options
  const pattern = options.pattern || /\/illustrations\/[^/]+\.svg$/i;
  const timeout = options.timeout || 10000;

  try {
    // Parse HTML to find img tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const images = doc.querySelectorAll('img');

    // Find illustration SVGs to inline
    const svgsToInline = [];
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && pattern.test(src)) {
        svgsToInline.push({ img, src, alt: img.getAttribute('alt') || '' });
      }
    });

    if (svgsToInline.length === 0) {
      return htmlString; // No SVGs to inline
    }

    // Fetch all SVGs in parallel
    const fetchPromises = svgsToInline.map(async ({ img, src, alt }) => {
      // Check cache first
      if (SVG_INLINE_CACHE.has(src)) {
        return { img, svg: SVG_INLINE_CACHE.get(src), src };
      }

      // Fetch and sanitize
      const svgText = await fetchSVGContent(src, timeout);
      if (!svgText) {
        return { img, svg: null, src }; // Keep as img tag
      }

      const sanitizedSVG = sanitizeSVG(svgText, alt);
      if (!sanitizedSVG) {
        return { img, svg: null, src }; // Keep as img tag
      }

      // Cache the result
      SVG_INLINE_CACHE.set(src, sanitizedSVG);

      return { img, svg: sanitizedSVG, src };
    });

    const results = await Promise.all(fetchPromises);

    // Replace img tags with inline SVGs
    results.forEach(({ img, svg }) => {
      if (svg) {
        // Create a temporary container to parse the SVG string
        const tempDiv = doc.createElement('div');
        tempDiv.innerHTML = svg;
        const svgElement = tempDiv.querySelector('svg');

        if (svgElement) {
          img.parentNode.replaceChild(svgElement, img);
        }
      }
      // If svg is null, keep the original img tag (fallback)
    });

    // Serialize back to HTML string
    return doc.body.innerHTML;
  } catch (error) {
    console.warn('⚠️ Failed to inline SVG illustrations:', error);
    return htmlString; // Return original HTML on error
  }
}

/**
 * Detect cell type based on content patterns
 * @param {string} content - Cell content
 * @param {number} index - Cell index
 * @returns {string} Cell type: 'hero', 'intro', 'transition', or 'content'
 */
function detectCellType(content, index) {
  // Hero cell is the first cell with large heading
  if (index === 0 && content.includes('# ')) {
    return 'hero';
  }

  // Intro cells have thick borders - typically cells with key introductory content
  // These are usually the first few content cells after hero
  if (index <= 2 && content.includes('## ')) {
    return 'intro';
  }

  // Transition cells are short (1-2 lines) and often centered text
  const lines = content.trim().split('\n').filter((line) => line.trim());
  if (lines.length <= 3 && !content.includes('##') && !content.includes('###')) {
    return 'transition';
  }

  // Default to content card
  return 'content';
}

/**
 * Wrap markdown content with appropriate styling classes
 * @param {string} html - Parsed HTML content
 * @param {string} cellType - Cell type
 * @returns {string} Wrapped HTML
 */
function wrapMarkdownContent(html, cellType) {
  switch (cellType) {
    case 'hero':
      return `<div class="ipynb-hero-cell">${html}</div>`;
    case 'intro':
      return `<div class="ipynb-content-card">${html}</div>`;
    case 'transition':
      return `<div class="ipynb-transition-card">${html}</div>`;
    case 'content':
    default:
      return `<div class="ipynb-content-card-thin">${html}</div>`;
  }
}

/**
 * Style action cards in a cell content element
 * Detects <!-- action-cards --> marker and transforms following list into styled cards
 * Also fixes links at runtime by finding matching headings
 * @param {HTMLElement} contentElement - Cell content element
 */
function styleActionCards(contentElement) {
  // Find the ul element that follows the action-cards comment
  const ul = contentElement.querySelector('ul');
  if (!ul) return;

  // Add container class to the ul
  ul.classList.add('ipynb-action-cards');

  // Style each list item as an action card (all blue)
  const items = ul.querySelectorAll('li');
  items.forEach((li) => {
    li.classList.add('ipynb-action-card');
    li.classList.add('ipynb-action-card-blue');

    // Fix links at runtime by finding matching headings
    const link = li.querySelector('a');
    if (link && link.hash && link.hash !== '#') {
      // Extract the link text to search for matching heading
      const linkText = link.textContent.trim();

      // Find all headings in the document
      const allCells = document.querySelectorAll('.ipynb-cell');
      let targetCell = null;

      allCells.forEach((cell) => {
        const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          // Check if heading text matches link text (case-insensitive, ignore emojis/special chars)
          const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
          const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

          if (headingText.includes(searchText)) {
            targetCell = cell;
            // Ensure the cell has a data-cell-index
            if (!heading.id && cell.dataset.cellIndex) {
              heading.id = `cell-${cell.dataset.cellIndex}`;
            }
          }
        });
      });

      // Update the link to point to the found cell
      if (targetCell && targetCell.dataset.cellIndex) {
        link.href = `#cell-${targetCell.dataset.cellIndex}`;
      }
    } else if (link && link.hash === '#') {
      // Link has placeholder # - resolve it now
      const linkText = link.textContent.trim();

      // Find all headings in the document
      const allCells = document.querySelectorAll('.ipynb-cell');
      let targetCell = null;

      allCells.forEach((cell) => {
        const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          // Check if heading text matches link text (case-insensitive, ignore emojis/special chars)
          const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
          const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

          if (headingText.includes(searchText)) {
            targetCell = cell;
            // Ensure the cell has a data-cell-index
            if (!heading.id && cell.dataset.cellIndex) {
              heading.id = `cell-${cell.dataset.cellIndex}`;
            }
          }
        });
      });

      // Update the link to point to the found cell
      if (targetCell && targetCell.dataset.cellIndex) {
        link.href = `#cell-${targetCell.dataset.cellIndex}`;
      }
    }
  });
}

/**
 * Create a markdown cell element
 * @param {object} cell - Notebook cell data
 * @param {number} index - Cell index
 * @param {string} [repoUrl] - Optional repository URL for converting .md links
 * @param {boolean} [autoWrap=false] - Whether to auto-wrap with styling classes (notebook mode)
 * @param {string} [helpRepoUrl] - Optional help repository URL
 * @param {string} [branch='main'] - GitHub branch to use for .md links
 * @param {Array} [parentHistory=null] - Optional parent overlay's history array
 * @param {Object} [config=null] - Configuration object (injected dependency)
 * @returns {Promise<HTMLElement>} Cell element
 */
async function createMarkdownCell(cell, index, repoUrl = null, autoWrap = false, helpRepoUrl = null, branch = 'main', parentHistory = null, config = null) {
  // eslint-disable-next-line no-console
  console.log('[CREATE MARKDOWN CELL] index:', index);
  // eslint-disable-next-line no-console
  console.log('[CREATE MARKDOWN CELL] parentHistory received:', JSON.stringify(parentHistory, null, 2));

  const cellDiv = document.createElement('div');
  cellDiv.className = 'ipynb-cell ipynb-markdown-cell';
  cellDiv.dataset.cellIndex = index;

  const content = document.createElement('div');
  content.className = 'ipynb-cell-content';

  // Join source lines and parse markdown
  const markdownText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  let html = parseMarkdown(markdownText, repoUrl, branch);

  // Strip "Part X:" prefix from Part/Chapter headings in viewer pane
  // Pattern: "Part 1:", "Chapter 2:", etc.
  // Note: H2 tags have id attributes, so we need to match those
  html = html.replace(/<h2([^>]*)>(Part|Chapter)\s+\d+:\s*(.+?)<\/h2>/gi, '<h2$1>$3</h2>');

  // Inline SVG illustrations
  html = await inlineSVGIllustrations(html);

  // Auto-wrap with styling classes if in notebook mode
  if (autoWrap) {
    const cellType = detectCellType(markdownText, index);
    html = wrapMarkdownContent(html, cellType);
  }

  content.innerHTML = html;

  // Detect and style action cards if marker comment is present
  if (html.includes('<!-- action-cards -->')) {
    styleActionCards(content);
  }

  // Add click handlers for GitHub markdown links to open in overlay
  const githubMdLinks = content.querySelectorAll('.ipynb-github-md-link');
  githubMdLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const githubUrl = link.dataset.mdUrl; // Get URL from data attribute
      const linkBranch = link.dataset.branch || branch; // Get branch from link or use default
      const title = link.textContent || 'GitHub Markdown';

      // eslint-disable-next-line no-console
      console.log('[MD LINK CLICK] Passing parentHistory to createGitHubMarkdownOverlay:', JSON.stringify(parentHistory, null, 2));

      const overlay = createGitHubMarkdownOverlay(githubUrl, title, helpRepoUrl, linkBranch, parentHistory, false, config);
      overlay.openOverlay();
    });
  });

  cellDiv.appendChild(content);
  return cellDiv;
}

/**
 * Create a code cell element with execution button
 * @param {object} cell - Notebook cell data
 * @param {number} index - Overall cell index
 * @param {boolean} autorun - Whether to hide run button (autorun mode)
 * @returns {HTMLElement} Cell element
 */
function createCodeCell(cell, index, autorun = false) {
  const cellDiv = document.createElement('div');
  cellDiv.className = 'ipynb-cell ipynb-code-cell';
  cellDiv.dataset.cellIndex = index;

  if (autorun) {
    cellDiv.classList.add('ipynb-autorun');
  }

  // Cell header with run button
  const header = document.createElement('div');
  header.className = 'ipynb-cell-header';

  const cellLabel = document.createElement('span');
  cellLabel.className = 'ipynb-cell-label';
  cellLabel.textContent = `[${index + 1}]:`;

  header.appendChild(cellLabel);

  // Only add run button if not in autorun mode
  if (!autorun) {
    const runButton = document.createElement('button');
    runButton.className = 'ipynb-run-button';
    runButton.textContent = 'Run';
    runButton.setAttribute('aria-label', `Run code cell ${index + 1}`);
    header.appendChild(runButton);
  }

  // Code content
  const codeContent = document.createElement('pre');
  codeContent.className = 'ipynb-code-content';

  const code = document.createElement('code');
  const codeText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  code.textContent = codeText;

  codeContent.appendChild(code);

  // Output area (initially hidden, unless autorun)
  const output = document.createElement('div');
  output.className = 'ipynb-cell-output';
  output.style.display = autorun ? 'block' : 'none';

  // Store code for execution
  cellDiv.dataset.code = codeText;

  cellDiv.appendChild(header);
  cellDiv.appendChild(codeContent);
  cellDiv.appendChild(output);

  return cellDiv;
}

/**
 * Execute JavaScript code in a cell
 * @param {HTMLElement} cellDiv - Cell element
 */
async function executeCodeCell(cellDiv) {
  const { code } = cellDiv.dataset;
  const output = cellDiv.querySelector('.ipynb-cell-output');

  // Clear previous output
  output.innerHTML = '';
  output.style.display = 'block';

  // Create console capture
  const logs = [];
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  console.log = (...args) => {
    logs.push({ type: 'log', args });
    originalConsoleLog.apply(console, args);
  };

  console.error = (...args) => {
    logs.push({ type: 'error', args });
    originalConsoleError.apply(console, args);
  };

  try {
    // Execute code (with async support)
    // eslint-disable-next-line no-new-func
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    const func = new AsyncFunction(code);
    const result = await func();

    // Restore console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Display logs
    logs.forEach((log) => {
      const logDiv = document.createElement('div');
      logDiv.className = `ipynb-output-${log.type}`;
      logDiv.textContent = log.args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' ');
      output.appendChild(logDiv);
    });

    // Display result if not undefined
    if (result !== undefined) {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'ipynb-output-result';

      // Check if result is a multi-line string (contains newlines)
      const resultString = typeof result === 'object'
        ? JSON.stringify(result, null, 2)
        : String(result);

      if (resultString.includes('\n')) {
        // Multi-line result: use pre-wrap to preserve formatting
        resultDiv.style.whiteSpace = 'pre-wrap';
      }

      resultDiv.textContent = resultString;
      output.appendChild(resultDiv);
    }

    // Show success indicator
    cellDiv.classList.add('ipynb-cell-executed');
  } catch (error) {
    // Restore console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Display error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ipynb-output-error';
    errorDiv.textContent = `Error: ${error.message}`;
    output.appendChild(errorDiv);

    // Show error indicator
    cellDiv.classList.add('ipynb-cell-error');
  }
}

/**
 * Load and parse notebook file
 * @param {string} notebookPath - Path to .ipynb file
 * @returns {Promise<object>} Parsed notebook data
 */
async function loadNotebook(notebookPath) {
  try {
    const response = await fetch(notebookPath);
    if (!response.ok) {
      throw new Error(`Failed to load notebook: ${response.status} ${response.statusText}`);
    }

    const notebook = await response.json();
    return notebook;
  } catch (error) {
    console.error('Error loading notebook:', error);
    throw error;
  }
}

/**
 * Check if a markdown cell should be grouped with the next code cell
 * @param {HTMLElement} cell - Current cell
 * @param {HTMLElement} nextCell - Next cell
 * @returns {boolean} True if cells should be grouped
 */
function shouldGroupWithNext(cell, nextCell) {
  if (!cell || !nextCell) return false;
  if (!cell.classList.contains('ipynb-markdown-cell')) return false;
  if (!nextCell.classList.contains('ipynb-code-cell')) return false;

  // Get markdown content
  const content = cell.textContent.trim();

  // Patterns that suggest the markdown is describing the following code
  const groupingPatterns = [
    /:\s*$/, // Ends with colon
    /below/i, // Contains "below"
    /following/i, // Contains "following"
    /try running/i, // Contains "try running"
    /click run/i, // Contains "click run"
    /run the cell/i, // Contains "run the cell"
    /let's test/i, // Contains "let's test"
    /let's try/i, // Contains "let's try"
    /example:/i, // Contains "example:"
    /here's how/i, // Contains "here's how"
  ];

  return groupingPatterns.some((pattern) => pattern.test(content));
}

/**
 * Create page groups from cells for smart pagination
 * @param {Array<HTMLElement>} cells - Array of cell elements
 * @returns {Array<Object>} Array of page objects with grouped cells
 */
function createPageGroups(cells, maxCodeGroupSize = 3) {
  const pages = [];
  const MAX_CODE_GROUP_SIZE = maxCodeGroupSize; // Maximum number of consecutive code cells to group
  let i = 0;

  while (i < cells.length) {
    const cell = cells[i];
    const nextCell = cells[i + 1];

    if (shouldGroupWithNext(cell, nextCell)) {
      // Group markdown + code together
      const groupedCells = [cell, nextCell];
      let j = i + 2;

      // Check for additional consecutive code cells (up to MAX_CODE_GROUP_SIZE total)
      while (
        j < cells.length
        && cells[j].classList.contains('ipynb-code-cell')
        && groupedCells.filter((c) => c.classList.contains('ipynb-code-cell')).length < MAX_CODE_GROUP_SIZE
      ) {
        groupedCells.push(cells[j]);
        j += 1;
      }

      pages.push({
        type: 'grouped',
        cells: groupedCells,
      });
      i = j; // Skip all grouped cells
    } else {
      // Single cell page
      pages.push({
        type: 'single',
        cells: [cell],
      });
      i += 1;
    }
  }

  return pages;
}

/**
 * Maximum number of history entries to track per overlay instance
 */

/**
 * Add entry to navigation history for a specific overlay instance
 * @param {Array} historyArray - The history array for this overlay instance
 * @param {string} title - Title of the entry
 * @param {string} type - Type: 'cell' or 'markdown'
 * @param {number} [cellIndex] - Cell index for cell entries
 * @param {string} [url] - URL for markdown entries
 */
function addToHistory(historyArray, title, type, cellIndex = null, url = null, maxEntries = 25) {
  const entry = {
    title,
    type,
    cellIndex,
    url,
    timestamp: Date.now(),
  };

  // Remove duplicate if exists (same title and type)
  const existingIndex = historyArray.findIndex(
    (h) => h.title === title && h.type === type,
  );
  if (existingIndex !== -1) {
    historyArray.splice(existingIndex, 1);
  }

  // Add to front of history
  historyArray.unshift(entry);

  // Limit to maxEntries
  if (historyArray.length > maxEntries) {
    historyArray.pop();
  }
}

/**
 * Bookmark Management - localStorage-based bookmarks per notebook
 */

/**
 * Get localStorage key for bookmarks based on notebook path/title
 * @param {string} notebookId - Unique identifier for the notebook
 * @returns {string} localStorage key
 */
function getBookmarkStorageKey(notebookId) {
  return `ipynb-bookmarks-${notebookId}`;
}

/**
 * Get all bookmarks for a notebook
 * @param {string} notebookId - Unique identifier for the notebook
 * @returns {Array<{title: string, type: string, pageIndex: number|null, url: string|null, timestamp: number}>}
 */
function getBookmarks(notebookId) {
  try {
    const key = getBookmarkStorageKey(notebookId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}

/**
 * Save a bookmark for the current page or markdown file
 * @param {string} notebookId - Unique identifier for the notebook
 * @param {string} title - Title of the page
 * @param {string} type - Type: 'cell' or 'markdown'
 * @param {number|null} pageIndex - Page index to bookmark (for cells)
 * @param {string|null} url - URL to bookmark (for markdown)
 * @returns {boolean} Success status
 */
function saveBookmark(notebookId, title, type, pageIndex = null, url = null) {
  try {
    const bookmarks = getBookmarks(notebookId);

    // Create unique identifier based on type
    const identifier = type === 'cell' ? `cell-${pageIndex}` : `md-${url}`;

    // Remove existing bookmark for same item
    const existingIndex = bookmarks.findIndex((b) => {
      const bookmarkId = b.type === 'cell' ? `cell-${b.pageIndex}` : `md-${b.url}`;
      return bookmarkId === identifier;
    });
    if (existingIndex !== -1) {
      bookmarks.splice(existingIndex, 1);
    }

    // Add new bookmark
    bookmarks.unshift({
      title,
      type,
      pageIndex,
      url,
      timestamp: Date.now(),
    });

    // Save to localStorage
    const key = getBookmarkStorageKey(notebookId);
    localStorage.setItem(key, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    return false;
  }
}

/**
 * Remove a specific bookmark
 * @param {string} notebookId - Unique identifier for the notebook
 * @param {string} type - Type: 'cell' or 'markdown'
 * @param {number|null} pageIndex - Page index to remove (for cells)
 * @param {string|null} url - URL to remove (for markdown)
 * @returns {boolean} Success status
 */
function removeBookmark(notebookId, type, pageIndex = null, url = null) {
  try {
    const bookmarks = getBookmarks(notebookId);
    const identifier = type === 'cell' ? `cell-${pageIndex}` : `md-${url}`;

    const filtered = bookmarks.filter((b) => {
      const bookmarkId = b.type === 'cell' ? `cell-${b.pageIndex}` : `md-${b.url}`;
      return bookmarkId !== identifier;
    });

    const key = getBookmarkStorageKey(notebookId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    return false;
  }
}

/**
 * Clear all bookmarks for a notebook
 * @param {string} notebookId - Unique identifier for the notebook
 * @returns {boolean} Success status
 */
function clearAllBookmarks(notebookId) {
  try {
    const key = getBookmarkStorageKey(notebookId);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear bookmarks:', error);
    return false;
  }
}

/**
 * Navigation Tree Building Functions
 */

/**
 * Extract heading text from markdown cell
 * @param {HTMLElement} cell - Cell element
 * @returns {Object|null} Heading object with text and level, or null
 */
function extractHeading(cell) {
  const content = cell.querySelector('.ipynb-cell-content');
  if (!content) return null;

  const heading = content.querySelector('h1, h2, h3');
  if (!heading) return null;

  return {
    text: heading.textContent.trim(),
    level: parseInt(heading.tagName.substring(1), 10),
  };
}

/**
 * Extract all markdown file paths from cells
 * @param {HTMLElement} cellsContainer - Container with all cells
 * @returns {Array<string>} Array of unique .md file paths
 */
function extractMarkdownPaths(cellsContainer) {
  const paths = new Set(); // Automatic deduplication

  // Find all GitHub markdown links
  const mdLinks = cellsContainer.querySelectorAll('.ipynb-github-md-link');

  mdLinks.forEach((link) => {
    const { mdUrl } = link.dataset;
    if (mdUrl) {
      // Extract path from URL (remove blob/branch parts)
      const pathMatch = mdUrl.match(/\/blob\/[^/]+\/(.+)$/);
      if (pathMatch) {
        paths.add(pathMatch[1]);
      }
    }
  });

  return Array.from(paths).sort(); // Sort alphabetically
}

/**
 * Extract markdown paths from a specific element (for dynamic scanning)
 * @param {HTMLElement} element - Element to scan for markdown links
 * @returns {Array<string>} Array of markdown file paths
 */
function extractMarkdownPathsFromElement(element) {
  const paths = new Set();

  // Find all GitHub markdown links
  const mdLinks = element.querySelectorAll('.ipynb-github-md-link');

  mdLinks.forEach((link) => {
    const { mdUrl } = link.dataset;
    if (mdUrl) {
      // Extract path from URL (remove blob/branch parts)
      const pathMatch = mdUrl.match(/\/blob\/[^/]+\/(.+)$/);
      if (pathMatch) {
        const extractedPath = pathMatch[1];
        paths.add(extractedPath);
      }
    }
  });

  return Array.from(paths).sort();
}

/**
 * Add new markdown paths to the navigation tree dynamically
 * @param {Array} tree - Navigation tree array
 * @param {Array<string>} newPaths - New markdown file paths to add
 */
function addMarkdownPathsToTree(tree, newPaths) {
  // Find the Repository root node
  const repoNode = tree.find((node) => node.id === 'repository');
  if (!repoNode) {
    return; // No repository node exists yet
  }

  // Get existing paths AND filenames from the tree
  const existingPaths = new Set();
  const existingFilenames = new Set();
  const collectPaths = (node) => {
    if (node.type === 'markdown' && node.path) {
      existingPaths.add(node.path);
      // Extract just the filename from the path
      const filename = node.path.split('/').pop();
      existingFilenames.add(filename);
    }
    if (node.children) {
      node.children.forEach(collectPaths);
    }
  };
  collectPaths(repoNode);

  // Filter out paths that already exist OR have matching filenames
  const pathsToAdd = newPaths.filter((path) => {
    // Skip if exact path already exists
    if (existingPaths.has(path)) {
      return false;
    }

    // Skip if a file with the same name already exists (prevents duplicates)
    const filename = path.split('/').pop();
    if (existingFilenames.has(filename)) {
      return false;
    }

    return true;
  });

  if (pathsToAdd.length === 0) {
    return; // No new paths to add
  }

  // Rebuild the entire file tree with all paths using the existing buildFileTree function
  // This ensures consistent structure and no duplicates
  const allPaths = [...existingPaths, ...pathsToAdd].sort();
  const helpPath = 'docs/help.md';
  repoNode.children = buildFileTree(allPaths, helpPath);
}

/**
 * Build hierarchical file tree from markdown paths
 * @param {Array<string>} paths - Array of file paths (e.g., 'docs/help.md')
 * @param {string} _helpPath - Path to help.md (no longer used - kept for API compatibility)
 * @returns {Array} Tree nodes for files with folder hierarchy
 */
function buildFileTree(paths, _helpPath) {
  const tree = [];

  // Categorize files into Chapters, Appendices, and Miscellaneous
  const chapters = [];
  const appendices = [];
  const miscellaneous = [];

  // Regular expressions for categorization
  const chapterRegex = /^(chapter-\d+|preface\.md)/i;
  const appendixRegex = /^appendix-[a-z]/i;

  // Hardcoded inclusion list for Miscellaneous folder
  const miscAllowedFiles = ['advice.md', 'for-ai.md', 'glossary.md'];

  // Categorize each path
  paths.forEach((path) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];

    const fileNode = {
      id: path,
      label: fileName,
      type: 'markdown',
      path,
      cellIndex: null,
      children: [],
      expanded: false,
      level: 2, // Level 2 because they're under category folders
    };

    if (chapterRegex.test(fileName)) {
      chapters.push(fileNode);
    } else if (appendixRegex.test(fileName)) {
      appendices.push(fileNode);
    } else if (miscAllowedFiles.includes(fileName.toLowerCase())) {
      // Only include files from the hardcoded whitelist
      miscellaneous.push(fileNode);
    }
    // All other files are ignored (not added to any category)
  });

  // Sort each category with special handling for preface.md
  chapters.sort((a, b) => {
    // preface.md always comes first
    if (a.label.toLowerCase() === 'preface.md') return -1;
    if (b.label.toLowerCase() === 'preface.md') return 1;
    // Otherwise alphabetical
    return a.label.localeCompare(b.label);
  });
  appendices.sort((a, b) => a.label.localeCompare(b.label));
  miscellaneous.sort((a, b) => a.label.localeCompare(b.label));

  // Create "Chapters" folder node (expanded by default)
  if (chapters.length > 0) {
    const chaptersNode = {
      id: 'folder-chapters',
      label: 'Chapters',
      type: 'folder',
      path: null,
      cellIndex: null,
      children: chapters,
      expanded: true, // Open by default for easy access to chapters
      level: 1,
    };
    tree.push(chaptersNode);
  }

  // Create "Appendix" folder node
  if (appendices.length > 0) {
    const appendixNode = {
      id: 'folder-appendix',
      label: 'Appendix',
      type: 'folder',
      path: null,
      cellIndex: null,
      children: appendices,
      expanded: false,
      level: 1,
    };
    tree.push(appendixNode);
  }

  // Create "Miscellaneous" folder node
  if (miscellaneous.length > 0) {
    const miscNode = {
      id: 'folder-miscellaneous',
      label: 'Miscellaneous',
      type: 'folder',
      path: null,
      cellIndex: null,
      children: miscellaneous,
      expanded: false,
      level: 1,
    };
    tree.push(miscNode);
  }

  return tree;
}

/**
 * Build navigation tree from notebook cells and repository files
 * @param {Array<HTMLElement>} cells - Array of cell elements
 * @param {HTMLElement} cellsContainer - Container for extracting markdown paths
 * @param {string} helpRepoUrl - Help repository URL
 * @param {object} notebookData - Raw notebook data with cells array
 * @returns {Array} Root tree nodes
 */
function buildNavigationTree(cells, cellsContainer, _helpRepoUrl, notebookData = null) {
  const tree = [];

  // 1. Create "Notebook" root node
  const notebookNode = {
    id: 'notebook',
    label: 'Notebook',
    type: 'root',
    path: null,
    cellIndex: null,
    children: [],
    expanded: true, // Open by default
    level: 0,
  };

  // 2. First pass: Check if there are any Part or Chapter headings at all
  const partRegex = /^(Part|Chapter)\s+\d+/i; // Matches "Part 1", "Chapter 1", etc.
  const completedRegex = /completed.*final|final.*completed/i; // Matches both "completed" and "final" in any order

  let hasPartHeadings = false;

  // CRITICAL FIX: Check raw notebook cell data, NOT rendered HTML
  // The rendered cells have already had "Part X:" stripped by createMarkdownCell (line 711)
  // So we need to check the original markdown source instead
  if (notebookData && notebookData.cells) {
    notebookData.cells.forEach((cell) => {
      if (cell.cell_type === 'markdown') {
        const markdownText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        // Check if any line starts with ## Part or ## Chapter
        const lines = markdownText.split('\n');
        lines.forEach((line) => {
          const cleaned = line.trim().replace(/^##\s*/, '');
          if (partRegex.test(cleaned)) {
            hasPartHeadings = true;
          }
        });
      }
    });
  }

  // Helper function to extract heading text from raw markdown cell
  const extractHeadingFromRaw = (cellData) => {
    if (!cellData || cellData.cell_type !== 'markdown') return null;
    const markdownText = Array.isArray(cellData.source) ? cellData.source.join('') : cellData.source;
    const lines = markdownText.split('\n');

    // Use .find() instead of for...of to avoid eslint no-restricted-syntax
    // Find first heading (h1, h2, or h3)
    const partHeading = lines.find((line) => {
      const trimmed = line.trim();
      return trimmed.startsWith('#');
    });

    if (partHeading) {
      const trimmed = partHeading.trim();
      if (trimmed.startsWith('###')) {
        return { text: trimmed.replace(/^###\s*/, ''), level: 3 };
      }
      if (trimmed.startsWith('##')) {
        return { text: trimmed.replace(/^##\s*/, ''), level: 2 };
      }
      if (trimmed.startsWith('#')) {
        return { text: trimmed.replace(/^#\s*/, ''), level: 1 };
      }
    }
    return null;
  };

  // 3. Add cells based on whether Part/Chapter headings exist
  let currentPartNode = null;
  let frontmatterNode = null;
  let summaryNode = null;

  cells.forEach((cell, index) => {
    if (cell.classList.contains('ipynb-markdown-cell')) {
      // CRITICAL FIX: Extract heading from raw markdown source instead of rendered HTML
      // The rendered HTML has already had "Part X:" stripped by createMarkdownCell (line 711)
      let heading = null;
      let headingText = '';

      if (notebookData && notebookData.cells && notebookData.cells[index]) {
        heading = extractHeadingFromRaw(notebookData.cells[index]);
        if (heading) {
          headingText = heading.text.trim();
        }
      } else {
        // Fallback to rendered HTML if raw data not available
        heading = extractHeading(cell);
        if (heading) {
          headingText = heading.text.trim();
        }
      }

      if (heading) {
        if (hasPartHeadings) {
          // WITH Part/Chapter headings: Use Frontmatter/Parts/Summary structure

          // Check if this marks the end of Parts/Chapters (completion cell)
          if (completedRegex.test(headingText) && currentPartNode) {
            // Create Summary node and switch to collecting there
            summaryNode = {
              id: 'summary',
              label: 'Summary',
              type: 'part',
              path: null,
              cellIndex: null,
              children: [],
              expanded: false,
              level: 1,
            };
            notebookNode.children.push(summaryNode);
            currentPartNode = null; // Stop adding to Parts

            // Add the completion cell to Summary
            summaryNode.children.push({
              id: `cell-${index}`,
              label: headingText,
              type: 'cell',
              path: null,
              cellIndex: index,
              children: [],
              expanded: false,
              level: 2,
            });
          } else if (summaryNode) {
            // After Parts/Chapters ended, add to Summary
            summaryNode.children.push({
              id: `cell-${index}`,
              label: headingText,
              type: 'cell',
              path: null,
              cellIndex: index,
              children: [],
              expanded: false,
              level: 2,
            });
          } else if (partRegex.test(headingText)) {
            // Check if this is a Part/Chapter heading
            // Part nodes are ALWAYS navigation-only (no cellIndex)
            currentPartNode = {
              id: `part-${index}`,
              label: headingText,
              type: 'part',
              path: null,
              cellIndex: null, // Navigation only - never shows content
              children: [],
              expanded: false, // Parts/Chapters start collapsed
              level: 1,
            };
            notebookNode.children.push(currentPartNode);

            // ALWAYS create a child node for the content (without "Part X:" prefix)
            // Extract just the title part after the colon
            const contentLabel = headingText.includes(':')
              ? headingText.split(':').slice(1).join(':').trim()
              : headingText;

            currentPartNode.children.push({
              id: `cell-${index}`,
              label: contentLabel, // Title without "Part X:" prefix
              type: 'cell',
              path: null,
              cellIndex: index, // This shows the actual content
              children: [],
              expanded: false,
              level: 2,
            });
          } else if (currentPartNode) {
            // Add cell to current Part/Chapter
            currentPartNode.children.push({
              id: `cell-${index}`,
              label: headingText,
              type: 'cell',
              path: null,
              cellIndex: index,
              children: [],
              expanded: false,
              level: 2,
            });
          } else {
            // No Part/Chapter yet - add to Frontmatter
            if (!frontmatterNode) {
              // Create Frontmatter node on first pre-Part/Chapter cell
              frontmatterNode = {
                id: 'frontmatter',
                label: 'Frontmatter',
                type: 'part',
                path: null,
                cellIndex: null,
                children: [],
                expanded: false,
                level: 1,
              };
              notebookNode.children.push(frontmatterNode);
            }

            // Add cell to Frontmatter
            frontmatterNode.children.push({
              id: `cell-${index}`,
              label: headingText,
              type: 'cell',
              path: null,
              cellIndex: index,
              children: [],
              expanded: false,
              level: 2,
            });
          }
        } else {
          // WITHOUT Part/Chapter headings: Add cells directly under Notebook node
          notebookNode.children.push({
            id: `cell-${index}`,
            label: headingText,
            type: 'cell',
            path: null,
            cellIndex: index,
            children: [],
            expanded: false,
            level: 1, // Level 1 since they're direct children of Notebook
          });
        }
      }
    }
  });

  tree.push(notebookNode);

  // 3. Extract markdown paths from cells
  const markdownPaths = extractMarkdownPaths(cellsContainer);

  // 4. Create "Repository" root node if we have markdown files
  if (markdownPaths.length > 0) {
    const repoNode = {
      id: 'repository',
      label: 'Repository',
      type: 'root',
      path: null,
      cellIndex: null,
      children: [],
      expanded: true, // Open by default
      level: 0,
    };

    // Build file tree with help.md prioritized (always look for it)
    const helpPath = 'docs/help.md';
    repoNode.children = buildFileTree(markdownPaths, helpPath);

    tree.push(repoNode);
  }

  return tree;
}

/**
 * Navigation Tree Rendering Functions
 */

/**
 * Render navigation tree
 * @param {Array} tree - Tree data structure
 * @param {HTMLElement} container - Tree container element
 * @param {Object} treeState - State object with expandedNodes Set and selectedNode
 * @param {Function} onNodeClick - Click handler for tree nodes
 */
function renderNavigationTree(tree, container, treeState, onNodeClick) {
  container.innerHTML = '';

  // Remove old delegated listener if it exists
  if (container._treeClickHandler) {
    container.removeEventListener('click', container._treeClickHandler);
  }

  // Add single delegated listener for ALL tree clicks
  container._treeClickHandler = (e) => {
    // Handle expand/collapse icon clicks
    const icon = e.target.closest('.ipynb-nav-tree-icon');
    // Has arrow (not spacer)
    if (icon && icon.textContent.trim()) {
      const { nodeId } = icon.parentElement.dataset;
      if (nodeId) {
        e.stopPropagation();
        toggleTreeNode(nodeId, treeState, container, onNodeClick);
        return;
      }
    }

    // Handle tree node clicks
    const treeItem = e.target.closest('.ipynb-nav-tree-item');
    if (treeItem) {
      const { nodeId } = treeItem.dataset;
      const node = findNodeById(tree, nodeId);
      if (node) {
        // If node has children, toggle expansion (same as clicking icon)
        if (node.children && node.children.length > 0) {
          toggleTreeNode(nodeId, treeState, container, onNodeClick);
        } else {
          // If no children, just navigate
          onNodeClick(node);
        }
      }
    }
  };

  container.addEventListener('click', container._treeClickHandler);

  // Filter out Repository node if it has no children (no .md files found)
  const filteredTree = tree.filter((node) => {
    if (node.id === 'repository') {
      const hasChildren = node.children && node.children.length > 0;
      if (!hasChildren) {
        return false; // Don't render this node
      }
    }
    return true; // Render all other nodes
  });

  filteredTree.forEach((node) => {
    renderTreeNode(node, container, container, treeState, onNodeClick);
  });
}

/**
 * Render single tree node recursively
 * @param {Object} node - Tree node
 * @param {HTMLElement} parentElement - Parent DOM element
 * @param {HTMLElement} treeContainer - Root tree container (for re-rendering)
 * @param {Object} treeState - State object
 * @param {Function} onNodeClick - Click handler
 */
function renderTreeNode(node, parentElement, treeContainer, treeState, onNodeClick) {
  const isExpanded = treeState.expandedNodes.has(node.id);
  const isSelected = treeState.selectedNode === node.id;
  const hasChildren = node.children && node.children.length > 0;

  // Create node element
  const nodeEl = document.createElement('div');
  nodeEl.className = 'ipynb-nav-tree-item';
  nodeEl.dataset.type = node.type;
  nodeEl.dataset.nodeId = node.id;
  nodeEl.dataset.leaf = !hasChildren;
  nodeEl.style.setProperty('--level', node.level);

  if (isSelected) {
    nodeEl.classList.add('active');
  }

  // Expand/collapse icon (only for non-leaf nodes)
  if (hasChildren) {
    const icon = document.createElement('span');
    icon.className = 'ipynb-nav-tree-icon';
    if (isExpanded) {
      icon.classList.add('expanded');
    }
    icon.textContent = '▶'; // Right arrow
    // Event listener handled by event delegation in renderNavigationTree()
    nodeEl.appendChild(icon);
  } else {
    // Empty space for alignment
    const spacer = document.createElement('span');
    spacer.className = 'ipynb-nav-tree-icon';
    nodeEl.appendChild(spacer);
  }

  // Label
  const label = document.createElement('span');
  label.textContent = node.label;
  label.className = 'ipynb-nav-tree-label';
  nodeEl.appendChild(label);

  // Add tooltip showing full path/name
  if (node.type === 'markdown' && node.path) {
    nodeEl.setAttribute('title', node.path);
  } else if (node.type === 'folder' && node.id) {
    // Extract folder path from id (format: 'folder-path/to/folder')
    const folderPath = node.id.replace('folder-', '');
    nodeEl.setAttribute('title', folderPath);
  } else if (node.label) {
    // For cells, parts, and root nodes - show full label
    nodeEl.setAttribute('title', node.label);
  }

  // Click handler handled by event delegation in renderNavigationTree()

  parentElement.appendChild(nodeEl);

  // Render children if expanded
  if (isExpanded && hasChildren) {
    node.children.forEach((child) => {
      renderTreeNode(child, parentElement, treeContainer, treeState, onNodeClick);
    });
  }
}

/**
 * Toggle node expansion state
 * @param {string} nodeId - Node ID to toggle
 * @param {Object} treeState - State object
 * @param {HTMLElement} container - Tree container
 * @param {Function} onNodeClick - Click handler
 */
function toggleTreeNode(nodeId, treeState, container, onNodeClick) {
  if (treeState.expandedNodes.has(nodeId)) {
    treeState.expandedNodes.delete(nodeId);
  } else {
    treeState.expandedNodes.add(nodeId);
  }

  // Re-render tree
  const { tree } = treeState;
  renderNavigationTree(tree, container, treeState, onNodeClick);
}

/**
 * Expand all parent nodes to make a target node visible
 * @param {Array} tree - Tree structure
 * @param {string} targetNodeId - Node ID to make visible
 * @param {Object} treeState - State object
 * @returns {boolean} - True if node was found and parents expanded
 */
function expandParentsOfNode(tree, targetNodeId, treeState) {
  // Recursive function to find node and expand all parents
  function searchAndExpand(nodes, nodeId, ancestors = []) {
    return nodes.reduce((found, node) => {
      if (found) return found;

      // If this is the target node, expand all ancestors
      if (node.id === nodeId) {
        ancestors.forEach((ancestor) => {
          treeState.expandedNodes.add(ancestor.id);
        });
        return true;
      }

      // Search children with this node as an ancestor
      if (node.children && node.children.length > 0) {
        return searchAndExpand(node.children, nodeId, [...ancestors, node]);
      }

      return false;
    }, false);
  }

  return searchAndExpand(tree, targetNodeId);
}

/**
 * Select node (highlight as active)
 * @param {string} nodeId - Node ID to select
 * @param {Object} treeState - State object
 * @param {HTMLElement} container - Tree container
 * @param {Function} onNodeClick - Click handler
 */
function selectTreeNode(nodeId, treeState, container, onNodeClick) {
  treeState.selectedNode = nodeId;

  // Expand all parent nodes to make selected node visible
  const { tree } = treeState;
  expandParentsOfNode(tree, nodeId, treeState);

  // Re-render tree
  renderNavigationTree(tree, container, treeState, onNodeClick);

  // Scroll to selected node
  setTimeout(() => {
    const selectedEl = container.querySelector(`[data-node-id="${nodeId}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}

/**
 * Find node by ID in tree (recursive)
 * @param {Array} tree - Tree structure
 * @param {string} nodeId - Node ID to find
 * @returns {Object|null} - Found node or null
 */
function findNodeById(tree, nodeId) {
  // Use .reduce() instead of for...of to avoid eslint no-restricted-syntax
  return tree.reduce((found, node) => {
    if (found) return found;
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      return findNodeById(node.children, nodeId);
    }
    return null;
  }, null);
}

/**
 * Create full-screen overlay for paged variation
 * @param {HTMLElement} container - The notebook container
 * @param {HTMLElement} cellsContainer - Container with cells
 * @param {boolean} autorun - Whether to autorun code cells
 * @param {boolean} isNotebookMode - Whether this is notebook mode (close button always visible)
 * @param {string} [repoUrl] - Optional repository URL for markdown .md links
 * @param {string} [notebookTitle] - Optional notebook title for top bar
 * @param {string} [helpRepoUrl] - Optional help repository URL
 * @param {string} [branch] - GitHub branch to use
 * @param {boolean} [hideTopbar] - Whether to hide the top bar
 * @param {object} [notebook] - Raw notebook data with cells array
 * @param {object} [config] - Configuration object with settings (injected dependency)
 * @param {number} [splashDuration] - Splash screen duration in ms (from metadata or config)
 * @returns {object} Overlay controls
 */
function createPagedOverlay(container, cellsContainer, autorun = false, isNotebookMode = false, repoUrl = null, notebookTitle = 'Jupyter Notebook', helpRepoUrl = null, branch = 'main', hideTopbar = false, notebook = null, config = null, splashDuration = 4000) {
  // Config is required - fail with clear error if missing
  if (!config) {
    console.error('[IPYNB-VIEWER] CRITICAL: Config object missing in createPagedOverlay');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ipynb-error';
    errorDiv.textContent = IPYNB_ERRORS.CONFIG_MISSING_OVERLAY;
    container.appendChild(errorDiv);
    return null;
  }

  const cells = Array.from(cellsContainer.querySelectorAll('.ipynb-cell'));

  if (cells.length === 0) {
    return null;
  }

  // Remove any existing overlays to prevent duplicates
  const existingOverlays = document.querySelectorAll('.ipynb-paged-overlay');
  existingOverlays.forEach((overlay) => overlay.remove());

  // Create page groups (smart grouping)
  const { maxCodeGroupSize } = config;
  const pages = createPageGroups(cells, maxCodeGroupSize);
  const totalPages = pages.length;

  // Create instance-specific navigation history (rooted in this overlay)
  const navigationHistory = [];

  // Build navigation tree (Phase 1 - Testing)
  const navigationTree = buildNavigationTree(cells, cellsContainer, helpRepoUrl, notebook);

  // TEST: Log tree structure to console
  navigationTree.forEach((root) => {
    root.children.forEach((child) => {
      if (child.type === 'cell') {
        // Cell nodes handled by parent
      } else if (child.type === 'markdown') {
        // Markdown nodes handled by parent
      }
    });
  });

  // Tree state management (shared across overlays)
  // Expand notebook, repository root, and only the Chapters folder
  const initiallyExpanded = new Set(['notebook', 'repository', 'folder-chapters']);

  const treeState = {
    tree: navigationTree,
    expandedNodes: initiallyExpanded, // Start with notebook, repository, and Chapters folder expanded
    selectedNode: null,
  };

  // Debug: Check notebook metadata for splash URL
  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] Creating paginationState...');
  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] notebook:', notebook);
  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] notebook.metadata:', notebook?.metadata);
  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] splash-page from metadata:', notebook?.metadata?.['splash-page']);

  const paginationState = {
    currentPage: 0,
    totalPages,
    pages,
    isOverlayOpen: false,
    autorun,
    navigationHistory, // Add history to state for easy access
    navigationTree, // Add tree to state
    treeState, // Add tree state to state for sharing across overlays
    splashUrl: notebook?.metadata?.['splash-page'], // Add splash URL for GitHub overlay access
    splashDuration, // Add splash duration from metadata/config
  };

  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] paginationState created:', paginationState);
  // eslint-disable-next-line no-console
  console.log('[PAGINATION STATE] paginationState.splashUrl:', paginationState.splashUrl);

  // Create overlay structure
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-paged-overlay';
  overlay.style.display = 'none';

  // Mark overlay as notebook mode for helper functions to detect
  if (isNotebookMode) {
    overlay.setAttribute('data-notebook-mode', 'true');
  }

  const overlayContent = document.createElement('div');
  overlayContent.className = 'ipynb-paged-overlay-content';

  // Create top bar with title and controls
  const topBar = document.createElement('div');
  topBar.className = 'ipynb-overlay-top-bar';

  // Left controls section (for tree toggle and home button in notebook mode)
  const leftControlsSection = document.createElement('div');
  leftControlsSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-left';

  // Tree toggle button - show/hide navigation tree
  const treeToggleButton = document.createElement('button');
  treeToggleButton.className = 'ipynb-overlay-button ipynb-tree-toggle-button';
  treeToggleButton.innerHTML = '&#9664;'; // Left arrow (◄) when open
  treeToggleButton.setAttribute('aria-label', 'Toggle navigation tree');
  treeToggleButton.setAttribute('aria-expanded', 'true');
  treeToggleButton.setAttribute('title', 'Hide Tree');

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ipynb-overlay-title';
  titleSection.textContent = notebookTitle;
  titleSection.setAttribute('title', notebookTitle);

  // Right controls section
  const rightControlsSection = document.createElement('div');
  rightControlsSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-right';

  // Close button (always visible, including notebook mode)
  const closeButton = document.createElement('button');
  closeButton.className = 'ipynb-overlay-button ipynb-paged-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close paged view');

  // Close button is now always visible (notebook mode fix)
  // Previously hidden in notebook mode, now always shown for better UX

  // Home button (notebook mode only) - Navigate to cell 0
  let homeButton;
  if (isNotebookMode) {
    homeButton = createHomeButton({
      context: 'notebook',
      ariaLabel: 'Go to first cell',
      onClick: () => {
        // Show splash screen if configured
        const splashUrl = notebook?.metadata?.['splash-page'];
        if (splashUrl) {
          // Show splash with duration from metadata/config (auto-dismisses)
          showSplashScreen(splashUrl, paginationState.splashDuration);
        }

        // eslint-disable-next-line no-console
        console.log('[HOME BUTTON] Setting current page to 0');
        paginationState.currentPage = 0;
        // eslint-disable-next-line no-console
        console.log('[HOME BUTTON] Current page set to:', paginationState.currentPage);
        // Pass true to skip hash update (we just cleared it in createHomeButton)
        updatePageDisplay(true);
        // eslint-disable-next-line no-console
        console.log('[HOME BUTTON] updatePageDisplay called with skipHashUpdate=true');
      },
    });
  }

  // History button (notebook mode only) - Navigation History
  let historyButton; let
    historyDropdown;
  if (isNotebookMode) {
    historyButton = document.createElement('button');
    historyButton.className = 'ipynb-overlay-button ipynb-history-button';
    historyButton.innerHTML = '&#128337;'; // Clock icon (🕘)
    historyButton.setAttribute('aria-label', 'Navigation History');
    historyButton.setAttribute('aria-expanded', 'false');
    historyButton.setAttribute('title', 'History');

    historyDropdown = document.createElement('div');
    historyDropdown.className = 'ipynb-history-dropdown';
    historyDropdown.setAttribute('role', 'menu');
    historyDropdown.style.display = 'none';

    // Function to update history dropdown
    const updateHistoryDropdown = () => {
      historyDropdown.innerHTML = '';

      if (navigationHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'ipynb-history-empty';
        emptyMessage.textContent = 'No history yet';
        historyDropdown.appendChild(emptyMessage);
        return;
      }

      navigationHistory.forEach((entry) => {
        const menuItem = document.createElement('button');
        menuItem.className = 'ipynb-history-item';

        // Add icon based on type
        const icon = entry.type === 'cell' ? '📄' : '📝';
        menuItem.textContent = `${icon} ${entry.title}`;
        menuItem.setAttribute('role', 'menuitem');

        menuItem.addEventListener('click', () => {
          if (entry.type === 'cell' && entry.cellIndex !== null) {
            // Navigate to cell page
            // Find page containing this cell
            const pageIndex = pages.findIndex((page) => page.cells.some(
              (cell) => parseInt(cell.dataset.cellIndex, 10) === entry.cellIndex,
            ));
            if (pageIndex !== -1) {
              paginationState.currentPage = pageIndex;
              updatePageDisplay();
            }
          } else if (entry.type === 'markdown' && entry.url) {
            // Re-open GitHub markdown overlay
            const mdOverlay = createGitHubMarkdownOverlay(entry.url, entry.title, helpRepoUrl, branch, paginationState, hideTopbar, config);
            mdOverlay.openOverlay();
          }
          historyDropdown.style.display = 'none';
          historyButton.setAttribute('aria-expanded', 'false');
        });

        historyDropdown.appendChild(menuItem);
      });
    };

    // Toggle history dropdown on button click
    historyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      updateHistoryDropdown(); // Refresh before showing
      const isOpen = historyDropdown.style.display === 'block';
      historyDropdown.style.display = isOpen ? 'none' : 'block';
      historyButton.setAttribute('aria-expanded', !isOpen);
    });
  }

  // Hamburger menu (notebook mode only) - Table of Contents
  let hamburgerButton; let
    tocDropdown;
  if (isNotebookMode) {
    hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'ipynb-overlay-button ipynb-hamburger-menu';
    hamburgerButton.innerHTML = '&#9776;'; // Hamburger icon
    hamburgerButton.setAttribute('aria-label', 'Table of Contents');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.setAttribute('title', 'Table of Contents');

    tocDropdown = document.createElement('div');
    tocDropdown.className = 'ipynb-toc-dropdown';
    tocDropdown.setAttribute('role', 'menu');
    tocDropdown.style.display = 'none';

    // Extract cell titles and create menu items
    const tocItems = [];
    cells.forEach((cell, index) => {
      let title = null;
      let itemType = 'content'; // 'content', 'divider', or 'skip'

      // Try to extract title from markdown cells
      if (cell.classList.contains('ipynb-markdown-cell')) {
        const content = cell.querySelector('.ipynb-cell-content');
        if (content) {
          // Check if this is a hero cell (auto-wrapped with ipynb-hero-cell class)
          const heroDiv = content.querySelector('.ipynb-hero-cell');
          const isHero = heroDiv !== null;

          // Check if this is a transition cell (auto-wrapped with ipynb-transition-card class)
          const transitionDiv = content.querySelector('.ipynb-transition-card');
          const isTransition = transitionDiv !== null;

          if (isHero) {
            itemType = 'skip'; // Don't show hero in TOC at all
          } else if (isTransition) {
            itemType = 'divider'; // Show as divider
          } else {
            // Look for headings (h1, h2, h3)
            const heading = content.querySelector('h1, h2, h3');
            if (heading) {
              title = heading.textContent.trim();
              itemType = 'content';
            } else {
              // Skip cells without headings (don't add them to TOC)
              itemType = 'skip';
            }
          }
        }
      }

      // Add to TOC based on type
      if (itemType === 'content' && title) {
        tocItems.push({
          index, title, pageIndex: Math.floor(index / 1), type: 'content',
        });
      } else if (itemType === 'divider') {
        tocItems.push({
          index, title: null, pageIndex: Math.floor(index / 1), type: 'divider',
        });
      }
      // Skip hero cells entirely
    });

    // Create dropdown menu items
    tocItems.forEach((item) => {
      if (item.type === 'divider') {
        // Create a horizontal divider
        const divider = document.createElement('hr');
        divider.className = 'ipynb-toc-divider';
        tocDropdown.appendChild(divider);
      } else {
        // Create a clickable menu item
        const menuItem = document.createElement('button');
        menuItem.className = 'ipynb-toc-item';
        menuItem.textContent = item.title;
        menuItem.setAttribute('role', 'menuitem');
        menuItem.setAttribute('data-page-index', item.pageIndex);

        menuItem.addEventListener('click', () => {
          paginationState.currentPage = item.pageIndex;
          updatePageDisplay();
          tocDropdown.style.display = 'none';
          hamburgerButton.setAttribute('aria-expanded', 'false');
        });

        tocDropdown.appendChild(menuItem);
      }
    });

    // Toggle dropdown on hamburger click
    hamburgerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = tocDropdown.style.display === 'block';
      tocDropdown.style.display = isOpen ? 'none' : 'block';
      hamburgerButton.setAttribute('aria-expanded', !isOpen);
    });
  }

  // Bookmark button (notebook mode only) - Save and view bookmarks
  let bookmarkButton; let
    bookmarkDropdown;
  if (isNotebookMode) {
    const notebookId = notebookTitle.toLowerCase().replace(/\s+/g, '-');

    bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'ipynb-overlay-button ipynb-bookmark-button';
    bookmarkButton.innerHTML = '&#128278;'; // Bookmark icon (🔖)
    bookmarkButton.setAttribute('aria-label', 'Bookmarks');
    bookmarkButton.setAttribute('aria-expanded', 'false');
    bookmarkButton.setAttribute('title', 'Bookmarks');

    bookmarkDropdown = document.createElement('div');
    bookmarkDropdown.className = 'ipynb-bookmark-dropdown';
    bookmarkDropdown.setAttribute('role', 'menu');
    bookmarkDropdown.style.display = 'none';

    // Function to update bookmark dropdown
    const updateBookmarkDropdown = () => {
      bookmarkDropdown.innerHTML = '';

      const bookmarks = getBookmarks(notebookId);

      if (bookmarks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'ipynb-bookmark-empty';
        emptyMessage.textContent = 'No bookmarks yet';
        bookmarkDropdown.appendChild(emptyMessage);
      } else {
        bookmarks.forEach((bookmark) => {
          const menuItem = document.createElement('button');
          menuItem.className = 'ipynb-bookmark-item';

          const titleSpan = document.createElement('span');
          // Display differently based on type
          if (bookmark.type === 'cell') {
            titleSpan.textContent = `📑 ${bookmark.title} (Page ${bookmark.pageIndex + 1})`;
          } else {
            // For markdown files, show just the file name
            const fileName = bookmark.url ? bookmark.url.split('/').pop() : bookmark.title;
            titleSpan.textContent = `📝 ${fileName}`;
          }

          const removeBtn = document.createElement('span');
          removeBtn.className = 'ipynb-bookmark-remove';
          removeBtn.innerHTML = '&times;';
          removeBtn.setAttribute('aria-label', 'Remove bookmark');
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeBookmark(notebookId, bookmark.type, bookmark.pageIndex, bookmark.url);
            updateBookmarkDropdown();
          });

          menuItem.appendChild(titleSpan);
          menuItem.appendChild(removeBtn);
          menuItem.setAttribute('role', 'menuitem');

          menuItem.addEventListener('click', () => {
            if (bookmark.type === 'cell') {
              // Navigate to cell page
              paginationState.currentPage = bookmark.pageIndex;
              updatePageDisplay();
            } else if (bookmark.type === 'markdown' && bookmark.url) {
              // Open markdown file in overlay
              const mdOverlay = createGitHubMarkdownOverlay(bookmark.url, bookmark.title, helpRepoUrl, branch, paginationState, hideTopbar, config);
              mdOverlay.openOverlay();
            }
            bookmarkDropdown.style.display = 'none';
            bookmarkButton.setAttribute('aria-expanded', 'false');
          });

          bookmarkDropdown.appendChild(menuItem);
        });

        // Add "Clear All" button if there are bookmarks
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'ipynb-bookmark-clear-all';
        clearAllBtn.textContent = 'Clear All Bookmarks';
        clearAllBtn.addEventListener('click', () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Are you sure you want to clear all bookmarks?')) {
            clearAllBookmarks(notebookId);
            updateBookmarkDropdown();
          }
        });
        bookmarkDropdown.appendChild(clearAllBtn);
      }

      // Add "Bookmark This Page" button
      const addBookmarkBtn = document.createElement('button');
      addBookmarkBtn.className = 'ipynb-bookmark-add';
      addBookmarkBtn.textContent = '+ Bookmark This Page';
      addBookmarkBtn.addEventListener('click', () => {
        const currentPage = pages[paginationState.currentPage];
        const firstCell = currentPage.cells[0];
        let title = `Page ${paginationState.currentPage + 1}`;

        // Try to extract title from first cell
        if (firstCell && firstCell.classList.contains('ipynb-markdown-cell')) {
          const content = firstCell.querySelector('.ipynb-cell-content');
          if (content) {
            const heading = content.querySelector('h1, h2, h3');
            if (heading) {
              title = heading.textContent.trim();
            }
          }
        }

        if (saveBookmark(notebookId, title, 'cell', paginationState.currentPage, null)) {
          // Visual feedback
          bookmarkButton.style.transform = 'scale(1.2)';
          setTimeout(() => {
            bookmarkButton.style.transform = '';
          }, 200);
          updateBookmarkDropdown();
        }
      });
      bookmarkDropdown.insertBefore(addBookmarkBtn, bookmarkDropdown.firstChild);
    };

    // Toggle bookmark dropdown on button click
    bookmarkButton.addEventListener('click', (e) => {
      e.stopPropagation();
      updateBookmarkDropdown(); // Refresh before showing
      const isOpen = bookmarkDropdown.style.display === 'block';
      bookmarkDropdown.style.display = isOpen ? 'none' : 'block';
      bookmarkButton.setAttribute('aria-expanded', !isOpen);
    });
  }

  // Help button (notebook mode only) - Opens help.md in GitHub overlay
  let helpButton;
  if (isNotebookMode && helpRepoUrl) {
    helpButton = document.createElement('button');
    helpButton.className = 'ipynb-overlay-button ipynb-help-button';
    helpButton.innerHTML = config.icons.questionMark; // Question mark icon (❓)
    helpButton.setAttribute('aria-label', 'Help');
    helpButton.setAttribute('title', 'Help');

    helpButton.addEventListener('click', createHelpButtonHandler(repoUrl, branch, {
      createGitHubMarkdownOverlay,
      history: paginationState,
      hideTopbar,
    }, config));
  }

  // Close all dropdowns when clicking outside (consolidated handler)
  if (isNotebookMode) {
    const dropdowns = [
      { dropdown: historyDropdown, button: historyButton },
      { dropdown: tocDropdown, button: hamburgerButton },
      { dropdown: bookmarkDropdown, button: bookmarkButton },
    ];
    document.addEventListener('click', createDropdownCloseHandler(dropdowns));
  }

  // Pagination controls
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'ipynb-pagination';

  const prevButton = document.createElement('button');
  prevButton.className = 'ipynb-pagination-button ipynb-prev-button';
  prevButton.textContent = 'Previous';
  prevButton.setAttribute('aria-label', 'Previous page');

  const pageIndicator = document.createElement('span');
  pageIndicator.className = 'ipynb-page-indicator';

  const nextButton = document.createElement('button');
  nextButton.className = 'ipynb-pagination-button ipynb-next-button';
  nextButton.textContent = 'Next';
  nextButton.setAttribute('aria-label', 'Next page');

  paginationDiv.appendChild(prevButton);
  paginationDiv.appendChild(pageIndicator);
  paginationDiv.appendChild(nextButton);

  // Create navigation tree panel
  const navTreePanel = document.createElement('nav');
  navTreePanel.className = 'ipynb-nav-tree';
  navTreePanel.setAttribute('role', 'navigation');
  navTreePanel.setAttribute('aria-label', 'Content navigation');

  // Create main content wrapper (tree + cells)
  const mainContentWrapper = document.createElement('div');
  mainContentWrapper.className = 'ipynb-overlay-main';

  // Cell content area
  const cellContentArea = document.createElement('div');
  cellContentArea.className = 'ipynb-paged-cell-area';

  // Assemble main wrapper
  // Only add nav tree if top bar is visible (tree toggle button needs to be accessible)
  if (!hideTopbar) {
    mainContentWrapper.appendChild(navTreePanel);
  }
  mainContentWrapper.appendChild(cellContentArea);

  // Assemble top bar with left/center/right sections
  // Left section - home button first, then tree toggle
  if (isNotebookMode && homeButton) {
    leftControlsSection.appendChild(homeButton);
    // eslint-disable-next-line no-console
    console.log('[HOME BUTTON] Appended to DOM, parent:', homeButton.parentElement);
  }
  leftControlsSection.appendChild(treeToggleButton);

  // Right section - all other controls
  if (isNotebookMode && historyButton) {
    rightControlsSection.appendChild(historyButton);
  }
  if (isNotebookMode && bookmarkButton) {
    rightControlsSection.appendChild(bookmarkButton);
  }
  if (isNotebookMode && hamburgerButton) {
    rightControlsSection.appendChild(hamburgerButton);
  }
  if (isNotebookMode && helpButton) {
    rightControlsSection.appendChild(helpButton);
  }
  rightControlsSection.appendChild(closeButton);

  // Assemble top bar: left controls, title, right controls
  topBar.appendChild(leftControlsSection);
  topBar.appendChild(titleSection);
  topBar.appendChild(rightControlsSection);

  // Assemble overlay
  // Conditionally add top bar (hide if no-topbar variation is set)
  if (!hideTopbar) {
    overlayContent.appendChild(topBar);
  }
  if (isNotebookMode) {
    overlayContent.appendChild(historyDropdown);
    overlayContent.appendChild(bookmarkDropdown);
    overlayContent.appendChild(tocDropdown);
  }
  overlayContent.appendChild(mainContentWrapper); // Use wrapper instead of cellContentArea directly
  overlayContent.appendChild(paginationDiv);
  overlay.appendChild(overlayContent);

  // Update page display
  // @param {boolean} skipHashUpdate - If true, don't update URL hash (used by home button)
  async function updatePageDisplay(skipHashUpdate = false) {
    // Get current page group
    const currentPage = pages[paginationState.currentPage];

    // Track first cell in history (if it has a heading)
    const firstCell = currentPage.cells[0];
    if (firstCell && firstCell.classList.contains('ipynb-markdown-cell')) {
      const content = firstCell.querySelector('.ipynb-cell-content');
      if (content) {
        const heading = content.querySelector('h1, h2, h3');
        if (heading) {
          const title = heading.textContent.trim();
          const cellIndex = parseInt(firstCell.dataset.cellIndex, 10);
          addToHistory(navigationHistory, title, 'cell', cellIndex);
        }
      }
    }

    // Build new content in a document fragment (prevents FOUC)
    const fragment = document.createDocumentFragment();

    // Clone and append all cells in this page to fragment
    const clonedCells = currentPage.cells.map((cell) => {
      const clonedCell = cell.cloneNode(true);
      clonedCell.classList.add('active');
      fragment.appendChild(clonedCell);
      return clonedCell;
    });

    // Replace content in one atomic operation (prevents FOUC)
    cellContentArea.innerHTML = '';
    cellContentArea.appendChild(fragment);

    // Re-attach run button handlers for code cells
    // Use Promise.all to handle async execution in autorun mode
    const autorunPromises = clonedCells
      .filter((clonedCell) => clonedCell.classList.contains('ipynb-code-cell'))
      .map((clonedCell) => {
        const runButton = clonedCell.querySelector('.ipynb-run-button');

        // In autorun mode, automatically execute the cell
        if (paginationState.autorun) {
          return executeCodeCell(clonedCell);
        }
        // Otherwise, attach click handler
        if (runButton) {
          runButton.addEventListener('click', () => {
            executeCodeCell(clonedCell);
          });
        }
        return Promise.resolve();
      });

    // Wait for all autorun executions to complete
    await Promise.all(autorunPromises);

    // Re-resolve ALL links with hash="#" in the current page (action cards, tables, lists, etc.)
    const allHashLinks = cellContentArea.querySelectorAll('a[href="#"]');
    allHashLinks.forEach((link) => {
      // Re-resolve the link by finding matching heading
      const linkText = link.textContent.trim();

      // Search through ALL cells in the notebook (not just current page)
      const allCells = cellsContainer.querySelectorAll('.ipynb-cell');
      let targetCell = null;

      allCells.forEach((cell) => {
        if (targetCell) return; // Already found
        const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
          const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

          if (headingText.includes(searchText)) {
            targetCell = cell;
            if (!heading.id && cell.dataset.cellIndex) {
              heading.id = `cell-${cell.dataset.cellIndex}`;
            }
          }
        });
      });

      // Update the link
      if (targetCell && targetCell.dataset.cellIndex) {
        link.href = `#cell-${targetCell.dataset.cellIndex}`;
      }
    });

    // Add click handlers to links with hash targets for overlay navigation
    const links = cellContentArea.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Re-check href at click time (may have been updated by resolution)
        const target = link.getAttribute('href');

        // Only navigate if the link is resolved (not just "#" or empty)
        if (target && target !== '#' && target !== '') {
          navigateToAnchor(target);
        } else {
          // Link is unresolved - try to resolve it now
          const linkText = link.textContent.trim();
          const allCells = cellsContainer.querySelectorAll('.ipynb-cell');
          let targetCell = null;

          allCells.forEach((cell) => {
            if (targetCell) return;
            const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach((heading) => {
              const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
              const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

              if (headingText.includes(searchText)) {
                targetCell = cell;
                if (!heading.id && cell.dataset.cellIndex) {
                  heading.id = `cell-${cell.dataset.cellIndex}`;
                }
              }
            });
          });

          // If we found a match, update the link and navigate
          if (targetCell && targetCell.dataset.cellIndex) {
            const newTarget = `#cell-${targetCell.dataset.cellIndex}`;
            link.href = newTarget;
            navigateToAnchor(newTarget);
          }
        }
      });
    });

    // Re-attach click handlers for GitHub markdown links (lost during cloning)
    const githubMdLinks = cellContentArea.querySelectorAll('.ipynb-github-md-link');
    githubMdLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const githubUrl = link.dataset.mdUrl; // Get URL from data attribute
        const linkBranch = link.dataset.branch || branch; // Get branch from link or use default
        const title = link.textContent || 'GitHub Markdown';
        const mdOverlay = createGitHubMarkdownOverlay(githubUrl, title, helpRepoUrl, linkBranch, paginationState, hideTopbar, config);
        mdOverlay.openOverlay();
      });
    });

    // Add spacing between grouped cells for better readability
    if (currentPage.type === 'grouped' && currentPage.cells.length > 1) {
      const allCells = cellContentArea.querySelectorAll('.ipynb-cell');

      // Add spacing after markdown cell (first cell if markdown)
      if (allCells.length > 0 && allCells[0].classList.contains('ipynb-markdown-cell')) {
        allCells[0].style.marginBottom = '1.5rem';
      }

      // Add spacing between consecutive code cells
      for (let i = 1; i < allCells.length - 1; i += 1) {
        if (allCells[i].classList.contains('ipynb-code-cell')) {
          allCells[i].style.marginBottom = '1rem';
        }
      }
    }

    // Update controls
    pageIndicator.textContent = `${paginationState.currentPage + 1} / ${totalPages}`;
    prevButton.disabled = paginationState.currentPage === 0;
    nextButton.disabled = paginationState.currentPage === totalPages - 1;

    // Update browser URL hash to reflect current cell (for bookmarking/sharing)
    // Skip hash update if explicitly requested (e.g., home button wants to clear hash)
    // eslint-disable-next-line no-console
    console.log('[UPDATE PAGE] skipHashUpdate:', skipHashUpdate, 'currentPage:', paginationState.currentPage);
    if (!skipHashUpdate && currentPage && currentPage.cells.length > 0) {
      const firstCellIndex = parseInt(currentPage.cells[0].dataset.cellIndex, 10);
      const newHash = `#cell-${firstCellIndex}`;
      // eslint-disable-next-line no-console
      console.log('[UPDATE PAGE] Updating hash to:', newHash);
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('[UPDATE PAGE] Skipping hash update');
    }

    // Update tree selection to match current page
    if (currentPage && currentPage.cells.length > 0) {
      const firstCellIndex = parseInt(currentPage.cells[0].dataset.cellIndex, 10);
      const notebookRoot = navigationTree.find((root) => root.id === 'notebook');

      // Search for cell in notebook tree (might be nested in Parts)
      let cellNode = null;
      const searchChildren = (nodes) => {
        // Use reduce to find first matching node (avoids for...of)
        const result = nodes.reduce((found, node) => {
          if (found) return found;
          if (node.cellIndex === firstCellIndex) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            return searchChildren(node.children);
          }
          return null;
        }, null);
        return result;
      };

      if (notebookRoot) {
        cellNode = searchChildren(notebookRoot.children);
      }

      if (cellNode) {
        selectTreeNode(cellNode.id, treeState, navTreePanel, handleTreeNodeClick);
      }
    }

    // Scroll to top of cell area (not overlayContent)
    cellContentArea.scrollTop = 0;
  }

  // Navigation handlers
  function goToNextPage() {
    if (paginationState.currentPage < totalPages - 1) {
      paginationState.currentPage += 1;
      updatePageDisplay();
    }
  }

  function goToPrevPage() {
    if (paginationState.currentPage > 0) {
      paginationState.currentPage -= 1;
      updatePageDisplay();
    }
  }

  // Tree state is now defined earlier and included in paginationState for sharing

  // Tree navigation handler
  function handleTreeNodeClick(node) {
    // Root nodes and folder nodes: do nothing on node click (only icon should toggle)
    if (node.type === 'root' || node.type === 'folder') {
      return;
    }

    // Part nodes with cellIndex: navigate to that cell (they're also content cells)
    // Part nodes without cellIndex: do nothing (they're just containers)
    if (node.type === 'part') {
      if (node.cellIndex === null) {
        return; // Container part, don't navigate
      }
      // Fall through to navigation logic below if it has a cellIndex
    }

    // Cell nodes or navigable part nodes: navigate to the page containing that cell
    if ((node.type === 'cell' || node.type === 'part') && node.cellIndex !== null) {
      // Close any open GitHub markdown overlays first (they're layered on top)
      const openMdOverlays = document.querySelectorAll('.ipynb-github-md-overlay');
      openMdOverlays.forEach((mdOverlay) => {
        if (mdOverlay.style.display !== 'none') {
          mdOverlay.style.display = 'none';
        }
      });

      // Find the page that contains this cell
      const pageIndex = pages.findIndex((page) => page.cells.some(
        (cell) => parseInt(cell.dataset.cellIndex, 10) === node.cellIndex,
      ));

      if (pageIndex !== -1) {
        // Navigate to this page
        paginationState.currentPage = pageIndex;
        updatePageDisplay();

        // Select this node in tree
        selectTreeNode(node.id, treeState, navTreePanel, handleTreeNodeClick);
        return;
      }
    }

    // Markdown nodes: open in overlay
    if (node.type === 'markdown' && node.path) {
      // Use repoUrl from closure scope (passed to createPagedOverlay)
      const mdRepoUrl = repoUrl || 'https://github.com/ddttom/allaboutV2';
      const fullUrl = `${mdRepoUrl}/blob/${branch}/${node.path}`;

      // Create extended history context with tree references
      const historyContext = {
        historyArray: navigationHistory, // Keep the actual array
        navigationTree, // Reference to the tree for dynamic updates
        navTreePanel, // Tree panel element for re-rendering
        treeState, // Tree state for expand/collapse
        handleTreeNodeClick, // Click handler for tree nodes
        splashUrl: paginationState.splashUrl, // Add splash URL from pagination state
        splashDuration: paginationState.splashDuration, // Add splash duration from pagination state
      };

      // Open using GitHub markdown overlay
      const mdOverlay = createGitHubMarkdownOverlay(fullUrl, node.label, mdRepoUrl, branch, historyContext, false, config);
      mdOverlay.openOverlay();

      // Select this node in tree
      selectTreeNode(node.id, treeState, navTreePanel, handleTreeNodeClick);
    }
  }

  // Open overlay
  function openOverlay() {
    paginationState.isOverlayOpen = true;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    updatePageDisplay();

    // Render navigation tree
    renderNavigationTree(navigationTree, navTreePanel, treeState, handleTreeNodeClick);

    // Auto-select current page in tree
    const currentPage = pages[paginationState.currentPage];
    if (currentPage && currentPage.cells.length > 0) {
      const firstCellIndex = parseInt(currentPage.cells[0].dataset.cellIndex, 10);
      const notebookRoot = navigationTree.find((root) => root.id === 'notebook');

      // Search for cell in notebook tree (might be nested in Parts)
      const searchChildren = (nodes) => {
        // Use reduce to find first matching node (avoids for...of)
        const result = nodes.reduce((found, node) => {
          if (found) return found;
          if (node.cellIndex === firstCellIndex) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            return searchChildren(node.children);
          }
          return null;
        }, null);
        return result;
      };

      let cellNode = null;
      if (notebookRoot) {
        cellNode = searchChildren(notebookRoot.children);
      }

      if (cellNode) {
        selectTreeNode(cellNode.id, treeState, navTreePanel, handleTreeNodeClick);
      }
    }
  }

  // Close overlay
  function closeOverlay() {
    paginationState.isOverlayOpen = false;
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    // Remove keyboard event listener to prevent memory leaks
    document.removeEventListener('keydown', keyHandler);
  }

  // Button event listeners
  prevButton.addEventListener('click', goToPrevPage);
  nextButton.addEventListener('click', goToNextPage);
  closeButton.addEventListener('click', closeOverlay);

  // Tree toggle button handler
  treeToggleButton.addEventListener('click', createTreeToggleHandler(navTreePanel, treeToggleButton));

  // Keyboard navigation
  const keyHandler = (e) => {
    if (!paginationState.isOverlayOpen) return;

    // Only handle if user isn't typing in an input
    if (!document.activeElement
        || (document.activeElement.tagName !== 'INPUT'
         && document.activeElement.tagName !== 'TEXTAREA')) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay();
      }
    }
  };

  document.addEventListener('keydown', keyHandler);

  // Navigate to an anchor within the overlay
  function navigateToAnchor(target) {
    if (!paginationState.isOverlayOpen) return;

    // Find the page that contains an element with the target ID
    const targetId = target.replace('#', '');

    // If targetId is empty, don't navigate
    if (!targetId) {
      console.warn('Cannot navigate to empty target');
      return;
    }

    // Search through all pages to find the one containing the target ID
    const pageIndex = pages.findIndex((page) => page.cells.some((cell) => {
      // Use both querySelector and textContent search for robustness
      const hasId = cell.querySelector(`#${targetId}`) !== null;

      // Also check if cell contains an h2 that would generate this ID
      const headers = cell.querySelectorAll('h2');
      const hasMatchingHeader = Array.from(headers).some((h2) => {
        const generatedId = h2.textContent
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim();
        return generatedId === targetId || h2.id === targetId;
      });

      return hasId || hasMatchingHeader;
    }));

    if (pageIndex !== -1) {
      // Navigate to this page
      paginationState.currentPage = pageIndex;
      updatePageDisplay();
    }
  }

  // Append overlay to body
  document.body.appendChild(overlay);

  return {
    openOverlay,
    closeOverlay,
    navigateToAnchor,
    paginationState,
  };
}

/**
 * Create unified home button for both paged overlay and GitHub markdown overlay
 * @param {Object} config - Configuration object
 * @param {string} config.context - Context identifier ('notebook' or 'github')
 * @param {Function} config.onClick - Click handler function
 * @param {string} [config.ariaLabel='Go home'] - Aria label for accessibility
 * @returns {HTMLElement} Home button element
 */
function createHomeButton(config) {
  const { context, onClick, ariaLabel = 'Go home' } = config;

  const homeButton = document.createElement('button');
  homeButton.type = 'button'; // Prevent form submission behavior
  homeButton.className = 'ipynb-overlay-button ipynb-home-button';
  homeButton.innerHTML = '🏠';
  homeButton.setAttribute('aria-label', ariaLabel);
  homeButton.setAttribute('title', 'Home');
  homeButton.setAttribute('data-context', context); // Track which context this button belongs to

  // eslint-disable-next-line no-console
  console.log(`[HOME BUTTON] Created button for context: ${context}`);

  // Add click handler with comprehensive logging
  homeButton.addEventListener('click', (e) => {
    // eslint-disable-next-line no-console
    console.log(`[HOME BUTTON] Clicked in context: ${context}`);
    // eslint-disable-next-line no-console
    console.log('[HOME BUTTON] Event type:', e.type);
    // eslint-disable-next-line no-console
    console.log('[HOME BUTTON] Hash before clear:', window.location.hash);

    e.preventDefault();
    e.stopPropagation();

    // Clear the URL hash when going home
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      // eslint-disable-next-line no-console
      console.log('[HOME BUTTON] Hash after clear:', window.location.hash);
    }

    // Call the provided onClick handler
    onClick(e);

    // eslint-disable-next-line no-console
    console.log('[HOME BUTTON] onClick handler completed');
  });

  // Add inline onclick as backup test
  homeButton.onclick = () => {
    // eslint-disable-next-line no-console
    console.log(`[HOME BUTTON] INLINE onclick fired for context: ${context}!`);
    // Don't prevent default here - let the addEventListener handle it
  };

  // eslint-disable-next-line no-console
  console.log('[HOME BUTTON] Button creation complete, returning button');

  return homeButton;
}

/**
 * Create start button for paged variation
 * @returns {HTMLElement} Start button element
 */
function createPagedStartButton() {
  const startButton = document.createElement('button');
  startButton.className = 'ipynb-paged-start-button';
  startButton.textContent = 'Start Reading';
  startButton.setAttribute('aria-label', 'Start paged reading mode');
  return startButton;
}

/**
 * Convert GitHub blob URL to raw content URL, or return local path as-is
 * @param {string} blobUrl - GitHub blob URL or local path
 * @param {string} [branch='main'] - GitHub branch to use (only applies to GitHub URLs)
 * @returns {string} Raw content URL or local path
 */
function convertToRawUrl(blobUrl, _branch = 'main') {
  // If it's a local path (starts with /), return as-is
  if (blobUrl.startsWith('/')) {
    return blobUrl;
  }

  // Convert: https://github.com/user/repo/blob/main/path/file.md
  // To: https://raw.githubusercontent.com/user/repo/{branch}/path/file.md
  const rawUrl = blobUrl
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/');

  // The branch is already in the URL from the calling code, so just return it
  // No need to do any branch replacement
  return rawUrl;
}

/**
 * Create GitHub markdown overlay for displaying markdown files from GitHub
 * @param {string} githubUrl - Full GitHub blob URL or local path
 * @param {string} title - Title to display in overlay header
 * @param {string} [helpRepoUrl] - Optional help repository URL
 * @param {string} [branch='main'] - GitHub branch to use
 * @param {Array} [parentHistory=null] - Optional parent overlay's history array
 * @param {boolean} [hideTopbar=false] - Whether to hide the top bar
 * @param {object} [config=null] - Configuration object with settings (injected dependency)
 * @returns {Object} Object with openOverlay and closeOverlay functions
 */
function createGitHubMarkdownOverlay(githubUrl, title, helpRepoUrl = null, branch = 'main', parentHistory = null, hideTopbar = false, config = null) {
  // eslint-disable-next-line no-console
  console.log('[CREATE GITHUB OVERLAY] Function called');
  // eslint-disable-next-line no-console
  console.log('[CREATE GITHUB OVERLAY] githubUrl:', githubUrl);
  // eslint-disable-next-line no-console
  console.log('[CREATE GITHUB OVERLAY] parentHistory received:', JSON.stringify(parentHistory, null, 2));

  // Config is required for icons and UI text - fail if missing
  if (!config) {
    console.error('[IPYNB-VIEWER] CRITICAL: Config object missing in createGitHubMarkdownOverlay');
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'ipynb-error';
    errorOverlay.style.cssText = 'padding: 2rem; text-align: center; background: #fee; color: #c00;';
    errorOverlay.textContent = IPYNB_ERRORS.CONFIG_MISSING_GITHUB;
    document.body.appendChild(errorOverlay);
    return {
      openOverlay: () => {},
      closeOverlay: () => {},
    };
  }

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-manual-overlay ipynb-github-md-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'GitHub markdown viewer');

  // Create overlay content - full viewport
  const overlayContent = document.createElement('div');
  overlayContent.className = 'ipynb-manual-overlay-content ipynb-paged-overlay-content';

  // Create navigation tree panel (left side)
  const navTreePanel = document.createElement('div');
  navTreePanel.className = 'ipynb-nav-tree-panel';
  navTreePanel.setAttribute('role', 'navigation');
  navTreePanel.setAttribute('aria-label', 'Navigation tree');

  // Use parent's tree state if available (to maintain expand/collapse state across overlays)
  // Otherwise create a new one (fallback for when there's no parent)
  let treeState;
  if (parentHistory && typeof parentHistory === 'object' && parentHistory.treeState) {
    treeState = parentHistory.treeState;
  } else {
    treeState = {
      expandedNodes: new Set(['repository', 'folder-chapters']), // Repository root and Chapters folder expanded by default
      selectedNode: null,
    };
  }

  // Create top bar with title and controls (three-section layout)
  const topBar = document.createElement('div');
  topBar.className = 'ipynb-overlay-top-bar';

  // Left controls section - tree toggle and home button
  const leftControlsSection = document.createElement('div');
  leftControlsSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-left';

  // Tree toggle button - show/hide navigation tree
  const treeToggleButton = document.createElement('button');
  treeToggleButton.className = 'ipynb-overlay-button ipynb-tree-toggle-button';
  treeToggleButton.innerHTML = '&#9664;'; // Left arrow (◄) when open
  treeToggleButton.setAttribute('aria-label', 'Toggle navigation tree');
  treeToggleButton.setAttribute('aria-expanded', 'true');
  treeToggleButton.setAttribute('title', 'Hide Tree');

  // Home button - navigate to first opened markdown (will be configured later with actual handler)
  // We need to declare it here so it's available for the event handler setup below
  let homeButton = null;

  leftControlsSection.appendChild(treeToggleButton);

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ipynb-overlay-title';
  titleSection.textContent = title;
  titleSection.setAttribute('title', title);

  // Right controls section
  const rightControlsSection = document.createElement('div');
  rightControlsSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-right';

  // History button - Navigation History
  const historyButton = document.createElement('button');
  historyButton.className = 'ipynb-overlay-button ipynb-history-button';
  historyButton.innerHTML = '&#128337;'; // Clock icon (🕘)
  historyButton.setAttribute('aria-label', 'Navigation History');
  historyButton.setAttribute('aria-expanded', 'false');
  historyButton.setAttribute('title', 'History');

  const historyDropdown = document.createElement('div');
  historyDropdown.className = 'ipynb-history-dropdown';
  historyDropdown.setAttribute('role', 'menu');
  historyDropdown.style.display = 'none';

  // Bookmark button - Save GitHub markdown pages
  const bookmarkButton = document.createElement('button');
  bookmarkButton.className = 'ipynb-overlay-button ipynb-bookmark-button';
  bookmarkButton.innerHTML = '&#128278;'; // Bookmark icon (🔖)
  bookmarkButton.setAttribute('aria-label', 'Bookmarks');
  bookmarkButton.setAttribute('aria-expanded', 'false');
  bookmarkButton.setAttribute('title', 'Bookmarks');

  const bookmarkDropdown = document.createElement('div');
  bookmarkDropdown.className = 'ipynb-bookmark-dropdown';
  bookmarkDropdown.setAttribute('role', 'menu');
  bookmarkDropdown.style.display = 'none';

  // Hamburger menu (TOC) button - Table of contents
  const hamburgerButton = document.createElement('button');
  hamburgerButton.className = 'ipynb-overlay-button ipynb-hamburger-menu';
  hamburgerButton.innerHTML = '&#9776;'; // Hamburger icon (≡)
  hamburgerButton.setAttribute('aria-label', 'Table of Contents');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('title', 'TOC');

  const tocDropdown = document.createElement('div');
  tocDropdown.className = 'ipynb-toc-dropdown';
  tocDropdown.setAttribute('role', 'menu');
  tocDropdown.style.display = 'none';

  // Help button - Opens help.md
  let helpButton = null;
  if (helpRepoUrl) {
    helpButton = document.createElement('button');
    helpButton.className = 'ipynb-overlay-button ipynb-help-button';
    helpButton.innerHTML = config.icons.questionMark; // Question mark icon (❓)
    helpButton.setAttribute('aria-label', 'Help');
    helpButton.setAttribute('title', 'Help');
  }

  // Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'ipynb-overlay-button';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close markdown viewer');

  // Assemble top bar: left controls, title, right controls
  rightControlsSection.appendChild(historyButton);
  rightControlsSection.appendChild(bookmarkButton);
  rightControlsSection.appendChild(hamburgerButton);
  if (helpButton) {
    rightControlsSection.appendChild(helpButton);
  }
  rightControlsSection.appendChild(closeButton);

  topBar.appendChild(leftControlsSection);
  topBar.appendChild(titleSection);
  topBar.appendChild(rightControlsSection);

  // Conditionally add top bar (hide if no-topbar variation is set)
  if (!hideTopbar) {
    overlayContent.appendChild(topBar);
  }

  // Append dropdowns (float above content)
  overlayContent.appendChild(historyDropdown);
  overlayContent.appendChild(bookmarkDropdown);
  overlayContent.appendChild(tocDropdown);

  // Create main wrapper (tree + content side by side)
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'ipynb-overlay-main';

  // Append navigation tree panel (left side, inside flex wrapper)
  // Only add tree if top bar is visible (tree toggle needs to be accessible)
  if (!hideTopbar) {
    mainWrapper.appendChild(navTreePanel);
  }

  // Create content area for markdown (right side, inside flex wrapper)
  const contentArea = document.createElement('div');
  contentArea.className = 'ipynb-manual-content-area ipynb-overlay-content ipynb-paged-cell-area';
  mainWrapper.appendChild(contentArea);

  overlayContent.appendChild(mainWrapper);
  overlay.appendChild(overlayContent);

  // Convert blob URL to raw URL (using specified branch)
  const rawUrl = convertToRawUrl(githubUrl, branch);

  // Storage key for bookmarks (based on GitHub URL)
  const bookmarkId = `github-md-${btoa(githubUrl).substring(0, 20)}`;

  // Home button will be created after closeOverlay is defined (see below)
  // For GitHub markdown overlay, "home" means:
  // - If opened from notebook (has parentHistory context): close overlay and return to notebook
  // - Otherwise: stay on current page (already home)
  const hasParentNotebook = parentHistory && typeof parentHistory === 'object' && parentHistory.navigationTree;

  // History button handlers
  const updateHistoryDropdown = () => {
    historyDropdown.innerHTML = '';

    if (!parentHistory || parentHistory.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'ipynb-history-empty';
      emptyMessage.textContent = 'No history yet';
      historyDropdown.appendChild(emptyMessage);
      return;
    }

    parentHistory.forEach((entry) => {
      const menuItem = document.createElement('button');
      menuItem.className = 'ipynb-history-item';

      // Add icon based on type
      const icon = entry.type === 'markdown' ? '📝' : '📄';
      menuItem.textContent = `${icon} ${entry.title}`;
      menuItem.setAttribute('role', 'menuitem');

      menuItem.addEventListener('click', () => {
        if (entry.type === 'markdown' && entry.url) {
          // Close current overlay and open historical markdown
          closeOverlay();
          const histOverlay = createGitHubMarkdownOverlay(entry.url, entry.title, helpRepoUrl, branch, parentHistory, false, config);
          histOverlay.openOverlay();
        }
        historyDropdown.style.display = 'none';
        historyButton.setAttribute('aria-expanded', 'false');
      });

      historyDropdown.appendChild(menuItem);
    });
  };

  historyButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateHistoryDropdown();
    const isOpen = historyDropdown.style.display === 'block';
    historyDropdown.style.display = isOpen ? 'none' : 'block';
    historyButton.setAttribute('aria-expanded', !isOpen);
  });

  // Bookmark button handlers
  const updateBookmarkDropdown = () => {
    bookmarkDropdown.innerHTML = '';

    const bookmarks = getBookmarks(bookmarkId);

    // Add "Bookmark this page" button at the top
    const addBookmarkBtn = document.createElement('button');
    addBookmarkBtn.className = 'ipynb-bookmark-item ipynb-add-bookmark';
    addBookmarkBtn.textContent = '+ Bookmark this page';
    addBookmarkBtn.setAttribute('role', 'menuitem');

    addBookmarkBtn.addEventListener('click', () => {
      // Save markdown file as bookmark
      const success = saveBookmark(bookmarkId, title, 'markdown', null, githubUrl);
      if (success) {
        updateBookmarkDropdown();
      }
    });

    if (bookmarks.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'ipynb-bookmark-empty';
      emptyMessage.textContent = 'No bookmarks yet';
      bookmarkDropdown.appendChild(addBookmarkBtn);
      bookmarkDropdown.appendChild(emptyMessage);
      return;
    }

    // Add existing bookmarks
    bookmarks.forEach((bookmark) => {
      const menuItem = document.createElement('button');
      menuItem.className = 'ipynb-bookmark-item';
      menuItem.textContent = `🔖 ${bookmark.title}`;
      menuItem.setAttribute('role', 'menuitem');

      menuItem.addEventListener('click', () => {
        if (bookmark.url) {
          // Close current overlay and open bookmarked markdown
          closeOverlay();
          const bmOverlay = createGitHubMarkdownOverlay(bookmark.url, bookmark.title, helpRepoUrl, branch, parentHistory, false, config);
          bmOverlay.openOverlay();
        }
        bookmarkDropdown.style.display = 'none';
        bookmarkButton.setAttribute('aria-expanded', 'false');
      });

      bookmarkDropdown.appendChild(menuItem);
    });

    // Add "Bookmark this page" button at the top
    bookmarkDropdown.insertBefore(addBookmarkBtn, bookmarkDropdown.firstChild);
  };

  bookmarkButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateBookmarkDropdown();
    const isOpen = bookmarkDropdown.style.display === 'block';
    bookmarkDropdown.style.display = isOpen ? 'none' : 'block';
    bookmarkButton.setAttribute('aria-expanded', !isOpen);
  });

  // Hamburger (TOC) button handlers - will be populated after markdown is loaded
  const updateTocDropdown = () => {
    tocDropdown.innerHTML = '';

    // Find all headings in the content area
    const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'ipynb-toc-empty';
      emptyMessage.textContent = 'No headings found';
      tocDropdown.appendChild(emptyMessage);
      return;
    }

    headings.forEach((heading) => {
      const menuItem = document.createElement('button');
      menuItem.className = `ipynb-toc-item ipynb-toc-${heading.tagName.toLowerCase()}`;
      menuItem.textContent = heading.textContent.trim();
      menuItem.setAttribute('role', 'menuitem');

      menuItem.addEventListener('click', () => {
        // Scroll to heading
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tocDropdown.style.display = 'none';
        hamburgerButton.setAttribute('aria-expanded', 'false');
      });

      tocDropdown.appendChild(menuItem);
    });
  };

  hamburgerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateTocDropdown();
    const isOpen = tocDropdown.style.display === 'block';
    tocDropdown.style.display = isOpen ? 'none' : 'block';
    hamburgerButton.setAttribute('aria-expanded', !isOpen);
  });

  // Help button handler
  if (helpButton && helpRepoUrl) {
    // Note: GitHub overlay needs config from parent notebook context
    // We don't have access to the parent's config here, so we pass null and use defaults
    helpButton.addEventListener('click', createHelpButtonHandler(helpRepoUrl, branch, {
      createGitHubMarkdownOverlay,
      history: parentHistory,
      hideTopbar: false, // GitHub overlay doesn't have hideTopbar parameter
    }, null)); // null config will use hardcoded defaults in createHelpButtonHandler
  }

  // Close dropdowns when clicking outside (consolidated handler)
  const dropdowns = [
    { dropdown: historyDropdown, button: historyButton },
    { dropdown: bookmarkDropdown, button: bookmarkButton },
    { dropdown: tocDropdown, button: hamburgerButton },
  ];
  document.addEventListener('click', createDropdownCloseHandler(dropdowns));

  // Open/close functions
  const openOverlay = async (skipHashUpdate = false) => {
    // Fetch and display markdown
    try {
      contentArea.innerHTML = '<div class="ipynb-loading">Loading markdown...</div>';

      // Fetch from GitHub raw URL (single source of truth from repo metadata)
      // Local dev server will proxy to production or serve local file if available
      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.status}`);
      }
      const markdownText = await response.text();

      // Extract current file path AND repo URL from GitHub URL for relative link resolution
      // GitHub URL format: https://github.com/user/repo/blob/branch/path/to/file.md
      let currentFilePath = null;
      let currentRepoUrl = helpRepoUrl; // Default to help repo as fallback

      if (githubUrl.includes('/blob/')) {
        // Extract file path
        const pathMatch = githubUrl.match(/\/blob\/[^/]+\/(.+)$/);
        if (pathMatch) {
          [, currentFilePath] = pathMatch; // Extract path after /blob/branch/
        }

        // Extract repo URL (everything before /blob/)
        const repoMatch = githubUrl.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/blob\//);
        if (repoMatch) {
          [, currentRepoUrl] = repoMatch; // Extract https://github.com/user/repo
        }
      } else {
        console.warn('⚠️  GitHub URL does not contain /blob/, cannot extract path:', githubUrl);
      }

      // Update browser URL hash to reflect current markdown file (for AI agent visibility)
      // Skip hash update if explicitly requested (e.g., home button wants to clear hash)
      if (!skipHashUpdate && currentFilePath) {
        const newHash = `#${currentFilePath}`;
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      }

      // Render markdown with CURRENT repo URL (not help repo!) to generate smart links
      let renderedHTML = parseMarkdown(markdownText, currentRepoUrl, branch, currentFilePath);

      // Inline SVG illustrations
      renderedHTML = await inlineSVGIllustrations(renderedHTML);

      // CRITICAL FIX: Extract code block content BEFORE innerHTML parsing
      // Store original code content with newlines preserved
      const codeBlockContents = [];
      const codeBlockPattern = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g;

      // Replace code blocks with unique, simple placeholders that won't confuse the browser parser
      // We use a div with display:none to ensure it's treated as a block element but hidden
      let placeholderIndex = 0;
      renderedHTML = renderedHTML.replace(codeBlockPattern, (match, codeContent) => {
        // Decode HTML entities to get the raw source code
        const decodedText = codeContent
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        codeBlockContents.push(decodedText);
        const placeholder = `<div id="ipynb-code-placeholder-${placeholderIndex}" style="display:none;"></div>`;
        placeholderIndex += 1;
        return placeholder;
      });

      // Now set the HTML (browser may normalize whitespace and insert <p> tags in regular text)
      // But our placeholders are simple divs, so they should be safe
      contentArea.innerHTML = renderedHTML;

      // Post-process: Replace placeholders with manually constructed code blocks
      // This bypasses innerHTML whitespace normalization for the code content
      console.log(`[RESTORE] Manually constructing ${codeBlockContents.length} code blocks`);

      codeBlockContents.forEach((content, index) => {
        const placeholder = contentArea.querySelector(`#ipynb-code-placeholder-${index}`);
        if (placeholder) {
          // Create the structure: <pre><code class="language-xyz">content</code></pre>
          const pre = document.createElement('pre');
          const code = document.createElement('code');

          // Try to determine language from the original match if possible, or default to plaintext
          // For now we'll rely on the class being set by specific language detection if we had it,
          // but since we're reconstructing, we'll default to plaintext or specific class if we extracted it.
          // Note: The original regex didn't capture the class, so we might lose syntax highlighting class
          // if we don't improve the extraction. However, the priority is structure.
          // To improve: we could adjust regex to capture class.
          // But for this fix, we prioritize the content structure.
          code.className = 'language-plaintext';

          // CRITICAL: Use textContent to preserve ALL newlines and whitespace
          code.textContent = content;

          pre.appendChild(code);

          // Replace placeholder with actual code block
          placeholder.parentNode.replaceChild(pre, placeholder);
          console.log(`[CODE BLOCK ${index}] Restored ${content.split('\n').length} lines`);
        } else {
          console.warn(`[RESTORE] Placeholder ${index} not found in DOM`);
        }
      });

      // Process smart links in the rendered markdown
      // 1. Resolve hash links (internal navigation)
      const hashLinks = contentArea.querySelectorAll('a[href^="#"]');
      hashLinks.forEach((link) => {
        const linkText = link.textContent.trim();
        const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headings.forEach((heading) => {
          const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
          const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

          if (headingText.includes(searchText)) {
            // Generate ID if not present
            if (!heading.id) {
              heading.id = headingText.replace(/\s+/g, '-');
            }
            // Update link to point to heading
            link.href = `#${heading.id}`;
          }
        });

        // Add click handler for smooth scrolling
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').replace('#', '');
          if (targetId) { // Only try to scroll if there's an actual target ID
            const target = contentArea.querySelector(`#${targetId}`);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });

      // 2. Add click handlers for GitHub markdown links (.md files)
      const githubMdLinks = contentArea.querySelectorAll('.ipynb-github-md-link');
      githubMdLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const linkUrl = link.dataset.mdUrl; // Get URL from data attribute
          const linkBranch = link.dataset.branch || branch; // Get branch from link or use default
          const linkTitle = link.textContent || 'GitHub Markdown';
          const nestedOverlay = createGitHubMarkdownOverlay(linkUrl, linkTitle, helpRepoUrl, linkBranch, parentHistory, false, config);
          nestedOverlay.openOverlay();
        });
      });

      // 3. Scan for new markdown smart links and add to navigation tree
      const newMarkdownPaths = extractMarkdownPathsFromElement(contentArea);
      if (newMarkdownPaths.length > 0) {
        // Check if parentHistory is a context object with tree references
        if (parentHistory && typeof parentHistory === 'object' && parentHistory.navigationTree) {
          addMarkdownPathsToTree(parentHistory.navigationTree, newMarkdownPaths);
          // Note: Don't re-render parent's tree here - it will be rendered in this overlay's tree
        }
      }

      // 4. Render navigation tree in this overlay (if we have tree context from parent)

      if (parentHistory && typeof parentHistory === 'object' && parentHistory.navigationTree) {
        // Store tree reference in treeState if not already present (required for toggleTreeNode function)
        if (!treeState.tree) {
          treeState.tree = parentHistory.navigationTree;
        }

        // Use parent's tree click handler if available (handles both cell and markdown nodes)
        // Otherwise create a simple markdown-only handler
        let handleTreeNodeClick;

        if (parentHistory.handleTreeNodeClick && typeof parentHistory.handleTreeNodeClick === 'function') {
          // Use parent's handler - it knows how to navigate to both cells and markdown
          handleTreeNodeClick = parentHistory.handleTreeNodeClick;
        } else {
          // Fallback: create handler that handles all node types
          handleTreeNodeClick = (node) => {
            // For cell/part nodes: close overlay (user expects to see notebook)
            if (node.type === 'cell' || node.type === 'part') {
              closeOverlay();
              // Note: The parent paged overlay will handle the navigation
              // The tree state is shared, so the selection will be visible
              return;
            }

            // For markdown nodes: navigate to that markdown file
            if (node.type === 'markdown' && node.path) {
              const mdRepoUrl = helpRepoUrl || 'https://github.com/ddttom/allaboutV2';
              const fullUrl = `${mdRepoUrl}/blob/${branch}/${node.path}`;

              // Close current overlay and open new one
              closeOverlay();
              const newOverlay = createGitHubMarkdownOverlay(fullUrl, node.label, helpRepoUrl, branch, parentHistory, false, config);
              newOverlay.openOverlay();

              // Select this node in tree
              selectTreeNode(node.id, treeState, navTreePanel, handleTreeNodeClick);
            }

            // For root/folder nodes: do nothing (just expand/collapse via icon)
          };
        }

        // Render the tree in THIS overlay's tree panel
        renderNavigationTree(parentHistory.navigationTree, navTreePanel, treeState, handleTreeNodeClick);
      } else {
        console.warn('⚠️  No tree context available for GitHub overlay');
      }

      // Add to history (use parent overlay's history if available)
      if (parentHistory) {
        const historyArray = parentHistory.historyArray || parentHistory; // Support both context object and direct array
        if (Array.isArray(historyArray)) {
          addToHistory(historyArray, title, 'markdown', null, githubUrl);
        }
      }

      // Show overlay
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    } catch (error) {
      console.error('Failed to load markdown:', error);
      contentArea.innerHTML = `<div class="ipynb-error">Failed to load markdown from GitHub: ${error.message}<br><br>URL: ${rawUrl}</div>`;
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closeOverlay = () => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Create home button now that closeOverlay is defined
  homeButton = createHomeButton({
    context: 'github',
    ariaLabel: hasParentNotebook ? 'Return to notebook' : 'Go to first page',
    onClick: async () => {
      // eslint-disable-next-line no-console
      console.log('[GITHUB HOME] Button clicked');
      // eslint-disable-next-line no-console
      console.log('[GITHUB HOME] hasParentNotebook:', hasParentNotebook);
      // eslint-disable-next-line no-console
      console.log('[GITHUB HOME] parentHistory:', parentHistory);

      if (hasParentNotebook) {
        // Show splash screen if configured (from parent notebook)
        // parentHistory may be paginationState object with splashUrl property

        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] parentHistory type:', typeof parentHistory);
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] parentHistory keys:', Object.keys(parentHistory || {}));
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] parentHistory FULL OBJECT:', JSON.stringify(parentHistory, null, 2));
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] parentHistory.splashUrl:', parentHistory?.splashUrl);
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] parentHistory.splashDuration:', parentHistory?.splashDuration);

        const splashUrl = parentHistory?.splashUrl;
        const splashDuration = parentHistory?.splashDuration || 4000;

        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] Extracted splashUrl:', splashUrl);
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] Extracted splashDuration:', splashDuration);

        if (splashUrl) {
          // eslint-disable-next-line no-console
          console.log('[GITHUB HOME] Showing splash screen for', splashDuration, 'ms...');
          // Wait for splash to complete (it auto-dismisses after duration)
          await showSplashScreen(splashUrl, splashDuration);
          // eslint-disable-next-line no-console
          console.log('[GITHUB HOME] Splash screen completed');
        } else {
          // eslint-disable-next-line no-console
          console.log('[GITHUB HOME] No splash URL configured, skipping splash');
        }

        // We were opened from a notebook - close this overlay to return to notebook
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] Returning to parent notebook, closing overlay...');
        closeOverlay();
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] Overlay closed');
      } else {
        // We're a standalone markdown viewer - scroll to top
        // eslint-disable-next-line no-console
        console.log('[GITHUB HOME] Scrolling to top (already home)');
        contentArea.scrollTop = 0;
      }
    },
  });

  // Add home button to left controls (prepend before tree toggle)
  leftControlsSection.insertBefore(homeButton, treeToggleButton);
  // eslint-disable-next-line no-console
  console.log('[HOME BUTTON] Appended to DOM, parent:', homeButton.parentElement);

  // Tree toggle button handler
  treeToggleButton.addEventListener('click', createTreeToggleHandler(navTreePanel, treeToggleButton));

  // Close button handler
  closeButton.addEventListener('click', closeOverlay);

  // Close on overlay click (but not content click)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // Escape key handler
  const keyHandler = (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeOverlay();
    }
  };

  document.addEventListener('keydown', keyHandler);

  // Append overlay to body
  document.body.appendChild(overlay);

  return {
    openOverlay,
    closeOverlay,
  };
}

/**
 * Check for hash in URL and navigate to that markdown file if present
 * @param {string} repoUrl - Repository URL
 * @param {string} helpRepoUrl - Help repository URL
 * @param {string} branch - GitHub branch
 * @param {Object} pagedOverlay - The paged overlay object with navigation methods
 * @param {Object} metadata - Notebook metadata (may contain opening-page)
 * @param {Object} config - Configuration object (injected dependency)
 */
function checkHashNavigation(repoUrl, helpRepoUrl, branch, pagedOverlay, metadata = {}, config = null) {
  const { hash } = window.location;
  let targetPath = null;

  // Check URL hash first (takes precedence)
  if (hash && hash !== '#') {
    targetPath = hash.substring(1);
  } else if (metadata['opening-page']) {
    // Fallback to opening-page metadata if no URL hash
    targetPath = metadata['opening-page'].replace(/^#/, ''); // Remove leading # if present
  } else {
    return;
  }

  // Check if it's a markdown file path (ends with .md)
  if (targetPath.endsWith('.md')) {
    // Build full GitHub URL
    const fullUrl = `${repoUrl}/blob/${branch}/${targetPath}`;
    const title = targetPath.split('/').pop().replace('.md', '').replace(/-/g, ' ');

    // Open markdown overlay with a slight delay to ensure paged overlay is ready
    setTimeout(() => {
      const mdOverlay = createGitHubMarkdownOverlay(
        fullUrl,
        title,
        helpRepoUrl,
        branch,
        pagedOverlay.paginationState,
        false,
        config,
      );
      mdOverlay.openOverlay();
    }, 200);
  }
  // No else needed - only handle .md links
}

/**
 * Decorate the ipynb-viewer block
 * @param {HTMLElement} block - Block element
 */
export default async function decorate(block) {
  // Configuration
  const config = {
    // Messages
    errorMessage: 'Failed to load notebook',
    loadingMessage: 'Loading notebook...',

    // Splash Screen
    defaultSplashDuration: 4000, // Default splash screen duration in milliseconds
    splashFadeTransition: 300, // Fade in/out transition duration in milliseconds
    splashFadeBuffer: 50, // Extra buffer time after fade (ms)

    // History & Navigation
    maxHistoryEntries: 25, // Maximum number of history entries to keep

    // Code Cells
    maxCodeGroupSize: 3, // Maximum number of consecutive code cells to group in paged mode

    // SVG Inlining
    svgFetchTimeout: 10000, // SVG fetch timeout in milliseconds (10 seconds)
    svgPathPattern: /\/illustrations\/[^/]+\.svg$/i, // Pattern to match SVG illustration paths

    // Help System
    fallbackHelpRepo: 'https://github.com/ddttom/allaboutv2',
    fallbackHelpBranch: 'main',
    fallbackHelpPath: 'docs/help.md',
    helpOverlayTitle: 'IPynb Viewer Help',

    // UI Icons (HTML entities)
    icons: {
      close: '&times;', // × close button
      arrowRight: '&#9654;', // ► right arrow
      arrowLeft: '&#9664;', // ◄ left arrow
      clock: '&#128337;', // 🕘 clock/history icon
      hamburger: '&#9776;', // ☰ hamburger menu
      bookmark: '&#128278;', // 🔖 bookmark icon
      questionMark: '&#10067;', // ❓ question mark icon
    },

    // UI Text
    text: {
      runButton: 'Run',
      noHistoryMessage: 'No history yet',
      noBookmarksMessage: 'No bookmarks yet',
      clearAllBookmarks: 'Clear All Bookmarks',
      addBookmark: '+ Bookmark This Page',
    },
  };

  // Detect variations
  const isPaged = block.classList.contains('paged');
  const isAutorun = block.classList.contains('autorun');
  const isNotebook = block.classList.contains('notebook'); // Combines manual and paged (no autorun), close button visible
  const isIndex = block.classList.contains('index'); // Auto-opens overlay without button click
  const isNoTopbar = block.classList.contains('no-topbar'); // Hides the top bar (buttons and title)

  try {
    // Extract notebook path from block content
    const rows = Array.from(block.children);
    if (rows.length === 0) {
      throw new Error('No notebook path provided');
    }

    // First cell should contain the notebook path
    const firstCell = rows[0].children[0];
    let notebookPath = firstCell.textContent.trim();

    // Check if it's a link
    const link = firstCell.querySelector('a');
    if (link) {
      notebookPath = link.href;
    }

    // Show loading state
    block.innerHTML = `<div class="ipynb-loading">${config.loadingMessage}</div>`;

    // Load notebook
    const notebook = await loadNotebook(notebookPath);

    // Set repo attribute if available in metadata
    if (notebook.metadata?.repo) {
      block.setAttribute('data-repo', notebook.metadata.repo);
    }

    // Set github-branch attribute if available in metadata (defaults to 'main')
    const githubBranch = notebook.metadata?.['github-branch'] || 'main';
    block.setAttribute('data-github-branch', githubBranch);

    // Set splash-page attribute if available in metadata
    const splashPageUrl = notebook.metadata?.['splash-page'] || null;
    if (splashPageUrl) {
      block.setAttribute('data-splash-page', splashPageUrl);
    }

    // Get splash duration from metadata (in seconds), convert to milliseconds
    // Falls back to config.defaultSplashDuration if not specified
    const splashDurationSeconds = notebook.metadata?.['splash-duration'];
    const splashDuration = splashDurationSeconds
      ? splashDurationSeconds * 1000
      : config.defaultSplashDuration;

    // Set help-repo attribute if available in metadata
    // Falls back to repo, then to allaboutV2 default
    if (notebook.metadata?.['help-repo']) {
      block.setAttribute('data-help-repo', notebook.metadata['help-repo']);
    } else if (notebook.metadata?.repo) {
      block.setAttribute('data-help-repo', notebook.metadata.repo);
    } else {
      block.setAttribute('data-help-repo', 'https://github.com/ddttom/allaboutV2');
    }

    // Clear block
    block.textContent = '';

    // Create container
    const container = document.createElement('div');
    container.className = 'ipynb-viewer-container';

    // Create header
    const header = document.createElement('div');
    header.className = 'ipynb-viewer-header';

    const title = document.createElement('h2');
    title.className = 'ipynb-viewer-title';
    title.textContent = notebook.metadata?.title || 'Jupyter Notebook';

    header.appendChild(title);

    // Add description if available
    if (notebook.metadata?.description) {
      const description = document.createElement('div');
      description.className = 'ipynb-viewer-description';
      description.textContent = notebook.metadata.description;
      header.appendChild(description);
    }

    // Add author if available
    if (notebook.metadata?.author) {
      const author = document.createElement('div');
      author.className = 'ipynb-viewer-author';
      author.textContent = `By ${notebook.metadata.author}`;
      header.appendChild(author);
    }

    // Add creation date if available (supports both 'creation-date' and 'date' for backward compatibility)
    const creationDate = notebook.metadata?.['creation-date'] || notebook.metadata?.date;
    if (creationDate) {
      const date = document.createElement('div');
      date.className = 'ipynb-viewer-creation-date';
      date.textContent = `Created: ${creationDate}`;
      header.appendChild(date);
    }

    // Add version if available
    if (notebook.metadata?.version) {
      const version = document.createElement('div');
      version.className = 'ipynb-viewer-version';
      version.textContent = `Version ${notebook.metadata.version}`;
      header.appendChild(version);
    }

    // Add last-modified if available
    if (notebook.metadata?.['last-modified']) {
      const lastModified = document.createElement('div');
      lastModified.className = 'ipynb-viewer-last-modified';
      lastModified.textContent = `Last modified: ${notebook.metadata['last-modified']}`;
      header.appendChild(lastModified);
    }

    // Create metadata row for category, difficulty, duration
    const metaRow = document.createElement('div');
    metaRow.className = 'ipynb-viewer-meta-row';
    let hasMetaRow = false;

    if (notebook.metadata?.category) {
      const category = document.createElement('span');
      category.className = 'ipynb-viewer-category';
      category.textContent = notebook.metadata.category;
      metaRow.appendChild(category);
      hasMetaRow = true;
    }

    if (notebook.metadata?.difficulty) {
      const difficulty = document.createElement('span');
      difficulty.className = 'ipynb-viewer-difficulty';
      difficulty.textContent = notebook.metadata.difficulty;
      metaRow.appendChild(difficulty);
      hasMetaRow = true;
    }

    if (notebook.metadata?.duration) {
      const duration = document.createElement('span');
      duration.className = 'ipynb-viewer-duration';
      duration.textContent = notebook.metadata.duration;
      metaRow.appendChild(duration);
      hasMetaRow = true;
    }

    if (hasMetaRow) {
      header.appendChild(metaRow);
    }

    // Add tags if available
    if (notebook.metadata?.tags && Array.isArray(notebook.metadata.tags) && notebook.metadata.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'ipynb-viewer-tags';

      notebook.metadata.tags.forEach((tag) => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'ipynb-viewer-tag';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });

      header.appendChild(tagsContainer);
    }

    // Add license if available
    if (notebook.metadata?.license) {
      const license = document.createElement('div');
      license.className = 'ipynb-viewer-license';
      license.textContent = `License: ${notebook.metadata.license}`;
      header.appendChild(license);
    }

    // Create cells container
    const cellsContainer = document.createElement('div');
    cellsContainer.className = 'ipynb-cells-container';

    // Process cells
    if (!notebook.cells || notebook.cells.length === 0) {
      throw new Error('Notebook has no cells');
    }

    // Determine if autorun should be enabled
    // Notebook mode no longer autoruns - user must manually run cells
    const shouldAutorun = isAutorun;

    // Extract repo URL from metadata for linking .md files
    const repoUrl = notebook.metadata?.repo || null;

    // Note: githubBranch already extracted above at line 2282

    // Extract help-repo URL from metadata for help button
    // Falls back to repo, then to allaboutV2 default
    const helpRepoUrl = notebook.metadata?.['help-repo']
                        || notebook.metadata?.repo
                        || 'https://github.com/ddttom/allaboutV2';

    // Create splash context for markdown cells (needed for GitHub overlay home button)
    const splashContext = splashPageUrl ? {
      splashUrl: splashPageUrl,
      splashDuration,
      navigationTree: true, // Marker to indicate this came from a notebook
    } : null;

    // eslint-disable-next-line no-console
    console.log('[DECORATE] splashPageUrl:', splashPageUrl);
    // eslint-disable-next-line no-console
    console.log('[DECORATE] splashDuration:', splashDuration);
    // eslint-disable-next-line no-console
    console.log('[DECORATE] splashContext:', JSON.stringify(splashContext, null, 2));

    // Process cells sequentially to ensure proper rendering order
    for (let index = 0; index < notebook.cells.length; index += 1) {
      const cell = notebook.cells[index];
      let cellElement;

      if (cell.cell_type === 'markdown') {
        // eslint-disable-next-line no-await-in-loop
        cellElement = await createMarkdownCell(cell, index, repoUrl, isNotebook, helpRepoUrl, githubBranch, splashContext, config);
      } else if (cell.cell_type === 'code') {
        cellElement = createCodeCell(cell, index, shouldAutorun);

        // Add click handler for run button (if not autorun)
        if (!shouldAutorun) {
          const runButton = cellElement.querySelector('.ipynb-run-button');
          if (runButton) {
            runButton.addEventListener('click', () => {
              executeCodeCell(cellElement);
            });
          }
        } else if (!isPaged && !isNotebook) {
          // In autorun mode, execute immediately in default view
          // eslint-disable-next-line no-await-in-loop
          await executeCodeCell(cellElement);
        }
      }

      if (cellElement) {
        cellsContainer.appendChild(cellElement);
      }
    }

    // Assemble container
    container.appendChild(header);

    // Handle paged, autorun, notebook, and index variations
    if (isPaged || isNotebook || isIndex) {
      // Hide cells initially in paged mode
      cellsContainer.style.display = 'none';
      container.appendChild(cellsContainer);

      // Create overlay with autorun support and notebook mode flag
      const notebookTitle = notebook.metadata?.title || 'Jupyter Notebook';
      const overlay = createPagedOverlay(container, cellsContainer, shouldAutorun, isNotebook, repoUrl, notebookTitle, helpRepoUrl, githubBranch, isNoTopbar, notebook, config, splashDuration);

      // Index variation: Auto-open overlay without button
      if (isIndex) {
        // Auto-open after a brief delay to ensure DOM is ready
        setTimeout(() => {
          overlay.openOverlay();
          // Check for hash navigation after overlay opens
          checkHashNavigation(repoUrl, helpRepoUrl, githubBranch, overlay, notebook.metadata, config);
        }, 100);
      } else {
        // Regular notebook/paged: Show start button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'ipynb-button-container';

        // Create start button
        const startButton = createPagedStartButton();
        buttonContainer.appendChild(startButton);

        // Start button opens overlay
        startButton.addEventListener('click', () => {
          overlay.openOverlay();
          // Check for hash navigation after overlay opens
          setTimeout(() => {
            checkHashNavigation(repoUrl, helpRepoUrl, githubBranch, overlay, notebook.metadata, config);
          }, 100);
        });

        container.appendChild(buttonContainer);
      }
    } else {
      // Default mode: show all cells
      container.appendChild(cellsContainer);
    }

    block.appendChild(container);

    // Show splash screen if splash-page metadata exists
    // Uses duration from metadata (splash-duration) or config default (auto-dismisses)
    if (splashPageUrl) {
      showSplashScreen(splashPageUrl, splashDuration);
    }
  } catch (error) {
    console.error('Block decoration failed:', error);
    block.innerHTML = `<div class="ipynb-error">${config.errorMessage}: ${error.message}</div>`;
  }
}
