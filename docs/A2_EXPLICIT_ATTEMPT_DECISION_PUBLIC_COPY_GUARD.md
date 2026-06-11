# A2 Explicit Attempt Decision Public Copy Guard

Status: `a2_explicit_attempt_decision_public_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Public Trust / Runtime Copy
Integration owner: PM mainline
Mode: `local_only_fail_closed_no_execution_copy_guard`

## Purpose

This guard supports the PM mainline for the `TWII explicit bounded runtime attempt decision gate preflight`.
It is a wording and public-copy reference only.

This is not a UI patch, not a runtime action, not a PM gate/checker/status/board/package change,
not a Supabase action, not a market-data action, and not an execution decision.

It prevents `decision gate prepared` from being mistaken for attempt approval, runner execution,
Supabase connection or write, live data, complete market coverage, public source promotion, real
scoring, or investment advice.

## Non-Executable Boundary

- Do not change UI.
- Do not change PM mainline files.
- Do not change package files.
- Do not change review-gate scripts.
- Do not change project status files.
- Do not change `data/source-gates`.
- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not read, print, summarize, or expose secrets or env values.
- Do not read, print, summarize, or expose raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- Do not fetch, import, ingest, stage, store, commit, or backfill market data.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not accept rows.
- Do not perform row coverage scoring.
- Do not change `publicDataSource`.
- Do not change `scoreSource`.

## Core Guard

`TWII explicit bounded runtime attempt decision gate preflight prepared` means only that a local,
fail-closed, no-execution decision-gate preflight wording surface is prepared for PM/operator review.

It is not any of the following:

- attempt approved;
- runner executed;
- SQL executed;
- Supabase connected;
- Supabase read;
- Supabase written;
- data live;
- complete market coverage;
- rows accepted;
- row coverage scored or passed;
- `daily_prices` modified;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- investment advice;
- buy, sell, hold, timing, allocation, forecast, or reliance guidance.

The explicit bounded runtime attempt still requires:

- a final explicit operator decision;
- a separate authorization before any runner execution;
- preservation of the current local-only/fail-closed/no-execution posture until that decision is made;
- separate approval before any public runtime, data-source, scoring-source, coverage, or source-rights wording can become stronger.

## Safe Internal Wording

Use this wording for PM/operator coordination:

- "TWII explicit bounded runtime attempt decision gate preflight is prepared for PM/operator review."
- "Decision gate is prepared; attempt approval has not been granted."
- "Decision gate is prepared; the runner has not executed."
- "Decision gate is prepared; SQL has not been executed by this step."
- "Decision gate is prepared; Supabase has not been connected, read, or written by this step."
- "Decision gate is prepared; public data is not live."
- "Decision gate is prepared; complete TWII market coverage is not claimed."
- "Decision gate is prepared; rows have not been accepted and row coverage has not been scored by this step."
- "Decision gate is prepared; `publicDataSource=supabase` is not active."
- "Decision gate is prepared; `scoreSource=real` is not active."
- "Decision gate is prepared; this is not investment advice."
- "The explicit bounded runtime attempt still needs a final explicit operator decision."
- "Current posture remains local-only/fail-closed/no-execution."

Preferred internal status phrase:

> TWII explicit bounded runtime attempt decision gate preflight prepared for PM/operator review; not attempt approved, not runner executed, not Supabase-connected, not Supabase-written, not live data, not complete coverage, not `publicDataSource=supabase`, not `scoreSource=real`, not investment advice, and still local-only/fail-closed/no-execution pending final explicit operator decision.

## Unsafe Wording

Do not use wording that implies approval, execution, live data, complete coverage, Supabase activation,
real scoring, row acceptance, row coverage scoring, or investment advice:

- "TWII explicit bounded runtime attempt is approved."
- "The attempt decision gate has passed."
- "The decision gate is prepared, so the attempt can run."
- "The operator has approved the attempt."
- "The runner executed."
- "The runner executed successfully."
- "SQL has been executed."
- "Supabase is connected."
- "Supabase has been read."
- "Supabase has been written."
- "Data is live."
- "Live TWII data is available."
- "Real public data is enabled."
- "Coverage is complete."
- "Complete TWII market coverage is ready."
- "Rows are accepted."
- "Row coverage has passed."
- "`daily_prices` is updated."
- "`publicDataSource=supabase` is active."
- "`scoreSource=real` is active."
- "Real scores are available."
- "The signal is ready for investors."
- "Users can rely on this as investment guidance."
- "This is a buy/sell/hold signal."
- "Decision gate prepared means no further operator decision is needed."

Unsafe implication patterns:

- Any sentence where `prepared` is treated as `approved`.
- Any sentence where decision-gate preflight readiness is treated as runner execution.
- Any sentence where a local preflight artifact is treated as SQL execution, Supabase connection, Supabase read, Supabase write, or public runtime promotion.
- Any sentence where preflight status is treated as live data, complete market coverage, accepted rows, or completed row coverage scoring.
- Any sentence where mock/local status is blurred into `publicDataSource=supabase` or `scoreSource=real`.
- Any sentence where operational readiness is framed as investment advice, forecast quality, trading guidance, or user reliance.

## Operator-Facing Talking Points

- "This is an explicit bounded runtime attempt decision gate preflight. It does not approve the attempt."
- "Prepared gate means the operator can inspect the decision surface; it does not mean the runner executed."
- "No SQL execution, Supabase connection, Supabase read, or Supabase write is authorized or implied by this copy guard."
- "No live data, public runtime promotion, real scoring, row acceptance, row coverage scoring, or complete market coverage is authorized or implied."
- "The explicit bounded runtime attempt still requires a final explicit operator decision before any runner execution."
- "Current posture remains local-only/fail-closed/no-execution."
- "Do not describe this as `publicDataSource=supabase` or `scoreSource=real` unless a separate approved gate changes those values."
- "Do not describe scores, signals, summaries, rankings, watchlists, or gate status as investment advice."

Short operator script:

> The TWII explicit bounded runtime attempt decision gate preflight is prepared for PM/operator review. This preparation does not approve the attempt, does not mean the runner executed, does not execute SQL, does not connect, read, or write Supabase, does not make data live, does not establish complete coverage, does not activate `publicDataSource=supabase`, does not activate `scoreSource=real`, and is not investment advice. A final explicit operator decision is still required. Current posture remains local-only/fail-closed/no-execution.

## Copy Review Checklist

Before any internal, operator-facing, public, release-note, support, status-board, or handoff copy is accepted, confirm:

- The copy says `prepared for PM/operator review` or equivalent, not `approved`.
- The copy keeps the final explicit operator decision as still required.
- The copy states or preserves local-only/fail-closed/no-execution posture.
- The copy does not imply attempt approval.
- The copy does not imply runner execution.
- The copy does not imply SQL execution.
- The copy does not imply Supabase connection, Supabase read, Supabase write, or Supabase public activation.
- The copy does not imply live data.
- The copy does not imply complete market coverage.
- The copy does not imply staging rows were created.
- The copy does not imply `daily_prices` was modified.
- The copy does not imply rows were accepted.
- The copy does not imply row coverage scoring was performed or passed.
- The copy does not imply `publicDataSource=supabase`.
- The copy does not imply `scoreSource=real`.
- The copy does not describe the output as investment advice.
- The copy avoids buy, sell, hold, profit, timing, forecast, allocation, or reliance language.
- The copy does not reference secrets, env values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- The copy does not suggest market data was fetched, imported, ingested, staged, stored, committed, or backfilled.

Acceptable copy should be able to answer all of these with "no":

- Would a reader think the attempt is already approved?
- Would a reader think the runner already executed?
- Would a reader think SQL was executed?
- Would a reader think Supabase was connected, read, or written?
- Would a reader think data is already live?
- Would a reader think coverage is complete?
- Would a reader think rows were accepted or row coverage scored?
- Would a reader think `publicDataSource=supabase` is active?
- Would a reader think `scoreSource=real` is active?
- Would a reader treat this as investment advice?

## Stop Lines

Stop and route back to PM/operator review if proposed copy or requested work:

- converts `decision gate prepared` into attempt approval;
- says or implies the explicit bounded runtime attempt decision gate has passed without a final explicit operator decision;
- says or implies the attempt is authorized without a separate explicit operator decision;
- says or implies the runner executed;
- says or implies SQL was executed;
- says or implies Supabase was connected, queried, read, written to, or made public;
- says or implies current runtime status is public, live, production, or real-data backed;
- says or implies complete TWII market coverage;
- says or implies staging rows were created;
- says or implies rows were accepted, imported, scored, or written;
- says or implies `daily_prices` was modified;
- says or implies row coverage scoring was performed or passed;
- says or implies `publicDataSource=supabase`;
- says or implies `scoreSource=real`;
- includes secrets, env values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values;
- fetches, imports, ingests, stages, stores, commits, backfills, or claims new market data;
- uses investment advice language, including buy/sell/hold guidance, price prediction, profit expectation, allocation guidance, forecast validation, or user reliance language;
- requests a UI patch, PM gate/checker/status/board/package change, package change, runtime change, data-source switch, scoring-source switch, SQL action, Supabase action, staging-row action, `daily_prices` action, row acceptance, row coverage scoring, or market-data ingestion as part of copy review.

## Minimal Safe Copy Pattern

When copy must mention the prepared explicit attempt decision state, use this order:

1. Name the state as a local explicit bounded runtime attempt decision gate preflight.
2. Say it is prepared for PM/operator review.
3. Say it is not attempt approval.
4. Say the runner has not executed.
5. Say SQL has not been executed by this step.
6. Say Supabase has not been connected, read, or written by this step.
7. Say public data is not live and coverage is not complete.
8. Say `publicDataSource=supabase` and `scoreSource=real` are not active.
9. Say it is not investment advice.
10. Say a final explicit operator decision is still required.
11. Say current posture remains local-only/fail-closed/no-execution.

Example:

> TWII explicit bounded runtime attempt decision gate preflight is prepared for PM/operator review. This is not attempt approval, not runner execution, not SQL execution, not Supabase connection/read/write, not live data, not complete market coverage, not `publicDataSource=supabase`, not `scoreSource=real`, and not investment advice. A final explicit operator decision is still required. Current posture remains local-only/fail-closed/no-execution.

## Boundary Statement

This document only guards wording for the TWII explicit bounded runtime attempt decision gate preflight.
It does not change UI, PM gates, checkers, status boards, package files, runtime code, SQL,
Supabase state, market data, staging rows, `daily_prices`, row acceptance, row coverage scoring,
`publicDataSource`, or `scoreSource`.
