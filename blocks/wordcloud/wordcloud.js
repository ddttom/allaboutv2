import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const cloudIcon = document.createElement('span');
  cloudIcon.classList.add('cloud-icon');
  cloudIcon.textContent = '☁️';
  container.appendChild(cloudIcon);

  const wordCloudContent = block.querySelector('.wordcloud');
  if (!wordCloudContent) {
    // eslint-disable-next-line no-console
    console.error('No .wordcloud content found');
    return;
  }

  const text = wordCloudContent.textContent;
  const words = text.split(',').map(word => word.trim());
  const wordFrequency = {};

  words.forEach(word => {
    if (word.length > 0) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.classList.add('word');
    span.style.fontSize = `${Math.max(14, Math.min(48, 14 + frequency * 2))}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.textContent = `Frequency: ${frequency}`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    container.appendChild(span);
  });

  // Add the optimized background image
  const img = createOptimizedPicture('/blocks/wordcloud/wordcloud-bg.jpg');
  if (img) {
    container.style.backgroundImage = `url(${img.src})`;
  }
}
