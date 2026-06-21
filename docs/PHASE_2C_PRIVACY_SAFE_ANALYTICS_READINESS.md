# Phase 2C Privacy-safe Analytics Readiness

Owner: A3 Phase 2B / 2C SEO and monetization support lane

Governance: CEO-led, PM-integrated, karpathy-guidelines

Last updated: 2026-06-21

Slice: `phase_2c_privacy_safe_analytics_readiness`

Status: prepared; no analytics code implemented

## Purpose

This packet defines the privacy boundary for future analytics work before any GA4, Microsoft Clarity, Vercel Analytics, sponsor tracking, or ad measurement implementation.

The goal is to keep SEO and monetization observable without creating user-level investment intent tracking.

## Current Execution Boundary

```text
analyticsCodeImplemented=false
ga4Installed=false
clarityInstalled=false
vercelAnalyticsInstalled=false
thirdPartyTrackingScriptAdded=false
personalizedAdTargeting=false
investmentIntentTracking=false
watchlistAdTargeting=false
supabaseChange=false
sqlChange=false
marketDataFetchChange=false
stockIndexingChange=false
```

## Allowed Future Event Categories

Future implementation may define aggregate, privacy-safe events such as:

- `page_view`: route-level page view measurement.
- `cta_click`: clicks on public CTA surfaces such as methodology, briefing, weekly, disclaimer, or support links.
- `sponsor_slot_view`: aggregate visibility count for sponsor/supported placement slots, if a sponsor model is later approved.
- `sponsor_slot_click`: aggregate outbound click count for sponsor/supported placement slots, if a sponsor model is later approved.
- `support_message_view`: aggregate impression for public support or monetization explanation messages.
- `support_message_dismiss`: aggregate dismiss action for public support or monetization explanation messages.
- `seo_funnel_summary`: aggregate landing route and next-route summary for SEO quality observation.

Allowed events must be aggregate, route-level, and non-personalized.

## Disallowed Tracking

Future implementation must not include:

- Personalized ad targeting based on viewed stocks, watchlists, holdings, portfolio behavior, or inferred trading interest.
- Investment intent tracking at user level.
- Watchlist ad targeting.
- Individual stock preference profiling for ad targeting.
- Exporting or selling user behavior data.
- Content blocking for ad-block users.
- Anti-AdBlock detection or enforcement.
- Any analytics event that can be interpreted as a buy/sell intent signal.

## Tool Readiness Position

| tool | current status | implementation authority |
|---|---|---|
| Google Analytics 4 | not installed | requires PM/CEO approval |
| Microsoft Clarity | not installed | requires PM/CEO approval |
| Vercel Analytics | not installed | requires PM/CEO approval |
| AdSense / ad network pixels | not installed | out of scope for this slice |

## Privacy Policy Implication

Before any runtime analytics script is added, PM/CEO should confirm whether `privacy` needs an update for:

- Analytics provider name.
- Cookie or local storage behavior.
- Data retention and deletion statement.
- Whether events are aggregate-only.
- Whether personalized advertising is explicitly disabled.

## Event Naming Principles

- Use product-neutral event names.
- Prefer route-level and component-level aggregation.
- Do not encode stock symbols as ad-targeting attributes.
- Do not encode user holdings, watchlists, portfolio size, or trading intent.
- Keep event payloads minimal.
- Treat sponsor metrics as aggregate placement metrics, not user profiles.

## PM/CEO Decisions Required Before Implementation

- Select whether to use GA4, Vercel Analytics, Microsoft Clarity, or no third-party analytics.
- Decide whether analytics starts before or after the GSC Pages indexing report is available.
- Confirm privacy page wording before any third-party script is shipped.
- Confirm whether sponsor slot metrics are needed before any sponsor placement exists.

## Recommended Next Slice

```text
phase_2c_privacy_safe_analytics_tool_selection
```

Alternative low-risk slice:

```text
phase_2c_first_party_event_contract_no_runtime
```

## PM Mainline Integration

Requires PM integration: yes.

Reason: analytics and monetization observability affect privacy posture, public trust, and future sponsor/ad-readiness decisions.
