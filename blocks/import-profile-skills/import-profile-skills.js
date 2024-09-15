export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-skills');

  const heading = document.createElement('h2');
  heading.textContent = 'Skills';
  container.appendChild(heading);

  const skillsList = document.createElement('ul');
  skillsList.classList.add('skills-list');

  const skills = block.textContent.split(',').map(skill => skill.trim());

  skills.forEach((skill) => {
    const listItem = document.createElement('li');
    listItem.textContent = skill;
    skillsList.appendChild(listItem);
  });

  container.appendChild(skillsList);
  block.textContent = '';
  block.appendChild(container);
}