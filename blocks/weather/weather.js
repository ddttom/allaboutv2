import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const apiKey = getMetadata('weather-api-key');
  const container = document.createElement('div');
  block.appendChild(container);

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    container.innerHTML = `
      <div class="weather-info">
        <h2>${data.name}</h2>
        <p>${Math.round(data.main.temp)}°C</p>
        <p>${data.weather[0].description}</p>
      </div>
    `;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching weather:', error);
    container.innerHTML = '<p>Unable to fetch weather information</p>';
  }
}