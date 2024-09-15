export default function decorate(block) {
  const typography = {
    headings: [
      { tag: 'h1', text: 'Heading 1', size: '2.75rem' },
      { tag: 'h2', text: 'Heading 2', size: '2.25rem' },
      { tag: 'h3', text: 'Heading 3', size: '1.75rem' },
      { tag: 'h4', text: 'Heading 4', size: '1.5rem' },
    ],
    body: [
      { tag: 'p', text: 'Body text', size: '1rem' },
      { tag: 'p', text: 'Small text', size: '0.875rem', class: 'small' },
    ],
    special: [
      { tag: 'p', text: 'Link text', size: '1rem', class: 'link' },
      { tag: 'p', text: 'Button text', size: '1rem', class: 'button' },
    ],
  };

  Object.entries(typography).forEach(([category, elements]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('typography-category');
    categoryDiv.innerHTML = `<h3>${category}</h3>`;

    elements.forEach(({ tag, text, size, class: className }) => {
      const element = document.createElement(tag);
      element.textContent = `${text} (${size})`;
      if (className) element.classList.add(className);
      categoryDiv.appendChild(element);
    });

    block.appendChild(categoryDiv);
  });
}