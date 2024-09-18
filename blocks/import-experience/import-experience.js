export default async function decorate(block) {
  const experienceSection = document.createElement('div');
  experienceSection.className = 'section-card experience-section';
  const experiences = Array.from(block.children);
  const initialDisplay = experiences.slice(0, 3);
  const remainingExperiences = experiences.slice(3);

  const createExperienceItem = (row) => {
    const [logo, title, company, duration] = row.children;
    return `
      <li>
        <img data-src="${logo.textContent}" alt="${company.textContent} Logo">
        <div>
          <h3>${title.textContent}</h3>
          <p class="company">${company.textContent}</p>
          <p class="duration">${duration.textContent}</p>
        </div>
      </li>
    `;
  };

  experienceSection.innerHTML = `
    <h2>Experience</h2>
    <ul class="experience-list">
      ${initialDisplay.map(createExperienceItem).join('')}
    </ul>
    ${remainingExperiences.length > 0 ? `
      <ul class="experience-list hidden" id="remaining-experiences">
        ${remainingExperiences.map(createExperienceItem).join('')}
      </ul>
      <button class="see-more-btn" id="see-more-experiences" aria-expanded="false" aria-controls="remaining-experiences">
        See more
      </button>
    ` : ''}
  `;

  block.textContent = '';
  block.appendChild(experienceSection);

  const seeMoreBtn = experienceSection.querySelector('#see-more-experiences');
  const remainingExperiencesList = experienceSection.querySelector('#remaining-experiences');

  if (seeMoreBtn && remainingExperiencesList) {
    seeMoreBtn.addEventListener('click', () => {
      const isExpanded = remainingExperiencesList.classList.toggle('hidden');
      seeMoreBtn.textContent = isExpanded ? 'See more' : 'See less';
      seeMoreBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }
}