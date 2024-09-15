export default async function decorate(block) {
  const footer = document.createElement('footer');
  footer.classList.add('linkedin-footer');

  const footerContent = document.createElement('div');
  footerContent.classList.add('footer-content');

  const logo = document.createElement('div');
  logo.classList.add('linkedin-logo');
  logo.textContent = 'in';
  footerContent.appendChild(logo);

  const copyright = document.createElement('p');
  copyright.textContent = '© 2023 LinkedIn Corporation';
  footerContent.appendChild(copyright);

  footer.appendChild(footerContent);
  block.textContent = '';
  block.appendChild(footer);
}