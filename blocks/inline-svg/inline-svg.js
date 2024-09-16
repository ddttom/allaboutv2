export default function decorate(block) {
  const svg = block.querySelector('img');
  if (svg) {
    // Create a full-width wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'inline-svg-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    // ... existing code ...
  }
}