export default async function decorate(block) {
  const footer = document.createElement('footer');
  footer.classList.add('import-footer');

  const copyright = document.createElement('p');
  copyright.textContent = `© ${new Date().getFullYear()} Adobe Lightroom. All rights reserved.`;

  const links = document.createElement('div');
  links.classList.add('import-footer-links');
  const linkTexts = ['Privacy', 'Terms', 'Contact'];
  linkTexts.forEach(text => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;
    links.appendChild(link);
  });

  footer.appendChild(copyright);
  footer.appendChild(links);
  block.appendChild(footer);
}