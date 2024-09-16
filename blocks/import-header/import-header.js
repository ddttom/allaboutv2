import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.classList.add('linkedin-header');

  const logo = document.createElement('div');
  logo.classList.add('linkedin-logo');
  const logoImg = createOptimizedPicture('https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png', 'LinkedIn Logo', false, [{ width: '40' }]);
  logo.appendChild(logoImg);

  const nav = document.createElement('nav');
  const navItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications'];
  navItems.forEach(item => {
    const navItem = document.createElement('a');
    navItem.textContent = item;
    navItem.href = '#';
    nav.appendChild(navItem);
  });

  header.appendChild(logo);
  header.appendChild(nav);

  block.textContent = '';
  block.appendChild(header);
}