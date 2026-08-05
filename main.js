/* ============================================================
   FIRE STORE — MAIN JAVASCRIPT
   main.js  ·  Simplified "renew / checkout-first" landing page
   ============================================================ */

/* ============================================================
   DATA — PRICING PLANS (device-based)
   ------------------------------------------------------------
   Checkout now opens the Fire-Store popup form (widget.js)
   instead of redirecting. Each plan is identified by its
   `productId` (the fire-store.shop product UUID).

   👉 FILL IN ALL 15 PRODUCT IDs BELOW.
   Structure:  pricingPlans[screens][months].productId
   Example ID: 'a8101175-8572-4aef-a16c-eef8a07312bf'
   ============================================================ */
const pricingPlans = {
  1: {
    1: { price: 29, monthly: 29, productId: '1051d075-1623-4fd5-939f-c963036bd428' },
    6: { price: 49, monthly: 8.1, productId: '6b1c7b94-6d18-4eee-940e-041b255ae128' },
    12: { price: 79, monthly: 6.58, productId: '9831772c-f677-4b08-b8f9-58235c12c66f' },
  },
  2: {
    1: { price: 59, monthly: 59, productId: 'a129cfc0-ef8b-48bb-8f5c-c1257037d635' },
    6: { price: 99, monthly: 16, productId: 'f5f9e906-6465-4cf0-8ec5-142adf44eb1d' },
    12: { price: 159, monthly: 13.25, productId: '0bd73a76-04b8-470b-8409-731399f2cedd' },
  },
  3: {
    1: { price: 89, monthly: 89, productId: '684b8256-23ec-4f6a-aad8-d689cfa779f2' },
    6: { price: 149, monthly: 24, productId: '2d91a4ce-a8a7-4996-9a39-80f1002191d6' },
    12: { price: 209, monthly: 17.42, productId: '38c339ea-fd7c-4e14-8986-c54b33de0787' },
  },
  4: {
    1: { price: 119, monthly: 119, productId: 'b9f7f235-021f-45d1-8e22-586edffc8cd3' },
    6: { price: 159, monthly: 26.5, productId: 'b320fb9d-304e-4d13-b890-3cbd47ee1db5' },
    12: { price: 239, monthly: 19.91, productId: '3524f282-7102-4166-b706-ffbe186a025b' },
  },
  5: {
    1: { price: 129, monthly: 129, productId: '2f85bed4-27bc-4132-a379-45140cfa10b1' },
    6: { price: 179, monthly: 29.83, productId: 'b2d0d8ef-037b-4688-b02d-98fa4734f311' },
    12: { price: 289, monthly: 24.08, productId: 'eabe0679-cdc8-4dbc-8773-63aafa700412' },
  },
};

/* ============================================================
   DATA — FAQ (two groups: new visitors + renewals)
   ============================================================ */
const faqNewHere = [
  {
    q: 'Is Fire Store legal and safe to use?',
    a: 'Fire Store operates as a premium reseller of licensed streaming content. All connections are encrypted and your data is never sold or shared with third parties. <strong>Thousands of users across 60+ countries rely on Fire Store daily.</strong>'
  },
  {
    q: 'Which devices work with Fire Store?',
    a: 'Fire Store works flawlessly on <strong>Amazon Firestick (all generations), Smart TVs (Samsung, LG, Sony), Android &amp; iOS devices, Windows and Mac computers, Chromecast, Roku, and MAG boxes.</strong>'
  },
  {
    q: 'Can I test it before buying a full plan?',
    a: '<strong>Yes! Message us on WhatsApp and request a free 24-hour trial.</strong> Genuine test access — no credit card required.'
  },
];

const faqRenewing = [
  {
    q: 'How do I renew without losing my settings or playlist?',
    a: 'Just pick your plan and check out — <strong>your existing line stays exactly as it was.</strong> Once payment is confirmed we extend your current subscription, so all your settings, favorites, and playlist remain untouched. Nothing to reinstall.'
  },
  {
    q: 'Will my username and password stay the same?',
    a: '<strong>Yes.</strong> Renewing keeps your same login credentials and device setup. You do not need to re-enter anything or reconfigure your Firestick, Smart TV, or app — it simply keeps working.'
  },
  {
    q: 'Can I add another screen to my existing plan?',
    a: '<strong>Absolutely.</strong> Open “Change plan / add screens” above the plans, pick the number of screens you need (1–5), and check out. Message us on WhatsApp and we’ll link the extra screens to your current account.'
  },
  {
    q: 'My subscription expired yesterday — can I still renew?',
    a: '<strong>Yes, and you keep your same account.</strong> Renewing after expiry reactivates your original line rather than creating a new one. Just check out with your usual plan and you’ll be back up within minutes.'
  },
  {
    q: 'How fast am I reactivated after paying?',
    a: '<strong>Instant to 5 minutes maximum.</strong> Once payment is confirmed, our automated system reactivates your line and sends confirmation via WhatsApp or Email. During peak hours our support team personally ensures every renewal is handled within minutes — never hours.'
  },
];

const faqGroups = [
  { label: 'New here?', items: faqNewHere },
  { label: 'Renewing?', items: faqRenewing },
];

/* ============================================================
   RENDER — FAQ ACCORDION
   ============================================================ */
function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  let idx = 0;
  faqGroups.forEach(group => {
    const label = document.createElement('div');
    label.className = 'faq-group-label';
    label.textContent = group.label;
    list.appendChild(label);

    group.items.forEach(item => {
      const i = idx++;
      const div = document.createElement('div');
      div.className = 'faq-item';
      div.innerHTML = `
        <button class="faq-q">
          <span>${item.q}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a" id="faq-a-${i}">
          <div class="faq-a-inner">${item.a}</div>
        </div>`;
      const btn = div.querySelector('.faq-q');
      const ans = div.querySelector('.faq-a');
      btn.addEventListener('click', () => {
        const isOpen = ans.classList.contains('open');
        document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('active'));
        if (!isOpen) { ans.classList.add('open'); btn.classList.add('active'); }
      });
      list.appendChild(div);
    });
  });
}

/* ============================================================
   NAVBAR SCROLL STATE
   ============================================================ */
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

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   FLAME CANVAS
   ============================================================ */
function initFlameCanvas() {
  const canvas = document.getElementById('flame-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;
  }
  resize();
  window.addEventListener('resize', resize);

  class FlameParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = -(Math.random() * 3 + 1);
      this.life = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.hue = Math.random() * 30 + 5; // red-orange range
    }
    update() {
      this.x += this.speedX + Math.sin(this.y * 0.05) * 0.5;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 + (1 - this.life) * 30}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) {
    const p = new FlameParticle();
    p.y = Math.random() * canvas.height;
    p.life = Math.random();
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   DEVICE SELECTOR + PRICING UPDATE
   ============================================================ */
function updatePriceCards(deviceCount) {
  const plans = pricingPlans[deviceCount];
  if (!plans) return;

  const p1 = plans[1], p6 = plans[6], p12 = plans[12];
  const deviceWord = deviceCount === 1 ? 'screen' : 'screens';

  const set = (id, html, isHTML) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (isHTML) el.innerHTML = html; else el.textContent = html;
  };

  // Prices & periods
  set('price-1m', `<span>$</span>${p1.price}`, true);
  set('period-1m', 'per month, billed monthly');
  set('price-6m', `<span>$</span>${p6.price}`, true);
  set('period-6m', `$${p6.monthly.toFixed(2)}/month — billed once`);
  set('price-12m', `<span>$</span>${p12.price}`, true);
  set('period-12m', `$${p12.monthly.toFixed(2)}/month — billed once`);

  // Screens bullet (only the middle mini-feature changes with device count)
  ['1m', '6m', '12m'].forEach(suffix => {
    set(`mini-screens-${suffix}`,
      `<strong>${deviceCount} ${deviceWord}</strong> at the same time`,
      true);
  });

  // Checkout — wire each button to the Fire-Store popup (widget.js).
  // The widget listens for clicks on ".firestore-buy-btn" and reads
  // "data-product-id", so we just tag the button and set the id for
  // the current screen/duration combo.
  const wireBuyButton = (id, plan) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.classList.add('firestore-buy-btn');
    btn.setAttribute('data-product-id', plan.productId);
    btn.onclick = null; // no more redirect — the popup handles the click
  };
  wireBuyButton('btn-1m', p1);
  wireBuyButton('btn-6m', p6);
  wireBuyButton('btn-12m', p12);
}

function initDeviceSelector() {
  const selector = document.getElementById('deviceSelector');
  if (!selector) return;

  selector.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selector.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePriceCards(Number(btn.dataset.devices));
    });
  });

  updatePriceCards(1);
}

/* ============================================================
   DEEP-LINKING — email pre-selection
   ?devices=<1-5>&plan=<1|6|12>&renew=1
   ============================================================ */
function selectDevice(deviceCount) {
  const selector = document.getElementById('deviceSelector');
  if (selector) {
    selector.querySelectorAll('.device-btn').forEach(b => {
      b.classList.toggle('active', Number(b.dataset.devices) === deviceCount);
    });
  }
  updatePriceCards(deviceCount);
}

function initDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const devices = parseInt(params.get('devices'), 10);
  const plan = params.get('plan');
  const renew = params.get('renew') === '1';

  let didPreselect = false;

  // Pre-select device count (clamped 1–5)
  if (Number.isInteger(devices) && devices >= 1 && devices <= 5) {
    selectDevice(devices);
    didPreselect = true;
  }

  // Highlight the chosen plan card
  const planBtnIds = { '1': 'btn-1m', '6': 'btn-6m', '12': 'btn-12m' };
  let targetCard = null;
  if (plan && planBtnIds[plan]) {
    const btn = document.getElementById(planBtnIds[plan]);
    targetCard = btn ? btn.closest('.plan-card') : null;
    if (targetCard) targetCard.classList.add('plan-highlight');
    didPreselect = true;
  }

  // "Welcome back" hero variant for renewals
  if (renew) {
    const title = document.getElementById('heroTitle');
    const sub = document.getElementById('heroSub');
    if (title) title.textContent = 'Welcome back';
    if (sub) sub.textContent = 'Renew your Fire Store subscription — pick your plan and check out in under a minute.';
  }

  // Scroll straight to the plans for warm/renewal traffic
  if (renew || didPreselect) {
    setTimeout(() => {
      (targetCard || document.getElementById('plans'))
        ?.scrollIntoView({ behavior: 'smooth', block: renew ? 'start' : 'center' });
    }, 400);
  }
}

/* ============================================================
   INIT — runs after DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Dynamic content
  renderFaq();

  // UI behaviours
  initNavbar();
  initDeviceSelector();
  initScrollReveal();

  // Hero background flame effect
  initFlameCanvas();

  // Email deep-link pre-selection (run after selector is wired up)
  initDeepLink();
});
