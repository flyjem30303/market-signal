# A2 Real Operator Packet Intake Blocker Copy Guard

## Status

status: `a2_real_operator_packet_intake_blocker_copy_guard_ready`

This document defines wording and semantic guardrails for the TWII real operator packet intake blocker gate. The gate is local-only copy and reporting support for a future required-field review path. It does not execute, authorize, write, record, score, or promote real data.

## Scope

Use this guard when PM integrates or reviews copy for a real operator packet intake blocker that stops when required packet values are missing.

The approved meaning is:

- A future operator packet may be reviewed for required-value completeness.
- Missing required values must produce a blocker result.
- A blocker result means execution is still blocked.
- The blocker does not grant authorization.
- The blocker does not record real decision values.
- The blocker does not write to Supabase or any runtime table.
- The blocker does not change `publicDataSource` or `scoreSource`.

## Safe Wording

Approved phrases:

- `real intake blocker`
- `missing required values`
- `future operator review only`
- `execution still blocked`
- `not investment advice`
- `required-value completeness check`
- `operator packet remains incomplete`
- `authorization not granted`
- `no runtime write performed`
- `no real scoring performed`
- `local-only blocker report`

Preferred UI/report copy:

- Real intake blocker: missing required values.
- Future operator review only; execution still blocked.
- This report is not investment advice.
- The packet cannot proceed until required values are supplied and separately reviewed.
- No authorization, write, or real scoring is implied by this blocker.

## Forbidden Wording

Do not say or imply:

- authorized
- authorization accepted
- execution approved
- written
- saved to Supabase
- inserted into Supabase
- recorded real decision
- real decision accepted
- live real data enabled
- launched with real data
- entered Supabase
- promoted to production data
- `publicDataSource=supabase`
- `scoreSource=real`

Explicitly forbidden claims:

- Do not say the operator has authorized anything.
- Do not say the system has written, inserted, upserted, updated, or deleted any real row.
- Do not say true decision values have been recorded.
- Do not say real public data is online.
- Do not say the packet has entered Supabase.
- Do not say the score source is real.

## Public Beta Guard

Public-facing beta copy must keep the blocker framed as a safety stop, not a launch milestone.

Allowed:

- Public beta remains blocked from real-data execution.
- Real intake is under required-value review.
- Missing required values prevent operator packet acceptance.
- Public output remains non-advisory and non-executing.

Forbidden:

- Public beta is now using real TWII data.
- Real decisions are being accepted.
- Operator authorization is active.
- Live Supabase intake is enabled.
- Real scoring is available.

## Disclaimer Guard

Every external or semi-public report that mentions this blocker should preserve these meanings:

- This is not investment advice.
- This is not a recommendation to buy, sell, hold, or trade.
- This is not a legal, compliance, or source-rights approval.
- This is not a real-data launch confirmation.
- This is not authorization to execute, write, or score.

Recommended disclaimer:

> This blocker report is for future operator review only. It identifies missing required values and keeps execution blocked. It is not investment advice, not authorization, not a legal approval, and not evidence of a real-data write or real scoring.

## Internal Operator Wording Guard

Internal operator copy may mention readiness review, but must not sound like acceptance.

Use:

- `packet incomplete`
- `required values missing`
- `intake blocked`
- `future operator review only`
- `manual review still required`
- `execution still blocked`

Avoid:

- `accepted`
- `confirmed`
- `authorized`
- `approved`
- `activated`
- `real decision recorded`
- `ready for Supabase`
- `real scoring enabled`

When a required value is missing, the UI/report must state the blocker outcome before any next-step language. Next steps should be phrased as repair or review tasks, not execution tasks.

Example:

```text
Real intake blocker: missing required values.
Future operator review only; execution still blocked.
Repair the incomplete fields before any separate review can occur.
This is not investment advice.
```

## PM Integration Notes

PM can attach this copy guard to the local-only intake blocker gate as the wording contract for UI, report, and handoff text.

Integration requirements:

- Keep blocker status separate from authorization status.
- Keep required-value completeness separate from source-rights, legal, runtime, and scoring approval.
- Treat missing required values as a hard blocker.
- Preserve `publicDataSource=mock` unless a separate approved change explicitly says otherwise.
- Preserve `scoreSource=mock` unless a separate approved change explicitly says otherwise.
- Do not expose secrets, environment values, authorization phrases, confirmation phrases, real decision values, raw rows, raw market payloads, or stock-id payloads.
- Do not create staging rows, candidate rows, or `daily_prices` writes from this blocker.
- Do not connect this copy guard to SQL, Supabase clients, runtime ingestion, or real scoring.

Suggested PM handoff line:

```text
A2 copy guard ready: use the real intake blocker wording only for missing required values and future operator review. Execution remains blocked; no authorization, Supabase write, real decision recording, public real-data launch, or real scoring is implied.
```

## Acceptance Checklist

- Status line is present.
- Safe wording includes `real intake blocker`, `missing required values`, `future operator review only`, `execution still blocked`, and `not investment advice`.
- Forbidden wording blocks authorization, writes, real decision recording, real-data launch, Supabase entry, and `scoreSource=real`.
- Public beta wording stays blocked and non-advisory.
- Disclaimer wording rejects investment, legal, authorization, write, and scoring implications.
- Internal operator wording frames missing fields as repair/review only.
- PM integration notes preserve mock/default posture and avoid runtime or secret surfaces.
