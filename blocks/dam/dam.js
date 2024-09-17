import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const rows = [...block.children];
  const title = block.classList[0] || 'DAM Assets';
  const damData = [];

  rows.forEach((row) => {
    const [description, , classification, tag, imageDiv] = [...row.children];
    const imagePath = imageDiv.querySelector('img') ? 
      new URL(imageDiv.querySelector('img').src).pathname : '';

    damData.push({
      description: description.textContent.trim(),
      classification: classification.textContent.trim(),
      tag: tag.textContent.trim(),
      path: imagePath,
    });
  });

  const jsonOutput = JSON.stringify(damData, null, 2);
  
  block.innerHTML = `
    <h2>${title}</h2>
    <pre><code>${jsonOutput}</code></pre>
    <div class="dam-images">
      ${damData.map(item => `
        <div class="dam-item">
          ${createOptimizedPicture(item.path, item.description, false, [{ width: '300' }])}
          <p>${item.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}