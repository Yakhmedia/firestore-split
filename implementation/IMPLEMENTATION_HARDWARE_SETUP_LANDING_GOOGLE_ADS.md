# Implementation Plan — Hardware & Setup Landing Page (Google Ads–Compliant)

**Date:** 2026-10-10
**Files touched:** new `setup.html`, new `setup.js` (optional), `styles.css` (shared), `vite.config.js` (add entry), assets
**Goal:** Ship a landing page Google Ads will actually approve **and keep approved** by advertising the *legitimate, licensable* side of the business — Fire TV streaming **devices**, 4K **setup**, cables/mounts/accessories, and **support** — with zero unlicensed-content claims, zero third-party trademarks, and zero "100,000 channels / every network" signals.

> **Why this exists:** The current `index.html` advertises an unlicensed IPTV subscription (100,000+ channels, ESPN/NFL/Netflix/Disney+ logos, "Every Game. Every Network."). That offer is not ad-eligible on Google and will be suspended on review or on a rightsholder complaint. This plan does **not** try to disguise that offer — it builds a separate, honest product (hardware + setup service) that can be advertised legitimately.

---

## 0. Read this first — the hard gate (domain-level review)

Google Ads reviews the **whole destination site and domain**, not just the URL in the ad. A clean `setup.html` living on `fire-store.tv` **will still fail** as long as the IPTV content pages (`index.html`, `channels.html`, the NFL/win-back campaigns) are reachable on the same domain and linked in nav/footer.

**You must pick one of these before a single ad can pass:**

| Option | What it means | Review outcome |
|---|---|---|
| **A. Separate clean domain** (recommended) | Host hardware/setup landing on `fire-store.shop` (already a commerce domain) or a new domain. Ads point there. `fire-store.tv` is never referenced from it. | Cleanest. No cross-contamination. |
| **B. Fully convert `fire-store.tv`** | Remove/redirect `channels.html`, the IPTV plans, logo strips, and all content claims sitewide. The subscription offer goes away entirely. | Works, but kills the current revenue page. |
| **C. Hybrid** | Keep IPTV pages but `noindex` + unlink them and point ads only at the shop domain. | **Not reliable** — reviewers and automated crawlers still find unlinked pages; one complaint suspends the ad account. Documented here only to be rejected. |

**Decision needed:** A vs. B. This plan is written so the `setup.html` artifact works for either — it just changes *which domain* it's deployed to and whether the IPTV pages survive. **Do not run ads from a domain that still serves the content offer.**

---

## 1. The ad angle (positioning)

Sell the **outcome and the gear**, never the content.

- **Product:** 4K streaming devices (Fire TV Stick class), HDMI 2.1 cables, TV mounts, bias/LED backlights — plus an optional **setup & configuration service** and **support**.
- **Promise:** "Get your TV set up for 4K streaming in minutes — the right device, the right cable, and real human help."
- **What we never say:** channel counts, network/league/app names, "live sports," "every game," "watch [anything]," prices-per-month for content, "subscription" for content.
- **What we legitimately say:** device specs, 4K/HDR capability of the *hardware*, shipping, warranty, setup help, returns.

This is a **physical-goods + service** ad, which is squarely ad-eligible.

---

## 2. Page layout (target)

```
┌───────────────────────────────────────────────┐
│  Fire Store                      [Shop Devices]│  ← trimmed navbar, no IPTV links
├───────────────────────────────────────────────┤
│  Stream in 4K — set up in minutes.             │  ← hero: hardware benefit
│  The right streaming device, cable & mount —    │
│  shipped fast, set up with real human help.     │
│  [Shop Streaming Devices]  [Get Setup Help]     │
│  🚚 Free shipping $50+ · 🛡️ 2-yr warranty       │
├───────────────────────────────────────────────┤
│  Product grid (4 real SKUs)                     │
│  📺 4K Streaming Stick  🔌 HDMI 2.1 Cable        │
│  🖥️ TV Mount            💡 LED Backlight          │
│  → each links to fire-store.shop product        │
├───────────────────────────────────────────────┤
│  Setup & Support service                        │
│  "We'll get you running" — 3 steps, device-only │
├───────────────────────────────────────────────┤
│  Why Fire Store (hardware trust row)            │
│  Certified gear · Fast dispatch · Human support │
├───────────────────────────────────────────────┤
│  FAQ (hardware/shipping/returns only)           │
├───────────────────────────────────────────────┤
│  Footer: legal + contact + shop links           │
└───────────────────────────────────────────────┘
```

No hero sports image, no channel/logo strip, no plans-with-channel-counts, no campaign JS.

---

## 3. Section-by-section copy

### 3.1 Navbar
- Logo → `fire-store.shop` (or page top).
- Links: **Devices · Accessories · Setup Help · Support**. **Remove** Channels, "Why Fire Store" (IPTV), FAQ-about-streaming.
- CTA button: **"Shop Devices"** (not "Subscribe").

### 3.2 Hero
- **H1:** `Stream in 4K — set up in minutes.`
- **Sub:** `The right streaming device, the right cable, and real human help getting it running. Shipped fast, backed by a 2-year warranty.`
- **Primary CTA:** `Shop Streaming Devices →` (links to shop devices category)
- **Secondary CTA:** `Get Setup Help` (WhatsApp)
- **Trust line:** `🚚 Free shipping over $50 · 🛡️ 2-year warranty · 💬 Real human support`
- **Image:** a clean product/device or living-room photo. **No sports, no broadcast imagery.** (Reuse an existing neutral asset or source a new device shot — do **not** reuse `hero-football-*`.)

### 3.3 Product grid (reuse existing `.shop-grid` markup/styles)
Four real SKUs, each linking to its `fire-store.shop` category with UTM:
1. **4K Streaming Stick** — "Plug-and-play 4K HDR streaming device." (Describe it as a generic 4K streaming stick; don't preload or imply any content.)
2. **HDMI 2.1 Cable** — "4K@120 & 8K — no dropouts."
3. **TV Mount** — "Full-motion, tilting & fixed, 32–80\"."
4. **LED Backlight** — "Bias & screen-synced ambient glow."

### 3.4 Setup & support (replaces "How It Works")
Three steps, **device-only**:
1. **Pick your device** — we help you choose the right stick + cable for your TV.
2. **Ship & unbox** — same-day dispatch before 3pm; free over $50.
3. **We get you running** — WhatsApp/email setup help, real humans, under-2-min replies.

> Keep this strictly about installing/configuring the *device and network*. No wording about what to watch, log into, or stream.

### 3.5 Why Fire Store (hardware trust row — reuse `.why-strip`)
- 📦 **Certified, tested gear** — hand-checked before dispatch.
- ⚡ **Fast dispatch & free shipping** — out the door same day.
- 💬 **Real human support** — setup help under 2 minutes, 7 days a week.

### 3.6 FAQ (hardware/shipping/returns only)
Replace every streaming question with:
- "Which streaming device do I need for my TV?"
- "How fast do you ship and what does it cost?"
- "What's your return/warranty policy?"
- "Can you help me set it up?"
- "Do the devices work worldwide?" (answer re: voltage/plug/region of the hardware, not content)

### 3.7 Footer
- Keep Legal (`terms`, `privacy`, `refund`, `dmca`, `cookies`), contact, shop links.
- **Remove** "Channel List" link and any content references.
- Add a plain business-identity line (see §4.3).

---

## 4. Google Ads policy checklist (what review scores against)

### 4.1 Copyright / trademark (the original problem) — must all be TRUE
- [ ] No channel count anywhere ("100,000+", etc.) — incl. `<title>`, `meta description`, `meta keywords`, OG/Twitter tags.
- [ ] No third-party trademarks: NFL, NBA, UFC, college football, ESPN, FOX/NBC Sports, NFL Network, NBA TV, HBO/Max, Netflix, Disney+, Hulu, Paramount+. No brand logos, no brand-colored logo strip.
- [ ] No totality claims: "Every Game," "Every Network," "all your channels," "watch anything."
- [ ] No "live sports / live TV / live channels" content promises.
- [ ] No campaign JS (`nfl.js`, `winback.js`) loaded on this page — they inject trademarked matchups and channel counts.
- [ ] Device described by its own spec (4K HDR capable), never by what content it unlocks.

### 4.2 Required trust / transparency (Google wants these present)
- [ ] Clear, honest **business identity** and contact (email already `contact@firestore.tv`; add a business name + reachable method).
- [ ] Working **privacy policy**, **terms**, **refund/returns**, visible in footer (pages exist — verify they don't themselves reference the IPTV offer).
- [ ] **Pricing/shipping/returns** stated plainly for physical goods.
- [ ] Secure checkout (HTTPS) — already in place.
- [ ] No fake urgency / countdowns on the ads landing page (the win-back/NFL timers must not appear here).

### 4.3 Landing-page quality signals
- [ ] Destination matches ad text (ad about devices → page about devices).
- [ ] No broken links, no redirect to the IPTV domain.
- [ ] Mobile-friendly, fast (reuse existing CSS; skip the flame canvas / heavy hero if possible).
- [ ] Original, substantive content about the products.

### 4.4 Legal-page audit (often missed)
- [ ] `terms.html`, `refund.html`, `privacy.html`, `dmca.html` must **not** describe an IPTV subscription. If they do, they contradict the clean landing page and re-trigger review. Rewrite or scope them to the hardware business for the ad domain.

---

## 5. Ad account / campaign setup (outside the codebase)

1. **Destination domain** = the clean one from §0 (A or B). Verify in Google Ads it's the final URL and display URL.
2. **Campaign type:** Search + Shopping/PMax for physical products is the natural fit. Avoid keywords like "IPTV," "live channels," "watch [league]" — those keywords themselves draw copyright scrutiny. Target device/accessory intent: "4K streaming stick," "HDMI 2.1 cable," "full motion TV mount," "TV setup help."
3. **Ad copy:** mirror §3 — gear + setup + support. No content, no brands.
4. **Business verification:** complete Google Ads advertiser identity verification; expect it for a new commerce domain.
5. **Merchant Center** (for Shopping): feed the real SKUs with honest titles/specs. Content-subscription items must not be in the feed.
6. **Conversion tracking:** the existing `AW-700280271` tag can be reused *on the clean domain only*. Don't carry over the IPTV event names.

---

## 6. Build steps (code)

1. **Create `setup.html`** from the `index.html` shell but stripped: no flame canvas, no sports hero, no plans section, no channel strip, no campaign `<head>` blocks, no `nfl.js`/`winback.js`.
2. **Reuse existing styles:** `.shop-grid`, `.shop-card`, `.why-strip`, `.faq-section`, `.footer` already exist in `styles.css` — the page can be assembled almost entirely from existing classes. Add a small hero variant class if needed.
3. **Optional `setup.js`:** only if FAQ accordion is reused; otherwise ship static HTML (fewer moving parts = fewer review surprises).
4. **`vite.config.js`:** add `setup.html` as a build input so it ships.
5. **Clean `<head>`:** new title/description/OG with hardware copy only. Example:
   - `<title>Fire Store — 4K Streaming Devices, Cables & Setup Help</title>`
   - `description`: "Shop 4K streaming devices, HDMI 2.1 cables, mounts and accessories — fast free shipping, 2-year warranty, real human setup help."
6. **Keep the Google tags** (`G-G4KYGXE4YK`, `AW-700280271`) only if deploying to the clean domain.
7. **Link audit:** every link on the page stays within the clean domain or goes to `fire-store.shop`. Zero links to `channels.html` or the IPTV `index.html`.

---

## 7. Acceptance criteria

- [ ] `setup.html` contains **none** of the §4.1 forbidden terms (grep check in §8).
- [ ] Page renders with existing CSS, mobile-first, no console errors, no campaign JS.
- [ ] All footer legal pages reviewed and consistent with a hardware business.
- [ ] Ads point at a domain that serves **no** IPTV content page (the §0 gate).
- [ ] Ad copy + keywords contain no content/brand/league terms.

---

## 8. Verification grep (run before submitting for review)

```powershell
# From repo root — should return NOTHING for setup.html
Select-String -Path setup.html -Pattern `
  'NFL|NBA|UFC|ESPN|FOX Sports|NBC Sports|NFL Network|NBA TV|HBO|Max|Netflix|Disney|Hulu|Paramount|100,000|Every Game|Every Network|live sports|live TV|channels'
```

Any hit = a line to remove before the page is ad-eligible.

---

## 9. Out of scope / explicit non-goals

- This plan does **not** make the IPTV subscription ad-eligible. Nothing here is a workaround to advertise unlicensed content.
- It does **not** rewrite the IPTV offer to "look legal." If Option B is chosen, those pages are removed, not re-skinned.
- Detection-evasion tactics (cloaking, doorway pages, showing reviewers a different page than users) are **forbidden** — they are themselves a Google Ads violation and a fast route to a permanent account ban.
