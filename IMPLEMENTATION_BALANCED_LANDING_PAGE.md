# Implementation Plan — Balanced Landing Page (Checkout-First + Referral-Ready)

**Date:** 2026-07-04
**Files touched:** `index.html`, `main.js`, `styles.css`
**Builds on:** `IMPLEMENTATION_SIMPLE_LANDING_PAGE.md` (already implemented)
**Goal:** Fix the "too raw" feel of the stripped page. Keep the checkout-first structure for email/renewal buyers, but add back a *trimmed* sales layer below the plans so a new visitor arriving via referral can still be convinced and buy.

---

## 0. Principle

One page, ordered for warm traffic, with a light selling layer below the fold:

- **Email / renewal traffic** → deep-links (`?devices=&plan=&renew=1`) land at plans, buy, never scroll further.
- **Referral / new visitors** → land on a neutral hero, scroll past plans into a short "why / what / how" layer that closes them.

No dual-mode, no second domain. ~5 screens of scroll (old page was ~12).

---

## 1. Target page order

```
1. Navbar (trimmed — unchanged)
2. Hero — neutral copy, works for both audiences   ← REWRITE
3. Plans + device selector (always visible — changed from collapsed per user decision)
4. Payment trust strip (unchanged)
5. Compact "Why Fire Store" strip — 3 icons, 1 row ← NEW
6. Static channel logo strip — 1 row, no marquee   ← NEW
7. "How it works" — 3 steps, 1 compact row         ← NEW
8. FAQ — two groups: "New here?" + "Renewing?"     ← EXPAND
9. Footer (slim — unchanged)
```

**Stays dead (do not restore):** fake urgency counter, cord-cutter calculator, comparison table, Live & Trending hub, testimonials carousel, dual scrolling marquees, 6-card feature grid, hero ticker, category pills.

---

## 2. Hero — neutral copy (`index.html`)

Current H1 "Renew your Fire Store subscription" confuses first-time visitors. Replace with audience-neutral copy; the `?renew=1` JS variant keeps the personal version for email traffic.

- [x] H1 → `Live TV, Movies & Sports — One Subscription`
- [x] Sub → `100,000+ channels in 4K. New or renewing — you're live in under a minute.`
- [x] CTA text → `⚡ Choose Your Plan` (still scrolls to `#plans`)
- [x] Add one static badge where the ticker used to be: `🔥 Trusted by thousands of streamers` (reuse existing `.hero-badge` style — already in `styles.css`, currently unused)
- [x] Keep the trust line (`🔒 Secure checkout · Credentials in ~5 minutes…`)
- [x] Keep `hero-minimal` sizing (78vh) — do not go back to 100vh
- [x] `?renew=1` variant in `main.js` still swaps H1 → `Welcome back` + renewal sub (verified — `#heroTitle` / `#heroSub` ids unchanged, no JS edits needed)
- [x] Update `<title>` / meta description to neutral copy (sell + renew, not renew-only)

---

## 3. Plan cards — 3 bullets instead of 1 line (`index.html` + `main.js`)

The single summary line is too thin for a stranger deciding what $79 buys.

- [x] Replace `.plan-summary` single line with a short 3-item list per card:
  - `100,000+ channels · 4K`
  - `<strong>N screen(s)</strong> at the same time`
  - `Instant activation via WhatsApp / Email`
- [x] Keep it visually compact (reuse/trim existing `.plan-features` styles or style a new `.plan-mini-features` — max 3 lines, small font)
- [x] Update `updatePriceCards()` in `main.js`: replace the `summary-{suffix}` update with the screens-line update (only the middle bullet changes with device count)
- [x] Keep ids stable per card (`mini-screens-1m/6m/12m` or similar) so JS stays simple
- [x] Device selector, pricing data, checkout links — unchanged

---

## 4. NEW — Compact "Why Fire Store" strip (`index.html` + `styles.css`)

One row, three items, directly below the trust strip (inside or after `#plans`).

- [x] Markup: section `.why-strip` with 3 items (icon + one line each):
  - `📺 100,000+ channels & 4K HDR`
  - `🛡️ Anti-freeze guarantee — no buffering on game day`
  - `💬 24/7 WhatsApp support — real humans, ~2 min reply`
- [x] CSS: single flex/grid row, wraps to column on mobile (<720px)
- [x] Reuse existing card aesthetic (border `var(--border)`, subtle bg) — not the old 6-card grid

---

## 5. NEW — Static channel logo strip (`index.html` + `styles.css`)

Answers "what do I actually get?" for new visitors. One row, no animation.

- [x] Markup: section `.channel-strip` with ~10 text logos (reuse `.channel-logo` style + `--accent` colors from git history): ESPN, FOX Sports, NBC Sports, NFL Network, NBA TV, HBO/Max, Netflix, Disney+, Hulu, Paramount+
- [x] One caption line: `+ thousands more: news, kids, international, PPV & local channels`
- [x] CSS: single centered flex row, `flex-wrap: wrap` (no marquee animation, no duplicate sets, no `aria-hidden` clones)
- [x] Do NOT restore `.marquee-track` animation

---

## 6. NEW — "How it works" 3-step strip (`index.html`)

Cheap reassurance for first-time buyers. Reuse the old `#how` section content, compacted.

- [x] Markup: section `#how` with 3 steps in one row (reuse existing `.steps-grid` / `.step` styles already in `styles.css`):
  1. `🎯 Pick your plan` — 1, 6, or 12 months
  2. `💳 Secure checkout` — card, PayPal, or crypto
  3. `🔥 Instant access` — credentials via WhatsApp/Email in ~5 min
- [x] Shorter copy than the original (one line per step, no paragraphs)

---

## 7. FAQ — two groups (`main.js` + `index.html`)

- [x] Restructure `faqs` data into two labeled groups:
  - **New here?** (3 Qs — pull answers from git history):
    1. Is Fire Store legal and safe to use?
    2. Which devices work with Fire Store? (Firestick, Smart TV, iOS/Android, Roku…)
    3. Can I test it before buying? (free 24h trial via WhatsApp)
  - **Renewing?** (the 5 existing renewal Qs — keep as-is)
- [x] `renderFaq()`: render a small group heading (`.faq-group-label`) before each group; accordion behavior unchanged
- [x] CSS: minimal style for `.faq-group-label` (small caps, muted, matches `.device-selector-label` look)
- [x] Section header copy → neutral: e.g. tag `Quick Answers`, H2 `Questions? Answered.`
- [x] Keep WhatsApp CTA block unchanged

---

## 8. Navbar (minor)

- [x] Optional: add `Why Fire Store` link (→ `.why-strip` anchor, e.g. `#why`) between FAQ and WhatsApp — max 3 links total
- [x] Everything else unchanged (Subscribe button, hamburger)

---

## 9. Verification checklist

**Warm / email path:**
- [x] `/?devices=2&plan=12&renew=1` → "Welcome back" hero, 2 screens preselected, selector open, 12-mo highlighted ✓ (auto-scroll unverifiable in preview harness — needs one manual browser check)
- [x] `/?renew=1` alone → "Welcome back", 1 screen default ✓ (same scroll caveat)
- [x] Plan buttons → correct `firepay.shop` checkout links for every device × duration combo

**Cold / referral path:**
- [x] `/` (no params) → neutral hero, no auto-scroll, plans visible within one scroll
- [x] Scroll below plans → why-strip, logo strip, how-it-works, FAQ all render
- [x] New-visitor FAQ group answers safety/devices/trial questions

**General:**
- [x] Prices match `pricingPlans` in both raw HTML and after JS init (no flash of wrong numbers)
- [x] Device switch 1→5 updates prices, screens bullet, and checkout links on all 3 cards
- [x] No console errors; no references to removed sections
- [x] Mobile 375px: hero, plan cards stack, why-strip stacks, logo strip wraps, hamburger works
- [x] Total scroll depth ≈ 5 screens desktop

---

## 10. Execution order

1. [x] §2 Hero copy + static badge
2. [x] §3 Plan card bullets + `updatePriceCards()` change
3. [x] §4 Why strip (markup + CSS)
4. [x] §5 Channel logo strip (markup + CSS)
5. [x] §6 How-it-works strip
6. [x] §7 FAQ groups (data + renderer + CSS)
7. [x] §8 Navbar link (optional)
8. [x] §9 Full verification pass in preview
