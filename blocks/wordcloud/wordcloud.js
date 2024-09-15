import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const cloudIcon = document.createElement('span');
  cloudIcon.classList.add('wordcloud-icon');
  cloudIcon.textContent = '☁️';
  container.appendChild(cloudIcon);

  const wordcloudContent = document.createElement('div');
  wordcloudContent.classList.add('wordcloud-content');
  container.appendChild(wordcloudContent);

  const table = block.querySelector('table');
  if (!table) {
    // eslint-disable-next-line no-console
    console.error('No table found in the wordcloud block');
    return;
  }

  const words = {};
  const rows = table.querySelectorAll('tr');
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      const cellWords = cell.textContent.split(',').map((word) => word.trim());
      cellWords.forEach((word) => {
        if (word) {
          words[word] = (words[word] || 0) + 1;
        }
      });
    });
  });

  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);


  const maxFrequency = sortedWords[0][1];
  const colors = ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14', '#ffc107'];

  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    span.setAttribute('aria-label', `${word}: ${frequency} occurrences`);

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('wordcloud-tooltip');
      tooltip.textContent = `${word}: ${frequency} occurrences`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    wordcloudContent.appendChild(span);
  });

  block.classList.add('wordcloud--initialized');
}
