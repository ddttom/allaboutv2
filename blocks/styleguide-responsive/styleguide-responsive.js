export default function decorate(block) {
  const devices = ['mobile', 'tablet', 'desktop'];
  
  devices.forEach(device => {
    const deviceSection = document.createElement('div');
    deviceSection.classList.add('responsive-section', device);
    
    const title = document.createElement('h3');
    title.textContent = device.charAt(0).toUpperCase() + device.slice(1);
    
    const demo = document.createElement('div');
    demo.classList.add('responsive-demo');
    demo.innerHTML = `
      <div class="demo-header"></div>
      <div class="demo-content">
        <div class="demo-sidebar"></div>
        <div class="demo-main"></div>
      </div>
      <div class="demo-footer"></div>
    `;
    
    deviceSection.appendChild(title);
    deviceSection.appendChild(demo);
    block.appendChild(deviceSection);
  });
}