export default function decorate(block) {
  const skillsSection = document.createElement('section');
  skillsSection.classList.add('skills-section');

  const title = document.createElement('h2');
  title.textContent = 'Skills';

  const skillsList = document.createElement('ul');

  Array.from(block.children).forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.textContent;
    skillsList.appendChild(listItem);
  });

  skillsSection.appendChild(title);
  skillsSection.appendChild(skillsList);

  block.textContent = '';
  block.appendChild(skillsSection);
}
