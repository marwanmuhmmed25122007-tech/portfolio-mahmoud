'use strict';


const loader      = document.getElementById('loader');
const loaderFill  = loader?.querySelector('.loader-fill');
const loaderPct   = document.getElementById('loaderPct');
const cursorDot   = document.getElementById('cursorDot');
const cursorRing  = document.getElementById('cursorRing');
const navbar      = document.getElementById('navbar');
const navOpen     = document.getElementById('navOpen');
const navClose    = document.getElementById('navClose');
const navOverlay  = document.getElementById('navOverlay');
const navBackdrop = document.getElementById('navBackdrop');

/*  LOADER */
document.body.style.overflow = 'hidden';

let pct = 0;
const loadInterval = setInterval(() => {
  pct += Math.random() * 18 + 5;
  if (pct > 100) pct = 100;
  if (loaderFill) loaderFill.style.width = pct + '%';
  if (loaderPct)  loaderPct.textContent  = Math.floor(pct) + '%';

  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loader?.classList.add('done');
      document.body.style.overflow = 'auto';
      setTimeout(initReveal, 150);
    }, 400);
  }
}, 80);

/* CUSTOM CURSOR */
if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  if ('ontouchstart' in window) {
    cursorDot.style.display    = 'none';
    cursorRing.style.display   = 'none';
    document.body.style.cursor = 'auto';
  }
}

/* NAV OVERLAY (mobile) */
function openNav() {
  navOverlay?.classList.add('open');
  navOverlay?.setAttribute('aria-hidden', 'false');
  navOpen?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('menu-open');
}

function closeNav() {
  navOverlay?.classList.remove('open');
  navOverlay?.setAttribute('aria-hidden', 'true');
  navOpen?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.body.classList.remove('menu-open');
}

navOpen    ?.addEventListener('click', openNav);
navClose   ?.addEventListener('click', closeNav);
navBackdrop?.addEventListener('click', closeNav);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay?.classList.contains('open')) closeNav();
});

document.querySelectorAll('.nav-panel a').forEach(l => l.addEventListener('click', closeNav));

/* NAVBAR SCROLL BEHAVIOUR
  Shared logic — home.js may extend it */
(function () {
  if (!navbar) return;
  let ticking = false;

  function updateNavbar() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled',  y > 80);
    navbar.classList.toggle('floating',  y > 120);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
})();

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible', 'is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.06 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}