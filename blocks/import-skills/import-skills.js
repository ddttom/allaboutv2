export default async function decorate(block) {
  const skillsSection = document.createElement('div');
  skillsSection.className = 'section-card skills-section';
  skillsSection.innerHTML = `
    <h2>Skills</h2>
    <ul class="skills-list">
      ${Array.from(block.children).map(row => `
        <li>${row.children[0].textContent}</li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(skillsSection);
}