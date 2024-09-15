export default function decorate(block) {
  const components = [
    { name: 'Buttons', html: `
      <button class="bbc-button primary">Primary Button</button>
      <button class="bbc-button secondary">Secondary Button</button>
    `},
    { name: 'Cards', html: `
      <div class="bbc-card">
        <img src="https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg" alt="Sample image">
        <h3>Card Title</h3>
        <p>Card description goes here.</p>
      </div>
    `},
    { name: 'Search', html: `
      <div class="bbc-search">
        <input type="text" placeholder="Search BBC">
        <button>Search</button>
      </div>
    `},
  ];

  components.forEach(component => {
    const componentSection = document.createElement('div');
    componentSection.classList.add('component-section');
    componentSection.innerHTML = `
      <h3>${component.name}</h3>
      <div class="component-demo">${component.html}</div>
    `;
    block.appendChild(componentSection);
  });
}