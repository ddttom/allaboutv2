export default async function decorate(block) {
  const skillsSection = document.createElement('div');
  skillsSection.className = 'section-card skills-section';
  skillsSection.innerHTML = `
    <h2 id="skills-heading">Skills</h2>
    <ul class="skills-list" aria-labelledby="skills-heading">
      ${Array.from(block.children).map(row => `
        <li>
          <span class="skill-tag" tabindex="0" role="button" aria-pressed="false">
            ${row.children[0].textContent}
          </span>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(skillsSection);

  // Add interactivity to skill tags
  const skillTags = skillsSection.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      tag.setAttribute('aria-pressed', tag.classList.contains('active'));
    });
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tag.click();
      }
    });
  });
}