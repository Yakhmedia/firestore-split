# Implementation Plan: Fire Store Landing Page Improvements

This plan outlines the design and implementation details for adding the **Infinite Auto-Scrolling Channel Logos**, the interactive **Cord-Cutter Savings Calculator**, and aesthetic improvements to the **Pricing Section** (glassmorphism and modern HSL borders).

## Proposed Changes

### 1. 📡 Infinite Auto-Scrolling Channel Logos
Instead of the current static grids in the "What's Included" section, we will introduce two horizontal auto-scrolling rows moving in opposite directions.

* **HTML Structure:** In [index.html](file:///c:/Users/khalo/Downloads/firestore-split/index.html) (inside `.channels-section`), wrap the channel logos in marquee tracks and duplicate the logos list to ensure a seamless loop.
* **CSS Animation:** In [styles.css](file:///c:/Users/khalo/Downloads/firestore-split/styles.css):
  * Create `.marquee-container` with `overflow: hidden`.
  * Create `.marquee-track` running an infinite translation animation using `transform: translate3d(0, 0, 0)` for hardware acceleration.
  * Pause animation on hover: `.marquee-track:hover { animation-play-state: paused; }`.
  * Apply brand glowing shadows on hover based on `--accent`.

### 2. 🧮 Cord-Cutter Savings Calculator
A dynamic checklist calculator inserted directly under the pricing section to show annual savings compared to Fire Store.

* **HTML Structure:** In [index.html](file:///c:/Users/khalo/Downloads/firestore-split/index.html) (under the pricing cards/comparison table), add a new `.calculator-section` container containing:
  * A list of checkbox items (Cable TV, Netflix, Disney+, HBO Max, etc.) with custom toggle styling.
  * A dynamic live results counter showing "Your Monthly Expense", "Fire Store Cost", and "Your Annual Savings".
* **JS Logic:** In [main.js](file:///c:/Users/khalo/Downloads/firestore-split/main.js):
  * Define an array of subscription objects with name, monthly cost, and icon.
  * Listen to change events on the checkboxes.
  * Compute the user's total current cost vs Fire Store cost (defaulting to the selected device package's monthly average).
  * Animate the counter numbers dynamically on update.
* **Styling:** In [styles.css](file:///c:/Users/khalo/Downloads/firestore-split/styles.css):
  * Design a high-tech control panel layout with gradient progress elements, contrasting comparison bars, and animated count-up numbers.

### 3. ✨ Pricing Cards Enhancement
* Add glassmorphism filters (`backdrop-filter: blur(12px)`) and subtle glowing neon borders using CSS variables and HSL colors.
* Make the popular plan card stand out with an animated gradient border.

---

## Verification Plan

### Manual Verification
* **Marquee Performance:** Verify smooth 60fps horizontal scrolling on desktop and mobile browsers, ensuring hover-to-pause works seamlessly.
* **Calculator Interactive Checks:** Toggle various subscriptions and ensure the calculations update instantly and count up smoothly.
* **Responsive Layout:** Ensure the calculator and marquee rows wrap cleanly or scale down gracefully on mobile screens.
