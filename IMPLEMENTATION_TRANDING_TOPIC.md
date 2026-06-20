# Implementation Plan: Update Live & Trending to June 2026 USA Trends

This plan outlines the updates to transition the **Live & Trending** hub on the **Fire Store** homepage to reflect real-world trending topics in the USA as of today, **June 20, 2026**.

---

## Proposed Changes

### Frontend Logic & Data

#### [MODIFY] [main.js](file:///c:/Users/khalo/Downloads/firestore-split/main.js)
* **Update `trendingItems` (Trending Today):** Update elements to show real-world June 2026 trends. Each item will have an explicit, easily editable `image` property so you can swap URLs manually.
* **Update `mediaItems` (Movies & TV Shows):** Replace outdated 2025 listings with real 2026 hit releases. Each item will have an easily editable `poster` URL pointing to TMDB (using `${TMDB}/<path>`) which you can easily replace.
  * *House of the Dragon S3* (HBO) — Poster: `/z2yahl2uefxDCl0nogcRBstwruJ.jpg`
  * *The Bear (Final Season)* (Hulu) — Poster: `/w9PThR563m8H8mHhHkP4s7q3o48.jpg`
  * *Shogun* (Hulu) — Poster: `/7W5u625JHD4Lz6J732tLIHiuR7c.jpg`
  * *Deadpool & Wolverine* (Disney+) — Poster: `/8cdWjvZqMSd2fWlhyQ7gaJLF3Su.jpg`
  * *Inside Out 2* (Disney+) — Poster: `/vpnVM9B6NMmS40b4gLTXCH5ptQ6.jpg`
  * *The Boys S4* (Amazon Prime) — Poster: `/7c96lRGaG5WDWc4xaR7t58glvJu.jpg`
* **Update `usSportsEvents` (US Sports):** Align scheduled events to real June 20, 2026 fixtures. Each event will have an explicit, easily editable `image` URL.
  * *UFC Fight Night: Kape vs. Horiguchi* (Live tonight, ESPN+)
  * *U.S. Open Golf Championship* (Day 3 live today, NBC)
  * *MLB: Yankees vs. Red Sox* (Tonight, FOX)
  * *MLB: Dodgers vs. Giants* (Tonight, FS1)
  * *WNBA: Indiana Fever vs. Chicago Sky* (Tomorrow, ESPN)
* **Update `games` (World Cup 2026 matches):** Match the actual group-stage matches scheduled for June 20, 2026:
  * *Germany vs. Ivory Coast* (Toronto Stadium, Status: Live)
  * *Ecuador vs. Curaçao* (Kansas City Stadium, Status: Upcoming)
  * *Netherlands vs. Sweden* (Houston Stadium, Status: Live)
  * *Tunisia vs. Japan* (Monterrey Stadium, Status: Upcoming)

#### [MODIFY] [index.html](file:///c:/Users/khalo/Downloads/firestore-split/index.html)
* Update the Hero ticker array values (if hardcoded or static) to match the new current US trending schedule.

---

## Verification Plan

### Manual Verification
* Run the Vite local development server (`npm run dev`).
* Open the browser at `http://localhost:3000/`.
* Verify that each tab (`Trending Today`, `Movies & TV Shows`, `US Sports`, `World Cup 2026`) loads the new items with their correct titles, metadata, tags, and posters/images.
* Ensure there are no broken images (check console for any TMDB or Unsplash load failures).
