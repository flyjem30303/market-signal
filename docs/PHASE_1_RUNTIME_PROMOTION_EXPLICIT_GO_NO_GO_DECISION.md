# Phase 1 Runtime Promotion Explicit GO/NO-GO Decision

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_explicit_go_no_go_decision_ready_no_go`

Owner: CEO / PM mainline

Decision: `NO_GO_FOR_REAL_RUNTIME_PROMOTION_NOW`

## Purpose

This document is the explicit GO/NO-GO decision after the runtime promotion review packet.

It prevents an accidental jump from local evidence readiness to public real-data promotion. The current evidence supports entering the named promotion decision gate, not switching runtime flags.

## Decision Summary

| Item | Decision |
| --- | --- |
| Enter named mock-to-real promotion gate | `GO_TO_OPERATOR_DECISION_GATE` |
| Promote public data source now | `NO_GO` |
| Promote score source now | `NO_GO` |
| Run additional write attempt now | `NO_GO` |
| Rerun row coverage now | `NO_GO` |

## Evidence Accepted For Decision

- Row coverage: complete for the Phase 1 launch subset.
- Data quality review packet: accepted for review packet.
- Freshness display: accepted for review packet and user-facing `freshness.description` is visible.
- Source disclosure: accepted for review packet.
- Rollback / fail-closed: accepted for review packet with no-execution rollback/quarantine contract.
- Public copy boundary: accepted for review packet with no investment advice and no real-time precision claim.
- Production smoke: public routes are reachable and still report `publicDataSource=mock` and `scoreSource=mock`.

## Current Runtime State

- `promotionAllowedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Why This Is Still NO-GO

- A public runtime promotion is an operator decision, not an automatic result of local checks.
- The site must preserve user trust copy, fallback behavior, and post-promotion rollback/readback review before any public real-data claim.
- `scoreSource=real` remains outside this Phase 1 runtime decision because model credibility and investment-grade scoring are separate gates.

## Hard Stop

This decision does not:

- run SQL;
- write Supabase;
- create staging rows;
- mutate `daily_prices`;
- fetch, ingest, store, or commit raw market data;
- print secrets, raw payloads, row payloads, or stock IDs;
- approve public source promotion;
- approve real score promotion;
- claim real-time precision, complete market coverage, guaranteed outcomes, or investment advice.

## Next PM Route

`phase_1_runtime_promotion_operator_decision_gate`

The next gate may ask CEO/operator to explicitly choose one of:

1. `KEEP_MOCK_AND_MONITOR`
2. `RUN_PROMOTION_DRY_RUN_ONLY`
3. `AUTHORIZE_BOUNDED_PUBLIC_SOURCE_PROMOTION`

Default CEO recommendation: `KEEP_MOCK_AND_MONITOR` until the operator decision can name exact runtime flags, rollback owner, readback command, smoke command, and post-promotion review owner.
