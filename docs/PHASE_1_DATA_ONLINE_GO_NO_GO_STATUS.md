# Phase 1 Data Online Go/No-Go Status

Updated: 2026-06-19

Status: `phase_1_data_online_go_no_go_status_runtime_promoted_monitoring`

Owner: CEO / PM mainline

CEO decision: `DATA_COVERAGE_COMPLETE_AND_RUNTIME_PROMOTED`

## Purpose

This document is the Phase 1 data-online decision surface after the bounded write/readback slice and runtime promotion.

It separates three truths that must not be mixed:

- Phase 1 target coverage is complete for the current launch subset.
- The bounded write slice itself did not promote runtime during execution.
- Public runtime now resolves to Supabase formal data and real scores after the separate promotion gates.
- Daily freshness monitoring is now the blocker, not row coverage or runtime promotion.

This document does not approve SQL, additional Supabase writes, staging rows, further `daily_prices` mutation, raw market-data fetches, raw payload output, real-time claims, complete-market-coverage claims, or investment advice.

## Current Go/No-Go

Decision: `GO_FOR_RUNTIME_REAL_MONITORING`

Reason:

- Phase 1 bounded write/readback completed for the accepted current-scope shard-001 candidate set.
- Candidate row payload validation accepted `500` rows.
- The bounded attempt found `63` candidate keys already present before insert planning, inserted `437` missing rows, and skipped `63` existing rows.
- Final candidate-key readback confirmed `500/500`.
- Missing rows after write are `0`.
- Historical write evidence remains `publicDataSource=mock` and `scoreSource=mock` at the time of the bounded write attempt, because that attempt did not perform promotion.
- Current runtime now resolves to `publicDataSource=supabase` and `scoreSource=real`.
- Data coverage is no longer the blocker; freshness monitoring is now the blocker.

## Current Coverage Snapshot

| Coverage item | Current status |
| --- | --- |
| Phase 1 candidate rows | `500` |
| Existing rows before write | `63` |
| Planned insert rows | `437` |
| Inserted rows | `437` |
| Skipped existing rows | `63` |
| Final candidate-key rows after write | `500/500` |
| Missing rows after write | `0` |
| Coverage complete after write | `true` |
| Historical write-boundary public data source | `mock` |
| Historical write-boundary score source | `mock` |
| Current runtime public data source | `supabase` |
| Current runtime score source | `real` |

## Data-Online Gate Table

| Gate | Status | Evidence | Next action |
| --- | --- | --- | --- |
| Legal/free automated source | Prepared for Phase 1 public disclosure | `check:open-free-auto-data-source-gate`, `check:twse-openapi-bounded-metadata-terms-validation` | Keep source terms and attribution visible; do not overclaim official endorsement. |
| Field contract and parser path | Ready for synthetic and mock-runtime wiring | `check:twse-openapi-source-adapter-contract`, `check:twse-openapi-parser-contract`, `check:twse-openapi-parser-consumer-adapter` | Keep parser fail-closed and raw payload excluded. |
| Runtime mock consumer wire | Ready | `check:twse-openapi-runtime-mock-consumer-wire` | Use it only to improve public comprehension while real promotion stays locked. |
| Sanitized row-payload candidate | Accepted for executed bounded attempt | `validate:phase-1-sanitized-row-payload-candidate-artifact` | Do not reuse for another write without a new explicit authorization. |
| Phase 1 daily_prices bounded attempt/readback | Complete for accepted current-scope shard-001 | `data/evidence-intake/phase-1-current-scope-bounded-insert-missing-post-run-review-2026-06-19-shard-001.json`, `check:phase-1-post-write-coverage-scoring-gate` | Move to runtime promotion preflight; do not run another write against the same shard. |
| Runtime promotion | Complete, monitoring required | `publicDataSource=supabase`, `scoreSource=real`, `check:runtime-promotion-readiness-summary` | Monitor daily freshness, rollback/fail-safe behavior, source disclosure, and public-copy boundaries. |

## Required After Runtime Real Promotion Go

Runtime real promotion is active for the Phase 1 scope. PM must keep all of the following true:

1. Daily freshness checks confirm `daily_prices` and `daily_scores` continue to update after close.
2. Freshness and timestamp display rules remain visible to users.
3. Source attribution and delay language remain visible and legally safe for the chosen data source.
4. Rollback/fail-closed behavior remains documented and verified.
5. Public copy avoids investment advice, buy/sell/hold direction, return-promise wording, real-time precision claims, and complete-market-coverage claims.
6. Explainable modules continue to trace every positive/negative reason to explicit rule evidence.

## Current Safe Mainline

PM should continue:

- daily freshness monitoring;
- route-level data boundary consistency;
- public copy for freshness, source, and delay;
- fail-closed runtime behavior;
- explainable score-source quality;
- visual and information hierarchy cleanup where it improves Phase 1 comprehension.

PM should not continue without a new explicit decision:

- SQL execution;
- additional Supabase writes;
- staging row creation;
- additional `daily_prices` mutation;
- raw market-data fetch/store/commit;
- committed row payload or raw payload output;
- any claim of investment advice, buy/sell/hold direction, real-time precision, or complete market coverage.

## Next PM Route

`phase_1_real_runtime_daily_freshness_monitoring`

The next high-value PM route is to keep the public runtime readable and monitor the real-data daily freshness loop. Data coverage is no longer the blocker for the Phase 1 launch subset; freshness monitoring is now the blocker.
