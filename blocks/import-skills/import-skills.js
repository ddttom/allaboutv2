export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-skills';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Skills';
  container.appendChild(title);

  const skillsList = document.createElement('ul');
  skillsList.className = 'skills-list';

  [...block.children].forEach((row) => {
    const skill = row.textContent.trim();
    
    const listItem = document.createElement('li');
    listItem.className = 'skill-item';
    listItem.textContent = skill;
    
    skillsList.appendChild(listItem);
  });

  container.appendChild(skillsList);
  block.textContent = '';
  block.appendChild(container);
}