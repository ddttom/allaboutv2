import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const logo = document.createElement('div');
  logo.classList.add('import-header-logo');
  const logoImg = createOptimizedPicture('https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png', 'Adobe Lightroom Logo', false, [{ width: '200' }]);
  logo.appendChild(logoImg);

  const nav = document.createElement('nav');
  nav.classList.add('import-header-nav');
  const navItems = ['Home', 'Gallery', 'About'];
  navItems.forEach(item => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item;
    nav.appendChild(link);
  });

  block.appendChild(logo);
  block.appendChild(nav);
}