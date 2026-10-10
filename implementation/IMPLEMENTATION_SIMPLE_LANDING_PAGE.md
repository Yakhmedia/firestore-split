# Implementation Plan — Simplified "Renew / Checkout-First" Landing Page

**Date:** 2026-07-04
**Files touched:** `index.html`, `main.js`, `styles.css`
**Goal:** Restructure the page around one job — **checkout** — for a mostly email / repeat-buyer audience, while keeping the option to change device count and plan for the minority who switch.

---

## 0. Audience decision (confirmed)

- Most buyers **renew the same plan**. A customer who bought a TV-Home / 1-device plan almost always renews **1 device**.
- We **keep** the ability to pick multiple devices and change duration for customers who got a new device or changed their mind.

**Design consequence:** Default the page to **1 device**, and make the **12-month** card the visually dominant, pre-selected choice. Keep device + duration switching, but demote it to a secondary "Change plan" interaction instead of a mandatory two-step decision.

---

## 1. Current buyer journey (what we're cutting through)

Land → hero + pills + ticker + fake urgency → Live & Trending hub → channel marquees → 6 feature cards → **plans (finally)** → pick 1 of 5 device tiers → pick 1 of 3 durations → long feature lists → comparison table → cord-cutter calculator → checkout.

**Target for warm traffic:** Logo → "Welcome back" → plan (pre-selected) → pay → done.

---

## 2. Section-by-section cut list

Reference = current `index.html` sections.

| Section (current) | Action | Notes |
|---|---|---|
| Navbar (`.navbar`) | **Trim** | Keep `Subscribe` + `FAQ` + `WhatsApp`. Remove Features, Live & Trending, Movies & Shows, How It Works links. |
| Hero (`.hero`) | **Rewrite** | New renewal-focused copy, single CTA. Remove ticker, pills, secondary CTA, urgency bar. |
| Hero ticker (`#heroBadgeTicker`) | **Remove** | Delete markup + `initHeroTicker()`. |
| Category pills (`.hero-category-pills`) | **Remove** | |
| Secondary CTA (`.cta-secondary` "See What's Live") | **Remove** | |
| Urgency bar (`.urgency-bar` / `#seats`) | **Remove** | Delete markup + `initUrgencyCounter()`. Fake scarcity hurts repeat buyers. |
| Live & Trending hub (`#games`) | **Remove** (or collapse) | Delete section + hub render code, OR keep behind a "Browse what's live" link for cold traffic (see §6 optional). |
| Channel marquees (`#entertainment`) | **Remove** (or shrink) | Repeat buyers already know the offer. Optional: keep one small static logo strip. |
| Features grid (`#features`, 6 cards) | **Collapse to 3** | Keep the 3 strongest as a compact trust row near plans, or drop entirely. |
| Plans (`#plans`) | **Keep + simplify** | Move to top (directly under hero). See §4. |
| Comparison table (`.comparison-table`) | **Remove** | Returning customers don't need a feature matrix. |
| Cord-cutter calculator (`#savingsCalculator`) | **Remove** | Built for cable-comparison shoppers, not renewals. Delete markup + `initCalculator` / `recalcSavings` / `subscriptions`. |
| Payment trust strip (`.payment-trust-strip`) | **Keep** | Move directly under the buy buttons. |
| How It Works (`#how`) | **Optional keep** | Collapse to a one-line "Credentials via WhatsApp/Email in ~5 min" near CTA. |
| Testimonials (`#reviews`) | **Remove** | "Americans Who Cut the Cable Bill" is the wrong audience for renewals. Delete markup + `renderTestimonials()`. |
| FAQ (`#faq`) | **Refocus** | Replace skeptic questions with 3–5 renewal questions. See §5. |
| Footer (`.footer`) | **Keep, slim** | Keep legal links + WhatsApp + contact. Drop "Discover" column if desired. |

**Expected effect:** scroll depth cut ~70%; two forced decisions become zero for the default buyer.

---

## 3. New page order (target layout)

```
┌─────────────────────────────────────┐
│  Logo                    [Subscribe] │   ← trimmed navbar
├─────────────────────────────────────┤
│  Renew your Fire Store subscription  │   ← minimal hero
│  Same service. Pick a plan, ~1 min.  │
│  [Renew / Subscribe]                 │   ← single CTA scrolls to plans
├─────────────────────────────────────┤
│  Plans (12-mo pre-selected, big)     │
│  1 Month · 12 Months ⭐ · 6 Months   │
│  "Change plan / add screens" ▸       │   ← collapsed device selector
│  🔒 Secure · WhatsApp · ~5 min setup │   ← trust strip under buttons
├─────────────────────────────────────┤
│  FAQ (3–5 renewal questions)         │
├─────────────────────────────────────┤
│  Footer: legal + contact             │
└─────────────────────────────────────┘
```

Implementation-wise: in `index.html`, reorder so `#plans` comes **immediately after** the hero, before (or replacing) features. Everything removed above simply gets deleted.

---

## 4. Simplify the purchase decision

### 4.1 Default + dominance
- Pre-select **1 device** and keep **12 months** as the popular/dominant card (already `.plan-card.popular`). No change needed to which card is highlighted — just make it the obvious default.
- `initDeviceSelector()` already calls `updatePriceCards(1)` — keep 1 device as default.

### 4.2 Plain device labels
- In `main.js`, change `deviceLabels` and the button text in `index.html` from cute names to plain ones:
  - `📱 Solo Viewer` → **`1 screen`**
  - `👫 Couple / Roommates` → **`2 screens`**
  - `👨‍👩‍👦 Small Family` → **`3 screens`**
  - `🏠 Full Family` → **`4 screens`**
  - `🔥 Whole Household` → **`5 screens`**
- Update `deviceLabels[n].label` to match (or remove the secondary label line entirely).

### 4.3 Collapse the device selector
- Wrap `.device-selector-container` in a collapsed `<details>` / toggle labeled **"Change plan / add screens"**, closed by default. The default (1 screen) buyer never has to touch it; switchers expand it.

### 4.4 One line per plan (not 7 bullets)
- Replace each card's `<ul class="plan-features">` (7 `<li>`) with a single summary line, e.g.
  `12 months · 1 screen · $79 · instant activation`.
- Keep the price, period, and CTA button. This removes repeated bullet walls across all three cards.

### 4.5 Deep-linking (email pre-selection) — **new code**
Support URL params so email links open with the buyer's last setup already selected and, optionally, scroll straight to plans.

- Params: `?devices=<1-5>&plan=<1|6|12>` and optional `?renew=1`.
- In `main.js`, add a small parser run inside `DOMContentLoaded`:
  - Read `devices` → call `updatePriceCards(n)` and mark the matching `.device-btn.active`.
  - Read `plan` → highlight / scroll to the matching card (`#btn-1m|6m|12m`).
  - Read `renew=1` → switch hero copy to "Welcome back" variant and auto-scroll to `#plans`.
- Validate/clamp params (devices 1–5, plan ∈ {1,6,12}); fall back to defaults on bad input.

**Optional stretch:** a single **"Renew for $79 · 12 months, 1 screen"** button with a small "Change plan" link, shown only when `?renew=1`.

---

## 5. FAQ — refocus on repeat buyers

Replace the `faqs` array in `main.js` (currently 10 skeptic-oriented Q&As). Keep **3–5** renewal questions visible:

1. How do I renew without losing my settings / login?
2. Will my username & password stay the same?
3. Can I add another screen to my existing plan?
4. My subscription expired yesterday — can I still renew?
5. How fast am I reactivated after paying? *(reuse the "~5 minutes via WhatsApp/Email" answer.)*

Keep the WhatsApp CTA (`.faq-cta`) as-is.

---

## 6. Hero copy (rewrite)

Replace `.hero-content` inner copy:

- **H1:** `Renew your Fire Store subscription`
- **Sub:** `Same service you know. Pick your plan and check out in under a minute.`
- **Single CTA:** `Renew / Subscribe` → scrolls to `#plans` (reuse `.cta-primary`).
- Remove: `#heroBadgeTicker`, `.hero-category-pills`, `.cta-secondary`, `.urgency-bar`.

The `?renew=1` variant can swap H1 to **"Welcome back"** via JS (see §4.5).

---

## 7. Fix the price inconsistency (important, do first)

**Problem:** `index.html` hardcodes `$19` (1m) / `$149` (12m) / `$89` (6m). On load, `main.js` `updatePriceCards(1)` overwrites these to the real 1-device values `$29 / $79 / $49`. During the brief pre-JS paint, and in the raw HTML/source, the numbers disagree — confusing for renewals and anyone reading the markup.

**Fix:** Make the hardcoded HTML placeholders match `pricingPlans[1]` in `main.js`:
- `#price-1m` → `$29`, `#price-6m` → `$49`, `#price-12m` → `$79`.
- `#period-12m` static text → `$6.58/month — billed once` (matches JS), `#period-6m` → `$8.10/month`.
- Confirm any price shown in email campaigns uses these same figures.

`main.js` remains the single source of truth; the HTML just shouldn't contradict it.

---

## 8. Trust elements (keep only what helps checkout)

**Keep, near the buy buttons:**
- 🔒 Secure Checkout + payment badges (`.payment-trust-strip`) — move under the plan cards.
- One line: "Credentials sent in ~5 minutes via WhatsApp or Email".
- WhatsApp support link.

**Drop / shrink:** testimonials, cord-cutter calculator, channel logo walls.

---

## 9. Navbar (trim to 2–3 links)

In `index.html` `#navLinks`, keep:
- `Subscribe` (sticky button, already present)
- `FAQ` (→ `#faq`)
- `WhatsApp` (→ `https://wa.me/12029927413`)

Remove Features, Plans (redundant — Subscribe covers it), Live & Trending, Movies & Shows, How It Works. Keep the mobile hamburger behavior (`initNavbar()`), just with fewer links.

---

## 10. Optional — two modes on one site

If some cold/organic traffic remains, avoid a second domain; branch by intent:

| Traffic | Experience |
|---|---|
| Email / `?renew=1` / returning | Minimal checkout page (this plan) |
| Organic / referral | Fuller trimmed page (keep hub + marquees) |

Implement by gating the removed sections behind a body class toggled from the `renew` param (`document.body.classList.add('renew-mode')`), with CSS `.renew-mode .games-section { display:none }` etc. Email links default to `?renew=1`. **Recommendation:** ship the minimal version first; add the dual-mode branch only if cold traffic proves material.

---

## 11. Code cleanup checklist (`main.js`)

Delete or guard (no-op safely if their DOM is gone — most already `if (!el) return`):
- [ ] `initHeroTicker()` + call
- [ ] `initUrgencyCounter()` + call
- [ ] `renderTestimonials()` + call + `testimonials` array
- [ ] `initCalculator` / `recalcSavings` / `animateCount` / `subscriptions` + calls
- [ ] Hub renderers (`renderHub`, `initHubTabs`, `renderWorldCup`, `renderMedia`, `renderUSSports`, `renderTrending`, `games`, `mediaItems`, `usSportsEvents`, `trendingItems`, `IMG`, `TMDB`) — only if hub section is removed
- [ ] `fireStoreMonthly` / `recalcSavings()` call inside `updatePriceCards` (calculator dependency)

Keep: `initNavbar`, `initScrollReveal`, `initDeviceSelector`, `updatePriceCards`, `pricingPlans`, `deviceLabels`, `renderFaq`, `initFlameCanvas` (optional — hero background).

---

## 12. Rollout — quick wins first

**Phase 1 — Quick wins (low effort, high clarity):**
1. Fix price consistency HTML ↔ JS (§7).
2. Remove fake urgency counter (§2).
3. Remove calculator + comparison table (§2).
4. Single primary CTA in hero; drop ticker + pills (§6).
5. Move `#plans` above the fold (§3).

**Phase 2 — Restructure (best fit for the model):**
6. Trim navbar (§9).
7. Plain device labels + collapse selector + one-line plans (§4.2–4.4).
8. Refocus FAQ (§5).
9. Strip testimonials + marquees; slim footer (§2).
10. Trust strip under buttons (§8).

**Phase 3 — Deep-linking & modes:**
11. URL param pre-selection + "Welcome back" variant (§4.5, §6).
12. Optional dual-mode toggle (§10).

---

## 13. Verification

- Load `/` — real prices show immediately, no flash of `$19/$149`.
- Default state: 1 screen selected, 12-month card dominant, no device decision required to buy.
- Click each plan button → correct `checkoutLink` (`pricingPlans[device][duration]`).
- Expand "Change plan" → pick 2–5 screens → prices + checkout links update.
- Visit `?devices=2&plan=12&renew=1` → 2 screens preselected, 12-mo highlighted, "Welcome back" hero, auto-scrolled to plans.
- Mobile: hamburger opens trimmed nav; layout holds at 375px.
- FAQ accordion opens/closes; WhatsApp link works.
- Removed sections leave no console errors (guarded init calls).
```
