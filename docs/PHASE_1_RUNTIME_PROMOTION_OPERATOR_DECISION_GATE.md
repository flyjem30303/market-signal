# Phase 1 Runtime Promotion Operator Decision Gate

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_operator_decision_gate_ready_keep_mock`

Owner: CEO / PM mainline

Current operator decision: `KEEP_MOCK_AND_MONITOR`

## Purpose

This gate is the operator decision intake surface after `PHASE_1_RUNTIME_PROMOTION_EXPLICIT_GO_NO_GO_DECISION.md`.

It keeps Phase 1 moving without accidentally promoting public runtime data from local evidence alone. The current default is still to keep mock runtime visible while preparing an exact, reversible promotion packet.

## Allowed Operator Choices

| Choice | Meaning | Execution allowed now |
| --- | --- | --- |
| `KEEP_MOCK_AND_MONITOR` | Keep `publicDataSource=mock` and `scoreSource=mock`; continue local monitoring and user-facing clarity work. | `false` |
| `RUN_PROMOTION_DRY_RUN_ONLY` | Prepare or run local no-write dry-run checks only. No public source switch. | `false` |
| `AUTHORIZE_BOUNDED_PUBLIC_SOURCE_PROMOTION` | Future explicit promotion path only when all required fields below are named. | `false` in this gate |

## Required Fields Before Any Future Promotion Attempt

No future bounded public-source promotion may start unless a separate packet names all of these fields:

- `runtimeFlagName`
- `runtimeFlagTargetValue`
- `rollbackOwner`
- `rollbackCommand`
- `readbackCommand`
- `productionSmokeCommand`
- `postPromotionReviewOwner`
- `publicCopyFallbackLine`
- `freshnessFallbackLine`

Missing any field keeps the decision at `KEEP_MOCK_AND_MONITOR`.

## Current Decision Payload

```json
{
  "operatorDecision": "KEEP_MOCK_AND_MONITOR",
  "promotionAllowedNow": false,
  "publicDataSource": "mock",
  "scoreSource": "mock",
  "runtimeFlagName": null,
  "runtimeFlagTargetValue": null,
  "rollbackOwner": null,
  "rollbackCommand": null,
  "readbackCommand": null,
  "productionSmokeCommand": null,
  "postPromotionReviewOwner": null,
  "publicCopyFallbackLine": null,
  "freshnessFallbackLine": null
}
```

## Fail-Closed Rules

This gate must fail closed if:

- the operator choice is not one of the three allowed choices;
- `promotionAllowedNow` is `true`;
- `publicDataSource` is not `mock`;
- `scoreSource` is not `mock`;
- any future promotion field is filled in this keep-mock gate;
- SQL, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, raw payload output, row payload output, stock-id output, secret output, real-time precision, complete market coverage, guaranteed outcomes, or investment advice is requested.

## Hard Boundaries

This gate does not:

- run SQL;
- write Supabase;
- create staging rows;
- mutate `daily_prices`;
- fetch, ingest, store, or commit raw market data;
- print secrets, raw payloads, row payloads, or stock IDs;
- promote `publicDataSource=supabase`;
- promote `scoreSource=real`;
- claim real-time precision, complete market coverage, guaranteed outcomes, or investment advice.

## Next PM Route

`phase_1_runtime_promotion_keep_mock_monitoring_or_future_bounded_promotion_packet`

CEO recommendation: keep `KEEP_MOCK_AND_MONITOR` as the active decision. Only create a future bounded promotion packet after the operator can name the exact runtime flag, rollback owner, readback command, production smoke command, and post-promotion review owner.
