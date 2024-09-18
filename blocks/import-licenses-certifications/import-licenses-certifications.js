export default function decorate(block) {
  const certSection = document.createElement('div');
  certSection.className = 'section-card licenses-certifications-section';
  certSection.innerHTML = `
    <h2>Licenses & Certifications</h2>
    <ul class="cert-list">
      ${Array.from(block.children).map(row => `
        <li>
          <h3>${row.children[0].textContent}</h3>
          <p>${row.children[1].textContent}</p>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(certSection);
}