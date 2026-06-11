# A2 Server-Only Pre-Execution Integration Preparation Copy Guard

Status: a2_server_only_pre_execution_integration_preparation_copy_guard_ready

## Scope

This document is an A2 copy-safety guard for the PM mainline gate:
`TWII server-only pre-execution integration preparation gate`.

It is copy guidance only. It does not execute, validate, connect, ingest, write,
approve, promote, launch, or confirm any real-data path.

Required runtime posture to preserve:

- `publicDataSource=mock`
- `scoreSource=mock`

## Safe Wording

Use wording that keeps the work in preparation-only, mock-only, and non-executed
state:

- "pre-execution integration preparation"
- "server-only preparation gate copy is ready for PM review"
- "copy guard prepared for the next bounded PM review step"
- "mock-source posture remains unchanged"
- "`publicDataSource=mock` remains preserved"
- "`scoreSource=mock` remains preserved"
- "no SQL, Supabase, secret, authorization, market-data, or `daily_prices` action was performed"
- "no real external values are included in this copy guard"
- "server-only checks remain pending unless separately executed by an authorized PM-owned process"
- "this document is not investment advice and must not be used for trading decisions"

## Forbidden Wording

Do not use wording that states or implies any of the following:

- real external values were received, inspected, confirmed, or accepted
- server-only checks have passed
- the gate is approved, completed, live, launched, or Go
- execution has occurred
- Supabase has been connected to or written to
- `daily_prices` has been touched, updated, backfilled, or verified
- real market data has been fetched, ingested, stored, or promoted
- the public site is using real data
- legal or compliance review has approved the copy
- the output is an investment recommendation
- users may rely on this for trading
- `publicDataSource` may be changed away from `mock`
- `scoreSource` may be changed away from `mock`

## Public Copy Rule

Public-facing copy must stay conservative and mock-only.

Allowed public posture:

- Say the feature or gate is in preparation or review.
- Say displayed or computed outputs remain mock-only.
- Say no investment advice is provided.
- Say users must not trade based on the content.
- Preserve `publicDataSource=mock`.
- Preserve `scoreSource=mock`.

Disallowed public posture:

- Do not mention or imply real external market values.
- Do not imply production data readiness.
- Do not imply server-only checks passed.
- Do not imply legal approval.
- Do not imply launch approval.
- Do not imply any Supabase write or `daily_prices` update.

## Internal Operator Copy Rule

Internal operator copy may be more explicit about boundaries, but must still avoid
execution claims.

Required internal operator wording:

- "Preparation-only; not executed."
- "No SQL executed."
- "No Supabase connection or write attempted."
- "No secrets, env values, authorization text, confirmation phrase, or real decision values read."
- "No market data fetched."
- "`daily_prices` untouched."
- "`publicDataSource=mock` preserved."
- "`scoreSource=mock` preserved."
- "Server-only checks are not represented as passed by this A2 document."

Internal operator copy must not include credentials, secrets, environment
contents, authorization phrases, confirmation phrases, raw payloads, row payloads,
or real decision values.

## PM Integration Notes

PM can use this document as a copy guard when integrating the server-only
pre-execution preparation gate into the mainline review packet.

Integration notes:

- Treat this as A2 wording safety coverage only.
- Keep all execution, authorization, confirmation, and server-only check results
  outside this document unless PM provides a separate approved artifact.
- Do not promote this document into an approval record.
- Do not use this document as evidence that runtime checks passed.
- Do not change `publicDataSource=mock`.
- Do not change `scoreSource=mock`.
- If a later PM-owned process executes server-only checks, that process must
  produce its own bounded result artifact and must not be backfilled into this
  copy guard as if it existed at A2 preparation time.

Suggested PM handoff line:

> A2 copy guard is ready for PM integration review. It preserves
> `publicDataSource=mock` and `scoreSource=mock`, makes no execution claim, and
> does not imply real-data receipt, Supabase write, server-only pass, legal
> approval, launch approval, investment advice, or trade usability.

## Hard Boundaries

This A2 branch did not and must not perform any of the following:

- execute SQL
- connect to Supabase
- read secrets
- read env values
- read authorization text
- read a confirmation phrase
- read real decision values
- fetch market data
- ingest market data
- store market data
- touch `daily_prices`
- write to `daily_prices`
- change `publicDataSource`
- change `scoreSource`
- imply `publicDataSource=supabase`
- imply `scoreSource=real`
- claim legal approval
- claim investment suitability
- claim users can trade from this material

Final preserved posture:

- `publicDataSource=mock`
- `scoreSource=mock`
