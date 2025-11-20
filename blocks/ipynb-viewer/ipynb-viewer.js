/**
 * IPynb Viewer Block
 * Displays Jupyter notebook (.ipynb) files with interactive JavaScript execution
 */

/**
 * Parse markdown text to HTML (enhanced implementation)
 * @param {string} markdown - Markdown text
 * @param {string} [repoUrl] - Optional repository URL for converting .md links
 * @returns {string} HTML string
 */
function parseMarkdown(markdown, repoUrl = null) {
  let html = markdown;

  // Code blocks (triple backticks) - MUST be processed first before other replacements
  const codeBlockPlaceholders = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    codeBlockPlaceholders.push(`<pre><code class="language-${lang || 'plaintext'}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    return placeholder;
  });

  // Tables - must be before line breaks
  const lines = html.split('\n');
  const processedLines = [];
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line is a table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Skip separator rows (|---|---|)
      if (/^\|[\s\-:]+\|$/.test(line.trim())) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableRows = [];
      }

      const cells = line.split('|').filter(cell => cell.trim());
      const row = '<tr>' + cells.map((cell, idx) => {
        // First row is header
        const tag = tableRows.length === 0 ? 'th' : 'td';
        return `<${tag}>${cell.trim()}</${tag}>`;
      }).join('') + '</tr>';
      tableRows.push(row);
    } else {
      // Not a table row
      if (inTable) {
        // End of table, flush accumulated rows
        processedLines.push('<table>' + tableRows.join('') + '</table>');
        tableRows = [];
        inTable = false;
      }
      processedLines.push(line);
    }
  }

  // Flush any remaining table
  if (inTable && tableRows.length > 0) {
    processedLines.push('<table>' + tableRows.join('') + '</table>');
  }

  html = processedLines.join('\n');

  // Headers (process in order from most specific to least)
  // Add IDs to h2 headers for navigation
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    // Generate ID from text (lowercase, replace spaces with hyphens, remove special chars)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '')   // Remove leading and trailing hyphens
      .trim();

    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold (before italic to handle ** before *)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code inline (before links to avoid conflicts)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links - convert .md files to repo URLs if repo is available
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Check if it's a .md file and we have a repo URL
    if (repoUrl && url.endsWith('.md') && !url.startsWith('http://') && !url.startsWith('https://')) {
      // Remove leading ./ or / from the path
      const cleanPath = url.replace(/^\.?\//, '');
      // Build full repo URL (assuming GitHub blob/main pattern)
      const fullUrl = `${repoUrl}/blob/main/${cleanPath}`;
      return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });

  // Lists - process line by line
  const linesWithLists = html.split('\n');
  const processedWithLists = [];
  let inUl = false;
  let inOl = false;

  for (const line of linesWithLists) {
    const ulMatch = line.match(/^[\s]*[-*] (.+)$/);
    const olMatch = line.match(/^[\s]*\d+\. (.+)$/);

    if (ulMatch) {
      if (!inUl) {
        processedWithLists.push('<ul>');
        inUl = true;
      }
      processedWithLists.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inOl) {
        processedWithLists.push('<ol>');
        inOl = true;
      }
      processedWithLists.push(`<li>${olMatch[1]}</li>`);
    } else {
      // Close any open lists
      if (inUl) {
        processedWithLists.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        processedWithLists.push('</ol>');
        inOl = false;
      }
      processedWithLists.push(line);
    }
  }

  // Close any remaining open lists
  if (inUl) processedWithLists.push('</ul>');
  if (inOl) processedWithLists.push('</ol>');

  html = processedWithLists.join('\n');

  // Restore code blocks
  codeBlockPlaceholders.forEach((codeBlock, index) => {
    html = html.replace(`__CODEBLOCK_${index}__`, codeBlock);
  });

  // Line breaks (convert remaining newlines to <br>)
  html = html.replace(/\n/g, '<br>');

  return html;
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
  const lines = content.trim().split('\n').filter(line => line.trim());
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
 * Create a markdown cell element
 * @param {object} cell - Notebook cell data
 * @param {number} index - Cell index
 * @param {string} [repoUrl] - Optional repository URL for converting .md links
 * @param {boolean} [autoWrap=false] - Whether to auto-wrap with styling classes (notebook mode)
 * @returns {HTMLElement} Cell element
 */
function createMarkdownCell(cell, index, repoUrl = null, autoWrap = false) {
  const cellDiv = document.createElement('div');
  cellDiv.className = 'ipynb-cell ipynb-markdown-cell';
  cellDiv.dataset.cellIndex = index;

  const content = document.createElement('div');
  content.className = 'ipynb-cell-content';

  // Join source lines and parse markdown
  const markdownText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  let html = parseMarkdown(markdownText, repoUrl);

  // Auto-wrap with styling classes if in notebook mode
  if (autoWrap) {
    const cellType = detectCellType(markdownText, index);
    html = wrapMarkdownContent(html, cellType);
  }

  content.innerHTML = html;

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
  const code = cellDiv.dataset.code;
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
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const func = new AsyncFunction(code);
    const result = await func();

    // Restore console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Display logs
    logs.forEach(log => {
      const logDiv = document.createElement('div');
      logDiv.className = `ipynb-output-${log.type}`;
      logDiv.textContent = log.args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
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
    /:\s*$/,                           // Ends with colon
    /below/i,                          // Contains "below"
    /following/i,                      // Contains "following"
    /try running/i,                    // Contains "try running"
    /click run/i,                      // Contains "click run"
    /run the cell/i,                   // Contains "run the cell"
    /let's test/i,                     // Contains "let's test"
    /let's try/i,                      // Contains "let's try"
    /example:/i,                       // Contains "example:"
    /here's how/i,                     // Contains "here's how"
  ];

  return groupingPatterns.some(pattern => pattern.test(content));
}

/**
 * Create page groups from cells for smart pagination
 * @param {Array<HTMLElement>} cells - Array of cell elements
 * @returns {Array<Object>} Array of page objects with grouped cells
 */
function createPageGroups(cells) {
  const pages = [];
  const MAX_CODE_GROUP_SIZE = 3; // Maximum number of consecutive code cells to group
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
        j < cells.length &&
        cells[j].classList.contains('ipynb-code-cell') &&
        groupedCells.filter(c => c.classList.contains('ipynb-code-cell')).length < MAX_CODE_GROUP_SIZE
      ) {
        groupedCells.push(cells[j]);
        j++;
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
      i++;
    }
  }

  return pages;
}

/**
 * Create full-screen overlay for paged variation
 * @param {HTMLElement} container - The notebook container
 * @param {HTMLElement} cellsContainer - Container with cells
 * @param {boolean} autorun - Whether to autorun code cells
 * @param {boolean} isNotebookMode - Whether this is notebook mode (close button always visible)
 * @param {string} [repoUrl] - Optional repository URL for markdown .md links
 * @returns {object} Overlay controls
 */
function createPagedOverlay(container, cellsContainer, autorun = false, isNotebookMode = false, repoUrl = null) {
  const cells = Array.from(cellsContainer.querySelectorAll('.ipynb-cell'));

  if (cells.length === 0) return null;

  // Remove any existing overlays to prevent duplicates
  const existingOverlays = document.querySelectorAll('.ipynb-paged-overlay');
  existingOverlays.forEach(overlay => overlay.remove());

  // Create page groups (smart grouping)
  const pages = createPageGroups(cells);
  const totalPages = pages.length;

  const paginationState = {
    currentPage: 0,
    totalPages,
    pages,
    isOverlayOpen: false,
    autorun,
  };

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

  // Close button (always visible, including notebook mode)
  const closeButton = document.createElement('button');
  closeButton.className = 'ipynb-paged-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close paged view');

  // Close button is now always visible (notebook mode fix)
  // Previously hidden in notebook mode, now always shown for better UX

  // Hamburger menu (notebook mode only) - Table of Contents
  let hamburgerButton, tocDropdown;
  if (isNotebookMode) {
    hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'ipynb-hamburger-menu';
    hamburgerButton.innerHTML = '&#9776;'; // Hamburger icon
    hamburgerButton.setAttribute('aria-label', 'Table of Contents');
    hamburgerButton.setAttribute('aria-expanded', 'false');

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
        tocItems.push({ index, title, pageIndex: Math.floor(index / 1), type: 'content' });
      } else if (itemType === 'divider') {
        tocItems.push({ index, title: null, pageIndex: Math.floor(index / 1), type: 'divider' });
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

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (tocDropdown && !tocDropdown.contains(e.target) && e.target !== hamburgerButton) {
        tocDropdown.style.display = 'none';
        hamburgerButton.setAttribute('aria-expanded', 'false');
      }
    });
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

  // Cell content area
  const cellContentArea = document.createElement('div');
  cellContentArea.className = 'ipynb-paged-cell-area';

  // Assemble overlay
  overlayContent.appendChild(closeButton);
  if (isNotebookMode) {
    overlayContent.appendChild(hamburgerButton);
    overlayContent.appendChild(tocDropdown);
  }
  overlayContent.appendChild(cellContentArea);
  overlayContent.appendChild(paginationDiv);
  overlay.appendChild(overlayContent);

  // Update page display
  async function updatePageDisplay() {
    // Clear cell area
    cellContentArea.innerHTML = '';

    // Get current page group
    const currentPage = pages[paginationState.currentPage];

    // Clone and append all cells in this page
    for (const cell of currentPage.cells) {
      const clonedCell = cell.cloneNode(true);
      clonedCell.classList.add('active');
      cellContentArea.appendChild(clonedCell);

      // Re-attach run button handlers if it's a code cell
      if (clonedCell.classList.contains('ipynb-code-cell')) {
        const runButton = clonedCell.querySelector('.ipynb-run-button');

        // In autorun mode, automatically execute the cell
        if (paginationState.autorun) {
          await executeCodeCell(clonedCell);
        } else if (runButton) {
          // Otherwise, attach click handler
          runButton.addEventListener('click', () => {
            executeCodeCell(clonedCell);
          });
        }
      }
    }

    // Add click handlers to links with hash targets for overlay navigation
    const links = cellContentArea.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        navigateToAnchor(target);
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
      for (let i = 1; i < allCells.length - 1; i++) {
        if (allCells[i].classList.contains('ipynb-code-cell')) {
          allCells[i].style.marginBottom = '1rem';
        }
      }
    }

    // Update controls
    pageIndicator.textContent = `${paginationState.currentPage + 1} / ${totalPages}`;
    prevButton.disabled = paginationState.currentPage === 0;
    nextButton.disabled = paginationState.currentPage === totalPages - 1;

    // Scroll to top of cell area (not overlayContent)
    cellContentArea.scrollTop = 0;
  }

  // Navigation handlers
  function goToNextPage() {
    if (paginationState.currentPage < totalPages - 1) {
      paginationState.currentPage++;
      updatePageDisplay();
    }
  }

  function goToPrevPage() {
    if (paginationState.currentPage > 0) {
      paginationState.currentPage--;
      updatePageDisplay();
    }
  }

  // Open overlay
  function openOverlay() {
    paginationState.isOverlayOpen = true;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    updatePageDisplay();
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

  // Keyboard navigation
  const keyHandler = (e) => {
    if (!paginationState.isOverlayOpen) return;

    // Only handle if user isn't typing in an input
    if (!document.activeElement ||
        (document.activeElement.tagName !== 'INPUT' &&
         document.activeElement.tagName !== 'TEXTAREA')) {
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

    // Search through all pages to find the one containing the target ID
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      // Check if any cell in this page contains the target ID
      const hasTarget = page.cells.some(cell => {
        // Use both querySelector and textContent search for robustness
        const hasId = cell.querySelector(`#${targetId}`) !== null;

        // Also check if cell contains an h2 that would generate this ID
        const headers = cell.querySelectorAll('h2');
        const hasMatchingHeader = Array.from(headers).some(h2 => {
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
      });

      if (hasTarget) {
        // Navigate to this page
        paginationState.currentPage = i;
        updatePageDisplay();
        return;
      }
    }

    console.log(`Navigation target not found: ${targetId}`);
  }

  // Append overlay to body
  document.body.appendChild(overlay);

  return {
    openOverlay,
    closeOverlay,
    navigateToAnchor,
  };
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
 * Create manual button for manual variation
 * @returns {HTMLElement} Manual button element
 */
function createManualButton() {
  const manualButton = document.createElement('button');
  manualButton.className = 'ipynb-manual-button';
  manualButton.textContent = 'Read the Manual';
  manualButton.setAttribute('aria-label', 'Read the manual');
  return manualButton;
}

/**
 * Create manual overlay for displaying manual content
 * @param {string} manualPath - Path to the manual file (relative or absolute URL)
 * @param {string|null} repoUrl - Repository URL for resolving relative paths
 * @returns {Object} Object with openOverlay and closeOverlay functions
 */
function createManualOverlay(manualPath, repoUrl) {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-manual-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Manual viewer');

  // Create overlay content
  const overlayContent = document.createElement('div');
  overlayContent.className = 'ipynb-manual-overlay-content';

  // Create header with close button
  const overlayHeader = document.createElement('div');
  overlayHeader.className = 'ipynb-manual-overlay-header';

  const closeButton = document.createElement('button');
  closeButton.className = 'ipynb-paged-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close manual');

  overlayHeader.appendChild(closeButton);
  overlayContent.appendChild(overlayHeader);

  // Create content area for manual
  const contentArea = document.createElement('div');
  contentArea.className = 'ipynb-manual-content-area';
  overlayContent.appendChild(contentArea);

  overlay.appendChild(overlayContent);

  // Resolve manual path
  let resolvedPath = manualPath;

  // If path doesn't start with http:// or https://, treat as relative
  if (!manualPath.startsWith('http://') && !manualPath.startsWith('https://')) {
    // If it's a plain .md file and we have a repo URL, construct full path
    if (repoUrl && manualPath.endsWith('.md')) {
      resolvedPath = `${repoUrl}/blob/main/${manualPath}`;
    } else if (manualPath.startsWith('/')) {
      // Absolute path from root
      resolvedPath = manualPath;
    } else {
      // Relative path - make it absolute from root
      resolvedPath = `/${manualPath}`;
    }
  }

  // Open/close functions
  const openOverlay = async () => {
    // Fetch and display manual
    try {
      contentArea.innerHTML = '<div class="ipynb-loading">Loading manual...</div>';
      const response = await fetch(resolvedPath);
      if (!response.ok) {
        throw new Error(`Failed to load manual: ${response.status}`);
      }
      const markdownText = await response.text();

      // Render markdown
      contentArea.innerHTML = parseMarkdown(markdownText);

      // Show overlay
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    } catch (error) {
      console.error('Failed to load manual:', error);
      contentArea.innerHTML = `<div class="ipynb-error">Failed to load manual: ${error.message}</div>`;
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closeOverlay = () => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

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
 * Decorate the ipynb-viewer block
 * @param {HTMLElement} block - Block element
 */
export default async function decorate(block) {
  // Configuration
  const config = {
    errorMessage: 'Failed to load notebook',
    loadingMessage: 'Loading notebook...',
  };

  // Detect variations
  const isPaged = block.classList.contains('paged');
  const hasManual = block.classList.contains('manual');
  const isAutorun = block.classList.contains('autorun');
  const isNotebook = block.classList.contains('notebook'); // Combines manual and paged (no autorun), close button visible

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

    // Add date if available
    if (notebook.metadata?.date) {
      const date = document.createElement('div');
      date.className = 'ipynb-viewer-date';
      date.textContent = notebook.metadata.date;
      header.appendChild(date);
    }

    // Add version if available
    if (notebook.metadata?.version) {
      const version = document.createElement('div');
      version.className = 'ipynb-viewer-version';
      version.textContent = `Version ${notebook.metadata.version}`;
      header.appendChild(version);
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

      notebook.metadata.tags.forEach(tag => {
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

    notebook.cells.forEach(async (cell, index) => {
      let cellElement;

      if (cell.cell_type === 'markdown') {
        cellElement = createMarkdownCell(cell, index, repoUrl, isNotebook);
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
        } else {
          // In autorun mode, execute immediately in default view
          if (!isPaged && !isNotebook) {
            await executeCodeCell(cellElement);
          }
        }
      }

      if (cellElement) {
        cellsContainer.appendChild(cellElement);
      }
    });

    // Assemble container
    container.appendChild(header);

    // Handle paged, autorun, and notebook variations
    if (isPaged || isNotebook) {
      // Hide cells initially in paged mode
      cellsContainer.style.display = 'none';
      container.appendChild(cellsContainer);

      // Create button container for start button (and optional manual button)
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'ipynb-button-container';

      // Create start button
      const startButton = createPagedStartButton();
      buttonContainer.appendChild(startButton);

      // Create overlay with autorun support and notebook mode flag
      const overlay = createPagedOverlay(container, cellsContainer, shouldAutorun, isNotebook, repoUrl);

      // Start button opens overlay
      startButton.addEventListener('click', () => {
        overlay.openOverlay();
      });

      // Add manual button if manual variation or notebook variation is present AND manual-path is configured
      if ((hasManual || isNotebook) && notebook.metadata?.['manual-path']) {
        const manualButton = createManualButton();
        buttonContainer.appendChild(manualButton);

        // Get manual path from metadata
        const manualPath = notebook.metadata['manual-path'];

        // Create manual overlay with configurable path
        const manualOverlay = createManualOverlay(manualPath, repoUrl);

        // Manual button opens manual overlay
        manualButton.addEventListener('click', () => {
          manualOverlay.openOverlay();
        });
      }

      container.appendChild(buttonContainer);
    } else {
      // Default mode: show all cells
      container.appendChild(cellsContainer);
    }

    block.appendChild(container);

  } catch (error) {
    console.error('Block decoration failed:', error);
    block.innerHTML = `<div class="ipynb-error">${config.errorMessage}: ${error.message}</div>`;
  }
}
