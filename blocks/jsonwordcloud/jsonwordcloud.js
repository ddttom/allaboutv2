import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const jsonUrl = '/example-wordcloud.json';
  const container = document.createElement('div');
  container.classList.add('jsonwordcloud-container');
  block.appendChild(container);

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const wordCounts = {};
    let maxCount = 0;
    let mostUsedWord = '';

    // Count words and phrases
    data.data.forEach((item) => {
      const words = item.content.split(',').map(word => word.trim());
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        if (wordCounts[word] > maxCount) {
          maxCount = wordCounts[word];
          mostUsedWord = word;
        }
      });
    });

    // Create and append word elements
    Object.entries(wordCounts).forEach(([word, count]) => {
      const wordElement = document.createElement('span');
      wordElement.textContent = word;
      wordElement.classList.add('jsonwordcloud-word');
      const fontSize = 12 + (count / maxCount) * 24; // Font size between 12px and 36px
      wordElement.style.fontSize = `${fontSize}px`;
      
      if (word === mostUsedWord) {
        wordElement.classList.add('jsonwordcloud-most-used');
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