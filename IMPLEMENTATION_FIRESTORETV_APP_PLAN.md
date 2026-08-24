# Implementation Plan — Firestore.tv App Landing Page

**Document:** `IMPLEMENTATION_FIRESTORETV_APP_PLAN.md`  
**Status:** Planning only — no landing-page code has been implemented  
**Primary goal:** Convert new visitors into registered users who activate an eligible 24-hour free trial  
**Secondary goal:** Let visitors understand and preview the Firestore.tv experience before registration

---

## 1. Product and implementation assumptions

This plan treats the requested page as the public Firestore.tv marketing homepage implemented with the Next.js App Router, using `app/page.tsx`. It does **not** describe a signed-in `/app` dashboard.

The current `firestore-split` workspace is a Vite/static HTML project and does not contain a Next.js `app` directory. The original brief references a separate Next.js project at `C:\Users\Shadow\Desktop\code\firestoretv`. Before implementation begins, confirm which repository is the delivery target.

Implementation must not change subscription provisioning, playback, authentication backends, or database behavior. The only authentication change in scope is allowing primary calls to action to open the existing registration form directly.

### Decisions to verify before implementation

- Canonical brand: `Firestore.tv` rather than `Fire Store`, `Firestore`, or `fire-store.tv`.
- Canonical production domain and canonical plans URL.
- Exact free-trial eligibility rules, activation timing, and one-device limitation.
- Whether cross-device watch progress is already supported.
- Whether “up to 4K” is supported and under which availability conditions.
- Supported television and streaming-device list.
- Whether the current application already supports `/login?mode=signup&redirectTo=/account`.
- Final support address, expected to be `contact@firestore.tv`.
- Which existing logo, font licenses, screenshots, and product-interface assets are approved.

No unverified catalog-size, network, sporting-event, uptime, anti-buffering, or instant-activation claims should appear on the page.

---

## 2. Experience strategy

### Design concept

**Your personal streaming home.**

The page should feel like an invitation into the real Firestore.tv product. It should use a cinematic charcoal-black environment, generous editorial typography, restrained ember-orange accents, and interface-led imagery. The product interface—not licensed entertainment artwork—should be the main visual identity.

### Conversion principle

The visitor should be able to answer these questions in order:

1. What is Firestore.tv?
2. What does it look like?
3. What can I do with it?
4. Will it work on my devices?
5. Is it easy to start?
6. What does the trial require?
7. How do I register?

The 24-hour free trial remains the dominant action throughout the page. “Sign in” remains obvious but visually secondary.

### Visual guardrails

- Preserve the existing charcoal-black and ember-orange brand direction.
- Use orange mainly for conversion actions, active states, focus states, and small highlights.
- Avoid a direct Netflix-style layout, logo treatment, poster wall, or red-accent imitation.
- Avoid generic feature-card grids as the primary storytelling device.
- Use owned, licensed, generated, or clearly reusable imagery only.
- Prefer product UI previews, abstract cinematic stills, gradients, and original artwork.
- Keep animations restrained and purposeful; the page must remain complete with motion disabled.

---

## 3. Proposed page architecture

```text
Sticky header
  ↓
Hero with layered product preview
  ↓
Interactive product showcase
  ↓
Three viewing experiences
  ↓
Device ecosystem
  ↓
Less-setup comparison
  ↓
How it works
  ↓
Trial conversion banner
  ↓
Plans teaser
  ↓
FAQ
  ↓
Final conversion banner and footer
```

This order moves from desire to proof, then reassurance, then registration. It avoids asking a cold visitor to evaluate plans before understanding the product.

---

## 4. Section specifications

### 4.1 Header

**Content**

- Firestore.tv logo linked to `/`.
- Navigation: Product, Devices, How it works, Plans, FAQ.
- Secondary action: Sign in.
- Primary action: Start free trial.

**Behavior**

- Transparent over the top of the hero.
- Becomes a translucent, blurred dark bar after scrolling.
- Uses in-page anchors for page sections.
- Maintains a visible free-trial action on mobile, outside or at the top of the navigation drawer.
- Closes the mobile menu after navigation and on Escape.
- Uses a proper button for the menu trigger with an accurate expanded state.

**Destinations**

- Sign in: `/login`
- Start free trial: `/login?mode=signup&redirectTo=/account`

### 4.2 Hero

**Desktop composition**

- Approximately 55% copy and 45% product preview.
- Minimum first-viewport height without forcing essential content below short laptop screens.
- Copy remains readable independently of the visual.

**Draft content**

Eyebrow:

> 24-hour free trial · No card required

Headline:

> All your entertainment.  
> One place to press play.

Supporting copy:

> Watch live TV, sports, movies, and series across your favorite screens—with one login and no complicated setup.

Actions:

- Primary: **Start free trial**
- Secondary: **Explore the product**

Trust line:

> 24 hours free · One device · Eligibility may vary

**Hero visual**

Create a layered product composition rather than a generic background image:

- Main TV or desktop interface showing a “Continue watching” or “Live now” state.
- Floating program-guide panel.
- Small phone or tablet interface layer.
- Subtle orange light bloom behind the interface.
- Original abstract media thumbnails without third-party titles, personalities, team marks, or network logos.

The composition should remain understandable at 200% zoom and collapse to one clean interface frame on narrow screens.

### 4.3 Interactive product showcase

**Headline**

> Entertainment that feels instantly familiar.

**Purpose**

Show the actual navigation model of Firestore.tv immediately after the hero. This should be the signature section of the page.

**Tabs**

- Live TV
- Movies
- Series
- Sports

**Preview states**

- Live TV: channel rail plus clear program information.
- Movies: large featured item plus horizontal discovery rails.
- Series: episode progress, favorites, and recently added rows.
- Sports: supported live events or generic sports categories without unverified availability claims.

**Interaction rules**

- Tabs must be keyboard operable and use correct tab semantics.
- Content changes should not cause large layout shifts.
- On mobile, use a horizontally scrollable tab list and a single preview frame.
- Do not auto-cycle while the visitor is reading.
- If real product screenshots are not ready, build a clearly representative UI mockup using approved content data.

### 4.4 Three viewing experiences

Use three spacious editorial panels, alternating media and copy, instead of small feature cards.

1. **Live, without the hunt**  
   Browse live channels with clear program information and fast channel switching.

2. **Your next movie is already waiting**  
   Explore movies and series in familiar, easy-to-browse collections.

3. **Get to the action faster**  
   Find supported sports programming without navigating complicated menus.

Each panel should demonstrate a specific interface state. Add one shared disclaimer below the section:

> Content, events, quality, and availability vary by plan and provider.

### 4.5 Device ecosystem

**Headline**

> One account. Every screen you use.

**Visual**

Show a television as the dominant screen, supported by laptop, tablet, and phone previews. A subtle line or orange glow can connect the screens without implying simultaneous multi-device playback.

**Benefits**

- Simple TV pairing.
- Favorites and watch progress, if verified.
- Responsive playback controls.
- Up to 4K where available, if verified.

Use accurate product or platform names only after the supported-device list has been confirmed.

### 4.6 Less-setup comparison

**Headline**

> Less setup. More watching.

Use a compact comparison that translates technical architecture into customer-visible benefits:

| Typical setup | Firestore.tv |
| --- | --- |
| Playlist URLs to manage | One secure login |
| Manual configuration | Guided TV pairing |
| Disconnected menus | One familiar interface |
| Repeated setup steps | Saved preferences, if supported |

Do not mention exposed credentials, backend implementation, playlist protocols, or infrastructure details on the marketing page.

### 4.7 How it works

Present one connected three-step path:

1. **Create your account** — Register with an email address and password.
2. **Activate your access** — Start an eligible trial or choose an available plan.
3. **Press play** — Browse supported live channels, movies, series, and sports.

CTA: **Create my account**

The section should be concise and reassurance-focused. Avoid decorative illustrations that compete with the steps.

### 4.8 Trial conversion banner

Place the first major conversion banner directly after “How it works.”

**Draft content**

> See what Firestore.tv feels like for yourself.

> Create your account and enjoy 24 hours of eligible access on one device. No payment card required.

CTA: **Start my free trial**

Small print:

> Trial eligibility and content availability may vary.

### 4.9 Plans teaser

Until verified pricing is available, do not display placeholder prices or fabricated plan cards.

**Headline**

> Find the access that fits how you watch.

**Supporting information**

- Available subscription periods.
- Supported device options.
- Eligibility or renewal notes.
- Link to the canonical plans location.

CTA: **View plans**

When pricing is verified, this section can be upgraded to a comparison with one clearly recommended plan. Pricing, billing period, renewal behavior, device limits, and refund language must all come from a single trusted configuration source.

### 4.10 FAQ

Use native disclosure behavior where practical and keep answers concise.

Initial questions:

1. What can I watch on Firestore.tv?
2. Which devices are supported?
3. How does the 24-hour free trial work?
4. Do I need a payment card for the trial?
5. Can I watch on more than one device?
6. Is 4K available?
7. How do I connect a television?
8. Where can I get support?

Answers must be reviewed against real provisioning, device, and content rules. FAQ structured data should only be added if the visible questions and answers qualify under current search-engine guidelines and exactly match the rendered content.

### 4.11 Final conversion banner and footer

**Final banner**

> Ready to find your new streaming home?

Actions:

- Start free trial.
- Sign in.

**Footer content**

- Firestore.tv logo and short brand statement.
- Product, Devices, How it works, Plans, and FAQ links.
- Sign in and Support.
- Terms of Service and Privacy Policy.
- Content-availability disclaimer.
- Copyright notice with the current year.

Footer links must use canonical URLs and must not retain legacy `fire-store.tv`, shop, WhatsApp, or checkout destinations unless intentionally approved.

---

## 5. Component architecture

Keep `app/page.tsx` primarily declarative and place reusable landing sections under a dedicated folder.

```text
app/
  page.tsx
  layout.tsx
  globals.css
components/
  landing/
    LandingHeader.tsx
    Hero.tsx
    ProductShowcase.tsx
    ViewingExperiences.tsx
    DeviceEcosystem.tsx
    SetupComparison.tsx
    HowItWorks.tsx
    TrialBanner.tsx
    PlansTeaser.tsx
    LandingFaq.tsx
    LandingFooter.tsx
    landing-content.ts
public/
  images/
    landing/
```

### Rendering approach

- Keep static copy and layout in Server Components by default.
- Use Client Components only for interactive tabs, mobile navigation, and any behavior that genuinely requires browser state.
- Keep section content in one typed data module where practical.
- Reuse existing buttons, containers, logos, and typography primitives when they meet the new design requirements.
- Avoid adding a new animation or UI dependency for behavior that can be handled reliably with CSS and small local components.

### Authentication integration

Update the existing authentication form only if necessary so that:

- `mode=signup` selects registration on initial render.
- A safe `redirectTo` value is preserved through registration and confirmation.
- Missing or invalid query values fall back safely.
- Existing sign-in behavior and signed-in redirect to `/browse` remain unchanged.
- Open redirects are not introduced.

---

## 6. Visual system

### Color direction

Use existing approved brand values when available. If the Next.js application has no established tokens, begin with a small semantic set rather than hard-coded section colors:

- Page background: near-black charcoal.
- Elevated surface: warm dark gray.
- Secondary surface: slightly lighter charcoal.
- Primary text: warm off-white.
- Secondary text: accessible cool or neutral gray.
- Brand accent: ember orange.
- Accent hover: brighter warm orange.
- Border: low-contrast white or warm-gray alpha.
- Success and warning colors: reserved for actual status, not decoration.

All text, controls, borders, and focus states must meet appropriate contrast requirements.

### Typography

- Use a cinematic display face for major headlines only.
- Use a highly legible sans-serif for body copy, controls, navigation, and product mockups.
- Keep the hero headline fluid rather than relying on many viewport-specific font-size overrides.
- Avoid all-caps body copy and very narrow condensed text at small sizes.

### Layout

- Maximum content width: approximately 1,280–1,400px.
- Use generous desktop spacing while preserving short-screen usability.
- Maintain consistent section gutters and vertical rhythm.
- Product preview frames: approximately 20–28px corner radius.
- Avoid edge-to-edge text on mobile.

### Motion

Permitted motion:

- Soft hero entrance.
- Subtle product-panel depth or parallax on capable desktop devices.
- Small card lift or border change on hover.
- Short crossfade between manually selected product tabs.
- Header background transition after scrolling.

Motion constraints:

- Respect `prefers-reduced-motion`.
- Do not autoplay a distracting video with sound.
- Do not auto-rotate tabs or media rails.
- Avoid flame particles, constant marquees, bouncing CTAs, and scroll-jacking.
- Keep interactions responsive and avoid long entrance sequences.

---

## 7. Responsive behavior

### Mobile, 320–767px

- Stack hero copy above one simplified product frame.
- Keep the primary CTA full-width or strongly dominant.
- Ensure the header CTA remains visible and the navigation is easy to dismiss.
- Allow product tabs to scroll horizontally without clipping labels.
- Replace multi-device compositions with one main device and one supporting device.
- Stack comparison rows into paired labels rather than forcing a narrow table.
- Use natural document flow; do not set fixed section heights.

### Tablet, 768–1023px

- Use a balanced stacked or two-column hero depending on available width.
- Preserve the interactive product preview without miniature unreadable UI.
- Use two-column editorial panels when readable and stack otherwise.

### Desktop, 1024px and above

- Use the full split hero and layered product composition.
- Alternate viewing-experience panels.
- Add restrained depth effects where they do not harm performance.
- Keep important content within comfortable line lengths.

Verify the page at 320px, 375px, 768px, 1024px, 1280px, 1440px, and a large desktop width. Also test browser zoom at 200%.

---

## 8. Asset plan

### Required assets

- Canonical light/dark Firestore.tv logo exports.
- Product UI screens for hero and showcase states.
- Original abstract thumbnails for live, movie, series, and sports examples.
- Device frames or product compositions.
- Favicon and social-sharing image.

### Asset rules

- Do not use recognizable movie posters, actors, sports broadcasts, league marks, or network marks without explicit usage rights.
- Product screenshots must not contain customer data, account identifiers, credentials, or unlicensed artwork.
- Prefer AVIF or WebP for photographic or rendered artwork.
- Use SVG for interface icons and logos when appropriate.
- Declare intrinsic image dimensions to prevent layout shifts.
- Prioritize only the actual above-the-fold image; lazy-load below-the-fold media.
- Provide useful alt text for meaningful images and empty alt text for decorative layers.

---

## 9. Metadata and discoverability

Update `app/layout.tsx` or route metadata with verified canonical brand details:

- Page title focused on Firestore.tv and the core viewing experience.
- Plain-language meta description without catalog-size or availability exaggeration.
- Canonical URL.
- Open Graph title, description, URL, site name, and branded image.
- Twitter/X card metadata where appropriate.
- Current favicon and application icons.
- Consistent `Firestore.tv` naming everywhere.

Create a branded social-sharing image using owned interface visuals. Do not create a collage of third-party entertainment artwork.

---

## 10. Accessibility requirements

- Provide a skip-to-content link.
- Use a single page-level `h1` and logical heading order.
- Use semantic landmarks for header, navigation, main content, and footer.
- Make every interaction keyboard operable.
- Provide visible focus states that fit the orange brand system.
- Ensure tabs, disclosures, and mobile navigation expose accurate accessible states.
- Do not communicate state or meaning with color alone.
- Maintain minimum touch-target sizes.
- Test screen-reader names for all CTAs and icon-only controls.
- Ensure product mockup text does not contain essential information unavailable elsewhere.
- Respect reduced-motion, forced-colors, and high-contrast preferences where practical.

---

## 11. Performance requirements

- Keep the first viewport functional without client-side JavaScript.
- Minimize Client Component boundaries and hydration work.
- Use the framework image and font optimization paths where appropriate.
- Avoid loading all product-preview artwork at full resolution on initial render.
- Prevent layout shift by reserving space for product previews and fonts.
- Avoid large animation libraries unless already present and justified.
- Test on a throttled mobile connection and mid-range mobile CPU profile.
- Review Core Web Vitals, with special attention to the hero image, font loading, and tab-preview layout shifts.

Suggested targets for the production page:

- No horizontal overflow at supported widths.
- No unexpected cumulative layout shift.
- Largest Contentful Paint driven by one intentionally prioritized hero asset.
- Interaction latency remains low for mobile navigation, tabs, and FAQ controls.

---

## 12. Analytics and conversion measurement

Use the project’s existing analytics system rather than adding a second provider.

Recommended events:

- `landing_view`
- `trial_cta_click`, including section location
- `signin_click`
- `product_tab_select`, including selected category
- `how_it_works_view`
- `plans_click`
- `faq_open`, including question identifier
- `signup_mode_opened`
- `trial_activation_started`, only when available from the authenticated application

Do not send email addresses, account identifiers, free-form FAQ content, or other personal information in event payloads. Confirm cookie and consent requirements before enabling nonessential analytics.

Primary conversion funnel:

```text
Landing view
  → Trial CTA click
  → Registration opened
  → Account created
  → Eligible trial activation started
  → Trial activated
```

---

## 13. Implementation sequence

### Phase 0 — Normalize facts and target

- [ ] Confirm the target repository and framework.
- [ ] Confirm canonical brand name, domain, support address, and plans URL.
- [ ] Verify trial, device, quality, content, and account claims.
- [ ] Audit existing design primitives, authentication behavior, and route handling.
- [ ] Inventory approved logos, screenshots, fonts, and artwork.

### Phase 1 — Foundation

- [ ] Define or normalize semantic color, typography, spacing, radius, and shadow tokens.
- [ ] Establish the landing-page content container and section rhythm.
- [ ] Create the reusable CTA treatment and focus states.
- [ ] Add the landing component structure and typed content data.

### Phase 2 — First meaningful preview

- [ ] Build the sticky header and responsive navigation.
- [ ] Build the hero copy and CTA hierarchy.
- [ ] Build the layered hero product composition.
- [ ] Validate the first viewport on mobile, tablet, short laptop, and wide desktop screens.

### Phase 3 — Product storytelling

- [ ] Build the accessible product-showcase tabs.
- [ ] Add Live TV, Movies, Series, and Sports preview states.
- [ ] Build the three editorial viewing-experience panels.
- [ ] Add the shared content-availability note.

### Phase 4 — Reassurance and conversion

- [ ] Build the device ecosystem section.
- [ ] Build the less-setup comparison.
- [ ] Build the three-step “How it works” path.
- [ ] Add the trial conversion banner.
- [ ] Add the plans teaser with the verified canonical destination.

### Phase 5 — Supporting content

- [ ] Build the accessible FAQ.
- [ ] Build the final conversion banner and footer.
- [ ] Add legal, support, and content-availability links.

### Phase 6 — Authentication and metadata

- [ ] Support direct registration mode in the existing auth form.
- [ ] Validate and safely preserve the post-registration redirect.
- [ ] Preserve existing sign-in and signed-in redirect behavior.
- [ ] Update metadata, favicon, canonical URL, and social-sharing image.

### Phase 7 — Instrumentation and verification

- [ ] Add approved analytics events without personal data.
- [ ] Run formatting, linting, type checking, tests, and production build.
- [ ] Validate every navigation item and CTA destination.
- [ ] Test keyboard navigation, screen-reader names, focus order, and reduced motion.
- [ ] Test responsive layouts and 200% browser zoom.
- [ ] Test performance on a throttled mobile profile.
- [ ] Review all visible claims and artwork one final time.

---

## 14. Verification matrix

### Conversion

- Every primary CTA opens registration mode directly.
- Sign-in links open sign-in mode.
- Registration preserves only approved internal redirect destinations.
- The trial offer uses identical terms in the hero, banners, FAQ, and account flow.
- Plans links use the canonical destination.

### Navigation and interaction

- Header anchors reach the correct sections without hiding headings below the sticky bar.
- Mobile navigation opens, closes, traps or manages focus appropriately, and responds to Escape.
- Product tabs work with pointer, keyboard, and touch input.
- FAQ disclosures expose correct expanded states.
- Back and forward navigation are not disrupted.

### Responsive layout

- No overflow at 320px.
- No essential copy is embedded only inside images.
- Product-interface details remain legible or simplify appropriately.
- CTAs do not wrap awkwardly or fall below decorative artwork.
- The sticky header does not consume excessive mobile viewport height.

### Accessibility

- Heading hierarchy and landmarks are correct.
- Color contrast and visible focus meet accessibility expectations.
- Decorative images are ignored by assistive technology.
- Meaningful images have concise alternative text.
- Reduced-motion mode removes nonessential transitions and parallax.

### Content and legal safety

- Brand name and domain are consistent.
- No unlicensed entertainment or sports artwork appears.
- No unsupported content, quality, timing, or device claims appear.
- Trial eligibility and content-availability disclaimers are present but not used to conceal contradictory headline claims.
- Terms, privacy, and support links work.

### Regression

- Existing `/login` behavior still works.
- Existing signed-in redirect to `/browse` still works.
- Account, plans, subscription, and playback behavior are unchanged.
- The production build completes without warnings caused by the landing page.

---

## 15. Completion criteria

The landing page is ready when:

- A new visitor can understand the product and trial within the first viewport.
- The product interface is the main visual proof rather than generic marketing artwork.
- The 24-hour free trial is the dominant action without obscuring sign in.
- All product, trial, device, quality, and availability claims have been verified.
- Primary CTAs open registration mode and preserve a safe internal redirect.
- The page is polished from 320px mobile screens through large desktops and at 200% zoom.
- Keyboard navigation, screen-reader labeling, focus states, contrast, and reduced motion have been validated.
- No unlicensed media or unsupported marketing claims are present.
- Metadata, canonical URLs, footer links, and brand naming consistently use Firestore.tv.
- Analytics measure the conversion funnel without collecting personal information.
- The production build passes and every CTA has been manually verified.
- Existing signed-in routing and application behavior remain intact.

---

## 16. Out of scope

- Subscription-provider or billing changes.
- Database or Firestore schema changes.
- Playback-engine changes.
- Content-ingestion or catalog-management changes.
- Trial-provisioning backend changes.
- New authentication providers.
- Full pricing redesign before verified pricing data is available.
- Use of third-party entertainment artwork without confirmed rights.

