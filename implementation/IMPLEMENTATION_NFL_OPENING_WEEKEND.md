# NFL Opening Weekend — 72-Hour Campaign Implementation Plan

**Approach:** urgency and framing only · no price change · self-expiring, date-gated campaign state · isolated `nfl.js` module.

Written against the code as it actually exists (`index.html`, `main.js`, `winback.js`, `styles.css` as of commit `636a725`). Follows the architecture established by `IMPLEMENTATION_WINBACK_LANDING_2SCREEN.md`; where this document and general intent disagree, this one wins.

**Campaign window:** Friday Sep 11 → Monday Sep 14, 2026, 11:59 PM ET.

---

## 1. Decisions locked

| # | Decision | Rationale |
|---|---|---|
| D1 | **No price change.** Prices and all 15 `productId`s stay exactly as they are | A real discount needs new unlisted product UUIDs on fire-store.shop. That is the same blocker that has `winback.js` stuck on a placeholder today. Touching price means the campaign cannot ship this weekend |
| D2 | Campaign is **date-gated**, not query-param gated | This targets all public traffic, unlike win-back which is invitation-only |
| D3 | Expiry reverts the page to **evergreen with no "offer ended" notice** | A public visitor on Tuesday should see the normal page, not a tombstone. This also means expiry needs zero design work |
| D4 | Deadline is **Monday Sep 14, 11:59 PM ET**, headlined as "before Monday Night Football" | Ending at the 8:15 PM kickoff cuts off the highest-intent hour: people who realise at 8:30 that they cannot watch the game. The urgency story is kickoff; the actual gate is midnight |
| D5 | The timer never displays a literal `72:00:00` | Friday noon → Monday 11:59 PM is 84 hours. "72-hour" is a brand label; the clock shows real remaining time |
| D6 | Weekend schedule strip is **added** as a new section, not swapped for `#why` | The navbar links to `#why` (index.html:65) — removing it breaks the anchor. `#why` also carries the anti-freeze and support objection handling, which is what closes. The schedule strip is the hook, not the closer |
| D7 | **No new fixed top banner.** Hero timer + reuse of the existing `.promo-sticky` bottom bar | A second fixed top bar collides with `--promo-bar-h` and the fixed navbar. See §3.4 |
| D8 | If `promo=winback` is present, the NFL campaign **stands down entirely** | Both campaigns rewrite the same hero nodes and the same 12-month card. Precedence must be explicit, not emergent |

---

## 2. Inputs required before launch

Commercial answers, not code. The build proceeds without them; **launch is fine without them too** — every item here has a safe default already chosen.

- [ ] **Verify the matchups.** `Cowboys–Giants` (SNF, Sep 13) and `Broncos–Chiefs` (MNF, Sep 14) are unverified against the real schedule from inside this repo. These are checkable factual claims on a public page — a wrong matchup is a credibility hit on exactly the audience being targeted. **Default if unverified: ship the strip with generic slate copy and no team names.**
- [ ] **Second-screen bonus — yes or no?** "Order before kickoff Monday, get a free second screen for the season", fulfilled manually over WhatsApp. Adds real value with zero checkout risk, because fulfilment is human-side, not product-side. **Default: no — urgency and framing only.**
- [ ] **Confirm `endAt`.** `2026-09-14T23:59:00-04:00`. One ISO-8601 timestamp with offset, declared once (§4.1).

---

## 3. Architecture

### 3.1 Files touched

| File | Change |
|---|---|
| `campaign-utils.js` | **New.** `formatDeadline()` and `track()`, extracted from `winback.js` so both campaigns share one implementation |
| `nfl.js` | **New.** All NFL campaign behaviour in one module |
| `index.html` | Inline `<head>` state script; empty schedule-strip section shell; OG/share tags (§8) |
| `main.js` | Import + init `nfl.js`; ordering fix for `initHeroSeasonBadge()` (§4.3) |
| `winback.js` | Delete its local `formatDeadline()` / `track()`, import from `campaign-utils.js` |
| `styles.css` | All campaign CSS scoped under `.promo-nfl`; add `.promo-nfl` to the `.promo-sticky` display scope |

### 3.2 State model

Two states, set once, pre-paint. Simpler than win-back's three because of D3.

| Class | Condition | Behaviour |
|---|---|---|
| *(none)* | Before `startAt`, after `endAt`, or `promo=winback` present | Standard public page, byte-identical to today |
| `.promo-nfl` | `startAt <= now < endAt` and no `promo=winback` | Full campaign state |

**Every campaign style is scoped under `.promo-nfl`.** After Monday midnight the class stops being applied and every rule becomes unreachable — no deploy required to end the sale.

### 3.3 Why a separate `nfl.js`

Same reasoning as `winback.js`: rollback must be one deleted import line, not a surgical edit under time pressure. This module is deleted outright when the campaign ends.

### 3.4 The `--promo-bar-h` interaction

`--promo-bar-h` is `0px` on `:root` and `44px` only under `.promo-winback` (styles.css:3557–3560). The navbar top, hero top padding, and `#plans` scroll-margin all reference it.

**The NFL campaign adds no top bar, so it leaves `--promo-bar-h` at `0px`.** Navbar and hero layout are therefore untouched, and there is no possible double-bar stack. This is the single reason D7 is locked.

---

## 4. Phase 1 — Campaign state, pre-paint

### 4.1 Inline `<head>` script — single source of truth

Placed immediately after the existing WINBACK block in `index.html`, same pattern, same commented rollback instructions.

```js
window.NFLWEEK1 = {
  startAt: "2026-09-11T00:00:00-04:00",
  endAt:   "2026-09-14T23:59:00-04:00",
  tzLabel: "ET",
};
(function () {
  var p = new URLSearchParams(location.search);
  if (p.get("promo") === "winback") return;        // D8 — win-back wins
  var force = p.get("nflpreview");                 // QA override, §10
  if (force === "0") return;
  var now = Date.now();
  var live = force === "1" ||
    (now >= Date.parse(window.NFLWEEK1.startAt) && now < Date.parse(window.NFLWEEK1.endAt));
  if (live) document.documentElement.classList.add("promo-nfl");
})();
```

Runs before body parse, so the page never flashes evergreen copy then swaps.

### 4.2 `campaign-utils.js` — shared, extracted first

`winback.js:89` already has a correct offset-anchored `formatDeadline()` that renders the deadline in the *campaign's* timezone rather than the visitor's. A naive `toLocaleString()` in `nfl.js` would show a Californian visitor the wrong deadline.

Extract, do not duplicate:

```js
export function formatDeadline(iso, tzLabel) { /* moved verbatim from winback.js:89 */ }
export function track(campaign, event, params) { /* generalised from winback.js:70 */ }
```

`winback.js` then imports both and deletes its local copies. This is a mechanical move — **but it touches a second campaign, so it gets its own verification step** (§10, row W1). If the extraction turns out to be fiddly under time pressure, the accepted fallback is duplicating ~30 lines into `nfl.js` and doing the extraction after the weekend.

### 4.3 Ordering fix — `initHeroSeasonBadge()` will overwrite the badge

`main.js:363–374` sets `#heroBadge .hb-text` from `SEASON_START` on every load. Any badge copy written into the HTML gets stomped back to "🏈 Football season is live now".

`initNfl()` must run **after** `initHeroSeasonBadge()` — the same reason `applyHeroCopy()` works in `winback.js`. Init order in `main.js`:

```
initDeviceSelector()
initScrollReveal()
initHeroSeasonBadge()
initWinback()        // unchanged
initNfl()            // new — after the badge, before deep-link
initDeepLink()
```

`initNfl()` returns immediately unless `.promo-nfl` is present, so the public path costs one `classList.contains` call.

---

## 5. Phase 2 — Hero

All applied by `nfl.js`, all reversible by removing the class.

| Node | Campaign copy |
|---|---|
| `#heroBadge .hb-text` | `🚨 72-HOUR OPENING WEEKEND SALE` |
| `#heroTitle` | `Don't Miss a Single Snap This Weekend.` |
| `#heroSub` | Sunday's full slate, Sunday Night Football, Monday Night Football — plus a full MLB weekend. 100,000+ channels in 4K, live in under a minute. |
| `.hero-ctas .cta-primary` | `⚡ Get Access Before Kickoff` |

Subtitle copy above is the **generic default** per §2. If matchups are verified, swap in team names.

### 5.1 Countdown timer — hero placement

Inserted after `.hero-sub`, before `.hero-ctas`.

**Reserve its height in CSS.** The hero image is the LCP element with `fetchpriority="high"` (index.html:107). Injecting an unreserved block above the CTA row shifts the hero and costs CLS on the exact page being paid to drive traffic to. Fixed `min-height` on the timer container, matching the rendered height at both breakpoints.

Implementation requirements:

- **One** `setInterval(…, 1000)`, cleared when it reaches zero.
- Clamp at zero — never render negative time.
- Re-sync on `visibilitychange`. A phone that slept for two hours must not resume from a stale count.
- On reaching zero, `nfl.js` removes `.promo-nfl` from `<html>` and the page reverts live, mid-session, with no reload.
- **Accessibility:** the per-second digits are `aria-hidden`. A separate visually-hidden `aria-live="polite"` node carries a coarse summary ("About 14 hours left") updated at most once a minute. A per-second `aria-live` region is a screen-reader denial-of-service.
- The static deadline renders in a `<time datetime="…">` via `formatDeadline()`.

---

## 6. Phase 3 — Weekend schedule strip

**New section**, inserted between the hero and `#plans`. Empty `<section class="nfl-strip" id="weekend" hidden>` shell in `index.html`; content rendered by `nfl.js` from an array so it cannot drift from the deadline logic.

```js
const WEEKEND = [
  { day: 'Sun',  label: 'Full Week 1 slate',        detail: 'Games all afternoon' },
  { day: 'Sun',  label: 'Sunday Night Football',    detail: '…' },
  { day: 'Mon',  label: 'Monday Night Football',    detail: '…' },
  { day: 'All weekend', label: 'Full MLB schedule', detail: 'Every game, every market' },
];
```

`detail` fields carry team names only once §2 verification lands; otherwise they stay generic. The `hidden` attribute is removed by `nfl.js` only in campaign state, so non-campaign visitors never see an empty shell — and `[hidden]` means it costs nothing if the JS fails.

---

## 7. Phase 4 — Plans section

**No price is modified. No `productId` is modified.** `updatePriceCards()` is not touched, and the device selector keeps full control of all three cards — this campaign has no equivalent of win-back's `annualLocked` lock.

Applied by `nfl.js` in campaign state:

| Node | Change |
|---|---|
| `#plans .section-tag` | `🏈 Opening Weekend — Ends Monday Night` |
| `#plans h2` | `Be Live Before Kickoff` |
| `.plan-card.popular .plan-popular-badge` | `⭐ Season Pass — Best Value` |
| New line under `#period-12m` | Deadline line, rendered via `formatDeadline()` |

Because prices are untouched, this phase carries no checkout risk at all. It is pure copy over a code path that does not change.

**If the second-screen bonus is approved** (§2), it is added here as a `.nfl-bonus` line on the annual card plus a matching FAQ entry — copy only, WhatsApp fulfilment, still no product change.

---

## 8. Phase 5 — Share preview tags

`index.html` currently has **no Open Graph or Twitter card tags.** For a sale distributed through WhatsApp, the link preview is the advertisement — this is probably the highest-value item in the whole plan, and it is missing from the original.

Add `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` to the `<head>`.

> [!IMPORTANT]
> **These cannot be date-gated.** The page is static HTML on GitHub Pages, and link crawlers do not execute the inline state script. Campaign-specific OG copy would therefore persist after the campaign ends and be scraped as stale.
>
> **Decision: evergreen OG copy**, punchy but not weekend-specific. It is a permanent improvement to the page rather than a campaign asset, and it survives the rollback in §11 untouched.

`og:image` uses `/assets/images/hero-football-1280.jpg`, which already exists — absolute URL required.

---

## 9. Phase 6 — Analytics

The original plan had none. A 72-hour campaign you cannot measure is a wasted weekend. There is a live GA4 property (`G-G4KYGXE4YK`, index.html:8) and `track()` is already written.

| Event | Fires on |
|---|---|
| `nfl_week1_view` | Campaign state rendered on load |
| `nfl_week1_cta` | Hero CTA, sticky CTA, schedule-strip CTA — each with a `cta` source param |
| `nfl_week1_checkout` | Any `.firestore-buy-btn` click in campaign state, with `plan` and `screens` |

All carry `campaign: 'nfl_week1_2026'` plus captured UTMs, matching win-back's shape so the two are comparable in GA.

---

## 10. QA matrix

| # | Case | Expected |
|---|---|---|
| A1 | Default load during window | Full campaign state, no layout shift |
| A2 | `?nflpreview=0` | Evergreen page, byte-identical to pre-campaign |
| A3 | `endAt` temporarily set to a past time | Evergreen page. **No stale campaign copy anywhere** — badge, title, strip, plan badge all reverted |
| A4 | Leave the tab open across a simulated expiry | Timer hits zero, campaign state drops live, no reload, no broken layout |
| A5 | `?promo=winback` | Win-back state only. **One top bar, one sticky bar, no NFL copy** |
| A6 | `?promo=winback` with `endAt` past | Win-back expired notice. Still no NFL copy |
| W1 | Win-back card after the `campaign-utils.js` extraction | Deadline line renders identically to before the refactor |
| B1 | OS timezone set to Europe/London | Countdown and printed deadline agree, both in ET |
| B2 | OS timezone set to America/Los_Angeles | Same |
| C1 | Checkout regression: all 5 screen counts × 3 durations | Widget popup opens with the correct `data-product-id` in every combination |
| C2 | `?devices=3&plan=12` deep link | Still preselects and scrolls correctly in campaign state |
| D1 | 375px viewport | Sticky bar visible past hero, hidden at footer, no overlap with the CTA row |
| D2 | `npm run build && npm run preview` | Builds clean; campaign works in the built `dist/` output |
| E1 | Screen reader | Digits silent; coarse summary announced at most once a minute |
| E2 | GA DebugView | All three events fire with campaign and UTM params |

`dist/` is gitignored and rebuilt by CI on push to `master` (`.github/workflows/deploy.yml`), so D2 verifies the deployed artefact rather than only the dev server.

---

## 11. Rollback

Three deletions, in this order, none of which touch the evergreen page:

1. Delete `import './nfl.js'` and the `initNfl()` call in `main.js`
2. Delete the inline `<head>` NFLWEEK1 block in `index.html`
3. Delete `nfl.js`, the `.promo-nfl` CSS block, and the schedule-strip shell

`campaign-utils.js` and the OG tags (§8) **stay** — both are permanent improvements, and `winback.js` depends on the former.

**The campaign also expires on its own at `endAt` with no deploy.** Rollback is for pulling it early, not for ending it on schedule. This is the structural fix for the original plan's "hide the banner at zero", which would have left the hero title, badge, plan badge and schedule strip all asserting a sale that had ended.

---

## 12. Acceptance criteria

- [ ] A visitor outside the campaign window gets a page byte-identical to today's
- [ ] No price, `productId`, or checkout path is modified anywhere in the diff
- [ ] Campaign state and expiry are both driven by one timestamp, declared once
- [ ] `promo=winback` and the NFL campaign never render simultaneously
- [ ] No second fixed top bar; `--promo-bar-h` stays `0px` throughout
- [ ] Countdown and printed deadline agree in every visitor timezone
- [ ] Hero CLS unchanged from baseline
- [ ] All three analytics events verified in GA DebugView
- [ ] Every factual claim on the page verified, or replaced with generic copy
