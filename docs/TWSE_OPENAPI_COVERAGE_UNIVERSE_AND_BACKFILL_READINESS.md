# TWSE OpenAPI Coverage Universe and Backfill Readiness

## Current execution posture (A1 local-only)

- Coverage evidence currently used for public beta visibility is:
  - `publicDataSource = "mock"`
  - `scoreSource = "mock"`
  - `fixturePolicy = "synthetic_or_contract_only"` / `"synthetic_rows_only"` / `"synthetic_parser_result_only"` in the active chain
  - no real endpoint fetch in this lane
- Real ingestion path, write path, and `daily prices` mutation are not executed in this slice.

## Coverage scope split

1. TWSE OpenAPI route-level universe (field/contract proving only)
   - `twiiIndexHistory`
   - `listedStockDailyClose`
   - `listedStockDailyTradingInfo`
   - `marketDailyStatistics`

2. Public beta row coverage universe (existing product-level)
   - TWII / ETF / listed stock row goals are tracked by existing coverage packet lanes.
   - A1 must keep the source of these rows synthetic until PM confirms runtime fetch authority.

## Coverage targets carried into this lane

- MVP lane for runtime confidence remains 360-session denominator for next real-data readiness discussions.
- TWII index-specific session target for first bounded step: 60 sessions.
- no row insertion, no row mutation, no storage in this lane.

## Backfill and ingestion readiness roadmap

### Phase 0: Synthetic handoff hardening (current)

- 摰? `TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY` to synthetic rows only.
- 摰? consumer adapter fail-closed mapping and synthetic case notes.

### Phase 1: Runtime mock wiring readiness

- PM/mainline precondition to move from `prepare_twse_openapi_runtime_mock_consumer_wiring_readiness`:
  - source contract exists
  - parser contract has no syntax/regression regression
  - consumer adapter synthetic case notes are documented
  - coverage readiness packet points to bounded backfill plan

### Phase 2: Controlled live ingestion dry-run

- When source rights and schema acceptance open, only allow read-only parser-result pipeline with:
  - bounded date window
  - dedup policy on `tradeDate`
  - explicit duplicate handling and warning export
  - no writes and no direct `daily prices` sync

### Phase 3: Backfill readiness

- Backfill can proceed once PM approves:
  - source-rights + terms status
  - schema contract and warning semantics unchanged
  - missing-row closure strategy documented
  - no-change to hard stops (`publicDataSource=mock`, `scoreSource=mock`) until PM toggles runtime gates

## Gating checklist for A1 to PM handoff

- Source route contract fields:
  - route IDs and paths are locked.
- Consumer adapter:
  - fail class matrix documented.
  - synthetic case notes complete.
- Readiness blockers:
  - no fetch and no write posture still active.
  - hard-stop conditions remain explicit in synthetic boundary artifacts.
