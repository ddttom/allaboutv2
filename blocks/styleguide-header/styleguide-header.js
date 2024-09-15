import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileUrl = 'https://www.linkedin.com/in/trieloff/?originalSubdomain=de';
  const container = document.createElement('div');
  block.appendChild(container);

  try {
    const response = await fetch(profileUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const name = doc.querySelector('h1')?.textContent || 'Lars Trieloff';
    const title = doc.querySelector('.text-body-medium')?.textContent || 'Product Manager at Adobe';
    const profilePic = doc.querySelector('.pv-top-card-profile-picture__image')?.src || 'https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png';

    const headerHtml = `
      <div class="styleguide-header-content">
        ${createOptimizedPicture(profilePic, name, false, [200]).outerHTML}
        <div class="styleguide-header-text">
          <h1>${name}</h1>
          <p>${title}</p>
        </div>
      </div>
    `;

    container.innerHTML = headerHtml;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    container.innerHTML = '<p>Error loading profile information</p>';
  }

  block.classList.add('styleguide-header--initialized');
}