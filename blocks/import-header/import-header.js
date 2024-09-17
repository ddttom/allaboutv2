export default async function decorate(block) {
  const headerContent = document.createElement('div');
  headerContent.className = 'import-header-content';

  const logo = document.createElement('img');
  logo.src = 'https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png';
  logo.alt = 'LinkedIn';
  logo.className = 'import-header-logo';

  const nav = document.createElement('nav');
  nav.className = 'import-header-nav';

  const navItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications'];
  navItems.forEach(item => {
    const navItem = document.createElement('a');
    navItem.href = '#';
    navItem.textContent = item;
    navItem.className = 'import-header-nav-item';
    nav.appendChild(navItem);
  });

  headerContent.appendChild(logo);
  headerContent.appendChild(nav);
  block.appendChild(headerContent);
}