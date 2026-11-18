# Implementation Plan: Billing Switcher and Shared Pricing

Date: 2026-11-18
Status: Landing-side work is in progress. The checkout repository has not been edited in this task; cross-project launch gates remain open.

## 1. Scope and repositories

Implement a Hostinger-inspired billing-period switcher and simultaneous-screen dropdown, backed by the existing checkout app. Keep checkout in its current application.

- Landing repository: `https://github.com/Yakhmedia/firestore-split.git`
- Checkout repository: `https://github.com/Yakhmedia/fire-store-shop.git`
- Store identical copies of this document at each repository root as `IMPLEMENTATION_BILLING_SWITCHER.md`. Update both copies when scope changes.

For this task, only the landing repository copy is being changed; the checkout repository remains untouched and its copy is not synchronized.

The screenshots are visual references, not implementation instructions. Do not copy Hostinger's products, prices, payment details, or renewal behavior.

## 2. Pricing and business rules

The following prices are the requested baseline, provisionally for one simultaneous screen. Confirm that screen-count assumption before activating products.

| Offer | Paid months | Bonus months | Access months | Total USD | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: | ---: |
| Regular month | 1 | 0 | 1 | $19.99 | $19.99 |
| Six months | 6 | 0 | 6 | $49.99 | $8.33 |
| Annual plus bonus | 12 | 1 | 13 | $89.99 | $6.92 |
| Welcome-back month | 1 | 0 | 1 | $14.99 | $14.99 |

- Compute monthly equivalents from the authoritative total divided by access months. Round only for presentation; never multiply the rounded monthly amount to calculate a charge.
- Annual selection means 12 paid months plus one bonus month, with 13 months fulfilled.
- Preserve the existing one-time payment / no-auto-renewal model unless a separate billing change is explicitly requested. A monthly equivalent is not a recurring payment schedule.
- Welcome-back is a separate, one-time eligible-customer offer, not a fourth public billing-period option.
- Do not infer prices for 2-5 screens by multiplying the one-screen amount. The current matrix is not uniformly linear.
- Preserve existing historical order amounts and entitlements. Do not retroactively apply the new annual bonus to old orders.

### Decisions required before production activation

1. Confirm the baseline applies to one simultaneous screen.
2. Set the exact price matrix for 2-5 screens for each period; confirm the maximum supported screen count.
3. Define former-customer eligibility, redemption identity, and whether refunded or disputed historical purchases qualify.
4. Confirm the welcome-back screen allowance, refund terms, and any expiry. Do not invent an offer deadline.
5. Confirm whether future manual annual purchases also include the bonus month; do not advertise an unconfirmed renewal promise.
6. Confirm whether added access extends an existing expiry or starts immediately, including month-end calendar handling.
7. Resolve the landing-page disclosure choice described below.

Engineering can proceed with fixtures and disabled unpublished options while these decisions remain open.

## 3. Landing-page experience

Recommended layout: one configurable pricing card if all durations include the same service features.

- Above the card: `1 month | 6 months | 12 + 1 bonus month`.
- Default: annual plus bonus, one screen; valid deep links override defaults.
- In the card: prominent monthly-equivalent price, coverage duration, simultaneous-screen dropdown, shared features, and `Continue to checkout`.
- Label the dropdown `Simultaneous screens`, with a short explanation that this is concurrent viewing capacity rather than installed devices.
- Selecting a period or screen count updates the visible price, duration, accessibility state, analytics metadata, and checkout product ID together.
- Use `Best value` only where the actual selected screen-count price matrix supports that claim. Avoid unsupported popularity claims.
- Mobile: wrap or stack the switcher without horizontal overflow; use an accessible native select for screens.

### Price disclosure: requested versus recommended

The user requested monthly prices on the landing page, with the full charge first shown in checkout. The recommendation is to keep the monthly equivalent dominant while also displaying a small `Billed upfront: $89.99 for 13 months` line, consistent with the reference screenshot. This recommendation has not yet been accepted; do not silently treat it as an agreed requirement.

If implementing the requested monthly-only landing presentation, explicitly label longer-term prices `per month equivalent`, state that the selected term is paid upfront, and show the exact total immediately when the popup opens, before collecting contact or payment details. Do not present $6.92 as the actual monthly charge. Resolve final copy before launch.

### Welcome-back presentation

- Campaign visitors see the $14.99 one-month offer separately from standard plans.
- Explain eligibility and one-time use; regular monthly purchases cost $19.99.
- Do not imply automatic charging after the discounted month.
- A campaign URL or hidden product ID alone must never authorize the discount.
- If ineligible, explain clearly and offer regular plans without silently substituting a higher-price payment.

## 4. Existing integration and identified gaps

Verified in the current source:

- Landing `main.js` contains a hardcoded `pricingPlans` matrix, updates three duration cards, assigns `.firestore-buy-btn` and `data-product-id`, and accepts `plan=1|6|12` plus `devices=1..5` deep links.
- `index.html` contains old $29/$49/$79 values and a separate $79 campaign. Its standard-plan note says one-time payment with no auto-renewal, while some JavaScript copy says billed monthly. Reconcile this inconsistency.
- `winback.js` gates campaign checkout using configuration and readiness checks. Replace the old campaign messaging without bypassing server eligibility.
- Checkout `widget/src/index.ts` delegates `.firestore-buy-btn` clicks, reads product ID and optional `data-currency`, and mounts the existing Preact popup.
- `widget/src/WidgetApp.tsx` fetches `/api/widget/product`, then advances through lead and payment steps. Product identity currently keys the component.
- Checkout `lib/widget-pricing.ts` computes authoritative product prices and market-specific totals. Browser-supplied amounts are not trusted.
- Widget routes exist for product, init, Stripe, PayPal, invoice, crypto, Shopify, and Whop.

Audit the actual widget script injection/loading location before implementation: the inspected landing HTML does not explicitly include `widget.js`. Preserve any deployment-level injection while ensuring exactly one widget instance loads.

## 5. Shared catalog architecture

Checkout owns product identities, prices, market availability, term metadata, eligibility, and fulfillment rules. Landing reads a public, read-only projection of that catalog.

Proposed additive endpoint: `GET /api/widget/plans?currency=USD`.

Return a versioned catalog containing:

- Catalog version, market, currency, and supported selections.
- Stable plan key and checkout product ID for each available term/screen combination.
- Paid months, bonus months, total access months, simultaneous screens.
- Authoritative total in integer currency minor units and currency precision.
- Payment mode (`one_time`), availability, and public labels.
- Optional derived monthly equivalent; if derived in the browser, use the same documented rounding rule.

Use existing product and market prices as the monetary source. Add plan metadata or a product-linked catalog mapping after auditing the schema; do not introduce a competing price table or migrate unrelated products.

- Prefer a distinct new annual product/version where reusing the old 12-month product would blur fulfillment or provider mappings.
- Public catalog excludes customer information, redemption state, and any usable eligibility credential.
- Restrict cross-origin access using the existing widget CORS conventions, adding the actual landing origins and development origins where needed.
- Pin USD for the initial USD campaign, including `data-currency="USD"`, unless localized prices are intentionally supported. Landing and popup must resolve the same market.
- Cache public responses briefly with a catalog version or ETag. Never cache private eligibility responses publicly.
- Missing or unavailable combinations cannot produce a checkout action. On fetch failure, show retry/support; do not silently fall back to stale hardcoded sale prices.
- Server validates published status, selected product, market, eligibility, and current amount at checkout. An altered DOM or forged amount cannot change the charge.
- If the amount changes after display, refresh the quote and require the customer to review the changed total before payment; never silently charge the new amount.

Flow: catalog -> period/screen selection -> product ID + market -> existing popup -> server quote -> payment -> order snapshot -> entitlement.

## 6. Checkout repository work

### Phase A: Catalog and product setup

- Audit existing products, market prices, fulfillment metadata, provider mappings, and order snapshots.
- Add additive term/screen metadata and the public catalog endpoint; keep existing widget API responses compatible.
- Prepare the approved price matrix and $14.99 restricted offer as unpublished or otherwise inactive until verified.
- Update any product-to-provider mapping needed by enabled payment methods. Hosted checkouts must charge the same approved total and currency.
- Store duration, bonus months, screen count, product/version, currency, and price on the order so later catalog edits cannot change fulfillment.

### Phase B: Popup summary and pricing

Likely touchpoints:

- `lib/widget-pricing.ts`
- `app/api/widget/product/route.ts`
- `app/api/widget/init/route.ts`
- New `app/api/widget/plans/route.ts` and focused catalog helper
- `widget/src/config.ts`, `WidgetApp.tsx`, `OrderSummary.tsx`, `Step1Lead.tsx`, and `styles.ts`
- Relevant payment creation/capture routes and fulfillment handlers identified during the audit

Show plan name, simultaneous screens, paid plus bonus duration, monthly equivalent, actual total due, and one-time payment terms immediately in the popup. Any taxes or fees must be included or clearly itemized before payment, using actual provider behavior rather than assumed fees.

For the first release, keep selection on the landing page and provide a clear way to close the popup to change it. Ensure reopening with a different product resets payment state. Existing same-product drafts can remain intact.

An in-popup period/screen selector is an optional follow-up, not a launch dependency. If implemented, refresh product/quote/lead state, invalidate old payment sessions, ignore stale asynchronous responses, and recreate provider payment state before permitting payment. Preserve contact drafts only where safe; never reuse a previous product's amount.

### Phase C: Welcome-back enforcement

- Use verified customer identity and historical purchase records or a server-issued customer-bound offer grant.
- Verify eligibility before creating discounted payment sessions on every enabled payment path, including direct requests to the restricted product.
- Define a reservation/redemption lifecycle that prevents simultaneous attempts from spending the offer twice. Failed or abandoned payments must not permanently consume it.
- Make successful-payment redemption and fulfillment idempotent. Handle asynchronous hosted payments, delayed webhooks, reservation expiry, retries, and refunds according to the agreed policy.
- Do not rely on client flags, a publicly known coupon, an email string alone, or campaign query parameters as proof.
- Keep tokens and personal data out of analytics and public catalog responses.

### Phase D: Fulfillment

- Grant exactly 1, 6, or 13 months and the selected simultaneous-screen allowance.
- Confirm the bonus is reflected in activation, expiry, confirmation, invoice/receipt, and customer portal where those surfaces exist.
- Apply the agreed extension/start-date policy using calendar-month arithmetic.
- Ensure payment retries and duplicate webhooks never grant duplicate access.

## 7. Landing repository work

Likely touchpoints: `index.html`, `main.js`, `styles.css`, `winback.js`, and `campaign-utils.js`; optionally add a focused catalog client module.

- Replace the static three-card grid with the switcher and configurable card.
- Replace `pricingPlans` as the price authority with catalog loading and explicit selection state: period key, screen count, market, catalog version, selected product.
- Replace screen buttons with the dropdown; keep term and screen selection independent.
- Update checkout attributes atomically after valid catalog resolution. During loading/errors, remove actionable product attributes and disable checkout.
- Keep `plan=1`, `plan=6`, and `plan=12` compatible. `plan=12` selects annual plus bonus; display 13 access months explicitly. Reject invalid input and avoid brief wrong-price rendering before deep-link resolution.
- Preserve campaign attribution and UTM capture while excluding sensitive eligibility data.
- Update campaign configuration, hero, FAQ, static fallback copy, metadata, and structured pricing data if present. Search for stale $29/$49/$79 offers and old annual duration claims across relevant landing surfaces.
- Reconcile refund/terms text with the actual approved offer without changing unrelated policies.
- Keyboard support, visible focus, selected-state semantics, labeled select, polite price-change announcement, reduced-motion behavior, and mobile layout are required.
- Preserve existing confirmed-payment-only purchase analytics. Add period/screen selection and catalog-error events; checkout-open is not a purchase.

## 8. Verification and acceptance criteria

Automated checks should focus on financial and entitlement correctness, not duplicate markup implementation.

- Prices: 1999/1 -> $19.99; 4999/6 -> $8.33; 8999/13 -> $6.92; eligible welcome-back -> $14.99. Charged totals remain 1999, 4999, 8999, and 1499 cents respectively.
- Every approved screen/period pair resolves to the correct product, exact amount, currency, and access term.
- Missing combinations, unpublished products, catalog failure, forged IDs/amounts, and market mismatch fail safely.
- Changed catalog prices cannot silently alter a payment after customer review.
- Welcome-back: eligible, ineligible, already redeemed, concurrent attempts, abandonment, payment failure, webhook retry, and refund-policy cases.
- Duplicate callbacks cannot create duplicate orders or grant access twice.
- Annual fulfillment grants 13 calendar months, including month-end and existing-expiry cases.
- Legacy links and unrelated product widgets continue working.
- Popup displays the full amount before contact submission, retains correct focus/scroll behavior, and resets payment state after product changes.
- Inspect desktop and narrow mobile layouts, keyboard operation, loading, empty/error, and campaign states.
- Exercise each enabled payment method in its test environment: amount, currency, receipt, order snapshot, provider mapping, and entitlement must agree. Disabled methods remain disabled.

Repository checks:

- Landing: `npm run build` plus browser verification against the checkout staging endpoint.
- Checkout: `npm run typecheck`, `npm run lint`, relevant existing and new targeted tests, `npm run build:widget`, and `npm run build` with the necessary environment configured.
- Report pre-existing failures separately; never describe unrun checks or live payment flows as verified.

## 9. Deployment sequence and rollback

1. Finish catalog contract and fixtures; resolve launch decisions and approve product mappings.
2. Deploy additive checkout/catalog changes with new offers inactive. Verify old widgets still function.
3. Prepare product metadata, prices, fulfillment, and provider mappings; verify staging end to end.
4. Build and publish the compatible widget bundle; confirm the landing loads that version exactly once.
5. Deploy the landing UI behind a configuration flag, pointing to the same market/catalog environment as checkout.
6. Activate the verified standard catalog and landing selector together. Activate welcome-back only after identity and redemption controls pass.
7. Verify production read-only price/selection behavior. Use provider sandbox/test modes for payment tests unless live charges are separately authorized.
8. Monitor catalog failures, checkout errors, price mismatches, provider failures, eligibility rejections, and order/fulfillment mismatches.

Rollback must preserve completed orders and access. Disable affected offers or the new selector; keep additive API compatibility for old clients. Do not restore old landing prices while checkout still charges new amounts. Coordinate UI/catalog versions or temporarily disable checkout until they agree. Do not drop catalog/order metadata during rollback.

## 10. Completion checklist

The earlier checked items overstated the evidence recorded in the billing audit. They are reopened until the corresponding checkout or production evidence exists.

- [ ] Business decisions recorded and screen-price matrix complete.
- [ ] Catalog endpoint and compatible widget metadata implemented and available.
- [ ] Product prices, provider mappings, and fulfillment verified.
- [ ] Landing switcher/dropdown and supported deep links verified against checkout.
- [ ] Price disclosure and one-time payment copy agreed and consistent.
- [ ] Welcome-back identity, reservation, and redemption enforced server-side.
- [ ] Targeted verification, accessibility, and cross-project checkout flows completed.
- [ ] Deployment/rollback checks complete; production parity confirmed.

Landing-only remediation on 2026-11-18: checkout origin is configurable with `VITE_CHECKOUT_ORIGIN`; the landing now gates purchase actions on the catalog and widget loading, accepts only exact USD one-screen standard catalog entries, rejects multi-screen deep links without changing the selected product, and keeps the restricted offer hidden. These changes do not resolve checkout authorization, identity, redemption, fulfillment, or deployment findings.
