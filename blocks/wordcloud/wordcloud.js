import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('Word Cloud block decoration started');

  const container = document.createElement('div');
  container.classList.add('wordcloud-container');

  const cloudIcon = document.createElement('span');
  cloudIcon.classList.add('cloud-icon');
  cloudIcon.textContent = '☁️';
  container.appendChild(cloudIcon);

  const wordCloudDiv = document.createElement('div');
  wordCloudDiv.classList.add('wordcloud');
  container.appendChild(wordCloudDiv);

  block.appendChild(container);

  const table = block.querySelector('table');
  if (!table) {
    // eslint-disable-next-line no-console
    console.error('No table found in the Word Cloud block');
    wordCloudDiv.textContent = 'No valid wordcloud data found.';
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Table found in Word Cloud block');

  const words = {};
  const commonWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);

  table.querySelectorAll('td').forEach((cell) => {
    cell.textContent.split(',').forEach((word) => {
      const trimmedWord = word.trim().toLowerCase();
      if (trimmedWord && !commonWords.has(trimmedWord)) {
        words[trimmedWord] = (words[trimmedWord] || 0) + 1;
      }
    });
  });

  // eslint-disable-next-line no-console
  console.log('Words processed:', words);

  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  // eslint-disable-next-line no-console
  console.log('Sorted words:', sortedWords);

  const maxFrequency = sortedWords[0][1];
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];

  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    span.setAttribute('aria-label', `${word}, appears ${frequency} times`);

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.textContent = `Frequency: ${frequency}`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    wordCloudDiv.appendChild(span);
  });

  // Center the most frequent word
  if (sortedWords.length > 0) {
    const [mostFrequentWord] = sortedWords[0];
    const centerWord = wordCloudDiv.querySelector(`span[aria-label^="${mostFrequentWord},"]`);
    if (centerWord) {
      centerWord.style.fontWeight = 'bold';
      centerWord.style.fontSize = '48px';
      centerWord.style.position = 'absolute';
      centerWord.style.top = '50%';
      centerWord.style.left = '50%';
      centerWord.style.transform = 'translate(-50%, -50%)';
    }
  }

  block.classList.add('wordcloud--initialized');
  // eslint-disable-next-line no-console
  console.log('Word Cloud block decoration completed');
}
