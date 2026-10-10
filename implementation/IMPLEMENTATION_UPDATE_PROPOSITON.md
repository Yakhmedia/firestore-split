# Implementation Plan: US Entertainment & Multi-Sport Frontend Alignment

This document outlines the proposed changes to transition the **Fire Store** landing page into a comprehensive entertainment and premium sports hub tailored for the US market. The target is to appeal not only to sports fans (shifting from soccer-only to NFL, NBA, MLB, UFC) but also to US TV and movie lovers by highlighting trending entertainment channels, movies, and TV shows.

---

## Proposed Frontend Enhancements

### 1. Hero & Branding Refactor
* **Headline & Sub-headline:** Refactor to emphasize both premium live TV, major US sports leagues, and on-demand movies/shows.
* **Hero Badges/Ticker:** Rotate between top US live events (e.g., NFL Sunday, Oscars/Emmys, NBA Finals, trending Netflix/HBO releases).
* **Hero Visual Background:** Switch from a single soccer theme to a dynamic glassmorphic grid or video/carousel background showcasing cinematic movie posters, popular TV series characters, and US sports action (NFL, NBA, UFC).

### 2. Live & Trending Hub (Replacing the Soccer-Only Match Schedule)
* **Tabbed Category Selector:** Replace the World Cup schedule slider with a dynamic tabbed interface:
  * `🔥 Trending Today` | `🎬 Movies & TV Shows` | `🏈 US Sports` | `⚽ World Cup 2026`
* **Card Refactor:**
  * **Movies/TV Shows Tab:** Showcase high-quality cards with posters of trending shows in the US (e.g., *House of the Dragon*, *The Last of Us*, *Stranger Things*, new box office movies).
  * **US Sports Tab:** Display schedule cards for upcoming NFL, NBA, MLB, and UFC events with network badges (ESPN, FOX, HBO, etc.).
  * **World Cup Tab:** Retain the 4K World Cup match cards for the soccer audience.

### 3. Localization of Features & Channels
* **Channel Grid Mockup:** Add an interactive logo grid showcasing popular US networks and streaming platforms included in the subscription (e.g., ESPN, HBO, Showtime, Paramount+, Peacock, Bravo, AMC).
* **Feature Card Adjustments:**
  * Rewrite features to highlight **60 FPS** live sports streams and **4K HDR cinematic audio/video** for TV series and movies.
  * Add a specific feature highlighting local network coverage (preventing regional blackouts for NFL/NBA games).

### 4. Checkout & Trust Upgrades
* **Payment Badges:** Highlight US-preferred checkout options (Apple Pay, Google Pay, Visa/Mastercard, PayPal).
* **Localized Reviews:** Swap international soccer testimonials with reviews from US users discussing movie nights, family entertainment, and streaming American football.

---

## Progress Checklist

- [x] **Phase 1: Brand & Layout Restructuring**
  - [x] Update browser window title, meta descriptions, and header links in `index.html` to reflect movies, TV shows, and multi-sport live TV.
  - [x] Redesign the navbar to include an entertainment link (e.g., "Movies & Shows").
  - [x] Implement the new Hero section layout with combined sports and entertainment branding.

- [x] **Phase 2: The Entertainment & Sports Hub (Interactive Slider)**
  - [x] Create CSS/JS controls for category tabs (`Trending`, `Movies & TV`, `US Sports`, `World Cup`).
  - [x] Prepare asset folders for trending movies/TV show poster images and US sports icons.
  - [x] Update slider logic in `main.js` to render items based on the active tab selection.

- [x] **Phase 3: US Channel Showcase & Value Props**
  - [x] Build the interactive channel/network logo strip.
  - [x] Rewrite features list to highlight 60 FPS sports, 4K movies, and anti-freeze guarantees for big Sunday games.
  - [x] Update the Device Selector labels to emphasize family streaming (multiple screens for kids' cartoons, parents' shows, and live sports).

- [x] **Phase 4: Social Proof & Checkout Polish**
  - [x] Replace existing soccer-centric testimonials with localized US reviews referencing US television, movies, and football/basketball.
  - [x] Redesign the payment badging area near checkout buttons to highlight PayPal, Credit Card, Crypto\s.
  - [x] Verify that all text styling, animations, and image placeholders align correctly across mobile and desktop viewports.
