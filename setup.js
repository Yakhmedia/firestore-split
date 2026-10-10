/* ============================================================
   FIRE STORE — SETUP / HARDWARE LANDING SCRIPT
   setup.js  ·  Lean script for the Google Ads–compliant
   hardware + setup landing page (index.html / setup.html).

   Deliberately contains NO pricing data, NO campaign code
   (nfl/winback), and NO flame canvas — only the three bits of
   behaviour the clean page actually needs:
     1. navbar scroll state + mobile hamburger
     2. scroll-reveal for .reveal elements
     3. FAQ accordion (static markup, no data injection)
   ============================================================ */

/* ── Navbar: scroll state + mobile toggle ───────────────── */
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isActive = toggleBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Scroll reveal ──────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── FAQ accordion (operates on static markup) ──────────── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const ans = btn.nextElementSibling;
      if (!ans) return;
      const isOpen = ans.classList.contains('open');
      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('active'));
      if (!isOpen) { ans.classList.add('open'); btn.classList.add('active'); }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initFaq();
});
