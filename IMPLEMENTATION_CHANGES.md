# Implementation Plan for Frontend Changes

## Goal Description

Update the landing page to reflect the new streaming‑service focus and introduce a device‑count based pricing model. Specific tasks include:
- Remove the "Live & Upcoming" video player and repurpose the "Watch" button to navigate to the Plans section.
- Replace the monthly/yearly toggle with a device selector (1‑5 devices). Selecting a device updates the pricing cards dynamically.
- Refactor the pricing cards to use a JavaScript object that defines `deviceCount`, `months`, `price`, and `checkoutLink`.
- Ensure all changes are mobile‑friendly and maintain a clean, conversion‑focused UI.
- Remove all fitness‑program related content.

## User Review Required

> [!IMPORTANT]
> No breaking UI changes are introduced beyond the removal of the video section and pricing toggle. Ensure that the new device selector UI matches the existing design language.

## Open Questions

> [!NOTE]
> None at this time. The plan captures the current requirements.

## Proposed Changes

---
### JavaScript Data Schema

Create a new object in `main.js` (or a dedicated `pricingData.js`) that holds subscription configurations:
```js
const pricingPlans = [
  { deviceCount: 1, months: 12, price: 9.99, checkoutLink: "https://example.com/checkout?devices=1" },
  { deviceCount: 2, months: 12, price: 14.99, checkoutLink: "https://example.com/checkout?devices=2" },
  // ... up to 5 devices
];
```

---
### UI Updates

#### Device Selector Widget
- Add a `<select>` (or custom radio button group) allowing users to choose 1‑5 devices.
- Attach an `onchange` handler that reads the selected value, finds the matching entry in `pricingPlans`, and updates the price card DOM elements.

#### Pricing Card Rendering
- Refactor the existing card rendering logic to consume `pricingPlans` instead of the monthly/yearly toggle.
- Update each card’s "Subscribe" button `href` to the corresponding `checkoutLink`.

#### Watch Button Redirection
- Remove the modal/video logic.
- Change the button’s `href` (or click handler) to `#plans` or `scrollIntoView` to the Plans section.

---
### HTML Adjustments
- Delete the `<section id="live-upcoming">` block that contains the video player.
- Insert the device selector markup within the Pricing section, preferably before the pricing cards.

---
### CSS Adjustments
- Style the new device selector to match the site’s aesthetic (glassmorphism, gradients, micro‑animations).
- Ensure the selector and updated cards are fully responsive (mobile breakpoints, touch‑friendly hit areas).
- Remove any leftover fitness‑related styles.

---
### Content Cleanup
- Search and delete any references to fitness programs, classes, or related imagery.
- Update copy to emphasize streaming services.

---
## Verification Plan

### Automated Checks
- Run `npm run dev` and open the site in a browser.
- Verify that selecting each device updates the price and checkout link correctly.
- Ensure the "Watch" button scrolls to the Plans section.
- Confirm the video section is no longer present in the DOM.
- Test responsiveness with Chrome dev tools (mobile viewports).

### Manual Verification
- Visually inspect the landing page on a phone emulator.
- Click each device option and confirm the displayed price matches the `pricingPlans` data.
- Click the checkout button and confirm it navigates to the correct external URL.
- Ensure no fitness‑related copy or images remain.

---
## Checklist
- [x] Remove video player section from `index.html`.
- [x] Update "Watch" button to link to Plans section.
- [x] Add device selector UI.
- [x] Implement `pricingPlans` JavaScript object.
- [x] Refactor pricing card rendering to use new data.
- [x] Update checkout button links.
- [x] Apply responsive CSS for new selector and cards.
- [x] Remove all fitness program content and styles. *(N/A — no fitness content existed)*
- [x] Test dynamic pricing updates.
- [x] Verify mobile friendliness and overall UI consistency.
