# Phase 1 Data Online Go/No-Go Status

Updated: 2026-06-15

Status: `phase_1_data_online_go_no_go_status_ready_no_go`

Owner: CEO / PM mainline

CEO decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`

## Purpose

This document is the Phase 1 data-online decision surface.

It separates two truths that must not be mixed:

- The public runtime can explain the index-lighting product loop with mock data.
- Phase 1 is not data-online yet because the real write/read/promotion loop is still gated.

This document does not approve SQL, Supabase writes, staging rows, `daily_prices` mutation, raw market-data fetches, raw payload output, `publicDataSource=supabase`, or `scoreSource=real`.

## Current Go/No-Go

Decision: `NO_GO_FOR_DATA_ONLINE`

Reason:

- Level 1 coverage is still `182/360`.
- Missing Level 1 rows remain `178/360`.
- TWII can add `60` rows, but the next meaningful move is a bounded write attempt to `daily_prices`.
- ETF coverage still has `118` missing rows.
- Runtime public source and score remain `publicDataSource=mock` and `scoreSource=mock`.
- No real-data promotion is allowed until post-run review, aggregate readback, rollback readiness, quality checks, timestamps, and public boundary copy pass.

## Current Coverage Snapshot

| Coverage item | Current status |
| --- | --- |
| Level 1 expected rows | `360` |
| Level 1 observed rows | `182` |
| Level 1 missing rows | `178` |
| TW equity rows | `180/180` |
| TWII missing rows | `60` |
| ETF missing rows | `118` |
| Public data source | `mock` |
| Score source | `mock` |

## Data-Online Gate Table

| Gate | Status | Evidence | Next action |
| --- | --- | --- | --- |
| Legal/free automated source | Ready for prepared TWSE OpenAPI path | `check:open-free-auto-data-source-gate`, `check:twse-openapi-bounded-metadata-terms-validation` | Keep source terms and attribution visible; do not overclaim official endorsement. |
| Field contract and parser path | Ready for synthetic and mock-runtime wiring | `check:twse-openapi-source-adapter-contract`, `check:twse-openapi-parser-contract`, `check:twse-openapi-parser-consumer-adapter` | Keep parser fail-closed and raw payload excluded. |
| Runtime mock consumer wire | Ready | `check:twse-openapi-runtime-mock-consumer-wire` | Use it only to improve public comprehension while real promotion stays locked. |
| TWII candidate packet | Prepared but not executable | `report:twii-final-operator-authorization-packet-preflight` | Requires a separate explicit bounded write decision before any execution. |
| TWII daily_prices write | Blocked | `authorizationDecisionAcceptedNow=false`, `runnerExecutableNow=false`, `writeGateExecutableNow=false` | Do not run the writer until CEO/operator supplies the required bounded attempt values in a separate decision step. |
| ETF coverage closure | In progress | `check:etf-daily-prices-coverage-completion-route`, `check:etf-market-price-synthetic-fixture`, `check:etf-market-price-mock-runtime-handoff` | Continue source-rights, candidate shape, and coverage route work without raw row fetch. |
| Runtime promotion | Blocked | `publicDataSource=mock`, `scoreSource=mock` | Promote only after write, readback, quality, rollback, timestamp, and public-copy gates pass. |

## Required Before Data-Online Go

Data-online can become `GO` only after all of the following are true:

1. TWII bounded write attempt is explicitly authorized, executed, and post-run reviewed.
2. Aggregate readback confirms accepted row counts without exposing row payloads.
3. Rollback readiness is recorded.
4. ETF coverage route has accepted source rights, field contract, candidate shape, and execution packet.
5. Runtime promotion gate confirms quality, timestamps, freshness, source attribution, fallback copy, and no investment-advice claims.
6. `publicDataSource=supabase` and `scoreSource=real` remain blocked until the promotion gate explicitly opens them.

## Current Safe Mainline

PM should continue:

- public runtime comprehension cleanup;
- route-level data boundary consistency;
- no-fetch source/coverage handoffs;
- fail-closed runner/readiness checks;
- A1 data coverage preparation;
- A2 public copy guard.

PM should not continue:

- SQL execution;
- Supabase writes;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch/store/commit;
- row payload or raw payload output;
- real-data or real-score promotion;
- any claim of investment advice, 保證獲利, real-time precision, or complete market coverage.

## Next PM Route

`phase_1_data_online_no_go_status_then_prepare_bounded_write_decision`

The next high-value PM route is to keep the public runtime ready and prepare the bounded write decision packet for operator review. If the operator does not explicitly accept the write attempt, PM should continue ETF/source coverage and public route comprehension cleanup.
