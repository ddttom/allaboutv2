/**
 * Notebook Mode Renderer
 * Renders notebook cells in the unified overlay
 */

/**
 * Render notebook cell content
 * @param {Object} overlay - Overlay DOM references
 * @param {Object} state - State object
 * @param {Object} target - Navigation target
 * @param {string} target.identifier - Cell identifier (e.g., 'cell-0')
 */
async function renderNotebookContent(overlay, state, target) {
  const { identifier } = target;

  // eslint-disable-next-line no-console
  console.log(`[NOTEBOOK RENDERER] Rendering cell: ${identifier}`);

  // Extract cell index from identifier
  const cellIndex = parseInt(identifier.replace('cell-', ''), 10);

  if (Number.isNaN(cellIndex)) {
    console.error(`[NOTEBOOK RENDERER] Invalid cell identifier: ${identifier}`);
    overlay.contentArea.innerHTML = '<div class="ipynb-error">Invalid cell identifier</div>';
    return;
  }

  // Get cell from content
  const { cells } = state.content;
  if (!cells || !cells[cellIndex]) {
    console.error(`[NOTEBOOK RENDERER] Cell not found: ${cellIndex}`);
    overlay.contentArea.innerHTML = '<div class="ipynb-error">Cell not found</div>';
    return;
  }

  const cell = cells[cellIndex];

  // Clear content area
  overlay.contentArea.innerHTML = '';

  // Render cell based on type
  if (cell.cell_type === 'markdown') {
    renderMarkdownCell(overlay.contentArea, cell, state);
  } else if (cell.cell_type === 'code') {
    await renderCodeCell(overlay.contentArea, cell, state);
  } else {
    console.warn(`[NOTEBOOK RENDERER] Unknown cell type: ${cell.cell_type}`);
    overlay.contentArea.innerHTML = `<div class="ipynb-warning">Unknown cell type: ${cell.cell_type}</div>`;
  }

  // Update tree selection if tree is available
  if (state.tree && state.tree.select) {
    state.tree.select(identifier);
  }

  // Scroll to top
  overlay.contentArea.scrollTop = 0;
}

/**
 * Render markdown cell
 * @param {HTMLElement} container - Container element
 * @param {Object} cell - Cell data
 * @param {Object} state - State object
 */
function renderMarkdownCell(container, cell, state) {
  const cellElement = document.createElement('div');
  cellElement.className = 'ipynb-markdown-cell';
  cellElement.setAttribute('data-cell-type', 'markdown');

  const contentArea = document.createElement('div');
  contentArea.className = 'ipynb-cell-content';

  // Get markdown source
  const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;

  // Parse markdown (will need to import parseMarkdown from main file)
  // For now, use simple conversion
  contentArea.innerHTML = parseSimpleMarkdown(source, state);

  cellElement.appendChild(contentArea);
  container.appendChild(cellElement);
}

/**
 * Render code cell
 * @param {HTMLElement} container - Container element
 * @param {Object} cell - Cell data
 * @param {Object} state - State object
 */
async function renderCodeCell(container, cell, state) {
  const cellElement = document.createElement('div');
  cellElement.className = 'ipynb-code-cell';
  cellElement.setAttribute('data-cell-type', 'code');

  // Source code area
  const sourceContainer = document.createElement('div');
  sourceContainer.className = 'ipynb-code-source';

  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'language-javascript';

  const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  code.textContent = source;

  pre.appendChild(code);
  sourceContainer.appendChild(pre);
  cellElement.appendChild(sourceContainer);

  // Run button if autorun is enabled
  if (state.metadata.autorun) {
    const runButton = document.createElement('button');
    runButton.type = 'button';
    runButton.className = 'ipynb-run-button';
    runButton.textContent = 'Run';
    runButton.setAttribute('aria-label', 'Run cell');

    runButton.addEventListener('click', async () => {
      await executeCell(cellElement, cell, state);
    });

    sourceContainer.appendChild(runButton);
  }

  // Output area
  const outputContainer = document.createElement('div');
  outputContainer.className = 'ipynb-code-output';

  if (cell.outputs && cell.outputs.length > 0) {
    renderOutputs(outputContainer, cell.outputs);
  }

  cellElement.appendChild(outputContainer);
  container.appendChild(cellElement);

  // Auto-execute if autorun is enabled
  if (state.metadata.autorun) {
    await executeCell(cellElement, cell, state);
  }
}

/**
 * Execute code cell
 * @param {HTMLElement} cellElement - Cell element
 * @param {Object} cell - Cell data
 * @param {Object} state - State object
 */
async function executeCell(cellElement, cell, state) {
  const outputContainer = cellElement.querySelector('.ipynb-code-output');
  if (!outputContainer) return;

  outputContainer.innerHTML = '<div class="ipynb-loading">Executing...</div>';

  try {
    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;

    // Execute code (simplified - real implementation would use jslab or similar)
    // eslint-disable-next-line no-eval
    const result = eval(source);

    // Display result
    outputContainer.innerHTML = '';
    const resultElement = document.createElement('div');
    resultElement.className = 'ipynb-output-result';
    resultElement.textContent = String(result);
    outputContainer.appendChild(resultElement);
  } catch (error) {
    outputContainer.innerHTML = '';
    const errorElement = document.createElement('div');
    errorElement.className = 'ipynb-output-error';
    errorElement.textContent = `Error: ${error.message}`;
    outputContainer.appendChild(errorElement);
  }
}

/**
 * Render cell outputs
 * @param {HTMLElement} container - Output container
 * @param {Array} outputs - Output array
 */
function renderOutputs(container, outputs) {
  outputs.forEach((output) => {
    const outputElement = document.createElement('div');
    outputElement.className = `ipynb-output ipynb-output-${output.output_type}`;

    if (output.output_type === 'stream') {
      const text = Array.isArray(output.text) ? output.text.join('') : output.text;
      outputElement.textContent = text;
    } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
      // Handle different MIME types
      if (output.data) {
        if (output.data['text/html']) {
          const html = Array.isArray(output.data['text/html'])
            ? output.data['text/html'].join('')
            : output.data['text/html'];
          outputElement.innerHTML = html;
        } else if (output.data['text/plain']) {
          const text = Array.isArray(output.data['text/plain'])
            ? output.data['text/plain'].join('')
            : output.data['text/plain'];
          outputElement.textContent = text;
        }
      }
    } else if (output.output_type === 'error') {
      outputElement.className += ' ipynb-output-error';
      const traceback = output.traceback ? output.traceback.join('\n') : output.evalue;
      outputElement.textContent = traceback;
    }

    container.appendChild(outputElement);
  });
}

/**
 * Simple markdown parser (placeholder - real implementation would use full parser)
 * @param {string} markdown - Markdown text
 * @param {Object} state - State object
 * @returns {string} HTML string
 */
function parseSimpleMarkdown(markdown, state) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

export default renderNotebookContent;
