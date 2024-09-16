export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-education';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Education';
  container.appendChild(title);

  const educationList = document.createElement('ul');
  educationList.className = 'education-list';

  [...block.children].forEach((row) => {
    const [institution, degree, duration] = [...row.children].map(cell => cell.textContent.trim());
    
    const listItem = document.createElement('li');
    listItem.className = 'education-item';
    
    const institutionElement = document.createElement('h3');
    institutionElement.className = 'institution';
    institutionElement.textContent = institution;
    
    const degreeElement = document.createElement('p');
    degreeElement.className = 'degree';
    degreeElement.textContent = degree;
    
    const durationElement = document.createElement('p');
    durationElement.className = 'duration';
    durationElement.textContent = duration;
    
    listItem.appendChild(institutionElement);
    listItem.appendChild(degreeElement);
    listItem.appendChild(durationElement);
    
    educationList.appendChild(listItem);
  });

  container.appendChild(educationList);
  block.textContent = '';
  block.appendChild(container);
}