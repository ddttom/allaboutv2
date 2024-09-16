export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-profile-summary';

  const summaryText = document.createElement('p');
  summaryText.className = 'summary-text';
  summaryText.textContent = block.textContent.trim();

  container.appendChild(summaryText);

  block.textContent = '';
  block.appendChild(container);
}