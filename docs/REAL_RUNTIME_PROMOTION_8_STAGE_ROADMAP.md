# Real Runtime Promotion 8-Stage Roadmap

Updated: 2026-06-17

Status: `stage_6_public_data_source_supabase_promotion_complete`

CEO rule: keep this route execution-first. Do not add extra governance unless a later stage would otherwise risk legal misuse, bad data, secret exposure, or misleading public claims.

## Stage 1 - Legal free automated source selection

Status: `complete`

Selected route: `twse_openapi_via_data_gov_open_data`

Selected Phase 1 scope:

- TWII / Taiwan capitalization weighted index daily OHLC: data.gov dataset `11755`, TWSE OpenAPI / OAS reference.
- Listed-stock daily close and monthly average: data.gov dataset `11548`, TWSE OpenAPI / OAS reference.
- Listed-stock daily trading information: data.gov dataset `11549`, TWSE OpenAPI / OAS reference.

Official evidence checked:

- Data.gov Open Government Data License, version 1.0: permits use without separate written authorization when the terms are followed; attribution is required.
- Dataset `11755`: daily update, free, Open Government Data License, OAS documentation at `https://openapi.twse.com.tw/v1/swagger.json`.
- Dataset `11548`: daily update, free, Open Government Data License, OAS documentation at `https://openapi.twse.com.tw/v1/swagger.json`.
- Dataset `11549`: daily update, free, Open Government Data License, OAS documentation at `https://openapi.twse.com.tw/v1/swagger.json`.

Operational decision:

- Use official open-data/OpenAPI route, not page scraping.
- No paid vendor or contract route for Phase 1.
- No manual daily import as the normal operating model.
- Public wording must say daily/open-data source with update-time disclosure, not real-time quote service.

Stage 1 output:

- `dataSourceLane`: `official_open_data_api`
- `primaryProvider`: `TWSE via data.gov open-data references`
- `license`: `Open Government Data License, version 1.0`
- `attributionRequired`: `true`
- `automationAllowedForProjectPlan`: `true`
- `realTimeClaimAllowed`: `false`

## Stage 2 - Field contract and source adapter

Status: `complete`

Goal: define exact source fields, normalized fields, date/timezone rules, symbol mapping, missing-row handling, and synthetic tests before fetching rows.

Completion target:

- TWII fields mapped to `trade_date`, `open`, `high`, `low`, `close`, `source`.
- Listed-stock fields mapped to `trade_date`, `symbol`, `name`, `open`, `high`, `low`, `close`, `volume`, `turnover`, `transactions`, `source`.
- Adapter has synthetic fixtures and no secrets.

Stage 2 output:

- Source route contracts include dataset ids `11755`, `11548`, and `11549`.
- TWII source fields are mapped from `日期`, `開盤指數`, `最高指數`, `最低指數`, and `收盤指數`.
- Listed-stock daily close source fields are mapped from `日期`, `股票代號`, `股票名稱`, `收盤價`, and `月平均價`.
- Listed-stock daily trading source fields are mapped from `日期`, `證券代號`, `證券名稱`, `成交股數`, `成交金額`, `開盤價`, `最高價`, `最低價`, `收盤價`, `漲跌價差`, and `成交筆數`.
- Parser supports official Chinese fields plus legacy English synthetic aliases.
- Runtime handoff carries `symbol`, `name`, `datasetId`, `sourcePath`, `source`, `volume`, `turnover`, and `transactions` while keeping `publicDataSource=mock` and `scoreSource=mock`.

## Stage 3 - Ingestion and backfill runner

Status: `complete`

Goal: build a server-only runner that can fetch official daily rows, normalize them, validate them, and dry-run upsert plans.

Completion target:

- Dry-run output shows candidate row count, duplicate count, rejected count, missing sessions, and source timestamps.
- No public runtime promotion yet.

Stage 3 output:

- Added a server-only dry-run runner for TWII plus listed-stock daily close/trading routes.
- Default execution uses synthetic rows only and reports aggregate counts.
- Live OpenAPI fetch is blocked unless the operator provides the exact Stage 3 authorization id and `TWSE_OPENAPI_ALLOW_LIVE_FETCH=true`.
- Dry-run output includes `candidateRowCount`, `duplicateCount`, `rejectedCount`, `missingSessionCount`, `sourceTimestamp`, and per-route summaries.
- Dry-run output explicitly keeps `rawPayloadEcho=false`, `rowPayloadEcho=false`, `publicDataSource=mock`, and `scoreSource=mock`.
- Retained Stage 3 status token: `stage_3_ingestion_and_backfill_runner_complete`.
- Stage 3 next route was `twse_openapi_supabase_bounded_write_and_post_run_review`.

## Stage 4 - Bounded Supabase write and post-run review

Status: `complete`

Goal: perform a small authorized write/readback loop, then review row counts and rollback/fail-closed behavior.

Completion target:

- Bounded write succeeds or fails closed.
- Readback confirms expected rows.
- No raw payload or secret is printed or committed.

Stage 4 output:

- Added a bounded write/readback runner and one-command post-run review.
- Default execution is dry-run only and reports an aggregate insert-missing plan.
- `--execute` fails closed unless the operator supplies the exact Stage 4 authorization id and `TWSE_OPENAPI_STAGE4_ALLOW_WRITE=true`.
- The runner refuses to create missing rows without a separate row-payload candidate path; Stage 3 aggregate evidence is not treated as writable row data.
- Post-run review remains aggregate-only with `rawPayloadEcho=false`, `rowPayloadEcho=false`, `publicDataSource=mock`, and `scoreSource=mock`.
- Retained Stage 4 status token: `stage_4_bounded_supabase_write_and_post_run_review_complete`.
- The next route is `twse_openapi_supabase_readonly_gate`.

## Stage 5 - Supabase readonly gate

Status: `complete`

Goal: prove the public app can read normalized Supabase data safely without promoting the public source yet.

Completion target:

- Readonly API returns expected shape.
- Stale, missing, and source-error states are distinguishable.
- Secrets stay server-only.

Stage 5 output:

- Added a server-only readonly gate runner for normalized Supabase aggregate shape.
- Default execution is synthetic aggregate-shape proof and does not connect to Supabase.
- Live readonly execution is blocked unless the operator supplies the exact Stage 5 authorization id and `TWSE_OPENAPI_STAGE5_ALLOW_READONLY=true`.
- Readonly output distinguishes `current`, `stale`, `missing`, and `source_error`.
- Readonly output remains aggregate-shape-only with `rawPayloadEcho=false`, `rowPayloadEcho=false`, `secretsPrinted=false`, `publicDataSource=mock`, and `scoreSource=mock`.
- Retained Stage 5 status token: `stage_5_supabase_readonly_gate_complete`.
- The next route is `publicDataSource_supabase_promotion_gate`.

## Stage 6 - publicDataSource=supabase promotion

Status: `complete`

Goal: switch public runtime data source from mock to Supabase only after Stage 5 is stable.

Completion target:

- Homepage, briefing, weekly, stock routes show Supabase-backed data.
- UI clearly displays source and update time.
- Failure mode does not silently show stale data as current.

Stage 6 output:

- Added a fail-closed public data-source promotion gate for the runtime source resolver.
- Public runtime can resolve `publicDataSource` to `supabase` only when requested source is `supabase`, Supabase reads are enabled, and `MARKET_SIGNAL_SUPABASE_PROMOTION_GATE=stage_6_public_data_source_supabase_approved`.
- Default/local execution still resolves to `mock`.
- Score source remains `mock`; `scoreSource=real` is deferred to Stage 8.
- Source disclosure is fixed to TWSE OpenAPI via data.gov open data.
- Update-time display is required, and stale/missing/source-error data must fail closed instead of silently presenting as current.
- This stage did not mutate deployment environment variables and did not write Supabase.
- Retained Stage 6 status token: `stage_6_public_data_source_supabase_promotion_complete`.
- The next route is `real_score_formula_gate`.

## Stage 7 - real score formula

Goal: replace demonstration score with transparent, explainable calculations.

Completion target:

- Score is based on simple visible inputs such as daily change, moving-average posture, volume change, and volatility/dispersion.
- Each signal has a readable reason.
- No buy/sell advice.

## Stage 8 - scoreSource=real promotion

Goal: promote scoring only after real data and formula explanations are stable.

Completion target:

- `scoreSource=real`.
- Signals can be recalculated and explained from stored data.
- Public disclaimers and source/update-time copy remain visible.

## Next execution step

Proceed to Stage 7: `real_score_formula_gate`.
