/**
 * Markdown Content Renderer
 * Fetches and renders markdown files from GitHub
 */

function convertToRawUrl(blobUrl) {
  if (blobUrl.startsWith('/')) return blobUrl;
  return blobUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
}

/**
 * Parse markdown to HTML
 * Comprehensive markdown parser matching the main ipynb-viewer implementation
 * @param {string} markdown - Raw markdown text
 * @param {string} repoUrl - Repository URL for resolving relative links
 * @param {string} branch - GitHub branch
 * @param {string} currentFilePath - Current file path for resolving relative paths
 * @returns {string} HTML string
 */
function markdownToHtml(markdown, repoUrl = null, branch = 'main', currentFilePath = null) {
  let html = markdown;

  // Filter out LaTeX commands and attributes (lines starting with \ or containing {.attribute})
  html = html.split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      // Remove lines that start with a LaTeX command
      if (/^\\[a-zA-Z]+/.test(trimmed)) return false;
      // Remove lines that are ONLY LaTeX/Pandoc class attributes
      if (/^\{\.[a-zA-Z.\s]+\}$/.test(trimmed)) return false;
      return true;
    })
    .join('\n');

  // Code blocks - MUST be processed first
  const codeBlockPlaceholders = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    codeBlockPlaceholders.push(`<pre><code class="language-${lang || 'plaintext'}">${escapedCode}</code></pre>`);
    return placeholder;
  });

  // Extract inline code and protect it
  const inlineCodePlaceholders = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
    inlineCodePlaceholders.push(code);
    return placeholder;
  });

  // Handle escaped HTML characters
  html = html.replace(/\\</g, '&lt;');
  html = html.replace(/\\>/g, '&gt;');
  html = html.replace(/\\:/g, ':');

  // Convert angle-bracket URLs to markdown links
  html = html.replace(/<(https?:\/\/[^>]+)>/g, (match, url) => `[${url}](${url})`);

  // Escape remaining HTML tags
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');

  // Tables - must be before line breaks
  const lines = html.split('\n');
  const processedLines = [];
  let inTable = false;
  let tableRows = [];
  let tableRowCount = 0;

  const createTableRow = (tableCells, isFirstRow) => {
    const tag = isFirstRow ? 'th' : 'td';
    return `<tr>${tableCells.map((cell) => `<${tag}>${cell.trim()}</${tag}>`).join('')}</tr>`;
  };

  lines.forEach((line) => {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) return;
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
      if (inTable) {
        processedLines.push(`<table>${tableRows.join('')}</table>`);
        tableRows = [];
        tableRowCount = 0;
        inTable = false;
      }
      processedLines.push(line);
    }
  });

  if (inTable && tableRows.length > 0) {
    processedLines.push(`<table>${tableRows.join('')}</table>`);
  }

  html = processedLines.join('\n');

  // Headers - Add IDs to h2 headers for navigation
  // Also strip Pandoc/LaTeX class attributes like {.unnumbered .unlisted}
  html = html.replace(/^###### (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, (match, text) => {
    const cleanText = text.trim();
    const id = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').replace(/^-+|-+$/g, '').trim();
    return `<h2 id="${id}">${cleanText}</h2>`;
  });
  html = html.replace(/^# (.*?)(\s*\{\.[\w\s.-]+\})?\s*$/gim, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^(?:[-*_]\s*){3,}$/gim, '<hr>');

  // Images - process BEFORE links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    let processedUrl = url;
    if (url.match(/illustrations\/.*\.png$/i)) {
      processedUrl = url.replace(/\.png$/i, '.svg');
    }

    if (repoUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      let imagePath = processedUrl;
      if (currentFilePath && !processedUrl.startsWith('/')) {
        const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
        const parts = currentDir ? currentDir.split('/') : [];
        const urlParts = processedUrl.replace(/^\.\//, '').split('/');
        urlParts.forEach((part) => {
          if (part === '..') {
            if (parts.length > 0) parts.pop();
          } else if (part !== '.' && part !== '') {
            parts.push(part);
          }
        });
        imagePath = parts.join('/');
      } else if (processedUrl.startsWith('/')) {
        imagePath = processedUrl.replace(/^\//, '');
      }
      const rawUrl = `${repoUrl.replace('github.com', 'raw.githubusercontent.com')}/${branch}/${imagePath}`;
      return `<img src="${rawUrl}" alt="${alt}" class="ipynb-markdown-image" loading="lazy">`;
    }
    return `<img src="${processedUrl}" alt="${alt}" class="ipynb-markdown-image" loading="lazy">`;
  });

  // Links - convert .md files to repo URLs
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    let processedUrl = url;
    if (url.match(/illustrations\/.*\.png$/i)) {
      processedUrl = url.replace(/\.png$/i, '.svg');
    }

    // Check if it's a .md file and we have a repo URL
    if (repoUrl && processedUrl.endsWith('.md') && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      let cleanPath = processedUrl;
      if (currentFilePath && !processedUrl.startsWith('/') && !processedUrl.startsWith('http')) {
        const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
        const parts = currentDir ? currentDir.split('/') : [];
        const urlParts = processedUrl.replace(/^\.\//, '').split('/');
        urlParts.forEach((part) => {
          if (part === '..') {
            if (parts.length > 0) parts.pop();
          } else if (part !== '.' && part !== '') {
            parts.push(part);
          }
        });
        cleanPath = parts.join('/');
      } else if (processedUrl.startsWith('/')) {
        cleanPath = processedUrl.replace(/^\//, '');
      } else {
        cleanPath = processedUrl.replace(/^\.?\//, '');
      }
      const fullUrl = `${repoUrl}/blob/${branch}/${cleanPath}`;
      return `<a href="#" class="ipynb-github-md-link" data-md-url="${fullUrl}" data-md-path="${cleanPath}" data-repo="${repoUrl}" data-branch="${branch}">${text}</a>`;
    }

    // External links
    if (processedUrl.startsWith('http://') || processedUrl.startsWith('https://')) {
      return `<a href="${processedUrl}" class="ipynb-external-link" title="Open in new tab: ${processedUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }

    // Hash links
    if (processedUrl.startsWith('#')) {
      return `<a href="${processedUrl}">${text}</a>`;
    }

    // Other file types
    return `<span class="ipynb-non-md-link" title="${processedUrl}">${text} <code>(${processedUrl})</code></span>`;
  });

  // Lists - with nested list support
  const linesWithLists = html.split('\n');
  const processedWithLists = [];
  const listStack = [];
  let lastIndent = -1;

  linesWithLists.forEach((line) => {
    const ulMatch = line.match(/^(\s*)[-*] (.+)$/);
    const olMatch = line.match(/^(\s*)\d+\. (.+)$/);

    if (ulMatch || olMatch) {
      const isUl = !!ulMatch;
      const indent = (ulMatch ? ulMatch[1] : olMatch[1]).length;
      const content = ulMatch ? ulMatch[2] : olMatch[2];
      const listType = isUl ? 'ul' : 'ol';

      if (indent > lastIndent) {
        if (listStack.length > 0) {
          const lastItem = processedWithLists[processedWithLists.length - 1];
          if (lastItem && lastItem.endsWith('</li>')) {
            processedWithLists[processedWithLists.length - 1] = lastItem.slice(0, -5);
          }
        }
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      } else if (indent < lastIndent) {
        while (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
          const closed = listStack.pop();
          processedWithLists.push(`</${closed.type}>`);
          if (listStack.length > 0) processedWithLists.push('</li>');
        }
        if (listStack.length === 0 || listStack[listStack.length - 1].type !== listType) {
          if (listStack.length > 0) {
            const closed = listStack.pop();
            processedWithLists.push(`</${closed.type}>`);
          }
          processedWithLists.push(`<${listType}>`);
          listStack.push({ type: listType, indent });
        }
      } else if (listStack.length > 0 && listStack[listStack.length - 1].type !== listType) {
        const closed = listStack.pop();
        processedWithLists.push(`</${closed.type}>`);
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      } else if (listStack.length === 0) {
        processedWithLists.push(`<${listType}>`);
        listStack.push({ type: listType, indent });
      }

      processedWithLists.push(`<li>${content}</li>`);
      lastIndent = indent;
    } else {
      while (listStack.length > 0) {
        const closed = listStack.pop();
        processedWithLists.push(`</${closed.type}>`);
      }
      processedWithLists.push(line);
      lastIndent = -1;
    }
  });

  while (listStack.length > 0) {
    const closed = listStack.pop();
    processedWithLists.push(`</${closed.type}>`);
  }

  html = processedWithLists.join('\n');

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  const linesWithBlockquotes = html.split('\n');
  const processedWithBlockquotes = [];
  let inBlockquote = false;

  linesWithBlockquotes.forEach((line) => {
    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      if (!inBlockquote) {
        processedWithBlockquotes.push('<blockquote>');
        inBlockquote = true;
      }
      processedWithBlockquotes.push(blockquoteMatch[1]);
    } else {
      if (inBlockquote) {
        processedWithBlockquotes.push('</blockquote>');
        inBlockquote = false;
      }
      processedWithBlockquotes.push(line);
    }
  });

  if (inBlockquote) processedWithBlockquotes.push('</blockquote>');
  html = processedWithBlockquotes.join('\n');

  // Paragraphs
  const paragraphs = html.split(/\n\n+/);
  const blockElementPattern = /^<(h[1-6]|table|ul|ol|blockquote|pre|hr)|__CODEBLOCK_/;
  const preBlockPattern = /^<pre/;

  html = paragraphs
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (blockElementPattern.test(trimmed)) {
        if (preBlockPattern.test(trimmed)) return trimmed;
        return trimmed.replace(/\n/g, ' ');
      }
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .filter((p) => p)
    .join('\n\n');

  // Restore code blocks
  codeBlockPlaceholders.forEach((codeBlock, index) => {
    html = html.replace(`__CODEBLOCK_${index}__`, codeBlock);
  });

  // Restore inline code
  inlineCodePlaceholders.forEach((code, index) => {
    const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    html = html.replace(`__INLINECODE_${index}__`, `<code>${escapedCode}</code>`);
  });

  return html;
}

export async function renderMarkdownContent(contentArea, {
  markdownUrl,
  title,
  repoUrl,
  branch,
  navigationState,
  config,
  onLinkClick,
}) {
  contentArea.innerHTML = '';
  // Keep existing class name - don't override
  contentArea.classList.add('ipynb-markdown-view');

  const loading = document.createElement('div');
  loading.className = 'ipynb-loading';
  loading.textContent = config.messages.loadingMarkdown;
  contentArea.appendChild(loading);

  try {
    const rawUrl = convertToRawUrl(markdownUrl);
    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error(`${config.messages.failedToLoadMarkdown}: ${response.status}`);

    const markdownText = await response.text();

    // Extract current file path from markdownUrl for relative path resolution
    let currentFilePath = null;
    const pathMatch = markdownUrl.match(/\/blob\/[^/]+\/(.+)$/);
    if (pathMatch) {
      [, currentFilePath] = pathMatch;
    }

    const html = markdownToHtml(markdownText, repoUrl, branch, currentFilePath);

    contentArea.innerHTML = '';
    const markdownContainer = document.createElement('div');
    markdownContainer.className = 'ipynb-markdown-content';
    markdownContainer.innerHTML = html;
    contentArea.appendChild(markdownContainer);

    // Process links
    // 1. GitHub markdown links (.md files) - these have special data attributes
    const githubMdLinks = markdownContainer.querySelectorAll('.ipynb-github-md-link');
    githubMdLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkUrl = link.dataset.mdUrl;
        const linkTitle = link.textContent || 'Markdown';
        if (onLinkClick && linkUrl) {
          onLinkClick({ type: 'markdown', url: linkUrl, title: linkTitle });
        }
      });
    });

    // 2. Hash links (internal navigation to headings)
    const hashLinks = markdownContainer.querySelectorAll('a[href^="#"]');
    hashLinks.forEach((link) => {
      const linkText = link.textContent.trim();
      const headings = markdownContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach((heading) => {
        const headingText = heading.textContent.trim().replace(/[^\w\s]/g, '').toLowerCase();
        const searchText = linkText.replace(/[^\w\s]/g, '').toLowerCase();

        if (headingText.includes(searchText)) {
          if (!heading.id) {
            heading.id = headingText.replace(/\s+/g, '-');
          }
          link.href = `#${heading.id}`;
        }
      });

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        if (targetId) {
          const target = markdownContainer.querySelector(`#${targetId}`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // 3. External links (already have target="_blank" from parser)
    // No additional processing needed - the parser handles this

    // Add heading IDs
    markdownContainer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent.toLowerCase().trim()
          .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      }
    });

    // Scroll to hash anchor if present in URL, or to top if no hash
    const hashMatch = markdownUrl.match(/#(.+)$/);
    if (hashMatch) {
      const targetId = hashMatch[1];
      setTimeout(() => {
        const target = markdownContainer.querySelector(`#${targetId}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // No hash = scroll to top (e.g., Home node)
      setTimeout(() => {
        contentArea.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }

    navigationState.updateCurrentData({ markdownUrl, markdownTitle: title, scrollPosition: 0 });

    return {
      scrollTo: (selector) => {
        const target = markdownContainer.querySelector(selector);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      getHeadings: () => Array.from(markdownContainer.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => ({
        level: parseInt(h.tagName[1], 10),
        text: h.textContent.trim(),
        id: h.id,
      })),
      destroy: () => {},
    };
  } catch (error) {
    contentArea.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ipynb-error';
    errorDiv.textContent = `${config.messages.failedToLoadMarkdown}: ${error.message}`;
    contentArea.appendChild(errorDiv);

    return {
      scrollTo: () => {},
      getHeadings: () => [],
      destroy: () => {},
    };
  }
}
