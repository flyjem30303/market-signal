# A2 Accepted Decision Record Intake Copy Guard

Status: `a2_accepted_decision_record_intake_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_public_internal_copy_guard`

## Purpose

This guard supports the PM mainline for the `TWII accepted decision record intake gate preflight`.

It is a public/internal copy and legal wording guard only. It prepares safe language for decision-record intake review. It does not approve execution, run SQL, connect to Supabase, read Supabase, write Supabase, read env values, read secrets, read raw payloads, read row payloads, fetch market data, mutate `daily_prices`, promote public data, enable real scoring, or create investment advice.

Core interpretation:

- `accepted decision record intake gate preflight prepared` means the intake wording and review posture are ready for PM review.
- `accepted` means the intake wording or decision-record shape is acceptable for the next PM review step only.
- `rejected` means the intake wording must not be used because it overclaims, blurs runtime state, weakens legal guardrails, or violates a stop line.
- `repair_required` means the wording may be recoverable after bounded repair, but it is not accepted until repaired text is reviewed.
- No intake outcome authorizes SQL, Supabase activity, execution, market-data collection, row acceptance, row coverage scoring, source promotion, real scoring, or public launch.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not read env values, secret values, credentials, authorization values, confirmation phrase values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- Do not fetch, import, ingest, store, commit, print, summarize, or refresh market data.
- Do not write staging rows.
- Do not mutate `daily_prices`.
- Do not set, request, or imply `publicDataSource=supabase`.
- Do not set, request, or imply `scoreSource=real`.
- Do not edit runtime config, source-promotion files, scoring-source files, PM gates, checkers, status boards, package files, UI routes, data files, or existing docs as part of this guard.

## Intake Outcome Safe Wording

Use these labels only for intake-review outcomes, not runtime outcomes.

### accepted

Safe wording:

- "Decision-record intake wording is accepted for PM review."
- "The accepted intake record is accepted as bounded review wording only."
- "The intake wording preserves no-execution, no-Supabase, no-write, mock/local, source-rights, and non-advisory boundaries."
- "The decision record may move to the next PM review step, but no runtime action is approved."
- "Accepted intake does not mean accepted rows, accepted market data, accepted source rights, accepted write execution, accepted public launch, or accepted real scoring."

Preferred internal status phrase:

> TWII accepted decision record intake gate preflight wording accepted for bounded PM review only; execution, SQL, Supabase connection/read/write, `daily_prices` mutation, market-data fetch, row acceptance, public data promotion, `publicDataSource=supabase`, `scoreSource=real`, and investment-advice claims remain unapproved.

### rejected

Safe wording:

- "Decision-record intake wording is rejected for use."
- "The proposed intake wording is rejected because it implies execution, Supabase activity, live data, row acceptance, source-rights approval, public promotion, real scoring, or investment advice."
- "Rejected wording must not appear in public beta, operator, release-note, support, stakeholder-facing, status-board, or product surfaces."
- "Rejected wording requires bounded repair or a new PM-reviewed wording proposal before use."

Preferred internal status phrase:

> TWII accepted decision record intake gate preflight wording rejected; proposed wording overclaims or weakens required no-execution, mock/local, source-rights, legal, or non-advice boundaries.

### repair_required

Safe wording:

- "Decision-record intake wording requires bounded repair before use."
- "The intake record is not accepted until repaired wording is reviewed."
- "Repair must narrow claims to intake readiness and preserve no-execution, no-Supabase, no-write, mock/local, source-rights, and non-advisory boundaries."
- "Repair must remove any wording that implies rows, market data, source rights, public launch, Supabase, real scoring, or execution authorization have been accepted."

Preferred internal status phrase:

> TWII accepted decision record intake gate preflight wording requires bounded repair before acceptance; no runtime, data, Supabase, source-promotion, public-data, real-score, legal-clearance, or investment-advice claim is approved.

## Decision Intake Wording Guard

Safe interpretation:

- "Decision intake" may describe intake of a decision record into PM review only.
- "Accepted decision record" may describe a record accepted for bounded review routing only.
- It must not describe acceptance of execution, write authorization, runner output, row payloads, source terms, production data, public data, or scoring activation.
- It must preserve the distinction between "a decision record is intake-ready" and "a runtime decision has been authorized."
- It must state or imply that any execution, connection, read, write, readback, rollback, source promotion, public promotion, or real scoring still requires a separate explicit PM/operator-approved gate.

Safe internal wording:

- "The accepted decision record intake gate preflight is ready for PM copy/legal review."
- "Acceptance is limited to wording and record-intake readiness."
- "This intake does not validate row coverage, source rights, Supabase availability, data completeness, or market-data correctness."
- "Runtime remains `publicDataSource=mock` unless a separate approved promotion gate changes it."
- "Scoring remains `scoreSource=mock` unless a separate approved scoring gate changes it."
- "Any stronger claim requires a separate named approval gate and legal review."

## Unsafe Wording

Do not use wording that treats intake acceptance as execution approval, data acceptance, source approval, public launch, or advice:

- "The accepted decision authorizes execution."
- "PM accepted the decision, so the run may proceed."
- "The decision record approves the runner."
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

- Any sentence where intake acceptance is treated as runtime approval.
- Any sentence where a record label is treated as completed execution.
- Any sentence where accepted wording is treated as accepted rows, accepted source rights, accepted legal clearance, or accepted data quality.
- Any sentence where local/mock status is blurred into public/live/production/Supabase-backed status.
- Any sentence where mock scores are blurred into real scores.
- Any sentence where legal/disclaimer language is weakened because an internal preflight is "accepted."
- Any sentence where status labels, scores, rankings, summaries, pressure states, or watchlist language become personalized investment advice.

## Public Beta, Legal, And Disclaimer Reminders

Public beta copy must preserve these reminders:

- The product remains a beta or pre-release experience unless a separate launch approval says otherwise.
- Data, coverage, methodology, source-rights, and scoring may be incomplete, delayed, simulated, local, mock, or under review.
- Public copy must not imply full TWII market coverage, all-session coverage, source-rights completion, public-use clearance, or production-data completeness.
- Legal/disclaimer copy must remain visible wherever scores, rankings, pressure states, watchlists, summaries, or market labels could be interpreted as guidance.
- Copy must avoid certainty language such as "verified," "guaranteed," "complete," "officially approved," "risk-free," "profit-ready," "investor-ready," or "legally cleared" unless a separate legal and PM gate explicitly approves the exact phrase.
- Support, release-note, stakeholder, SEO, and social snippets must not be stronger than the visible product and legal copy.

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
- "`publicDataSource=supabase` is active"
- "`scoreSource=real` is active"
- "mock data has been replaced"
- "public users are now seeing real market-data scoring"

Required distinction:

- Mock/local means copy may describe review readiness, simulated posture, or product-evaluation behavior.
- Real/live means actual runtime, data-source, scoring-source, source-rights, legal, and public-use approvals have passed. This document does not provide those approvals.

## Not Investment Advice Guard

All public, internal, support, release-note, stakeholder, and operator-facing wording must avoid:

- buy, sell, hold, accumulate, reduce, rebalance, entry, exit, or position-sizing instructions
- market timing guidance
- price prediction or return forecast
- guaranteed outcome, profit, risk-free, loss-avoidance, or drawdown-protection claims
- personalized recommendation language
- suitability language for a specific investor
- wording that invites users to rely on scores, rankings, pressure states, summaries, or status labels as trading guidance

Safe alternatives:

- "informational signal"
- "product-evaluation indicator"
- "methodology preview"
- "non-advisory status label"
- "risk/pressure visualization for review"
- "not investment advice"

## Operator-Facing Talking Points

- "This is a copy/legal wording guard for the TWII accepted decision record intake gate preflight."
- "Accepted intake wording means the phrase is safe for bounded PM review, not that execution is approved."
- "Rejected wording must not be used because it overclaims or violates a stop line."
- "Repair-required wording is not accepted until the repaired text is reviewed."
- "No SQL, Supabase connection, Supabase read, Supabase write, market-data fetch, row-payload review, or `daily_prices` mutation is part of this guard."
- "No Supabase-backed public-data posture is created."
- "No real-score posture is created."
- "No complete TWII coverage, source-rights approval, public-use clearance, or row acceptance is claimed."
- "No public beta wording should imply live market-data reliance."
- "Scores, rankings, summaries, pressure labels, and watchlists must remain informational and non-advisory."

## Stop-Line Claims That Must Stay Prohibited

The intake wording must not claim, imply, or allow paraphrases of:

- Supabase has been connected.
- Supabase has been read.
- Supabase has been written.
- SQL has been executed.
- `daily_prices` has been inserted, updated, deleted, merged, repaired, or accepted.
- Market data has been fetched, imported, ingested, refreshed, or validated.
- Raw payloads, row payloads, stock-id payloads, env values, secrets, credentials, authorization values, or confirmation phrases have been reviewed.
- `publicDataSource=supabase` has been set or approved.
- `scoreSource=real` has been set or approved.
- Real scoring has been enabled.
- Source rights, public redistribution, attribution, retention, provider terms, or legal clearance have been approved by this intake.
- PM or the operator has authorized execution from this intake alone.

## Final Copy Review Checklist

Before PM uses any wording from this guard, confirm:

- The wording says `prepared for review`, `accepted for bounded intake`, or `requires repair`, not `executed`, `authorized`, `connected`, `written`, `live`, or `real`.
- The wording keeps runtime at `publicDataSource=mock`.
- The wording keeps scoring at `scoreSource=mock`.
- The wording does not mention row-level values, raw payloads, secrets, source bodies, provider bodies, or env values.
- The wording preserves public beta, legal, source-rights, and not-investment-advice reminders.
- The wording routes any execution, Supabase, write, readback, rollback, public promotion, real scoring, legal clearance, or source-rights claim to a separate named gate.
