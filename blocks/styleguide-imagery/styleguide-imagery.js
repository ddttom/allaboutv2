export default function decorate(block) {
  const imagery = {
    photos: [
      { src: 'https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg', alt: 'News image' },
      { src: 'https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg', alt: 'Sport image' },
    ],
    icons: [
      { name: 'Search', svg: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>' },
      { name: 'Menu', svg: '<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>' },
    ],
  };

  const photosSection = document.createElement('div');
  photosSection.classList.add('imagery-section');
  photosSection.innerHTML = `
    <h3>Photos</h3>
    <div class="photo-gallery">
      ${imagery.photos.map(photo => `<img src="${photo.src}" alt="${photo.alt}">`).join('')}
    </div>
  `;

  const iconsSection = document.createElement('div');
  iconsSection.classList.add('imagery-section');
  iconsSection.innerHTML = `
    <h3>Icons</h3>
    <div class="icon-gallery">
      ${imagery.icons.map(icon => `
        <div class="icon-item">
          <div class="icon">${icon.svg}</div>
          <p>${icon.name}</p>
        </div>
      `).join('')}
    </div>
  `;

  block.append(photosSection, iconsSection);
}