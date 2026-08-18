# Implementation Plan: Landing Page Update — US Trends, August 2026

Align the Fire Store homepage with what US audiences are actually searching for and buying **right now (August 18, 2026)**: the start of football season, the 2026 broadcast-rights fragmentation, and streaming price inflation.

**Context:** The homepage is currently season-neutral. The old *Live & Trending* hub was removed in the simplified checkout-first rebuild — `main.js` no longer contains `trendingItems`, `usSportsEvents`, `mediaItems`, `games`, the hero ticker, or the countdown. The page reads the same on August 18 as it would in April, while the single biggest US streaming moment of the year is **11 days away**.

**Scope:** Copy, one new section, one revived section, a countdown, and a data-driven fix to the savings badge. No checkout/widget changes, no pricing changes, no product-ID changes.

**Files touched:**
- [index.html](index.html) — hero, plans header, new "Where Are The Games" section, trending band, channel strip
- [main.js](main.js) — countdown module, trending band data, savings badge wiring, 2 new FAQ entries
- [styles.css](styles.css) — new section styles (partly reclaimed from orphaned blocks)

---

## Trend Basis (verified Aug 18, 2026)

| Trend | Fact | Where it lands |
|---|---|---|
| Football is back | CFB Week 0 **Aug 29** (11 days); NFL kickoff **Wed Sept 9**, Seahawks–Patriots on NBC/Peacock, SB LX rematch | Hero + countdown |
| Fragmentation | NFL 2026 spread over CBS/Paramount+, NBC/Peacock, FOX, ABC/ESPN Unlimited, NFL Network, Prime Video, Sunday Ticket **and Netflix** — six channels, four streaming platforms | New Section 3C |
| Rights shuffle | UFC off PPV → Paramount+/CBS; NBA opening night **Oct 20** on NBC/Peacock | Section 3C + channel strip |
| Streamflation | 20 services raised prices in 2026; avg US household ≈ **$77/mo / $924/yr**; Netflix standard $19.99 | Plans price anchor |
| Fall calendar | Noche UFC Sept 12 · UFC 331 Sept 19 · MLB → World Series Oct · NBA Oct 20 | Trending band |

---

## Master Checklist

### Phase 1 — Hero seasonal swap (P1)

Target: [index.html:92-116](index.html:92)

- [ ] **1.1** Replace hero badge text at [index.html:98](index.html:98)
  - From: `🔥 Trusted by thousands of streamers`
  - To: `🏈 Football season starts in <span id="heroCountdownDays">11</span> days` (JS-driven, see 2.2)
- [ ] **1.2** Replace `<h1>` at [index.html:100-103](index.html:100)
  - From: `Live TV, Movies & Sports — One Subscription`
  - To: `Every Game. Every Network. One Subscription.`
- [ ] **1.3** Replace `.hero-sub` at [index.html:105-108](index.html:105)
  - To: `<strong>NFL, college football, NBA and UFC</strong> — 100,000+ channels in 4K. New or renewing, you're live in under a minute.`
- [ ] **1.4** Insert countdown block between `.hero-ctas` ([index.html:109](index.html:109)) and `.hero-trust-line` ([index.html:112](index.html:112)):
  ```html
  <div class="hero-countdown" id="heroCountdown" hidden>
    <span class="hc-label" id="hcLabel">College Football Week 0</span>
    <span class="hc-clock" id="hcClock">—</span>
  </div>
  ```
  Rendered `hidden` until JS fills it, so no layout flash before the script runs.
- [ ] **1.5** Keep the "Trusted by thousands" line — move it into `.hero-trust-line` at [index.html:112](index.html:112) so the social proof is not lost:
  `🔒 Secure checkout · Trusted by thousands of streamers · Credentials in ~5 minutes`

### Phase 2 — Countdown module (`main.js`)

- [ ] **2.1** Add a `SEASON_EVENTS` array near the top of `main.js`, after `pricingPlans`:
  ```js
  const SEASON_EVENTS = [
    { label: 'College Football Week 0', date: '2026-08-29T15:00:00-04:00' },
    { label: 'NFL Kickoff — Seahawks vs Patriots', date: '2026-09-09T20:20:00-04:00' },
    { label: 'NBA Opening Night', date: '2026-10-20T19:00:00-04:00' },
  ];
  ```
- [ ] **2.2** Add `initSeasonCountdown()`:
  - Picks the first event in `SEASON_EVENTS` still in the future — the hero **auto-rolls** from CFB → NFL → NBA with no redeploy.
  - Writes days into `#heroCountdownDays` (badge) and `Xd Xh Xm` into `#hcClock`; label into `#hcLabel`.
  - Unhides `#heroCountdown`; ticks on a 60s interval (seconds precision is noise at this range).
  - If all events are past, hide the countdown and fall back to the original badge text — **fails closed, never shows a negative or stale count**.
- [ ] **2.3** Register `initSeasonCountdown()` in the `DOMContentLoaded` block at [main.js:348](main.js:348).

### Phase 3 — "Where Are The Games?" section (P2) — highest-intent addition

New **Section 3C**, inserted in [index.html](index.html) between the plans section (ends ~line 230) and the shop cross-sell (`<section class="shop-section" id="shop">` at [index.html:234](index.html:234)). Placed *after* pricing so it reinforces a decision already in progress rather than delaying it.

- [ ] **3.1** Build the section shell using the existing `.section-header` / `.section-tag` pattern:
  - Tag: `🏈 2026 Season`
  - H2: `This Season Your Games Are On 10 Different Services.`
  - Sub: `Or one. Fire Store carries every network below — no app-hopping, no juggling logins.`
- [ ] **3.2** Add a `.games-map-grid` of 8 tiles (network → what it has this season):

  | Tile | Copy |
  |---|---|
  | NBC / Peacock | Sunday Night Football · NFL Kickoff · NBA Opening Night |
  | Prime Video | Thursday Night Football |
  | CBS / Paramount+ | Sunday afternoon NFL · **UFC — now included, no PPV** |
  | ESPN / ABC | Monday Night Football · Super Bowl 61 |
  | Netflix | Week 1 Australia · Thanksgiving Eve · Christmas Day |
  | NFL Network | RedZone · Thursday doubleheaders |
  | Sunday Ticket | Out-of-market Sunday games |
  | BTN / SEC Network | College football Saturdays |

- [ ] **3.3** Closing line under the grid, linking to plans:
  `Ten subscriptions to follow one season. Or one Fire Store plan → <a href="#plans">See plans</a>`
- [ ] **3.4** Style `.games-map-grid` in `styles.css` — 4×2 desktop, 2×4 tablet, 1-col mobile. Reuse `.shop-card` visual language ([styles.css:3360](styles.css:3360)): `--bg-card`, `--border`, hover lift + orange border. Add as a new marked block at the end of the file, consistent with existing section comment banners.
- [ ] **3.5** Add `reveal` class to the header and grid so it picks up the existing `initScrollReveal()` observer.

### Phase 4 — Streamflation price anchor (P3)

- [ ] **4.1** Rewrite the plans sub-line at [index.html:126](index.html:126)
  - From: `No hidden fees. Cancel anytime. Instant activation via WhatsApp or Email.`
  - To: `No hidden fees. No auto-renew. Instant activation via WhatsApp or Email.`
  - **Rationale:** 6- and 12-month plans are billed once upfront — there is nothing to cancel, so "Cancel anytime" is inaccurate. "No auto-renew" is both true *and* a sharper contrast against the subscriptions being anchored against.
- [ ] **4.2** Insert an anchor strip directly above the device selector ([index.html:131](index.html:131)):
  ```html
  <p class="price-anchor reveal">
    The average US household now spends <strong>$924 a year</strong> on streaming.
    Fire Store is <strong id="anchorPrice">$79</strong>.
  </p>
  ```
- [ ] **4.3** Replace the static savings badge at [index.html:175](index.html:175) with an addressable node:
  - From: `<div class="plan-savings">🔥 Save 50% — Full Year</div>`
  - To: `<div class="plan-savings" id="savings-12m">🔥 Save 50% — Full Year</div>`
- [ ] **4.4** ⚠️ **Correctness fix** — `updatePriceCards()` at [main.js:231](main.js:231) updates prices and periods but **never touches `.plan-savings`**. The "Save 50%" badge is hardcoded and stays frozen while the user changes screen count. Extend `updatePriceCards()` to also set:
  ```js
  set('savings-12m', `🔥 $${p12.monthly.toFixed(2)}/mo — less than one streaming service`);
  set('anchorPrice', `$${p12.price}`);
  ```
  This keeps both the badge and the `$924` anchor honest across all 5 screen tiers (12mo ranges $79 → $289), instead of asserting `$79` while a 5-screen plan is selected. Concrete monthly cost also converts better than a percentage.
- [ ] **4.5** Style `.price-anchor` — centered, muted body text, `--fire-gold` on the `<strong>` values, ~24px bottom margin.

### Phase 5 — Channel strip refresh (P4)

Target: [index.html:331-352](index.html:331)

- [ ] **5.1** Add 6 tiles to `.channel-strip`, matching the existing `--accent` inline-var pattern:
  - `Peacock` `#000000` · `Prime Video` `#00A8E1` · `ESPN Unlimited` `#d00404`
  - `CBS Sports` `#0033a0` · `Big Ten Network` `#0088ce` · `SEC Network` `#004b8d`
- [ ] **5.2** Verify the strip still wraps cleanly at 16 tiles on mobile (was built for 10) — cap to 12 on `<480px` via `nth-child` if it goes ragged.
- [ ] **5.3** Sanity check: the strip currently lists NBA TV but **not** Peacock, while NBA opening night Oct 20 is on NBC. 5.1 closes that gap.

### Phase 6 — Seasonal FAQ entries (P5)

Target: `faqNewHere` at [main.js:48-62](main.js:48)

- [ ] **6.1** Append: **"Can I watch every NFL game this season?"**
  - A: Names the networks carried (NBC, CBS, FOX, ESPN/ABC, NFL Network, Prime, Netflix windows) framed as *"all in one place, instead of ten apps"* — see Phase 8 on claim wording.
- [ ] **6.2** Append: **"Do I get NBA on NBC and UFC on Paramount+?"**
  - A: Notes NBA moved to NBC/Peacock for 2026-27 (Oct 20 tip-off) and UFC left PPV for Paramount+/CBS — both carried, no separate purchase.
- [ ] **6.3** No render changes needed — `renderFaq()` at [main.js:94](main.js:94) iterates the arrays.

### Phase 7 — Trending band (P6)

A single horizontal strip of upcoming events. **Not** a revival of the four-tab hub — one row, one data array, refreshed monthly.

- [ ] **7.1** Add `upcomingEvents` to `main.js` — 6 entries: `{ date, title, network }`
  - Aug 29 · CFB Week 0 · NBC/Peacock
  - Sept 9 · NFL Kickoff: Seahawks vs Patriots · NBC/Peacock
  - Sept 12 · Noche UFC · Paramount+
  - Sept 19 · UFC 331: Van vs Pantoja 2 · Paramount+
  - October · MLB Postseason → World Series · FOX
  - Oct 20 · NBA Opening Night · NBC
- [ ] **7.2** Render into a `.trending-band` placed directly under the hero, above the plans section.
- [ ] **7.3** Auto-hide entries whose date has passed — same guard as the countdown, so the band degrades to fewer cards rather than showing stale dates. **No `LIVE` badges** (the June 28 refresh had to fix false-LIVE flags on week-old events — do not reintroduce that failure mode).
- [ ] **7.4** Reclaim the orphaned `.games-slider` CSS at [styles.css:659](styles.css:659) for horizontal scroll + edge fades rather than writing new rules.

### Phase 8 — Claim safety pass

- [ ] **8.1** Review all new copy for rights-claim strength. Frame the value as **"one place instead of ten apps"** rather than **"we give you every NFL game."** The Phase 3 section converts equally well on the convenience frame and carries materially less exposure with ad platforms and payment processors.
- [ ] **8.2** Confirm no new copy contradicts the existing FAQ position at [main.js:50](main.js:50) ("premium reseller of licensed streaming content").
- [ ] **8.3** Confirm no remaining "Cancel anytime" instances site-wide: `grep -rn "Cancel anytime" *.html *.js`

---

## Verification Plan

### Manual QA (`npm run dev` → http://localhost:3000)

- [ ] **V1** Hero countdown shows a correct, positive day count to Aug 29; badge and clock agree.
- [ ] **V2** Temporarily set the system clock (or edit `SEASON_EVENTS`) past Aug 29 → countdown rolls to NFL Kickoff without a redeploy. Past Oct 20 → countdown hides cleanly, no negative values.
- [ ] **V3** Click through all 5 screen counts: price, period, screens bullet, **savings badge**, and **`$924` anchor price** all update together. (Badge was previously frozen — this is the regression to watch.)
- [ ] **V4** Checkout still opens the popup widget for all 15 plan combinations; `data-product-id` unchanged.
- [ ] **V5** "Where Are The Games" grid: 4×2 at 1280px, 2×4 at 768px, 1-col at 375px.
- [ ] **V6** Channel strip wraps cleanly at 16 tiles on 375px.
- [ ] **V7** Both new FAQ entries expand/collapse correctly in the "New here?" group.
- [ ] **V8** Trending band scrolls horizontally on mobile; no past-dated cards.
- [ ] **V9** Scroll-reveal fires on all new sections (they must carry `.reveal`).
- [ ] **V10** Browser console clean; no CLS from the countdown appearing late.

### Deploy

- [ ] **D1** `npm run build`, spot-check `dist/index.html`
- [ ] **D2** Deploy to [fire-store.tv](https://fire-store.tv), verify countdown against real US Eastern time
- [ ] **D3** Re-check the countdown on **Aug 29** and **Sept 9** — the two auto-roll boundaries

---

## Sequencing

| Order | Phase | Why |
|---|---|---|
| 1 | Phase 1, 2, 4 | Highest impact, contained edits, hits the 11-day window |
| 2 | Phase 3 | Biggest build; the differentiator |
| 3 | Phase 5, 6 | Cheap consistency + SEO catch |
| 4 | Phase 7 | Nice-to-have; skip if the window is tight |
| 5 | Phase 8 | Gate before deploy |

**Phases 1, 2 and 4 alone are shippable** and capture most of the seasonal lift. Phase 4.4 should ship regardless of the campaign — the frozen savings badge is a live bug today.

---

## Maintenance Note

The June 2026 refresh ([IMPLEMENTATION_LIVE_TRENDING_JUN28.md](IMPLEMENTATION_LIVE_TRENDING_JUN28.md)) needed a full data rewrite because content was frozen on a hardcoded date. This plan avoids that: the countdown (2.2) and trending band (7.3) both **self-expire**, so the page ages into a neutral state instead of a wrong one. Add new entries to `SEASON_EVENTS` and `upcomingEvents` roughly monthly — Super Bowl 61, March Madness, and MLB Opening Day are the next US anchors after this slate.

---

## Sources

- [NBC Sports — 2026 NFL season start](https://www.nbcsports.com/nfl/news/when-does-the-2026-nfl-season-start-schedule-tv-channel-live-stream-week-1-matchups)
- [NCAA.com — 2026 college football start](https://www.ncaa.com/news/football/article/2026-06-01/college-football-schedule-when-does-2026-college-football-season-start)
- [Yahoo Sports — how to watch every 2026-27 NFL game](https://sports.yahoo.com/nfl/article/how-to-watch-every-football-game-of-the-2026-27-nfl-season-015500642.html)
- [NBA.com — 2026-27 regular season schedule](https://www.nba.com/news/2026-27-nba-regular-season-schedule)
- [CBS Sports — UFC / Paramount rights deal, PPV ends 2026](https://www.cbssports.com/mma/news/ufc-paramount-announce-landmark-media-rights-agreement-in-exclusive-partnership-nixing-ppv-model)
- [Yahoo Finance — streamflation, $924/yr household spend](https://finance.yahoo.com/media-advertising/articles/streamflation-real-average-household-now-165015140.html)
- [Tom's Guide — cost of streaming 2026](https://www.tomsguide.com/entertainment/streaming/the-cost-of-streaming-in-2026-what-were-paying-now-vs-5-years-ago-and-how-to-save-money)
