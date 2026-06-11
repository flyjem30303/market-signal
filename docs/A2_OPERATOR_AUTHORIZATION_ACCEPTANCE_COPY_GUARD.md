# A2 Operator Authorization Acceptance Copy Guard

Status: `a2_operator_authorization_acceptance_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_public_internal_copy_guard`

## Purpose

This wording guard supports the PM mainline for the `TWII operator authorization acceptance gate preflight`.

It is a public/internal copy and legal wording guard only. It does not approve execution, run a runner, connect to Supabase, read Supabase, write Supabase, accept row payloads, mutate `daily_prices`, fetch market data, promote live data, complete coverage, change `publicDataSource`, change `scoreSource`, or create investment advice.

Core interpretation:

- `authorization acceptance gate preflight prepared` means the acceptance wording and review posture are ready for PM/operator review.
- `accepted` means the copy or gate wording is acceptable for the next review step only, within the stated no-execution boundary.
- `rejected` means the copy or gate wording must not be used because it overclaims, blurs runtime state, weakens legal guardrails, or violates a stop line.
- `repair_required` means the copy may be recoverable after bounded wording repair, but it is not accepted until the repaired text is reviewed.
- No acceptance wording in this document authorizes SQL, Supabase activity, runtime execution, market-data collection, row acceptance, real scoring, or public launch.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not read env values, secrets, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- Do not fetch, import, ingest, store, commit, print, summarize, or refresh market data.
- Do not mutate `daily_prices`.
- Do not set, request, or imply `publicDataSource=supabase`.
- Do not set, request, or imply `scoreSource=real`.
- Do not edit runtime config, source-promotion files, scoring-source files, package files, PM gates, checkers, status boards, UI routes, or existing docs as part of this copy guard.

## Acceptance Outcome Wording

Use these safe labels only for copy-review outcomes, not runtime outcomes.

### accepted

Safe wording:

- "Authorization acceptance wording is accepted for PM/operator review."
- "The copy is accepted as bounded preflight wording only."
- "The acceptance wording preserves no-execution, no-Supabase, no-write, mock/local, and non-advisory boundaries."
- "The gate wording may move to the next PM review step, but no runtime action is approved."
- "Accepted copy does not mean accepted rows, accepted market data, accepted source rights, accepted write execution, or accepted real scoring."

Preferred internal status phrase:

> TWII operator authorization acceptance gate preflight copy accepted for bounded review wording only; execution, SQL, Supabase connection/read/write, `daily_prices` mutation, market-data fetch, live data, `publicDataSource=supabase`, `scoreSource=real`, and investment-advice claims remain unapproved.

### rejected

Safe wording:

- "Authorization acceptance wording is rejected for use."
- "The copy is rejected because it implies execution, Supabase activity, live data, real scoring, row acceptance, source approval, public promotion, or investment advice."
- "Rejected copy must not appear in public beta, operator, release-note, support, status-board, or stakeholder-facing surfaces."
- "Rejected wording requires PM/operator review before any replacement wording is accepted."

Preferred internal status phrase:

> TWII operator authorization acceptance gate preflight copy rejected; proposed wording overclaims or weakens required no-execution, mock/local, legal, source-rights, or non-advice boundaries.

### repair_required

Safe wording:

- "Authorization acceptance wording requires bounded repair before use."
- "The copy is not accepted until the repaired wording is reviewed."
- "Repair must narrow claims to copy-review readiness and preserve no-execution, no-Supabase, no-write, mock/local, and non-advisory boundaries."
- "Repair must remove any wording that implies rows, market data, source rights, public launch, Supabase, or real scoring have been accepted."

Preferred internal status phrase:

> TWII operator authorization acceptance gate preflight copy requires bounded wording repair before acceptance; no runtime, data, Supabase, source-promotion, public-data, real-score, or investment-advice claim is approved.

## Authorization Acceptance Wording Guard

Safe interpretation:

- "Authorization acceptance" may describe acceptance of the wording posture, review packet, or gate preflight copy only.
- It must not describe acceptance of execution, write authorization, runner output, row payloads, source terms, production data, or scoring activation.
- It must preserve the distinction between "operator has reviewed wording" and "operator has authorized a runtime action."
- It must state or imply that any actual execution, write, Supabase action, source promotion, or public promotion still requires a separate explicit PM/operator-approved gate.

Safe internal wording:

- "The operator authorization acceptance gate preflight is ready for copy/legal review."
- "Acceptance is limited to wording readiness for the PM mainline."
- "This gate keeps runtime execution and data promotion out of scope."
- "The public posture remains mock/local unless a separate approved runtime promotion changes it."
- "The score posture remains mock unless a separate approved scoring gate changes it."
- "The review does not validate row coverage, source rights, Supabase availability, or market-data completeness."

## Unsafe Wording

Do not use wording that treats acceptance copy as execution approval, data acceptance, public launch, or advice:

- "Operator authorization is accepted, so execution may proceed."
- "The operator approved the run."
- "The acceptance gate authorizes the runner."
- "The runner has executed."
- "SQL has been executed."
- "Supabase is connected."
- "Supabase has been read."
- "Supabase was written."
- "`daily_prices` has been updated."
- "TWII rows are accepted."
- "Candidate rows are accepted."
- "Staging rows are accepted."
- "Raw market data has been validated."
- "Source rights are approved."
- "Provider terms are approved."
- "Public redistribution is approved."
- "TWII data is live."
- "Real-time market data is enabled."
- "Production data is active."
- "`publicDataSource=supabase` is active."
- "`scoreSource=real` is active."
- "Real scoring is active."
- "Coverage is complete."
- "All TWII rows are covered."
- "The beta is legally cleared for live market-data reliance."
- "The signal is ready for investors."
- "Users can rely on this as investment guidance."
- "This indicates buy, sell, hold, market timing, expected return, profit, or loss-avoidance guidance."

Unsafe implication patterns:

- Any sentence where copy acceptance is treated as runtime approval.
- Any sentence where operator review is treated as a completed execution decision.
- Any sentence where accepted wording is treated as accepted rows, accepted source rights, or accepted data quality.
- Any sentence where local/mock status is blurred into public/live/production/Supabase-backed status.
- Any sentence where mock scores are blurred into real scores.
- Any sentence where legal/disclaimer language is weakened because an internal preflight is "accepted."
- Any sentence where status labels, scores, rankings, summaries, pressure states, or watchlist language become personalized investment advice.

## Public Beta, Legal, And Disclaimer Reminders

Public beta copy must preserve these reminders:

- The product remains a beta or pre-release experience unless a separate launch approval says otherwise.
- Data, coverage, methodology, and scoring may be incomplete, delayed, simulated, local, mock, or under review.
- Public copy must not imply full TWII market coverage, all-session coverage, source-rights completion, or production-data completeness.
- Legal/disclaimer copy must remain visible wherever scores, ranking, pressure states, watchlists, or market summaries could be interpreted as guidance.
- Copy must avoid certainty language such as "verified," "guaranteed," "complete," "officially approved," "risk-free," "profit-ready," or "investor-ready" unless a separate legal and PM gate explicitly approves the exact phrase.
- Copy must route stronger public claims through PM/legal review before release.

Safe public beta wording:

- "Beta experience; data and methodology may remain under review."
- "For informational and product-evaluation purposes only."
- "Not investment advice."
- "Do not use this as the sole basis for trading or investment decisions."
- "Some data, coverage, source-rights, and scoring paths may remain mock/local or pending review."

## Mock-Vs-Real Wording Guard

Allowed wording:

- "mock/local posture remains in effect"
- "mock score posture remains in effect"
- "real-data activation is not claimed"
- "Supabase-backed public data is not claimed"
- "real scoring is not claimed"
- "separate PM/operator approval is required before any public data-source or score-source promotion"

Forbidden wording:

- "live data is active"
- "production market data is active"
- "Supabase-backed public data is active"
- "real TWII scores are available"
- "`publicDataSource=supabase`"
- "`scoreSource=real`"
- "mock data has been replaced"
- "public users are now seeing real market-data scoring"

Required distinction:

- Mock/local means copy may describe review readiness, simulated posture, or product-evaluation behavior.
- Real/live means actual runtime, data-source, scoring-source, and legal/source-rights approvals have passed. This document does not provide those approvals.

## Not Investment Advice Guard

All public, internal, support, release-note, and operator-facing wording must avoid:

- buy, sell, hold, accumulate, reduce, or rebalance instructions
- market timing guidance
- price prediction or return forecast
- guaranteed outcome, profit, risk-free, or loss-avoidance claims
- personalized recommendation language
- suitability language for a specific investor
- wording that invites users to rely on scores, rankings, pressure states, or status labels as trading guidance

Safe alternatives:

- "informational signal"
- "product-evaluation indicator"
- "methodology preview"
- "non-advisory status label"
- "risk/pressure visualization for review"
- "not investment advice"

## Operator-Facing Talking Points

- "This is a copy/legal wording guard for the TWII operator authorization acceptance gate preflight."
- "Accepted wording means the phrase is safe for bounded PM/operator review, not that execution is approved."
- "Rejected wording must not be used because it overclaims or violates a stop line."
- "Repair-required wording is not accepted until the repaired text is reviewed."
- "No SQL, Supabase connection, Supabase read, Supabase write, market-data fetch, row-payload review, or `daily_prices` mutation is part of this guard."
- "No public `publicDataSource=supabase` posture is created."
- "No `scoreSource=real` posture is created."
- "No complete TWII coverage, source-rights approval, or row acceptance is claimed."
- "No public beta wording should imply live market-data reliance."
- "Scores, rankings, summaries, pressure labels, and watchlists must remain informational and non-advisory."

Short operator script:

> The TWII operator authorization acceptance gate preflight copy is ready for bounded PM/operator review. Any `accepted` label applies only to wording readiness and does not approve execution, SQL, Supabase connection/read/write, market-data fetch, row acceptance, `daily_prices` mutation, live public data, `publicDataSource=supabase`, `scoreSource=real`, or investment advice. Rejected or repair-required wording must be routed back for PM/operator review before use.

## Copy Review Checklist

Before accepting public, internal, operator, release-note, support, legal, status-board, or stakeholder copy, confirm:

- The copy limits `accepted` to wording or preflight-review acceptance.
- The copy keeps execution authorization separate from wording acceptance.
- The copy does not imply a runner executed.
- The copy does not imply SQL was executed.
- The copy does not imply Supabase was connected, read, written, promoted, or made public.
- The copy does not imply `daily_prices` was modified.
- The copy does not imply raw market data was fetched, ingested, stored, printed, summarized, or reviewed.
- The copy does not include env values, secrets, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- The copy does not imply candidate rows, staging rows, row coverage scoring, or TWII coverage were accepted.
- The copy does not imply source rights, provider terms, public redistribution, attribution, retention, or source promotion are approved.
- The copy does not imply live, real-time, production, or Supabase-backed public data.
- The copy does not imply `publicDataSource=supabase`.
- The copy does not imply `scoreSource=real`.
- The copy preserves public beta, legal, disclaimer, mock/local, and non-advice language.
- The copy avoids buy/sell/hold, timing, forecast, guaranteed, profit, loss avoidance, personalized, suitability, or reliance wording.

Acceptable copy should answer all of these with "no":

- Would a reader think execution is already approved?
- Would a reader think the runner already executed?
- Would a reader think Supabase was connected, read, or written?
- Would a reader think `daily_prices` changed?
- Would a reader think market data was fetched or ingested?
- Would a reader think row payloads were accepted?
- Would a reader think data is live?
- Would a reader think coverage is complete?
- Would a reader think Supabase is now the public data source?
- Would a reader think real scores are active?
- Would a reader treat this as investment advice?

## Stop Lines

Stop and route back to PM/operator/legal review if proposed copy:

- Converts wording acceptance into execution approval.
- Says or implies the operator already approved a runtime action.
- Says or implies the runner executed.
- Says or implies SQL was executed.
- Says or implies Supabase was connected, queried, read, written, promoted, or made public.
- Says or implies `daily_prices` was modified.
- Says or implies raw market data was fetched, imported, ingested, stored, printed, summarized, or reviewed.
- Says or implies env values, secrets, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values were used.
- Says or implies candidate rows, staging rows, or row payloads were accepted.
- Says or implies row coverage scoring is complete.
- Says or implies complete TWII, market, symbol, session, field, or asset-class coverage.
- Says or implies source rights, provider rights, public use, retention, redistribution, attribution, or source promotion is approved.
- Says or implies public runtime data is live, real-time, production, or Supabase-backed.
- Says or implies `publicDataSource=supabase`.
- Says or implies `scoreSource=real`.
- Says or implies real scoring is available.
- Weakens beta, legal, disclaimer, mock/local, partial-coverage, separate-gate, source-rights, or non-advice limitations.
- Uses investment advice language, including buy/sell/hold guidance, price prediction, market timing, profit expectation, guaranteed outcome, loss avoidance, personalized recommendation, suitability, or user reliance wording.
- Requests UI changes, PM mainline file changes, package changes, checker changes, status-board changes, runtime changes, source-promotion changes, scoring-source changes, SQL actions, Supabase actions, market-data ingestion, or `daily_prices` mutation as part of copy review.

## Boundary Statement

This document only guards wording for the TWII operator authorization acceptance gate preflight.

It does not change UI, PM gates, checkers, status boards, package files, runtime code, SQL, Supabase state, market data, candidate rows, staging rows, row payloads, `daily_prices`, row acceptance, row coverage scoring, source rights, source promotion, `publicDataSource`, `scoreSource`, public beta launch posture, or legal approval posture.
