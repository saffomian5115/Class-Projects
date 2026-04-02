/* ============================================
   FOUR WHEELS — ADMIN USERS JS
   Table, Search, Filter, Edit, Delete
   ============================================ */

let usersData = [...ADMIN_USERS];
let currentPage = 1;
const PER_PAGE = 8;
let pendingDeleteId = null;
let pendingEditId   = null;

// ===== MINI STATS =====
document.getElementById('userMiniStats').innerHTML = [
  { label:'TOTAL USERS',  val: ADMIN_USERS.length,                               color:'var(--neon-cyan)' },
  { label:'ACTIVE',       val: ADMIN_USERS.filter(u=>u.status==='active').length, color:'var(--neon-green)' },
  { label:'BANNED',       val: ADMIN_USERS.filter(u=>u.status==='banned').length, color:'var(--neon-pink)' },
  { label:'WITH LISTINGS',val: ADMIN_USERS.filter(u=>u.listings>0).length,        color:'var(--neon-purple)' },
].map(s => `
  <div class="mini-stat">
    <div>
      <div class="mini-stat-val" style="color:${s.color}">${s.val}</div>
      <div class="mini-stat-label">${s.label}</div>
    </div>
  </div>`).join('');

// ===== RENDER TABLE =====
function renderUsersTable(data) {
  const start = (currentPage - 1) * PER_PAGE;
  const page  = data.slice(start, start + PER_PAGE);

  document.getElementById('usersTableCount').textContent =
    `Showing ${start+1}–${Math.min(start+PER_PAGE, data.length)} of ${data.length} users`;

  if (page.length === 0) {
    document.getElementById('usersTbody').innerHTML = `
      <tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">No users found</td></tr>`;
    document.getElementById('usersPagination').innerHTML = '';
    return;
  }

  document.getElementById('usersTbody').innerHTML = page.map((u, i) => {
    const initials = u.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    return `
      <tr>
        <td style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.7rem;">${start+i+1}</td>
        <td>
          <div class="tbl-user">
            <div class="tbl-avatar">${initials}</div>
            <span class="tbl-name">${u.name}</span>
          </div>
        </td>
        <td style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary);">${u.email}</td>
        <td style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary);">${u.phone}</td>
        <td>${u.city}</td>
        <td style="text-align:center;font-family:var(--font-display);font-size:0.85rem;color:var(--neon-cyan);font-weight:700;">${u.listings}</td>
        <td style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);">${u.joined}</td>
        <td><span class="status-badge ${u.status}">${u.status === 'active' ? '● ACTIVE' : '✕ BANNED'}</span></td>
        <td>
          <div class="tbl-actions">
            <button class="tbl-action-btn edit" onclick="openEditUser(${u.id})">✎ EDIT</button>
            <button class="tbl-action-btn ${u.status==='active'?'review':'approve'}"
              onclick="toggleBanUser(${u.id})">
              ${u.status === 'active' ? '🚫 BAN' : '✓ UNBAN'}
            </button>
            <button class="tbl-action-btn delete" onclick="openDeleteUser(${u.id})">🗑</button>
          </div>
        </td>
      </tr>`;
  }).join('');

  renderPagination(data.length, 'usersPagination');
}

// ===== PAGINATION =====
function renderPagination(total, containerId) {
  const totalPages = Math.ceil(total / PER_PAGE);
  const pag = document.getElementById(containerId);
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = `<button class="page-btn" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i===1 || i===totalPages || Math.abs(i-currentPage)<=1) {
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
  renderUsersTable(getFilteredUsers());
};

// ===== FILTER =====
function getFilteredUsers() {
  const query  = document.getElementById('userSearch').value.toLowerCase();
  const status = document.getElementById('userStatusFilter').value;
  return ADMIN_USERS.filter(u => {
    if (status && u.status !== status) return false;
    if (query && !u.name.toLowerCase().includes(query) &&
        !u.email.toLowerCase().includes(query) &&
        !u.city.toLowerCase().includes(query)) return false;
    return true;
  });
}

document.getElementById('userSearch')?.addEventListener('input', () => { currentPage=1; renderUsersTable(getFilteredUsers()); });
document.getElementById('userStatusFilter')?.addEventListener('change', () => { currentPage=1; renderUsersTable(getFilteredUsers()); });

// ===== EDIT USER =====
window.openEditUser = function(id) {
  const u = ADMIN_USERS.find(x => x.id === id);
  if (!u) return;
  pendingEditId = id;
  document.getElementById('editUserId').value    = id;
  document.getElementById('editUserName').value  = u.name;
  document.getElementById('editUserEmail').value = u.email;
  document.getElementById('editUserPhone').value = u.phone;
  document.getElementById('editUserCity').value  = u.city;
  document.getElementById('editUserStatus').value = u.status;
  document.getElementById('editUserModal').classList.add('open');
};

window.saveUserEdit = function() {
  const id = parseInt(document.getElementById('editUserId').value);
  const idx = ADMIN_USERS.findIndex(u => u.id === id);
  if (idx === -1) return;

  ADMIN_USERS[idx].name   = document.getElementById('editUserName').value.trim();
  ADMIN_USERS[idx].email  = document.getElementById('editUserEmail').value.trim();
  ADMIN_USERS[idx].phone  = document.getElementById('editUserPhone').value.trim();
  ADMIN_USERS[idx].city   = document.getElementById('editUserCity').value.trim();
  ADMIN_USERS[idx].status = document.getElementById('editUserStatus').value;

  closeModal('editUserModal');
  renderUsersTable(getFilteredUsers());
  showToast('User updated successfully!', 'success');
};

// ===== BAN / UNBAN =====
window.toggleBanUser = function(id) {
  const u = ADMIN_USERS.find(x => x.id === id);
  if (!u) return;
  const wasBanned = u.status === 'banned';
  u.status = wasBanned ? 'active' : 'banned';
  renderUsersTable(getFilteredUsers());
  showToast(`User ${wasBanned ? 'unbanned' : 'banned'} successfully.`, wasBanned ? 'success' : 'error');
};

// ===== DELETE USER =====
window.openDeleteUser = function(id) {
  const u = ADMIN_USERS.find(x => x.id === id);
  if (!u) return;
  pendingDeleteId = id;
  document.getElementById('deleteUserNameLabel').textContent = u.name;
  document.getElementById('deleteUserModal').classList.add('open');
};

window.confirmDeleteUser = function() {
  const idx = ADMIN_USERS.findIndex(u => u.id === pendingDeleteId);
  if (idx !== -1) ADMIN_USERS.splice(idx, 1);
  closeModal('deleteUserModal');
  currentPage = 1;
  renderUsersTable(getFilteredUsers());
  showToast('User deleted successfully.', 'success');
  pendingDeleteId = null;
};

// ===== INIT =====
renderUsersTable(getFilteredUsers());
