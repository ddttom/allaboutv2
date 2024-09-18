export default function decorate(block) {
  const accomplishmentsSection = document.createElement('div');
  accomplishmentsSection.className = 'section-card accomplishments-section';
  accomplishmentsSection.innerHTML = `
    <h2>Accomplishments</h2>
    ${Array.from(block.children).map(category => `
      <div class="accomplishment-category">
        <h3>${category.children[0].textContent}</h3>
        <ul>
          ${Array.from(category.children).slice(1).map(item => `
            <li>${item.textContent}</li>
          `).join('')}
        </ul>
      </div>
    `).join('')}
  `;
  block.textContent = '';
  block.appendChild(accomplishmentsSection);
}