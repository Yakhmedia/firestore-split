# Implementation Plan: Live & Trending Content Refresh (June 28, 2026)

Refresh the **Live & Trending** hub on the Fire Store homepage so all four tabs, the hero ticker, and the countdown reflect real US-audience events for **Sunday, June 28, 2026**.

**Context:** Content is currently frozen on **June 20** (group stage). The tournament has moved to the **Round of 32** (knockouts start June 28). Several cards show false `LIVE` badges for events that ended over a week ago.

**Scope:** Data-only refresh in `main.js` + hero default text in `index.html`. No layout or CSS changes required (optional badge colors noted below).

**Files touched:**
- [main.js](main.js) — all hub data arrays, hero ticker, countdown target
- [index.html](index.html) — hero ticker default string (fallback before JS loads)

---

## Master Checklist

### Phase 1 — Data arrays (`main.js`)

- [ ] **1.1** Update `trendingItems` (8 cards) — knockout World Cup headline, summer sports, fixed LIVE flags
- [ ] **1.2** Update `games` (4 cards) — Round of 32 fixtures (Jun 28–30), replace group-stage entries
- [ ] **1.3** Update `usSportsEvents` (5 cards) — MLB, Wimbledon, Women's PGA, NASCAR; remove expired Jun 20 events
- [ ] **1.4** Update `mediaItems` (6 cards) — fix release years, verify TMDB poster paths
- [ ] **1.5** Add optional `IMG` keys (`tennis`, `nascar`) for new US Sports banners

### Phase 2 — Hero sync

- [ ] **2.1** Update `initHeroTicker()` rotation items (6 strings) to match new trending stories
- [ ] **2.2** Update hero ticker default text in `index.html` (`#tickerText`)
- [ ] **2.3** Retarget `WORLD_CUP_DATE` countdown to **World Cup Final** (July 19, 2026) instead of kickoff (June 11)

### Phase 3 — QA & deploy

- [ ] **3.1** Run `npm run dev` and verify all 4 hub tabs render correctly
- [ ] **3.2** Confirm only genuinely live/upcoming events have LIVE badges
- [ ] **3.3** Check browser console for broken TMDB / Unsplash / flagcdn images
- [ ] **3.4** Test tab switching and horizontal slider on mobile viewport
- [ ] **3.5** Deploy to [fire-store.tv](https://fire-store.tv) and spot-check production

---

## Detailed Changes

### 1.1 — `trendingItems` (Trending Today tab)

Replace the full array. **Rule:** Only set `isLive: true` for events actually airing on June 28.

| Rank | Category | Title | Description | Image | Live? |
|------|----------|-------|-------------|-------|-------|
| 1 | World Cup 2026 | South Africa vs Canada | Round of 32 · Live now · SoFi Stadium, LA | `IMG.soccer` | ✅ |
| 2 | Live Sport | Wimbledon · Round of 16 | Men's & Women's · Live today on ESPN | `IMG.tennis` * | ✅ |
| 3 | Live Sport | Dodgers vs Padres | MLB · 8:10 PM ET · NBC / Peacock | `IMG.mlb` | ✅ |
| 4 | World Cup 2026 | Brazil vs Japan | Round of 32 · Mon Jun 29 · Houston Stadium | `IMG.soccer` | ❌ |
| 5 | Live Sport | Yankees vs Red Sox | MLB · 7:20 PM ET · NBC / Peacock | `IMG.mlb` | ✅ |
| 6 | Trending Series | House of the Dragon | Season 3 · New episode now on HBO | `IMG.drama` | ❌ |
| 7 | Live Sport | Women's PGA Championship | Final Round · Live on NBC | `IMG.golf` | ✅ |
| 8 | New Release | Deadpool & Wolverine | Now streaming on Disney+ — watch now | `IMG.cinema` | ❌ |

> *\* Add `tennis` to the `IMG` object (see §1.5). Until added, fallback to `IMG.nba`.*

**Remove from trending:** UFC Kape/Horiguchi, U.S. Open Day 3, Germany vs Ivory Coast, Netherlands vs Sweden (all Jun 20 / expired).

---

### 1.2 — `games` (World Cup 2026 tab)

Replace group-stage matches with **Round of 32** fixtures. Reuse the existing `group` field for the round badge (renders as `.game-group-badge`).

| Team 1 | Team 2 | flag1 | flag2 | color1 | color2 | Date | Time (ET) | Stadium | Status | Badge |
|--------|--------|-------|-------|--------|--------|------|-----------|---------|--------|-------|
| South Africa | Canada | `za` | `ca` | `#007A4D` | `#FF0000` | Jun 28, 2026 | 3:00 PM ET | SoFi Stadium, LA | `live` | ROUND OF 32 |
| Brazil | Japan | `br` | `jp` | `#009C3B` | `#BC002D` | Jun 29, 2026 | 1:00 PM ET | NRG Stadium, Houston | `upcoming` | ROUND OF 32 |
| Germany | Paraguay | `de` | `py` | `#000000` | `#D52B1E` | Jun 29, 2026 | 4:30 PM ET | Gillette Stadium, Boston | `upcoming` | ROUND OF 32 |
| Mexico | Ecuador | `mx` | `ec` | `#006847` | `#FFD100` | Jun 30, 2026 | 9:00 PM ET | Estadio Azteca, Mexico City | `upcoming` | ROUND OF 32 |

**Why these four:** Today's US-headline match (Canada), next day's marquee (Brazil), strong US/Europe draw (Germany), host-nation knockout (Mexico).

---

### 1.3 — `usSportsEvents` (US Sports tab)

Replace all Jun 20–21 entries. **Rule:** `status: 'live'` only for events on June 28.

| League | Team 1 | Team 2 | Date | Network | Stadium | Status | Image |
|--------|--------|--------|------|---------|---------|--------|-------|
| `mlb` | Dodgers | Padres | Sun, Jun 28 · 8:10 PM ET | NBC / Peacock | Petco Park, San Diego | `live` | `IMG.mlb` |
| `mlb` | Yankees | Red Sox | Sun, Jun 28 · 7:20 PM ET | NBC / Peacock | Fenway Park, Boston | `live` | `IMG.mlb` |
| `mlb` | Braves | Giants | Sun, Jun 28 · 8:05 PM ET | ESPN | Oracle Park, San Francisco | `live` | `IMG.mlb` |
| `tennis` * | Wimbledon | Round of 16 | Sun, Jun 28 · All day | ESPN / ESPN2 | All England Club, London | `live` | `IMG.tennis` |
| `golf` | Women's PGA | Final Round | Sun, Jun 28 · Live | NBC | Hazeltine National, MN | `live` | `IMG.golf` |

> *\* `tennis` league badge has no dedicated CSS color yet — it still renders with the base badge style. Optional: add `.sport-league-badge.tennis` in `styles.css`.*

**Remove:** UFC Kape/Horiguchi, U.S. Open Round 3, Dodgers vs Giants (wrong date/venue), Fever vs Sky.

---

### 1.4 — `mediaItems` (Movies & TV Shows tab)

Fix metadata errors and align posters with TMDB paths from the prior plan.

| Title | Type | Meta (fix) | Network | Poster path |
|-------|------|------------|---------|-------------|
| House of the Dragon | series | Season 3 · Fantasy Drama | HBO | `/z2yahl2uefxDCl0nogcRBstwruJ.jpg` |
| The Bear | series | Final Season · Comedy Drama | Hulu | `/w9PThR563m8H8mHhHkP4s7q3o48.jpg` |
| Shōgun | series | Season 2 · Historical Epic | Hulu | `/7W5u625JHD4Lz6J732tLIHiuR7c.jpg` |
| Deadpool & Wolverine | movie | **2024** · Marvel Action *(was 2026)* | Disney+ | `/8cdWjvZqMSd2fWlhyQ7gaJLF3Su.jpg` |
| Inside Out 2 | movie | **2024** · Pixar Animation *(was 2026)* | Disney+ | `/vpnVM9B6NMmS40b4gLTXCH5ptQ6.jpg` |
| The Boys | series | Season 4 · Superhero Satire | Amazon Prime | `/7c96lRGaG5WDWc4xaR7t58glvJu.jpg` |

**Checklist per item:**
- [ ] Correct `meta` year (2024 for films, season labels for series)
- [ ] Poster URL loads in browser (open `${TMDB}/<path>` directly)
- [ ] Gradient `bg` fallback still looks acceptable if poster fails

---

### 1.5 — `IMG` object additions (optional but recommended)

Add to the `IMG` constant in `main.js`:

```js
tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
nascar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
```

---

### 2.1 — Hero ticker (`initHeroTicker()` in `main.js`)

Replace the `items` array with:

```js
const items = [
  '⚽ World Cup 2026 · South Africa vs Canada · Live Now',
  '🎾 Wimbledon · Round of 16 · Live Today on ESPN',
  '⚾ MLB · Dodgers vs Padres · Tonight in 4K',
  '⚽ World Cup 2026 · Brazil vs Japan · Mon Jun 29',
  '⛳ Women\'s PGA Championship · Final Round Live',
  '📺 House of the Dragon S3 · New Episode on HBO',
];
```

---

### 2.2 — Hero default text (`index.html`)

Update `#tickerText` fallback (line ~70):

```html
<span id="tickerText">⚽ World Cup 2026 · South Africa vs Canada · Live Now</span>
```

---

### 2.3 — Countdown retarget (`main.js`)

**Problem:** `WORLD_CUP_DATE` points to June 11 (kickoff). The tournament is already live — the timer either shows zero or a generic "LIVE NOW" message with no forward urgency.

**Change:**

```js
// Before
const WORLD_CUP_DATE = new Date('2026-06-11T16:00:00Z');

// After — countdown to World Cup Final
const WORLD_CUP_DATE = new Date('2026-07-19T19:00:00Z'); // Jul 19, 2026 · MetLife Stadium
```

**Optional copy tweak** in `updateCountdown()` when `diff <= 0`: change message from "THE WORLD CUP IS LIVE NOW!" to "🔥 KNOCKOUT STAGE IS LIVE — FINAL JULY 19!" so it stays useful through the whole tournament.

---

## Optional Enhancements (out of scope unless requested)

- [ ] Add `.sport-league-badge.tennis` and `.sport-league-badge.nascar` colors in `styles.css`
- [ ] Use TMDB backdrop images for trending sports cards instead of Unsplash stock
- [ ] Add a `lastUpdated` comment at top of each data block for future refreshes
- [ ] Schedule monthly content refresh (manual process — no CMS exists)

---

## Verification Checklist

### Local (`npm run dev` → `http://localhost:3000`)

#### Trending Today (default tab)
- [ ] 8 cards render in rank order (#1–#8)
- [ ] Cards #1, #2, #3, #5, #7 show red LIVE badge
- [ ] Cards #4, #6, #8 show "▶ Watch Now →" (no LIVE badge)
- [ ] No references to "Jun 20", "Group Stage", Kape/Horiguchi, or U.S. Open Day 3

#### Movies & TV Shows
- [ ] 6 poster cards load (check Network tab for 200 responses from `image.tmdb.org`)
- [ ] Deadpool & Inside Out 2 show **2024** in meta, not 2026

#### US Sports
- [ ] 5 cards — 3 MLB, 1 Wimbledon, 1 Women's PGA
- [ ] All dates say **Sun, Jun 28**
- [ ] LIVE badges on all 5 (all airing today)
- [ ] No UFC or U.S. Open cards

#### World Cup 2026
- [ ] 4 cards with **ROUND OF 32** badge (not GROUP X)
- [ ] South Africa vs Canada shows LIVE NOW badge
- [ ] Flag images load from `flagcdn.com` (`za`, `ca`, `br`, `jp`, `de`, `py`, `mx`, `ec`)

#### Hero
- [ ] Ticker rotates every 4s through 6 new items
- [ ] Countdown counts down to **July 19, 2026** (~21 days from Jun 28)
- [ ] "See What's Live" CTA scrolls to hub section

#### Mobile
- [ ] Hub tabs wrap or scroll without breaking layout
- [ ] Cards swipe/scroll horizontally in slider
- [ ] LIVE badges don't overlap rank numbers

### Production ([fire-store.tv](https://fire-store.tv))
- [ ] Hard refresh (Ctrl+Shift+R) shows updated content
- [ ] Same checks as local for all 4 tabs + hero

---

## Reference — Current vs Target Summary

| Area | Current (stale) | Target (Jun 28) |
|------|-----------------|-----------------|
| World Cup phase | Group Stage · Jun 20 | Round of 32 · Jun 28–30 |
| Headline match | Germany vs Ivory Coast | South Africa vs Canada |
| False LIVE badges | 5 on Trending tab | 5 only for today's events |
| US Sports | UFC, U.S. Open, Jun 20 MLB | MLB + Wimbledon + Women's PGA |
| Movie years | Deadpool/Inside Out labeled 2026 | Corrected to 2024 |
| Hero ticker | Jun 20 fixtures | Jun 28 knockout + summer sports |
| Countdown | World Cup kickoff (passed) | World Cup Final (Jul 19) |

---

## Maintenance Note

All hub content is **static** in `main.js`. After this refresh, plan to update `trendingItems`, `usSportsEvents`, and `games` every **1–2 weeks** during the World Cup knockout stage, or whenever LIVE badges would become misleading.

Suggested next refresh triggers:
- **July 1** — USA Round of 32 match (USA vs Bosnia and Herzegovina)
- **July 4–7** — Round of 16
- **July 19** — Final (retire countdown, switch hero to post-tournament messaging)
