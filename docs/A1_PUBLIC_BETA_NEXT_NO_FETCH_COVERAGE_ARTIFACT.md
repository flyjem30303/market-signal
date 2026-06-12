# A1 Public Beta Next No-Fetch Coverage Artifact

Status: `a1_public_beta_next_no_fetch_coverage_artifact_ready_pm_intake`

Date: 2026-06-12

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This A1 Data / Source / Coverage artifact gives PM one local-only coverage packet for the next BRIEF runtime step.

It consolidates the current public Beta coverage state across:

- `TWII` index baseline,
- core ETF context (`0050`, `006208`),
- Batch 1 listed-equity demo anchors (`2330`, `2382`, `2308`),
- later sector / industry / derived indicator expansion.

This artifact is no-fetch, no-secret, and no-row-list. It is a PM intake packet for runtime readiness wording and gate sequencing only.

## Current Coverage State

| Scope | Current public meaning | Current status | PM-safe public label | Next no-fetch action |
| --- | --- | --- | --- | --- |
| `TWII` index baseline | Broad market anchor for the 30-second market atmosphere. | Candidate lane; mock runtime labels are ready, real display is not promoted. | `TWII 大盤基準準備中` | Confirm terms, field contract, attribution, cadence, missing-session rules, and rollback wording before any bounded readonly gate. |
| Core ETF context | Investable proxy context for the 3-minute action judgment, without NAV, holdings, or product advice. | Blocked for real display; mock comparison may be shown with clear simulation wording. | `核心 ETF 來源條件待確認` | Separate market-price scope from NAV / holdings / premium-discount scope before any real ETF display. |
| Batch 1 listed equities | Small stock-detail demo anchors for reading flow only. | Accepted as no-row-list mock anchors: `2330`, `2382`, `2308`. | `第一批上市個股示範` | Keep symbol scope small; do not expand to full listed-company universe until source rights and universe rules are accepted. |
| Sector / industry | Explains whether pressure is broad or concentrated. | Future taxonomy lane; not a Batch 1 dependency. | `產業與族群待 taxonomy review` | Prepare taxonomy and membership-source decision packet later; do not block Batch 0 or Batch 1 runtime shell. |
| Derived indicators | Volatility, capital flow, moving average, and momentum explanation layer. | Mock indicator explanation may proceed; real derived values are blocked. | `進階指標 mock 可解釋，真實計算未開放` | Define formula, source dependency, threshold, missing-data, and non-advice wording before real calculation. |

## Minimum Field Contract For Future Real Promotion

PM may discuss these field names as a planning contract only:

| Scope | Minimum fields | Still unresolved |
| --- | --- | --- |
| `TWII` | `symbol`, `displayName`, `assetClass`, `sessionDateLabel`, `closeOrLevelLabel`, `changeLabel`, `sourceStatus`, `rightsStatus`, `attributionLabel` | exact source endpoint, field mapping, timezone/session handling, missing-session policy, revision policy, public attribution wording |
| Core ETF | `symbol`, `displayName`, `assetClass`, `sessionDateLabel`, `marketPriceLabel`, `changeLabel`, `sourceStatus`, `rightsStatus`, `attributionLabel`, `excludedDataLabel` | market-price scope, NAV exclusion, holdings exclusion, premium-discount exclusion, redistribution/display terms |
| Batch 1 listed equities | `symbol`, `displayName`, `exchange`, `assetClass`, `sectorOrIndustryLabel`, `sessionDateLabel`, `priceStateLabel`, `volumeStateLabel`, `sourceStatus`, `rightsStatus` | full universe rules, corporate action handling, delayed-data wording, complete source-rights acceptance |

These fields are not raw payloads and not candidate rows. They are display-contract names for future gate review.

## PM Runtime Intake

PM can integrate this artifact into runtime wording when all are true:

1. `npm run check:a1-public-beta-next-no-fetch-coverage-artifact` passes.
2. PM keeps visible wording in mock mode.
3. PM does not imply complete coverage, live market data, official source approval, or real score readiness.
4. A2 confirms the public copy remains understandable and non-advisory.
5. Any future real-data movement is routed through a separately named source-rights, coverage, quality, rollback, and runtime promotion gate.

Suggested next PM route:

`wire_next_no_fetch_coverage_artifact_into_public_data_readiness_status`

Suggested A2 support route:

`review_data_readiness_and_coverage_artifact_public_copy_density`

## A1 Next Task After PM Intake

A1 should prepare the next no-fetch source packet only after PM accepts this coverage artifact:

`prepare_twii_terms_field_cadence_attribution_no_fetch_packet`

That packet should remain field-name-only and aggregate-only. It should not fetch, ingest, store, or commit market rows.

## Hard Stop Lines

This artifact does not authorize:

- SQL execution,
- Supabase connection,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- raw market-data fetch,
- raw market-data ingest,
- raw market-data storage,
- raw market-data commit,
- row payload output,
- stock-id row-list output,
- secret output,
- candidate row acceptance,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- buy/sell recommendations,
- guaranteed return claims,
- real-time market-data claims.

## Acceptance Summary

This artifact is ready for PM intake if the checker confirms:

- TWII, ETF, Batch 1 listed equity, sector/industry, and derived-indicator scopes are separated;
- the field contract is planning-only;
- public labels stay mock-safe;
- the next PM route is named;
- the next A1 and A2 support routes are named;
- every hard stop line remains explicit.
