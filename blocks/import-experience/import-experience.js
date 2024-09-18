export default async function decorate(block) {
  const experienceSection = document.createElement('div');
  experienceSection.className = 'section-card experience-section';
  experienceSection.innerHTML = `
    <h2>Experience</h2>
    <ul class="experience-list">
      ${Array.from(block.children).map(row => `
        <li>
          <img src="${row.children[0].textContent}" alt="Company Logo">
          <div>
            <h3>${row.children[1].textContent}</h3>
            <p>${row.children[2].textContent}</p>
            <p>${row.children[3].textContent}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(experienceSection);
}