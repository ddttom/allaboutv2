/**
 * REGINALD Registry client
 *
 * @description Loads and renders COGs from the Reginald API
 * @version 0.1.0
 * @author Tom Cranstoun
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags reginald, registry, cogs
 */

let allCogs = [];

async function loadCogs() {
  try {
    const response = await fetch('/reginald/api/v1/cogs.json');
    const data = await response.json();
    allCogs = data.cogs;
    updateStats(data);
    renderCogs(allCogs);
    populateFilters(allCogs);
  } catch (error) {
    document.getElementById('cog-grid').innerHTML =
      '<div class="no-results">Failed to load COGs. Please try again later.</div>';
  }
}

function updateStats(data) {
  document.getElementById('stat-total').textContent = data.total;
  document.getElementById('stat-action').textContent =
    data.cogs.filter(c => c.type === 'action-doc').length;
  document.getElementById('stat-info').textContent =
    data.cogs.filter(c => c.type === 'info-doc').length;

  const categories = new Set(data.cogs.map(c => c.category));
  document.getElementById('stat-categories').textContent = categories.size;
}

function populateFilters(cogs) {
  const categories = [...new Set(cogs.map(c => c.category))].sort();
  const select = document.getElementById('filter-category');

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function renderCogs(cogs) {
  const grid = document.getElementById('cog-grid');

  if (cogs.length === 0) {
    grid.innerHTML = '<div class="no-results">No COGs match your search.</div>';
    return;
  }

  grid.innerHTML = cogs.map(cog => `
    <div class="cog-card">
      <h3>${cog.name}</h3>
      <p class="description">${cog.description || 'No description'}</p>
      <div class="meta">
        <span class="tag category">${cog.category}</span>
        <span class="tag type">${cog.type}</span>
        <span class="tag">v${cog.version}</span>
      </div>
      <div class="meta">
        ${(cog.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="links">
        <a href="${cog.url}">Metadata</a>
        <a href="${cog.url.replace('latest.json', 'content.md')}">Raw COG</a>
      </div>
    </div>
  `).join('');
}

function filterCogs() {
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('filter-category').value;
  const type = document.getElementById('filter-type').value;

  const filtered = allCogs.filter(cog => {
    const matchesSearch = !search ||
      cog.name.toLowerCase().includes(search) ||
      (cog.description || '').toLowerCase().includes(search) ||
      (cog.tags || []).some(t => t.toLowerCase().includes(search));

    const matchesCategory = !category || cog.category === category;
    const matchesType = !type || cog.type === type;

    return matchesSearch && matchesCategory && matchesType;
  });

  renderCogs(filtered);
}

// Event listeners.
document.getElementById('search').addEventListener('input', filterCogs);
document.getElementById('filter-category').addEventListener('change', filterCogs);
document.getElementById('filter-type').addEventListener('change', filterCogs);

// Load on page ready.
loadCogs();
