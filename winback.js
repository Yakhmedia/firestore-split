/* Returning customer offer behavior for the renewal homepage. */

import { captureUtms, track as trackBase, formatDeadline } from './campaign-utils.js';

const root = document.documentElement;

function isActive() {
  return root.classList.contains('promo-winback');
}

function isExpired() {
  return root.classList.contains('promo-expired');
}

function track(event, params = {}) {
  trackBase('renewal', event, params);
}

function scrollToOffer() {
  document.getElementById('featuredOffer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setupOfferCheckout() {
  const button = document.getElementById('btn-winback');
  const status = document.getElementById('campaignCheckoutStatus');
  const config = window.WINBACK || {};
  const screens = Number(config.includedScreens);
  const paidMonths = Number(config.paidMonths);
  const bonusMonths = Number(config.bonusMonths);
  const accessMonths = Number(config.accessMonths);
  const totalPriceCents = Number(config.totalPriceCents);
  const offerDetailsReady = Number.isInteger(screens) && screens >= 1 && screens <= 5 &&
    Number.isInteger(paidMonths) && paidMonths >= 1 &&
    Number.isInteger(bonusMonths) && bonusMonths >= 0 &&
    accessMonths === paidMonths + bonusMonths &&
    Number.isSafeInteger(totalPriceCents) && totalPriceCents > 0 &&
    typeof config.eligibilityText === 'string' && config.eligibilityText.trim() &&
    typeof config.accountMatchingText === 'string' && config.accountMatchingText.trim() &&
    typeof config.activationText === 'string' && config.activationText.trim() &&
    typeof config.refundTermsText === 'string' && config.refundTermsText.trim() &&
    typeof config.postTermText === 'string' && config.postTermText.trim();
  if (!button) return false;
  button.disabled = true;
  button.classList.remove('firestore-buy-btn');
  for (const key of ['productId', 'currency', 'planMonths', 'screenCount', 'offer']) delete button.dataset[key];
  if (!config.checkoutProductId || config.checkoutVerified !== true || config.serverEnforcementVerified !== true || !offerDetailsReady) return false;

  const screenLine = document.getElementById('campaignScreenDetail');
  const eligibilityLine = document.getElementById('campaignEligibility');
  const accountLine = document.getElementById('campaignAccountMatching');
  const activationLine = document.getElementById('campaignActivation');
  const postTermLine = document.getElementById('campaignPostTerm');
  const refundLine = document.getElementById('campaignRefundTerms');
  const durationLine = document.getElementById('campaignDuration');
  const priceLine = document.querySelector('#campaignPrice span');
  const heroOffer = document.getElementById('campaignHeroOffer');
  const totalPrice = `$${(totalPriceCents / 100).toFixed(2)}`;
  const termDescription = bonusMonths
    ? `${paidMonths} paid months + ${bonusMonths} bonus ${bonusMonths === 1 ? 'month' : 'months'} (${accessMonths} months total access)`
    : `${accessMonths} ${accessMonths === 1 ? 'month' : 'months'} total access`;
  if (screenLine) screenLine.textContent = `${screens} ${screens === 1 ? 'screen' : 'screens'} included`;
  if (durationLine) durationLine.textContent = termDescription;
  if (priceLine) priceLine.textContent = totalPrice;
  if (heroOffer) heroOffer.textContent = `${termDescription} · ${totalPrice} total. Review eligibility before checkout.`;
  if (eligibilityLine) eligibilityLine.textContent = config.eligibilityText;
  if (accountLine) accountLine.textContent = config.accountMatchingText;
  if (activationLine) activationLine.textContent = config.activationText;
  if (postTermLine) postTermLine.textContent = config.postTermText;
  if (refundLine) refundLine.textContent = config.refundTermsText;

  button.disabled = false;
  button.textContent = `Renew for ${accessMonths} ${accessMonths === 1 ? 'month' : 'months'} · ${totalPrice} total`;
  button.classList.add('firestore-buy-btn');
  button.dataset.productId = config.checkoutProductId;
  button.dataset.currency = 'USD';
  button.dataset.planMonths = String(accessMonths);
  button.dataset.screenCount = String(screens);
  button.dataset.offer = config.offerKey || 'welcome_back_offer';
  if (status) status.textContent = 'Review the offer details above before continuing to checkout.';
  button.addEventListener('click', () => {
    track('renewal_checkout_click', {
      offer: config.offerKey || 'welcome_back_offer',
      term_months: accessMonths,
      price: totalPriceCents / 100,
      currency: 'USD',
    });
  });
  return true;
}

function showDeadline() {
  const config = window.WINBACK || {};
  const hasExplicitOffset = typeof config.endAt === 'string' && /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(config.endAt);
  if (!hasExplicitOffset || !config.tzLabel) return;
  const deadline = formatDeadline(config.endAt, config.tzLabel || '');
  if (!deadline) return;

  const line = document.getElementById('campaignDeadline');
  const stamp = document.createElement('time');
  stamp.dateTime = config.endAt;
  stamp.textContent = deadline;
  line?.replaceChildren(document.createTextNode('Offer ends '), stamp);
  if (line) line.hidden = false;
}

function setupOfferTracking() {
  document.getElementById('heroRenewCta')?.addEventListener('click', () => {
    track('renewal_offer_select', { cta: 'hero' });
  });
  document.querySelector('.promo-bar-cta')?.addEventListener('click', () => {
    track('renewal_offer_select', { cta: 'announcement_bar' });
  });
  document.querySelectorAll('.promo-support-link, .hero-ctas .cta-secondary, #support a').forEach(link => {
    link.addEventListener('click', () => track('renewal_support_click', { cta: link.className || 'support' }));
  });
}

function injectStickyCta() {
  const config = window.WINBACK || {};
  const accessMonths = Number(config.accessMonths);
  const totalPriceCents = Number(config.totalPriceCents);
  const sticky = document.createElement('div');
  sticky.className = 'promo-sticky';
  const offerInfo = document.createElement('span');
  offerInfo.className = 'promo-sticky-info';
  offerInfo.textContent = `${accessMonths} ${accessMonths === 1 ? 'month' : 'months'} · $${(totalPriceCents / 100).toFixed(2)} total`;
  const offerButton = document.createElement('button');
  offerButton.type = 'button';
  offerButton.className = 'promo-sticky-cta';
  offerButton.textContent = 'Renew';
  sticky.append(offerInfo, offerButton);
  offerButton.addEventListener('click', () => {
    document.getElementById('btn-winback')?.click();
  });
  document.body.appendChild(sticky);

  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.footer');
  let pastHero = false;
  let atFooter = false;
  const sync = () => sticky.classList.toggle('is-visible', pastHero && !atFooter);

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(([entry]) => { pastHero = !entry.isIntersecting; sync(); }, { threshold: 0 })
      .observe(hero);
  }
  if ('IntersectionObserver' in window && footer) {
    new IntersectionObserver(([entry]) => { atFooter = entry.isIntersecting; sync(); }, { threshold: 0 })
      .observe(footer);
  }
}

export function maybeInjectWinbackFaq(faqGroups) {
  if (!isActive()) return;
  faqGroups.unshift({
    label: 'Returning customer offer',
    items: [{
      q: 'How does the returning customer offer work?',
      a: 'If the returning-customer offer is available, its term and full amount will be shown before checkout. Eligibility is checked during checkout. Contact support with account-specific questions.',
    }],
  });
}

export function initWinback() {
  captureUtms();
  track('renewal_landing_view', {
    page_state: isExpired() ? 'offer_expired' : isActive() ? 'offer_active' : 'standard_plans',
  });

  if (isExpired()) {
    const badge = document.querySelector('#heroBadge .hb-text, .hero-badge .hb-text');
    if (badge) badge.textContent = 'Subscription renewal';
    const notice = document.getElementById('expiredOfferNotice');
    if (notice) notice.hidden = false;
    track('renewal_offer_expired');
    return;
  }

  if (!isActive()) {
    const badge = document.querySelector('.hero-badge .hb-text');
    if (badge) badge.textContent = 'Subscription renewal';
    return;
  }

  const config = window.WINBACK || {};
  track('renewal_offer_view', {
    term_months: Number(config.accessMonths),
    price: Number(config.totalPriceCents) / 100,
    currency: 'USD',
  });
  setupOfferTracking();
  showDeadline();
  if (setupOfferCheckout()) injectStickyCta();
}
