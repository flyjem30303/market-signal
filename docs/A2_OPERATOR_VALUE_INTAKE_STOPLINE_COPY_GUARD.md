# A2 Operator Value Intake Stopline Copy Guard

Status: a2_operator_value_intake_stopline_copy_guard_ready

## Scope

This A2 review covers runtime, operator, and public-facing wording for the TWII operator value intake stopline preparation gate.

The copy must describe a future value-intake stopline only. It must not imply that real operator values have been received, that Go has been selected, that execution has started, that Supabase has been written, that real market data is online, that legal approval is complete, or that the product is giving investment advice.

Core interpretation:

- "operator value intake stopline" means a guarded checkpoint before any future external operator values can be supplied.
- "preparation" means copy, placeholders, blocked reasons, and review posture only.
- "intake" does not mean real values have been requested, read, entered, accepted, validated, stored, or used.
- "operator" means an internal review role or future value provider, not proof of authorization, credential access, or execution approval.
- "ready" means copy-guard ready for PM integration only, not write-ready, launch-ready, legal-ready, or investment-ready.

## Safe Wording

Use wording that keeps the gate clearly preparation-only, value-hidden, fail-closed, mock-bound, and non-advisory.

- "TWII operator value intake stopline copy is ready for PM review."
- "No real operator value has been requested, read, entered, accepted, validated, stored, or used by this preparation gate."
- "No Go decision has been recorded by this preparation gate."
- "Execution remains blocked until a separate explicitly authorized path completes."
- "Supabase remains untouched by this gate."
- "No daily_prices mutation has occurred."
- "Candidate rows remain unaccepted."
- "publicDataSource remains mock."
- "scoreSource remains mock."
- "This gate prepares wording, blocked reasons, and future evidence placeholders only."
- "This is product readiness and source-control preparation, not investment advice."

Preferred compact status line:

> TWII operator value intake stopline copy is ready for local PM review. It prepares a value-hidden checkpoint only; no real values, authorization phrases, confirmation phrases, Supabase writes, `daily_prices` mutation, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Safe badge labels:

- `Copy guard ready`
- `Value-hidden`
- `Stopline prepared`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

## Forbidden Wording

Do not use wording that makes the stopline preparation look like completed value intake, authorization, execution, write closure, public launch, legal approval, or investment guidance.

Forbidden phrases or equivalent meanings:

- "operator values received"
- "operator values entered"
- "operator values accepted"
- "operator values validated"
- "real decision values recorded"
- "authorization phrase verified"
- "confirmation phrase verified"
- "operator approved Go"
- "Go decision recorded"
- "execution approved"
- "execution started"
- "execution completed"
- "Supabase connected"
- "Supabase write completed"
- "stored in Supabase"
- "daily_prices updated"
- "candidate rows accepted"
- "staging rows created"
- "TWII real data is live"
- "publicDataSource=supabase"
- "scoreSource=real"
- "legal approved"
- "public redistribution approved"
- "production launch approved"
- "investment signal ready"
- "buy", "sell", "hold", "rebalance", "market timing", expected return, profit, loss-avoidance, or equivalent advisory wording

Do not expose, infer, paraphrase, summarize, store, compare, validate, or request:

- secrets;
- env values;
- credentials;
- authorization values;
- confirmation phrases;
- real decision values;
- raw payloads;
- row payloads;
- stock-id payloads;
- market-data rows;
- candidate row bodies.

## Public Copy Rule

Public copy must remain conservative, transparent, beta-safe, and mock-bound.

Allowed public-facing meaning:

- The product is preparing internal safeguards for a future value-hidden operator checkpoint.
- The current public runtime remains mock-bound where marked.
- Any real-data promotion requires separate authorization, execution evidence, readback evidence, post-run review, and source/legal review where applicable.
- The website provides informational decision-support design, not investment advice.
- Public wording may describe transparency, source labels, review status, and safety controls.

Disallowed public-facing meaning:

- Do not claim real TWII coverage is live or complete.
- Do not claim live market data is active.
- Do not claim Supabase is the active public source.
- Do not claim a Go decision has been made.
- Do not claim operator values were received, accepted, or used.
- Do not claim execution or database writing has occurred.
- Do not claim legal, compliance, or redistribution approval unless a separate approval artifact exists.
- Do not imply signals are investment recommendations.

Safe public sentence:

> We added clearer wording for a future TWII operator value-intake stopline. The beta remains mock-bound and informational; no real values, Supabase writes, market-data mutation, real scoring, legal approval, production launch, or investment advice is included.

## Internal Operator Copy Rule

Internal operator copy may be more precise, but must still be value-hidden, presence-only, and fail-closed.

Allowed internal meaning:

- Operator-facing text may state that future external values must remain outside the repo until a separate authorized intake path exists.
- It may confirm that required placeholders, blocked reasons, rollback/readback/post-run proof placeholders, and next-route labels are present.
- It may distinguish "stopline preparation", "external value provision", "explicit Go/No-Go decision", "authorized execution", and "post-run review" as separate stages.
- It may say that execution remains blocked until PM/CEO explicitly moves to a separate authorized path.
- It may preserve `publicDataSource=mock` and `scoreSource=mock` in summaries, badges, tables, reports, and handoffs.

Disallowed internal meaning:

- Do not ask for, read, print, store, infer, compare, or validate real operator values.
- Do not ask for, read, print, store, infer, compare, or validate authorization phrases, confirmation phrases, secrets, env values, or credentials.
- Do not instruct the runtime to connect to Supabase.
- Do not instruct the runtime to write staging rows or `daily_prices`.
- Do not turn candidate artifact rows into accepted rows.
- Do not instruct any public runtime flag change from mock to real.
- Do not collapse value-intake preparation, Go decision, execution, readback, and promotion into one completed state.

Safe internal sentence:

> Operator value intake stopline copy is ready for PM integration only. Real values, authorization phrases, confirmation phrases, SQL, Supabase connection/read/write, `daily_prices` mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, production launch, and investment advice remain blocked.

## PM Integration Notes

PM should integrate this A2 copy guard into the TWII operator value intake stopline preparation gate as a wording safety dependency.

Recommended PM acceptance checks:

- The preparation gate includes `a2_operator_value_intake_stopline_copy_guard_ready`.
- Runtime, report, and operator copy explicitly say this is stopline preparation only.
- Any "ready" label is qualified as copy-ready or PM-review-ready, not execution-ready, write-ready, launch-ready, legal-ready, or investment-ready.
- Public copy keeps `publicDataSource=mock` and `scoreSource=mock`.
- Internal copy remains value-hidden and does not request, print, infer, or validate real values.
- Any go/no-go or value-intake label is framed as a future separate action, not a completed event.
- Stronger claims must route to PM repair or a separate explicitly authorized gate.

If wording implies real values were collected, authorization was completed, Supabase was connected or written, `daily_prices` changed, candidate rows were accepted, `publicDataSource=supabase`, `scoreSource=real`, legal approval, public launch, or investment advice, PM must mark it `repair_required` or `rejected_for_overclaim`.

## Hard Boundaries

- No SQL.
- No Supabase connection.
- No Supabase read or write.
- No secrets, env values, credentials, authorization phrases, confirmation phrases, or real decision values are read, printed, stored, inferred, compared, or validated.
- No market data fetch, ingest, storage, or raw payload handling.
- No `daily_prices` mutation.
- No staging row creation.
- No candidate row acceptance.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No legal approval claim unless a separate legal approval artifact exists.
- No public redistribution approval claim unless a separate source-rights artifact exists.
- No investment recommendation wording.

## Final Copy Test

Every UI, report, and operator-facing sentence about this gate must pass this test:

> Could a reader reasonably think real values were received, Go was approved, execution happened, Supabase was written, real data is live, legal approved the workflow, or the text is investment advice?

If yes, the wording fails this guard and must be replaced with preparation-only, value-hidden, mock-bound, non-executing, non-advisory language.
