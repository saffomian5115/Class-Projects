/* ============================================
   FOUR WHEELS — ADMIN DASHBOARD JS
   Stats from API (fallback to local demo data)
   ============================================ */

async function loadDashboardStats() {
  try {
    const token = localStorage.getItem('fw_admin_token') || localStorage.getItem('fw_token');
    const res   = await fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      // Patch ADMIN_VEHICLES & ADMIN_USERS counts from real data
      window._realStats = data.stats;
    }
  } catch(_) {}
  renderDashboard();
}

function renderDashboard() {

// ===== STAT CARDS =====
const stats = [
  { icon:'👥', label:'TOTAL USERS',    value: ADMIN_USERS.length,                                          color:'purple', change:'+12% this month', dir:'up'   },
  { icon:'🚗', label:'TOTAL VEHICLES', value: ADMIN_VEHICLES.length,                                       color:'cyan',   change:'+8% this month',  dir:'up'   },
  { icon:'⏳', label:'PENDING REVIEW', value: ADMIN_VEHICLES.filter(v=>v.status==='pending').length,       color:'orange', change:'Needs attention',  dir:'down' },
  { icon:'✅', label:'ACTIVE LISTINGS',value: ADMIN_VEHICLES.filter(v=>v.status==='active').length,        color:'green',  change:'+5% this month',  dir:'up'   },
];

document.getElementById('statCardsGrid').innerHTML = stats.map(s => `
  <div class="stat-card ${s.color}">
    <span class="stat-icon">${s.icon}</span>
    <div class="stat-value" data-target="${s.value}">0</div>
    <div class="stat-label">${s.label}</div>
    <div class="stat-change ${s.dir}">${s.dir === 'up' ? '▲' : '▼'} ${s.change}</div>
  </div>`).join('');

// Animate counters
setTimeout(() => {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const dur = 1200;
    const start = performance.now();
    function upd(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(upd);
      else el.textContent = target;
    }
    requestAnimationFrame(upd);
  });
}, 200);

// ===== BAR CHART =====
const monthData = [
  { label:'SEP', value:18 },
  { label:'OCT', value:24 },
  { label:'NOV', value:21 },
  { label:'DEC', value:30 },
  { label:'JAN', value:26 },
  { label:'FEB', value:35 },
];

const maxVal = Math.max(...monthData.map(d => d.value));
const barWrap = document.getElementById('barChartWrap');
barWrap.innerHTML = monthData.map(d => {
  const pct = Math.round((d.value / maxVal) * 100);
  return `
    <div class="bar-group">
      <div class="bar-value">${d.value}</div>
      <div class="bar-fill" style="height:0%" data-pct="${pct}%" title="${d.value} listings in ${d.label}"></div>
      <div class="bar-label">${d.label}</div>
    </div>`;
}).join('');

// Animate bars
setTimeout(() => {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    bar.style.transition = 'height 0.9s cubic-bezier(0.25, 0.8, 0.25, 1)';
    bar.style.height = bar.getAttribute('data-pct');
  });
}, 400);

// ===== DONUT CHART =====
const typeGroups = {};
ADMIN_VEHICLES.forEach(v => { typeGroups[v.type] = (typeGroups[v.type] || 0) + 1; });
const total = ADMIN_VEHICLES.length;
const donutColors = { Car:'#00f5ff', SUV:'#bf00ff', Bike:'#00ff88', Truck:'#ff6600', Other:'#ff0080' };
const donutTypes = Object.entries(typeGroups).sort((a,b) => b[1]-a[1]);

// Build SVG donut
const cx = 80, cy = 80, r = 60, stroke = 20;
let offset = 0;
const circumference = 2 * Math.PI * r;

let paths = '';
donutTypes.forEach(([type, count]) => {
  const pct = count / total;
  const dashArr = pct * circumference;
  const dashOff = circumference - offset * circumference;
  const color = donutColors[type] || '#888';
  paths += `<circle
    cx="${cx}" cy="${cy}" r="${r}"
    fill="none"
    stroke="${color}"
    stroke-width="${stroke}"
    stroke-dasharray="${dashArr} ${circumference - dashArr}"
    stroke-dashoffset="${dashOff}"
    transform="rotate(-90 ${cx} ${cy})"
    opacity="0.9"
    style="filter:drop-shadow(0 0 4px ${color})"
  />`;
  offset += pct;
});

document.getElementById('donutWrap').innerHTML = `
  <svg class="donut-svg" width="160" height="160" viewBox="0 0 160 160">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,245,255,0.05)" stroke-width="${stroke}"/>
    ${paths}
    <text x="${cx}" y="${cy - 6}" class="donut-center-text" fill="#fff" font-size="20" font-weight="900" font-family="'Orbitron'">${total}</text>
    <text x="${cx}" y="${cy + 14}" class="donut-center-text" fill="rgba(255,255,255,0.4)" font-size="8" font-family="'Share Tech Mono'" letter-spacing="2">TOTAL</text>
  </svg>`;

document.getElementById('donutLegend').innerHTML = donutTypes.map(([type, count]) => `
  <div class="legend-item">
    <div class="legend-dot" style="background:${donutColors[type]||'#888'};box-shadow:0 0 6px ${donutColors[type]||'#888'};"></div>
    <span>${type}</span>
    <span class="legend-pct">${count} (${Math.round(count/total*100)}%)</span>
  </div>`).join('');

// ===== RECENT USERS TABLE =====
document.getElementById('recentUsersTbody').innerHTML =
  ADMIN_USERS.slice(0, 5).map(u => `
    <tr>
      <td>
        <div class="tbl-user">
          <div class="tbl-avatar">${u.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}</div>
          <span class="tbl-name">${u.name}</span>
        </div>
      </td>
      <td style="font-family:var(--font-mono);font-size:0.72rem;">${u.email}</td>
      <td>${u.city}</td>
      <td style="font-family:var(--font-mono);font-size:0.7rem;">${u.joined}</td>
      <td><span class="status-badge ${u.status}">${u.status === 'active' ? '● ACTIVE' : '✕ BANNED'}</span></td>
    </tr>`).join('');

// ===== RECENT VEHICLES TABLE =====
document.getElementById('recentVehiclesTbody').innerHTML =
  ADMIN_VEHICLES.slice(0, 5).map(v => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.4rem;">${v.emoji}</span>
          <span class="tbl-name" style="font-size:0.75rem;">${v.title}</span>
        </div>
      </td>
      <td style="font-size:0.8rem;">${v.seller}</td>
      <td style="font-family:var(--font-display);color:var(--neon-cyan);font-size:0.8rem;font-weight:700;">
        ${window.formatPrice ? window.formatPrice(v.price) : v.price}
      </td>
      <td><span class="status-badge ${v.status}">${v.status.toUpperCase()}</span></td>
      <td>
        <div class="tbl-actions">
          ${v.status === 'pending'
            ? `<button class="tbl-action-btn review" onclick="window.location.href='vehicles.html'">REVIEW</button>`
            : `<button class="tbl-action-btn approve">VIEW</button>`
          }
        </div>
      </td>
    </tr>`).join('');

} // end renderDashboard

loadDashboardStats();
