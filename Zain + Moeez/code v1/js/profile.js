/* ============================================
   FOUR WHEELS — PROFILE JS
   ============================================ */

// ===== TAB SWITCHING =====
document.querySelectorAll('.sidebar-menu-item[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');

    document.querySelectorAll('.sidebar-menu-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + tabId)?.classList.add('active');
  });
});

// ===== LOAD USER DATA =====
const user = Auth?.getUser?.() || { firstName: 'Muhammad', lastName: 'Zain', email: 'zain@example.com', city: 'Multan' };
if (user) {
  const initials = ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
  document.getElementById('avatarCircle').textContent = initials || 'U';
  document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName || ''}`.trim();
  document.getElementById('profileEmail').textContent = user.email || '';
  document.getElementById('profileCity').textContent = '📍 ' + (user.city || '');
}

// ===== AVATAR UPLOAD =====
document.getElementById('avatarEditBtn')?.addEventListener('click', () => {
  document.getElementById('avatarInput').click();
});

document.getElementById('avatarInput')?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const circle = document.getElementById('avatarCircle');
    circle.innerHTML = `<img src="${e.target.result}" alt="Avatar"/>`;
  };
  reader.readAsDataURL(file);
});

// ===== MY LISTINGS DATA =====
const myVehicles = [
  { id: 1, title: 'Toyota Corolla 2020', price: 5500000, status: 'active', emoji: '🚗', city: 'Multan' },
  { id: 2, title: 'Honda CD 70 2022',    price: 160000,  status: 'active', emoji: '🏍️', city: 'Multan' },
  { id: 3, title: 'Suzuki Alto 2019',    price: 2800000, status: 'pending', emoji: '🚘', city: 'Multan' },
  { id: 4, title: 'Yamaha YBR 2021',     price: 320000,  status: 'active', emoji: '🏍️', city: 'Multan' },
  { id: 5, title: 'Toyota Vitz 2018',    price: 3200000, status: 'inactive', emoji: '🚙', city: 'Multan' },
];

const statusMap = {
  active: 'active',
  pending: 'pending',
  inactive: 'inactive'
};

function renderMyListings() {
  const grid = document.getElementById('myListingsGrid');
  if (!grid) return;

  if (myVehicles.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🚗</div>
        <h3>NO LISTINGS YET</h3>
        <p>Start selling by adding your first vehicle.</p>
      </div>`;
    return;
  }

  grid.innerHTML = myVehicles.map(v => `
    <div class="my-listing-card">
      <div class="mlc-img">
        <span>${v.emoji}</span>
        <div class="card-badge ${statusMap[v.status]}" style="position:absolute;top:10px;left:10px;">
          ${v.status.toUpperCase()}
        </div>
      </div>
      <div class="mlc-body">
        <div class="mlc-title">${v.title}</div>
        <div class="mlc-price">PKR ${window.formatPrice(v.price)}</div>
        <div class="card-city">${v.city}</div>
        <div class="mlc-actions">
          <button class="mlc-btn edit" onclick="editListing(${v.id})">✎ EDIT</button>
          <button class="mlc-btn delete" onclick="deleteListing(${v.id}, this)">✕ DELETE</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.editListing = function(id) {
  showToast('Redirecting to edit page...', 'info');
  setTimeout(() => { window.location.href = `sell.html?edit=${id}`; }, 800);
};

window.deleteListing = function(id, btn) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  const card = btn.closest('.my-listing-card');
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  card.style.transition = 'all 0.3s ease';
  setTimeout(() => {
    card.remove();
    showToast('Listing deleted successfully.', 'success');
  }, 300);
};

renderMyListings();

// ===== MESSAGES PREVIEW =====
const msgPreviews = [
  { sender: 'Ahmed Ali', text: 'Is this vehicle still available?', time: '2h ago', unread: true, initials: 'AA' },
  { sender: 'Sara Khan', text: 'Can we meet tomorrow for inspection?', time: '5h ago', unread: true, initials: 'SK' },
  { sender: 'Bilal R.',  text: 'Price negotiable?', time: '1d ago', unread: false, initials: 'BR' },
];

const msgContainer = document.getElementById('messagesPreview');
if (msgContainer) {
  msgContainer.innerHTML = msgPreviews.map(m => `
    <div class="msg-preview-item ${m.unread ? 'msg-unread' : ''}"
         onclick="window.location.href='messages.html'">
      <div class="msg-avatar">${m.initials}</div>
      <div class="msg-info">
        <div class="msg-sender">${m.sender}</div>
        <div class="msg-preview-text">${m.text}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
        <span class="msg-time">${m.time}</span>
        ${m.unread ? '<span class="msg-dot"></span>' : ''}
      </div>
    </div>
  `).join('');
}

// ===== EDIT PROFILE FORM =====
document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await new Promise(r => setTimeout(r, 800));
  showToast('Profile updated successfully!', 'success');
});

// ===== CHANGE PASSWORD FORM =====
document.getElementById('changePassForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const np = document.getElementById('newPass').value;
  const cp = document.getElementById('confirmNewPass').value;

  AuthValidate.clearAll([['currentPass','currentPassErr'],['newPass','newPassErr'],['confirmNewPass','confirmNewPassErr']]);
  let valid = true;

  if (!document.getElementById('currentPass').value) {
    AuthValidate.showError('currentPass','currentPassErr','Current password required');
    valid = false;
  }
  if (np.length < 8) {
    AuthValidate.showError('newPass','newPassErr','Minimum 8 characters');
    valid = false;
  }
  if (np !== cp) {
    AuthValidate.showError('confirmNewPass','confirmNewPassErr','Passwords do not match');
    valid = false;
  }
  if (!valid) return;

  await new Promise(r => setTimeout(r, 800));
  showToast('Password updated successfully!', 'success');
  e.target.reset();
});

// ===== LOGOUT =====
function doLogout() {
  showToast('Logging out...', 'info');
  setTimeout(() => { Auth.logout?.() || (window.location.href = '../pages/login.html'); }, 1000);
}

document.getElementById('logoutBtn')?.addEventListener('click', doLogout);
document.getElementById('logoutSidebar')?.addEventListener('click', doLogout);
