export default function decorate(block) {
  const educationSection = document.createElement('section');
  educationSection.classList.add('education-section');

  const title = document.createElement('h2');
  title.textContent = 'Education';

  const educationList = document.createElement('ul');

  Array.from(block.children).forEach(item => {
    const listItem = document.createElement('li');
    const school = document.createElement('h3');
    school.textContent = item.children[0].textContent;
    const degree = document.createElement('p');
    degree.textContent = item.children[1].textContent;
    
    listItem.appendChild(school);
    listItem.appendChild(degree);
    educationList.appendChild(listItem);
  });

  educationSection.appendChild(title);
  educationSection.appendChild(educationList);

  block.textContent = '';
  block.appendChild(educationSection);
}
