export default function decorate(block) {
  const layoutExamples = [
    { name: 'Full Width', class: 'full-width', description: 'Spans the entire width of the container' },
    { name: 'Two Column', class: 'two-column', description: 'Splits content into two equal columns' },
    { name: 'Three Column', class: 'three-column', description: 'Divides content into three equal columns' },
    { name: 'Sidebar', class: 'sidebar', description: 'Main content with a sidebar' },
    { name: 'Card Grid', class: 'card-grid', description: 'Displays content in a grid of cards' },
  ];

  const container = document.createElement('div');
  container.className = 'layout-examples';

  layoutExamples.forEach((layout) => {
    const exampleElement = document.createElement('div');
    exampleElement.className = `layout-example ${layout.class}`;
    exampleElement.innerHTML = `
      <h3>${layout.name}</h3>
      <div class="layout-demo">
        ${Array(3).fill('<div class="demo-block"></div>').join('')}
      </div>
      <p class="layout-description">${layout.description}</p>
    `;
    container.appendChild(exampleElement);
  });

  block.appendChild(container);
  block.classList.add('styleguide-layout--initialized');
}