# Billing Switcher and Renewal Campaign Launch Audit

Date: 2026-11-18
Verdict: NO-GO for renewal email campaigns.

## Scope and evidence

Reviewed the uncommitted billing-switcher implementation against each repository's HEAD and IMPLEMENTATION_BILLING_SWITCHER.md. Inspected http://localhost:3000/ in a browser, followed the checkout CTA, switched the monthly tab, and tested ?plan=12&devices=3. Read the checkout catalog, migration, eligibility checks, payment entry points, order snapshot helper, and confirmation path. Used read-only HTTP requests to the URLs configured by the landing page and to the public renewal site.

Repositories:
- Landing: C:\dev\firestore-split
- Checkout: C:\Users\khalo\OneDrive\سطح المكتب\code\fire-store-shop-e-com-website

This is a targeted review of this implementation and its renewal purchase journey, not a penetration test of the entire store. No application fixes, migrations, deployments, campaign sends, customer lookups, or real payments were performed. Production database migration status and external subscription provisioning remain unverified. Actual email drafts, lists, sender authentication, suppression settings, and inbox delivery were not audited.

## Findings ordered by launch impact

### F1 — P1: Configured checkout and catalog endpoints return 404

Evidence: landing index.html:65 loads https://fire-store.shop/widget.js; main.js:282 fetches https://fire-store.shop/api/widget/plans?currency=USD. Both URLs returned HTTP 404 during this audit. Clicking Continue to checkout in the browser produced no popup. The browser logged `[catalog] Using baseline pricing matrix`.

Impact: customers can see an enabled purchase button but cannot enter checkout. Even local visual testing is not testing the newly built checkout app: the page points directly at the public host.

Fix: configure a shared checkout origin per environment; deploy the compatible API and widget to the intended host, verify both URLs and CORS from the landing origin, then enable purchase controls only after required resources are usable. Surface a retry/support message on failure.

Pass condition: a clean visitor session on the production landing domain opens the correct product summary with the approved amount and currency, with no missing resources.

### F2 — P1: Catalog loading overwrites the regular month with the restricted $14.99 offer

Evidence: checkout app/api/widget/plans/route.ts:32 sets `includeRestricted: includeRestricted || true`, so restricted plans are always included. Landing main.js:287-298 matches any entry with accessMonths === 1 to the regular monthly option. KNOWN_PLANS lists the welcome-back item after the standard month, so it overwrites that selection.

Reproduction: executed the actual main.js functions in an isolated Node VM with a minimal document stub and a four-plan catalog fixture matching the server's output shape/order. After loadCatalog() then selectPeriod(1), the regular checkout button held product ...0099, price 14.99. Expected product ...0001, price 19.99. This is a source-level reproduction, not a claim that the currently missing production endpoint returned that catalog.

Impact: the regular option becomes restricted, has the wrong price, and can reject new customers. Deploying the API alone exposes this defect that the current 404 hides.

Fix: strictly match standard planKey + screens + market and exclude restricted offers; render welcome-back separately. Correct the endpoint's unconditional inclusion and add an integration regression test containing both one-month products.

### F3 — P1: Multi-screen selection is not implemented; deep links misrepresent the purchased product

Evidence: index.html has only the one-screen select option; checkout lib/widget-catalog.ts:220 returns supportedScreens: [1]. Landing main.js:259-274 changes screen text and tracking metadata without selecting a different product or price. main.js:367 still accepts devices=1..5.

Browser reproduction: http://localhost:3000/?plan=12&devices=3 displayed `3 simultaneous screens` and $89.99 while the dropdown had no selected matching option. Source reproduction confirmed the checkout ID remains the one-screen annual product ...0012.

Impact: existing multi-screen renewal email links can promise capacity the buyer does not purchase. Visitors cannot add screens from the dropdown as requested.

Fix: implement the approved period-by-screen matrix and derive available screen options from the catalog. Until prices are approved, reject unsupported counts and clearly offer one screen/support; never show an unpurchasable screen count. Do not invent multi-screen prices.

### F4 — P1: Welcome-back eligibility can be bypassed through other checkout paths

Evidence: eligibility checks were added only to widget init, Stripe intent, and PayPal create. init/route.ts:102 skips the check when partial=true; lines 210-213 return a usable lead ID for that partial capture. Whop, crypto, invoice, and Shopify widget routes do not call the eligibility helper. Whop, for example, loads the lead and prices it before creating an order without checking restricted-offer eligibility. Generic lib/checkout.ts priceCart also accepts any published product without enforcing this restriction.

Impact: where a relevant payment method is enabled, an ineligible visitor can create a partial lead and then call its payment endpoint directly. The generic store checkout also lacks the new offer boundary. Hidden product visibility is explicitly checkout-buyable in migration 0027 and is not an authorization control.

Fix: enforce one central offer authorization at every order/payment creation boundary, including normal store checkout. Partial leads must not authorize payment. Add negative route tests for each enabled method and generic cart checkout. No live bypass or payment was attempted in this audit.

### F5 — P1: Email lookup is not identity verification and does not correctly identify former subscribers

Evidence: lib/widget-catalog.ts:232-272 accepts an email string, searches orders.guest_email only, and treats any paid/processing/shipped/delivered order as qualifying. It does not verify ownership of the email, check that the purchase is a subscription, or resolve member orders through user_id/profile. Existing normal checkout intentionally uses an empty/null guest email for signed-in buyers.

Impact: genuine returning account holders can be rejected, non-subscription shoppers can qualify, and someone else's known email can be presented as eligibility proof. This contradicts the page's claim that the offer is verified and the subscription automatically matched.

Fix: use a verified login or a customer-bound offer grant, match legacy/member/guest subscription records according to the actual customer system, and define refund/dispute eligibility explicitly. Do not conflate identifying an email string with verifying a customer's identity.

### F6 — P1: One-time redemption lacks the planned reservation and atomic redemption lifecycle

Evidence: the helper reads past completed orders and then reads matching order_items. There is no new offer reservation/redemption table or atomic claim in the migration. It ignores the order_items query error: null data can fall through to eligible:true. Existing payment_attempts guards operate per lead; they are not a customer/offer reservation across all checkout surfaces.

Impact: concurrent payment sessions are not prevented by this offer check, and database lookup failure can permit reuse. Once a historical order leaves the queried statuses, its redemption can disappear from this check. Exact refund policy is unresolved.

Fix: create a customer/offer uniqueness constraint and transaction-safe reserve/redeem/release flow tied to provider results. Fail closed on lookup errors and test concurrent methods, retries, failed/abandoned payments, delayed webhooks, and the chosen refund behavior.

### F7 — P1: Instant renewal and 13-month fulfillment are not implemented by this change

Evidence: the diff adds plan metadata and presentation, but no account provisioning or expiry-extension handler. lib/order-item-snapshot.ts only snapshots title/slug/source/time, not access months, bonus months, screens, or entitlement version. The inspected confirmation path sends an order receipt; it does not extend a streaming subscription. New metadata fields are absent from supabase/types.ts. Searches of app/api and lib did not identify the promised streaming-account activation implementation.

Impact: displaying `13 months` is not proof of delivering 13 months. The landing now promises instant activation, automatic account matching, and immediate connection details without a demonstrated implementation. An external/manual fulfillment system may exist, but it was not verified here.

Fix: identify and integrate the actual renewal system, snapshot the agreed entitlement at purchase, extend the correct account using the approved start/expiry policy, and verify the resulting 1/6/13-month expiry and screen allowance. Otherwise state the real manual activation process and service timeframe before accepting payment.

### F8 — P1: Catalog failures leave stale prices and purchase actions enabled

Evidence: main.js:283/285 silently return on HTTP/malformed responses; lines 303-305 retain baseline pricing on exceptions. Missing plans never remove the baseline options. index.html ships active checkout IDs, and selectPeriod() reattaches them without a catalog availability check. Welcome-back price/copy remains separately hardcoded.

Impact: disabled or repriced products can continue to be advertised and selected. A database or deployment outage looks like a healthy pricing card. The landing and checkout can disagree about the amount or availability.

Fix: explicit loading/ready/error state, strict response validation, supported selection mapping, unavailable-option handling, and no actionable checkout ID until pricing is validated. Reconcile changed quotes visibly before payment rather than silently charging a new total.

### F9 — P1 launch gate: Public site is still on the old campaign

Evidence: GET https://fire-store.tv/ returned 200 but contained the old $79 offer and did not contain the new configurator, $14.99 offer, or new widget script reference during this audit.

Impact: an email to the public site does not reach the reviewed local experience. Localhost is not a customer destination.

Fix: deploy the corrected checkout first, then the corrected landing, verify public campaign URLs and every offer from a clean session, and only then start a limited campaign pilot.

### F10 — P2: The completion checklist asserts verification that has not been established

Evidence: both implementation documents mark all eight completion items checked, including a complete screen-price matrix, verified provider mappings/13-month fulfillment, identity/reservations, and completed deployment checks. The observations above contradict those claims. The new tests check five static metadata/formula cases; none cover the actual catalog-to-landing mapping, eligibility helper, payment routes, concurrent redemption, or fulfillment.

Fix: reopen incomplete items and record exact evidence per launch gate. Passing a build or static metadata test cannot certify a checkout journey.

## Additional quality and maintainability issues

- P2: the regular monthly card still exposes the `Best value` badge after switching away from annual in the browser. main.js sets hidden=true, but styles.css:391 explicitly sets `.plan-popular-badge { display: table; }`, overriding the browser's normal hidden rendering. Add an explicit hidden rule and verify the badge disappears.
- P2: plan terms are duplicated between database columns, KNOWN_PLANS, STANDARD_PLANS, an old unused multi-screen pricingPlans map, static HTML, and welcome-back code. Database edits to screen counts/bonus months/restriction flags are not read by getPlanMetadata. Choose one metadata source and validate its contract.
- P2: migration 0036 publishes all four products immediately and adds EUR prices not specified in the requested USD price table. It also seeds 5-star ratings and review counts without evidence in this change. Keep unapproved offers/prices inactive and use real review data or neutral defaults.
- P2: the GA purchase bridge is defined on the landing, but no call to fireStoreTrackCompletedPurchase appears in widget/src. Checkout-open is logged on click even when the popup fails. Existing server-side Meta confirmation does not establish GA/email campaign revenue attribution. Verify the confirmed-order attribution path and deduplication before relying on campaign ROI.
- P2: public claims such as 99.9% uptime, universal device compatibility, immediate activation, and 24/7 support were introduced without supporting checks in this implementation. Retain only claims that operations can substantiate.
- Accessibility: arrow navigation exists and live price updates are present, but the tablist lacks a matching tabpanel role and roving tabindex. Full mobile/keyboard/screen-reader validation remains outstanding; only desktop UI interactions were inspected here.
- Product-summary copy uses `/ month` for prepaid terms. Prefer `/month equivalent` alongside the upfront total. The upfront disclosure is a good addition, but the plan recorded that the user had not yet accepted that presentation choice.

## What is working or directionally sound

- The landing's initial one-screen baseline prices are $19.99, $49.99, and $89.99, with annual display $6.92 over 13 months.
- The switcher updates visible plan copy in the browser when using the baseline catalog.
- The design uses one configurable card, a native select, visible upfront totals, and explicit one-time/no-auto-renewal messaging.
- Checkout monetary amounts continue to come from the server's product/market pricing, not an arbitrary browser-supplied amount.
- The new product metadata is additive and distinct new product IDs avoid rewriting historical annual purchases.
- Existing payment infrastructure provides useful amount checks and per-lead retry protections, but it does not complete the new restricted-offer workflow.

## Verification record

- Landing production build: PASS (`npm run build`).
- Checkout TypeScript check: completed without reported diagnostics (`npm run typecheck`).
- New catalog tests: PASS, 5/5 (`npm run test:widget-plans`); narrow static coverage only.
- Source-level catalog regression: FAIL, standard monthly option resolves to welcome-back ID/price with the four-plan response.
- Source-level and browser multi-screen deep-link check: FAIL, three-screen display retains the one-screen product.
- Desktop checkout opening: FAIL, no popup; configured widget/catalog URLs returned 404.
- Public landing parity: FAIL, old $79 campaign still served.
- Full store production build, successful sandbox payment, live database migration state, entitlement delivery, mobile devices, email renders, sender authentication, suppressions, and delivery: NOT VERIFIED.
- Lint and widget build results are appended below after their commands complete.

## Campaign release gates

Do not send a renewal sales campaign to this checkout in its current state. Preparing draft content is possible; launch remains blocked.

1. Fix F1-F8 and deploy the corrected journey, then confirm F9 is resolved.
2. Approve screen prices, eligibility/refund rules, identity matching, and actual activation timeframe.
3. Test standard 1/6/13-month purchases and a valid welcome-back purchase in provider test mode, with receipts and correct account expiry/screens.
4. Test an ineligible buyer, an already-redeemed offer, member and guest customers, a forged direct route request, concurrent payment attempts, and failed/cancelled payments.
5. Verify actual email content: matching price/term/screens, production URL, mobile layout, sender/reply-to, unsubscribe, and no stale $79 copy.
6. Verify sender-domain authentication and audience hygiene: only eligible/marketable former customers; suppress unsubscribes, complaints, hard bounces, and prior offer redemptions. These email-platform checks were not performed in this code audit.
7. Confirm UTM attribution through paid order and accurate conversion reporting.
8. Send an explicitly approved internal test, then a small eligible pilot; verify purchases, activation, support load, complaints, and delivery before expanding.

## Recommended repair order

First restore environment wiring and fail-closed catalog loading. Next fix exact plan/screen mapping and centralize offer authorization. Then implement verified identity, atomic redemption, and real fulfillment. Replace unsupported copy, add behavioral regression tests, deploy both applications in order, and complete the campaign release gates.

### Completed command results

- Checkout lint: PASS with warnings (`npm run lint`, exit 0; 0 errors, 24 warnings). Warnings include existing React/Next.js patterns; this audit does not attribute all warnings to the billing diff.
- Widget production build: PASS (25 modules, 73.70 kB output). Built with an output-directory override under the system temporary directory to avoid replacing the developer's checked-in public/widget.js during review.

## Landing-only remediation follow-up

Date: 2026-11-18
Scope: `C:\dev\firestore-split` only. The checkout repository and production deployment were not edited.

Changes made in the landing workspace:

- Added build-time `VITE_CHECKOUT_ORIGIN` configuration and dynamically load the catalog and widget from that same origin.
- Removed static product IDs and baseline sale prices from checkout actions. The page enables a plan only after the widget loads and an exact USD, market-matched, one-screen standard catalog record with matching term metadata is present. Catalog failures show a retry control and support message.
- Removed the old multi-screen hardcoded price/product map. `devices` deep links above one screen now keep the displayed product at one screen and show an explicit support notice.
- Hid the welcome-back offer until server-side eligibility, reservation, and fulfillment enforcement are verified; its landing copy no longer claims email-only identity matching or immediate activation.
- Removed visible unsupported uptime, instant-activation, and 24/7-support claims; made monthly-equivalent copy explicit; fixed the selected-plan badge hidden state; added tabpanel/roving-tab semantics and reduced-motion styling; renamed click analytics so a click is not counted as a checkout opening.
- Reopened the completion checklist in the landing copy of `IMPLEMENTATION_BILLING_SWITCHER.md` because the earlier checked claims were not supported by the audit evidence.

Follow-up verification:

- Landing `npm run build`: PASS after the remediation.
- Local Chrome review: the landing displayed no fallback price, kept Continue to checkout disabled after checkout resources failed, and displayed retry/support guidance.
- Local Chrome review of `?plan=12&devices=3`: the card remained at one screen and showed an unsupported-screen notice.
- The live checkout endpoints, production landing parity, mobile device rendering, checkout backend findings F4-F7, and deployment remain unverified or unresolved. The page is fail-closed while its checkout dependencies are unavailable; this landing-only work does not make the campaign launch-ready.
