/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

const INDEX_CONFIG = {
  HEADER_TITLE: 'Index',
  INDENT_PER_LEVEL: 20, // px
};

export default function decorate(block) {
  // INTENTIONAL: This block operates on document-level elements
  // It collects ALL headings from the entire document to create a table of contents,
  // not just headings within the block itself
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  // Create the index header
  const indexHeader = document.createElement('div');
  indexHeader.className = 'index-header';
  indexHeader.innerHTML = `
    <span>${INDEX_CONFIG.HEADER_TITLE}</span>
    <i class='arrow down'></i>
  `;
  // Create the index content container
  const indexContent = document.createElement('div');
  indexContent.className = 'index-content';
  // Append the index header and content container to the index block
  block.appendChild(indexHeader);
  block.appendChild(indexContent);

  let isIndexBuilt = false; // Flag to track if the index has been built

  indexHeader.addEventListener('click', () => {
    if (!isIndexBuilt) {
      buildIndex();
      isIndexBuilt = true; // Set the flag to true after building the index
    }

    // Toggle visibility using classes instead of inline styles
    const isHidden = indexContent.classList.contains('hidden');
    const arrow = indexHeader.querySelector('.arrow');

    if (isHidden) {
      indexContent.classList.remove('hidden');
      arrow.classList.add('up');
    } else {
      indexContent.classList.add('hidden');
      arrow.classList.remove('up');
    }
  });

  function buildIndex() {
    const ul = document.createElement('ul');
    headers.forEach((header, index) => {
      const id = `header-${index}`;
      header.id = id;
      const li = document.createElement('li');
      // Use CSS custom property instead of inline style
      const level = parseInt(header.tagName[1], 10) - 1;
      li.style.setProperty('--indent-level', level);
      li.className = 'index-item';
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = header.textContent;
      li.appendChild(a);
      ul.appendChild(li);
    });
    indexContent.innerHTML = '';
    indexContent.appendChild(ul);
  }
}
