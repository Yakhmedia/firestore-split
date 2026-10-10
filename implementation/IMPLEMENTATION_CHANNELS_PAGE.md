# Implementation Plan — Channels Page (Full Server Lineup Browser)

**Date:** 2026-07-04
**Files touched:** `channels.html` (new), `channels.js` (new), `scripts/build-channels.js` (new), `public/data/channels/*.json` (generated), `styles.css`, `index.html` (links), `vite.config.js`, `package.json`
**Source data:** `C:\Users\khalo\Downloads\firestore_server_channels_by_country.csv` (228,536 rows / 23.7 MB) + `firestore_server_channel_categories_summary.csv`
**Goal:** A public, searchable channels page showing everything on the server — full channel names for Live TV, category + count summaries for Movies/Series — without ever shipping the 23.7 MB CSV to the browser.

---

## 0. Data facts (drive every decision below)

| Content type | Rows | Shown as |
|---|---|---|
| Live TV | 28,448 | **Full channel names**, grouped by category |
| Movies / VOD | 151,944 | **Category name + title count only** |
| Series | 48,144 | **Category name + title count only** |

22 countries/regions. Largest: International/Other (97,661 rows), France (23,768), Germany (20,470).

**Principle:** static Vite site, no backend → all heavy lifting happens at build time; the browser lazy-loads small per-country JSON files.

---

## 1. Build script — `scripts/build-channels.js` (Node, no deps)

Reads the CSV, cleans it, writes JSON to `public/data/channels/`.

### Cleaning rules
- [x] Drop `stream_id` and `added` columns (internal panel data — leaks upstream provider, zero visitor value)
- [x] Drop separator/junk rows: names matching `^#+.*#+$` (e.g. `##### NHL PPV #####`)
- [x] Drop dated one-off PPV event rows: names containing date/time patterns (e.g. `– JUL 4 –`, `3:00 PM ET`) — these are stale within 24h. Keep the PPV *category* itself with a static note ("live events added daily") instead of expired listings
- [x] Dedupe exact duplicate names within the same category (e.g. `AF - NBA TV` listed twice with different stream ids)
- [x] Handle CSV quirks: UTF-8 BOM on header, quoted fields containing commas, RTL/Arabic and accented category names (keep as-is — they render fine)

### Output files
- [x] `public/data/channels/index.json` (~5 KB) — the only file loaded up front:
  ```json
  {
    "generated": "2026-07-04",
    "totals": { "live": 28448, "vod": 151944, "series": 48144, "countries": 22 },
    "countries": [
      { "slug": "usa", "name": "USA", "live": 6577, "vod": 613, "series": 263 },
      ...
    ]
  }
  ```
  (per-country totals come from the summary CSV / recomputed after cleaning)
- [x] `public/data/channels/<slug>.json` — one per country, loaded on selection:
  ```json
  {
    "name": "USA",
    "live": [ { "cat": "AM | USA | NFL", "channels": ["US - NFL NETWORK HD", ...] }, ... ],
    "vod":    [ { "cat": "VOD | EN - NETFLIX", "count": 2400 }, ... ],
    "series": [ { "cat": "SRS | ENGLISH", "count": 1800 }, ... ]
  }
  ```
- [x] `public/data/channels/search-live.json` — flat global search index for Live TV only:
  `[["US - ESPN HD","usa"],["UK - SKY SPORTS F1","uk"],...]` (deduped names + country slug; ~15–20k entries after cleaning, roughly 400–600 KB raw / ~100 KB gzipped). Loaded lazily on first keystroke in the search box, never on page load
- [x] Country slugs: lowercase, alphanumeric-dash (`latino-spanish`, `australia-new-zealand`, `international-other`)
- [x] Log a summary when run (rows in → rows kept → files written) so regeneration is auditable
- [x] `package.json`: add script `"build:channels": "node scripts/build-channels.js <path-to-csv>"`; document that a fresh CSV export just needs this one command re-run

---

## 2. Page — `channels.html`

Same shell as the landing page: reuse `styles.css`, trimmed navbar (logo + Subscribe + links back to `index.html#faq` etc.), slim footer, flame canvas optional.

Layout top to bottom:

```
Navbar (Subscribe → index.html#plans)
Header: "Every Channel On Our Server"
Stat cards: 28,000+ live · 150,000+ movies · 48,000+ series · 22 regions   ← from index.json
🔍 SEARCH BOX  — "Search your country or channel… (e.g. USA, ESPN, beIN)"
Country pills: [USA] [UK] [Canada] [France] … (22, with live-channel counts)
Tabs for selected country: Live TV (6,577) · Movies (613) · Series (263)
Live tab   → category accordions: "AM | USA | NFL (32)" → channel name list
Movies tab → category cards with counts only
Series tab → category cards with counts only
Sticky CTA bar: "Get access to all of this →" → index.html#plans
Footer
```

- [x] Create `channels.html` with the shell above (navbar, header, stat cards, search, pills container, tabs container, results container, sticky CTA, footer)
- [x] `<title>` / meta description: "Fire Store Channel List — 28,000+ live channels by country" (SEO for "channel list" queries)
- [x] Category accordions collapsed by default; only the DOM for the expanded category's channel list is rendered (render-on-expand — never inject 6k+ `<li>` at once)
- [x] Long categories (>200 channels) get a "Show all N" expander inside the accordion
- [x] Movies/Series tabs: card grid of category name + count, one line each, no titles

---

## 3. Search box (priority feature)

One box, two behaviors, as-you-type (debounced ~150 ms):

- [x] **Country match first**: input matched against country names/aliases (`usa`, `america`, `uk`, `britain`, `arabic`, `india`…) → matching countries shown as clickable results at the top; clicking selects that country (same as clicking its pill). Alias map hardcoded in `channels.js`
- [x] **Channel match**:
  - If a country is already selected → filter that country's loaded live channels + category names instantly (client-side, in memory)
  - If no country selected (or "search everywhere" toggled) → lazy-load `search-live.json` on first search keystroke, then match against the global index; results shown as "channel — country" rows; clicking one opens that country with the matching category expanded and the channel highlighted
- [x] Result grouping: "Countries (2)" then "Channels (154, showing 50)" — cap rendered results at ~50 with a "show more" step
- [x] Case/diacritic-insensitive substring match (normalize both sides); no external search lib needed at this scale
- [x] Empty state: "No match — message us on WhatsApp, we probably have it" + WhatsApp link (turns a failed search into a support lead)
- [x] Keep it dependency-free vanilla JS, consistent with `main.js`

---

## 4. Logic — `channels.js`

- [x] On load: fetch `index.json` → render stat cards + country pills
- [x] Country selection (pill click / search result / `?country=usa` URL param): fetch `<slug>.json` (cache in a `Map` so re-selection is instant) → render tabs + default Live tab
- [x] URL state: reflect selection in `?country=` and expanded tab in `#live|#movies|#series` so links are shareable (email campaigns can link `channels.html?country=usa`)
- [x] Tab switching re-renders from cached data, no refetch
- [x] Loading + error states for fetches (spinner line; "couldn't load, retry" button)
- [x] Reuse `initNavbar`-style mobile hamburger (either import from a shared module or duplicate the small function — keep `main.js` untouched)

---

## 5. Styles — `styles.css` additions

- [x] Stat cards row (reuse plan-card aesthetic, 4-up grid, stacks on mobile)
- [x] Search box: large, prominent, fire-accent focus ring; results dropdown panel
- [x] Country pills: wrap-friendly flex (22 pills), active state matches `.device-btn.active` gradient
- [x] Tabs: reuse the visual language of the old `.hub-tab` styles if still present, else small new tab style
- [x] Category accordion: reuse `.faq-item` / `.faq-q` pattern (already proven on the site)
- [x] Channel name list: multi-column on desktop (`columns: 3` or grid), single column mobile
- [x] Sticky bottom CTA bar (mobile-friendly, dismissible not required)
- [x] RTL text (Arabic category names) renders correctly inside accordions (`dir="auto"` on the label element)

---

## 6. Wiring into the existing site

- [x] `vite.config.js`: add `channels: 'channels.html'` to `rollupOptions.input`
- [x] Navbar on `index.html`: add `Channels` link → `channels.html` (nav becomes: Channels · Why Fire Store · FAQ · WhatsApp — still ≤4)
- [x] Landing channel-logo strip: caption line becomes a link — "+ thousands more — browse the full channel list →" → `channels.html`
- [x] Footer (both pages): add `Channel List` under Support or Legal-adjacent column
- [x] `channels.html` navbar links point back to `index.html#plans`, `index.html#faq`
- [x] Do NOT link the raw CSV anywhere; it never enters the repo's `public/` dir

---

## 7. Data hygiene / caveats

- [x] Verify no personal/account data in generated JSON (only category + channel names and counts)
- [x] PPV categories represented but individual dated events excluded (see §1)
- [x] Note in the build script header: page publishes the full lineup publicly — regenerate deliberately, review the log line, don't automate blindly into CI
- [x] Add `scripts/` CSV path as an argument, not hardcoded to `C:\Users\khalo\Downloads\`

---

## 8. Verification checklist

**Build script:**
- [x] Run produces `index.json` + 22 country files + `search-live.json`; log shows rows in/kept
- [x] Spot-check: no `stream_id`/`added` anywhere in output; no `#####` rows; no `– JUL 4 –`-style event rows; Arabic/accented categories intact
- [x] Total live count on page ≈ summary CSV counts (minus cleaned rows)

**Page:**
- [x] `channels.html` loads with only `index.json` fetched (check Network tab — no country JSON, no search index)
- [x] Click USA pill → `usa.json` fetched once; tabs show correct counts; accordion expands with channel names
- [x] Re-select USA after another country → served from cache, no refetch
- [x] Movies/Series tabs show categories + counts, no titles
- [x] `channels.html?country=uk` deep-link opens with UK selected

**Search:**
- [x] Typing "usa" → USA country result on top; click selects it
- [x] Typing "espn" with USA selected → instant filtered channel list
- [x] Typing "espn" with nothing selected → `search-live.json` lazy-loads (first keystroke only), grouped results with countries; clicking a result opens the right country + category
- [x] Typing gibberish → WhatsApp empty state
- [x] Search index never loads if search is never used

**General:**
- [x] Mobile 375px: pills wrap, accordion usable, sticky CTA doesn't cover content
- [x] No console errors; landing page (`index.html`) unaffected — plans/deep-links still work
- [x] `npm run build` outputs `dist/channels.html` + hashed assets + `data/channels/*.json`; totals page weight on first load < 200 KB before user interaction

---

## 9. Execution order

1. [x] §1 Build script + generate JSON (validate output sizes/counts)
2. [x] §6 `vite.config.js` + `package.json` wiring
3. [x] §2 `channels.html` shell
4. [x] §5 CSS
5. [x] §4 `channels.js` core (index load → pills → country load → tabs → accordions)
6. [x] §3 Search (country match → in-country filter → global index)
7. [x] §6 Links from landing page + footer
8. [x] §8 Full verification pass in preview
