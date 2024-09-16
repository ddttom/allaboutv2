export default function decorate(block) {
  const experienceSection = document.createElement('div');
  experienceSection.classList.add('experience-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Experience';

  experienceSection.appendChild(title);

  const experienceList = document.createElement('ul');
  experienceList.classList.add('experience-list');

  [...block.children].forEach((row) => {
    const [company, role, duration] = [...row.children].map(cell => cell.textContent);

    const listItem = document.createElement('li');
    listItem.classList.add('experience-item');

    const roleElement = document.createElement('h3');
    roleElement.textContent = role;

    const companyElement = document.createElement('p');
    companyElement.classList.add('company');
    companyElement.textContent = company;

    const durationElement = document.createElement('p');
    durationElement.classList.add('duration');
    durationElement.textContent = duration;

    listItem.appendChild(roleElement);
    listItem.appendChild(companyElement);
    listItem.appendChild(durationElement);

    experienceList.appendChild(listItem);
  });

  experienceSection.appendChild(experienceList);

  block.textContent = '';
  block.appendChild(experienceSection);
}