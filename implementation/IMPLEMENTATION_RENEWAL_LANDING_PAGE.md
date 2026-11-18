# Implementation plan: renewal landing page at `/`

**Target:** `C:/dev/firestore-split/index.html`  
**Audience:** former subscribers arriving from renewal emails, and anyone visiting the homepage  
**Reference:** `C:/dev/Fire-store.tv` for current brand, subscription terms, checkout, and support language  
**Status:** planning document; implementation and campaign configuration are still pending

## Goal

Replace the hardware store homepage with a subscription renewal homepage. The first screen at `/` should say **“Welcome back”**, explain the returning customer offer, and let a customer renew or get help. Email CTAs must point to `/` with campaign tracking parameters, never to `/renew.html` or the hardware page.

The featured offer is **12 months + 1 month free for $79 total**. State this as **13 months of access for $79 total** so the extra month is unambiguous. The existing 1-, 6-, and 12-month standard pricing and product IDs in `main.js` remain the source of truth and must not be changed to create the promotion.

This makes the offer public to direct visitors at `/` while active. If the business wants it restricted to email recipients, that requires a real eligibility mechanism; UTM parameters alone do not restrict access.

## Current state

- `index.html` is a device shop with streaming sticks, cables, mounts, hardware metadata, a shop click conversion, and `<script type="module" src="/setup.js"></script>`.
- `setup.html` duplicates the hardware landing page and also loads `setup.js`. `vite.config.js` builds both pages.
- `main.js` already has the standard price table for 1–5 screens and 1/6/12 months, the screen selector, FAQ rendering, deep links, and widget button wiring. Preserve all 15 prices and their existing product IDs.
- `winback.js` currently implements a different offer: **12 months, two screens, $79**, compared with a $159 regular two-screen price. Its copy, card, FAQ, sticky CTA, selector behavior, and placeholder product ID must be rewritten for the **12+1 month** offer. The old two-screen claim and $159 strike-through must be removed.
- `main.js` also imports `nfl.js`, which can change the hero. Seasonal copy must not override the renewal homepage.
- `privacy.html`, `refund.html`, `cookies.html`, and `dmca.html` still link to `/#devices` and contain hardware shop copy. They must be updated to match the subscription site where applicable.
- `C:/dev/Fire-store.tv` has a `/renew/:token` route for referral attribution. Moving email links to this static `/` must account for any existing token-based campaign before those links are changed.

## Implementation sequence

### 1. Replace the root page

1. Rebuild `index.html` as the renewal landing page. Replace the hardware title, description, Open Graph text, nav, hero, product grid, shop links, hardware FAQ, and footer with subscription renewal content. Load `main.js` from the root page.
2. Provide the DOM hooks required by `main.js` and the revised `winback.js`: hero IDs, `#deviceSelector` with `.device-btn[data-devices]`, `#plans`, standard plan card IDs (`price-*`, `period-*`, `mini-screens-*`, `btn-*`), `#faqList`, and support/footer anchors. Remove unused hooks instead of leaving dead markup.
3. Put the featured offer, $79 total, term length, and **Renew my subscription** CTA in the first mobile viewport. Place the standard plan selector and plan cards immediately below. Offer WhatsApp as the secondary help action.
4. Make the renewal message the default page state at `/`; it must not depend on `?renew=1` or `?promo=winback`. An email URL such as `/?utm_source=email&utm_medium=campaign&utm_campaign=winback` must show the same offer. Preserve UTMs for measurement.
5. Update root canonical/social URLs and deployed host configuration to point to `/`. Verify direct loads and refreshes reach the new page.

### 2. Rework the offer without changing standard prices

1. Keep `pricingPlans` in `main.js` unchanged, including its 15 prices and product IDs. The screen selector continues to control the **standard** 1-, 6-, and 12-month plan cards.
2. Change `winback.js` from the second-screen upgrade to a **13-month access for $79 total** promotion. Prefer a dedicated featured offer card above the standard grid so the standard annual card is not replaced or locked. Remove the old `annualLocked` branch in `main.js` once no longer used.
3. Remove all old campaign statements: “free second screen,” “2 screens included,” “$159 → $79,” “$80 value,” and FAQs or analytics labels that identify the old screen-upgrade offer. The new card should disclose the included screen count once confirmed; do not imply that all 1–5 screen tiers receive the $79 offer.
4. Rewrite the campaign bar, hero, featured card, sticky mobile CTA, help block, FAQ, and tracking event names/parameters for 12+1 months. Make every primary CTA lead to the same featured offer checkout. Keep standard plan CTAs distinct.
5. Prevent `initNfl()` and `initDeepLink()` from replacing “Welcome back” or jumping past the offer on load. An explicit `#plans` link may scroll to the plans. Keep screen and plan deep links for standard pricing only.

### 3. Verify checkout and fulfillment

1. Determine how the extra month is actually granted. Use a dedicated campaign product or a documented fulfillment rule that yields **13 months of access for $79 total**. A normal 12-month product is not sufficient merely because it also costs $79.
2. Replace the `__WINBACK_2SCREEN_12M_PRODUCT_ID__` placeholder in `winback.js` with the verified new campaign product ID, and rename the placeholder/constant to describe the 13-month offer. Keep checkout disabled or route customers to support if the item is not configured; do not silently sell a 12-month item.
3. Verify the checkout widget recognizes dynamically inserted buttons and reads their product IDs at the correct time. Before payment, check item name, screen count, currency, $79 total, and 13-month entitlement. Confirm fulfillment records the bonus month on the existing customer account.
4. Verify the standard plan buttons still open their matching products and prices from `main.js`. The $79 campaign card and the $79 standard one-screen annual plan must be clearly distinguished by **13 months versus 12 months**.
5. Confirm the offer's screen count, eligibility, account matching, renewal behavior after 13 months, refund policy, and support process. Show the relevant terms near the CTA and keep the checkout copy consistent. The reference `/plans` page says plans do not auto-renew; verify the current policy before publishing.

### 4. Set real campaign timing

Set `window.WINBACK.endAt` once with an approved ISO 8601 timestamp and explicit UTC offset, plus a matching displayed time zone. Evaluate active/expired state before first paint on `/`. When expired, remove the 13-month CTA and urgency language, show a short expired-offer notice, and retain standard renewal plans. Do not invent a deadline or show a countdown without a confirmed end time. If there is no deadline, make the campaign state explicit without deadline claims and define a manual switch-off procedure.

### 5. Remove hardware page and dead code

1. Delete `setup.html` and `setup.js` after `index.html` no longer references them. Remove `setup` from `vite.config.js` build inputs. Do not create `renew.html` or add a `renew` build entry.
2. Remove hardware-only sections and unused CSS from `styles.css`: device/product cards, shop cross-sell, shipping/warranty badges, hardware-only navigation and footer styles, and any promo CSS whose only purpose was hiding the shop. Keep shared layout and accessibility styles that the renewal page uses.
3. Audit and update all internal `/#devices`, `/setup.html`, “Shop Devices,” shipping, and hardware warranty links/copy in the remaining HTML/JS. Review `refund.html` in particular: its current policy describes hardware returns and a two-year device warranty, so it needs the verified subscription refund policy before it is linked from the renewal page.
4. Remove the hardware shop click-through function and its falsely named purchase conversion from `index.html`. Keep only analytics appropriate for the renewal funnel, with actual completed purchase measured after checkout confirmation.
5. Audit `assets/`, `public/`, and other pages for hardware-only files. Delete only files with no remaining references; keep channel, setup-help, and device-compatibility content that supports subscription customers.
6. For existing `/setup.html` backlinks, choose a stable redirect to `/` or an explicit gone response according to hosting behavior. Verify it does not expose an old hardware page after deployment.

### 6. Renewal copy and email journey

Suggested first-screen copy:

> **Welcome back to Fire Store TV**  
> Renew your subscription and get back to watching.  
> **Returning customer offer: 12 months + 1 month free, $79 total.**  
> **Renew my subscription** · **Need help? WhatsApp us**

Below the plans, answer the returning customer's main questions: whether their login and settings remain available, how the existing account is identified, how long reactivation takes, what to do if account details are lost, what screen count the offer includes, and what happens after the 13-month term. Verify operational claims before writing them as guarantees. Keep a clear support path and a link to the current subscription refund terms.

Update every campaign email CTA to the final deployed homepage URL `/` with UTMs. If current messages use `Fire-store.tv/renew/:token`, preserve that route's attribution or implement an equivalent secure handoff before replacing those links. Do not place customer credentials or personal identifiers in query strings. Measure landing, offer selection, checkout open, and completed purchase as separate events.

## Verification and release criteria

| Area | Pass condition |
| --- | --- |
| Root route | `npm run build` emits `index.html`; `/` loads and refreshes with “Welcome back” and the renewal offer. |
| Email URL | `/` with UTMs shows the same renewal page and records campaign attribution. |
| Featured offer | Card and checkout both say 13 months for $79, with confirmed screen count and terms. |
| Standard plans | All 15 `main.js` prices and product IDs are unchanged; selector and checkout still match each choice. |
| Expiry | Expired or switched-off offer has no $79/13-month checkout CTA; standard plans still work. |
| Mobile | At 375px and 390px, the offer and CTA are readable, there is no horizontal overflow, and sticky CTA obscures no controls. |
| Accessibility | Keyboard navigation, focus, labels, FAQ state, and price text are usable. |
| Cleanup | No hardware product page, `setup.js`, stale `/#devices` link, shop click conversion, or unused hardware assets remain. |
| Attribution | Referral/UTM data survives checkout without exposing customer data; purchase is counted on actual confirmation. |

## Launch inputs still required

- Verified 13-month/$79 product or fulfillment rule and its product ID.
- Confirmed screen count and offer eligibility.
- Approved deadline/time zone, or a decision to run without deadline language.
- Confirmed post-term renewal behavior, subscription refund policy, and account reactivation process.
- Confirmed final deployed homepage domain and handling of any existing `/renew/:token` email links.

Do not replace these inputs with guesses. The implementation can be built with a disabled campaign checkout until they are verified.
