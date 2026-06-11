# A1 Explicit Operator Go/No-Go Decision Contract Review

Status: a1_explicit_operator_go_no_go_decision_contract_review_ready

## Scope

- Lane: A1 Data / Supabase / Market Evidence
- Gate: TWII explicit operator go/no-go decision preparation gate
- Target symbol: TWII
- Target table: daily_prices
- Bounded candidate scope: 60 rows
- Review mode: contract review only
- Execution mode: no execution
- Runtime source boundary: publicDataSource=mock
- Score source boundary: scoreSource=mock

## Decision Options

The future operator decision must use one of these placeholder-only options:

- go
- no_go
- repair_required

These are allowed as option labels only. This review does not read, infer, store, or fill the real operator decision value.

## Go/No-Go Decision Prerequisites

The future decision packet is contract-ready only if all of these prerequisites are represented as presence checks:

- Bounded target scope is explicitly stated as TWII / daily_prices / 60 rows.
- Candidate artifact identity is referenced by sanitized artifact path or artifact id only.
- Candidate validation remains aggregate-only.
- No raw payload, row payload, stock-id payload, secret, authorization value, confirmation phrase, or real decision value is included.
- Operator decision field is present as a placeholder.
- Operator rationale field is present as a placeholder.
- Server-only credential presence field is present as a placeholder.
- Execute switch presence field is present as a placeholder.
- Confirmation phrase presence field is present as a placeholder.
- Rollback dry-run placeholder is present.
- Aggregate readback placeholder is present.
- Post-run review placeholder is present.
- Candidate duplicate rejection placeholder is present.
- Blocked reasons are explicit and fail closed.
- Next route is review-only until a separate authorized execution attempt is approved.

## Server-Only Credential Presence

The contract may record only whether a server-only credential presence check is prepared. It must not read, print, copy, compare, or store any credential, environment variable value, Supabase key, token, or secret.

Required placeholder:

- serverOnlyCredentialPresence: placeholder_only

## Execute Switch / Confirmation Phrase Presence

The contract may record only that future presence checks exist for the execute switch and confirmation phrase.

Required placeholders:

- executeSwitchPresence: placeholder_only
- confirmationPhrasePresence: placeholder_only

The review must not read, print, copy, compare, store, or infer the real execute switch value or confirmation phrase.

## Rollback Dry-Run Placeholder

The future packet must include a rollback dry-run placeholder before any execution can be considered.

Required placeholder:

- rollbackDryRunPrepared: placeholder_only

This review does not run rollback SQL, generate rollback SQL, or touch Supabase.

## Aggregate Readback Placeholder

The future packet must include an aggregate readback placeholder.

Required placeholder:

- aggregateReadbackPrepared: placeholder_only

The readback contract must remain aggregate-only and must not expose raw row contents, stock ids, source payloads, or secrets.

## Post-Run Review Placeholder

The future packet must include a post-run review placeholder.

Required placeholder:

- postRunReviewPrepared: placeholder_only

The post-run review must verify only bounded aggregate outcomes unless a later explicit authorization widens the scope.

## Candidate Duplicate Rejection Placeholder

The future packet must include a candidate duplicate rejection placeholder.

Required placeholder:

- candidateDuplicateRejectionPrepared: placeholder_only

The contract must not accept candidate rows, mutate daily_prices, or mark coverage complete during this review.

## Blocked Reasons

The gate remains blocked if any of these are true:

- Operator decision is absent.
- Operator decision is not one of go, no_go, repair_required.
- Server-only credential presence check is absent.
- Execute switch presence check is absent.
- Confirmation phrase presence check is absent.
- Rollback dry-run placeholder is absent.
- Aggregate readback placeholder is absent.
- Post-run review placeholder is absent.
- Candidate duplicate rejection placeholder is absent.
- Any raw payload, row payload, stock-id payload, secret, authorization value, confirmation phrase, or real decision value is present.
- Any SQL execution, Supabase connection, data ingestion, candidate row acceptance, daily_prices mutation, publicDataSource=supabase promotion, or scoreSource=real promotion is attempted.

## Next Route

The next safe route is PM integration into the TWII explicit operator go/no-go decision preparation gate.

Allowed next route:

- review_only_explicit_operator_go_no_go_decision_preparation

Disallowed next routes in this A1 review:

- SQL execution
- Supabase connection
- staging row creation
- daily_prices mutation
- market data fetch or ingestion
- candidate row acceptance
- publicDataSource=supabase promotion
- scoreSource=real promotion

## Fail-Closed Rules

- Missing prerequisite means no_go or repair_required posture, never go.
- Unknown source status means repair_required posture.
- Any secret or payload exposure means hard stop.
- Any attempt to execute SQL or write Supabase means hard stop.
- Any attempt to mutate daily_prices means hard stop.
- Any attempt to set publicDataSource=supabase or scoreSource=real means hard stop.
- This review cannot authorize execution by itself.

## PM Integration Notes

- PM may use this file as A1 contract evidence for the mainline explicit operator go/no-go decision preparation gate.
- PM should treat every execution-sensitive value as presence-only.
- PM should keep the decision options as placeholders until a separate authorized operator step provides the real decision outside this review.
- PM should require the gate to fail closed when any prerequisite is absent or ambiguous.
- PM should preserve the bounded scope: TWII / daily_prices / 60 rows.

## Hard Boundaries

- Do not execute SQL.
- Do not connect to Supabase.
- Do not read secrets, environment variables, authorization values, confirmation phrases, or real decision values.
- Do not fetch market data.
- Do not read raw payloads, row payloads, or stock-id payloads.
- Do not modify daily_prices.
- Do not accept candidate rows.
- Do not set publicDataSource=supabase.
- Do not set scoreSource=real.
