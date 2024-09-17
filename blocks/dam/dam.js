import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const rows = [...block.children];
  const title = rows[0].textContent.trim();
  const damData = [];

  // Start from index 1 to skip the title row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const [description, classification, tag, imageDiv] = [...row.children];
    const img = imageDiv.querySelector('img');
    const imagePath = img ? new URL(img.src).pathname : '';

    damData.push({
      description: description.textContent.trim(),
      classification: classification.textContent.trim(),
      tag: tag.textContent.trim(),
      path: imagePath,
    });
  }

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