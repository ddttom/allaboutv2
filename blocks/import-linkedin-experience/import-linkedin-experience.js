export default function decorate(block) {
  const experienceSection = document.createElement('section');
  experienceSection.classList.add('experience-section');

  const title = document.createElement('h2');
  title.textContent = 'Experience';

  const experienceList = document.createElement('ul');

  Array.from(block.children).forEach(item => {
    const listItem = document.createElement('li');
    const company = document.createElement('h3');
    company.textContent = item.children[0].textContent;
    const position = document.createElement('p');
    position.textContent = item.children[1].textContent;
    
    listItem.appendChild(company);
    listItem.appendChild(position);
    experienceList.appendChild(listItem);
  });

  experienceSection.appendChild(title);
  experienceSection.appendChild(experienceList);

  block.textContent = '';
  block.appendChild(experienceSection);
}
