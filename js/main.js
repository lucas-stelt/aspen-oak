/* ─── Mobile Nav Toggle ─── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ─── Active Nav Link ─── */
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPath = link.getAttribute('href');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (linkPath === currentFile) link.classList.add('active');
});

/* ─── Pickup Time Slots ─── */
const timeSlots = {
  saturday: [
    '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM',
    '1:00 PM','1:30 PM','2:00 PM','2:30 PM'
  ],
  sunday: [
    '8:00 AM','8:30 AM','9:00 AM','9:30 AM',
    '10:00 AM','10:30 AM','11:00 AM','11:30 AM'
  ]
};

const pickupDay  = document.getElementById('pickup-day');
const pickupTime = document.getElementById('pickup-time');

function populateTimes() {
  if (!pickupDay || !pickupTime) return;
  const day = pickupDay.value;
  pickupTime.innerHTML = '<option value="">— Select a time —</option>';
  pickupTime.disabled = !day;
  if (timeSlots[day]) {
    timeSlots[day].forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      pickupTime.appendChild(opt);
    });
  }
}

if (pickupDay) {
  pickupDay.addEventListener('change', populateTimes);
  populateTimes();
}

/* ─── Quantity Controls ─── */
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const numEl = btn.closest('.qty-ctrl').querySelector('.qty-num');
    let val = parseInt(numEl.textContent, 10);
    if (btn.dataset.dir === 'up')   val = Math.min(val + 1, 12);
    if (btn.dataset.dir === 'down') val = Math.max(val - 1, 0);
    numEl.textContent = val;
  });
});

/* ─── Order Form Submission ─── */
const orderForm    = document.getElementById('order-form');
const orderSuccess = document.getElementById('order-success');

if (orderForm) {
  orderForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation — at least one item ordered
    const qtys = document.querySelectorAll('.qty-num');
    const total = Array.from(qtys).reduce((sum, el) => sum + parseInt(el.textContent, 10), 0);
    if (total === 0) {
      alert('Please add at least one item to your order.');
      return;
    }

    // Show success state
    orderForm.style.display   = 'none';
    orderSuccess.style.display = 'block';
    orderSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ─── Scroll Reveal (Intersection Observer) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => revealObserver.observe(el));

/* ─── Parallax on Hero Image ─── */
const parallaxImg = document.getElementById('hero-parallax-img');
if (parallaxImg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.13;
    parallaxImg.style.transform = `translateY(${offset}px) scale(1.05)`;
  }, { passive: true });
}

/* ─── Nav Shadow on Scroll ─── */
const navEl = document.querySelector('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── Contact Form Submission ─── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Message Sent!';
    btn.style.background = 'var(--dark)';
    btn.disabled = true;
    setTimeout(() => contactForm.reset(), 300);
  });
}
