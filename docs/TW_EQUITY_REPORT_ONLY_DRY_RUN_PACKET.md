# TW Equity Report-Only Dry-Run Packet

Updated: 2026-06-06

Status: `tw_equity_report_only_dry_run_packet_ready_not_executable`.

Trigger: `docs/BACKFILL_INGESTION_EXECUTION_PACKET.md`.

## Purpose

This packet defines the first lane-specific report-only dry-run contract for TW equity symbols `2330`, `2382`, and `2308`.

It is design-only and not executable. It prepares the report shape, validation rules, stop lines, and source-design references before any fetcher, runner, ingestion command, SQL, Supabase write, staging-row creation, or production mutation exists.

## Existing Design References

This packet inherits only design posture from these existing TWSE STOCK_DAY references:

- `docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md`.

The references do not authorize a TWSE fetch, market-data ingestion, Supabase write, SQL execution, staging row creation, or public source promotion in this packet.

## Lane Scope

- Lane id: `tw-equity`.
- Symbols: `2330`, `2382`, `2308`.
- Symbol count: `3`.
- Expected trading sessions: `60`.
- Expected lane rows: `180`.
- Latest sanitized readonly aggregate evidence: `latestObservedRows` is `3`.
- Latest sanitized readonly aggregate evidence: `latestMissingRows` is `177`.
- Target table posture: `staging_first`.
- Production `daily_prices` blocked.
- Public runtime boundary: `publicDataSource mock`.
- Score runtime boundary: `scoreSource mock`.

The current readonly evidence is aggregate-only. It does not include row payloads, raw market data, secrets, or source payload excerpts.

## Report-Only Output Contract

Any future report-only dry-run design must emit only a sanitized summary with these fields:

- `laneId`: `tw-equity`.
- `symbolsCount`: `3`.
- `symbols`: `2330`, `2382`, `2308`.
- `expectedTradingSessions`: `60`.
- `expectedRows`: `180`.
- `latestObservedRows`: `3`.
- `latestMissingRows`: `177`.
- `sourceRightsStatus`.
- `fieldCoverageStatus`.
- `targetTablePosture`: `staging_first`.
- `rollbackPosture`.
- `validationStatus`.
- `filesWritten false`.
- `mutations false`.
- `sqlExecuted false`.
- `supabaseWrites false`.
- `secretsPrinted false`.
- `rawPayloadsPrinted false`.
- `publicDataSource mock`.
- `scoreSource mock`.

This contract is a report-only summary contract. It is not a fetch contract, ingestion contract, SQL contract, staging contract, or public runtime promotion contract.

## Field Contract

The TW equity lane needs these fields before any later executable dry-run can be considered:

- trade date.
- symbol.
- open.
- high.
- low.
- close.
- volume.
- source timestamp.
- source label.
- validation status.

Field coverage must be summarized by field name and symbol. Missing fields are counted and reported; they are not filled silently.

## Validation Rules

- OHLCV values must be non-negative when present.
- `high >= low`.
- close must be inside high / low range when high, low, and close exist.
- trade date must be parseable.
- no duplicate symbol+trade_date.
- missing sessions are counted, not filled.
- source label must be present before any public attribution copy can rely on the lane.
- validation failure blocks write-capable execution.

## Stop Lines

This packet does not approve:

- SQL.
- Supabase writes.
- staging rows.
- production `daily_prices` mutation.
- TWSE fetch.
- market-data ingestion.
- raw market data storage.
- raw market data commit.
- raw payload printing.
- secret printing.
- public source promotion.
- `scoreSource=real`.
- row coverage points.
- investment advice, ranking, recommendation, model confidence, or performance claims.

## CEO Next Step

Next safe slice: prepare either a TW equity source-rights packet or a local report-only runner design with sample output only. CEO preference is source-rights linkage first, then runner design, because execution cannot proceed without source-rights and attribution posture.
