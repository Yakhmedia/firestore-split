/* ============================================================
   FIRE STORE — NFL OPENING WEEKEND CAMPAIGN MODULE
   nfl.js

   Self-contained. Everything the 72-hour "Opening Weekend" sale
   adds to the public landing page lives here.

   TO DISABLE THE ENTIRE CAMPAIGN (rollback):
     1. Delete the `import './nfl.js'` line + `initNfl()` call in main.js
     2. Delete the inline <head> NFLWEEK1 block in index.html
     3. Delete this file, the `.promo-nfl` CSS block, and the
        schedule-strip shell in index.html
   The public page then returns to byte-identical behaviour:
   every scoped `.promo-nfl` style becomes unreachable, and the
   campaign also self-expires at `endAt` with no deploy.

   Spec: IMPLEMENTATION_NFL_OPENING_WEEKEND.md
   ============================================================ */

import { captureUtms, track as trackBase, formatDeadline } from './campaign-utils.js';

/* ---- campaign constants -------------------------------------------------- */

const CAMPAIGN = 'nfl_week1_2026';

const WEEKEND = [
  { day: 'Sun', label: 'Full Week 1 Slate', detail: 'Games all afternoon, every market' },
  { day: 'Sun', label: 'Sunday Night Football', detail: 'Cowboys–Giants' },
  { day: 'Mon', label: 'Monday Night Football', detail: 'Broncos–Chiefs' },
  { day: 'All Weekend', label: 'Full MLB Schedule', detail: 'Every game, every market' },
];

/* ---- state ------------------------------------------------------------- */

const root = document.documentElement;
const isNfl = () => root.classList.contains('promo-nfl');

let tickInterval = null;
let originalCopy = null;

/* ---- analytics ----------------------------------------------------------- */

function track(event, params = {}) {
  trackBase(CAMPAIGN, event, params);
}

/* ---- scroll helper ------------------------------------------------------ */

function scrollToPlans() {
  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
}

/* ---- capture original copy so a live mid-session revert is possible ----- */

function captureOriginalCopy() {
  if (originalCopy) return;
  originalCopy = {
    badge: document.querySelector('#heroBadge .hb-text')?.textContent || '',
    title: document.getElementById('heroTitle')?.textContent || '',
    sub: document.getElementById('heroSub')?.innerHTML || '',
    cta: document.querySelector('.hero-ctas .cta-primary')?.textContent || '',
    sectionTag: document.querySelector('#plans .section-tag')?.textContent || '',
    h2: document.querySelector('#plans .section-header h2')?.textContent || '',
    popularBadge: document.querySelector('.plan-card.popular .plan-popular-badge')?.textContent || '',
  };
}

/* ---- hero hooks ----------------------------------------------------------- */

function applyHeroCopy() {
  const badge = document.querySelector('#heroBadge .hb-text');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  const cta = document.querySelector('.hero-ctas .cta-primary');

  if (badge) badge.textContent = '🚨 72-HOUR OPENING WEEKEND SALE';
  if (title) title.textContent = "Don't Miss a Single Snap This Weekend.";
  if (sub) {
    sub.innerHTML = '<strong>Cowboys–Giants</strong> Sunday, Sunday Night Football, and ' +
      '<strong>Broncos–Chiefs</strong> on Monday Night Football — plus a full MLB weekend. ' +
      '100,000+ channels in 4K, live in under a minute.';
  }
  if (cta) {
    cta.textContent = '⚡ Get Access Before Kickoff';
    cta.addEventListener('click', () => track('nfl_week1_cta', { cta: 'hero' }));
  }
}

/* ---- countdown timer ------------------------------------------------------ */

function clampMs(ms) { return ms > 0 ? ms : 0; }

function coarseSummary(ms) {
  const totalMin = Math.round(ms / 60000);
  if (totalMin <= 0) return 'Offer has ended';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) {
    return `About ${h} hour${h === 1 ? '' : 's'}${m > 0 ? ` ${m} minute${m === 1 ? '' : 's'}` : ''} left`;
  }
  return `About ${m} minute${m === 1 ? '' : 's'} left`;
}

function injectCountdown() {
  const sub = document.getElementById('heroSub');
  if (!sub || document.getElementById('nflCountdown')) return;

  const endAt = window.NFLWEEK1.endAt;
  const tzLabel = window.NFLWEEK1.tzLabel || '';
  const deadline = formatDeadline(endAt, tzLabel);

  const wrap = document.createElement('div');
  wrap.id = 'nflCountdown';
  wrap.className = 'nfl-countdown';
  wrap.innerHTML = `
    <div class="nfl-countdown-digits" aria-hidden="true">
      <div class="nfl-countdown-seg"><span id="nflH">00</span><small>HRS</small></div>
      <div class="nfl-countdown-seg"><span id="nflM">00</span><small>MIN</small></div>
      <div class="nfl-countdown-seg"><span id="nflS">00</span><small>SEC</small></div>
    </div>
    <p class="sr-only" id="nflCountdownSummary" aria-live="polite"></p>
    ${deadline ? `<p class="nfl-countdown-deadline">Sale ends <time datetime="${endAt}">${deadline}</time></p>` : ''}
  `;
  sub.insertAdjacentElement('afterend', wrap);

  const hEl = wrap.querySelector('#nflH');
  const mEl = wrap.querySelector('#nflM');
  const sEl = wrap.querySelector('#nflS');
  const summaryEl = wrap.querySelector('#nflCountdownSummary');
  let lastSummaryMinute = null;

  function render() {
    const ms = clampMs(Date.parse(endAt) - Date.now());
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = n => String(n).padStart(2, '0');

    hEl.textContent = pad(h);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);

    const currentMinute = Math.floor(ms / 60000);
    if (currentMinute !== lastSummaryMinute) {
      lastSummaryMinute = currentMinute;
      summaryEl.textContent = coarseSummary(ms);
    }

    if (ms <= 0) {
      stopCountdown();
      revertToEvergreen();
    }
  }

  render();
  tickInterval = setInterval(render, 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') render();
  });
}

function stopCountdown() {
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
}

/* ---- plans-section heading ------------------------------------------- */

function applyPlansHeading() {
  const tag = document.querySelector('#plans .section-tag');
  const h2 = document.querySelector('#plans .section-header h2');
  const popularBadge = document.querySelector('.plan-card.popular .plan-popular-badge');
  if (tag) tag.textContent = '🏈 Opening Weekend — Ends Monday Night';
  if (h2) h2.textContent = 'Be Live Before Kickoff';
  if (popularBadge) popularBadge.textContent = '⭐ Season Pass — Best Value';
}

function injectDeadlineLine() {
  const period = document.getElementById('period-12m');
  if (!period || document.querySelector('.nfl-deadline')) return;
  const deadline = formatDeadline(window.NFLWEEK1.endAt, window.NFLWEEK1.tzLabel || '');
  if (!deadline) return;
  const p = document.createElement('p');
  p.className = 'nfl-deadline';
  p.innerHTML = `Sale ends <time datetime="${window.NFLWEEK1.endAt}">${deadline}</time>`;
  period.insertAdjacentElement('afterend', p);
}

/* ---- weekend schedule strip ------------------------------------------- */

function renderScheduleStrip() {
  const section = document.getElementById('weekend');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-tag">🏈 This Weekend</span>
        <h2>The Full Opening Weekend Slate</h2>
      </div>
      <div class="nfl-strip-grid">
        ${WEEKEND.map(g => `
          <div class="nfl-strip-item">
            <span class="nfl-strip-day">${g.day}</span>
            <strong>${g.label}</strong>
            <span>${g.detail}</span>
          </div>`).join('')}
      </div>
      <a href="#plans" class="cta-primary nfl-strip-cta">⚡ Get Access Before Kickoff</a>
    </div>`;
  section.hidden = false;

  section.querySelector('.nfl-strip-cta')?.addEventListener('click', () =>
    track('nfl_week1_cta', { cta: 'schedule_strip' }));
}

/* ---- sticky mobile CTA (shares .promo-sticky with win-back) ------------ */

function injectStickyCta() {
  const bar = document.createElement('div');
  bar.className = 'promo-sticky';
  bar.id = 'nflSticky';
  bar.innerHTML = `
    <span class="promo-sticky-info">🏈 Opening Weekend Sale · Ends Monday Night</span>
    <button type="button" class="promo-sticky-cta">Get Access →</button>`;
  bar.querySelector('.promo-sticky-cta').addEventListener('click', () => {
    track('nfl_week1_cta', { cta: 'sticky_mobile' });
    scrollToPlans();
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

/* ---- checkout tracking -------------------------------------------------- */

function attachCheckoutTracking() {
  const planLabels = { 'btn-1m': '1_month', 'btn-6m': '6_month', 'btn-12m': '12_month' };
  document.querySelectorAll('.firestore-buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDeviceBtn = document.querySelector('.device-btn.active');
      const screens = activeDeviceBtn ? Number(activeDeviceBtn.dataset.devices) : null;
      track('nfl_week1_checkout', { plan: planLabels[btn.id] || btn.id, screens });
    });
  });
}

/* ---- live mid-session revert on expiry --------------------------------- */

function revertToEvergreen() {
  root.classList.remove('promo-nfl');

  if (originalCopy) {
    const badge = document.querySelector('#heroBadge .hb-text');
    const title = document.getElementById('heroTitle');
    const sub = document.getElementById('heroSub');
    const cta = document.querySelector('.hero-ctas .cta-primary');
    const tag = document.querySelector('#plans .section-tag');
    const h2 = document.querySelector('#plans .section-header h2');
    const popularBadge = document.querySelector('.plan-card.popular .plan-popular-badge');

    if (badge) badge.textContent = originalCopy.badge;
    if (title) title.textContent = originalCopy.title;
    if (sub) sub.innerHTML = originalCopy.sub;
    if (cta) cta.textContent = originalCopy.cta;
    if (tag) tag.textContent = originalCopy.sectionTag;
    if (h2) h2.textContent = originalCopy.h2;
    if (popularBadge) popularBadge.textContent = originalCopy.popularBadge;
  }

  document.querySelector('.nfl-deadline')?.remove();
  document.getElementById('nflCountdown')?.remove();
  document.getElementById('nflSticky')?.remove();

  const strip = document.getElementById('weekend');
  if (strip) { strip.hidden = true; strip.innerHTML = ''; }
}

/* ---- init -------------------------------------------------------------- */

export function initNfl() {
  if (!isNfl()) return;

  captureUtms();
  captureOriginalCopy();

  applyHeroCopy();
  injectCountdown();
  applyPlansHeading();
  injectDeadlineLine();
  renderScheduleStrip();
  injectStickyCta();
  attachCheckoutTracking();

  track('nfl_week1_view', { cta: 'page_load' });
}
