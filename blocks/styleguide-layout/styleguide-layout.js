export default function decorate(block) {
  const layoutInfo = {
    grid: 'Based on a 12-column grid system',
    breakpoints: [
      { name: 'Mobile', size: '< 600px' },
      { name: 'Tablet', size: '600px - 1007px' },
      { name: 'Desktop', size: '≥ 1008px' },
    ],
  };

  const gridSection = document.createElement('div');
  gridSection.classList.add('layout-section');
  gridSection.innerHTML = `
    <h3>Grid System</h3>
    <p>${layoutInfo.grid}</p>
    <div class="grid-demo"></div>
  `;

  const breakpointsSection = document.createElement('div');
  breakpointsSection.classList.add('layout-section');
  breakpointsSection.innerHTML = `
    <h3>Breakpoints</h3>
    <ul>
      ${layoutInfo.breakpoints.map(bp => `<li>${bp.name}: ${bp.size}</li>`).join('')}
    </ul>
  `;

  block.append(gridSection, breakpointsSection);
}