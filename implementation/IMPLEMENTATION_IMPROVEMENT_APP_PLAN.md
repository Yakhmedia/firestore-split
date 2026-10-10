# Implementation Plan — Landing Page (app.html) Mobile & UX Improvements

> **Scope**: All changes target `app.html`, `app.css`, and `app.js`.  
> **Goal**: Make the landing page fully mobile-friendly, improve conversion, and polish the overall experience.

---

## Phase 1 — Critical Mobile Fixes

These address layout breakage and usability problems on phones (< 767px).

---

### 1.1 Fix Hero Phone Element Overflow

**Problem**: The `.fs-hero-phone` uses `left: -26px; bottom: -30px` — bleeds off-screen on narrow viewports.

**Changes**:

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Inside the `@media (max-width: 767px)` block, reposition the phone element:
  - Set `left: 4px; bottom: -10px; width: 50px` so it stays within bounds
  - Remove the `perspective` transform on mobile for a cleaner flat look
- Also scale down the hero visual container:
  - Set `.fs-hero-visual { max-width: 380px; margin: 0 auto; }`

**Acceptance**: On a 375px viewport, no horizontal scrollbar appears and the phone mockup is fully visible.

---

### 1.2 Add Scroll-Snap + Scroll Hints to Tile Rails

**Problem**: `.fs-ui-rail.is-scroll` containers are swipeable but users get no visual hint. No scroll-snap makes swiping feel loose.

**Changes**:

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Add to `.fs-ui-rail.is-scroll`:
  ```css
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  ```
- Add to `.fs-ui-tile`:
  ```css
  scroll-snap-align: start;
  ```
- Add a fade-hint pseudo-element on the parent container (`.fs-panel-main`, `.fs-ui-body`, or `.fs-exp-media`):
  - A `::after` with a right-edge gradient from `transparent` → `surface color`, ~32px wide
  - Only visible on mobile (`@media max-width: 767px`)
  - Uses `pointer-events: none` so it doesn't block taps
- Increase tile sizes on mobile:
  - `.fs-ui-tile` → `width: 110px; height: 72px`
  - `.fs-ui-tile.is-tall` → `width: 96px; height: 132px`

**Acceptance**: Tiles snap to position when swiped. A subtle gradient fade on the right edge signals more content.

---

### 1.3 Stack Comparison Table on Mobile

**Problem**: The 2-column comparison grid crampes text at 375px (~155px per cell).

**Changes**:

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Inside `@media (max-width: 767px)`, restyle `.fs-compare-row`:
  ```css
  grid-template-columns: 1fr;
  ```
- The "Typical setup" cell becomes a top label, and the "Firestore.tv" cell sits below it
- Add left border accent (3px solid `var(--fire-orange)`) to the `.is-brand` cell when stacked
- Remove the right border from `.fs-compare-cell:first-child` on mobile
- Add a small bottom margin between rows for visual separation

#### [MODIFY] [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html)

- No HTML changes needed — pure CSS restructuring

**Acceptance**: On mobile, each comparison row reads as a vertical card: "old way" on top (muted), "Firestore way" below (highlighted).

---

## Phase 2 — Conversion & UX Improvements

These target conversion rate and usability.

---

### 2.1 Add Sticky Bottom CTA Bar on Mobile

**Problem**: After the hero, users scroll through 6+ sections before seeing another CTA.

**Changes**:

#### [MODIFY] [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html)

- Add a new element just before `</main>`:
  ```html
  <div class="fs-sticky-cta" id="fsStickyBar" aria-hidden="true">
    <a class="fs-btn fs-btn-primary" href="https://firestore.tv/"
       data-analytics="trial" data-loc="sticky_bar">⚡ Start free trial</a>
  </div>
  ```

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- New `.fs-sticky-cta` styles:
  - `position: fixed; bottom: 0; left: 0; right: 0; z-index: 90`
  - `backdrop-filter: blur(12px); background: rgba(14,14,14,0.85)`
  - `padding: 12px 1rem; text-align: center`
  - `transform: translateY(100%)` by default (hidden)
  - `transition: transform 0.3s ease`
  - `.fs-sticky-cta.visible { transform: translateY(0) }`
  - The button inside gets `width: 100%; max-width: 400px`
  - Only shown on mobile: wrap in `@media (max-width: 767px)` — desktop gets `display: none`
- Add `padding-bottom: 72px` to `body.fs-app` on mobile so footer content isn't hidden behind the bar

#### [MODIFY] [app.js](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.js)

- New `initStickyBar()` function:
  - Uses IntersectionObserver on `.fs-hero-ctas`
  - When hero CTAs scroll out of view → add `.visible` to `#fsStickyBar` + set `aria-hidden="false"`
  - When hero CTAs scroll back into view → remove `.visible` + set `aria-hidden="true"`
  - Also hide the bar when the final banner section is in view (avoid doubling up)
- Call `initStickyBar()` from the DOMContentLoaded handler

**Acceptance**: On mobile, a sticky CTA bar slides up from the bottom when the hero scrolls away, and hides when the user scrolls back to the top or reaches the final CTA banner.

---

### 2.2 Differentiate Hero CTA Hierarchy on Mobile

**Problem**: Both hero CTAs become `flex: 1 1 100%` (same width) on mobile, making the primary and secondary actions look equal.

**Changes**:

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Inside `@media (max-width: 767px)`:
  - Keep primary CTA full-width: `flex: 1 1 100%`
  - Make ghost CTA an inline text-link style:
    ```css
    .fs-hero-ctas .fs-btn-ghost {
      flex: 0 1 auto;
      background: none;
      border: none;
      padding: 10px 0;
      color: var(--fire-orange);
      text-decoration: underline;
      text-underline-offset: 4px;
      font-size: 0.95rem;
      box-shadow: none;
      min-height: auto;
      justify-content: center;
      width: 100%;
    }
    ```

**Acceptance**: On mobile, "Start free trial" is a large prominent button, and "Explore the product" appears as a subtle text link below it.

---

### 2.3 Add Social Proof Strip Below Hero

**Problem**: No trust signals beyond a lock emoji. Users have no reason to believe the service is real.

**Changes**:

#### [MODIFY] [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html)

- Add a new section immediately after the hero `</section>` tag:
  ```html
  <div class="fs-social-proof" aria-label="Trust indicators">
    <div class="fs-container fs-proof-row">
      <div class="fs-proof-item">
        <strong>100,000+</strong><span>Channels available</span>
      </div>
      <div class="fs-proof-item">
        <strong>4K</strong><span>Ultra HD streaming</span>
      </div>
      <div class="fs-proof-item">
        <strong>5</strong><span>Simultaneous screens</span>
      </div>
      <div class="fs-proof-item">
        <strong>24/7</strong><span>Email support</span>
      </div>
    </div>
  </div>
  ```

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- New `.fs-social-proof` styles:
  - `border-top / border-bottom: 1px solid var(--fs-line)`
  - `padding: 28px 0`
  - `.fs-proof-row`: flex row, justify space-around, flex-wrap
  - `.fs-proof-item strong`: `font-family: 'Bebas Neue'; font-size: 2rem; color: var(--fire-orange); display: block; text-align: center`
  - `.fs-proof-item span`: `font-size: 0.82rem; color: var(--text-muted); display: block; text-align: center`
  - Mobile: 2-column grid layout, `gap: 20px`

**Acceptance**: A clean stats strip shows below the hero on all viewports, reinforcing key value props with numbers.

---

## Phase 3 — Polish & Micro-interactions

These make the experience feel premium and modern.

---

### 3.1 Polish Hamburger Drawer

**Problem**: Mobile nav drawer just toggles visibility — no backdrop, no slide animation.

**Changes**:

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Add a backdrop overlay when the drawer is open:
  ```css
  @media (max-width: 767px) {
    .fs-app .nav-links::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: -1;
    }
    .fs-app .nav-links.active::before {
      opacity: 1;
      pointer-events: auto;
    }
  }
  ```
- Add slide-in transition to the drawer panel:
  - Default state: `transform: translateX(100%)` + `transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
  - `.active` state: `transform: translateX(0)`
- Style the "Sign in" link inside the drawer (`.fs-drawer-only a`) differently:
  - Orange border, slightly larger padding, centered

> **Note**: This depends on the existing drawer styles in `styles.css`. The implementation will layer on top of whatever's there, using `app.css` overrides scoped to `.fs-app`.

**Acceptance**: On mobile, tapping the hamburger slides the drawer in from the right with a dimmed backdrop. Tapping the backdrop or pressing Escape closes it.

---

### 3.2 Add Swipe Gestures to Product Showcase Tabs

**Problem**: The 4-tab product showcase is tap-only. Mobile users expect to swipe between panels.

**Changes**:

#### [MODIFY] [app.js](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.js)

- In `initShowcaseTabs()`, add touch event listeners to `.fs-showcase-stage`:
  - Track `touchstart` → record `startX`
  - On `touchend` → calculate `deltaX`
  - If `deltaX > 50px` → select previous tab
  - If `deltaX < -50px` → select next tab
  - Throttle to prevent rapid-fire swipes
- Add a subtle CSS transition to panel content swap (already has `fs-fade` animation, so this should work naturally)

**Acceptance**: On mobile, swiping left/right on the product showcase area switches between tabs. The tab indicator updates to match.

---

### 3.3 Animate Comparison Table Rows on Scroll

**Problem**: The comparison section feels flat compared to the rest of the page.

**Changes**:

#### [MODIFY] [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html)

- Add `reveal` class to each `.fs-compare-row` (except the header row which can stay static)
- Use staggered delays: `reveal-delay-1`, `reveal-delay-2`, etc.

#### [MODIFY] [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css)

- Add a check-mark pop animation to `.fs-check` inside revealed rows:
  ```css
  .fs-compare-row.visible .fs-check {
    animation: fs-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  @keyframes fs-pop {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  ```

**Acceptance**: As the user scrolls to the comparison section, rows fade in one by one and check-marks pop with a subtle bounce.

---

## Phase 4 — Performance

These improve load time and battery life, especially on mobile.

---

### 4.1 Optimize Flame Canvas for Mobile

**Problem**: 90 particles at 60fps drain battery on budget phones.

**Changes**:

#### [MODIFY] [app.js](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.js)

- In `initFlameCanvas()`:
  - Detect mobile: `const isMobile = window.innerWidth < 768`
  - Reduce particle count: `isMobile ? 30 : 90`
  - Cap canvas resolution on mobile:
    ```js
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * 0.4 * dpr;
    ctx.scale(dpr, dpr);
    ```
  - Add Page Visibility API to pause when tab is hidden:
    ```js
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animate();
    });
    ```

**Acceptance**: On mobile, flame effect uses fewer particles and pauses when the tab is in background. No visible change on desktop.

---

### 4.2 Remove Unused Barlow Condensed Font

**Problem**: The Google Fonts URL loads `Barlow+Condensed:wght@400;600;700;800;900` but it isn't used in `app.css` or `app.html`.

**Changes**:

#### [MODIFY] [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html)

- Update the Google Fonts `<link>` to remove Barlow Condensed:
  ```
  Before: family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700
  After:  family=Bebas+Neue&family=Barlow:wght@400;500;600;700
  ```

> **Warning**: Verify that `styles.css` (the shared file) doesn't use Barlow Condensed either. If it does, keep it in the shared file's font load and only remove from `app.html`.

**Acceptance**: One fewer font family loaded. Page weight drops by ~15–30KB.

---

## Files Changed Summary

| File | Changes |
|------|---------|
| [app.css](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.css) | Hero phone fix, scroll-snap, comparison stacking, sticky CTA, CTA hierarchy, social proof, drawer polish, comparison animation, mobile tile sizing |
| [app.html](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.html) | Sticky CTA bar markup, social proof strip, comparison row reveal classes, remove Barlow Condensed font |
| [app.js](file:///c:/Users/Shadow/Desktop/My%20Projects/firestore-split/app.js) | Sticky bar observer, swipe gesture handler, flame canvas optimization, visibility API pause |

---

## Verification Plan

### Visual Testing
- Test at viewport widths: **320px**, **375px**, **414px**, **768px**, **1024px**, **1440px**
- Verify no horizontal overflow at any width
- Confirm sticky bar appears/disappears at correct scroll positions
- Verify comparison table readability on mobile
- Test hamburger drawer open/close + backdrop

### Functional Testing
- Swipe left/right on product showcase tabs (mobile)
- Verify scroll-snap on tile rails
- Confirm flame canvas pauses when tab is hidden (`document.hidden`)
- Test all CTA links still point to correct URLs
- Verify FAQ accordion still works
- Test keyboard navigation (tabs, Escape to close drawer)

### Performance
- Compare Lighthouse mobile score before/after
- Confirm font load reduction in Network tab
