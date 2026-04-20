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
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.outline = '';
      if (!field.value.trim()) {
        field.style.outline = '2px solid #c0392b';
        valid = false;
      }
    });

    if (!valid) return;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    })
      .then(() => {
        btn.textContent = 'Message Sent!';
        btn.style.background = 'var(--dark)';
        setTimeout(() => contactForm.reset(), 400);
      })
      .catch(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        alert('Something went wrong. Please try again or email us directly.');
      });
  });
}
