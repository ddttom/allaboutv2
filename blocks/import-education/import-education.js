export default async function decorate(block) {
  const educationSection = document.createElement('div');
  educationSection.className = 'section-card education-section';
  const educations = Array.from(block.children);
  const initialDisplay = educations.slice(0, 2);
  const remainingEducations = educations.slice(2);

  const createEducationItem = (row) => {
    const [logo, school, degree, duration] = row.children;
    return `
      <li>
        <img data-src="${logo.textContent}" alt="${school.textContent} Logo">
        <div>
          <h3>${school.textContent}</h3>
          <p class="degree">${degree.textContent}</p>
          <p class="duration">${duration.textContent}</p>
        </div>
      </li>
    `;
  };

  educationSection.innerHTML = `
    <h2>Education</h2>
    <ul class="education-list">
      ${initialDisplay.map(createEducationItem).join('')}
    </ul>
    ${remainingEducations.length > 0 ? `
      <ul class="education-list hidden" id="remaining-educations">
        ${remainingEducations.map(createEducationItem).join('')}
      </ul>
      <button class="see-more-btn" id="see-more-educations" aria-expanded="false" aria-controls="remaining-educations">
        See more
      </button>
    ` : ''}
  `;

  block.textContent = '';
  block.appendChild(educationSection);

  const seeMoreBtn = educationSection.querySelector('#see-more-educations');
  const remainingEducationsList = educationSection.querySelector('#remaining-educations');

  if (seeMoreBtn && remainingEducationsList) {
    seeMoreBtn.addEventListener('click', () => {
      const isExpanded = remainingEducationsList.classList.toggle('hidden');
      seeMoreBtn.textContent = isExpanded ? 'See more' : 'See less';
      seeMoreBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }
}