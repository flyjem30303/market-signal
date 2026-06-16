# Phase 1 Data Online Go/No-Go Status

Updated: 2026-06-16

Status: `phase_1_data_online_go_no_go_status_ready_no_go`

Owner: CEO / PM mainline

CEO decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`

Current operator note: default checks intentionally stay `NO_GO` unless a local row-payload candidate path is supplied. A non-committed local candidate currently exists at `tmp/phase-1-sanitized-row-payload-candidate.json` and is ready for separate operator write review when explicitly passed to the checker.

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
- TWII still needs `60` sanitized row-payload rows.
- ETF coverage still needs `118` sanitized row-payload rows.
- The next required input is a non-committed sanitized row-payload candidate artifact covering all `178` missing rows.
- Runtime public source and score remain `publicDataSource=mock` and `scoreSource=mock`.
- No real-data promotion is allowed until post-run review, aggregate readback, rollback readiness, quality checks, timestamps, and public boundary copy pass.

## Explicit Candidate-Path Status

The default no-go result is expected because the gate must fail closed when no operator-supplied candidate path is present.

When PM explicitly supplies `PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH=tmp\phase-1-sanitized-row-payload-candidate.json`, the same gate reports:

- `decision=PUBLIC_RUNTIME_READY_ROW_PAYLOAD_CANDIDATE_READY_WRITE_REVIEW_REQUIRED`
- `rowPayloadCandidate.status=ready_for_separate_write_execution_review`
- `rowPayloadCandidate.accepted=true`
- `rowPayloadCandidate.rowCount=178`
- `rowPayloadCandidate.symbolCounts={TWII:60,0050:59,006208:59}`
- `rowPayloadCandidate.dateBounds=2026-03-19..2026-06-15`
- `rowPayloadCandidate.duplicateCount=0`
- `rowPayloadCandidate.missingRequiredFieldCount=0`
- `rowPayloadCandidate.forbiddenFieldCount=0`
- `nextRoute=separate_operator_write_execution_review_required`

This proves the local candidate can advance to operator review. It does not approve SQL, Supabase writes, `daily_prices` mutation, runtime source promotion, or `scoreSource=real`.

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
| Aggregate candidate packets | Prepared but not executable | `data/candidates/twii-sanitized-candidate.json`, `data/candidates/phase-1-etf-sanitized-candidate.json` | These are aggregate-only and cannot feed the write runner. |
| Sanitized row-payload candidate | Missing | `run:phase-1-write-runner-implementation-candidate` returns `candidate_row_payloads_missing` | Provide one non-committed local JSON artifact that passes the Phase 1 row-payload validator. |
| TWII / ETF daily_prices write | Blocked | `report:twii-final-operator-authorization-packet-preflight`, `authorizationDecisionAcceptedNow=false`, `runnerExecutableNow=false`, `writeGateExecutableNow=false` | Do not run the writer until the sanitized row-payload candidate is valid and a separate bounded write review explicitly opens. |
| ETF coverage closure | In progress | `check:etf-daily-prices-coverage-completion-route`, `check:etf-market-price-synthetic-fixture`, `check:etf-market-price-mock-runtime-handoff` | Continue source-rights, candidate shape, and coverage route work without raw row fetch or committed row payload. |
| Runtime promotion | Blocked | `publicDataSource=mock`, `scoreSource=mock` | Promote only after write, readback, quality, rollback, timestamp, and public-copy gates pass. |

## Required Before Data-Online Go

Data-online can become `GO` only after all of the following are true:

1. A non-committed sanitized row-payload candidate artifact covers TWII `60` rows and ETF `118` rows.
2. The candidate artifact passes `validate:phase-1-sanitized-row-payload-candidate-artifact`.
3. `run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH>` returns ready for separate review.
4. TWII / ETF bounded write attempt is explicitly authorized, executed, and post-run reviewed.
5. Aggregate readback confirms accepted row counts without exposing row payloads.
6. Rollback readiness is recorded.
7. Runtime promotion gate confirms quality, timestamps, freshness, source attribution, fallback copy, and no investment-advice claims.
8. `publicDataSource=supabase` and `scoreSource=real` remain blocked until the promotion gate explicitly opens them.

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
- committed row payload or raw payload output;
- real-data or real-score promotion;
- any claim of investment advice, buy/sell/hold direction, real-time precision, or complete market coverage.

## Next PM Route

`phase_1_data_online_no_go_status_then_request_sanitized_row_payload_candidate`

The next high-value PM route is to keep the public runtime ready and request a non-committed sanitized row-payload candidate artifact for the full `178` missing rows. If no valid local candidate artifact is available, PM should keep data online at `NO-GO` and continue source/coverage preparation without SQL, Supabase write, raw fetch, or public real-data promotion.
