/**
 * Markdown Mode Renderer
 * Renders GitHub markdown files in the unified overlay
 */

/**
 * Render markdown file content
 * @param {Object} overlay - Overlay DOM references
 * @param {Object} state - State object
 * @param {Object} target - Navigation target
 * @param {string} target.identifier - File path (e.g., 'docs/README.md')
 */
async function renderMarkdownContent(overlay, state, target) {
  const { identifier } = target;

  // eslint-disable-next-line no-console
  console.log(`[MARKDOWN RENDERER] Rendering file: ${identifier}`);

  // Show loading indicator
  overlay.contentArea.innerHTML = '<div class="ipynb-loading">Loading markdown...</div>';

  try {
    // Build URL based on identifier
    const url = buildMarkdownUrl(identifier, state);

    // eslint-disable-next-line no-console
    console.log(`[MARKDOWN RENDERER] Fetching from: ${url}`);

    // Fetch markdown content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.status}`);
    }

    const markdownText = await response.text();

    // Parse markdown to HTML (will need to import parseMarkdown from main file)
    const html = parseMarkdownToHTML(markdownText, state);

    // Clear and render
    overlay.contentArea.innerHTML = '';

    const markdownContainer = document.createElement('div');
    markdownContainer.className = 'ipynb-markdown-cell';
    markdownContainer.innerHTML = html;

    overlay.contentArea.appendChild(markdownContainer);

    // Set up smart link handlers
    setupSmartLinks(overlay.contentArea, state);

    // Update tree selection if tree is available
    if (state.tree && state.tree.select) {
      state.tree.select(identifier);
    }

    // Scroll to top
    overlay.contentArea.scrollTop = 0;
  } catch (error) {
    console.error('[MARKDOWN RENDERER] Error:', error);
    overlay.contentArea.innerHTML = `
      <div class="ipynb-error">
        Failed to load markdown: ${error.message}<br><br>
        URL: ${identifier}
      </div>
    `;
  }
}

/**
 * Build markdown URL from identifier and state
 * @param {string} identifier - File path
 * @param {Object} state - State object
 * @returns {string} Full URL to fetch markdown from
 */
function buildMarkdownUrl(identifier, state) {
  const { metadata } = state;

  // If identifier is already a full URL, use it
  if (identifier.startsWith('http://') || identifier.startsWith('https://')) {
    return convertToRawUrl(identifier, metadata.branch);
  }

  // If we have a repo URL in metadata, build GitHub URL
  if (metadata.repo) {
    const branch = metadata.branch || 'main';
    const repoUrl = metadata.repo;
    const fullUrl = `${repoUrl}/blob/${branch}/${identifier}`;
    return convertToRawUrl(fullUrl, branch);
  }

  // Otherwise, treat as local path
  return identifier;
}

/**
 * Convert GitHub blob URL to raw content URL
 * @param {string} blobUrl - GitHub blob URL
 * @param {string} branch - Branch name
 * @returns {string} Raw content URL
 */
function convertToRawUrl(blobUrl, branch = 'main') {
  // If it's a local path (starts with /), return as-is
  if (blobUrl.startsWith('/')) {
    return blobUrl;
  }

  // Convert: https://github.com/user/repo/blob/main/path/file.md
  // To: https://raw.githubusercontent.com/user/repo/main/path/file.md
  return blobUrl
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/');
}

/**
 * Parse markdown to HTML (placeholder - real implementation would use full parser)
 * @param {string} markdown - Markdown text
 * @param {Object} state - State object
 * @returns {string} HTML string
 */
function parseMarkdownToHTML(markdown, state) {
  let html = markdown;

  // Code blocks (triple backticks)
  const codeBlockPlaceholders = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    const escapedCode = code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlockPlaceholders.push(`<pre><code class="language-${lang || 'plaintext'}">${escapedCode}</code></pre>`);
    return placeholder;
  });

  // Inline code
  const inlineCodePlaceholders = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
    inlineCodePlaceholders.push(code);
    return placeholder;
  });

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Check if it's a .md link (smart link)
    if (url.endsWith('.md')) {
      return `<a href="${url}" class="smart-link" data-md-path="${url}">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  });

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Restore code blocks
  codeBlockPlaceholders.forEach((block, index) => {
    html = html.replace(`__CODEBLOCK_${index}__`, block);
  });

  // Restore inline code with entity escaping
  inlineCodePlaceholders.forEach((code, index) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    html = html.replace(`__INLINECODE_${index}__`, `<code>${escapedCode}</code>`);
  });

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

/**
 * Set up smart link handlers for .md links
 * @param {HTMLElement} container - Content container
 * @param {Object} state - State object
 */
function setupSmartLinks(container, state) {
  container.addEventListener('click', (e) => {
    const link = e.target.closest('.smart-link');
    if (!link) return;

    e.preventDefault();

    const mdPath = link.getAttribute('data-md-path');
    if (!mdPath) {
      console.warn('[MARKDOWN RENDERER] Smart link missing data-md-path');
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`[MARKDOWN RENDERER] Smart link clicked: ${mdPath}`);

    // Navigate to markdown file using overlay navigation
    if (state.overlay && state.overlay.navigate) {
      state.overlay.navigate({
        mode: 'markdown',
        type: 'file',
        identifier: mdPath,
        title: mdPath,
      });
    }
  });
}

export default renderMarkdownContent;
