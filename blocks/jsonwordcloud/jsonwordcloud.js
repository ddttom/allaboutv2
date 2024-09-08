import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('jsonwordcloud-container');
  block.appendChild(container);

  try {
    const response = await fetch('/example-wordcloud.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const wordCounts = {};
    let maxCount = 0;
    let mostUsedWord = '';

    data.data.forEach((item) => {
      const words = item.phrases.split(',').map((word) => word.trim());
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        if (wordCounts[word] > maxCount) {
          maxCount = wordCounts[word];
          mostUsedWord = word;
        }
      });
    });

    const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);

    sortedWords.forEach(([word, count]) => {
      const wordElement = document.createElement('span');
      wordElement.textContent = word;
      wordElement.style.fontSize = `${Math.max(12, (count / maxCount) * 48)}px`;
      if (word === mostUsedWord) {
        wordElement.classList.add('most-used');
      }
      container.appendChild(wordElement);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    container.textContent = 'Error loading word cloud data';
  }

  block.classList.add('jsonwordcloud--initialized');
}