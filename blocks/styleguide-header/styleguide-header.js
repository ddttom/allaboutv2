import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const resp = await fetch('/blocks/styleguide-header/styleguide-header.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load styleguide header data');
    return;
  }
  const json = await resp.json();

  const header = document.createElement('header');
  header.classList.add('styleguide-header');

  const logo = document.createElement('div');
  logo.classList.add('styleguide-header-logo');
  const img = createOptimizedPicture(json.logo, 'LinkedIn Logo', false, [{ width: '200' }]);
  logo.appendChild(img);

  const title = document.createElement('h1');
  title.textContent = json.title;

  const description = document.createElement('p');
  description.textContent = json.description;

  header.appendChild(logo);
  header.appendChild(title);
  header.appendChild(description);

  block.textContent = '';
  block.appendChild(header);
}