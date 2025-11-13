/**
 * IPynb Viewer Block
 * Displays Jupyter notebook (.ipynb) files with interactive JavaScript execution
 */

/**
 * Parse markdown text to HTML (enhanced implementation)
 * @param {string} markdown - Markdown text
 * @returns {string} HTML string
 */
function parseMarkdown(markdown) {
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
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold (before italic to handle ** before *)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code inline (before links to avoid conflicts)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

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
 * Create a markdown cell element
 * @param {object} cell - Notebook cell data
 * @param {number} index - Cell index
 * @returns {HTMLElement} Cell element
 */
function createMarkdownCell(cell, index) {
  const cellDiv = document.createElement('div');
  cellDiv.className = 'ipynb-cell ipynb-markdown-cell';
  cellDiv.dataset.cellIndex = index;

  const content = document.createElement('div');
  content.className = 'ipynb-cell-content';

  // Join source lines and parse markdown
  const markdownText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  content.innerHTML = parseMarkdown(markdownText);

  cellDiv.appendChild(content);
  return cellDiv;
}

/**
 * Create a code cell element with execution button
 * @param {object} cell - Notebook cell data
 * @param {number} index - Overall cell index
 * @returns {HTMLElement} Cell element
 */
function createCodeCell(cell, index) {
  const cellDiv = document.createElement('div');
  cellDiv.className = 'ipynb-cell ipynb-code-cell';
  cellDiv.dataset.cellIndex = index;

  // Cell header with run button
  const header = document.createElement('div');
  header.className = 'ipynb-cell-header';

  const cellLabel = document.createElement('span');
  cellLabel.className = 'ipynb-cell-label';
  cellLabel.textContent = `[${index + 1}]:`;

  const runButton = document.createElement('button');
  runButton.className = 'ipynb-run-button';
  runButton.textContent = 'Run';
  runButton.setAttribute('aria-label', `Run code cell ${index + 1}`);

  header.appendChild(cellLabel);
  header.appendChild(runButton);

  // Code content
  const codeContent = document.createElement('pre');
  codeContent.className = 'ipynb-code-content';

  const code = document.createElement('code');
  const codeText = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  code.textContent = codeText;

  codeContent.appendChild(code);

  // Output area (initially hidden)
  const output = document.createElement('div');
  output.className = 'ipynb-cell-output';
  output.style.display = 'none';

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
 * Decorate the ipynb-viewer block
 * @param {HTMLElement} block - Block element
 */
export default async function decorate(block) {
  // Configuration
  const config = {
    errorMessage: 'Failed to load notebook',
    loadingMessage: 'Loading notebook...',
  };

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

    // Create cells container
    const cellsContainer = document.createElement('div');
    cellsContainer.className = 'ipynb-cells-container';

    // Process cells
    if (!notebook.cells || notebook.cells.length === 0) {
      throw new Error('Notebook has no cells');
    }

    notebook.cells.forEach((cell, index) => {
      let cellElement;

      if (cell.cell_type === 'markdown') {
        cellElement = createMarkdownCell(cell, index);
      } else if (cell.cell_type === 'code') {
        cellElement = createCodeCell(cell, index);

        // Add click handler for run button
        const runButton = cellElement.querySelector('.ipynb-run-button');
        runButton.addEventListener('click', () => {
          executeCodeCell(cellElement);
        });
      }

      if (cellElement) {
        cellsContainer.appendChild(cellElement);
      }
    });

    // Assemble and append
    container.appendChild(header);
    container.appendChild(cellsContainer);
    block.appendChild(container);

  } catch (error) {
    console.error('Block decoration failed:', error);
    block.innerHTML = `<div class="ipynb-error">${config.errorMessage}: ${error.message}</div>`;
  }
}
