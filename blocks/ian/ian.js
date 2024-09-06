export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('ian-bubble-container');
  block.appendChild(container);

  const button = document.createElement('button');
  button.textContent = 'Blow Bubbles';
  button.classList.add('ian-bubble-button');
  block.appendChild(button);

  button.addEventListener('click', () => {
    createBubble(container);
  });
}

function createBubble(container) {
  const bubble = document.createElement('div');
  bubble.classList.add('ian-bubble');
  
  const size = Math.random() * 60 + 20; // Random size between 20px and 80px
  const left = Math.random() * 100; // Random horizontal position

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}%`;

  container.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 4000); // Remove bubble after 4 seconds
}