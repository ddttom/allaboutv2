import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const wordMap = new Map();
  const rows = [...block.children];

  // Process all rows and build word frequency map
  rows.forEach((row) => {
    const cellContent = row.textContent.trim();
    const words = cellContent.split(',').map((word) => word.trim());
    words.forEach((word) => {
      if (word) {
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      }
    });
  });

  // Sort words by frequency
  const sortedWords = [...wordMap.entries()].sort((a, b) => b[1] - a[1]);

  // Create word cloud container
  const cloudContainer = document.createElement('div');
  cloudContainer.classList.add('wordcloud-container');

  // Generate word elements
  sortedWords.forEach(([word, frequency], index) => {
    const wordElement = document.createElement('span');
    wordElement.textContent = word;
    wordElement.classList.add('wordcloud-word');
    wordElement.style.fontSize = `${Math.max(1, Math.min(5, frequency))}em`;
    
    if (index === 0) {
      wordElement.classList.add('wordcloud-word-highest');
    }

    cloudContainer.appendChild(wordElement);
  });

  // Clear existing content and append the word cloud
  block.textContent = '';
  block.appendChild(cloudContainer);
}