/* ============================================
   FOUR WHEELS — LOGIN JS
   Fixed: proper credential check, no auto-login
   ============================================ */

const form    = document.getElementById('loginForm');
const btn     = document.getElementById('loginBtn');
const btnText = document.getElementById('loginBtnText');
const loader  = document.getElementById('loginLoader');

// ── Demo accounts (replace with real API call in production) ──
const DEMO_ACCOUNTS = [
  { email: 'admin@fourwheels.pk', password: 'admin123',   role: 'admin',  firstName: 'Super',     lastName: 'Admin',   city: 'Islamabad' },
  { email: 'ahmed@gmail.com',     password: 'password123', role: 'user',   firstName: 'Ahmed',     lastName: 'Raza',    city: 'Lahore'    },
  { email: 'sara@gmail.com',      password: 'password123', role: 'user',   firstName: 'Sara',      lastName: 'Khan',    city: 'Karachi'   },
  { email: 'bilal@gmail.com',     password: 'password123', role: 'user',   firstName: 'Bilal',     lastName: 'Ahmed',   city: 'Islamabad' },
  { email: 'usman@gmail.com',     password: 'password123', role: 'user',   firstName: 'Usman',     lastName: 'Ali',     city: 'Multan'    },
];

function resetBtn() {
  btn.disabled = false;
  btnText.textContent = 'SIGN IN';
  loader.classList.add('hidden');
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  AuthValidate.clearAll([
    ['loginEmail',    'loginEmailErr'],
    ['loginPassword', 'loginPassErr'],
  ]);

  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  let valid = true;

  if (!AuthValidate.isEmail(email)) {
    AuthValidate.showError('loginEmail', 'loginEmailErr', 'Enter a valid email address');
    valid = false;
  }
  if (!password) {
    AuthValidate.showError('loginPassword', 'loginPassErr', 'Password is required');
    valid = false;
  }
  if (!valid) return;

  // Loading state
  btn.disabled = true;
  btnText.textContent = 'SIGNING IN...';
  loader.classList.remove('hidden');

  // Simulate network delay
  await new Promise(r => setTimeout(r, 1200));

  // ── Try real backend first ──
  let loggedIn = false;
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem('fw_token', data.token);
      localStorage.setItem('fw_user',  JSON.stringify(data.user));
      loggedIn = true;

      showToast(`Welcome back, ${data.user.firstName}!`, 'success');
      setTimeout(() => {
        window.location.href = data.user.role === 'admin'
          ? 'admin/dashboard.html'
          : 'profile.html';
      }, 900);
      return;
    }
  } catch (_) {
    // Backend not running — fall through to demo accounts
  }

  // ── Demo / offline mode ──
  if (!loggedIn) {
    const account = DEMO_ACCOUNTS.find(
      a => a.email === email && a.password === password
    );

    if (!account) {
      // ❌ Wrong credentials — show error clearly
      AuthValidate.showError('loginEmail',    'loginEmailErr',  ' ');          // highlight field
      AuthValidate.showError('loginPassword', 'loginPassErr',   'Incorrect email or password. Please try again.');
      showToast('Incorrect credentials. Please check and try again.', 'error');
      resetBtn();
      return;
    }

    // ✅ Correct demo credentials
    Auth.login({
      firstName: account.firstName,
      lastName:  account.lastName,
      email:     account.email,
      city:      account.city,
      role:      account.role,
    });

    showToast(`Welcome back, ${account.firstName}!`, 'success');
    setTimeout(() => {
      window.location.href = account.role === 'admin'
        ? 'admin/dashboard.html'
        : 'profile.html';
    }, 900);
  }
});

// Show success message after registration
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('registered') === '1') {
    showToast('Account created! Please sign in.', 'info');
  }
});

