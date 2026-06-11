# A1 Server-Only Pre-Execution Integration Preparation Contract Review

Status: a1_server_only_pre_execution_integration_preparation_contract_review_ready

## Purpose

This A1 review prepares a local-only contract handoff for the PM mainline gate:
`TWII server-only pre-execution integration preparation gate`.

This file is a preparation and review artifact only. It does not execute, connect,
read credentials, read secrets, read authorization material, fetch market data,
touch `daily_prices`, or change runtime scoring/source switches.

## Server-Only Boundary

- Integration owner: PM mainline only.
- A1 role: local-only contract reviewer and checklist handoff provider.
- Permitted A1 action: document the expected contract, proof placeholders,
  blocked reasons, fail-closed rules, and PM integration notes.
- Prohibited A1 action: execute SQL, connect Supabase, inspect secrets/env,
  inspect authorization values, inspect confirmation phrases, inspect real
  decision values, fetch market data, mutate `daily_prices`, or change
  `publicDataSource` / `scoreSource`.
- Any future server-only integration must run outside this A1 document and must
  preserve server-only handling of credentials and execution confirmation.

## Bounded Target Scope

- Dataset symbol: `TWII`
- Target table: `daily_prices`
- Bounded row count: `60 rows`
- Target operation type in this review: preparation contract only
- Runtime action in this review: none
- Data payload visibility in this review: none

## Readiness Checklist Handoff

PM should treat this checklist as the handoff surface before any server-only
execution path is considered.

- Server-only credential presence check is represented as a presence-only
  placeholder and never as a credential value.
- Execute switch presence check is represented as a presence-only placeholder
  and never as a real decision value.
- Confirmation phrase presence check is represented as a presence-only
  placeholder and never as phrase content.
- Rollback dry-run proof is represented by a placeholder until PM attaches
  server-only proof.
- Aggregate readback proof is represented by a placeholder until PM attaches
  aggregate-only evidence.
- Post-run review proof is represented by a placeholder until PM attaches the
  required review result.
- Duplicate rejection proof is represented by a placeholder until PM attaches
  proof that duplicate target rows are rejected or safely skipped.
- Any missing placeholder keeps the gate blocked.

## Presence-Only Rules

- Presence checks may report only `present`, `missing`, `not_reviewed`, or
  `blocked`.
- Presence checks must not expose values, tokens, URLs, keys, secrets,
  authorization material, confirmation phrases, or operator decisions.
- Presence checks must not imply that A1 has inspected the underlying value.
- Presence checks must fail closed when the expected server-only check is absent,
  ambiguous, unverifiable, or outside the bounded target scope.
- Presence checks must remain local-only in this A1 file.

## Field-Name-Only Rules

- A1 may name expected fields and proof labels.
- A1 must not include row payloads, raw market records, credential values,
  confirmation phrase content, authorization content, or real execution
  decisions.
- Field references must be used only to describe contract shape and required
  proof surfaces.
- Field-name-only review must not be treated as data validation, remote
  validation, or successful integration.

## Integration Placeholders

### Server-Only Credential Presence Integration Placeholder

- Placeholder status: blocked_until_pm_server_only_presence_proof
- Allowed evidence shape: credential presence status only
- Disallowed evidence shape: credential value, env content, secret name with
  value, token, URL with secret, or authorization content
- Required PM result field name: `serverOnlyCredentialPresence`

### Execute Switch Presence Integration Placeholder

- Placeholder status: blocked_until_pm_execute_switch_presence_proof
- Allowed evidence shape: execute switch presence status only
- Disallowed evidence shape: real execute decision value or operator instruction
- Required PM result field name: `executeSwitchPresence`

### Confirmation Phrase Presence Integration Placeholder

- Placeholder status: blocked_until_pm_confirmation_phrase_presence_proof
- Allowed evidence shape: confirmation phrase presence status only
- Disallowed evidence shape: confirmation phrase content
- Required PM result field name: `confirmationPhrasePresence`

### Rollback Dry-Run Proof Placeholder

- Placeholder status: blocked_until_pm_rollback_dry_run_proof
- Allowed evidence shape: dry-run proof summary only
- Disallowed evidence shape: SQL text, remote connection output, row payload, or
  mutation result
- Required PM result field name: `rollbackDryRunProof`

### Aggregate Readback Proof Placeholder

- Placeholder status: blocked_until_pm_aggregate_readback_proof
- Allowed evidence shape: aggregate-only readback summary for `TWII`,
  `daily_prices`, `60 rows`
- Disallowed evidence shape: raw row payload, market data payload, or direct
  table dump
- Required PM result field name: `aggregateReadbackProof`

### Post-Run Review Proof Placeholder

- Placeholder status: blocked_until_pm_post_run_review_proof
- Allowed evidence shape: post-run review summary only
- Disallowed evidence shape: secrets, raw data payload, or remote credentials
- Required PM result field name: `postRunReviewProof`

### Duplicate Rejection Proof Placeholder

- Placeholder status: blocked_until_pm_duplicate_rejection_proof
- Allowed evidence shape: duplicate rejection or safe-skip proof summary only
- Disallowed evidence shape: raw duplicate rows or SQL execution transcript
- Required PM result field name: `duplicateRejectionProof`

## Blocked Reasons

The preparation gate remains blocked if any of the following are true:

- Server-only credential presence proof is absent.
- Execute switch presence proof is absent.
- Confirmation phrase presence proof is absent.
- Rollback dry-run proof is absent.
- Aggregate readback proof is absent.
- Post-run review proof is absent.
- Duplicate rejection proof is absent.
- Target scope is not exactly bounded to `TWII`, `daily_prices`, `60 rows`.
- Any proof exposes secrets, env values, authorization values, confirmation
  phrase content, real decision values, raw market data, row payloads, SQL, or
  remote connection details.
- Any step attempts to change `publicDataSource` or `scoreSource`.

## Fail-Closed Rules

- Missing proof means blocked.
- Ambiguous proof means blocked.
- Out-of-scope target means blocked.
- Any secret, credential, authorization value, confirmation phrase content, or
  real decision value in the evidence means blocked.
- Any SQL execution, Supabase connection, market-data fetch, `daily_prices`
  mutation, `publicDataSource` change, or `scoreSource` change in this A1 lane
  means blocked.
- Any proof beyond aggregate-only or field-name-only boundaries means blocked.
- A1 must not infer readiness from placeholder presence alone.

## Next Route

Next route: PM mainline integration review for
`TWII server-only pre-execution integration preparation gate`.

PM should consume this file as a local-only contract review and attach
server-only proof summaries in the PM-owned integration path. A1 should not
perform the execution, remote connection, credential inspection, or data
readback.

## PM Integration Notes

- Keep all credential, execute-switch, and confirmation-phrase checks
  server-only.
- Return only presence statuses and proof summaries to the review surface.
- Keep target scope fixed to `TWII`, `daily_prices`, `60 rows`.
- Keep readback evidence aggregate-only.
- Keep field references field-name-only.
- Keep duplicate handling proof summary-level only.
- Keep rollback proof dry-run and summary-level only.
- Do not expose secrets, env values, authorization values, confirmation phrase
  content, real decision values, raw market data, or row payloads.
- Do not use this A1 document as execution authorization.
- Do not change `publicDataSource` or `scoreSource` as part of this preparation
  contract.
