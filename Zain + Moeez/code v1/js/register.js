/* ============================================
   FOUR WHEELS — REGISTER JS
   ============================================ */

const form = document.getElementById('registerForm');
const btn = document.getElementById('registerBtn');
const btnText = document.getElementById('registerBtnText');
const loader = document.getElementById('registerLoader');

const fields = [
  ['firstName','firstNameErr'], ['lastName','lastNameErr'],
  ['email','emailErr'], ['phone','phoneErr'],
  ['city','cityErr'], ['password','passwordErr'], ['confirmPassword','confirmErr']
];

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  AuthValidate.clearAll(fields);
  document.getElementById('termsErr').classList.remove('visible');

  let valid = true;

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const city      = document.getElementById('city').value;
  const password  = document.getElementById('password').value;
  const confirm   = document.getElementById('confirmPassword').value;
  const terms     = document.getElementById('terms').checked;

  if (!firstName) { AuthValidate.showError('firstName','firstNameErr','First name required'); valid = false; }
  if (!lastName)  { AuthValidate.showError('lastName','lastNameErr','Last name required'); valid = false; }
  if (!AuthValidate.isEmail(email)) { AuthValidate.showError('email','emailErr','Enter a valid email'); valid = false; }
  if (!AuthValidate.isPhone(phone)) { AuthValidate.showError('phone','phoneErr','Enter a valid Pakistani number'); valid = false; }
  if (!city) { AuthValidate.showError('city','cityErr','Please select your city'); valid = false; }
  if (password.length < 8) { AuthValidate.showError('password','passwordErr','Minimum 8 characters required'); valid = false; }
  if (password !== confirm) { AuthValidate.showError('confirmPassword','confirmErr','Passwords do not match'); valid = false; }
  if (!terms) { document.getElementById('termsErr').classList.add('visible'); valid = false; }

  if (!valid) return;

  // Show loader
  btn.disabled = true;
  btnText.textContent = 'CREATING...';
  loader.classList.remove('hidden');

  // Simulate API call
  await new Promise(r => setTimeout(r, 1800));

  // On success (demo)
  Auth.login({ firstName, lastName, email, city, role: 'user' });
  showToast('Account created successfully! Welcome to Four Wheels.', 'success');

  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1200);
});

// Real-time validation
document.getElementById('email')?.addEventListener('blur', function () {
  if (this.value && !AuthValidate.isEmail(this.value)) {
    AuthValidate.showError('email','emailErr');
  } else {
    AuthValidate.clearError('email','emailErr');
  }
});

document.getElementById('confirmPassword')?.addEventListener('input', function () {
  const pass = document.getElementById('password').value;
  if (this.value && this.value !== pass) {
    AuthValidate.showError('confirmPassword','confirmErr');
  } else {
    AuthValidate.clearError('confirmPassword','confirmErr');
  }
});
