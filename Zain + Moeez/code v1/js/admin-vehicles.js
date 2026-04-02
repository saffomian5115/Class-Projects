/* ============================================
   FOUR WHEELS — ADMIN VEHICLES JS
   Table, Search, Filter, Approve/Reject, Edit, Delete
   ============================================ */

let currentPage = 1;
const PER_PAGE = 8;
let pendingDeleteId  = null;
let pendingReviewId  = null;

// ===== MINI STATS =====
document.getElementById('vehicleMiniStats').innerHTML = [
  { label:'TOTAL',    val: ADMIN_VEHICLES.length,                                     color:'var(--neon-cyan)'   },
  { label:'ACTIVE',   val: ADMIN_VEHICLES.filter(v=>v.status==='active').length,   color:'var(--neon-green)'  },
  { label:'PENDING',  val: ADMIN_VEHICLES.filter(v=>v.status==='pending').length,  color:'var(--neon-orange)' },
  { label:'REJECTED', val: ADMIN_VEHICLES.filter(v=>v.status==='rejected').length, color:'var(--neon-pink)'   },
].map(s => `
  <div class="mini-stat">
    <div>
      <div class="mini-stat-val" style="color:${s.color}">${s.val}</div>
      <div class="mini-stat-label">${s.label}</div>
    </div>
  </div>`).join('');

// ===== RENDER TABLE =====
function renderVehiclesTable(data) {
  const start = (currentPage - 1) * PER_PAGE;
  const page  = data.slice(start, start + PER_PAGE);

  document.getElementById('vehiclesTableCount').textContent =
    `Showing ${start+1}–${Math.min(start+PER_PAGE, data.length)} of ${data.length} vehicles`;

  if (page.length === 0) {
    document.getElementById('vehiclesAdminTbody').innerHTML = `
      <tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">No vehicles found</td></tr>`;
    document.getElementById('vehiclesPagination').innerHTML = '';
    return;
  }

  document.getElementById('vehiclesAdminTbody').innerHTML = page.map((v, i) => `
    <tr>
      <td style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.7rem;">${start+i+1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.5rem;">${v.emoji}</span>
          <span class="tbl-name" style="font-size:0.75rem;">${v.title}</span>
        </div>
      </td>
      <td style="font-size:0.82rem;color:var(--text-secondary);">${v.seller}</td>
      <td style="font-family:var(--font-display);font-size:0.8rem;font-weight:700;color:var(--neon-cyan);">
        ${window.formatPrice ? window.formatPrice(v.price) : v.price}
      </td>
      <td>${v.city}</td>
      <td>
        <span class="card-tag" style="font-size:0.65rem;">${v.type}</span>
      </td>
      <td style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);">${v.posted}</td>
      <td><span class="status-badge ${v.status}">${v.status.toUpperCase()}</span></td>
      <td>
        <div class="tbl-actions">
          ${v.status === 'pending' ? `
            <button class="tbl-action-btn review" onclick="openReviewModal(${v.id})">⚡ REVIEW</button>
          ` : ''}
          ${v.status === 'active' ? `
            <button class="tbl-action-btn approve">👁 VIEW</button>
          ` : ''}
          <button class="tbl-action-btn edit" onclick="openEditVehicle(${v.id})">✎</button>
          <button class="tbl-action-btn delete" onclick="openDeleteVehicle(${v.id})">🗑</button>
        </div>
      </td>
    </tr>`).join('');

  renderPagination(data.length, 'vehiclesPagination');
}

// ===== PAGINATION =====
function renderPagination(total, containerId) {
  const totalPages = Math.ceil(total / PER_PAGE);
  const pag = document.getElementById(containerId);
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = `<button class="page-btn" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i===1||i===totalPages||Math.abs(i-currentPage)<=1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i-currentPage)===2) {
      html += `<span style="color:var(--text-muted);padding:0 2px;">…</span>`;
    }
  }
  html += `<button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="goPage(${currentPage+1})">›</button>`;
  pag.innerHTML = html;
}

window.goPage = function(p) {
  currentPage = p;
  renderVehiclesTable(getFilteredVehicles());
};

// ===== FILTER =====
function getFilteredVehicles() {
  const query  = document.getElementById('vehicleSearch').value.toLowerCase();
  const status = document.getElementById('vehicleStatusFilter').value;
  const type   = document.getElementById('vehicleTypeFilter').value;
  return ADMIN_VEHICLES.filter(v => {
    if (status && v.status !== status) return false;
    if (type   && v.type   !== type)   return false;
    if (query && !v.title.toLowerCase().includes(query) &&
        !v.seller.toLowerCase().includes(query) &&
        !v.city.toLowerCase().includes(query)) return false;
    return true;
  });
}

document.getElementById('vehicleSearch')?.addEventListener('input', () => { currentPage=1; renderVehiclesTable(getFilteredVehicles()); });
document.getElementById('vehicleStatusFilter')?.addEventListener('change', () => { currentPage=1; renderVehiclesTable(getFilteredVehicles()); });
document.getElementById('vehicleTypeFilter')?.addEventListener('change', () => { currentPage=1; renderVehiclesTable(getFilteredVehicles()); });

// ===== REVIEW (APPROVE / REJECT) =====
window.openReviewModal = function(id) {
  const v = ADMIN_VEHICLES.find(x => x.id === id);
  if (!v) return;
  pendingReviewId = id;

  document.getElementById('reviewListingCard').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <span style="font-size:2.5rem;">${v.emoji}</span>
      <div>
        <div class="rlc-title">${v.title}</div>
        <div class="rlc-price">PKR ${window.formatPrice ? window.formatPrice(v.price) : v.price}</div>
      </div>
    </div>
    <div class="rlc-meta">
      <span class="card-tag">${v.type}</span>
      <span class="card-tag">${v.city}</span>
      <span class="card-tag">${v.posted}</span>
    </div>
    <div style="margin-top:12px;font-size:0.82rem;color:var(--text-secondary);">
      Seller: <strong style="color:var(--text-primary);">${v.seller}</strong>
    </div>`;

  document.getElementById('reviewModal').classList.add('open');
};

window.approveVehicle = function() {
  const idx = ADMIN_VEHICLES.findIndex(v => v.id === pendingReviewId);
  if (idx !== -1) ADMIN_VEHICLES[idx].status = 'active';
  closeModal('reviewModal');
  renderVehiclesTable(getFilteredVehicles());
  updateMiniStats();
  showToast('Vehicle listing approved and is now live!', 'success');
};

window.rejectVehicle = function() {
  const idx = ADMIN_VEHICLES.findIndex(v => v.id === pendingReviewId);
  if (idx !== -1) ADMIN_VEHICLES[idx].status = 'rejected';
  closeModal('reviewModal');
  renderVehiclesTable(getFilteredVehicles());
  updateMiniStats();
  showToast('Vehicle listing has been rejected.', 'error');
};

// ===== EDIT VEHICLE =====
window.openEditVehicle = function(id) {
  const v = ADMIN_VEHICLES.find(x => x.id === id);
  if (!v) return;
  document.getElementById('editVId').value      = id;
  document.getElementById('editVTitle').value   = v.title;
  document.getElementById('editVPrice').value   = v.price;
  document.getElementById('editVCity').value    = v.city;
  document.getElementById('editVStatus').value  = v.status;
  document.getElementById('editVehicleModal').classList.add('open');
};

window.saveVehicleEdit = function() {
  const id  = parseInt(document.getElementById('editVId').value);
  const idx = ADMIN_VEHICLES.findIndex(v => v.id === id);
  if (idx === -1) return;

  ADMIN_VEHICLES[idx].title  = document.getElementById('editVTitle').value.trim();
  ADMIN_VEHICLES[idx].price  = parseInt(document.getElementById('editVPrice').value) || ADMIN_VEHICLES[idx].price;
  ADMIN_VEHICLES[idx].city   = document.getElementById('editVCity').value.trim();
  ADMIN_VEHICLES[idx].status = document.getElementById('editVStatus').value;

  closeModal('editVehicleModal');
  renderVehiclesTable(getFilteredVehicles());
  updateMiniStats();
  showToast('Vehicle listing updated successfully!', 'success');
};

// ===== DELETE VEHICLE =====
window.openDeleteVehicle = function(id) {
  const v = ADMIN_VEHICLES.find(x => x.id === id);
  if (!v) return;
  pendingDeleteId = id;
  document.getElementById('deleteVehicleLabel').textContent = v.title;
  document.getElementById('deleteVehicleModal').classList.add('open');
};

window.confirmDeleteVehicle = function() {
  const idx = ADMIN_VEHICLES.findIndex(v => v.id === pendingDeleteId);
  if (idx !== -1) ADMIN_VEHICLES.splice(idx, 1);
  closeModal('deleteVehicleModal');
  currentPage = 1;
  renderVehiclesTable(getFilteredVehicles());
  updateMiniStats();
  showToast('Vehicle listing deleted.', 'success');
  pendingDeleteId = null;
};

// ===== UPDATE MINI STATS =====
function updateMiniStats() {
  const stats = [
    { label:'TOTAL',    val: ADMIN_VEHICLES.length,                                     color:'var(--neon-cyan)'   },
    { label:'ACTIVE',   val: ADMIN_VEHICLES.filter(v=>v.status==='active').length,   color:'var(--neon-green)'  },
    { label:'PENDING',  val: ADMIN_VEHICLES.filter(v=>v.status==='pending').length,  color:'var(--neon-orange)' },
    { label:'REJECTED', val: ADMIN_VEHICLES.filter(v=>v.status==='rejected').length, color:'var(--neon-pink)'   },
  ];
  document.getElementById('vehicleMiniStats').innerHTML = stats.map(s => `
    <div class="mini-stat">
      <div>
        <div class="mini-stat-val" style="color:${s.color}">${s.val}</div>
        <div class="mini-stat-label">${s.label}</div>
      </div>
    </div>`).join('');
}

// ===== INIT =====
renderVehiclesTable(getFilteredVehicles());
