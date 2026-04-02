/* ============================================
   FOUR WHEELS — AUTH JS (Shared)
   Validation, Password Strength, Toggle
   ============================================ */

// ===== PASSWORD TOGGLE =====
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.textContent = isPass ? '🙈' : '👁';
  });
});

// ===== PASSWORD STRENGTH =====
function checkPasswordStrength(password, fillId, labelId) {
  const fill = document.getElementById(fillId);
  const label = document.getElementById(labelId);
  if (!fill || !label) return;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { pct: '0%',   color: 'transparent', text: 'STRENGTH' },
    { pct: '25%',  color: '#ff0080',     text: 'WEAK' },
    { pct: '50%',  color: '#ff6600',     text: 'FAIR' },
    { pct: '75%',  color: '#ffcc00',     text: 'GOOD' },
    { pct: '100%', color: '#00ff88',     text: 'STRONG' },
  ];

  const level = levels[score];
  fill.style.width = level.pct;
  fill.style.background = level.color;
  fill.style.boxShadow = score > 0 ? `0 0 8px ${level.color}` : 'none';
  label.textContent = level.text;
  label.style.color = level.color;
}

// Attach to password inputs if they exist
const passInput = document.getElementById('password');
if (passInput) {
  passInput.addEventListener('input', () => {
    checkPasswordStrength(passInput.value, 'strengthFill', 'strengthLabel');
  });
}

const newPassInput = document.getElementById('newPass');
if (newPassInput) {
  newPassInput.addEventListener('input', () => {
    checkPasswordStrength(newPassInput.value, 'newPassStrength', 'newPassLabel');
  });
}

// ===== VALIDATION HELPERS =====
window.AuthValidate = {
  showError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) input.classList.add('error');
    if (err) { err.textContent = msg || err.textContent; err.classList.add('visible'); }
    return false;
  },
  clearError(inputId, errId) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) input.classList.remove('error');
    if (err) err.classList.remove('visible');
  },
  clearAll(ids) {
    ids.forEach(([inputId, errId]) => this.clearError(inputId, errId));
  },
  isEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  isPhone: v => /^(\+92|0)?3[0-9]{9}$/.test(v.replace(/[-\s]/g, '')),
};

// ===== SESSION HELPERS =====
window.Auth = {
  login(user) {
    localStorage.setItem('fw_user', JSON.stringify(user));
    localStorage.setItem('fw_token', 'demo_token_' + Date.now());
  },
  logout() {
    localStorage.removeItem('fw_user');
    localStorage.removeItem('fw_token');
    window.location.href = '/pages/login.html';
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('fw_user')); } catch { return null; }
  },
  isLoggedIn() {
    return !!localStorage.getItem('fw_token');
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  }
};
