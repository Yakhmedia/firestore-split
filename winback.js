/* ============================================================
   FIRE STORE — WIN-BACK CAMPAIGN MODULE
   winback.js

   Self-contained. Everything the "Returning Customer Screen
   Upgrade" campaign adds to the public landing page lives here.

   TO DISABLE THE ENTIRE CAMPAIGN (rollback):
     1. Delete the `import './winback.js'` line in main.js
     2. Delete the inline <head> WINBACK block in index.html
   The public page then returns to byte-identical behaviour:
   `annualLocked` resolves false, `--promo-bar-h` resolves 0px,
   and every scoped `.promo-winback` / `.promo-expired` style
   becomes unreachable.

   Spec: IMPLEMENTATION_WINBACK_LANDING_2SCREEN.md
   ============================================================ */

import { pricingPlans, selectDevice } from './main.js';

/* ---- campaign constants -------------------------------------------------- */

// Campaign price for the 12-month / 2-screen returning-customer offer.
const CAMPAIGN_PRICE = 79;

// fire-store.shop product UUID for the unlisted campaign product
// (12 months · 2 screens · $79 · WINBACK_2SCREEN_12M).
// TODO: replace with the real unlisted product UUID before launch.
// Nothing charges the correct total until this is set.
const CAMPAIGN_PRODUCT_ID = '__WINBACK_2SCREEN_12M_PRODUCT_ID__';

const PLACEHOLDER_PRODUCT_ID = '__WINBACK_2SCREEN_12M_PRODUCT_ID__';

const WA_NUMBER = '12029927413';

/* ---- state ------------------------------------------------------------- */

const root = document.documentElement;
const isWinback = () => root.classList.contains('promo-winback');
const isExpired = () => root.classList.contains('promo-expired');

/* ---- analytics ------------------------------------------------------------ */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

function captureUtms() {
  try {
    const params = new URLSearchParams(location.search);
    const existing = JSON.parse(sessionStorage.getItem('winback_utms') || '{}');
    let changed = false;
    UTM_KEYS.forEach(k => {
      const v = params.get(k);
      if (v && existing[k] !== v) { existing[k] = v; changed = true; }
    });
    if (changed) sessionStorage.setItem('winback_utms', JSON.stringify(existing));
    return existing;
  } catch (_) {
    return {};
  }
}

function readUtms() {
  try {
    return JSON.parse(sessionStorage.getItem('winback_utms') || '{}');
  } catch (_) {
    return {};
  }
}

function track(event, params = {}) {
  const base = {
    campaign: 'winback_screen_upgrade',
    source: readUtms().utm_source || 'direct',
    ...readUtms(),
  };
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, { ...base, ...params });
  }
}

/* ---- deadline formatting ------------------------------------------------- */

/**
 * Formats `window.WINBACK.endAt` for display in the campaign's own timezone
 * (taken from the ISO offset), never the visitor's. Single source of truth:
 * the constant declared once in the inline <head> script.
 * e.g. "Sat, Sep 14 · 11:59 PM ET"
 */
function formatDeadline() {
  const cfg = window.WINBACK || {};
  const iso = cfg.endAt;
  const tzLabel = cfg.tzLabel || '';
  if (!iso) return '';

  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  // Shift the instant so that reading it as UTC yields the campaign-tz wall clock.
  const m = iso.match(/([+-])(\d{2}):?(\d{2})$/);
  let shifted = date;
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    const offsetMin = sign * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
    shifted = new Date(date.getTime() + offsetMin * 60000);
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone: 'UTC',
  }).formatToParts(shifted).reduce((acc, p) => (acc[p.type] = p.value, acc), {});

  const stamp = `${parts.weekday}, ${parts.month} ${parts.day} · ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
  return tzLabel ? `${stamp} ${tzLabel}` : stamp;
}

/* ---- scroll helper ----------------------------------------------------- */

function campaignCard() {
  const btn = document.getElementById('btn-12m');
  return btn ? btn.closest('.plan-card') : null;
}

function scrollToCampaignCard() {
  const card = campaignCard();
  if (!card) return;
  const barH = parseInt(getComputedStyle(root).getPropertyValue('--promo-bar-h'), 10) || 0;
  const navH = 70;
  const y = card.getBoundingClientRect().top + window.scrollY - barH - navH - 16;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

/* ---- announcement bar -------------------------------------------------- */

function injectAnnouncementBar() {
  const bar = document.createElement('div');
  bar.className = 'promo-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Returning customer offer');
  bar.innerHTML = `
    <div class="promo-bar-inner">
      <p class="promo-bar-text">
        🔥 <strong>Returning Customer Offer:</strong>
        Get 12 Months + a FREE Second Screen for $${CAMPAIGN_PRICE}
        <span class="promo-bar-sub">Available for a limited time through your comeback invitation.</span>
      </p>
      <button type="button" class="promo-bar-cta">Claim My Upgrade</button>
    </div>`;
  bar.querySelector('.promo-bar-cta').addEventListener('click', () => {
    track('winback_offer_select', { cta: 'announcement_bar' });
    scrollToCampaignCard();
  });
  document.body.insertBefore(bar, document.body.firstChild);
}

/* ---- hero hooks ------------------------------------------------------- */

function applyHeroCopy() {
  const badge = document.querySelector('#heroBadge .hb-text');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  const cta = document.querySelector('.hero-ctas .cta-primary');

  if (badge) badge.textContent = 'Returning customer offer';
  if (title) title.textContent = 'Welcome Back — Your Upgrade Is Ready';
  if (sub) sub.textContent = `Reactivate for 12 months and get a second screen free — $${CAMPAIGN_PRICE} total.`;
  if (cta) {
    cta.textContent = 'Claim My Upgrade';
    cta.addEventListener('click', e => {
      e.preventDefault();
      track('winback_offer_select', { cta: 'hero' });
      scrollToCampaignCard();
    });
  }
}

/* ---- plans-section heading ------------------------------------------- */

function applyPlansHeading() {
  const header = document.querySelector('#plans .section-header');
  if (!header) return;
  const tag = header.querySelector('.section-tag');
  const h2 = header.querySelector('h2');
  const p = header.querySelector('p');
  if (tag) tag.textContent = '🔥 Returning Customer Offer';
  if (h2) h2.textContent = 'Welcome Back — Your Upgrade Is Ready';
  if (p) p.textContent = 'Reactivate for 12 months and enjoy two screens at the regular one-screen annual price.';
}

/* ---- explanatory line under the device selector --------------------- */

function injectSelectorNote() {
  const container = document.querySelector('.device-selector-container');
  if (!container || document.querySelector('.promo-selector-note')) return;
  const note = document.createElement('p');
  note.className = 'promo-selector-note';
  note.textContent = 'Your comeback offer is fixed at 12 months with 2 screens. The other plans update with the selector.';
  container.insertAdjacentElement('afterend', note);
}

/* ---- the annual campaign card --------------------------------------- */

function buildCampaignCard() {
  const card = campaignCard();
  if (!card) return;

  const regular = pricingPlans[2] && pricingPlans[2][12] ? pricingPlans[2][12].price : null;
  const showAnchor = typeof regular === 'number' && regular > CAMPAIGN_PRICE;
  const saving = showAnchor ? regular - CAMPAIGN_PRICE : 0;
  const deadline = formatDeadline();

  const anchorRow = showAnchor
    ? `<div class="promo-price-row">
         <span class="promo-was">
           <span class="sr-only">Regular 2-screen annual price</span>
           <s aria-hidden="true">$${regular}</s>
         </span>
         <span class="promo-now">
           <span class="sr-only">You pay</span>$${CAMPAIGN_PRICE} <em>total</em>
         </span>
       </div>
       <div class="promo-value">Second screen free — an $${saving} value</div>`
    : `<div class="promo-price-row">
         <span class="promo-now"><span class="sr-only">You pay</span>$${CAMPAIGN_PRICE} <em>total</em></span>
       </div>
       <div class="promo-value">Free second-screen upgrade included</div>`;

  card.classList.add('promo-card');
  card.innerHTML = `
    <div class="plan-popular-badge promo-badge">Returning Customer Offer</div>
    <div class="plan-duration" style="margin-top: 20px">12 Months</div>
    <div class="promo-screens">2 Screens Included</div>
    ${anchorRow}
    <ul class="plan-mini-features">
      <li>100,000+ channels · 4K</li>
      <li><strong>2 screens</strong> at the same time</li>
      <li>Instant activation via WhatsApp / Email</li>
    </ul>
    <p class="promo-fineprint">
      Watch on two screens at the same time. No coupon code required.
    </p>
    <button type="button" class="btn-plan btn-plan-popular firestore-buy-btn" id="btn-12m">
      Reactivate &amp; Get 2 Screens →
    </button>
    ${deadline ? `<p class="promo-deadline">Offer ends ${deadline}</p>` : ''}
  `;

  const btn = card.querySelector('#btn-12m');
  if (btn) {
    btn.setAttribute('data-product-id', CAMPAIGN_PRODUCT_ID);
    btn.addEventListener('click', () => {
      track('winback_offer_select', {
        cta: 'campaign_card', plan: '12_month_2_screens',
        screens: 2, price: CAMPAIGN_PRICE,
      });
    });
    if (CAMPAIGN_PRODUCT_ID === PLACEHOLDER_PRODUCT_ID) {
      console.warn('[winback] CAMPAIGN_PRODUCT_ID is still a placeholder — checkout will not work. Set it in winback.js before launch.');
    }
  }
}

/* ---- objection-handling block -------------------------------------- */

function injectObjectionBlock() {
  const strip = document.querySelector('#plans .payment-trust-strip');
  if (!strip || document.querySelector('.promo-objections')) return;

  const block = document.createElement('div');
  block.className = 'promo-objections';
  block.innerHTML = `
    <h3>Need Help Before You Reactivate?</h3>
    <div class="promo-objections-grid">
      <a class="promo-objection" href="https://wa.me/${WA_NUMBER}?text=RENEW" target="_blank" rel="noopener">
        <strong>Need help choosing?</strong>
        <span>We'll help you personally on WhatsApp.</span>
      </a>
      <a class="promo-objection" href="https://wa.me/${WA_NUMBER}?text=SETUP" target="_blank" rel="noopener">
        <strong>Need setup assistance?</strong>
        <span>We'll help you activate and connect your devices.</span>
      </a>
    </div>`;
  block.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => track('winback_offer_select', { cta: 'objection_block' })));
  strip.insertAdjacentElement('afterend', block);
}

/* ---- FAQ group ----------------------------------------------------- */

const faqWinback = [
  {
    q: 'What does “2 screens” mean?',
    a: 'It means <strong>two screens can use the subscription at the same time</strong>, subject to the normal service terms.'
  },
  {
    q: 'Do I need a coupon code?',
    a: '<strong>No.</strong> The free second-screen upgrade is applied automatically when you check out from this offer page.'
  },
  {
    q: 'Is the offer available on the monthly or 6-month plans?',
    a: '<strong>No.</strong> This comeback upgrade is attached to the 12-month plan only.'
  },
  {
    q: 'Can I get help reactivating my account?',
    a: 'Yes. <strong>Message us on WhatsApp</strong> and the team will reactivate your original line — your settings, favorites, and playlist stay exactly as they were.'
  },
  {
    q: 'Can I test the service first?',
    a: 'Message us on WhatsApp to request a trial, <strong>subject to approval and availability.</strong>'
  },
];

/** Called by main.js BEFORE renderFaq(). Mutates faqGroups in place. */
export function maybeInjectWinbackFaq(faqGroups) {
  if (!isWinback()) return;
  faqGroups.unshift({ label: 'Your comeback offer', items: faqWinback });
}

/* ---- expired state ----------------------------------------------- */

function injectExpiredNotice() {
  const container = document.querySelector('#plans .container');
  if (!container || document.querySelector('.promo-expired-notice')) return;
  const notice = document.createElement('div');
  notice.className = 'promo-expired-notice';
  notice.innerHTML = `
    <strong>This offer has ended.</strong>
    Our standard plans are below — <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">message us on WhatsApp</a>
    if you'd like help choosing.`;
  container.insertBefore(notice, container.firstChild);
}

/* ---- sticky mobile CTA ------------------------------------------- */

function injectStickyCta() {
  const bar = document.createElement('div');
  bar.className = 'promo-sticky';
  bar.innerHTML = `
    <span class="promo-sticky-info">$${CAMPAIGN_PRICE} · 12 mo · 2 screens</span>
    <button type="button" class="promo-sticky-cta">Reactivate →</button>`;
  bar.querySelector('.promo-sticky-cta').addEventListener('click', () => {
    track('winback_offer_select', { cta: 'sticky_mobile' });
    scrollToCampaignCard();
  });
  document.body.appendChild(bar);

  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.footer');
  let pastHero = false;
  let atFooter = false;
  const sync = () => bar.classList.toggle('is-visible', pastHero && !atFooter);

  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }, { threshold: 0 })
      .observe(hero);
  } else {
    pastHero = true;
  }
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; sync(); }, { threshold: 0 })
      .observe(footer);
  }
  sync();
}

/* ---- init -------------------------------------------------------- */

export function initWinback() {
  captureUtms();

  if (isExpired()) {
    injectExpiredNotice();
    track('winback_offer_expired');
    return;
  }

  if (!isWinback()) return;

  // The screen selector must land on 2 so the real $159 2-screen annual
  // price is the on-screen anchor. Runs after initDeviceSelector();
  // initDeepLink() runs after this, so an explicit ?devices=N still wins.
  selectDevice(2);

  injectAnnouncementBar();
  applyHeroCopy();
  applyPlansHeading();
  injectSelectorNote();
  buildCampaignCard();
  injectObjectionBlock();
  injectStickyCta();
  // .shop-section cross-sell is suppressed by scoped CSS (display:none) — no JS needed.

  track('winback_offer_view', { cta: 'page_load' });
}
