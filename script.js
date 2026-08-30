/* =========================================================
   Mohd Suhail — Full-Stack Developer Portfolio
   Vanilla JavaScript: navigation, typing, reveal, filter,
   form handling, back-to-top.
   ========================================================= */

'use strict';

/* ---------- Preloader ---------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  }
});

/* ---------- Sticky Navbar & Back-to-Top ---------- */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function handleScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('show', y > 500);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMenu();
  }
});

// Close menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ---------- Active Nav Link on Scroll (ScrollSpy) ---------- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  const pos = window.scrollY + 120;
  sections.forEach((section) => {
    if (pos >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ---------- Typing Effect ---------- */
const roles = [
  'MERN Full-Stack Developer',
  'React.js & Node.js Specialist',
  'AI & ML Enthusiast',
  'API & Database Builder'
];
const typedEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 70);
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 40);
  }
}
type();

/* ---------- Reveal on Scroll ---------- */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // reveal once
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- Project Filtering ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach((card) => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(14px)';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- Contact Form (Client-side validation + demo submit) ---------- */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setFieldError(input, hasError) {
  input.classList.toggle('error', hasError);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  // Validate Name
  if (name.value.trim().length < 2) {
    setFieldError(name, true); valid = false;
  } else setFieldError(name, false);

  // Validate Email
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  setFieldError(email, !emailOk); if (!emailOk) valid = false;

  // Validate Message
  if (message.value.trim().length < 10) {
    setFieldError(message, true); valid = false;
  } else setFieldError(message, false);

  if (!valid) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Please fix the highlighted fields and try again.';
    return;
  }

  // Simulate successful submission
  const submitBtn = form.querySelector('button[type="submit"]');
  const original = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    formStatus.className = 'form-status success';
    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
    form.reset();
    submitBtn.innerHTML = original;
    submitBtn.disabled = false;
    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  }, 1200);
});

// Clear error state on input
form.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('input', () => setFieldError(input, false));
});

/* ---------- Footer year auto-update ---------- */
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.innerHTML = yearEl.innerHTML.replace('2026', currentYear);
}
