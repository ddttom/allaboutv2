export default function decorate(block) {
  const components = [
    { name: 'Button', html: '<button class="btn btn-primary">Primary Button</button>' },
    { name: 'Input', html: '<input type="text" class="form-input" placeholder="Enter text...">' },
    { name: 'Card', html: '<div class="card"><h3>Card Title</h3><p>Card content goes here.</p></div>' },
    { name: 'Badge', html: '<span class="badge">New</span>' },
    { name: 'Alert', html: '<div class="alert alert-info">This is an informational alert.</div>' },
    { name: 'Dropdown', html: '<select class="dropdown"><option>Option 1</option><option>Option 2</option></select>' },
  ];

  const container = document.createElement('div');
  container.className = 'component-examples';

  components.forEach((component) => {
    const componentElement = document.createElement('div');
    componentElement.className = 'component-example';
    componentElement.innerHTML = `
      <h3>${component.name}</h3>
      <div class="component-demo">
        ${component.html}
      </div>
      <pre><code>${component.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    `;
    container.appendChild(componentElement);
  });

  block.appendChild(container);
  block.classList.add('styleguide-components--initialized');
}