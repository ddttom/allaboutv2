export default async function decorate(block) {
  const title = document.createElement('h2');
  title.textContent = 'Experience';

  const experienceList = document.createElement('div');

  Array.from(block.children).forEach(row => {
    const item = document.createElement('div');
    item.className = 'import-experience-item';

    const position = document.createElement('h3');
    position.textContent = row.children[0].textContent;

    const details = document.createElement('p');
    details.textContent = row.children[1].textContent;

    item.appendChild(position);
    item.appendChild(details);
    experienceList.appendChild(item);
  });

  block.innerHTML = '';
  block.appendChild(title);
  block.appendChild(experienceList);
}