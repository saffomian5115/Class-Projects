/* ============================================
   FOUR WHEELS — VEHICLES JS
   Filter, Sort, Search, Paginate, Compare
   ============================================ */

// ===== DEMO DATA =====
const ALL_VEHICLES = [
  { id:1,  title:'Toyota Corolla Altis 2022', brand:'Toyota', price:6800000, city:'Lahore',     type:'Car',   year:2022, mileage:'28,000 km', fuel:'Petrol',  condition:'Used',    badge:'featured', emoji:'🚗' },
  { id:2,  title:'Honda Civic Oriel 2021',    brand:'Honda',  price:7200000, city:'Karachi',    type:'Car',   year:2021, mileage:'35,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚙' },
  { id:3,  title:'Suzuki Cultus 2023',        brand:'Suzuki', price:3100000, city:'Islamabad',  type:'Car',   year:2023, mileage:'12,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚘' },
  { id:4,  title:'Yamaha YBR 125 2023',       brand:'Yamaha', price:380000,  city:'Multan',     type:'Bike',  year:2023, mileage:'8,500 km',  fuel:'Petrol',  condition:'Used',    badge:'',         emoji:'🏍️' },
  { id:5,  title:'Toyota Hilux Revo 2020',    brand:'Toyota', price:11500000,city:'Peshawar',   type:'Truck', year:2020, mileage:'55,000 km', fuel:'Diesel',  condition:'Used',    badge:'featured', emoji:'🛻' },
  { id:6,  title:'KIA Sportage AWD 2022',     brand:'KIA',    price:9800000, city:'Lahore',     type:'SUV',   year:2022, mileage:'22,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚐' },
  { id:7,  title:'Honda CD 70 2024',          brand:'Honda',  price:175000,  city:'Faisalabad', type:'Bike',  year:2024, mileage:'2,000 km',  fuel:'Petrol',  condition:'New',     badge:'',         emoji:'🏍️' },
  { id:8,  title:'Suzuki Wagon R AGS 2023',   brand:'Suzuki', price:3400000, city:'Karachi',    type:'Car',   year:2023, mileage:'18,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚗' },
  { id:9,  title:'Toyota Fortuner 2021',      brand:'Toyota', price:14500000,city:'Islamabad',  type:'SUV',   year:2021, mileage:'40,000 km', fuel:'Diesel',  condition:'Used',    badge:'featured', emoji:'🚙' },
  { id:10, title:'Honda City 1.2 2022',       brand:'Honda',  price:4900000, city:'Rawalpindi', type:'Car',   year:2022, mileage:'30,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚗' },
  { id:11, title:'Suzuki Alto VXR 2024',      brand:'Suzuki', price:2650000, city:'Multan',     type:'Car',   year:2024, mileage:'5,000 km',  fuel:'Petrol',  condition:'New',     badge:'',         emoji:'🚘' },
  { id:12, title:'KIA Picanto 2023',          brand:'KIA',    price:4100000, city:'Lahore',     type:'Car',   year:2023, mileage:'14,000 km', fuel:'Petrol',  condition:'Used',    badge:'',         emoji:'🚗' },
  { id:13, title:'Hyundai Tucson 2022',       brand:'Hyundai',price:8900000, city:'Karachi',    type:'SUV',   year:2022, mileage:'25,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚐' },
  { id:14, title:'Toyota Vitz 2019',          brand:'Toyota', price:2800000, city:'Peshawar',   type:'Car',   year:2019, mileage:'65,000 km', fuel:'Petrol',  condition:'Used',    badge:'',         emoji:'🚙' },
  { id:15, title:'United Bravo 2023',         brand:'United', price:1850000, city:'Faisalabad', type:'Car',   year:2023, mileage:'10,000 km', fuel:'Petrol',  condition:'Used',    badge:'',         emoji:'🚗' },
  { id:16, title:'Prince Pearl 2024',         brand:'Prince', price:2100000, city:'Multan',     type:'Car',   year:2024, mileage:'3,000 km',  fuel:'Petrol',  condition:'New',     badge:'',         emoji:'🚘' },
  { id:17, title:'Honda CB150F 2023',         brand:'Honda',  price:420000,  city:'Lahore',     type:'Bike',  year:2023, mileage:'11,000 km', fuel:'Petrol',  condition:'Used',    badge:'',         emoji:'🏍️' },
  { id:18, title:'Toyota Land Cruiser 2020',  brand:'Toyota', price:35000000,city:'Islamabad',  type:'SUV',   year:2020, mileage:'48,000 km', fuel:'Diesel',  condition:'Used',    badge:'featured', emoji:'🚙' },
  { id:19, title:'Suzuki Bolan 2022',         brand:'Suzuki', price:1600000, city:'Rawalpindi', type:'Truck', year:2022, mileage:'32,000 km', fuel:'CNG',     condition:'Used',    badge:'',         emoji:'🛻' },
  { id:20, title:'MG HS 2023',               brand:'MG',     price:9500000, city:'Karachi',    type:'SUV',   year:2023, mileage:'15,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚐' },
  { id:21, title:'Honda Fit Hybrid 2020',     brand:'Honda',  price:4500000, city:'Lahore',     type:'Car',   year:2020, mileage:'42,000 km', fuel:'Hybrid',  condition:'Used',    badge:'',         emoji:'🚗' },
  { id:22, title:'Changan Alsvin 2023',       brand:'Changan',price:4800000, city:'Multan',     type:'Car',   year:2023, mileage:'18,000 km', fuel:'Petrol',  condition:'Used',    badge:'verified', emoji:'🚘' },
  { id:23, title:'Toyota Prado 2019',         brand:'Toyota', price:16500000,city:'Islamabad',  type:'SUV',   year:2019, mileage:'60,000 km', fuel:'Diesel',  condition:'Used',    badge:'',         emoji:'🚙' },
  { id:24, title:'Yamaha R15 V4 2024',        brand:'Yamaha', price:980000,  city:'Karachi',    type:'Bike',  year:2024, mileage:'1,500 km',  fuel:'Petrol',  condition:'New',     badge:'featured', emoji:'🏍️' },
];

const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let filteredData = [...ALL_VEHICLES];
let compareList = [];

// ===== RENDER CARDS =====
function renderCards(data) {
  const grid = document.getElementById('vehiclesGrid');
  const count = document.getElementById('resultsCount');

  count.innerHTML = `Showing <strong>${data.length}</strong> vehicles`;

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">🔍</div>
        <h3>NO VEHICLES FOUND</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = data.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = pageData.map(v => {
    const badgeHTML = v.badge
      ? `<div class="card-badge ${v.badge}">${v.badge.toUpperCase()}</div>` : '';
    const inCompare = compareList.includes(v.id);
    return `
      <div class="vehicle-card" data-id="${v.id}">
        <div class="compare-check-wrap">
          <input type="checkbox" class="compare-checkbox" title="Add to compare"
            ${inCompare ? 'checked' : ''} onchange="toggleCompare(${v.id}, this)"/>
        </div>
        <div class="card-img-placeholder" style="position:relative;">
          <span>${v.emoji}</span>
          ${badgeHTML}
        </div>
        <div class="card-body">
          <div class="card-title">${v.title}</div>
          <div class="card-price">PKR ${window.formatPrice(v.price)}</div>
          <div class="card-meta">
            <span class="card-tag">${v.year}</span>
            <span class="card-tag">${v.mileage}</span>
            <span class="card-tag">${v.fuel}</span>
            <span class="card-tag">${v.type}</span>
          </div>
          <div class="card-footer">
            <span class="card-city">${v.city}</span>
            <a href="vehicle-detail.html?id=${v.id}" class="card-btn">VIEW →</a>
          </div>
        </div>
      </div>`;
  }).join('');

  renderPagination(data.length);

  // Scroll reveal
  grid.querySelectorAll('.vehicle-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
}

// ===== PAGINATION =====
function renderPagination(total) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const pag = document.getElementById('pagination');
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = '';
  html += `<button class="page-btn" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span style="color:var(--text-muted);padding:0 4px;">…</span>`;
    }
  }
  html += `<button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="goPage(${currentPage+1})">›</button>`;
  pag.innerHTML = html;
}

window.goPage = function(p) {
  currentPage = p;
  renderCards(filteredData);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===== GET FILTERS =====
function getFilters() {
  const types = [...document.querySelectorAll('input[name="type"]:checked')].map(c => c.value);
  const cities = [...document.querySelectorAll('input[name="city"]:checked')].map(c => c.value);
  const fuels = [...document.querySelectorAll('input[name="fuel"]:checked')].map(c => c.value);
  const conds = [...document.querySelectorAll('input[name="condition"]:checked')].map(c => c.value);
  const maxPrice = parseInt(document.getElementById('priceRange').value);
  const yearFrom = parseInt(document.getElementById('yearFrom').value) || 0;
  const yearTo   = parseInt(document.getElementById('yearTo').value)   || 9999;
  const query = document.getElementById('quickSearch').value.trim().toLowerCase();
  return { types, cities, fuels, conds, maxPrice, yearFrom, yearTo, query };
}

// ===== APPLY FILTERS =====
function applyFilters() {
  const f = getFilters();
  filteredData = ALL_VEHICLES.filter(v => {
    if (f.types.length && !f.types.includes(v.type)) return false;
    if (f.cities.length && !f.cities.includes(v.city)) return false;
    if (f.fuels.length && !f.fuels.includes(v.fuel)) return false;
    if (f.conds.length && !f.conds.includes(v.condition)) return false;
    if (v.price > f.maxPrice) return false;
    if (v.year < f.yearFrom || v.year > f.yearTo) return false;
    if (f.query && !v.title.toLowerCase().includes(f.query) &&
        !v.brand.toLowerCase().includes(f.query) &&
        !v.city.toLowerCase().includes(f.query)) return false;
    return true;
  });

  applySorting();
  renderActiveTags(f);
  currentPage = 1;
  renderCards(filteredData);
}

// ===== SORTING =====
function applySorting() {
  const sort = document.getElementById('sortSelect').value;
  filteredData.sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'year-desc')  return b.year - a.year;
    if (sort === 'year-asc')   return a.year - b.year;
    return b.id - a.id; // newest = highest id
  });
}

// ===== ACTIVE TAGS =====
function renderActiveTags(f) {
  const wrap = document.getElementById('activeTags');
  let tags = [];
  f.types.forEach(t => tags.push({ label: t, key: 'type', val: t }));
  f.cities.forEach(c => tags.push({ label: c, key: 'city', val: c }));
  f.fuels.forEach(fl => tags.push({ label: fl, key: 'fuel', val: fl }));
  f.conds.forEach(cn => tags.push({ label: cn, key: 'condition', val: cn }));
  if (f.maxPrice < 20000000) tags.push({ label: 'Max PKR ' + window.formatPrice(f.maxPrice), key: 'price', val: null });

  wrap.innerHTML = tags.map(t => `
    <span class="active-tag">
      ${t.label}
      <button onclick="removeTag('${t.key}','${t.val}')">✕</button>
    </span>`).join('');
}

window.removeTag = function(key, val) {
  if (key === 'price') {
    document.getElementById('priceRange').value = 20000000;
  } else {
    const cb = document.querySelector(`input[name="${key}"][value="${val}"]`);
    if (cb) cb.checked = false;
  }
  applyFilters();
};

// ===== PRICE RANGE =====
document.getElementById('priceRange')?.addEventListener('input', function () {
  const val = parseInt(this.value);
  document.getElementById('priceMax').textContent = val >= 20000000 ? '200 Lac+' : 'PKR ' + window.formatPrice(val);
});

// ===== EVENTS =====
document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('sortSelect')?.addEventListener('change', () => { applySorting(); renderCards(filteredData); });
document.getElementById('quickSearchBtn')?.addEventListener('click', applyFilters);
document.getElementById('quickSearch')?.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });

// Clear all
document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(c => c.checked = false);
  document.getElementById('priceRange').value = 20000000;
  document.getElementById('priceMax').textContent = '200 Lac+';
  document.getElementById('yearFrom').value = '';
  document.getElementById('yearTo').value = '';
  document.getElementById('quickSearch').value = '';
  filteredData = [...ALL_VEHICLES];
  currentPage = 1;
  applySorting();
  renderCards(filteredData);
  document.getElementById('activeTags').innerHTML = '';
});

// View toggle
document.getElementById('gridViewBtn')?.addEventListener('click', () => {
  document.getElementById('vehiclesGrid').classList.remove('list-view');
  document.getElementById('gridViewBtn').classList.add('active');
  document.getElementById('listViewBtn').classList.remove('active');
});

document.getElementById('listViewBtn')?.addEventListener('click', () => {
  document.getElementById('vehiclesGrid').classList.add('list-view');
  document.getElementById('listViewBtn').classList.add('active');
  document.getElementById('gridViewBtn').classList.remove('active');
});

// Mobile sidebar
document.getElementById('filterToggleBtn')?.addEventListener('click', () => {
  document.getElementById('filterSidebar').classList.toggle('open');
});

// ===== COMPARE =====
window.toggleCompare = function(id, cb) {
  if (cb.checked) {
    if (compareList.length >= 3) {
      cb.checked = false;
      showToast('You can compare up to 3 vehicles at a time.', 'info');
      return;
    }
    compareList.push(id);
  } else {
    compareList = compareList.filter(x => x !== id);
  }
  updateCompareBar();
};

function updateCompareBar() {
  const bar = document.getElementById('compareBar');
  const slots = document.getElementById('compareSlots');

  if (compareList.length === 0) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');

  slots.innerHTML = compareList.map(id => {
    const v = ALL_VEHICLES.find(x => x.id === id);
    return `<span class="compare-slot">
      ${v.emoji} ${v.title}
      <button onclick="removeCompare(${id})">✕</button>
    </span>`;
  }).join('');
}

window.removeCompare = function(id) {
  compareList = compareList.filter(x => x !== id);
  // uncheck
  const cb = document.querySelector(`.vehicle-card[data-id="${id}"] .compare-checkbox`);
  if (cb) cb.checked = false;
  updateCompareBar();
};

document.getElementById('compareClearBtn')?.addEventListener('click', () => {
  compareList = [];
  document.querySelectorAll('.compare-checkbox').forEach(c => c.checked = false);
  updateCompareBar();
});

document.getElementById('compareNowBtn')?.addEventListener('click', () => {
  if (compareList.length < 2) {
    showToast('Select at least 2 vehicles to compare.', 'info');
    return;
  }
  buildCompareTable();
  document.getElementById('compareModal').classList.add('open');
});

document.getElementById('closeCompareModal')?.addEventListener('click', () => {
  document.getElementById('compareModal').classList.remove('open');
});

function buildCompareTable() {
  const vehicles = compareList.map(id => ALL_VEHICLES.find(v => v.id === id));
  const rows = [
    { label: '', key: 'emoji', isEmoji: true },
    { label: 'VEHICLE', key: 'title' },
    { label: 'PRICE', key: 'price', fmt: v => 'PKR ' + window.formatPrice(v) },
    { label: 'YEAR', key: 'year' },
    { label: 'TYPE', key: 'type' },
    { label: 'FUEL', key: 'fuel' },
    { label: 'MILEAGE', key: 'mileage' },
    { label: 'CITY', key: 'city' },
    { label: 'CONDITION', key: 'condition' },
  ];

  const wrap = document.getElementById('compareTableWrap');
  let html = `<table class="compare-table">`;
  rows.forEach(r => {
    const isEmoji = r.isEmoji;
    html += `<tr class="${isEmoji ? 'compare-emoji-row' : ''}">`;
    html += `<td class="row-label">${r.label}</td>`;
    vehicles.forEach(v => {
      const val = r.fmt ? r.fmt(v[r.key]) : v[r.key];
      const cls = r.key === 'price' ? 'compare-price' : '';
      html += `<td class="${cls}">${val}</td>`;
    });
    html += `</tr>`;
  });
  html += `</table>`;
  wrap.innerHTML = html;
}

// ===== URL PARAMS (from home search) =====
(function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const city = params.get('city');

  if (type && type !== 'All Types') {
    const cb = document.querySelector(`input[name="type"][value="${type}"]`);
    if (cb) cb.checked = true;
  }
  if (city && city !== 'All Cities') {
    const cb = document.querySelector(`input[name="city"][value="${city}"]`);
    if (cb) cb.checked = true;
  }
})();

// ===== BACKEND FETCH WITH LOCAL FALLBACK =====
async function loadVehiclesFromAPI() {
  try {
    const urlP   = new URLSearchParams(window.location.search);
    const params = new URLSearchParams({ limit: 50 });
    if (urlP.get('type') && urlP.get('type') !== 'All Types') params.set('type', urlP.get('type'));
    if (urlP.get('city') && urlP.get('city') !== 'All Cities') params.set('city', urlP.get('city'));

    const res  = await fetch('http://localhost:5000/api/vehicles?' + params.toString());
    const data = await res.json();

    if (data.success && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
      const typeEmoji = { Car:'🚗', SUV:'🚙', Bike:'🏍️', Truck:'🛻', Other:'🚘' };
      ALL_VEHICLES.length = 0;
      data.vehicles.forEach(v => {
        ALL_VEHICLES.push({
          id:        v._id,
          title:     v.title,
          brand:     v.brand || '',
          price:     v.price,
          city:      v.city,
          type:      v.type,
          year:      v.year,
          mileage:   v.mileage ? Number(v.mileage).toLocaleString() + ' km' : '0 km',
          fuel:      v.fuel,
          condition: v.condition,
          badge:     v.featured ? 'featured' : 'verified',
          emoji:     typeEmoji[v.type] || '🚗',
        });
      });
    }
  } catch (_) {
    // Backend offline — local demo data stays as-is
  } finally {
    filteredData = [...ALL_VEHICLES];
    applySorting();
    renderCards(filteredData);
  }
}

// ===== INIT =====
setTimeout(loadVehiclesFromAPI, 600);
