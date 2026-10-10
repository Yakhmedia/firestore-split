# Implementation Plan — Replace Mock App Visuals with Real Product Screenshots

> **Target:** `/app.html` landing page  
> **Files in scope:** `app.html`, `app.css`, and optionally `app.js`  
> **Goal:** Replace the abstract, CSS-built product mockups with authentic screenshots from the real `/browse` application while preserving responsive behavior, accessibility, page speed, tab interactions, and the current Firestore.tv visual style.

---

## Available Screenshot Assets

| Asset | Dimensions | Intended use |
|---|---:|---|
| `assets/images/app-browse-home-desktop.jpg` | 1425 × 891 | Hero product view and general browse/sports view |
| `assets/images/app-browse-live-desktop.jpg` | 1425 × 891 | Live TV showcase |
| `assets/images/app-browse-movies-desktop.jpg` | 1425 × 891 | Movies and series showcase |
| `assets/images/app-browse-movies-mobile.jpg` | 375 × 812 | Mobile product view and phone frame |

The files are already compressed JPEGs and are approximately 45–158 KB each. Keep explicit `width` and `height` attributes in the HTML to prevent layout shift.

### Content-rights checkpoint

The captures include third-party poster artwork and channel branding. Confirm that these images are approved for public marketing use before deployment. If not, recapture the app using brand-owned/demo content or create sanitized versions with the third-party artwork removed.

---

## Recommended Visual Direction

Use one reusable screenshot component throughout the page rather than embedding raw images with one-off styles.

- Desktop screenshots appear inside a dark browser/TV frame with a subtle orange glow.
- The mobile screenshot appears inside a narrow phone frame.
- Screenshots use `object-fit: cover` only for intentionally cropped editorial views. The hero and showcase panels use `object-fit: contain` so navigation and UI context remain visible.
- The hero combines the real desktop browse view with the real mobile view as a small overlapping phone.
- The product showcase becomes four real-product tabs: **Browse**, **Live TV**, **Movies & Series**, and **Mobile**.
- Existing keyboard navigation and swipe gestures remain intact because `initShowcaseTabs()` is already tab-count agnostic.

---

## Phase 1 — Introduce a Reusable Screenshot Component

### [MODIFY] `app.css`

Add the following component classes:

- `.fs-product-shot`
  - `position: relative`
  - `overflow: hidden`
  - dark background and `1px solid var(--fs-line-strong)` border
  - `border-radius: var(--fs-radius)`
  - reuse `var(--fs-shadow)`
- `.fs-product-shot img`
  - `display: block`
  - `width: 100%`
  - `height: auto`
- `.fs-product-shot::before`
  - optional thin top bar or browser-frame accent
  - decorative only; `pointer-events: none`
- `.fs-product-shot-hero`
  - subtle desktop perspective on wide screens
  - no perspective below `1024px`
- `.fs-product-shot-phone`
  - narrow aspect ratio matching the mobile capture
  - stronger border radius and dark bezel
- `.fs-product-shot-editorial`
  - fixed visual aspect ratio for the three viewing-experience rows
  - screenshot fills the frame with configurable `object-position`
- `.fs-shot-caption`
  - muted, centered copy beneath tab screenshots

Add a restrained hover treatment only on pointer-capable devices:

```css
@media (hover: hover) and (pointer: fine) {
  .fs-product-shot:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 107, 0, 0.32);
  }
}
```

Respect `prefers-reduced-motion` using the page’s existing reduced-motion block.

### Acceptance criteria

- Screenshot frames share one consistent visual system.
- Images never stretch or distort.
- Frames do not introduce horizontal overflow at any supported viewport.

---

## Phase 2 — Replace the Hero Mockup

### [MODIFY] `app.html`

Replace the current `.fs-hero-visual` contents:

- Remove the fake `.fs-ui` television interface.
- Remove the fake floating program guide.
- Remove the fake phone interface.
- Keep `.fs-hero-bloom` as the branded background glow.
- Add the real desktop screenshot as the primary visual:

```html
<figure class="fs-product-shot fs-product-shot-hero">
  <img
    src="/assets/images/app-browse-home-desktop.jpg"
    width="1425"
    height="891"
    alt="Firestore.tv browse screen with a featured title and live sports channels"
    fetchpriority="high"
    decoding="async"
  />
</figure>
```

- Add the mobile screenshot as an overlapping phone frame:

```html
<figure class="fs-product-shot fs-product-shot-phone fs-hero-phone-shot">
  <img
    src="/assets/images/app-browse-movies-mobile.jpg"
    width="375"
    height="812"
    alt="Firestore.tv movie library on a mobile phone"
    decoding="async"
  />
</figure>
```

- Remove `aria-hidden="true"` from `.fs-hero-visual` because the real product screenshots communicate meaningful information.

### [MODIFY] `app.css`

- Preserve the existing desktop layered composition and orange glow.
- Position `.fs-hero-phone-shot` near the lower-left edge of the desktop image.
- Use `clamp()` for the phone width so it scales smoothly.
- On mobile:
  - make the desktop screenshot full-width and flat;
  - move the phone screenshot inside the frame boundary;
  - keep the phone large enough to recognize without covering the primary screenshot;
  - verify no overflow at 320px and 375px.

### Performance requirements

- The desktop hero image is the only screenshot with `fetchpriority="high"`.
- Do not add `loading="lazy"` to the above-the-fold hero image.
- All other screenshots must use `loading="lazy"` and `decoding="async"`.

### Acceptance criteria

- The hero clearly shows the real product within the first viewport.
- Both desktop and mobile UI are recognizable.
- No fake tiles, gradients, channel names, or progress rails remain in the hero.

---

## Phase 3 — Convert the Product Showcase to Real Screenshots

### [MODIFY] `app.html`

Update the four tab labels and panels:

| Tab | Screenshot | Caption |
|---|---|---|
| Browse | `app-browse-home-desktop.jpg` | Featured content and live channels together on one home screen. |
| Live TV | `app-browse-live-desktop.jpg` | Filter channel groups and move between live streams quickly. |
| Movies & Series | `app-browse-movies-desktop.jpg` | Browse large poster collections in familiar category rows. |
| Mobile | `app-browse-movies-mobile.jpg` | The same library experience adapted for a phone. |

Recommended tab IDs:

- `tab-browse` / `panel-browse`
- `tab-live` / `panel-live`
- `tab-vod` / `panel-vod`
- `tab-mobile` / `panel-mobile`

Each panel should contain only:

- one screenshot frame;
- one short caption;
- no duplicate fake `.fs-ui` markup.

Desktop panel example:

```html
<div class="fs-panel" role="tabpanel" id="panel-live" aria-labelledby="tab-live">
  <figure class="fs-product-shot fs-showcase-shot">
    <img
      src="/assets/images/app-browse-live-desktop.jpg"
      width="1425"
      height="891"
      alt="Firestore.tv Live TV screen showing channel categories and a channel list"
      loading="lazy"
      decoding="async"
    />
  </figure>
  <p class="fs-shot-caption">Filter channel groups and move between live streams quickly.</p>
</div>
```

For the mobile panel, center a phone frame inside the stage instead of stretching the portrait image across the full width.

### [MODIFY] `app.css`

- Remove the fixed `min-height: 420px` where it creates unnecessary empty space.
- Set a stable aspect ratio for desktop panels.
- Give the mobile panel a centered, narrow phone presentation.
- Preserve `.fs-fade` transitions and tab styling.

### [VERIFY] `app.js`

The current tab and swipe logic should continue working without structural changes. Confirm:

- arrow-key tab navigation follows the new tab order;
- swiping left/right selects the correct new panel;
- analytics category names remain meaningful after the ID changes.

Update only the analytics label mapping if needed.

### Acceptance criteria

- Every showcase tab displays a real application screenshot.
- Hidden panel images do not delay the hero render.
- Keyboard, tap, and swipe interactions still work.

---

## Phase 4 — Replace Remaining Editorial Mockups

The page currently repeats fake UI in the “Three ways to watch” and “Every screen” sections. Replace these so no abstract product mockups remain.

### [MODIFY] `app.html` — Three ways to watch

Use these mappings:

- **Live, without the hunt** → `app-browse-live-desktop.jpg`
- **Your next movie is already waiting** → `app-browse-movies-desktop.jpg`
- **Get to the action faster** → `app-browse-home-desktop.jpg`, cropped toward the sports rail using a modifier class

Each image should use:

- `loading="lazy"`
- `decoding="async"`
- explicit dimensions
- descriptive alt text tied to the adjacent section copy

### [MODIFY] `app.html` — Device ecosystem

Replace the three CSS-built device screens with a simpler two-device composition:

- large TV/laptop frame using `app-browse-home-desktop.jpg`;
- overlapping phone frame using `app-browse-movies-mobile.jpg`.

Keep the benefits list unchanged.

### [MODIFY] `app.css`

- Add editorial crop modifiers rather than creating duplicate image files unless visual QA shows a CSS crop is insufficient.
- Keep image focal points visible using `object-position`.
- Stack copy above images on mobile, preserving the current reading order.

### Acceptance criteria

- The page contains no fake product UI after this phase.
- Reused screenshots have distinct crops/presentation so the page does not feel repetitive.
- Text remains readable and the image frames remain secondary to conversion copy.

---

## Phase 5 — Remove Orphaned Mockup Code

### [MODIFY] `app.css`

After all HTML replacements are complete, use `rg` to confirm which selectors are no longer referenced and remove only orphaned rules.

Likely removal candidates:

- `.fs-ui-bar`, `.fs-ui-dot`, and `.fs-ui-pill`
- `.fs-ui-body`, `.fs-ui-hero`, and `.fs-ui-hero-text`
- `.fs-ui-rowlabel`, `.fs-ui-rail`, `.fs-ui-tile`, and `.fs-ui-progress`
- `.fs-ui-chan`, `.fs-ui-logo`, `.fs-ui-chan-info`, and `.fs-ui-nowbar`
- `.g1` through `.g8`
- `.fs-hero-main`, `.fs-hero-guide`, and the old `.fs-hero-phone`
- `.fs-panel-split`, `.fs-panel-side`, and `.fs-panel-main`
- old device-mockup selectors that are replaced by screenshot frames
- mobile scroll-hint selectors that only target removed fake rails

Do not remove shared comparison, reveal, button, navigation, FAQ, or sticky CTA styles.

### [MODIFY] `app.html`

- Update comments that currently say “built UI” or “fake product UI.”
- Verify no inline styles from the fake UI remain.

### Acceptance criteria

- `rg "fs-ui-|g[1-8]" app.html` returns no fake visual markup.
- The CSS bundle is smaller or unchanged despite adding real-product styling.
- Existing landing-page functionality remains intact.

---

## Phase 6 — Accessibility, Performance, and Visual QA

### Accessibility

- Use informative alt text for the first occurrence of each meaningful screenshot.
- If the same screenshot is repeated later, use `alt=""` when the adjacent copy already explains it.
- Keep tab roles, `aria-controls`, `aria-labelledby`, selected state, and focus management valid.
- Ensure screenshot frames do not receive focus unless they link somewhere.

### Performance

- Hero desktop screenshot: eager/high priority.
- All below-the-fold screenshots: lazy loading.
- Retain the current JPEGs initially; create WebP/AVIF variants only if Lighthouse shows a meaningful improvement.
- Do not render both desktop and mobile hero assets with CSS-only hiding. If art direction is required, use `<picture>` so the browser selects one source.
- Keep explicit dimensions or `aspect-ratio` on every image container to avoid cumulative layout shift.

### Responsive test matrix

Test at:

- 320 × 800
- 375 × 812
- 414 × 896
- 768 × 1024
- 1024 × 768
- 1440 × 900

Verify:

- no horizontal overflow;
- hero phone frame remains inside the viewport;
- screenshots do not appear blurry or stretched;
- navigation and sticky CTA behavior are unchanged;
- product tabs work by click, keyboard, and swipe;
- lazy images load as their panels/sections become visible;
- comparison reveal, FAQ accordion, and CTA analytics still work;
- no console errors or missing image requests;
- `npm run build` succeeds.

---

## Files Changed Summary

| File | Planned changes |
|---|---|
| `app.html` | Replace hero, showcase, editorial, and device mockups with semantic real screenshot markup |
| `app.css` | Add screenshot frames and responsive image presentation; remove orphaned fake-UI styles |
| `app.js` | Usually no structural change; update analytics labels only if tab IDs change |
| `assets/images/app-browse-*.jpg` | Existing source screenshots used by the landing page |

---

## Definition of Done

- The real Fire-store.tv interface is the dominant product visual throughout `/app.html`.
- No abstract/fake product UI remains in the landing-page markup.
- Desktop and mobile screenshots are presented in appropriate device frames.
- The page remains accessible, responsive, fast, and fully functional.
- Production build and the complete responsive verification matrix pass.

