# A2 One-Attempt Authorization Public Copy Guard

## Purpose

This guard supports the PM mainline for the `TWII one-attempt authorization intake preflight`.
It is a public-trust and runtime-copy reference only. It is not a UI patch, not a runtime gate,
not a checker update, and not an authorization decision.

Current posture:

- `authorization intake prepared` means the intake package wording is prepared for operator review.
- It does not mean execution is approved.
- It does not mean data is live.
- It does not mean complete market coverage is available.
- It does not mean `publicDataSource=supabase`.
- It does not mean `scoreSource=real`.
- It does not mean investment advice.
- The one-attempt path still requires a final explicit operator decision.
- The current posture remains local-only and no-execution.

## Safe Internal Wording

Use this wording for internal PM/operator coordination:

- "TWII one-attempt authorization intake preflight is prepared for operator review."
- "The package is ready for a final explicit operator decision before any execution."
- "No execution has been approved by this preparation step."
- "No Supabase runtime switch is implied."
- "No live public data posture is implied."
- "No complete market coverage claim is implied."
- "No real-score posture is implied."
- "This remains local-only/no-execution until the operator explicitly authorizes the next step."
- "Prepared intake means review readiness, not market-data activation."
- "Any public copy must keep mock/local status separate from future authorization language."

Preferred internal status phrase:

> TWII one-attempt authorization intake prepared for final operator decision; local-only/no-execution remains in effect.

## Unsafe Public Wording

Do not use wording that implies approval, live status, complete coverage, real scoring, or advice:

- "TWII execution is approved."
- "The one-attempt run is authorized."
- "The system is live on market data."
- "TWII data is now live."
- "Coverage is complete."
- "All required market rows are accepted."
- "Supabase is now the public data source."
- "`publicDataSource=supabase` is active."
- "`scoreSource=real` is active."
- "Real scores are available to users."
- "The signal is ready for investors."
- "Users can rely on this as investment guidance."
- "The intake is prepared, so execution can proceed."
- "One-attempt means no further operator decision is needed."

Unsafe implication pattern:

- Any sentence where `prepared` is treated as `approved`.
- Any sentence where intake readiness is treated as runtime execution.
- Any sentence where a future operator decision is described as already made.
- Any sentence where local-only work is described as public/live/production data.
- Any sentence where mock/local state is blurred into real scoring or Supabase-backed public state.

## Operator-Facing Talking Points

- "This is an intake-preflight copy guard. It does not authorize execution."
- "The package is ready to be reviewed, but the final explicit operator decision has not been made here."
- "The one-attempt constraint still requires a clear operator yes/no before any attempt."
- "Current status remains local-only/no-execution."
- "Do not describe this as live market data, real scoring, or complete TWII coverage."
- "Do not claim `publicDataSource=supabase` or `scoreSource=real` unless a separate approved gate changes those values."
- "Do not frame outputs as investment advice or user trading guidance."
- "Public wording should say preparation/review readiness, not approval/activation/completion."

Short operator script:

> The TWII one-attempt authorization intake is prepared for review. This preparation does not approve execution, does not activate live data, does not establish complete market coverage, and does not switch `publicDataSource` or `scoreSource`. A final explicit operator decision is still required. Current posture remains local-only/no-execution.

## Copy Review Checklist

Before any public, operator, or status-board copy is accepted, confirm:

- The copy says `prepared for review` or equivalent, not `approved`.
- The copy keeps final explicit operator decision as still required.
- The copy states or preserves local-only/no-execution posture.
- The copy does not imply live data.
- The copy does not imply complete market coverage.
- The copy does not imply accepted rows or completed row coverage scoring.
- The copy does not imply `publicDataSource=supabase`.
- The copy does not imply `scoreSource=real`.
- The copy does not describe the output as an investment recommendation.
- The copy avoids trading, buy/sell, profit, timing, or reliance language.
- The copy does not reference secrets, env values, raw payloads, row payloads, stock-id payloads, or private runtime details.
- The copy does not suggest SQL, Supabase, staging rows, `daily_prices`, market-data import, or runtime mutation has happened.

Acceptable copy should be able to answer all of these with "no":

- Would a reader think execution is already approved?
- Would a reader think data is already live?
- Would a reader think coverage is complete?
- Would a reader think Supabase is already public-facing?
- Would a reader think real scores are already active?
- Would a reader treat this as investment advice?

## Stop Lines

Stop and route back to PM/operator review if proposed copy:

- Converts `authorization intake prepared` into execution approval.
- Says or implies the one-attempt run is authorized without a final explicit operator decision.
- Says or implies current runtime status is public/live/production market data.
- Says or implies complete TWII market coverage.
- Says or implies rows were accepted, staged, imported, scored, or written.
- Says or implies `daily_prices` was modified.
- Says or implies SQL was executed.
- Says or implies Supabase was connected, queried, written to, or made public.
- Says or implies `publicDataSource=supabase`.
- Says or implies `scoreSource=real`.
- Includes secrets, env values, raw payloads, row payloads, stock-id payloads, or private market-data details.
- Fetches, imports, stores, or claims new market data.
- Creates staging-row expectations or accepts row coverage scoring.
- Uses investment advice language, including buy/sell/hold guidance, price prediction, profit expectation, or user reliance language.
- Requests a UI patch, PM gate/checker/status/board/package change, runtime change, data-source switch, scoring-source switch, SQL action, Supabase action, or market-data ingestion as part of copy review.

## Boundary Statement

This document only guards wording for the TWII one-attempt authorization intake preflight.
It does not change UI, PM gates, checkers, status boards, package files, runtime code, SQL,
Supabase state, market data, staging rows, `daily_prices`, row acceptance, row coverage scoring,
`publicDataSource`, or `scoreSource`.
