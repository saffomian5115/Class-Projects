/* ============================================
   FOUR WHEELS — GLOBAL JS
   Particles, Page Loader, Utilities
   ============================================ */

// ===== PAGE LOADER =====
(function () {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">⬡ FOURWHEELS</div>
    <div class="loader-bar"><div class="loader-fill"></div></div>
    <div class="loader-text">INITIALIZING SYSTEM...</div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }, 1200);
  });
})();

// ===== PARTICLES CANVAS =====
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0, 245, 255' : '0, 102, 255',
      life: 0,
      maxLife: Math.random() * 200 + 100
    };
  }

  function init() {
    resize();
    for (let i = 0; i < 80; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const lifeFrac = p.life / p.maxLife;
      const alpha = p.opacity * (1 - lifeFrac);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ===== TOAST SYSTEM =====
(function () {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);

  window.showToast = function (message, type = 'info', duration = 3500) {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();

// ===== ANIMATED COUNTER =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + '+';
  }

  requestAnimationFrame(update);
}

// Trigger counters when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-card, .vehicle-card, .feature-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  revealObserver.observe(el);
});

// ===== CURSOR GLOW EFFECT =====
(function () {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ===== UTILITY: Format Price =====
window.formatPrice = function (price) {
  if (price >= 10000000) return (price / 10000000).toFixed(1) + ' Cr';
  if (price >= 100000) return (price / 100000).toFixed(1) + ' Lac';
  return price.toLocaleString();
};

// ===== UTILITY: Time Ago =====
window.timeAgo = function (dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  if (days < 30) return Math.floor(days / 7) + ' weeks ago';
  return Math.floor(days / 30) + ' months ago';
};
