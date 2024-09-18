export default async function decorate(block) {
  const experienceSection = document.createElement('div');
  experienceSection.className = 'section-card experience-section';
  const experiences = Array.from(block.children);

  const createExperienceItem = (row) => {
    const title = row.children[0]?.textContent || 'Job Title';
    return `
      <li>
        <div>
          <h3>${title}</h3>
        </div>
      </li>
    `;
  };

  experienceSection.innerHTML = `
    <h2>Experience</h2>
    <ul class="experience-list">
      ${experiences.map(createExperienceItem).join('')}
    </ul>
  `;

  block.textContent = '';
  block.appendChild(experienceSection);
}