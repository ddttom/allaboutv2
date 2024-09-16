export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-experience';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Experience';
  container.appendChild(title);

  const experienceList = document.createElement('ul');
  experienceList.className = 'experience-list';

  [...block.children].forEach((row) => {
    const [company, position, duration] = [...row.children].map(cell => cell.textContent.trim());
    
    const listItem = document.createElement('li');
    listItem.className = 'experience-item';
    
    const companyElement = document.createElement('h3');
    companyElement.className = 'company';
    companyElement.textContent = company;
    
    const positionElement = document.createElement('p');
    positionElement.className = 'position';
    positionElement.textContent = position;
    
    const durationElement = document.createElement('p');
    durationElement.className = 'duration';
    durationElement.textContent = duration;
    
    listItem.appendChild(companyElement);
    listItem.appendChild(positionElement);
    listItem.appendChild(durationElement);
    
    experienceList.appendChild(listItem);
  });

  container.appendChild(experienceList);
  block.textContent = '';
  block.appendChild(container);
}