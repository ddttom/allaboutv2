export default function decorate(block) {
  const interestsSection = document.createElement('div');
  interestsSection.className = 'section-card interests-section';
  interestsSection.innerHTML = `
    <h2>Interests</h2>
    <ul class="interests-list">
      ${Array.from(block.children).map(row => `
        <li>${row.textContent}</li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(interestsSection);
}