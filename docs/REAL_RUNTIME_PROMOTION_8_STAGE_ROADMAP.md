# Real Runtime Promotion 8-Stage Roadmap

Updated: 2026-06-17

Status: `stage_1_source_selection_complete`

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

Goal: define exact source fields, normalized fields, date/timezone rules, symbol mapping, missing-row handling, and synthetic tests before fetching rows.

Completion target:

- TWII fields mapped to `trade_date`, `open`, `high`, `low`, `close`, `source`.
- Listed-stock fields mapped to `trade_date`, `symbol`, `name`, `open`, `high`, `low`, `close`, `volume`, `turnover`, `transactions`, `source`.
- Adapter has synthetic fixtures and no secrets.

## Stage 3 - Ingestion and backfill runner

Goal: build a server-only runner that can fetch official daily rows, normalize them, validate them, and dry-run upsert plans.

Completion target:

- Dry-run output shows candidate row count, duplicate count, rejected count, missing sessions, and source timestamps.
- No public runtime promotion yet.

## Stage 4 - Bounded Supabase write and post-run review

Goal: perform a small authorized write/readback loop, then review row counts and rollback/fail-closed behavior.

Completion target:

- Bounded write succeeds or fails closed.
- Readback confirms expected rows.
- No raw payload or secret is printed or committed.

## Stage 5 - Supabase readonly gate

Goal: prove the public app can read normalized Supabase data safely without promoting the public source yet.

Completion target:

- Readonly API returns expected shape.
- Stale, missing, and source-error states are distinguishable.
- Secrets stay server-only.

## Stage 6 - publicDataSource=supabase promotion

Goal: switch public runtime data source from mock to Supabase only after Stage 5 is stable.

Completion target:

- Homepage, briefing, weekly, stock routes show Supabase-backed data.
- UI clearly displays source and update time.
- Failure mode does not silently show stale data as current.

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

Proceed to Stage 2: `twse_openapi_field_contract_and_source_adapter`.

