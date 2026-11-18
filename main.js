/* ============================================================
   FIRE STORE TV — RENEWAL LANDING PAGE
   ============================================================ */

import { initWinback, maybeInjectWinbackFaq } from './winback.js';
import { captureUtms, track as trackBase } from './campaign-utils.js';

/* Standard plan prices and product IDs are the checkout source of truth. */
export const pricingPlans = {
  1: {
    1: { price: 29, monthly: 29, productId: 'e1f22bc1-bdbf-4737-bf86-2f8388639c93' },
    6: { price: 49, monthly: 8.1, productId: '91f8e845-15a3-43e8-93f2-e47abdb03dd2' },
    12: { price: 79, monthly: 6.58, productId: '92a116ae-bf73-4a82-864a-f643ce58cf8a' },
  },
  2: {
    1: { price: 59, monthly: 59, productId: 'f8de3852-90e3-4cb8-b03e-1d09b96bb297' },
    6: { price: 99, monthly: 16, productId: '183e5620-9bee-4257-9a32-ab259ec84483' },
    12: { price: 159, monthly: 13.25, productId: '0319e334-96f9-4f50-b27c-392f6737efb5' },
  },
  3: {
    1: { price: 89, monthly: 89, productId: 'e4654946-dcc9-4e34-9277-ff06b3dfd447' },
    6: { price: 149, monthly: 24, productId: '2d508b86-b9e8-497d-8f7b-ac7db50aaf95' },
    12: { price: 209, monthly: 17.42, productId: '4b43f74c-6280-4363-b685-12316cb01472' },
  },
  4: {
    1: { price: 119, monthly: 119, productId: '5cf9c53a-b075-4349-85f8-00de1b12100b' },
    6: { price: 159, monthly: 26.5, productId: 'c3af3f2a-ed65-4c54-bccc-4bbe0a68ee5d' },
    12: { price: 239, monthly: 19.91, productId: '0502ce40-7bcc-4c11-9cdc-3fdfe7fe78bb' },
  },
  5: {
    1: { price: 129, monthly: 129, productId: '2d446c17-8905-4d7b-8dc4-e6287f01a6e5' },
    6: { price: 179, monthly: 29.83, productId: '529a376d-a2d0-42d9-9f58-8debf8d45ba2' },
    12: { price: 289, monthly: 24.08, productId: 'd139f32e-a138-4e23-895f-f69652501015' },
  },
};

const faqRenewing = [
  {
    q: 'Will my login and settings still be available?',
    a: 'Buying a renewal adds time to your existing subscription. If you are unsure which account to renew or whether your previous settings are available, contact support before paying.'
  },
  {
    q: 'How is my existing account identified?',
    a: 'For order help, email contact@firestore.tv from the address used at checkout and include your order number. Do not put login credentials or personal identifiers in a URL.'
  },
  {
    q: 'How long does reactivation take?',
    a: 'Activation is handled by the team and is not instant. They email your sign-in details and will let you know if it is taking longer than usual. If you have not received the email, contact support with your order number.'
  },
  {
    q: 'What if I have lost my account details?',
    a: 'Email contact@firestore.tv from the address used at checkout and include your order number. Do not send passwords in a website link or URL.'
  },
  {
    q: 'How many screens are included in the $79 returning customer offer?',
    a: 'The included screen count and eligibility are still being confirmed. Ask support before checkout. The offer is for one fixed screen count and does not change with the standard plan selector.'
  },
  {
    q: 'What happens after the 13-month offer ends?',
    a: 'The post-term renewal behavior has not been confirmed. Please ask support to explain the available options before checkout.'
  },
  {
    q: 'How is the $79 offer different from the standard annual plan?',
    a: 'The featured offer is 13 months of access for $79 total. The standard one-screen annual plan is 12 months for $79. The featured offer checkout is not available until its fulfillment details are confirmed.'
  },
  {
    q: 'Where can I read the refund terms?',
    a: 'Standard plans include a full refund within 7 days of payment. See the <a href="/refund.html">subscription refund policy</a>. Campaign-specific refund terms for the featured offer are still being confirmed.'
  },
  {
    q: 'Which devices and apps are compatible?',
    a: 'Compatibility can depend on your device, app, and region. Message support with your device model and app name so they can confirm before you purchase.'
  },
  {
    q: 'Can I get help setting up the app?',
    a: 'Contact support on WhatsApp with your device and app details and ask for the current setup steps.'
  },
  {
    q: 'Where can I check the current channel list?',
    a: 'Channel availability can change. Contact support to ask about current availability for your region before selecting a plan.'
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
  faqGroups.forEach(group => {
    const label = document.createElement('h3');
    label.className = 'faq-group-label';
    label.textContent = group.label;
    list.appendChild(label);

    group.items.forEach(item => {
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
      button.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        list.querySelectorAll('.faq-q').forEach(other => {
          other.setAttribute('aria-expanded', 'false');
          other.classList.remove('active');
        });
        list.querySelectorAll('.faq-a').forEach(other => {
          other.hidden = true;
          other.classList.remove('open');
        });
        if (shouldOpen) {
          button.setAttribute('aria-expanded', 'true');
          button.classList.add('active');
          answer.hidden = false;
          answer.classList.add('open');
        }
      });
      list.appendChild(row);
    });
  });
}

function updatePriceCards(deviceCount) {
  const plans = pricingPlans[deviceCount];
  if (!plans) return;

  const deviceWord = deviceCount === 1 ? 'screen' : 'screens';
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };
  const setPrice = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = `<span>$</span>${value}`;
  };

  [1, 6, 12].forEach(months => {
    const plan = plans[months];
    const suffix = `${months}m`;
    setPrice(`price-${suffix}`, plan.price);
    setText(`mini-screens-${suffix}`, `${deviceCount} ${deviceWord}`);
    setText(`period-${suffix}`, months === 1
      ? 'per month, billed monthly'
      : `$${plan.monthly.toFixed(2)}/month — billed once`);

    const button = document.getElementById(`btn-${suffix}`);
    if (!button) return;
    button.classList.add('firestore-buy-btn');
    button.dataset.productId = plan.productId;
    button.dataset.planMonths = String(months);
    button.dataset.screenCount = String(deviceCount);
    button.onclick = null;

    if (button.dataset.analyticsBound !== 'true') {
      button.dataset.analyticsBound = 'true';
      button.addEventListener('click', () => {
        track('renewal_checkout_open', {
          plan: `${button.dataset.planMonths}_month`,
          screens: Number(button.dataset.screenCount),
          price: pricingPlans[Number(button.dataset.screenCount)][Number(button.dataset.planMonths)].price,
          currency: 'USD',
        });
      });
    }
  });
}

export function selectDevice(deviceCount) {
  const selector = document.getElementById('deviceSelector');
  selector?.querySelectorAll('.device-btn').forEach(button => {
    const selected = Number(button.dataset.devices) === deviceCount;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  updatePriceCards(deviceCount);
}

function initDeviceSelector() {
  const selector = document.getElementById('deviceSelector');
  if (!selector) return;
  selector.querySelectorAll('.device-btn').forEach(button => {
    button.addEventListener('click', () => selectDevice(Number(button.dataset.devices)));
  });
  selectDevice(1);
}

function initDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const devices = Number(params.get('devices'));
  const plan = params.get('plan');
  const validDevices = Number.isInteger(devices) && devices >= 1 && devices <= 5;
  const validPlan = ['1', '6', '12'].includes(plan);
  if (!validDevices && !validPlan) return;

  if (validDevices) selectDevice(devices);
  if (validPlan) {
    const card = document.getElementById(`btn-${plan}m`)?.closest('.plan-card');
    card?.classList.add('plan-highlight');
  }

  window.setTimeout(() => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
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
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
    toggle?.classList.remove('active');
    links.classList.remove('active');
    document.body.classList.remove('nav-open');
  }));
  document.addEventListener('keydown', event => {
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
  // The checkout integration must call this only after a confirmed payment.
  // No purchase conversion is fired from a plan-button click.
  window.fireStoreTrackCompletedPurchase = ({ transactionId, value, currency = 'USD', items = [] } = {}) => {
    if (!transactionId || !Number.isFinite(Number(value)) || !/^[A-Z]{3}$/.test(currency)) return false;
    try {
      const key = `firestore_purchase_${transactionId}`;
      if (localStorage.getItem(key)) return false;
      localStorage.setItem(key, '1');
    } catch (_) {
      // Still report a confirmed purchase when storage is unavailable.
    }
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
  initDeviceSelector();
  initWinback();
  installPurchaseConfirmationBridge();
  initDeepLink();
});
