export default async function decorate(block) {
  const title = document.createElement('h2');
  title.className = 'import-about-title';
  title.textContent = 'About';

  const content = document.createElement('div');
  content.className = 'import-about-content';
  content.innerHTML = block.innerHTML;

  block.innerHTML = '';
  block.appendChild(title);
  block.appendChild(content);
}
