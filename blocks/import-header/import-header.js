export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.classList.add('linkedin-header');

  const logo = document.createElement('div');
  logo.classList.add('linkedin-logo');
  logo.textContent = 'in';
  nav.appendChild(logo);

  const menuItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications'];
  const menu = document.createElement('ul');
  menuItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    menu.appendChild(li);
  });
  nav.appendChild(menu);

  block.textContent = '';
  block.appendChild(nav);
}