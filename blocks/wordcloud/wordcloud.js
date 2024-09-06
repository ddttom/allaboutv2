import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const words = {};
  let maxCount = 0;

  // Iterate through all cells and collect words/phrases
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const cellContent = cell.textContent.trim();
    const items = cellContent.split(',').map((item) => item.trim());
    
    items.forEach((item) => {
      if (item) {
        words[item] = (words[item] || 0) + 1;
        maxCount = Math.max(maxCount, words[item]);
      }
    });
  });

  // Clear the original content
  block.innerHTML = '';

  // Create the word cloud container
  const cloudContainer = document.createElement('div');
  cloudContainer.classList.add('wordcloud-container');

  // Add words to the cloud
  Object.entries(words).sort((a, b) => b[1] - a[1]).forEach(([word, count]) => {
    const wordElement = document.createElement('span');
    wordElement.textContent = word;
    wordElement.classList.add('wordcloud-item');
    
    const fontSize = 1 + (count / maxCount) * 2; // Font size between 1em and 3em
    wordElement.style.fontSize = `${fontSize}em`;

    if (count === maxCount) {
      wordElement.classList.add('wordcloud-item-max');
    }

    cloudContainer.appendChild(wordElement);
  });

  block.appendChild(cloudContainer);
}