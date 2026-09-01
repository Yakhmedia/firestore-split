# Win-Back Landing Page — Implementation Plan

**Approach:** preselect 2 screens · show the real `$159 → $79` · lock the annual card out of the device selector.

Companion to `IMPLEMENTAION_WINBACK_OFFER_PLAN.md`. Where the two disagree, this document wins — it is written against the code as it actually exists.

---

## 1. Decisions locked

| # | Decision | Rationale |
|---|---|---|
| D1 | Campaign state preselects **2 screens** in the device selector | Puts the real $159 2-screen annual price on screen as the anchor |
| D2 | Annual card shows **`$159` struck through → `$79`** | `pricingPlans[2][12].price` is a live, publicly visible price on this same page — not a fabricated anchor. Satisfies offer-plan §5.4 |
| D3 | The annual card is **excluded from device-selector control** in campaign state | It is a fixed offer (12 months / 2 screens / $79), not a configurable plan |
| D4 | Monthly and 6-month cards **stay visible and stay driven by the selector** | Offer-plan §5.5. At 2 screens they read $59 / $99 |
| D5 | Campaign state is set **before first paint** via an inline `<head>` script | The public page must never flash, and offer-plan §10 forbids layout shift |
| D6 | The saving is stated as **"Second screen free — an $80 value"** | $159 − $79 = $80, derived from the live table, never hardcoded |

### D4 has a side effect that must be designed for

At 2 screens the cards read:

```
1 Month  $59        12 Months  $79        6 Months  $99
```

**12 months is cheaper than 6 months.** This is correct, and it is the whole point of the offer — but an unexplained price inversion reads as a broken page and costs trust. Mitigation, built into the card copy:

- The annual card carries a `RETURNING CUSTOMER OFFER` badge, so it is visibly a one-off comeback price rather than the standard rate.
- A single line under the selector: *"Your comeback offer is fixed at 12 months with 2 screens. The other plans update with the selector."*

> **Open decision:** if the inversion is judged too confusing in review, the fallback is to hide the 6-month card in campaign state only. Do not change its price — that would break offer-plan §5.5.

---

## 2. Inputs required before launch

These are commercial answers, not code. The build can proceed with placeholders; **launch cannot.**

- [ ] **`WINBACK_OFFER_END_AT`** — one real ISO-8601 timestamp with offset, e.g. `2026-09-14T23:59:59-04:00`. Displayed with the timezone beside it.
- [ ] **Renewal policy** — does $79 apply only to the first 12 months, or does it recur? Until answered, the card says `$79 total for 12 months` **and makes no renewal claim whatsoever** (offer-plan §5.4).
- [ ] **Campaign product UUID** on fire-store.shop: 12 months, 2 screens, $79, unlisted. Nothing works without it. See §9.
- [ ] **Confirm "2 screens" = two simultaneous streams**, matching the phrase the site already uses: *"2 screens at the same time"*.

---

## 3. Architecture

### Files touched

| File | Change |
|---|---|
| `index.html` | Inline `<head>` state script; announcement bar; campaign card markup; objection block; sticky mobile CTA; hero hooks |
| `winback.js` | **New.** All campaign behaviour in one module |
| `main.js` | Import + init `winback.js`; one guard in `updatePriceCards()`; FAQ group injection hook |
| `styles.css` | All campaign CSS scoped under `.promo-winback` / `.promo-expired` |

### Why a separate `winback.js`

Rollback (offer-plan §14) has to be a single, safe action. A self-contained module means killing the campaign is *one deleted import line*, with zero risk to the public page. Folding these ~200 lines into `main.js` would make rollback a surgical edit under time pressure. The module is deleted outright when the campaign ends.

### State model

Three mutually exclusive root classes, set once, pre-paint:

| Class | Condition | Behaviour |
|---|---|---|
| *(none)* | No `promo` param, or unrecognised value | Standard public page, byte-identical to today |
| `.promo-winback` | `promo=winback` and `now < endAt` | Full campaign state |
| `.promo-expired` | `promo=winback` and `now >= endAt` | "Offer has ended" notice, standard plans below |

**Every campaign style is scoped under one of those two classes.** A visitor without the param cannot reach any campaign CSS or JS path.

---

## 4. Phase 0 — Pre-existing fixes (launch blockers)

These are live today and would each undermine paid campaign traffic. Fix before Phase 1.

- [ ] **Stale product IDs in `index.html`.** `btn-1m`, `btn-6m`, `btn-12m` carry hardcoded `data-product-id` values that differ from `main.js:17-43` (e.g. `btn-12m` is `9831772c…` in HTML vs `92a116ae…` in JS). `updatePriceCards()` overwrites them — but only inside `DOMContentLoaded`, which fires *after* deferred `widget.js` has initialised.
  - First: **verify whether `widget.js` reads `data-product-id` at click time or snapshots it at load.** If it snapshots, every button on the live site currently sells the wrong product.
  - Then: delete the hardcoded attributes from `index.html` regardless, so `main.js` is the single source of truth.
- [ ] **Stale hero urgency.** `index.html:137` hardcodes `<span id="heroCountdownDays">11</span>` and no JS ever updates it. Remove the claim or drive it from a date. A wrong urgency claim on the page a campaign email points to poisons the campaign.
- [ ] **Dead countdown markup.** `#heroCountdown` / `#hcLabel` / `#hcClock` (`index.html:152-155`) are `hidden` and never populated. Delete.
- [ ] **Add `scroll-margin-top`.** No `scroll-margin-top` exists anywhere in `styles.css`, so `#plans` anchors already land under the fixed 70px navbar. Required now that the announcement bar CTA scrolls to the campaign card.
- [ ] **Add an `.sr-only` utility.** None exists; the struck-through price needs one.

---

## 5. Phase 1 — Campaign state, set before first paint

### 5.1 Inline `<head>` script — single source of truth for the deadline

Placed in `index.html` `<head>`, **before** the stylesheet link. Deliberately not a module: it must execute before the body is parsed.

```html
<script>
  /* Win-back campaign. Delete this block and the winback.js import to disable. */
  window.WINBACK = {
    endAt: '2026-09-14T23:59:59-04:00', // TODO: confirm real deadline
    tzLabel: 'ET',
  };
  (function () {
    if (new URLSearchParams(location.search).get('promo') !== 'winback') return;
    var live = Date.now() < Date.parse(window.WINBACK.endAt);
    document.documentElement.classList.add(live ? 'promo-winback' : 'promo-expired');
  })();
</script>
```

The deadline is declared **once**, on `window`, and read by both the pre-paint check and `winback.js`. No duplicated constant can drift.

### 5.2 Preselect 2 screens

`winback.js` calls the existing `selectDevice(2)` (`main.js:294`) rather than reimplementing selection. Ordering matters:

```
DOMContentLoaded
  → initDeviceSelector()   // main.js — runs updatePriceCards(1), wires buttons
  → initWinback()          // must run after, so selectDevice(2) wins
  → initDeepLink()         // must run last; explicit ?devices= still overrides
```

An explicit `?devices=N` in the URL continues to win over the campaign default. That is intentional — a deep link is a stronger signal than a campaign default.

### 5.3 Lock the annual card

`updatePriceCards()` (`main.js:231`) currently rewrites all three cards. Add one guard so the 12-month writes are skipped while the campaign card owns that slot:

```js
// The win-back campaign card is a fixed offer (12mo / 2 screens / $79),
// not a configurable plan — the screen selector must not rewrite it.
const annualLocked = document.documentElement.classList.contains('promo-winback');

if (!annualLocked) {
  set('price-12m', `<span>$</span>${p12.price}`, true);
  set('period-12m', `$${p12.monthly.toFixed(2)}/month — billed once`);
  wireBuyButton('btn-12m', p12);
}
```

The `mini-screens-12m` write currently sits inside a `forEach` over `['1m','6m','12m']` — narrow that array to `['1m','6m']` when locked.

This is the **only** change to `main.js` core logic, and it is inert without the root class.

---

## 6. Phase 2 — Announcement bar

### Markup

Injected by `winback.js` as the first child of `<body>`, so the public DOM is unchanged.

> 🔥 Returning Customer Offer: Get 12 Months + a FREE Second Screen for $79
> Available for a limited time through your comeback invitation.
> **[ Claim My Upgrade ]**

### Layout — the fixed-navbar interaction

`.navbar` is `position: fixed; top: 0; height: 70px` and `.hero` is `padding: 100px 2rem 60px`. Introduce one variable so the offset is declared in a single place:

```css
:root { --promo-bar-h: 0px; }
.promo-winback, .promo-expired { --promo-bar-h: 44px; }
@media (max-width: 720px) {
  .promo-winback, .promo-expired { --promo-bar-h: 64px; } /* copy wraps to 2 lines */
}

.promo-bar { position: fixed; top: 0; left: 0; right: 0; height: var(--promo-bar-h); z-index: 1100; }
.navbar    { top: var(--promo-bar-h); }
.hero      { padding-top: calc(100px + var(--promo-bar-h)); }
#plans     { scroll-margin-top: calc(70px + var(--promo-bar-h) + 16px); }
```

Because `--promo-bar-h` is `0px` by default, **the public page renders identically** — the same declarations apply, they just resolve to today's values.

### CTA behaviour

"Claim My Upgrade" scrolls to the annual campaign card (not the section top) and fires `winback_offer_select` with `cta: 'announcement_bar'`. Verify the bar's own height is excluded from the scroll target so the card is not hidden beneath it.

---

## 7. Phase 3 — The annual campaign card

### 7.1 Price derivation — never hardcode

```js
const regular  = pricingPlans[2][12].price;   // 159 — live public price
const campaign = 79;                          // campaign price
const saving   = regular - campaign;          // 80
```

If the public 2-screen annual price ever changes, the anchor and the "$80 value" follow it automatically. A hardcoded `$159` would silently become a false claim the day pricing moves — precisely what offer-plan §5.4 prohibits.

**Guard:** if `regular <= campaign`, suppress the struck-through price and the value claim entirely, and render only `$79 total`. The offer still works; the unjustifiable claim disappears.

### 7.2 Card content

```text
RETURNING CUSTOMER OFFER

12 Months
2 Screens Included

Regular 2-screen annual price  $159
You pay  $79 total

Second screen free — an $80 value

Watch on two screens at the same time.
No coupon code required.

[ Reactivate & Get 2 Screens ]

Offer ends Sat, Sep 14 · 11:59 PM ET
```

### 7.3 Card requirements

- Replace the `⭐ Most Popular — Best Value` badge (`index.html:213`) with `RETURNING CUSTOMER OFFER`. Two competing badges dilute both.
- Replace the `🔥 Save 50% — Full Year` line (`index.html:219`) — it refers to the 1-screen comparison and is wrong in campaign state.
- **One primary button only** (offer-plan §5.4).
- **No renewal claim** until §2 is answered.
- The struck-through price must not rely on the strike alone:

```html
<span class="promo-was">
  <span class="sr-only">Regular 2-screen annual price</span>
  <s aria-hidden="true">$159</s>
</span>
<span class="promo-now"><span class="sr-only">You pay</span>$79 <em>total</em></span>
```

- Deadline rendered as **static text from `window.WINBACK.endAt`**, formatted with the timezone label. A live-ticking countdown is optional and must read the same constant — it can never be seeded from page load (offer-plan §7).

### 7.4 Explanatory line under the device selector

Campaign state only, injected above `.plans-grid`:

> Your comeback offer is fixed at 12 months with 2 screens. The other plans update with the selector.

This is what makes the $79 / $99 inversion legible.

---

## 8. Phase 4 — Supporting page changes

### 8.1 Hero

Extend the existing `renew=1` variant pattern (`main.js:329-334`) rather than adding a second mechanism:

- Badge → `Returning customer offer`
- H1 → `Welcome Back — Your Upgrade Is Ready`
- Sub → `Reactivate for 12 months and get a second screen free — $79 total.`
- CTA → `Claim My Upgrade` → scrolls to the campaign card

### 8.2 Suppress the shop cross-sell

`.shop-section` (`index.html:278`) sits directly below the plans and sends churned customers to an external store *before* they reactivate. Pure CSS, no JS, no layout shift:

```css
.promo-winback .shop-section { display: none; }
```

Footer shop links stay — they are below the fold and far less of a leak.

### 8.3 Objection block (offer-plan §5.6, translated for the web)

"Reply RENEW" is email language and is meaningless on a web page. Translated to the site's existing support channel with prefilled WhatsApp messages, preserving the keyword taxonomy so support triage is unchanged:

| Block copy | Action |
|---|---|
| **Need help choosing?** We'll help you personally. | `wa.me/12029927413?text=RENEW` |
| **Need setup assistance?** We'll help you activate and connect your devices. | `wa.me/12029927413?text=SETUP` |

**"Reply TEST" is deliberately omitted from this block.** Offering a trial beside a $79 CTA gives an already-experienced customer an easy way not to buy today. It stays in the FAQ and in the emails.

### 8.4 FAQ

`faqGroups` (`main.js:86-89`) is already a group structure. Campaign state unshifts one group so it renders first:

```js
faqGroups.unshift({ label: 'Your comeback offer', items: faqWinback });
```

Contents per offer-plan §5.7. **Resolve the existing conflict:** `main.js:59` currently promises a *"free 24-hour trial — no credit card required"*, while the offer plan says trials are *"subject to approval and availability."* Both cannot be true. Pick one wording and apply it in both places.

### 8.5 Sticky mobile CTA

Does not currently exist. Campaign state, mobile only, appears once the hero scrolls out:

```
$79 · 12 mo · 2 screens        [ Reactivate → ]
```

Minimum 44px tall (offer-plan §10). Must not overlap the footer or the WhatsApp CTA.

---

## 9. Phase 5 — Checkout (shop-side; blocks launch)

**This page cannot enforce anything.** It is a static Vite site; checkout is an external popup (`fire-store.shop/widget.js`) driven entirely by `data-product-id`. Offer-plan §4/§6/§7 assume a server this page does not have.

The only real enforcement point is the shop:

- [ ] Create an **unlisted** product: 12 months, 2 screens, $79, `WINBACK_2SCREEN_12M`.
- [ ] The campaign CTA sets that UUID on `btn-12m`. No coupon field, no client-side price.
- [ ] **Expiry is enforced by deactivating that product**, not by the page. The page state and the product must be switched together — otherwise the page still says "buy" while the button fails.
- [ ] **Eligibility is "anyone with the UUID."** There is no token validation available without shop-side work. Offer-plan §6.4's "acceptable risk" is not a choice here; it is the only option. Confirm it is acceptable.
- [ ] Confirm whether the widget accepts attribution metadata — this determines whether UTMs can reach the order record (§10).

---

## 10. Phase 6 — Analytics

No events exist on this page today; only the gtag config (`index.html:12-19`). All five are net-new.

```js
const track = (event, params) => window.gtag?.('event', event, params);
```

| Event | Trigger | Notes |
|---|---|---|
| `winback_offer_view` | Campaign state applied | Include campaign, source, `utm_content` |
| `winback_offer_select` | Any campaign CTA click | Include `cta` so bar / card / sticky are distinguishable |
| `winback_checkout_start` | Popup opens | **Only if popup opening is detectable.** If not, do not fake it — document that select is the last measurable step |
| `winback_purchase` | Payment confirmed | **Shop-side. Cannot fire from this page.** |
| `winback_offer_expired` | `.promo-expired` applied | |

UTMs are captured into `sessionStorage` on load and attached to every event. Carrying them into the **order record** depends on the widget (§9) — if unsupported, campaign attribution stops at GA and the CRM match must be done by email address instead. Flag this before writing email copy.

---

## 11. Expired state

`.promo-expired` renders a short notice above the plans:

> **This offer has ended.** Our standard plans are below — message us on WhatsApp if you'd like help choosing.

Standard plans remain fully functional. The selector returns to the 1-screen default and the annual card is **not** locked (`annualLocked` checks `.promo-winback` only). Fires `winback_offer_expired`.

---

## 12. Accessibility & performance

- Contrast on the announcement bar and campaign badge must hit WCAG AA against `--bg-dark` / `--fire-orange`.
- The offer must not be identified by colour alone — hence the `.sr-only` labels in §7.3.
- Focus states on all new CTAs; the announcement bar must be keyboard-reachable and must not trap focus.
- Announcement bar and card use semantic headings; badges are real text, not background images.
- Verify no horizontal overflow at 320px / 360px / 390px — the campaign card carries more content than the standard card.
- No new dependencies. The countdown, if built, is `setInterval` over an existing constant.
- Campaign CSS is scoped, so the public page gains **zero** bytes of executed JS and no measurable weight.

---

## 13. QA matrix

| Scenario | Expected |
|---|---|
| `/` no params | Standard page, pixel-identical to pre-change |
| `/?promo=winback#plans` | Bar shown, 2 screens preselected, annual card `$159 → $79`, no flash |
| `/?promo=winback` then click "3 screens" | Monthly/6-mo update; **annual card unchanged** |
| `/?promo=winback&devices=1` | Explicit deep link wins: 1 screen selected, annual card still locked |
| `/?promo=bogus` | Standard page, no campaign state |
| `/?promo=winback` after `endAt` | Expired notice, standard plans usable, `winback_offer_expired` fires |
| Campaign CTA click | Correct `WINBACK_2SCREEN_12M` UUID reaches the popup |
| Checkout summary | 12 months · 2 screens · free upgrade · **$79 total** |
| Monthly/6-mo CTA in campaign state | Standard product, **no** upgrade applied |
| Announcement bar CTA | Scrolls to the card; card not hidden under bar or navbar |
| 320px width | No horizontal overflow; CTA ≥44px; price + CTA above fold |
| Keyboard only | All new CTAs reachable, visible focus, no trap |
| Screen reader | Struck price announced as "Regular 2-screen annual price $159 · You pay $79" |
| Day 1/3/5/7 email links | Correct `utm_content` captured in `winback_offer_view` |

Browsers per offer-plan §12.

---

## 14. Rollback

1. Delete the `winback.js` import from `main.js`.
2. Delete the inline `<head>` script from `index.html`.

The public page returns to today's behaviour immediately — `annualLocked` resolves `false`, `--promo-bar-h` resolves `0px`, and all scoped CSS becomes unreachable. Then deactivate the shop product. Completed orders keep their 2-screen entitlement (offer-plan §14.4).

---

## 15. Acceptance criteria

- [ ] Public page is unchanged for ordinary visitors — verified by diff, not by eye.
- [ ] Campaign URL shows 2 screens preselected and a truthful `$159 → $79` derived from `pricingPlans`.
- [ ] The screen selector cannot alter the annual campaign card.
- [ ] No flash of the standard page and no layout shift on campaign load.
- [ ] CTA sends the correct product configuration; checkout needs no coupon.
- [ ] Order summary shows 12 months, 2 screens, $79.
- [ ] Expiry is enforced on the shop, and page state flips at the same timestamp.
- [ ] No renewal price is implied anywhere unless §2 confirms it.
- [ ] Mobile, keyboard, and screen-reader QA pass.
- [ ] `winback_offer_view` / `_select` / `_expired` fire with UTMs attached.
