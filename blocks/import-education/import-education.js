export default async function decorate(block) {
  const educationSection = document.createElement('div');
  educationSection.className = 'section-card education-section';
  const educations = Array.from(block.children);

  const createEducationItem = (row) => {
    const school = row.children[0]?.textContent || 'School';
    return `
      <li>
        <div>
          <h3>${school}</h3>
        </div>
      </li>
    `;
  };

  educationSection.innerHTML = `
    <h2>Education</h2>
    <ul class="education-list">
      ${educations.map(createEducationItem).join('')}
    </ul>
  `;

  block.textContent = '';
  block.appendChild(educationSection);
}