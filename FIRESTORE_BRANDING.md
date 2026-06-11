# Implementation Plan - Firestore Branding & Footer Pages

This plan covers adding the new legal footer pages (`terms.html`, `privacy.html`, `refund.html`, `cookies.html`, and `dmca.html`) to the `fire-store.tv` project, configuring Vite to support multi-page building, updating contact/legal details across the application, and integrating the branding SVG logo into the navbar and footer.

## User Review Required

> [!NOTE]
> * **DMCA Notice:** We will create `dmca.html` with a clean placeholder/basic draft. You can overwrite or upload your version of this page later as requested.
> * **Branding Logo:** We will use `assets/images/firestore_dark_mode_logo_editable.svg` for the dark theme website. Let us know if you prefer another file.

## Proposed Changes

### Configuration

#### [MODIFY] [vite.config.js](file:///c:/Users/khalo/Downloads/firestore-split/vite.config.js)
Modify Vite configuration to support multiple HTML entry points in the Rollup building options so that all pages are generated during build:
```javascript
input: {
  main: 'index.html',
  terms: 'terms.html',
  privacy: 'privacy.html',
  refund: 'refund.html',
  cookies: 'cookies.html',
  dmca: 'dmca.html'
}
```

---

### Main Page Updates

#### [MODIFY] [index.html](file:///c:/Users/khalo/Downloads/firestore-split/index.html)
* Replace the navbar textual logo `🔥 FireStore` with the SVG logo located at `assets/images/firestore_dark_mode_logo_editable.svg`.
* Replace the footer logo text with the same SVG logo.
* Update footer contact link, WhatsApp link (`https://wa.me/12029927413`), and support email (`contact@firestore.tv`).
* Link footer legal links to their corresponding pages:
  * Terms of Service: `/terms.html`
  * Privacy Policy: `/privacy.html`
  * Refund Policy: `/refund.html`
  * DMCA Notice: `/dmca.html`
  * Cookie Policy: `/cookies.html`

---

### Brand Assets & Styling

#### [MODIFY] [styles.css](file:///c:/Users/khalo/Downloads/firestore-split/styles.css)
* Add styling rules for `.nav-logo img` and `.footer-brand img` to ensure the SVG logo displays with appropriate dimensions and scales gracefully.
* Add layout & typography styling for legal/text pages so that they share the premium dark theme look, headers, and footer.

---

### New Legal Pages (Clean, Premium Dark Theme Layouts)

#### [NEW] [terms.html](file:///c:/Users/khalo/Downloads/firestore-split/terms.html)
Terms of Service page containing:
* Governing law (Wyoming, USA)
* Acceptable usage of the IPTV streaming service
* Age limit & account credentials

#### [NEW] [privacy.html](file:///c:/Users/khalo/Downloads/firestore-split/privacy.html)
Privacy Policy page outlining:
* Collected information: Name, Email, WhatsApp number
* Tracker technologies: Google Analytics, Facebook Pixels, and scripts
* Payment security: Stripe, PayPal, Crypto processors

#### [NEW] [refund.html](file:///c:/Users/khalo/Downloads/firestore-split/refund.html)
Refund Policy page outlining:
* 24-hour free trial terms
* 7-day money-back guarantee
* Refund processing time (1 to 3 days)

#### [NEW] [cookies.html](file:///c:/Users/khalo/Downloads/firestore-split/cookies.html)
Cookie Policy page describing Google Analytics, Facebook Pixels, and cookie preferences.

#### [NEW] [dmca.html](file:///c:/Users/khalo/Downloads/firestore-split/dmca.html)
DMCA Policy page placeholder with contact info so you can easily overwrite/upload later.

---

## Verification Plan

### Automated/Build Verification
* Run `npm run build` to verify Vite compiles all HTML files successfully without errors.

### Manual Verification
* Start dev server with `npm run dev` and navigate to the home page.
* Click footer links (Terms, Privacy, Refund, Cookies, DMCA) to verify they load correctly.
* Inspect navbar and footer to verify that the SVG logo is correctly loaded and looks visually stunning.
