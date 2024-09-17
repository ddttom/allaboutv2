export default async function decorate(block) {
  const title = document.createElement('h2');
  title.textContent = 'About';

  const content = document.createElement('p');
  content.textContent = block.children[0].children[0].textContent;

  block.innerHTML = '';
  block.appendChild(title);
  block.appendChild(content);
}