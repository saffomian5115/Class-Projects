/* ============================================
   FOUR WHEELS — DETAIL JS
   Vehicle Detail Page Logic
   ============================================ */

// Same demo data (in real app this comes from API)
const VEHICLES_DB = [
  { id:1,  title:'Toyota Corolla Altis 2022', brand:'Toyota', price:6800000, city:'Lahore',     type:'Car',   year:2022, mileage:'28,000 km', fuel:'Petrol',  condition:'Used', badge:'featured', emoji:'🚗', engine:'1800cc', transmission:'Automatic', color:'Pearl White', seller:{name:'Ahmed Raza', phone:'0312-3456789', joined:'Jan 2024', listings:4}, views:342, saved:28, desc:'Well maintained Toyota Corolla Altis 1.8. Single owner. All original paint. Recently serviced. New tyres. AC working perfectly. Available for test drive in Lahore.' },
  { id:2,  title:'Honda Civic Oriel 2021',    brand:'Honda',  price:7200000, city:'Karachi',    type:'Car',   year:2021, mileage:'35,000 km', fuel:'Petrol',  condition:'Used', badge:'verified', emoji:'🚙', engine:'1500cc Turbo', transmission:'CVT', color:'Lunar Silver', seller:{name:'Sara Khan', phone:'0333-9876543', joined:'Mar 2023', listings:2}, views:518, saved:45, desc:'Honda Civic 1.5 Turbo Oriel. Immaculate condition. All factory features intact. Sunroof, Honda Sensing. No accidents. Clear documents.' },
  { id:3,  title:'Suzuki Cultus 2023',        brand:'Suzuki', price:3100000, city:'Islamabad',  type:'Car',   year:2023, mileage:'12,000 km', fuel:'Petrol',  condition:'Used', badge:'verified', emoji:'🚘', engine:'1000cc', transmission:'Manual', color:'Graphite Grey', seller:{name:'Bilal Ahmed', phone:'0321-1112233', joined:'Jun 2023', listings:1}, views:201, saved:18, desc:'Suzuki Cultus AGS 1.0. Low mileage, excellent fuel economy. Islamabad registered. No major repairs needed.' },
  { id:4,  title:'Yamaha YBR 125 2023',       brand:'Yamaha', price:380000,  city:'Multan',     type:'Bike',  year:2023, mileage:'8,500 km',  fuel:'Petrol',  condition:'Used', badge:'', emoji:'🏍️', engine:'125cc', transmission:'Manual', color:'Blue/Black', seller:{name:'Usman Ali', phone:'0300-4445566', joined:'Feb 2024', listings:3}, views:89, saved:7, desc:'Yamaha YBR 125G. Good condition. Regular oil changes done. Perfect for daily commute.' },
  { id:5,  title:'Toyota Hilux Revo 2020',    brand:'Toyota', price:11500000,city:'Peshawar',   type:'Truck', year:2020, mileage:'55,000 km', fuel:'Diesel',  condition:'Used', badge:'featured', emoji:'🛻', engine:'2800cc Diesel', transmission:'Manual', color:'White', seller:{name:'Khan Sahib', phone:'0345-7778899', joined:'Nov 2022', listings:6}, views:623, saved:52, desc:'Toyota Hilux Revo 4x4. Powerful diesel engine. Used for off-road trips. All genuine parts. Perfect for tough terrain.' },
  { id:6,  title:'KIA Sportage AWD 2022',     brand:'KIA',    price:9800000, city:'Lahore',     type:'SUV',   year:2022, mileage:'22,000 km', fuel:'Petrol',  condition:'Used', badge:'verified', emoji:'🚐', engine:'2000cc', transmission:'Automatic', color:'Snow White Pearl', seller:{name:'Zara Malik', phone:'0311-2223344', joined:'May 2023', listings:1}, views:445, saved:39, desc:'KIA Sportage Alpha AWD. Loaded with features. Panoramic sunroof, 10.25 inch display, heated seats. Single owner family used vehicle.' },
  { id:7,  title:'Honda CD 70 2022',          brand:'Honda',  price:175000,  city:'Faisalabad', type:'Bike',  year:2022, mileage:'2,000 km',  fuel:'Petrol',  condition:'New', badge:'', emoji:'🏍️', engine:'70cc', transmission:'Manual', color:'Red', seller:{name:'Faisal Bros', phone:'0341-5556677', joined:'Jan 2025', listings:8}, views:143, saved:11, desc:'Honda CD70 almost new. Only 2000km driven. All documents clear. Excellent fuel average.' },
  { id:8,  title:'Suzuki Wagon R AGS 2023',   brand:'Suzuki', price:3400000, city:'Karachi',    type:'Car',   year:2023, mileage:'18,000 km', fuel:'Petrol',  condition:'Used', badge:'verified', emoji:'🚗', engine:'1000cc', transmission:'Automatic', color:'Solid White', seller:{name:'Amina Siddiqui', phone:'0321-8889900', joined:'Sep 2023', listings:2}, views:267, saved:24, desc:'Suzuki Wagon R VXL AGS. Automatic gear. Very comfortable for city driving. Well maintained, no denting painting.' },
];

// ===== LOAD VEHICLE (API first, local fallback) =====
const _urlParams  = new URLSearchParams(window.location.search);
const _vehicleId  = _urlParams.get('id') || '1';

async function loadVehicleDetail() {
  let vehicle = null;

  // Try backend first
  try {
    const res  = await fetch('http://localhost:5000/api/vehicles/' + _vehicleId);
    const data = await res.json();
    if (data.success && data.vehicle) {
      const v = data.vehicle;
      const sel = v.seller || {};
      vehicle = {
        id:           v._id,
        title:        v.title,
        brand:        v.brand,
        price:        v.price,
        city:         v.city,
        type:         v.type,
        year:         v.year,
        mileage:      v.mileage ? Number(v.mileage).toLocaleString() + ' km' : '—',
        fuel:         v.fuel,
        condition:    v.condition,
        badge:        v.featured ? 'featured' : 'verified',
        emoji:        { Car:'🚗', SUV:'🚙', Bike:'🏍️', Truck:'🛻', Other:'🚘' }[v.type] || '🚗',
        engine:       v.engine || '—',
        transmission: v.transmission || '—',
        color:        v.color || '—',
        views:        v.views || 0,
        saved:        v.saved || 0,
        desc:         v.description || '',
        seller: {
          name:     sel.firstName ? sel.firstName + ' ' + (sel.lastName || '') : 'Seller',
          phone:    sel.phone || '—',
          joined:   sel.createdAt ? new Date(sel.createdAt).toLocaleDateString('en-PK', { month:'short', year:'numeric' }) : '',
          listings: 0,
        },
      };
      if (Array.isArray(data.similar)) {
        window._similarVehicles = data.similar;
      }
    }
  } catch (_) {}

  // Fallback to local demo data
  if (!vehicle) {
    const numId = parseInt(_vehicleId);
    vehicle = VEHICLES_DB.find(v => v.id === numId) || VEHICLES_DB[0];
  }

  populateDetail(vehicle);
}

function populateDetail(vehicle) {

// ===== POPULATE PAGE =====
document.title = `${vehicle.title} — Four Wheels`;
document.getElementById('bcTitle').textContent = vehicle.title;
document.getElementById('mainEmoji').textContent = vehicle.emoji;
document.getElementById('detailTitle').textContent = vehicle.title;
document.getElementById('detailPrice').textContent = `PKR ${window.formatPrice(vehicle.price)}`;
document.getElementById('descText').textContent = vehicle.desc;
document.getElementById('mapCityLabel').textContent = `${vehicle.city}, Pakistan`;
document.getElementById('priceBadge').textContent = vehicle.badge ? vehicle.badge.toUpperCase() : 'LISTED';
if (!vehicle.badge) {
  document.getElementById('priceBadge').style.background = 'rgba(0,102,255,0.1)';
  document.getElementById('priceBadge').style.borderColor = 'rgba(0,102,255,0.3)';
  document.getElementById('priceBadge').style.color = 'var(--neon-blue)';
}

// Meta tags
document.getElementById('detailMetaRow').innerHTML = [
  vehicle.year, vehicle.mileage, vehicle.fuel, vehicle.type, vehicle.condition
].map(t => `<span class="card-tag">${t}</span>`).join('');

// Specs
const specs = [
  { label: 'BRAND',        value: vehicle.brand },
  { label: 'MODEL YEAR',   value: vehicle.year },
  { label: 'ENGINE',       value: vehicle.engine || '—' },
  { label: 'TRANSMISSION', value: vehicle.transmission || '—' },
  { label: 'FUEL TYPE',    value: vehicle.fuel },
  { label: 'MILEAGE',      value: vehicle.mileage },
  { label: 'COLOR',        value: vehicle.color || '—' },
  { label: 'CONDITION',    value: vehicle.condition },
  { label: 'CITY',         value: vehicle.city },
  { label: 'TYPE',         value: vehicle.type },
];

document.getElementById('specsGrid').innerHTML = specs.map(s => `
  <div class="spec-item">
    <div class="spec-label">${s.label}</div>
    <div class="spec-value">${s.value}</div>
  </div>`).join('');

// Quick stats
document.getElementById('quickStats').innerHTML = `
  <div class="qs-item">
    <span class="qs-number">${vehicle.views}</span>
    <span class="qs-label">VIEWS</span>
  </div>
  <div class="qs-divider"></div>
  <div class="qs-item">
    <span class="qs-number">${vehicle.saved}</span>
    <span class="qs-label">SAVED</span>
  </div>
  <div class="qs-divider"></div>
  <div class="qs-item">
    <span class="qs-number">${vehicle.seller.listings}</span>
    <span class="qs-label">LISTINGS</span>
  </div>`;

// Seller info
const initials = vehicle.seller.name.split(' ').map(w=>w[0]).join('').toUpperCase();
document.getElementById('sellerInfo').innerHTML = `
  <div class="seller-avatar">${initials}</div>
  <div class="seller-details">
    <div class="seller-name">${vehicle.seller.name}</div>
    <div class="seller-meta">Member since ${vehicle.seller.joined}</div>
    <div class="seller-verified">✓ VERIFIED SELLER</div>
  </div>`;

// Contact modal info
document.getElementById('contactSellerInfo').innerHTML = `
  <div class="seller-avatar" style="width:42px;height:42px;font-size:0.85rem;">${initials}</div>
  <div>
    <div class="seller-name" style="font-size:0.85rem;">${vehicle.seller.name}</div>
    <div class="seller-meta">${vehicle.title}</div>
  </div>`;

// Call/WhatsApp buttons
document.getElementById('callBtn').onclick = () => {
  showToast(`Calling ${vehicle.seller.phone}...`, 'info');
};
document.getElementById('whatsappBtn').onclick = () => {
  const msg = encodeURIComponent(`Hi, I'm interested in your ${vehicle.title} listed on Four Wheels.`);
  window.open(`https://wa.me/92${vehicle.seller.phone.replace(/^0/,'').replace(/[-\s]/g,'')}?text=${msg}`, '_blank');
};

// ===== GALLERY / THUMBNAILS =====
const galleryEmojis = [vehicle.emoji, vehicle.emoji, vehicle.emoji, vehicle.emoji];
const thumbContainer = document.getElementById('thumbnails');
thumbContainer.innerHTML = galleryEmojis.map((e, i) => `
  <div class="thumb ${i===0?'active':''}" data-index="${i}" onclick="selectThumb(${i})">${e}</div>
`).join('');

window.selectThumb = function(i) {
  document.querySelectorAll('.thumb').forEach((t,j) => t.classList.toggle('active', j===i));
  document.getElementById('imgOverlayText').textContent = `PHOTO ${i+1} / ${galleryEmojis.length}`;
};

// Prev/Next image
let currentImg = 0;
document.getElementById('prevImg').onclick = () => {
  currentImg = (currentImg - 1 + galleryEmojis.length) % galleryEmojis.length;
  selectThumb(currentImg);
};
document.getElementById('nextImg').onclick = () => {
  currentImg = (currentImg + 1) % galleryEmojis.length;
  selectThumb(currentImg);
};

// ===== MEDIA TABS =====
document.querySelectorAll('.media-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const t = tab.getAttribute('data-tab');
    document.querySelectorAll('.media-tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.media-panel').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${t}`).classList.add('active');

    if (t === 'viewer3d' && !window._3dInit) {
      window._3dInit = true;
      // Trigger Three.js init
      if (typeof init3DViewer === 'function') init3DViewer(vehicle);
    }
  });
});

// ===== CONTACT MODAL =====
document.getElementById('contactSellerBtn').addEventListener('click', () => {
  document.getElementById('contactModal').classList.add('open');
});

document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const msg  = document.getElementById('contactMsg').value.trim();
  if (!name || !msg) { showToast('Please fill in all fields.', 'info'); return; }
  await new Promise(r => setTimeout(r, 800));
  showToast('Message sent to seller!', 'success');
  document.getElementById('contactModal').classList.remove('open');
  e.target.reset();
});

// ===== SAVE BUTTON =====
let saved = false;
document.getElementById('saveBtn').addEventListener('click', function() {
  saved = !saved;
  this.textContent = saved ? '♥ SAVED' : '♡ SAVE';
  this.style.color = saved ? 'var(--neon-pink)' : '';
  this.style.borderColor = saved ? 'var(--neon-pink)' : '';
  showToast(saved ? 'Vehicle saved to your list!' : 'Removed from saved list.', saved ? 'success' : 'info');
});

// ===== SIMILAR VEHICLES =====
const similar = VEHICLES_DB
  .filter(v => v.id !== vehicle.id && (v.type === vehicle.type || v.city === vehicle.city))
  .slice(0, 4);

const simGrid = document.getElementById('similarGrid');
simGrid.innerHTML = similar.map(v => `
  <div class="vehicle-card" onclick="window.location.href='vehicle-detail.html?id=${v.id}'">
    <div class="card-img-placeholder" style="position:relative;">
      <span>${v.emoji}</span>
      ${v.badge ? `<div class="card-badge ${v.badge}">${v.badge.toUpperCase()}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="card-title">${v.title}</div>
      <div class="card-price">PKR ${window.formatPrice(v.price)}</div>
      <div class="card-meta">
        <span class="card-tag">${v.year}</span>
        <span class="card-tag">${v.fuel}</span>
        <span class="card-tag">${v.type}</span>
      </div>
      <div class="card-footer">
        <span class="card-city">${v.city}</span>
        <button class="card-btn">VIEW →</button>
      </div>
    </div>
  </div>`).join('');

} // end populateDetail

// ===== INIT =====
loadVehicleDetail();
