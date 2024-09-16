export default async function decorate(block) {
  const resp = await fetch('/blocks/styleguide-components/styleguide-components.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load components data');
    return;
  }
  const json = await resp.json();

  const componentsContainer = document.createElement('div');
  componentsContainer.classList.add('styleguide-components');

  json.components.forEach((component) => {
    const componentSection = document.createElement('div');
    componentSection.classList.add('component-section');

    const componentTitle = document.createElement('h3');
    componentTitle.textContent = component.name;
    componentSection.appendChild(componentTitle);

    const componentDescription = document.createElement('p');
    componentDescription.textContent = component.description;
    componentSection.appendChild(componentDescription);

    const componentExample = document.createElement('div');
    componentExample.classList.add('component-example');
    componentExample.innerHTML = component.example;
    componentSection.appendChild(componentExample);

    const componentUsage = document.createElement('pre');
    componentUsage.classList.add('component-usage');
    componentUsage.textContent = component.usage;
    componentSection.appendChild(componentUsage);

    componentsContainer.appendChild(componentSection);
  });

  block.textContent = '';
  block.appendChild(componentsContainer);
}