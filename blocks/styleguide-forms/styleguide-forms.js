export default function decorate(block) {
  const formElements = [
    { name: 'Input Fields', html: `
      <input type="text" placeholder="Text input">
      <input type="email" placeholder="Email input">
      <textarea placeholder="Textarea"></textarea>
    `},
    { name: 'Checkboxes', html: `
      <label><input type="checkbox"> Checkbox 1</label>
      <label><input type="checkbox"> Checkbox 2</label>
    `},
    { name: 'Radio Buttons', html: `
      <label><input type="radio" name="radio"> Radio 1</label>
      <label><input type="radio" name="radio"> Radio 2</label>
    `},
  ];

  formElements.forEach(element => {
    const section = document.createElement('div');
    section.classList.add('form-section');
    section.innerHTML = `
      <h3>${element.name}</h3>
      <div class="form-demo">${element.html}</div>
    `;
    block.appendChild(section);
  });
}