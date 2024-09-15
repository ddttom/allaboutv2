export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('skills-container');

  const title = document.createElement('h2');
  title.textContent = 'Skills';
  container.appendChild(title);

  const skillsList = document.createElement('ul');
  skillsList.classList.add('skills-list');

  const skills = Array.from(block.children);
  skills.forEach((skill) => {
    const skillItem = document.createElement('li');
    skillItem.textContent = skill.textContent;
    skillsList.appendChild(skillItem);
  });

  container.appendChild(skillsList);

  block.textContent = '';
  block.appendChild(container);
}