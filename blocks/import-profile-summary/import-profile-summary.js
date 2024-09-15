export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-summary');

  const summaryText = document.createElement('p');
  summaryText.textContent = block.children[0].children[0].textContent;
  container.appendChild(summaryText);

  block.textContent = '';
  block.appendChild(container);
}