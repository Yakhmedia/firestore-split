/* ============================================================
   FIRE STORE TV — RENEWAL LANDING PAGE
   ============================================================ */

import { initWinback, maybeInjectWinbackFaq } from './winback.js';
import { captureUtms, track as trackBase } from './campaign-utils.js';

/** Static term labels only. Prices and product IDs always come from checkout. */
export const STANDARD_PLANS = {
  1: {
    key: '1m',
    months: 1,
    paidMonths: 1,
    bonusMonths: 0,
    accessMonths: 1,
    durationText: '1 month of access',
    accessText: '1 month total access',
    termFeatureText: '1 month total access',
    badge: null,
  },
  6: {
    key: '6m',
    months: 6,
    paidMonths: 6,
    bonusMonths: 0,
    accessMonths: 6,
    durationText: '6 months of access',
    accessText: '6 months total access',
    termFeatureText: '6 months total access',
    badge: null,
  },
  12: {
    key: '12m',
    months: 12,
    paidMonths: 12,
    bonusMonths: 1,
    accessMonths: 13,
    durationText: '12 months + 1 bonus month',
    accessText: '13 months total access',
    termFeatureText: '12 months + 1 bonus month included (13 months)',
    badge: 'Best value',
  },
};

let currentPeriod = 12;
let currentScreens = 1;
const catalogPlans = new Map();
let catalogState = 'loading';
let widgetState = 'loading';
let catalogError = '';
let widgetLoadPromise = null;
const checkoutOrigin = resolveCheckoutOrigin();

function resolveCheckoutOrigin() {
  const configured = import.meta.env.VITE_CHECKOUT_ORIGIN || 'https://fire-store.shop';
  try {
    const origin = new URL(configured, window.location.origin);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password) return '';
    return origin.origin;
  } catch (_) {
    return '';
  }
}

const faqRenewing = [
  {
    q: 'Will my login and settings still be available?',
    a: 'Buying a renewal adds time to your existing subscription. If you are unsure which account to renew or whether your previous settings are available, contact support before paying.',
  },
  {
    q: 'How is my existing account identified?',
    a: 'Before paying, contact support to confirm which account details to use for your renewal.',
  },
  {
    q: 'How long does reactivation take?',
    a: 'Activation timing can depend on your account. Contact support before paying if you need a confirmed timeframe.',
  },
  {
    q: 'What if I have lost my account details?',
    a: 'Contact support with any order details you still have so they can help locate the correct account.',
  },
  {
    q: 'What does "simultaneous screens" mean?',
    a: 'Simultaneous screens represents how many devices can stream content at the exact same moment. You can install the Fire Store TV app on as many devices as you like.',
  },
  {
    q: 'How does my selected renewal affect my current access?',
    a: 'Review the selected term and upfront total in checkout. Contact support before paying if you need confirmation of how a renewal changes your current access period.',
  },
  {
    q: 'Are there any recurring charges or auto-renewals?',
    a: 'No. Every Fire Store TV plan is a single upfront payment with zero auto-renewal. You will never be charged automatically.',
  },
  {
    q: 'Where can I read the refund terms?',
    a: 'All standard renewal plans include a full refund within 7 days of payment. See the <a href="/refund.html">subscription refund policy</a> for complete details.',
  },
  {
    q: 'Which devices and apps are compatible?',
    a: 'Contact support to confirm compatibility with your device and app before purchasing.',
  },
  {
    q: 'Can I get help setting up my app?',
    a: 'Message support on WhatsApp for setup guidance and account questions.',
  },
];

const faqGroups = [{ label: 'Renewing?', items: faqRenewing }];

function track(event, params = {}) {
  trackBase('renewal', event, params);
}

function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.replaceChildren();

  let index = 0;
  faqGroups.forEach((group) => {
    const label = document.createElement('h3');
    label.className = 'faq-group-label';
    label.textContent = group.label;
    list.appendChild(label);

    group.items.forEach((item) => {
      const id = `faq-answer-${index++}`;
      const row = document.createElement('div');
      row.className = 'faq-item';
      row.innerHTML = `
        <button class="faq-q" type="button" aria-expanded="false" aria-controls="${id}">
          <span>${item.q}</span><span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" id="${id}" hidden><div class="faq-a-inner">${item.a}</div></div>`;

      const button = row.querySelector('.faq-q');
      const answer = row.querySelector('.faq-a');
      button?.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        list.querySelectorAll('.faq-q').forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          other.classList.remove('active');
        });
        list.querySelectorAll('.faq-a').forEach((other) => {
          other.hidden = true;
          other.classList.remove('open');
        });
        if (shouldOpen) {
          button.setAttribute('aria-expanded', 'true');
          button.classList.add('active');
          if (answer) {
            answer.hidden = false;
            answer.classList.add('open');
          }
        }
      });
      list.appendChild(row);
    });
  });
}

function getCatalogPlan(months) {
  return catalogPlans.get(Number(months)) || null;
}

function getBestValuePeriod() {
  const all = [...catalogPlans.values()];
  if (all.length !== 3) return null;
  return all.reduce((best, candidate) => candidate.monthlyCents < best.monthlyCents ? candidate : best).months;
}

function refreshSelection() {
  const plan = STANDARD_PLANS[currentPeriod];
  const catalogPlan = getCatalogPlan(currentPeriod);
  const bestValuePeriod = getBestValuePeriod();
  const isBestValue = bestValuePeriod === currentPeriod;

  const durationEl = document.getElementById('configPlanDuration');
  const accessTermEl = document.getElementById('configAccessTerm');
  const badgeEl = document.getElementById('configCardBadge');
  const cardEl = document.getElementById('configurablePlanCard');
  const monthlyPriceEl = document.getElementById('configMonthlyPrice');
  const upfrontTextEl = document.getElementById('configUpfrontText');
  const termFeatureEl = document.getElementById('featureTermText');
  const button = document.getElementById('configBuyBtn');
  const status = document.getElementById('checkoutStatus');
  const retryButton = document.getElementById('retryCheckout');
  const tabs = [...document.querySelectorAll('.billing-switcher .switcher-btn')];
  const annualTab = tabs.find((tab) => Number(tab.dataset.plan) === 12);
  const selectedTab = tabs.find((tab) => Number(tab.dataset.plan) === currentPeriod);

  if (annualTab) annualTab.textContent = catalogPlans.has(12) ? '12 + 1 Bonus Month' : 'Annual';

  if (durationEl) durationEl.textContent = catalogPlan ? plan.durationText : 'Plan details unavailable';
  if (accessTermEl) accessTermEl.textContent = catalogPlan ? plan.accessText : 'Term will appear when confirmed';
  if (monthlyPriceEl) monthlyPriceEl.textContent = catalogPlan ? (catalogPlan.monthlyCents / 100).toFixed(2) : '—';
  if (upfrontTextEl) upfrontTextEl.textContent = catalogPlan
    ? `Billed upfront: ${formatMoney(catalogPlan.priceCents)} for ${catalogPlan.accessMonths} months`
    : 'Pricing is unavailable until the checkout catalog responds.';
  if (termFeatureEl) termFeatureEl.textContent = catalogPlan ? plan.termFeatureText : 'The selected term is not currently confirmed.';
  if (badgeEl) badgeEl.hidden = !isBestValue;
  if (cardEl) {
    cardEl.classList.toggle('popular', isBestValue);
    cardEl.setAttribute('aria-labelledby', selectedTab?.id || 'configPlanDuration');
  }

  tabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  const canCheckout = catalogState === 'ready' && widgetState === 'ready' && Boolean(catalogPlan);
  if (button) {
    button.disabled = !canCheckout;
    button.classList.toggle('firestore-buy-btn', canCheckout);
    button.classList.toggle('btn-plan-popular', canCheckout && isBestValue);
    for (const key of ['productId', 'currency', 'planMonths', 'screenCount', 'price', 'market']) {
      delete button.dataset[key];
    }
    if (canCheckout) {
      button.dataset.productId = catalogPlan.productId;
      button.dataset.currency = 'USD';
      button.dataset.planMonths = String(catalogPlan.accessMonths);
      button.dataset.screenCount = '1';
      button.dataset.price = (catalogPlan.priceCents / 100).toFixed(2);
      button.dataset.market = catalogPlan.market;
    }
  }

  if (status) {
    if (catalogError) status.textContent = 'Online checkout is temporarily unavailable. Contact support for renewal help.';
    else if (catalogState === 'loading' || widgetState === 'loading') status.textContent = 'Checking current plan and checkout availability…';
    else if (widgetState !== 'ready') status.textContent = 'Online checkout is unavailable right now. Contact support for renewal help.';
    else if (!catalogPlan) status.textContent = 'This plan is not available for online checkout. Contact support for options.';
    else status.textContent = 'Review the selected term and full upfront total in checkout before paying.';
  }
  if (retryButton) retryButton.hidden = catalogState !== 'error' && widgetState !== 'error';
}

function showSelectionNotice(message = '') {
  const notice = document.getElementById('selectionNotice');
  if (!notice) return;
  notice.textContent = message;
  notice.hidden = !message;
}

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function readMoneyCents(plan) {
  if (Number.isSafeInteger(plan.priceCents) && plan.priceCents > 0) return plan.priceCents;
  if (!Number.isFinite(Number(plan.price)) || Number(plan.price) <= 0) return null;
  const cents = Math.round(Number(plan.price) * 100);
  return Math.abs(Number(plan.price) * 100 - cents) < 0.000001 ? cents : null;
}

function parseCatalog(data) {
  if (!data || !Array.isArray(data.plans) || String(data.currency).toUpperCase() !== 'USD') {
    throw new Error('Unsupported catalog response');
  }
  if (typeof data.market !== 'string' || !data.market.trim()) throw new Error('Catalog market missing');

  const matches = new Map();
  for (const entry of data.plans) {
    if (!entry || typeof entry !== 'object') continue;
    const months = Object.keys(STANDARD_PLANS).find((key) => STANDARD_PLANS[key].key === entry.planKey);
    if (!months) continue; // Restricted/campaign products use a different plan key.

    const screens = Number(entry.simultaneousScreens ?? entry.screens ?? entry.screenCount);
    const plan = STANDARD_PLANS[months];
    if (screens !== 1 || entry.market !== data.market) continue;
    if (entry.currency && String(entry.currency).toUpperCase() !== 'USD') continue;
    if (entry.restricted === true || entry.isRestricted === true || entry.eligibleOnly === true) continue;
    if (entry.available === false || entry.published === false) continue;
    if (Number(entry.paidMonths) !== plan.paidMonths || Number(entry.bonusMonths) !== plan.bonusMonths || Number(entry.accessMonths) !== plan.accessMonths) continue;
    if (typeof entry.productId !== 'string' || !entry.productId.trim()) continue;

    const priceCents = readMoneyCents(entry);
    if (!priceCents) continue;
    if (matches.has(Number(months))) throw new Error(`Duplicate standard plan ${plan.key}`);
    matches.set(Number(months), {
      months: Number(months),
      productId: entry.productId,
      priceCents,
      monthlyCents: Math.round(priceCents / plan.accessMonths),
      accessMonths: plan.accessMonths,
      market: data.market,
    });
  }
  return matches;
}

/** Updates the configurable card from the selected, server-catalogued plan. */
export function selectPeriod(months) {
  if (!STANDARD_PLANS[months]) return;
  currentPeriod = Number(months);
  refreshSelection();
  const plan = getCatalogPlan(currentPeriod);
  track('renewal_period_select', {
    plan: plan ? `${plan.accessMonths}_month` : STANDARD_PLANS[currentPeriod].key,
    screens: currentScreens,
    ...(plan ? { price: plan.priceCents / 100, currency: 'USD' } : {}),
  });
}

export function selectDevice(deviceCount) {
  const count = Number(deviceCount);
  if (count !== 1) {
    showSelectionNotice('Online checkout currently supports 1 simultaneous screen. Contact support about other options.');
    return false;
  }
  currentScreens = 1;
  const screenSelect = document.getElementById('screenSelect');
  if (screenSelect) screenSelect.value = '1';
  const screenFeature = document.getElementById('featureScreens');
  if (screenFeature) screenFeature.textContent = '1 simultaneous screen';
  refreshSelection();
  return true;
}

async function loadCatalog() {
  try {
    if (!checkoutOrigin) throw new Error('Checkout origin is not configured');
    const response = await fetch(`${checkoutOrigin}/api/widget/plans?currency=USD`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
    const data = await response.json();
    const parsed = parseCatalog(data);
    catalogPlans.clear();
    parsed.forEach((plan, key) => catalogPlans.set(key, plan));
    catalogState = 'ready';
  } catch (error) {
    catalogPlans.clear();
    catalogState = 'error';
    catalogError = error instanceof Error ? error.message : 'Catalog unavailable';
    track('renewal_catalog_error', { currency: 'USD' });
  }
  refreshSelection();
}

function loadCheckoutWidget() {
  if (widgetState === 'ready') return Promise.resolve(true);
  if (widgetLoadPromise) return widgetLoadPromise;
  if (!checkoutOrigin) {
    widgetState = 'error';
    refreshSelection();
    return Promise.resolve(false);
  }

  widgetState = 'loading';
  const script = document.createElement('script');
  script.src = `${checkoutOrigin}/widget.js`;
  script.async = true;
  widgetLoadPromise = new Promise((resolve) => {
    script.onload = () => {
      widgetState = 'ready';
      widgetLoadPromise = null;
      refreshSelection();
      resolve(true);
    };
    script.onerror = () => {
      script.remove();
      widgetState = 'error';
      widgetLoadPromise = null;
      refreshSelection();
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return widgetLoadPromise;
}

function initBillingSwitcher() {
  const buttons = [...document.querySelectorAll('.billing-switcher .switcher-btn')];
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectPeriod(Number(button.dataset.plan)));
    button.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = buttons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      buttons[nextIndex].focus();
      selectPeriod(Number(buttons[nextIndex].dataset.plan));
    });
  });

  document.getElementById('screenSelect')?.addEventListener('change', (event) => selectDevice(event.target.value));
  document.getElementById('retryCheckout')?.addEventListener('click', () => {
    catalogError = '';
    catalogState = 'loading';
    if (widgetState !== 'ready') widgetState = 'loading';
    refreshSelection();
    loadCatalog();
    loadCheckoutWidget();
  });

  const buyButton = document.getElementById('configBuyBtn');
  if (buyButton && buyButton.dataset.analyticsBound !== 'true') {
    buyButton.dataset.analyticsBound = 'true';
    buyButton.addEventListener('click', () => {
      const plan = getCatalogPlan(currentPeriod);
      if (!plan || buyButton.disabled) return;
      track('renewal_checkout_click', {
        plan: `${plan.accessMonths}_month`,
        screens: currentScreens,
        price: plan.priceCents / 100,
        currency: 'USD',
      });
    });
  }

  selectPeriod(12);
  selectDevice(1);
}

function initDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const screenValue = params.get('devices');
  const plan = params.get('plan');
  const validPlan = ['1', '6', '12'].includes(plan);
  if (screenValue !== null) {
    if (screenValue === '1') selectDevice(1);
    else showSelectionNotice('This link requests an unsupported screen count. Online checkout currently supports 1 simultaneous screen; contact support about other options.');
  }
  if (validPlan) {
    selectPeriod(Number(plan));
    document.getElementById('configurablePlanCard')?.classList.add('plan-highlight');
  }
  if (screenValue !== null || validPlan) {
    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => document.getElementById('plans')?.scrollIntoView({
      behavior: motionPreference ? 'auto' : 'smooth',
      block: 'start',
    }), 0);
  }
}

function initNavbar() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 30));
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    toggle.classList.toggle('active', expanded);
    links?.classList.toggle('active', expanded);
    document.body.classList.toggle('nav-open', expanded);
  });
  links?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open navigation');
      toggle?.classList.remove('active');
      links.classList.remove('active');
      document.body.classList.remove('nav-open');
    })
  );
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || toggle?.getAttribute('aria-expanded') !== 'true') return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.classList.remove('active');
    links?.classList.remove('active');
    document.body.classList.remove('nav-open');
    toggle.focus();
  });
}

function installPurchaseConfirmationBridge() {
  window.fireStoreTrackCompletedPurchase = ({ transactionId, value, currency = 'USD', items = [] } = {}) => {
    if (!transactionId || !Number.isFinite(Number(value)) || !/^[A-Z]{3}$/.test(currency)) return false;
    try {
      const key = `firestore_purchase_${transactionId}`;
      if (localStorage.getItem(key)) return false;
      localStorage.setItem(key, '1');
    } catch (_) {}
    track('purchase', {
      transaction_id: String(transactionId),
      value: Number(value),
      currency,
      items,
    });
    return true;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  captureUtms();
  maybeInjectWinbackFaq(faqGroups);
  renderFaq();
  initNavbar();
  initBillingSwitcher();
  initWinback();
  installPurchaseConfirmationBridge();
  initDeepLink();
  loadCatalog();
  loadCheckoutWidget();
});
