import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const cloudIcon = document.createElement('span');
  cloudIcon.classList.add('wordcloud-icon');
  cloudIcon.textContent = '☁️';
  container.appendChild(cloudIcon);

  const wordCloudContent = document.createElement('div');
  wordCloudContent.classList.add('wordcloud-content');
  container.appendChild(wordCloudContent);

  // Look for the table with "wordcloud" in its first cell
  const tables = document.querySelectorAll('table');
  const wordcloudTable = Array.from(tables).find(table => {
    const firstCell = table.querySelector('th, td');
    return firstCell && firstCell.textContent.trim().toLowerCase() === 'wordcloud';
  });

  if (!wordcloudTable) {
    // eslint-disable-next-line no-console
    console.error('No table with "wordcloud" header found in the document');
    container.textContent = 'No word cloud data found.';
    return;
  }

  const words = {};
  const cells = wordcloudTable.querySelectorAll('td');
  cells.forEach((cell) => {
    cell.textContent.split(',').forEach((word) => {
      const trimmedWord = word.trim();
      if (trimmedWord) {
        words[trimmedWord] = (words[trimmedWord] || 0) + 1;
      }
    });
  });

  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  const maxFrequency = sortedWords[0][1];
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];

  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    span.setAttribute('aria-label', `${word}, appears ${frequency} times`);

    if (index === 0) {
      span.style.fontWeight = 'bold';
      span.style.fontSize = '48px';
    }

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('wordcloud-tooltip');
      tooltip.textContent = `Frequency: ${frequency}`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    wordCloudContent.appendChild(span);
  });
}
