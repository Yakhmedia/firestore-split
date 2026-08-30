/* ============================================================
   FIRESTORE.TV — APP LANDING PAGE
   app.js · Product-led landing (app.html)
   ------------------------------------------------------------
   Self-contained: reuses the same navbar / flame / reveal /
   FAQ patterns as main.js, plus an accessible product-showcase
   tablist. No checkout/widget logic here — the primary CTAs
   link out to the Firestore.tv app.
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — where the CTAs point.
   Single source of truth: change here to swap the trial/sign-in
   destinations (e.g. to a /login?mode=signup route) later.
   Anchors in app.html already carry these as static hrefs so
   the page works without JS; this keeps analytics + overrides
   in one place.
   ------------------------------------------------------------ */
const APP_URL = 'https://firestore.tv/';

/* ============================================================
   DATA — FAQ (adapted to the streaming-app plan)
   ============================================================ */
const faqItems = [
  {
    q: 'What can I watch on Firestore.tv?',
    a: 'Live TV channels, movies, series, and supported sports — all in one familiar app. <strong>Content, events, and availability vary by plan and provider.</strong>',
  },
  {
    q: 'Which devices are supported?',
    a: 'Firestore.tv works on <strong>Amazon Firestick, Smart TVs (Samsung, LG, Sony), Android &amp; iOS, Windows and Mac, and more.</strong> One account works across your screens.',
  },
  {
    q: 'How does the 24-hour free trial work?',
    a: 'Create an account and, if eligible, enjoy <strong>24 hours of access on one device</strong> so you can try the experience before choosing a plan. Eligibility may vary.',
  },
  {
    q: 'Do I need a payment card for the trial?',
    a: '<strong>No payment card is required</strong> to start an eligible free trial.',
  },
  {
    q: 'Can I watch on more than one device?',
    a: 'Yes — paid plans offer <strong>1 to 5 simultaneous screens</strong>. The free trial is limited to one device.',
  },
  {
    q: 'Is 4K available?',
    a: '<strong>Up to 4K is available where supported</strong> by your device, connection, and the content itself.',
  },
  {
    q: 'How do I connect a television?',
    a: 'Sign in on your TV or streaming device and follow the <strong>guided pairing steps</strong> — no playlists or manual configuration to manage.',
  },
  {
    q: 'Where can I get support?',
    a: 'Email us any time at <strong>contact@firestore.tv</strong> and our team will help you get set up.',
  },
];

/* ============================================================
   RENDER — FAQ ACCORDION (native-friendly single list)
   ============================================================ */
function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;

  faqItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'faq-item';
    div.innerHTML = `
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${item.q}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-a" id="faq-a-${i}" role="region">
        <div class="faq-a-inner">${item.a}</div>
      </div>`;
    const btn = div.querySelector('.faq-q');
    const ans = div.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = ans.classList.contains('open');
      list.querySelectorAll('.faq-a').forEach((a) => a.classList.remove('open'));
      list.querySelectorAll('.faq-q').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        ans.classList.add('open');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        track('faq_open', { question: i });
      }
    });
    list.appendChild(div);
  });
}

/* ============================================================
   NAVBAR — scroll state + accessible mobile drawer
   ============================================================ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  const setOpen = (open) => {
    toggleBtn.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => {
    setOpen(!toggleBtn.classList.contains('active'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // The mobile backdrop is the nav list's pseudo-element. Clicking its
  // exposed area closes the drawer without requiring another button.
  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.classList.contains('active')) {
      setOpen(false);
      toggleBtn.focus();
    }
  });
}

/* ============================================================
   PRODUCT SHOWCASE — accessible tabs
   ============================================================ */
function initShowcaseTabs() {
  const tablist = document.getElementById('fsTabs');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const stage = document.querySelector('.fs-showcase-stage');

  const selectTab = (tab, setFocus = true) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (setFocus) tab.focus();
    track('product_tab_select', { category: tab.id.replace('tab-', '') });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        next = tabs[(index + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        selectTab(next);
      }
    });
  });

  if (stage) {
    let startX = null;
    let startY = null;
    let lastSwipeAt = 0;

    stage.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      startX = touch ? touch.clientX : null;
      startY = touch ? touch.clientY : null;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      if (startX === null || startY === null || !touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const now = Date.now();
      startX = null;
      startY = null;

      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (now - lastSwipeAt < 450) return;
      lastSwipeAt = now;

      const currentIndex = tabs.findIndex(
        (tab) => tab.getAttribute('aria-selected') === 'true'
      );
      const nextIndex = deltaX < 0
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      selectTab(tabs[nextIndex], false);
    }, { passive: true });
  }
}

/* ============================================================
   STICKY MOBILE CTA
   ============================================================ */
function initStickyBar() {
  const bar = document.getElementById('fsStickyBar');
  const heroCtas = document.querySelector('.fs-hero-ctas');
  const finalBanner = document.querySelector(
    'section[aria-label="Get started"] .fs-banner'
  );
  if (!bar || !heroCtas) return;

  let heroVisible = true;
  let finalVisible = false;

  const updateVisibility = () => {
    const visible = !heroVisible && !finalVisible;
    bar.classList.toggle('visible', visible);
    bar.setAttribute('aria-hidden', String(!visible));
    bar.inert = !visible;
  };

  if (!('IntersectionObserver' in window)) {
    updateVisibility();
    return;
  }

  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    updateVisibility();
  }, { threshold: 0.05 });
  heroObserver.observe(heroCtas);

  if (finalBanner) {
    const finalObserver = new IntersectionObserver(([entry]) => {
      finalVisible = entry.isIntersecting;
      updateVisibility();
    }, { threshold: 0.15 });
    finalObserver.observe(finalBanner);
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => observer.observe(el));
}

/* ============================================================
   FLAME CANVAS (shared effect; respects reduced motion)
   ============================================================ */
function initFlameCanvas() {
  const canvas = document.getElementById('flame-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 90;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight * 0.4;
  let animId = null;
  let isAnimating = false;

  function resize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight * 0.4;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = viewportWidth * dpr;
    canvas.height = viewportHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  class FlameParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * viewportWidth;
      this.y = viewportHeight;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = -(Math.random() * 3 + 1);
      this.life = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.hue = Math.random() * 30 + 5;
    }
    update() {
      this.x += this.speedX + Math.sin(this.y * 0.05) * 0.5;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.5;
      ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 + (1 - this.life) * 30}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new FlameParticle();
    p.y = Math.random() * viewportHeight;
    p.life = Math.random();
    particles.push(p);
  }

  function animate() {
    if (document.hidden) {
      animId = null;
      isAnimating = false;
      return;
    }
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (isAnimating || document.hidden) return;
    isAnimating = true;
    animate();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId !== null) cancelAnimationFrame(animId);
      animId = null;
      isAnimating = false;
    } else {
      startAnimation();
    }
  });

  startAnimation();
}

/* ============================================================
   ANALYTICS — reuse existing gtag, no personal data
   ============================================================ */
function track(event, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

function initAnalytics() {
  track('landing_view', { page: 'app' });
  document.querySelectorAll('[data-analytics]').forEach((el) => {
    el.addEventListener('click', () => {
      const type = el.getAttribute('data-analytics');
      const map = {
        trial: 'trial_cta_click',
        signin: 'signin_click',
        plans: 'plans_click',
      };
      const name = map[type];
      if (name) track(name, { location: el.getAttribute('data-loc') || 'unknown' });
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderFaq();
  initNavbar();
  initShowcaseTabs();
  initStickyBar();
  initScrollReveal();
  initFlameCanvas();
  initAnalytics();
});
