# A2 Real Decision Intake Template Copy Guard

Status: `a2_real_decision_intake_template_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII real decision intake packet template gate`
Mode: `local_only_public_internal_copy_guard`

## Purpose

This guard supports PM review for the `TWII real decision intake packet template gate`.

It is a public/internal copy and legal wording guard only. It prepares safe wording for a blank real decision intake packet template. It does not fill a decision, approve a decision, authorize execution, run SQL, connect to Supabase, read Supabase, write Supabase, read env values, read secrets, read raw payloads, read row payloads, fetch market data, mutate `daily_prices`, promote public data, enable real scoring, or create investment advice.

Core interpretation:

- `real decision intake packet template gate prepared` means the blank packet wording and placeholder posture are ready for PM review.
- `template` means an empty review surface, not a filled decision packet and not an execution instruction.
- `real decision` may describe the kind of future decision the packet is designed to receive, but must not claim a real decision has already been supplied, read, accepted, authorized, or executed.
- `accepted` means the blank template wording is acceptable for the next PM review step only.
- `rejected` means the blank template wording must not be used because it overclaims, blurs runtime state, weakens legal guardrails, or violates a stop line.
- `repair_required` means the blank template wording may be recoverable after bounded repair, but it is not accepted until repaired wording is reviewed.
- No template outcome authorizes SQL, Supabase activity, execution, market-data collection, row acceptance, row coverage scoring, source promotion, real scoring, public launch, or investment advice.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not read env values, secret values, credentials, authorization values, confirmation phrase values, real decision values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- Do not fetch, import, ingest, store, commit, print, summarize, or refresh market data.
- Do not create staging rows.
- Do not mutate `daily_prices`.
- Do not set, request, or imply `publicDataSource=supabase`.
- Do not set, request, or imply `scoreSource=real`.
- Do not claim that a real decision packet has been filled.
- Do not claim that execution has been authorized.
- Do not claim that Supabase has been connected.
- Do not claim that rows have been written.
- Do not claim that real scoring has run.
- Do not edit runtime config, source-promotion files, scoring-source files, PM gates, checkers, status boards, package files, UI routes, data files, or existing docs as part of this guard.

## Blank Template Safe Wording

Safe wording may describe only the blank template, its placeholder labels, and PM review readiness:

- "Real decision intake packet template wording is prepared for PM review."
- "This is a blank intake template for future PM-reviewed decision entry."
- "No real decision values have been entered, read, validated, accepted, or stored by this template."
- "Template acceptance is limited to wording, placeholder shape, and review readiness."
- "The template does not authorize execution."
- "The template does not connect to Supabase or write `daily_prices`."
- "The template does not activate `publicDataSource=supabase`."
- "The template does not activate `scoreSource=real`."
- "The template result is not investment advice."

Preferred internal status phrase:

> TWII real decision intake packet template wording prepared for bounded PM review only; the packet remains blank, no real decision values have been read or accepted, no authorization is granted, and execution, SQL, Supabase connection/read/write, `daily_prices` mutation, market-data fetch, row acceptance, public data promotion, `publicDataSource=supabase`, `scoreSource=real`, and investment-advice claims remain unapproved.

## Placeholder Outcome Wording

Use these labels only for template-placeholder review outcomes, not runtime outcomes.

### accepted

Safe placeholder wording:

- "Template placeholder wording is accepted for PM review."
- "The blank template is accepted as bounded review wording only."
- "The accepted template preserves no-execution, no-Supabase, no-write, mock/local, and non-advisory boundaries."
- "Acceptance means the template shape can move to the next PM review step."
- "Accepted template wording does not mean real decision accepted, execution accepted, source rights accepted, rows accepted, public data accepted, real scoring accepted, or legal clearance accepted."

Preferred internal status phrase:

> TWII real decision intake packet template wording accepted for bounded PM template review only; no real decision value has been read, no decision packet has been filled, no authorization is granted, and execution, SQL, Supabase connection/read/write, `daily_prices` mutation, market-data fetch, row acceptance, public data promotion, `publicDataSource=supabase`, `scoreSource=real`, and investment-advice claims remain unapproved.

### rejected

Safe placeholder wording:

- "Template placeholder wording is rejected for use."
- "The template wording is rejected because it implies a filled decision, execution authority, Supabase activity, live data, row acceptance, source-rights approval, public promotion, real scoring, or investment advice."
- "Rejected wording must not appear in public beta, operator, release-note, support, stakeholder-facing, status-board, or product surfaces."
- "Rejected wording requires bounded repair or a new PM-reviewed wording proposal before use."

Preferred internal status phrase:

> TWII real decision intake packet template wording rejected; proposed wording overclaims or weakens required blank-template, no-execution, mock/local, source-rights, legal, or non-advice boundaries.

### repair_required

Safe placeholder wording:

- "Template placeholder wording requires bounded repair before use."
- "The template is not accepted until repaired wording is reviewed."
- "Repair must narrow claims to blank-template readiness and preserve no-execution, no-Supabase, no-write, mock/local, and non-advisory boundaries."
- "Repair must remove any wording that implies real decisions, authorization, rows, market data, source rights, public launch, Supabase, real scoring, or execution have been accepted."

Preferred internal status phrase:

> TWII real decision intake packet template wording requires bounded repair before acceptance; no real decision, filled packet, runtime action, data action, Supabase action, source promotion, public-data activation, real-score activation, legal clearance, or investment-advice claim is approved.

## Unsafe Wording

Do not use wording that treats template readiness as filled decision intake, execution approval, data acceptance, source approval, public launch, or advice:

- "The real decision packet has been filled."
- "The real decision value was read."
- "The operator decision has been validated."
- "The decision is accepted."
- "The accepted template authorizes execution."
- "PM accepted the template, so the run may proceed."
- "Execution is authorized."
- "The runner is authorized."
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

- Any sentence where blank-template acceptance is treated as real decision acceptance.
- Any sentence where template readiness is treated as execution authorization.
- Any sentence where a placeholder is treated as a filled operator instruction.
- Any sentence where accepted wording is treated as accepted rows, accepted source rights, accepted legal clearance, or accepted data quality.
- Any sentence where local/mock status is blurred into public/live/production/Supabase-backed status.
- Any sentence where mock scores are blurred into real scores.
- Any sentence where legal/disclaimer language is weakened because an internal template gate is "accepted."
- Any sentence where status labels, scores, rankings, summaries, pressure states, or watchlist language become personalized investment advice.

## Public Beta, Legal, And Disclaimer Reminders

Public beta copy must preserve these reminders:

- The product remains a beta or pre-release experience unless a separate launch approval says otherwise.
- Template readiness is an internal review aid, not a public claim about data completeness, source rights, legal clearance, execution, or real scoring.
- Data, coverage, methodology, source-rights, and scoring may be incomplete, delayed, simulated, local, mock, or under review.
- Public copy must not imply full TWII market coverage, all-session coverage, source-rights completion, public-use clearance, production-data completeness, or execution readiness.
- Legal/disclaimer copy must remain visible wherever scores, rankings, pressure states, watchlists, summaries, template labels, or market labels could be interpreted as guidance.
- Copy must avoid certainty language such as "verified," "guaranteed," "complete," "officially approved," "risk-free," "profit-ready," "investor-ready," "execution-ready," or "legally cleared" unless a separate legal and PM gate explicitly approves the exact phrase.
- Support, release-note, stakeholder, SEO, and social snippets must not be stronger than the visible product and legal copy.

Safe public beta wording:

- "Beta experience; data and methodology may remain under review."
- "This template is for bounded internal review."
- "For informational and product-evaluation purposes only."
- "Not investment advice."
- "Do not use this as the sole basis for trading or investment decisions."
- "Some data, coverage, source-rights, and scoring paths may remain mock/local or pending review."

## Mock-Vs-Real Wording Guard

Allowed wording:

- "mock/local posture remains in effect"
- "mock score posture remains in effect"
- "blank-template review"
- "real decision values are not read or claimed"
- "real-data activation is not claimed"
- "Supabase-backed public data is not claimed"
- "real scoring is not claimed"
- "separate PM/operator approval is required before any public data-source or score-source promotion"

Forbidden wording:

- "live data is active"
- "production market data is active"
- "Supabase-backed public data is active"
- "real TWII scores are available"
- "real decisions have been validated"
- "execution authorization has been confirmed"
- "`publicDataSource=supabase` is active"
- "`scoreSource=real` is active"
- "mock data has been replaced"
- "public users are now seeing real market-data scoring"

Required guard sentence when copy mentions template acceptance:

> Acceptance applies only to blank template wording and does not fill a decision packet, authorize execution, activate live data, connect Supabase, set `publicDataSource=supabase`, or set `scoreSource=real`.

## Not Investment Advice Guard

Any internal or public copy that mentions TWII, scores, pressure states, rankings, watchlists, template outcomes, or decision labels must preserve non-advisory framing:

- Use "informational," "product-evaluation," "methodology review," "template review," or "internal placeholder wording."
- Do not use "recommend," "should buy," "should sell," "hold," "entry," "exit," "target," "guaranteed," "profit," "loss prevention," "expected return," "safe investment," or "market timing."
- Do not imply suitability for any specific person, portfolio, risk profile, or trading action.
- Do not present template outcomes as forecasts, recommendations, trading signals, or investment decisions.

Required short reminder:

> Not investment advice. Template outcomes are internal review labels only and must not be used as trading, allocation, timing, or reliance guidance.

## Explicit Prohibited Claims

The template guard must prohibit any public, internal, operator, support, release-note, stakeholder, status-board, or handoff wording that claims or implies:

- a decision packet has already been filled;
- a real decision value has been read, validated, accepted, stored, or inferred;
- PM, an operator, or Legal has authorized execution from this template alone;
- the runner is authorized or has run;
- SQL has been executed;
- Supabase has been connected, queried, read, written, repaired, exposed, or promoted;
- staging rows have been created;
- production `daily_prices` has been inserted, updated, deleted, merged, repaired, or accepted;
- market data has been fetched, imported, ingested, refreshed, validated, stored, committed, or backfilled;
- row payloads, raw payloads, stock-id payloads, source bodies, provider bodies, env values, secrets, credentials, authorization values, or confirmation phrases have been reviewed;
- `publicDataSource=supabase` has been set, requested, approved, or implied;
- `scoreSource=real` has been set, requested, approved, or implied;
- real scoring has run or is available;
- source rights, public redistribution, attribution, retention, provider terms, or legal clearance have been approved by this template;
- the output is investment advice, trading guidance, suitability guidance, or a buy/sell/hold signal.

## Copy Review Checklist

Before any internal, operator-facing, public, release-note, support, status-board, or handoff copy is accepted, confirm:

- The copy says blank template review, not filled decision intake.
- The copy says prepared or accepted for PM review only, not execution approved.
- The copy keeps real operator decisions unread and unclaimed.
- The copy keeps authorization unclaimed.
- The copy preserves local-only/no-execution posture.
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
- The copy does not reference secrets, env values, authorization values, confirmation phrase values, real decision values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- The copy does not suggest market data was fetched, imported, ingested, staged, stored, committed, or backfilled.

Acceptable copy should be able to answer all of these with "no":

- Would a reader think a real decision packet was already filled?
- Would a reader think a real decision value was read?
- Would a reader think execution is already authorized?
- Would a reader think the runner already executed?
- Would a reader think Supabase was connected or written?
- Would a reader think data is already live?
- Would a reader think coverage is complete?
- Would a reader think rows were accepted or row coverage scored?
- Would a reader think `publicDataSource=supabase` or `scoreSource=real` is active?
- Would a reader treat the template outcome as investment advice?

## Handoff Summary

The A2 public/internal copy and legal wording guard is ready for PM mainline use as a reference-only input to the `TWII real decision intake packet template gate`.

This file provides:

- blank template safe wording;
- unsafe wording and implication patterns;
- accepted, rejected, and repair_required placeholder wording;
- public beta, legal, and disclaimer reminders;
- mock-vs-real wording guard;
- not-investment-advice guard;
- explicit prohibited claims for filled decisions, execution authorization, Supabase, `daily_prices`, public source promotion, and real scoring.

No SQL, Supabase connection, Supabase read, Supabase write, env/secret read, raw payload read, row payload read, market-data fetch, `daily_prices` mutation, `publicDataSource=supabase`, `scoreSource=real`, real decision fill, execution authorization, or investment-advice claim is part of this guard.
