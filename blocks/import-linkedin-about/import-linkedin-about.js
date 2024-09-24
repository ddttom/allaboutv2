export default function decorate(block) {
  const aboutSection = document.createElement('section');
  aboutSection.classList.add('about-section');

  const title = document.createElement('h2');
  title.textContent = 'About';

  const content = document.createElement('p');
  content.textContent = block.children[0].textContent;

  aboutSection.appendChild(title);
  aboutSection.appendChild(content);

  block.textContent = '';
  block.appendChild(aboutSection);
}
