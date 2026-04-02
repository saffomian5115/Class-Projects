/* ============================================
   FOUR WHEELS — HOME PAGE JS
   Featured Vehicles, Demo Data
   ============================================ */

const demoVehicles = [
  { id: 1, title: 'Toyota Corolla Altis 2022', price: 6800000, city: 'Lahore', type: 'Car', year: 2022, mileage: '28,000 km', fuel: 'Petrol', badge: 'featured', emoji: '🚗' },
  { id: 2, title: 'Honda Civic Oriel 2021', price: 7200000, city: 'Karachi', type: 'Car', year: 2021, mileage: '35,000 km', fuel: 'Petrol', badge: 'verified', emoji: '🚙' },
  { id: 3, title: 'Suzuki Cultus 2023', price: 3100000, city: 'Islamabad', type: 'Car', year: 2023, mileage: '12,000 km', fuel: 'Petrol', badge: 'verified', emoji: '🚘' },
  { id: 4, title: 'Yamaha YBR 125 2023', price: 380000, city: 'Multan', type: 'Bike', year: 2023, mileage: '8,500 km', fuel: 'Petrol', badge: '', emoji: '🏍️' },
  { id: 5, title: 'Toyota Hilux Revo 2020', price: 11500000, city: 'Peshawar', type: 'Truck', year: 2020, mileage: '55,000 km', fuel: 'Diesel', badge: 'featured', emoji: '🛻' },
  { id: 6, title: 'KIA Sportage AWD 2022', price: 9800000, city: 'Lahore', type: 'SUV', year: 2022, mileage: '22,000 km', fuel: 'Petrol', badge: 'verified', emoji: '🚐' },
  { id: 7, title: 'Honda CD 70 2024', price: 175000, city: 'Faisalabad', type: 'Bike', year: 2024, mileage: '2,000 km', fuel: 'Petrol', badge: '', emoji: '🏍️' },
  { id: 8, title: 'Suzuki Wagon R AGS 2023', price: 3400000, city: 'Karachi', type: 'Car', year: 2023, mileage: '18,000 km', fuel: 'Petrol', badge: 'verified', emoji: '🚗' },
];

function createVehicleCard(v) {
  const badgeHTML = v.badge
    ? `<div class="card-badge ${v.badge}">${v.badge.toUpperCase()}</div>`
    : '';

  return `
    <div class="vehicle-card" onclick="window.location.href='pages/vehicle-detail.html?id=${v.id}'">
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
          <button class="card-btn">VIEW →</button>
        </div>
      </div>
    </div>
  `;
}

// Render featured vehicles (first 8)
const grid = document.getElementById('featuredGrid');
if (grid) {
  grid.innerHTML = demoVehicles.map(createVehicleCard).join('');

  // Trigger scroll reveal for newly added cards
  grid.querySelectorAll('.vehicle-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

// Search redirect
const searchBtn = document.querySelector('.btn-search');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const selects = document.querySelectorAll('.search-field select');
    const type = selects[0]?.value;
    const city = selects[1]?.value;
    const price = selects[2]?.value;
    window.location.href = `pages/vehicles.html?type=${encodeURIComponent(type)}&city=${encodeURIComponent(city)}&price=${encodeURIComponent(price)}`;
  });
}
