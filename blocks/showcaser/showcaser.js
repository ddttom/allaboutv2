import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Configuration
  const defaultTitle = 'Code Showcase';
  const defaultContent = 'Select a code snippet to view its content.';

  // Create book-like structure
  const bookContainer = document.createElement('div');
  bookContainer.className = 'showcaser-book';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'showcaser-left-column';

  const rightPanel = document.createElement('div');
  rightPanel.className = 'showcaser-right-panel';

  // Collect all <pre> elements
  const preElements = document.querySelectorAll('pre');
  const codeSnippets = [];

  preElements.forEach((pre, index) => {
    const codeType = pre.querySelector('code')?.className.split('-')[1] || 'unknown';
    codeSnippets.push({
      type: codeType,
      content: pre.innerHTML,
      title: `Snippet ${index + 1} (${codeType})`,
    });
    pre.remove(); // Remove the original <pre> element
  });

  // Group snippets by type
  const groupedSnippets = codeSnippets.reduce((acc, snippet) => {
    if (!acc[snippet.type]) {
      acc[snippet.type] = [];
    }
    acc[snippet.type].push(snippet);
    return acc;
  }, {});

  // Create left column content
  Object.entries(groupedSnippets).forEach(([type, snippets]) => {
    const typeContainer = document.createElement('div');
    typeContainer.className = 'showcaser-type-container';

    const typeTitle = document.createElement('h3');
    typeTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeContainer.appendChild(typeTitle);

    snippets.forEach((snippet, index) => {
      const snippetTitle = document.createElement('button');
      snippetTitle.textContent = snippet.title;
      snippetTitle.className = 'showcaser-snippet-title';
      snippetTitle.addEventListener('click', () => {
        rightPanel.innerHTML = `<h2>${snippet.title}</h2><pre><code class="language-${snippet.type}">${snippet.content}</code></pre>`;
        // Highlight active snippet
        document.querySelectorAll('.showcaser-snippet-title').forEach(btn => btn.classList.remove('active'));
        snippetTitle.classList.add('active');
      });
      typeContainer.appendChild(snippetTitle);

      // Set the first snippet as default content
      if (index === 0 && type === Object.keys(groupedSnippets)[0]) {
        rightPanel.innerHTML = `<h2>${snippet.title}</h2><pre><code class="language-${snippet.type}">${snippet.content}</code></pre>`;
        snippetTitle.classList.add('active');
      }
    });

    leftColumn.appendChild(typeContainer);
  });

  // Add content from the first row of the Franklin block
  const blockContent = block.innerHTML;
  const contentContainer = document.createElement('div');
  contentContainer.className = 'showcaser-block-content';
  contentContainer.innerHTML = blockContent;

  // Assemble the book structure
  bookContainer.appendChild(leftColumn);
  bookContainer.appendChild(rightPanel);

  // Clear the original block content and add the new structure
  block.innerHTML = '';
  block.appendChild(contentContainer);
  block.appendChild(bookContainer);

  // Add loading state
  block.classList.add('showcaser--loaded');
}
