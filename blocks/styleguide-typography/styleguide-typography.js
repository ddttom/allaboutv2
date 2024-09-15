export default function decorate(block) {
  const typographyStyles = [
    { name: 'Heading 1', class: 'h1', sample: 'Main Heading' },
    { name: 'Heading 2', class: 'h2', sample: 'Section Heading' },
    { name: 'Heading 3', class: 'h3', sample: 'Subsection Heading' },
    { name: 'Body Text', class: 'body', sample: 'This is a sample paragraph of body text. It demonstrates the default font style and size used for general content.' },
    { name: 'Small Text', class: 'small', sample: 'Small text for captions or notes' },
    { name: 'Link', class: 'link', sample: 'Clickable Link' },
  ];

  const container = document.createElement('div');
  container.className = 'typography-samples';

  typographyStyles.forEach((style) => {
    const sampleElement = document.createElement('div');
    sampleElement.className = 'typography-sample';
    sampleElement.innerHTML = `
      <h3>${style.name}</h3>
      <div class="sample ${style.class}">${style.sample}</div>
      <p class="details">Font: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Oxygen Sans', Cantarell, 'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Lucida Grande', Helvetica, Arial, sans-serif</p>
    `;
    container.appendChild(sampleElement);
  });

  block.appendChild(container);
  block.classList.add('styleguide-typography--initialized');
}