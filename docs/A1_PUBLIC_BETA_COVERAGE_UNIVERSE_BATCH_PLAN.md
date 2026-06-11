# A1 Public Beta Coverage Universe Batch Plan

Status: a1_public_beta_coverage_universe_batch_plan_ready

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only A1 Data / Supabase / Market Evidence packet organizes the public beta phase three coverage universe into safe rollout batches.

This document is a planning and PM integration artifact only. It does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, raw payload handling, secret access, market-data fetch, market-data ingest, candidate row acceptance, public real-data promotion, or `scoreSource=real`.

PM may use this plan to sequence public-page readiness labels, mock-only UI shells, and source-rights follow-up work while the runtime stays in mock mode.

## Batch Order Recommendation

| Batch | Coverage scope | Public user value | Minimum fields | Source-rights need | Supabase readiness | Ingestion/backfill readiness | Display readiness | Hard blocker | PM next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Batch 0 | Current mock showcase | Lets public beta users understand the product shape, pressure language, indicator explanations, and disclosure model without claiming real market evidence. | `coverageLabel`, `mockStatus`, `displayName`, `userMeaning`, `lastMockRefreshLabel`, `mockDisclosure`, `nonInvestmentDisclosure`. | No real source rights needed if every value is synthetic or existing mock fixture only; still needs copy review to avoid real-market claims. | Not required for public real data; no Supabase connection, read, write, staging, or `daily_prices` route is needed. | Not required; use existing mock fixtures or static mock states only. | Ready first if every panel is visibly labeled mock/simulated and no real timestamp, row count, or market-source claim appears. | Any copy or UI that implies live, delayed, historical, official, or source-backed market evidence. | Publish Batch 0 as the public beta mock showcase and add clear readiness badges before expanding the universe. |
| Batch 1 | TWII + core ETF | Gives users the broad Taiwan market reference point and an investable-proxy comparison layer without turning the beta into advice. | `symbol`, `displayName`, `assetClass`, `sessionDateLabel`, `closeOrLevelLabel`, `changeLabel`, `sourceStatus`, `rightsStatus`, `mockOrRealStatus`, `attributionLabel`. | Required before real display: TWII source rights, ETF market-price scope, redistribution/display terms, attribution, cadence, and excluded ETF data boundaries such as NAV, holdings, or premium/discount if out of scope. | Not ready for real public use in this plan; requires separate accepted read/write/readback and promotion gates before any Supabase-backed public route. | Not ready; candidate artifacts, backfill windows, field contracts, missing-session rules, timezone rules, and repair policy remain separate gated work. | Mock shells are ready; real TWII or ETF values are blocked. | Missing accepted source rights and accepted field/cadence/display contract for both TWII and ETF lanes. | Put Batch 1 on the public page as `real_blocked_source_rights_needed` while showing mock TWII/ETF cards. |
| Batch 2 | Major listed companies / individual stocks | Helps users understand whether broad pressure may be connected to major listed names while avoiding stock-picking claims. | `symbol`, `companyName`, `exchange`, `assetClass`, `sectorOrIndustryLabel`, `sessionDateLabel`, `priceStateLabel`, `volumeStateLabel`, `sourceStatus`, `rightsStatus`, `mockOrRealStatus`. | Required before real display: individual-security data source rights, redistribution/display scope, symbol universe rules, attribution, corporate-action handling, delayed-data wording, and non-advice constraints. | Not ready; no stock-level Supabase rows, staging rows, read promotion, or public source switch is authorized by this plan. | Not ready; no symbol backfill, raw payload intake, candidate row generation, or candidate row acceptance may happen here. | Mock examples may support layout and explanation; real company/stock values are blocked. | Rights and universe rules are broader and riskier than TWII/ETF, especially if named securities appear as factual market evidence. | Keep Batch 2 behind a future badge or internal readiness matrix until Batch 1 rights and display wording are accepted. |
| Batch 3 | Sectors and industries | Lets users see whether pressure is broad or concentrated across market groups, improving explanation without over-indexing on single names. | `taxonomyVersion`, `groupType`, `groupName`, `membershipRuleLabel`, `constituentCountLabel`, `pressureStateLabel`, `aggregationMethodLabel`, `sourceStatus`, `rightsStatus`, `mockOrRealStatus`. | Required before real display: accepted sector/industry taxonomy, membership source rights, aggregation display permission, attribution, update cadence, and overlap policy between sectors and industries. | Not ready; no sector or industry aggregation table, view, or Supabase mutation is authorized by this plan. | Not ready; taxonomy mapping, membership backfill, and historical aggregation remain blocked until rights and method are accepted. | Mock breadth/concentration displays are ready if labeled simulated; real sector/industry states are blocked. | No accepted taxonomy plus no accepted aggregation and display-rights contract. | Add Batch 3 as a transparent `future_taxonomy_review_needed` status, not as a blocker for Batch 0 or Batch 1 UI shells. |
| Batch 4 | Volatility / capital flow / moving average / momentum expansion | Adds explanatory derived signals so users can understand calm versus unstable, supportive versus pressured, above-trend versus below-trend, and strengthening versus fading states. | `indicatorName`, `inputUniverse`, `lookbackWindowLabel`, `formulaVersionLabel`, `thresholdVersionLabel`, `derivedStateLabel`, `sourceStatus`, `rightsStatus`, `mockOrRealStatus`, `calculationDisclosure`. | Required before real display: accepted underlying source rights, derived-indicator publication permission, formulas, thresholds, missing-data rules, cadence, attribution, and risk wording. Capital flow also needs a separately accepted source lane. | Not ready; no real derived signal, score, table, view, or Supabase-backed public output is authorized by this plan. | Not ready; no historical backfill, rolling calculation job, or real-score promotion may start from this plan. | Mock derived-state chips and explanations are ready; real derived indicators are blocked. | Derived indicators depend on accepted underlying data plus accepted calculation and display contracts; `scoreSource=real` remains forbidden. | Put Batch 4 on the public page as `mock_indicator_expansion_ready_real_blocked` after Batch 0, because it explains value without requiring real inputs. |

## Batch Status Vocabulary

PM can use these batch statuses without changing runtime data posture:

| Batch | Suggested status | Meaning |
| --- | --- | --- |
| Batch 0 | `batch_0_mock_showcase_ready` | Public beta can show current mock coverage and disclosure safely. |
| Batch 1 | `batch_1_twii_core_etf_real_blocked_source_rights_needed` | TWII and core ETF are the first real-data candidates, but real display is blocked until source-rights and field contracts are accepted. |
| Batch 2 | `batch_2_major_listed_companies_future_universe_rules_needed` | Individual-stock expansion needs tighter universe, rights, and non-advice boundaries before public use. |
| Batch 3 | `batch_3_sector_industry_future_taxonomy_review_needed` | Sector/industry expansion needs taxonomy, membership, aggregation, and display-rights review. |
| Batch 4 | `batch_4_derived_indicator_expansion_mock_ready_real_blocked` | Volatility, capital flow, moving average, and momentum can be explained with mock states, but real derived indicators remain blocked. |

## PM Integration Notes

The three batch statuses best suited for the public page first are:

| Public-page priority | Batch status | Why this should go first |
| --- | --- | --- |
| 1 | `batch_0_mock_showcase_ready` | It gives users a usable beta surface immediately while preserving `publicDataSource=mock` and `scoreSource=mock`. |
| 2 | `batch_1_twii_core_etf_real_blocked_source_rights_needed` | It names the most intuitive next real-data lane and makes the blocker transparent without implying the data is live. |
| 3 | `batch_4_derived_indicator_expansion_mock_ready_real_blocked` | It communicates the product's explanatory value through mock indicator states while avoiding real calculation, real scores, or real market claims. |

PM should not put Batch 2 or Batch 3 ahead of these on the public page unless the page needs a roadmap section. Individual-stock and taxonomy-based surfaces carry more naming, mapping, and rights risk than mock showcase, TWII/ETF readiness, or mock derived-indicator explanation.

## Hard Stops / Forbidden Zones

Explicit forbidden-zone summary: no SQL, no Supabase connection, no Supabase writes, no staging rows, no daily_prices mutation, no raw payload, no secrets, no market data fetch, no market data ingest, no candidate row acceptance, no publicDataSource=supabase, no scoreSource=real.

- no SQL
- no Supabase connection
- no Supabase writes
- no staging rows
- no `daily_prices` mutation
- no raw payload
- no secrets
- no market data fetch
- no market data ingest
- no candidate row acceptance
- no `publicDataSource=supabase`
- no `scoreSource=real`

## A1 Support Conclusion

The public beta phase three coverage universe batch plan is ready for PM integration as a local-only, mock-preserving sequencing artifact. The recommended rollout order is Batch 0 current mock showcase, Batch 1 TWII + core ETF, Batch 2 major listed companies / individual stocks, Batch 3 sectors and industries, and Batch 4 volatility / capital flow / moving average / momentum expansion.

This plan preserves `publicDataSource=mock` and `scoreSource=mock` throughout. Any real-data display, Supabase route, ingestion/backfill work, `daily_prices` mutation, candidate row acceptance, or real score promotion requires a separate explicitly accepted gate.
