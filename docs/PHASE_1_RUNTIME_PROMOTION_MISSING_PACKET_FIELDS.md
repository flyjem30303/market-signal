# Phase 1 Runtime Promotion Missing Packet Fields

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_missing_packet_fields_ready_keep_mock`

Owner: CEO / PM mainline

Current route: `keep_mock_and_supply_missing_promotion_packet_fields`

## Purpose

This document turns the dry-run packet blocker into a fillable PM checklist.

It does not execute runtime promotion, change runtime flags, connect to Supabase, run SQL, write data, or switch public scoring. It only names who should supply each missing field before a future reviewed promotion packet can even become shape-ready.

## Current Decision

Keep:

- `publicDataSource=mock`
- `scoreSource=mock`

Promotion remains blocked until every field below is supplied in a separate reviewed packet and then passes the dry-run packet checker.

## Missing Fields To Supply

| Field | Required owner | What must be supplied | Acceptance rule |
| --- | --- | --- | --- |
| `runtimeFlagName` | PM / runtime engineering | Exact runtime flag or environment key that would be changed in a later gate. | Must be non-secret and must not include a value that exposes credentials. |
| `runtimeFlagTargetValue` | PM / runtime engineering | Exact target value for the later bounded promotion attempt. | Must be a plain non-secret value and must not be applied by this checklist. |
| `rollbackOwner` | A3 / PM | Named person or lane accountable for rollback. | Must be non-empty and reachable before any later mutation gate. |
| `rollbackCommand` | A3 / PM | Exact command or manual step that returns runtime to mock. | Must be reviewed as command shape only here; do not run it from this checklist. |
| `readbackCommand` | PM / A3 | Exact command or route check proving what runtime source is active after a later mutation. | Must prove source state without printing secrets or row payloads. |
| `productionSmokeCommand` | A3 | Exact production smoke command or route sequence for post-change validation. | Must avoid secret output and must not claim real-time precision. |
| `postPromotionReviewOwner` | CEO / PM | Named owner for post-promotion review. | Must be a human or lane owner, not an implicit automation. |
| `publicCopyFallbackLine` | A2 / PM | User-facing fallback line if real source is unavailable, stale, or rolled back. | Must be non-advice, non-panic, and explicit about fallback/demo boundary. |
| `freshnessFallbackLine` | A2 / PM | User-facing line explaining freshness delay or unavailable update state. | Must avoid real-time guarantee and must not imply complete coverage. |

## Allowed Next Action

Allowed:

- prepare a separate packet that fills these fields;
- run `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-dry-run-packet` against that packet;
- keep public mock runtime moving while fields are missing.

Not allowed from this checklist:

- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock-id, or secret output;
- runtime flag mutation;
- production environment mutation;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time precision, complete market coverage, guaranteed-return, or investment-advice claims.

## Next PM Route

`phase_1_runtime_promotion_packet_field_intake_or_keep_mock_runtime`

CEO recommendation: keep Phase 1 public mock Beta product/runtime work moving while PM/A2/A3 prepare these fields. Do not execute mutation from this document.
