/* ============================================
   FOUR WHEELS — SELL JS
   Multi-Step Form, Image Upload, Review
   ============================================ */

let currentStep = 1;
let uploadedPhotos = [];

// ===== STEP NAVIGATION =====
function goToStep(n) {
  document.querySelectorAll('.sell-step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');

  document.querySelectorAll('.sell-step').forEach(s => {
    const sn = parseInt(s.getAttribute('data-step'));
    s.classList.remove('active', 'done');
    if (sn === n) s.classList.add('active');
    if (sn < n)  s.classList.add('done');
  });

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Step 1 → 2
document.getElementById('toStep2')?.addEventListener('click', () => {
  if (!validateStep1()) return;
  goToStep(2);
});

// Step 2 → 3
document.getElementById('toStep3')?.addEventListener('click', () => goToStep(3));

// Step 3 → 4
document.getElementById('toStep4')?.addEventListener('click', () => {
  if (!validateStep3()) return;
  buildReview();
  goToStep(4);
});

// Back buttons
document.getElementById('backToStep1')?.addEventListener('click', () => goToStep(1));
document.getElementById('backToStep2')?.addEventListener('click', () => goToStep(2));
document.getElementById('backToStep3')?.addEventListener('click', () => goToStep(3));

// ===== STEP 1 VALIDATION =====
function validateStep1() {
  let valid = true;
  const fields = [
    ['vType','vTypeErr'], ['vBrand','vBrandErr'],
    ['vModel','vModelErr'], ['vYear','vYearErr'], ['vCity','vCityErr']
  ];
  fields.forEach(([id, eid]) => {
    const el = document.getElementById(id);
    const err = document.getElementById(eid);
    if (!el.value.trim()) {
      el.classList.add('error');
      err.classList.add('visible');
      valid = false;
    } else {
      el.classList.remove('error');
      err.classList.remove('visible');
    }
  });
  return valid;
}

// ===== STEP 3 VALIDATION =====
function validateStep3() {
  let valid = true;
  const price = document.getElementById('vPrice').value;
  const name  = document.getElementById('contactNameSell').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  if (!price || price < 1000) {
    document.getElementById('vPrice').classList.add('error');
    document.getElementById('vPriceErr').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('vPrice').classList.remove('error');
    document.getElementById('vPriceErr').classList.remove('visible');
  }

  if (!name) {
    document.getElementById('contactNameSell').classList.add('error');
    document.getElementById('contactNameErr').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('contactNameSell').classList.remove('error');
    document.getElementById('contactNameErr').classList.remove('visible');
  }

  if (!phone) {
    document.getElementById('contactPhone').classList.add('error');
    document.getElementById('contactPhoneErr').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('contactPhone').classList.remove('error');
    document.getElementById('contactPhoneErr').classList.remove('visible');
  }

  return valid;
}

// ===== BUILD REVIEW =====
function buildReview() {
  const get = id => document.getElementById(id)?.value || '—';
  const priceType = document.querySelector('input[name="priceType"]:checked')?.value || 'Fixed';

  const rows = [
    { key: 'VEHICLE TYPE',   val: get('vType') },
    { key: 'BRAND',          val: get('vBrand') },
    { key: 'MODEL',          val: get('vModel') },
    { key: 'YEAR',           val: get('vYear') },
    { key: 'FUEL',           val: get('vFuel') },
    { key: 'TRANSMISSION',   val: get('vTransmission') },
    { key: 'MILEAGE (KM)',   val: get('vMileage') || '—' },
    { key: 'COLOR',          val: get('vColor') || '—' },
    { key: 'ENGINE',         val: get('vEngine') || '—' },
    { key: 'CONDITION',      val: get('vCondition') },
    { key: 'CITY',           val: get('vCity') },
    { key: 'PHOTOS',         val: uploadedPhotos.length + ' uploaded' },
    { key: 'PRICE TYPE',     val: priceType },
    { key: 'CONTACT',        val: get('contactNameSell') + ' · ' + get('contactPhone') },
  ];

  const price = get('vPrice');
  const priceFormatted = price !== '—' ? 'PKR ' + window.formatPrice(parseInt(price)) : '—';

  document.getElementById('reviewPreview').innerHTML = `
    ${rows.map(r => `
      <div class="review-row">
        <span class="review-key">${r.key}</span>
        <span class="review-val">${r.val}</span>
      </div>`).join('')}
    <div class="review-row">
      <span class="review-key">ASKING PRICE</span>
      <span class="review-price-val">${priceFormatted}</span>
    </div>
  `;
}

// ===== IMAGE UPLOAD =====
const uploadZone  = document.getElementById('uploadZone');
const photoInput  = document.getElementById('photoInput');
const previewGrid = document.getElementById('photoPreviewGrid');

document.getElementById('browseBtn')?.addEventListener('click', () => photoInput.click());
uploadZone?.addEventListener('click', e => { if (e.target.id !== 'browseBtn') photoInput.click(); });

photoInput?.addEventListener('change', () => handleFiles(photoInput.files));

// Drag and drop
uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} is too large (max 5MB)`, 'error'); return; }
    if (uploadedPhotos.length >= 10) { showToast('Maximum 10 photos allowed', 'info'); return; }

    const reader = new FileReader();
    reader.onload = e => {
      const id = Date.now() + Math.random();
      uploadedPhotos.push({ id, src: e.target.result, name: file.name });
      renderPhotoPreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotoPreviews() {
  previewGrid.innerHTML = uploadedPhotos.map((p, i) => `
    <div class="photo-preview-item" data-pid="${p.id}">
      <img src="${p.src}" alt="Photo ${i+1}"/>
      <button class="photo-remove-btn" onclick="removePhoto('${p.id}')">✕</button>
      ${i === 0 ? '<div class="photo-main-badge">MAIN</div>' : ''}
    </div>
  `).join('');
}

window.removePhoto = function(id) {
  uploadedPhotos = uploadedPhotos.filter(p => p.id != id);
  renderPhotoPreviews();
};

// ===== DESCRIPTION COUNTER =====
document.getElementById('vDesc')?.addEventListener('input', function () {
  const len = Math.min(this.value.length, 500);
  this.value = this.value.substring(0, 500);
  document.getElementById('descCount').textContent = len;
  document.getElementById('descCount').style.color = len >= 450 ? 'var(--neon-orange)' : '';
});

// ===== PRICE HINT =====
document.getElementById('vPrice')?.addEventListener('input', function () {
  const val = parseInt(this.value);
  if (!val) { document.getElementById('priceHint').textContent = ''; return; }
  document.getElementById('priceHint').textContent = '≈ PKR ' + window.formatPrice(val);
});

// ===== SUBMIT =====
document.getElementById('sellForm')?.addEventListener('submit', async e => {
  e.preventDefault();

  if (!document.getElementById('agreeTerms').checked) {
    document.getElementById('agreeTermsErr').classList.add('visible');
    return;
  }
  document.getElementById('agreeTermsErr').classList.remove('visible');

  const btn = document.getElementById('submitListingBtn');
  const txt = document.getElementById('submitText');
  const ldr = document.getElementById('submitLoader');

  btn.disabled = true;
  txt.textContent = 'SUBMITTING...';
  ldr.classList.remove('hidden');

  await new Promise(r => setTimeout(r, 2000));

  document.getElementById('successModal').classList.add('open');
  btn.disabled = false;
  txt.textContent = '🚀 POST LISTING';
  ldr.classList.add('hidden');
});

// ===== EDIT MODE (from profile) =====
(function checkEditMode() {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  if (editId) {
    document.querySelector('.page-hero-title').innerHTML =
      'EDIT YOUR <span class="title-glow">LISTING</span>';
    showToast('Edit mode: update your listing details below.', 'info');
  }
})();
