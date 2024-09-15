import { createOptimizedPicture } from '../../scripts/aem.js';

function createCloudIcon() {
  const cloudIcon = document.createElement('div');
  cloudIcon.classList.add('wordcloud-icon');
  cloudIcon.textContent = '☁️';
  return cloudIcon;
}

function getWordFrequency(words) {
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
}

function createWordElement(word, frequency, maxFrequency, colors) {
  const wordElement = document.createElement('span');
  wordElement.textContent = word;
  wordElement.classList.add('wordcloud-word');

  const fontSize = 14 + (frequency / maxFrequency) * 34;
  const colorIndex = Math.floor(Math.random() * colors.length);
  const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

  wordElement.style.fontSize = `${fontSize}px`;
  wordElement.style.color = colors[colorIndex];
  wordElement.style.transform = `rotate(${rotation}deg)`;

  wordElement.addEventListener('click', () => {
    const tooltip = document.createElement('div');
    tooltip.classList.add('wordcloud-tooltip');
    tooltip.textContent = `Frequency: ${frequency}`;
    wordElement.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  });

  return wordElement;
}

export default async function decorate(block) {
  const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];
  const commonWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);

  const cloudContainer = document.createElement('div');
  cloudContainer.classList.add('wordcloud-container');
  cloudContainer.appendChild(createCloudIcon());

  const wordsContainer = document.createElement('div');
  wordsContainer.classList.add('wordcloud-words');

  const words = Array.from(block.querySelectorAll('div'))
    .flatMap(div => div.textContent.split(','))
    .map(word => word.trim().toLowerCase())
    .filter(word => word && !commonWords.has(word));

  const wordFrequency = getWordFrequency(words);
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  const maxFrequency = sortedWords[0][1];

  sortedWords.forEach(([word, frequency], index) => {
    const wordElement = createWordElement(word, frequency, maxFrequency, colors);
    if (index === 0) {
      wordElement.classList.add('wordcloud-word-center');
      wordElement.style.fontWeight = 'bold';
    }
    wordsContainer.appendChild(wordElement);
  });

  cloudContainer.appendChild(wordsContainer);
  block.textContent = '';
  block.appendChild(cloudContainer);

  if (sortedWords.length === 0) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'No valid wordcloud data found.';
    block.appendChild(errorMessage);
  }

  block.classList.add('wordcloud--initialized');
}