# Phase 1 Runtime Promotion Separate Bounded Attempt Review Packet

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_separate_bounded_attempt_review_packet_ready_no_execution`

Decision: `PREPARE_BOUNDED_ATTEMPT_REVIEW_KEEP_MOCK`

Owner: CEO / PM mainline

## Purpose

This packet defines the review conditions for a future one-time, bounded public-source promotion attempt.

It is not an execution packet. It does not grant operator authorization, change runtime flags, touch platform settings, connect to Supabase, run SQL, write data, accept candidate rows, or promote public runtime state.

## Evidence Chain

- Operator review summary: `docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_REVIEW_SUMMARY.md`
- Operator packet draft: `data/evidence-intake/phase-1-runtime-promotion-operator-packet.draft.json`
- Operator packet intake check: `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-operator-packet-intake`
- Operator review summary check: `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-operator-review-summary`

## Current Runtime Boundary

- `promotionAllowedNow=false`
- `dryRunOnlyAllowedNow=true`
- `publicDataSource=mock`
- `scoreSource=mock`
- `operatorDecision=RUN_PROMOTION_DRY_RUN_ONLY`

## Bounded Attempt Preconditions

A future bounded attempt may be prepared only if all of the following remain true:

1. The operator packet draft passes intake with `phase_1_runtime_promotion_operator_packet_intake_ready_no_execution`.
2. The operator review summary passes with `phase_1_runtime_promotion_operator_review_summary_ready_no_execution`.
3. Runtime flag, rollback owner, rollback shape, readback shape, smoke shape, post-promotion review owner, and public fallback copy are all non-secret and present.
4. Public copy still says signals are market-status references, not investment advice.
5. The future attempt remains reversible through the named rollback owner and readback checks.

## Future Attempt Shape

| Item | Required shape before execution |
| --- | --- |
| Runtime target | `NEXT_PUBLIC_DATA_SOURCE` can be reviewed as the public-source switch. |
| Target value | `supabase` can be reviewed as a future target value only. |
| Rollback | Return public source to `mock`, redeploy, then run public smoke and boundary checks. |
| Readback | Public route smoke must prove the visible public source state. |
| Smoke | Public visible residue and route health checks must pass. |
| Post-run review | CEO / PM must review output before any real-data claim. |
| Public copy | Fallback and freshness wording must remain non-advice and avoid real-time claims. |

## No-Execution Decision

Current decision: keep mock.

Allowed next route:

`phase_1_runtime_promotion_operator_authorization_request_packet`

That next route may ask for explicit operator authorization, but it still must fail closed unless rollback, readback, post-run review, and public copy gates are present.

## Hard Stop Conditions

Stop before any of the following:

- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock-id payload, or secret output;
- production environment mutation;
- runtime flag mutation;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time precision claim;
- complete-market coverage claim;
- guaranteed-return or investment-advice claim.

## Next PM Action

Prepare an operator authorization request packet only if this review packet, operator packet intake, operator review summary, review gate, and TypeScript checks pass.

The future authorization request must stay separate from execution. Execution can only be considered after a new explicit operator decision and fresh pre-run verification.
