# A2 Explicit Operator Go/No-Go Decision Copy Guard

Status: a2_explicit_operator_go_no_go_decision_copy_guard_ready

## Scope

This A2 review covers runtime, operator, and public-facing wording for the TWII explicit operator go/no-go decision preparation gate.

The copy must describe decision preparation only. It must not imply that an operator has already selected Go, that execution has started, that Supabase has been written, that real market data is public, that legal approval is complete, or that the product is giving investment advice.

## Safe Wording

Use wording that keeps the state preparation-only, mock-bound, and pending an explicit operator decision.

- "Explicit operator go/no-go decision preparation is ready for PM/CEO review."
- "No operator Go decision has been recorded by this preparation gate."
- "No production write has been executed from this gate."
- "Runtime remains mock-bound until a separate authorized execution attempt is explicitly approved, executed, read back, and reviewed."
- "Supabase write closure remains pending."
- "publicDataSource remains mock."
- "scoreSource remains mock."
- "This gate prepares decision fields, blocked reasons, and post-decision evidence placeholders."
- "Candidate rows remain unaccepted until a later authorized execution and review path completes."

## Forbidden Wording

Do not use wording that suggests completed authorization, execution, production promotion, legal approval, or investment advice.

- Do not say "Go has been approved" or "the operator approved execution."
- Do not say "execution has started" or "execution completed."
- Do not say "TWII data is live" or "real data is online."
- Do not say "Supabase has been written" or "database write completed."
- Do not say "daily_prices is updated."
- Do not say "candidate rows are accepted."
- Do not say "publicDataSource=supabase" or "scoreSource=real."
- Do not say "legal has approved public launch" unless a separate legal approval artifact exists.
- Do not say "buy", "sell", "hold", "outperform", or any wording that can be read as investment advice.
- Do not expose, infer, paraphrase, or store secrets, env values, authorization phrases, confirmation phrases, real decision values, raw payloads, row payloads, or stock-id payloads.

## Public Copy Rule

Public copy must remain conservative, trust-oriented, and mock-bound.

Allowed public-facing meaning:

- The product is preparing internal data-source and execution controls.
- The public runtime remains mock-bound where marked.
- Any real-data promotion requires separate internal gates and review evidence.
- Information is for product testing and decision-support design, not investment advice.
- Public wording may describe transparency, source labeling, and safety checks.

Disallowed public-facing meaning:

- Do not claim real TWII coverage is complete.
- Do not claim live market data is active.
- Do not claim Supabase is the active public source.
- Do not claim an operator Go decision has been made.
- Do not claim execution has occurred.
- Do not claim signals are investment recommendations.
- Do not imply legal, compliance, or regulatory approval beyond the current documented disclaimer and review status.

## Internal Operator Copy Rule

Internal operator copy may be more precise, but must still be presence-only and fail-closed.

Allowed internal meaning:

- Operator-facing text may state that decision inputs are expected as externally supplied values.
- It may confirm whether required decision placeholders and blocked-reason fields are present.
- It may say that execution remains blocked until a separate authorized execution attempt is initiated under the approved command path.
- It may reference rollback, readback, duplicate-proof, post-run review, and blocked-reason placeholders.
- It may separate "decision preparation", "operator decision", "authorized execution", and "post-run review" as different stages.

Disallowed internal meaning:

- Do not print, store, infer, or validate the actual authorization phrase, confirmation phrase, secret key, env value, service-role value, or real decision value.
- Do not instruct the runtime to connect to Supabase.
- Do not instruct the runtime to write staging rows or daily_prices.
- Do not turn candidate artifact rows into accepted rows.
- Do not instruct any public runtime flag change from mock to real.
- Do not collapse decision preparation and execution into a single completed state.

## PM Integration Notes

PM should integrate this A2 copy guard into the explicit operator go/no-go decision preparation gate as a wording safety dependency.

Recommended PM acceptance checks:

- The decision preparation gate includes `a2_explicit_operator_go_no_go_decision_copy_guard_ready`.
- Runtime and operator copy explicitly say this is decision preparation, not a recorded Go decision.
- Public copy keeps `publicDataSource=mock` and `scoreSource=mock`.
- Any go/no-go label is framed as a pending operator decision, not completed execution.
- Any future transition to real data requires separate explicit authorization, execution evidence, readback evidence, rollback readiness, duplicate checks, and post-run review.

## Hard Boundaries

- No SQL.
- No Supabase connection.
- No secrets, env values, authorization phrases, confirmation phrases, or real decision values are read, printed, stored, inferred, or validated.
- No market data fetch, ingest, storage, or raw payload handling.
- No daily_prices mutation.
- No staging row creation.
- No candidate row acceptance.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No legal approval claim unless a separate legal approval artifact exists.
- No investment recommendation wording.
