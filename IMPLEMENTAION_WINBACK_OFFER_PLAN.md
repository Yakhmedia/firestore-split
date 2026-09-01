# Fire Store Win-Back Offer — Landing Page Implementation Plan

## 1. Objective

Update the Fire Store landing page and checkout flow before launching the new 7-day win-back email campaign.

The page must convert expired customers into annual subscribers while protecting the existing $79 annual selling price. The promotion should add value through extra screen access instead of applying another visible percentage discount.

## 2. Approved Campaign Offer

**Offer name:** Returning Customer Screen Upgrade

**Offer:** 12 months with 2-screen access for the existing 1-screen annual price of **$79**.

**Positioning:**

> Come back for 12 months and get your second screen FREE.

**Primary CTA:**

> Reactivate & Get 2 Screens

**Reply CTA used in campaign messaging:**

> Reply RENEW and we'll activate your account instantly.

**Secondary CTA:**

> Not ready yet? Reply TEST to request a trial.

### Offer rules

- Target audience: expired previous customers.
- Eligible plan: 12-month subscription only.
- Included access: 2 simultaneous screens.
- Campaign price: $79 total.
- Duration: available during the real 7-day campaign window.
- Application: automatic at checkout; no coupon entry.
- Availability: visible through the campaign URL, not on the normal public page.
- Standard visitors must continue to see the existing plans and pricing.
- Do not advertise an extra dollar or percentage saving unless the normal 2-screen annual price is verified.
- Use “2 screens” consistently. Do not describe the offer merely as “2 devices” if it actually means two simultaneous streams.

## 3. Required Customer Journey

```text
Brevo win-back email
    -> campaign-specific landing-page URL
    -> returning-customer offer displayed on annual card
    -> customer clicks the offer CTA
    -> annual 2-screen option is added automatically
    -> checkout shows the free screen upgrade and $79 total
    -> successful payment activates the subscription
    -> CRM updates STATUS to active and removes customer from win-back emails
```

## 4. Campaign URL and Offer State

Use the existing landing page with a campaign query parameter:

```text
https://fire-store.tv/?promo=winback#plans
```

Add channel tracking parameters to each email CTA:

```text
https://fire-store.tv/?promo=winback&utm_source=brevo&utm_medium=email&utm_campaign=winback_screen_upgrade&utm_content=day1#plans
```

Change `utm_content` for each email:

- `day1_welcome_back`
- `day3_value`
- `day5_expires_soon`
- `day7_last_day`

### Page-state logic

When `promo=winback` is present and the campaign is active:

1. Store the promotion state in the server-side cart/session.
2. Display the win-back announcement bar.
3. Replace the normal annual pricing card with the campaign version.
4. Preselect the annual 2-screen option.
5. Change the annual CTA to the campaign CTA.
6. Preserve the promotion while the customer moves to cart and checkout.
7. Apply the upgrade on the server before calculating the final total.

When the parameter is missing, invalid, or expired:

1. Show the normal public plans section.
2. Do not apply the free screen upgrade.
3. If an expired campaign link is opened, show a short “This offer has ended” notice and direct the visitor to the standard plans.

Do not rely on front-end JavaScript alone to set the price or screen allowance. The cart and checkout must validate the offer server-side.

## 5. Landing-Page Changes

### 5.1 Campaign announcement bar

Display only when the win-back offer state is active.

**Copy:**

> 🔥 Returning Customer Offer: Get 12 Months + a FREE Second Screen for $79

**Supporting copy:**

> Available for a limited time through your comeback invitation.

**CTA:**

> Claim My Upgrade

The CTA scrolls directly to the annual campaign card.

### 5.2 Plans-section heading

For campaign visitors, replace the standard plans heading with:

**Heading:**

> Welcome Back — Your Upgrade Is Ready

**Subheading:**

> Reactivate for 12 months and enjoy two screens at the regular one-screen annual price.

### 5.3 Annual campaign card

Make the annual card the visual focus of the section. Keep the other cards available but visually secondary.

**Card content:**

```text
RETURNING CUSTOMER OFFER

12 Months
2 Screens Included

$79 total

FREE Second-Screen Upgrade

Watch on two screens at the same time.
No coupon code required.

[Reactivate & Get 2 Screens]

Offer ends [REAL CAMPAIGN DEADLINE]
```

### 5.4 Card design requirements

- Add a “Returning Customer Offer” badge.
- Highlight “2 Screens Included.”
- Display “FREE Second-Screen Upgrade” beside the value statement.
- Keep `$79 total` prominent and unambiguous.
- Do not show a fake crossed-out price.
- Do not imply a recurring $79 renewal price unless that is the real renewal policy.
- Add a short explanation that two simultaneous screens allow two people to watch at once.
- Use one primary button on the card.
- On mobile, place the offer name, price, screen allowance, and CTA above the fold where practical.

### 5.5 Other plan cards

- Keep the monthly and 6-month options visible for customers who are not ready to choose annual.
- Do not apply the free second-screen upgrade to those plans.
- Do not add campaign discounts to every card.
- Give the annual campaign card stronger visual priority without making other plans unusable.

### 5.6 Trust and objection-handling block

Place a compact block immediately below the pricing cards.

**Heading:**

> Need Help Before You Reactivate?

**Content:**

- **Need help choosing?** Reply RENEW and our team will help you personally.
- **Want to test first?** Reply TEST to request a trial.
- **Need setup assistance?** We will help you activate and connect your devices.

Only include service, compatibility, content, or support claims that the business can consistently fulfill.

### 5.7 Win-back FAQ additions

Add these questions in the campaign state:

**What does “2 screens” mean?**  
It means two screens can use the subscription at the same time, subject to the normal service terms.

**Do I need a coupon code?**  
No. The free second-screen upgrade is applied automatically when you use this offer page.

**Is the offer available on monthly or 6-month plans?**  
No. This comeback upgrade is attached to the 12-month plan.

**Can I get help reactivating my account?**  
Yes. Reply RENEW to the campaign email and the team will assist you.

**Can I test the service first?**  
Reply TEST to the campaign email to request a trial, subject to approval and availability.

## 6. Checkout Implementation

### 6.1 Preferred implementation

Use a dedicated campaign product/variation or server-side promotion rule representing:

```text
Offer ID: WINBACK_2SCREEN_12M
Term: 12 months
Screens: 2
Customer total: $79
Promotion: second-screen upgrade included
```

If WooCommerce is processing the order, the campaign link should set the offer in the WooCommerce session. The CTA should add the correct annual 2-screen variation, and a server-side pricing rule should validate the active promotion before checkout totals are generated.

Do not create a permanently discoverable public product at the campaign price unless access is intentionally unrestricted.

### 6.2 Checkout display

The order summary must explicitly show:

```text
12-Month Fire Store Subscription
Access: 2 Screens
Returning Customer Screen Upgrade: FREE
Total: $79
```

The customer must see the same offer on the pricing card, cart, checkout, order confirmation, and internal order record.

### 6.3 Coupon behavior

- Do not ask the customer to enter a coupon.
- Do not expose a coupon field as the primary mechanism.
- If a WooCommerce coupon is used internally, apply it automatically and show a customer-friendly label such as “Returning Customer Screen Upgrade.”
- Prevent stacking with other discounts unless stacking is deliberately approved.
- Remove the promotion if the customer changes the product to an ineligible term or screen quantity.

### 6.4 Eligibility and link sharing

For the first campaign, `promo=winback` can function as a campaign-only link if limited sharing is an acceptable risk.

For stricter eligibility, use a short-lived signed token generated for each eligible contact. Do not place the customer's email address or other personal information directly in the URL. The server should verify the token, promotion, and expiration before applying the offer.

## 7. Expiration and Urgency

- Configure one genuine campaign end date and time before launch.
- Store the deadline in one server-side setting, such as `WINBACK_OFFER_END_AT`.
- Use the same deadline on the landing page, checkout, and all four emails.
- Use the customer's relevant timezone in email copy where possible and show a timezone beside the web deadline.
- Never use a countdown that resets when the page reloads.
- At expiration, disable the campaign CTA and return checkout pricing to the standard plan rules.
- Do not remove an already-paid upgrade from completed orders.

If the win-back program becomes a continuous automation rather than a one-time campaign, replace the global deadline with a contact-specific expiration set seven days after workflow entry.

## 8. Brevo and CRM Integration

### Entry segment

```text
STATUS = expired
AND Email exists
```

### Purchase completion actions

After confirmed payment:

1. Set `STATUS = active`.
2. Set `PLAN = 12_month_2_screens` or the exact approved plan value.
3. Update `EXPIRY_DATE` to the real service expiration date in `YYYY-MM-DD` format.
4. Record the order source as `winback_screen_upgrade`.
5. Remove the contact from the expired win-back segment.
6. Exit the customer from the 7-day campaign before the next email.
7. Notify the activation/support process if fulfillment is not fully automatic.

### High-intent handling

Create or update a high-intent segment for expired contacts who:

- clicked the campaign offer;
- reached checkout but did not complete payment; or
- replied to an email.

Prioritize those contacts for manual email or WhatsApp follow-up. Do not message customers on WhatsApp without the appropriate consent or existing service relationship.

## 9. Analytics and Conversion Tracking

Track these events with the existing analytics system:

| Event | Trigger | Required properties |
|---|---|---|
| `winback_offer_view` | Campaign state loads | campaign, source, email_day |
| `winback_offer_select` | Annual offer CTA clicked | plan, screens, price |
| `winback_checkout_start` | Checkout opens | plan, screens, price |
| `winback_purchase` | Payment confirmed | order_id, plan, screens, revenue |
| `winback_offer_expired` | Expired link is opened | campaign, source |

Preserve UTM parameters through checkout and save the campaign attribution with the order.

### Primary measurement

```text
Win-back conversion rate = completed win-back purchases / unique expired customers who received the campaign
```

Also monitor:

- landing-page offer views;
- annual-offer CTA rate;
- checkout-start rate;
- checkout-completion rate;
- reply rate;
- trial requests;
- revenue per campaign recipient;
- refunds and support issues related to screen access.

## 10. Accessibility, Mobile, and Performance

- Keep text contrast compliant and do not rely on color alone to identify the offer.
- Ensure buttons have clear focus states and keyboard access.
- Use semantic headings and accessible badge text.
- Keep the CTA at least 44px high on mobile.
- Verify that the pricing card does not overflow at common mobile widths.
- Avoid adding large scripts solely for the countdown or promotion state.
- Prevent layout shift when the standard card changes to the campaign card.
- Keep the campaign page as fast as the normal landing page.

## 11. Implementation Phases

### Phase 1 — Confirm commercial settings

- [ ] Confirm that the normal 1-screen annual price is $79.
- [ ] Confirm the normal 2-screen annual price and incremental fulfillment cost.
- [ ] Confirm that 2 screens means two simultaneous streams.
- [ ] Confirm whether the $79 applies only to the first 12 months or also to renewal.
- [ ] Select the real campaign start and expiration timestamps.
- [ ] Confirm whether campaign-link sharing is acceptable for the first launch.

### Phase 2 — Build the campaign page state

- [ ] Detect and validate `promo=winback`.
- [ ] Add the campaign announcement bar.
- [ ] Add the campaign plans heading and supporting copy.
- [ ] Build the annual 2-screen campaign card.
- [ ] Keep the monthly and 6-month cards available but secondary.
- [ ] Add the objection-handling block and campaign FAQ.
- [ ] Add expired-offer behavior.
- [ ] Add responsive styles and accessibility states.

### Phase 3 — Connect cart and checkout

- [ ] Create the campaign offer ID or eligible product variation.
- [ ] Persist the promotion in the server-side session.
- [ ] Preselect 12 months and 2 screens.
- [ ] Apply the free second-screen upgrade automatically.
- [ ] Prevent invalid plan changes and discount stacking.
- [ ] Display the promotion consistently in cart and checkout.
- [ ] Save plan, screens, promotion, and attribution with the order.
- [ ] Verify payment-webhook and fulfillment behavior.

### Phase 4 — Connect CRM and analytics

- [ ] Add UTM parameters for all four email links.
- [ ] Implement campaign view, CTA, checkout, and purchase events.
- [ ] Preserve campaign attribution through payment.
- [ ] Update `STATUS`, `PLAN`, and `EXPIRY_DATE` after payment.
- [ ] Ensure active customers exit the win-back workflow.
- [ ] Route clicks, replies, and checkout abandonment to high-intent follow-up.

### Phase 5 — QA and launch

- [ ] Complete the test matrix below.
- [ ] Place a successful test order.
- [ ] Confirm the correct subscription is provisioned with 2-screen access.
- [ ] Confirm the CRM updates and automation exit.
- [ ] Confirm the customer receives the correct receipt and activation message.
- [ ] Confirm the normal public plans page remains unchanged.
- [ ] Back up the current landing page before production deployment.
- [ ] Publish the landing-page update before scheduling Email 1.

## 12. QA Test Matrix

| Scenario | Expected result |
|---|---|
| Normal homepage visit | Standard plans and prices appear |
| Valid win-back URL | Campaign bar and annual 2-screen offer appear |
| Win-back CTA clicked | Correct annual 2-screen item opens in cart/checkout |
| Checkout summary | 12 months, 2 screens, free upgrade, $79 total |
| Customer changes to monthly | Upgrade is removed and standard price applies |
| Customer changes to 6 months | Upgrade is removed and standard price applies |
| Other promotion is entered | Stacking follows the approved rule |
| Page reload during checkout | Valid promotion remains in the session |
| Expired campaign URL | Expired notice appears; standard plans remain available |
| Direct checkout without campaign state | Standard pricing applies |
| Successful payment | Correct order, access, CRM status, plan, and expiry are recorded |
| Failed/cancelled payment | Subscription remains inactive and CRM is not marked active |
| Duplicate webhook | Customer is not provisioned or charged twice |
| Mobile visit | Offer and CTA are readable and usable without overflow |
| Email Day 1–7 links | Correct UTM content value is captured |

Test at minimum on:

- Chrome desktop and Android;
- Safari desktop and iPhone;
- Edge desktop;
- logged-in and logged-out customer states;
- standard, campaign, expired-campaign, payment-success, and payment-failure paths.

## 13. Launch Acceptance Criteria

The landing page is ready for the email campaign only when all of the following are true:

- The public plans page remains unchanged for ordinary visitors.
- The campaign URL displays the correct annual 2-screen offer.
- The CTA sends the correct product configuration to checkout.
- Checkout requires no coupon entry.
- The order summary shows 12 months, 2 screens, and a $79 total.
- The promotion cannot be applied to ineligible plans.
- The real expiration is enforced server-side.
- Successful payment provisions the correct access.
- Brevo receives the updated active status before the next scheduled email.
- Campaign attribution and conversion events are recorded.
- Mobile and desktop QA passes.
- The normal checkout remains functional after deployment.

## 14. Rollback Plan

If the campaign state or checkout rule causes an issue:

1. Disable the `promo=winback` feature flag or campaign configuration.
2. Stop new campaign traffic from entering the promotional checkout path.
3. Restore the normal annual card and standard checkout rules.
4. Keep a record of completed campaign orders and honor their 2-screen entitlement.
5. Fix and retest the campaign state in staging before re-enabling it.

## 15. Deliverables Before Email Copy Production

- Live campaign URL.
- Final annual campaign card and mobile layout.
- Working automatic checkout offer.
- Verified $79 order with 2-screen entitlement.
- Configured campaign deadline.
- Analytics events and UTM structure.
- CRM purchase-update and workflow-exit logic.
- Screenshots of landing page, cart, and checkout for campaign review.

Once these deliverables pass QA, proceed to write and schedule the four-email sequence for Days 1, 3, 5, and 7 around the free second-screen upgrade.
