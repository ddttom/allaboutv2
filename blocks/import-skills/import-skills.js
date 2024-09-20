export default function decorate(block) {
  const skillsSection = document.createElement('div');
  skillsSection.className = 'section-card skills-section';
  skillsSection.innerHTML = `
    <h2 class="section-title">Skills</h2>
    <ul class="skills-list">
      ${Array.from(block.children).map(item => `
        <li class="skill-item">
          <h3 class="skill-name">${item.querySelector('.skill-name').textContent}</h3>
          <p class="endorsements">${item.querySelector('.endorsements').textContent} endorsements</p>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(skillsSection);
}