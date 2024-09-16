export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'container';

  const logo = document.createElement('img');
  logo.className = 'logo';
  logo.src = 'https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png';
  logo.alt = 'LinkedIn';

  const nav = document.createElement('nav');
  nav.className = 'nav';

  const navItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications'];
  navItems.forEach(item => {
    const link = document.createElement('a');
    link.className = 'nav-item';
    link.href = '#';
    link.textContent = item;
    nav.appendChild(link);
  });

  container.appendChild(logo);
  container.appendChild(nav);
  block.appendChild(container);
}