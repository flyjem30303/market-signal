# A2 Public Beta Mock-To-Real Promotion Checklist Copy

Status: a2_public_beta_mock_to_real_promotion_checklist_copy_ready

Scope: local-only A2 Product / Public Trust / Decision Aid copy packet for public Beta mock-to-real promotion wording. This file gives PM safe public-page copy and trust boundaries only. It does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, source ingestion, raw payload handling, secret/env reading, candidate row acceptance, public real-data promotion, or real score activation.

Current public posture:

- `publicDataSource=mock`
- `scoreSource=mock`
- Public pages may explain the decision-aid shape and readiness gates.
- Public pages must not claim real market-data approval, real scoring approval, trading guidance, complete Taiwan-market coverage, or real-time precision.

## User-Understandable Explanation

### Why It Is Mock Now

The public Beta currently uses mock / simulated data because the product is still proving the user experience, explanation style, and trust labels before exposing real market data. This lets users see how the dashboard will explain market pressure, alerts, and source status without confusing an unfinished data pipeline for verified live evidence.

Safe public wording:

`This Beta is currently using simulated data so we can show the decision-aid experience clearly while real-data rights, coverage, freshness, and safety checks are still being completed.`

### Why We Cannot Switch Directly To Real

Real market display requires more than connecting a database. Before public real-data promotion, the project must confirm source rights, enough row coverage, repeatable ingestion/backfill, Supabase read/write readiness, freshness disclosure, legal/trust wording, and rollback/fail-closed behavior. If any gate is incomplete, the safer product behavior is to keep mock labels visible and avoid real-data claims.

Safe public wording:

`We will not switch the public page to real data until source permissions, coverage quality, update cadence, and rollback safeguards have passed review.`

### What Must Be True Before Promotion

Promotion can only happen after all checklist items below are accepted by the relevant owner and PM explicitly integrates the accepted state. A partial pass may support internal readiness notes, but it does not approve public real-data wording, `publicDataSource=supabase`, or `scoreSource=real`.

Safe public wording:

`Real-data promotion happens only after every required data, rights, freshness, legal, and rollback gate is accepted; until then, the public Beta remains mock-labeled.`

## Promotion Checklist Copy Matrix

| Checklist item | Public wording | What users can trust now | What is not yet claimed | Forbidden wording |
| --- | --- | --- | --- | --- |
| Coverage sufficiency | `Coverage is still being checked. The Beta shows the product shape with simulated data while we verify that enough rows and sessions are available for reliable public display.` | Users can trust that the page is not pretending incomplete coverage is complete. The mock label is intentional and should remain visible. | No claim that all required TWII, ETF, stock, sector, industry, volatility, capital-flow, moving-average, or momentum coverage is complete. No claim that row coverage is sufficient for public real display. | `已完整覆蓋全台股`; `all Taiwan stocks are fully covered`; `coverage is complete`; `real-data coverage approved` |
| Source rights accepted | `Real-data display waits for accepted source rights, attribution, redistribution, and derived-display review.` | Users can trust that public wording separates product demonstration from source-rights approval. | No claim that any source lane is approved for public redistribution, display, derived scoring, or permanent storage unless a separate accepted gate says so. | `real-time approved`; `source rights approved for all uses`; `official market feed approved`; `unrestricted redistribution approved` |
| Supabase readonly/write readiness | `Database readiness is checked separately from public display. The Beta stays mock-labeled until read paths, write paths, schema visibility, and operational controls are accepted.` | Users can trust that the public page is not treating a local plan or partial diagnostic as production database readiness. | No claim that Supabase readonly, write, staging, `daily_prices`, or public runtime promotion is approved. No connection or write is implied by this copy. | `publicDataSource=supabase approved`; `Supabase production ready`; `writes approved`; `daily_prices mutation approved` |
| Ingestion/backfill repeatability | `Real-data promotion requires a repeatable ingestion and backfill process that can be rerun, checked, and explained without exposing raw payloads.` | Users can trust that the project is treating data history and repeatability as launch requirements, not optional cleanup. | No claim that ingestion jobs, backfill windows, missing-session handling, correction policy, or candidate rows are accepted for public data. | `backfill complete`; `all history imported`; `candidate rows accepted`; `market data ingestion approved` |
| Data freshness disclosure | `Every public data state must show a clear freshness label, such as simulated, delayed, last updated, blocked, or approved real-data cadence.` | Users can trust that freshness is part of the visible product surface and should not be hidden in a footer. | No claim of real-time updates, second-level precision, live-feed cadence, or official exchange timing until separately approved. | `即時精準到秒`; `real-time approved`; `live to the second`; `official live updates` |
| Legal/trust disclosure | `The dashboard is an informational decision aid. It helps users review market pressure and personal risk assumptions; it does not provide investment advice or trading instructions.` | Users can trust that the product will label mock status, non-advice boundaries, and source readiness instead of using confident trading language. | No claim of guaranteed accuracy, future direction, return, loss avoidance, suitability, or personalized advice. | `買進/賣出`; `保證報酬`; `guaranteed return`; `buy now`; `sell now`; `personalized investment advice` |
| Rollback/fail-closed readiness | `If a required gate fails or becomes unclear, the public page should fall back to mock or blocked-state wording rather than continue with real-data claims.` | Users can trust that uncertainty should reduce claims, not increase them. The safe fallback is visible mock/blocked status. | No claim that rollback execution, production incident response, or automated failover is complete unless a separate gate accepts it. | `auto-recovery guaranteed`; `cannot fail`; `real data will stay online`; `promotion cannot be rolled back` |

## Required Public Trust Boundary

Recommended reusable disclosure:

`Public Beta is currently mock-labeled. The dashboard is a decision aid for reviewing market pressure and personal risk assumptions, not investment advice. Real-data display will be promoted only after coverage, source rights, database readiness, repeatable ingestion/backfill, freshness disclosure, legal/trust wording, and rollback/fail-closed checks are accepted.`

Short version:

`Beta uses simulated data today. Real-data display waits for accepted coverage, source rights, freshness, database, legal, and rollback gates.`

## Forbidden Wording

Do not use these phrases on public pages, PM briefing, launch notes, screenshots, captions, or tooltips unless a future separately accepted gate explicitly replaces this copy packet:

- `real-time approved`
- `scoreSource=real approved`
- `publicDataSource=supabase approved`
- `買進/賣出`
- `保證報酬`
- `即時精準到秒`
- `已完整覆蓋全台股`

Also avoid equivalent claims:

- buy, sell, short, add leverage, exit all positions, or enter a trade;
- guaranteed return, guaranteed accuracy, loss avoidance, or future direction certainty;
- real-time, live, official, complete, fully covered, production approved, or all-market coverage;
- real score, real model, approved source, approved database, or accepted public promotion before the separate gates pass.

## PM Integration Notes

Best three public-page sentences for the mainline homepage or briefing:

1. `Beta uses simulated data today so users can understand the decision-aid experience while real-data rights, coverage, freshness, and safety checks are still being completed.`
2. `Real-data display will be promoted only after coverage, source rights, Supabase readiness, repeatable ingestion/backfill, freshness disclosure, legal/trust wording, and rollback checks are accepted.`
3. `This dashboard helps users review market pressure and personal risk assumptions; it is not investment advice and does not provide buy or sell instructions.`

PM should place one short mock/source label near the first viewport, one promotion-gate sentence near the data readiness or briefing area, and one non-advice sentence near any alert, score, or market-pressure explanation. The copy can go live before real-data readiness only if it preserves `publicDataSource=mock`, `scoreSource=mock`, and the forbidden wording list above.

