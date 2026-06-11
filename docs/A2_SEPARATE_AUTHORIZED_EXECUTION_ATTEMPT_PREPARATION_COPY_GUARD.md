# A2 Separate Authorized Execution Attempt Preparation Copy Guard

Status: a2_separate_authorized_execution_attempt_preparation_copy_guard_ready

## Scope

A2 reviewed operator and public wording for the TWII separate authorized execution attempt preparation gate. This document is a copy guard only. It helps PM keep preparation language readable, fail-closed, and safe without implying authorization, real data receipt, execution, launch, legal approval, or investment advice.

The copy posture remains:

- local-only
- review-only
- preparation-only
- presence-only
- value-hidden
- non-executable
- `publicDataSource=mock`
- `scoreSource=mock`

## Safe Wording

safe wording may say:

- This is separate authorized execution attempt preparation.
- PM is preparing an operator checklist for a possible later attempt.
- The preparation gate keeps hard boundaries visible before any later authorization decision.
- Required controls may be listed as presence-only placeholders.
- External operator values, authorization values, confirmation phrases, execute switch values, secrets, env values, and real decision values are not read, collected, stored, echoed, inferred, or verified here.
- SQL, Supabase connection, Supabase writes, `daily_prices` mutation, candidate row acceptance, market-data fetch, raw payload handling, and promotion remain blocked.
- Public runtime remains on `publicDataSource=mock`.
- Score runtime remains on `scoreSource=mock`.
- Any later execution attempt requires a separate explicit authorization and a separate fail-closed review path.

## Forbidden Wording

forbidden wording includes any phrase, label, status, button text, heading, summary, release note, operator instruction, or public copy that directly or indirectly implies:

- authorization has been granted
- real decision values have been received
- the attempt is Go, approved to Go, ready to Go, or cleared to Go
- execution has run, started, completed, succeeded, or partially completed
- SQL has been executed
- Supabase has been connected
- Supabase writes have been attempted or completed
- Supabase has written rows
- `daily_prices` has been inserted, updated, backfilled, promoted, repaired, or verified by real rows
- data is now live, real, production-backed, or publicly real
- `publicDataSource=supabase` is active
- `scoreSource=real` is active
- legal approval, source-rights approval, compliance approval, or launch approval has been granted
- the output is investment advice
- users may trade, invest, buy, sell, hold, rebalance, or otherwise act on trades based on this output
- the copy can be used as a trading signal or transaction instruction

Avoid copy such as:

- "authorized execution ready"
- "authorization received"
- "real values received"
- "Go approved"
- "execution completed"
- "Supabase write complete"
- "real data is live"
- "legally approved"
- "safe to trade"
- "trade based on this signal"

## Public Copy Rule

public copy rule: Public-facing copy must describe the system as still mock-backed until a separate promotion gate passes. It may say the team is preparing a future operator review path, but it must not expose internal control details or suggest that the future path is already approved.

Public copy may mention:

- mock runtime data remains active
- mock scoring remains active
- real-data promotion has not happened
- public output is not investment advice
- users must not rely on the output for trading decisions

Public copy must not mention or reveal:

- secrets, env names, service-role handling, confirmation phrase shape, execute switch details, authorization packet details, operator values, SQL commands, raw payloads, row payloads, candidate rows, stock IDs from protected payloads, or real decision values

## Internal Operator Copy Rule

internal operator copy rule: Internal copy may list preparation requirements, blocked reasons, fail-closed fields, and PM handoff notes. It must keep every sensitive item value-hidden and must not ask operators to paste secrets, env values, authorization text, confirmation phrases, execute switch values, real decision values, market rows, raw payloads, or candidate rows into repo files, docs, logs, JSON artifacts, comments, chat, or public runtime UI.

Internal operator copy should use:

- "presence placeholder", not "value verified"
- "preparation gate", not "execution gate"
- "future separate authorization required", not "authorization accepted"
- "blocked until final explicit authorization", not "ready to run"
- "mock boundary preserved", not "real data enabled"

## Hard Boundaries

hard boundaries for this copy guard:

- no SQL
- no Supabase connection
- no Supabase client import
- no Supabase write
- no secret, env, authorization, confirmation phrase, execute switch, or real decision value read
- no market-data fetch
- no market-data ingestion
- no raw payload output
- no row payload output
- no protected stock-id payload output
- no `daily_prices` mutation
- no candidate row acceptance
- no runtime promotion
- no `publicDataSource=supabase`
- no `scoreSource=real`
- no legal approval claim
- no investment advice claim
- no trading instruction claim

## PM Integration Notes

PM integration notes:

- Keep the document title and status focused on separate authorized execution attempt preparation.
- Keep `publicDataSource=mock` and `scoreSource=mock` visible in any summary.
- Put blocked execution language before any future route language.
- Use "preparation", "presence-only", "review-only", and "fail-closed" as the main operator terms.
- Treat any wording that implies authorization, Go, execution, Supabase write success, real-data launch, legal approval, investment advice, or tradeability as a copy failure.
- If PM adds a public summary, include a plain no-investment-advice sentence and a mock-source sentence.
- If PM adds an operator checklist, keep it value-hidden and do not request protected values in text fields, artifacts, logs, or comments.

## Suggested Status Summary

Suggested PM-safe summary:

`separate_authorized_execution_attempt_preparation_copy_guard_ready_mock_boundaries_preserved_execution_still_blocked`

Suggested public-safe summary:

The service remains mock-backed while the team prepares a future internal review path. No real-data promotion, execution, Supabase write, legal approval, or investment advice is provided by this preparation gate.
