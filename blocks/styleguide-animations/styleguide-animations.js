export default function decorate(block) {
  const animations = [
    { name: 'Transitions', html: `
      <button class="transition-demo">Hover me</button>
    `},
    { name: 'Hover Effects', html: `
      <div class="hover-demo">Hover me</div>
    `},
  ];

  animations.forEach(animation => {
    const section = document.createElement('div');
    section.classList.add('animation-section');
    section.innerHTML = `
      <h3>${animation.name}</h3>
      <div class="animation-demo">${animation.html}</div>
    `;
    block.appendChild(section);
  });
}