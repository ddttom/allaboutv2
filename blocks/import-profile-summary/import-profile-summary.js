export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-summary');

  const heading = document.createElement('h2');
  heading.textContent = 'About';
  container.appendChild(heading);

  const summary = document.createElement('p');
  summary.textContent = block.textContent.trim();
  container.appendChild(summary);

  block.textContent = '';
  block.appendChild(container);
}