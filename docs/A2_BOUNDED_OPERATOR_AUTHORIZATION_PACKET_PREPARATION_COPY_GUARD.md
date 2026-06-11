# A2 Bounded Operator Authorization Packet Preparation Copy Guard

Status: a2_bounded_operator_authorization_packet_preparation_copy_guard_ready

## Purpose

This A2 guard supports the PM mainline `TWII bounded operator authorization packet preparation gate`.

The document protects public and operator-facing wording while PM prepares the operator authorization packet preparation surface. It confirms copy readiness only. It does not authorize execution, does not confirm external operator values, does not approve legal posture, does not promote real data, and does not provide investment advice.

Runtime posture remains:

- `publicDataSource=mock`
- `scoreSource=mock`

## Safe Wording

Use safe wording that keeps the packet in a preparation, review-only, fail-closed state:

- "The bounded operator authorization packet preparation copy guard is ready for PM integration."
- "The packet wording is prepared for review, not execution."
- "Operator authorization packet preparation remains bounded, presence-only, and value-hidden."
- "No real operator decision value, authorization value, execute switch, confirmation phrase, credential, secret, or env value is read, copied, stored, printed, inferred, or confirmed."
- "No SQL is executed and no Supabase connection is attempted."
- "No market data is fetched."
- "No `daily_prices` row is inserted, updated, deleted, merged, or upserted."
- "No candidate rows are accepted."
- "`publicDataSource=mock` remains locked."
- "`scoreSource=mock` remains locked."
- "Any later real execution, real data-source promotion, legal approval, or production launch requires a separate explicit gate."
- "Public copy must remain informational, mock-boundary, and non-investment-advice."

## Forbidden Wording

Forbidden wording includes any phrase, label, summary, checklist item, release note, board update, operator instruction, or public copy that implies any of the following:

- Authorization has already been granted.
- Real operator decision values have been received, accepted, read, stored, checked, matched, or confirmed.
- The operator has given a Go decision.
- The system has executed, may execute now, or is execution-ready.
- SQL has run or is approved to run.
- Supabase has connected, written, inserted, updated, merged, upserted, or accepted rows.
- Supabase has written to `daily_prices`.
- Real data has gone live.
- The public site is Supabase-backed, production-backed, official, live-data-backed, or real-score-backed.
- Legal review is complete or legal approval has been granted.
- Source rights are fully cleared for public production use.
- The packet creates, confirms, or substitutes for investment advice.
- Users may trade, buy, sell, hold, rebalance, allocate, reduce, accumulate, or otherwise rely on the output for transactions.

Do not use wording such as:

- "Authorized."
- "Real authorization received."
- "Real decision value received."
- "Go received."
- "Execution approved."
- "Executed."
- "Supabase write complete."
- "`daily_prices` is updated."
- "Real TWII data is live."
- "Legal approved."
- "Investment recommendation."
- "Tradable signal."
- "Safe to trade on this."

## Public Copy Rule

The public copy rule is conservative: public-facing copy must describe only the current public product posture, not the internal operator packet mechanics.

Allowed public copy may say:

- "This experience is in beta or review-stage operation."
- "Data and scores may be mock, limited, delayed, incomplete, or under review."
- "Signals are for informational and product-evaluation purposes only."
- "No investment recommendation is provided."
- "Coverage, freshness, source rights, methodology, and launch readiness may remain under review."

Public copy must not mention or imply:

- operator authorization packet preparation;
- authorization values, confirmation phrases, execute switches, credentials, secrets, env values, or real decision values;
- SQL, Supabase, `daily_prices`, candidate rows, write gates, source-promotion gates, or score-promotion gates;
- live market-data ingestion, production source approval, legal approval, launch approval, or trade readiness.

If public copy needs to explain the data posture, it must keep `publicDataSource=mock` and `scoreSource=mock` explicit in internal notes and must not translate them into real-data claims.

## Internal Operator Copy Rule

The internal operator copy rule allows PM/operator-facing wording only when it keeps the preparation boundary visible.

Required internal posture:

- `copyGuardReady=true`
- `reviewOnly=true`
- `preparationOnly=true`
- `presenceOnly=true`
- `valueHidden=true`
- `realAuthorizationCompleted=false`
- `realDecisionValueReceived=false`
- `realDecisionValueRead=false`
- `authorizationValueRead=false`
- `confirmationPhraseValueRead=false`
- `executeSwitchValueRead=false`
- `secretValueRead=false`
- `envValueRead=false`
- `sqlExecuted=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `finalExecutionAllowedNow=false`
- `legalApproved=false`
- `investmentAdviceProvided=false`
- `publicDataSource=mock`
- `scoreSource=mock`

Internal operator copy may request review of packet labels, checklist shape, blocked reasons, and fail-closed status. It must not ask any operator to paste, reveal, verify, compare, screenshot, store, or summarize the body of an authorization value, confirmation phrase, execute switch, credential, secret, env value, real decision value, raw payload, row payload, stock-id payload, or market-data payload in this repository, ticket, status board, public page, or chat.

## Hard Boundaries

These hard boundaries apply to this A2 support file and to any PM wording that imports it:

- No SQL execution.
- No Supabase connection.
- No Supabase read/write/check attempt.
- No secrets or env values are read.
- No authorization value is read.
- No confirmation phrase is read.
- No execute switch value is read.
- No real decision value is read, received, inferred, printed, stored, compared, or confirmed.
- No market data is fetched, ingested, stored, or summarized.
- No raw payload, row payload, stock-id payload, or candidate-row payload is fetched, printed, stored, or committed.
- No `daily_prices` insert, update, delete, merge, upsert, or mutation.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No production launch claim.
- No legal approval claim.
- No investment advice.
- No trading reliance claim.

## PM Integration Notes

PM integration notes for the `TWII bounded operator authorization packet preparation gate`:

- Use this file as A2 copy evidence only; it is not A1 contract evidence and not an execution permit.
- Require the exact status string `a2_bounded_operator_authorization_packet_preparation_copy_guard_ready` before marking A2 copy support complete.
- Keep the mainline gate outcome phrased as copy guard ready, packet preparation ready, or review-only wording ready.
- Do not summarize this file as authorization accepted, Go received, values received, execution approved, Supabase write ready, legal approved, public live-data ready, or investment-ready.
- Pair this file with the A1 bounded operator authorization packet contract review when PM needs both operational shape evidence and wording-safety evidence.
- If future PM work receives external operator values, creates a separate authorized execution attempt, changes source rights, performs legal review, or promotes real data/scoring, write a separate gate and a separate A2 copy guard for that later state.

## Review Outcome

The A2 bounded operator authorization packet preparation copy guard is ready for PM integration while execution, real values, Supabase, `daily_prices`, real-data promotion, legal approval, and investment-advice claims remain blocked.
