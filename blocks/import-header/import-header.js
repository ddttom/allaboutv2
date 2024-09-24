export default async function decorate(block) {
  const logo = block.querySelector('img');
  const navItems = block.querySelectorAll('p:not(:first-child)');

  const headerContent = document.createElement('div');
  headerContent.className = 'import-header-content';

  const logoWrapper = document.createElement('a');
  logoWrapper.className = 'import-header-logo';
  logoWrapper.href = '/';
  logoWrapper.appendChild(logo);

  const nav = document.createElement('nav');
  nav.className = 'import-header-nav';

  navItems.forEach((item) => {
    const link = document.createElement('a');
    link.className = 'import-header-nav-item';
    link.href = '#'; // Replace with actual links if available
    link.textContent = item.textContent;
    nav.appendChild(link);
  });

  headerContent.appendChild(logoWrapper);
  headerContent.appendChild(nav);

  block.innerHTML = '';
  block.appendChild(headerContent);
}
