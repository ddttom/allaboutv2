import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const words = {};
  const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const excludedWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);

  // Process content
  block.querySelectorAll('div').forEach((row) => {
    const text = row.textContent.trim();
    const phrases = text.split(',').map((phrase) => phrase.trim().toLowerCase());
    phrases.forEach((phrase) => {
      if (!excludedWords.has(phrase)) {
        words[phrase] = (words[phrase] || 0) + 1;
      }
    });
  });

  // Sort words by frequency
  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  // Clear existing content
  block.innerHTML = '';

  // Create word cloud container
  const cloudContainer = document.createElement('div');
  cloudContainer.classList.add('wordcloud-container');
  block.appendChild(cloudContainer);

  // Add words to cloud
  sortedWords.forEach(([word, count], index) => {
    const wordElement = document.createElement('span');
    wordElement.textContent = word;
    wordElement.classList.add('wordcloud-word');
    wordElement.style.fontSize = `${Math.max(14, 48 - index)}px`;
    wordElement.style.color = colorPalette[index % colorPalette.length];

    // Add tooltip
    wordElement.setAttribute('title', `Frequency: ${count}`);

    // Add event listeners
    wordElement.addEventListener('mouseover', () => {
      wordElement.style.transform = 'scale(1.5)';
      wordElement.style.opacity = '0.8';
    });

    wordElement.addEventListener('mouseout', () => {
      wordElement.style.transform = 'scale(1)';
      wordElement.style.opacity = '1';
    });

    cloudContainer.appendChild(wordElement);
  });

  // Add aria-label for accessibility
  cloudContainer.setAttribute('aria-label', 'Word cloud visualization');

  // Add initialized class
  block.classList.add('wordcloud--initialized');
}