import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.classList.add('linkedin-header');

  const logo = document.createElement('div');
  logo.classList.add('linkedin-logo');
  const logoImg = createOptimizedPicture('https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png', 'LinkedIn', false, [{ width: '40' }]);
  logo.appendChild(logoImg);

  const nav = document.createElement('nav');
  nav.classList.add('linkedin-nav');
  const navItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications'];
  navItems.forEach(item => {
    const navItem = document.createElement('a');
    navItem.href = '#';
    navItem.textContent = item;
    nav.appendChild(navItem);
  });

  const search = document.createElement('input');
  search.type = 'text';
  search.placeholder = 'Search';
  search.classList.add('linkedin-search');

  header.appendChild(logo);
  header.appendChild(nav);
  header.appendChild(search);

  block.textContent = '';
  block.appendChild(header);
}
