export default function decorate(block) {
  const skillsSection = document.createElement('div');
  skillsSection.classList.add('skills-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Skills';

  skillsSection.appendChild(title);

  const skillsList = document.createElement('ul');
  skillsList.classList.add('skills-list');

  [...block.children].forEach((row) => {
    const skill = row.textContent.trim();

    const listItem = document.createElement('li');
    listItem.classList.add('skill-item');
    listItem.textContent = skill;

    skillsList.appendChild(listItem);
  });

  skillsSection.appendChild(skillsList);

  block.textContent = '';
  block.appendChild(skillsSection);
}