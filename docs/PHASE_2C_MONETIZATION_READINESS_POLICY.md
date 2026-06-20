# Phase 2C Monetization Readiness Policy

Owner: A3 SEO / monetization readiness support lane

Governance: CEO-led, PM-integrated, following `karpathy-guidelines`

Status: prepared; no ad code implemented

Slice: `phase_2c_monetization_readiness_policy`

## Decision

Do not implement advertising placement yet.

Do not implement anti-AdBlock behavior.

Prepare monetization policy, placement inventory, sponsor path, and analytics boundaries first.

## Why This Comes Before Ads

- GSC sitemap submission is accepted, but GSC Pages indexing data is still processing.
- Early SEO trust is more valuable than short-term ad impressions.
- Intrusive ads can harm UX, Core Web Vitals, crawl interpretation, and brand trust.
- Anti-AdBlock behavior is not aligned with a trust-first investor information product.
- Market Signal must avoid any impression that ads are investment advice, recommendations, endorsements, or guaranteed-return content.

## Current Execution Boundary

```text
adCodeImplemented=false
adsenseApplicationStarted=false
adNetworkIntegrated=false
antiAdBlockImplemented=false
adBlockDetectionImplemented=false
contentBlockingForAdBlock=false
sponsorSalesStarted=false
personalizedAdsAllowed=false
investmentAdviceAdsAllowed=false
supabaseChange=false
sqlChange=false
marketDataFetchChange=false
stockIndexingChange=false
```

## Allowed Work Now

Allowed in this phase:

- Define monetization principles.
- Define ad placement inventory without rendering ads.
- Define banned ad categories.
- Define sponsorship disclosure rules.
- Define privacy-safe analytics events for future ad/sponsor measurement.
- Keep the site fully usable for users with ad blockers.

Not allowed in this phase:

- Add Google AdSense script or any ad network script.
- Add affiliate widgets or tracking pixels.
- Add anti-AdBlock detection.
- Block content for ad blocker users.
- Add popups asking users to disable blockers.
- Place ads next to signal scores in a way that can be confused with recommendations.
- Run Google Ads campaigns.
- Start paid sponsorship sales before disclosure and review rules are ready.

## Ad Category Policy

Allowed later only after PM/CEO review:

- General productivity tools.
- Books, courses, or education content without guaranteed-return language.
- Data tools or financial education products with clear disclosure.
- Direct sponsor placements that pass editorial and risk review.

Banned:

- Guaranteed returns.
- Stock tips, signals-for-sale, investment advisory claims, or buy/sell recommendation services.
- High-leverage trading products.
- Get-rich-quick claims.
- Unreviewed crypto, CFD, binary options, gambling, or loan products.
- Any ad that implies Market Signal endorses a specific trade.

Required disclosure:

```text
Ads or sponsorships do not influence Market Signal scores and are not investment advice.
```

## Placement Inventory: Planning Only

Candidate placements for a future limited test:

| route | candidate placement | phase | notes |
|---|---|---|---|
| `/` | below first dashboard section | future P3 | never above first screen |
| `/briefing` | after main briefing summary | future P3 | must not interrupt risk explanation |
| `/weekly` | after weekly summary section | future P3 | one placement maximum |
| `/stocks/[symbol]` | disabled for now | not approved | avoid mixing ads with symbol-specific signals |
| `/methodology` | disabled | not approved | preserve trust and clarity |
| `/disclaimer` | disabled | not approved | avoid legal/trust confusion |
| `/privacy` | disabled | not approved | no ads |
| `/terms` | disabled | not approved | no ads |

## Anti-AdBlock Policy

```text
antiAdBlockPolicy=no-blocking
```

Rules:

- Do not detect ad blockers.
- Do not block content for ad blocker users.
- Do not degrade site function when ads are blocked.
- Do not show hostile prompts.
- A future soft support message may be considered only after PM/CEO review, and it must be dismissible and non-blocking.

## Direct Sponsor Path

Direct sponsorship is preferable to automatic ad networks during early trust-building.

Before any sponsor placement:

- Sponsor disclosure copy must be approved.
- Sponsor category must pass banned-category review.
- Sponsor placement must be visually separated from signal scores.
- Sponsor must not claim influence over scores, methodology, ranking, or coverage.
- Sponsor click tracking must respect the privacy boundary.

## Analytics Boundary

Allowed future events:

- `sponsor_slot_viewed`
- `sponsor_slot_clicked`
- `support_message_viewed`
- `support_message_dismissed`

Not allowed:

- Tracking a user's personal investment intent.
- Tracking portfolio, holdings, or watchlist as ad targeting data.
- Selling or exporting user behavior for ad targeting.
- Personalized financial advertising without explicit PM/CEO privacy review.

## First Implementation Slice Later

The first future implementation slice, if approved, should be:

```text
phase_2c_sponsor_disclosure_and_placeholder_slot
```

Scope:

- Add non-rendering placeholder config only, or one disabled sponsor slot component behind a hardcoded off flag.
- No third-party ad network script.
- No anti-AdBlock behavior.
- No stock route placement.

## PM / CEO Decisions Needed Before Ads

- Whether to prefer direct sponsors, AdSense, affiliate, or no ads during public beta.
- Whether any sponsor categories are allowed before first stable organic traffic baseline.
- Whether privacy policy needs update before any sponsor click tracking.
- Whether route-level ad placements require legal review.
- When GSC Pages data is stable enough to consider a single non-intrusive test.

## Requires PM Integration

Requires PM integration: yes.

Reason:

- Monetization affects trust, legal posture, privacy, public UX, and SEO interpretation.
- A3 can prepare policy and checks, but PM/CEO must approve any actual ad or sponsor implementation.
