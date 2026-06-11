# A2 Final Authorization Stopline Go/No-Go Copy Guard

Status: a2_final_authorization_stopline_go_no_go_copy_guard_ready

## Scope

This A2 review covers runtime, operator, and public-facing wording for the TWII final authorization stopline go/no-go gate.

The copy must describe a readiness and authorization stopline only. It must not imply that a real execution, Supabase write, production data promotion, legal approval, or investment recommendation has already happened.

## Safe Wording

Use wording that keeps the state review-only, mock-bound, and pending final authorization.

- "Final authorization stopline is ready for PM/CEO go/no-go review."
- "No production write has been executed from this gate."
- "Runtime remains mock-bound until a separate authorized execution attempt is explicitly approved and completed."
- "Supabase write closure remains pending until post-run readback, rollback, and review evidence pass."
- "publicDataSource remains mock."
- "scoreSource remains mock."
- "This gate records readiness, blocked reasons, and required evidence placeholders."
- "Candidate rows remain unaccepted until a later authorized execution and review path completes."

## Forbidden Wording

Do not use wording that suggests completion, production promotion, legal approval, or investment advice.

- Do not say "TWII data is live" or "real data is online."
- Do not say "Supabase has been written" or "database write completed."
- Do not say "daily_prices is updated."
- Do not say "candidate rows are accepted."
- Do not say "publicDataSource=supabase" or "scoreSource=real."
- Do not say "final authorization has been executed."
- Do not say "legal has approved public launch" unless a separate legal approval artifact exists.
- Do not say "buy", "sell", "hold", "outperform", or any wording that can be read as investment advice.
- Do not expose or paraphrase secrets, env values, authorization phrases, confirmation phrases, real decision values, raw payloads, row payloads, or stock-id payloads.

## Public Copy Rule

Public copy must be conservative and user-trust focused.

Allowed public-facing meaning:

- The site is still using mock-bound score/data presentation where marked.
- Any real-data promotion is controlled by internal gates.
- Information is for product testing and decision-support design, not investment advice.
- Public readiness language may describe transparency, safety checks, and data-source labeling.

Disallowed public-facing meaning:

- Do not claim real TWII coverage is complete.
- Do not claim live market data is active.
- Do not claim Supabase is the active public source.
- Do not claim signals are investment recommendations.
- Do not imply a regulatory or legal approval state beyond the current disclaimer and documented review status.

## Internal Operator Copy Rule

Internal operator copy may be more precise, but must still be presence-only and fail-closed.

Allowed internal meaning:

- Operator-facing text may state that final authorization inputs are expected as externally supplied values.
- It may confirm whether required placeholders and stopline fields are present.
- It may say that execution remains blocked until the authorized execution attempt is separately initiated under the approved command path.
- It may reference rollback, readback, duplicate-proof, post-run review, and blocked-reason placeholders.

Disallowed internal meaning:

- Do not print or store the actual authorization phrase, confirmation phrase, secret key, env value, service-role value, or real decision value.
- Do not instruct the runtime to connect to Supabase.
- Do not instruct the runtime to write staging rows or daily_prices.
- Do not turn candidate artifact rows into accepted rows.
- Do not instruct any public runtime flag change from mock to real.

## PM Integration Notes

PM should integrate this A2 copy guard into the final authorization stopline go/no-go gate as a wording safety dependency.

Recommended PM acceptance checks:

- The final gate includes `a2_final_authorization_stopline_go_no_go_copy_guard_ready`.
- Runtime and operator copy explicitly say execution is still blocked before the separate authorized attempt.
- Public copy keeps `publicDataSource=mock` and `scoreSource=mock`.
- Any go/no-go label is framed as readiness review, not completed execution.
- Any future transition to real data requires separate execution evidence, readback evidence, rollback readiness, duplicate checks, and post-run review.

## Hard Boundaries

- No SQL.
- No Supabase connection.
- No secrets, env values, authorization phrases, confirmation phrases, or real decision values are read, printed, stored, or inferred.
- No market data fetch, ingest, storage, or raw payload handling.
- No daily_prices mutation.
- No staging row creation.
- No candidate row acceptance.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No legal approval claim unless a separate legal approval artifact exists.
- No investment recommendation wording.
