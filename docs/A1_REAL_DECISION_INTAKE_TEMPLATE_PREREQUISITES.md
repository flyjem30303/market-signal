# A1 Real Decision Intake Template Prerequisites

Status: `a1_real_decision_intake_template_prerequisites_ready_reference_only`

Date: 2026-06-11

Owner lane: A1 Real Decision Template Prerequisites Support Line

Purpose: reference-only support for the PM mainline `TWII real decision intake packet template gate`. This document defines the prerequisite checklist for the template shape, placeholder policy, blank-value requirements, decision-value stop lines, aggregate readback readiness, rollback readiness, operator stop conditions, and fail-closed review. It does not authorize, execute, simulate, validate, or record a real decision.

This A1 reference does not execute SQL, connect to Supabase, read Supabase, write Supabase, read env values, read secret values, read authorization values, read confirmation phrase values, read real decision values, read candidate rows, read raw payloads, read row payloads, read stock-id payloads, fetch market data, import market data, ingest market data, write `daily_prices`, create staging rows, set `publicDataSource=supabase`, set `scoreSource=real`, edit PM mainline files, edit checker scripts, edit package files, edit project status files, or edit `data/source-gates`.

Explicit hard boundary: this file is reference-only/no-execution. Any path, gate name, switch name, authorization name, confirmation phrase name, placeholder name, or real decision field listed here is a name-only reference and must not be read for values, compared against hidden values, or used to infer a real decision.

## Template Required Fields

The PM mainline intake packet template should remain blocked unless the template includes all fields below as empty or placeholder-only fields. These fields define the shape of the intake packet; they are not values and are not approvals.

| Field | Required template state | Value entry allowed in A1 |
| --- | --- | --- |
| `templateId` | Present as a stable template identifier. | `false` |
| `templateVersion` | Present as a version label for PM review. | `false` |
| `targetLane` | Present with allowed placeholder or blank value only. | `false` |
| `targetTable` | Present with allowed placeholder or blank value only. | `false` |
| `targetScope` | Present with allowed placeholder or blank value only. | `false` |
| `maxRows` | Present with allowed placeholder or blank value only. | `false` |
| `decisionOwnerLane` | Present with allowed placeholder or blank value only. | `false` |
| `decisionState` | Present but blank until PM/operator provides an approved decision outside this A1 task. | `false` |
| `decisionValue` | Present but blank; real decision values are prohibited in this A1 document and task. | `false` |
| `authorizationReference` | Present as a reference-label field only; no authorization value may be read or printed. | `false` |
| `confirmationPhraseReference` | Present as a reference-label field only; no confirmation phrase value may be read or printed. | `false` |
| `candidateArtifactPath` | Present as a path-label field only; candidate rows and row payloads must not be read. | `false` |
| `aggregateReadbackReadiness` | Present as a readiness placeholder or blank value only. | `false` |
| `rollbackReadiness` | Present as a readiness placeholder or blank value only. | `false` |
| `operatorStopConditionsAccepted` | Present as a checklist field only. | `false` |
| `failClosedChecklistComplete` | Present as a checklist field only. | `false` |
| `runtimeBoundary` | Present and locked to mock-only wording. | `false` |
| `scoringBoundary` | Present and locked to mock-only wording. | `false` |
| `notesForPM` | Present for sanitized reference notes only; no row, payload, credential, secret, authorization, phrase, or decision value content. | `false` |

Passing this field-shape prerequisite means only that the PM mainline may review the intake template. It does not mean the template contains a real decision, operator authorization, executable packet, or accepted run state.

## Allowed Placeholders

Only placeholder tokens that keep values hidden may appear in the template. Placeholders must be visibly non-executable and must not encode real decision values, credentials, row values, source values, or authorization/confirmation content.

Allowed placeholder forms:

- `<PM_TO_FILL>`
- `<OPERATOR_TO_FILL>`
- `<REFERENCE_ONLY>`
- `<VALUE_HIDDEN>`
- `<DECISION_VALUE_WITHHELD>`
- `<AUTHORIZATION_VALUE_WITHHELD>`
- `<CONFIRMATION_PHRASE_WITHHELD>`
- `<CANDIDATE_PATH_REFERENCE_ONLY>`
- `<AGGREGATE_ONLY>`
- `<ROLLBACK_READINESS_REFERENCE_ONLY>`
- `<FAIL_CLOSED>`
- `TBD_BY_PM`
- `TBD_BY_OPERATOR`
- blank value

Allowed fixed boundary labels:

- `publicDataSource=mock`
- `scoreSource=mock`
- `publicDataSourceSupabaseAllowed=false`
- `scoreSourceRealAllowed=false`
- `promotionAllowed=false`
- `rowCoverageScoringAllowed=false`
- `executionAllowed=false`

Any placeholder that includes a real decision value, hidden authorization value, confirmation phrase value, env value, secret value, SQL text, source value, row value, trade-date list, stock-id payload, or market-data payload must fail closed.

## Blank Value Requirements

The intake packet template must preserve blank values for all fields that could become a real decision, authorization, confirmation, credential, source value, payload value, row value, or execution instruction.

| Field category | Required blank-value posture |
| --- | --- |
| Real decision fields | Must remain blank or `<DECISION_VALUE_WITHHELD>` in this A1 support task. |
| Authorization fields | Must remain blank or `<AUTHORIZATION_VALUE_WITHHELD>`; no authorization value may be read, copied, compared, or inferred. |
| Confirmation phrase fields | Must remain blank or `<CONFIRMATION_PHRASE_WITHHELD>`; no phrase value may be read, copied, compared, or inferred. |
| Env or secret fields | Must remain blank or `<VALUE_HIDDEN>`; env/secrets are not read and not named with values. |
| Candidate row fields | Must remain absent or blank; candidate row contents and row payloads are not read. |
| Raw/source payload fields | Must remain absent or blank; raw payloads and source response bodies are not read. |
| Stock-id payload fields | Must remain absent or blank; stock-id payloads are not read or output. |
| SQL or command fields | Must remain absent or blank; this template gate is not a command packet. |
| Supabase runtime fields | Must remain mock-only and no-connection; no Supabase URL, key, query, or result may appear. |
| Promotion fields | Must remain locked to `false` or `mock`; no public Supabase source or real scoring value may appear. |

If a blank-required field is filled with any real value during this A1 task, the template gate must be treated as contaminated and blocked for PM repair.

## Decision Value Stop Lines

The template gate must stop immediately if any user, file, checker, tool, or next step asks A1 to read, derive, verify, compare, print, store, or decide any real decision value.

Stop-line examples:

- a request to fill `decisionValue`;
- a request to choose go/no-go or approve/reject a real run;
- a request to read authorization or confirmation phrase values;
- a request to validate an operator phrase;
- a request to inspect env, secret, credential, token, private URL, or dashboard value;
- a request to read candidate rows, row payloads, raw payloads, stock-id payloads, source payloads, trade-date lists, per-date values, or market values;
- a request to execute SQL or prepare executable SQL;
- a request to connect to Supabase, import a Supabase client for execution, read Supabase, or write Supabase;
- a request to create staging rows or mutate `daily_prices`;
- a request to fetch, import, ingest, transform, or store market data;
- a request to set `publicDataSource=supabase` or `scoreSource=real`;
- a request to treat template readiness as authorization, launch readiness, row coverage scoring, source promotion, or real scoring approval.

Default decision-value posture: fail closed. The A1 output may describe required template fields and safe placeholders only.

## Aggregate Readback Readiness

The intake template may include aggregate readback readiness fields only as prerequisites for a possible later PM-controlled flow. This A1 file does not perform readback and does not verify Supabase state.

| Readback readiness item | Required template posture |
| --- | --- |
| `aggregateReadbackRequired` | Present as `true` or `<PM_TO_FILL>` only. |
| `aggregateReadbackMode` | Present as `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`. |
| `readbackRows` | Placeholder-only aggregate count field; no row list or row bodies. |
| `insertedRows` | Placeholder-only aggregate count field; no row list or row bodies. |
| `duplicateRows` | Placeholder-only aggregate count field; no row list or row bodies. |
| `rejectedRows` | Placeholder-only aggregate count field; no row list or row bodies. |
| `alreadyExistingRows` | Placeholder-only aggregate count field; no row list or row bodies. |
| `missingCandidateRows` | Placeholder-only aggregate count field; no candidate row bodies. |
| `sanitizedErrorCode` | Placeholder-only sanitized code; no raw error payload or secret-bearing message. |
| `sanitizedErrorCategory` | Placeholder-only sanitized category. |
| `readbackOutputPolicy` | Must state aggregate-only with no raw payload, row payload, stock-id payload, source payload, SQL result, or secret output. |

Aggregate readback readiness does not authorize a readback run. If actual readback, SQL, Supabase connection, row output, payload output, or real decision validation is required, the template gate must stay blocked.

## Rollback Readiness

The intake template may include rollback readiness fields only as prerequisite placeholders. This A1 file does not perform rollback, rollback dry run, destructive action, or Supabase validation.

| Rollback readiness item | Required template posture |
| --- | --- |
| `rollbackReadinessRequired` | Present as `true` or `<PM_TO_FILL>` only. |
| `rollbackReadinessState` | Placeholder-only state field. |
| `rollbackScopeLocked` | Placeholder-only or `true`; must not expand the target scope. |
| `rollbackTargetTable` | Placeholder-only or `daily_prices` name-only reference. |
| `rollbackTargetLane` | Placeholder-only or `TWII` name-only reference. |
| `rollbackMaxRows` | Placeholder-only or bounded count reference; no row list. |
| `rollbackDryRunRequired` | Placeholder-only or `true`; no dry-run execution implied. |
| `rollbackReady` | Placeholder-only aggregate boolean; no rollback proof implied. |
| `destructiveRollbackAllowed` | Must be `false`. |
| `rollbackRequiresSeparateExecutionGate` | Must be `true`. |
| `rollbackOutputPolicy` | Must state aggregate-only counts/status with no raw payload, row payload, stock-id payload, source payload, SQL result, or secret output. |

Rollback readiness is not rollback authorization. Any request to delete, update, truncate, revert, repair, dry-run, or otherwise mutate `daily_prices` must fail closed unless PM later creates a separate approved execution gate outside this A1 task.

## Operator Stop Conditions

The operator or PM reviewer must keep the template gate blocked if any condition below is true, requested, unclear, stale, or required to proceed:

- SQL execution is required or requested.
- Supabase connection, Supabase read, or Supabase write is required or requested.
- Env values, secret values, credential values, switch values, phrase values, authorization values, or real decision values must be read, validated, printed, copied, compared, derived, or stored.
- Candidate rows, raw payloads, row payloads, stock-id payloads, source payloads, source response bodies, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, stored, or refreshed.
- `daily_prices` must be inserted, updated, deleted, merged, accepted, repaired, or otherwise mutated.
- Staging rows must be created, read, updated, deleted, or used as evidence.
- A placeholder is replaced with a hidden value, real decision value, authorization value, confirmation phrase value, credential, source value, row value, or market value.
- The template asks A1 to decide go/no-go, approve a real run, validate a real decision, or close a PM blocker.
- Scope expands beyond the PM mainline `TWII real decision intake packet template gate`.
- Aggregate readback execution, rollback execution, rollback dry-run execution, post-run review execution, or row coverage scoring is requested from this file.
- Source promotion, public source switching, launch-readiness closure, `publicDataSource=supabase`, or `scoreSource=real` is requested, implied, or treated as unlocked.
- Any PM mainline file, existing source gate, checker script, package file, project status file, or data artifact would need to be edited by this A1 support task.
- Any required state cannot be checked without crossing the hard boundary.

Default operator posture: fail closed to blocked or repair-required until PM repairs the template gate without expanding A1 scope.

## Fail-Closed Checklist

Use this checklist only for PM review of the template prerequisite shape. Checking these boxes does not authorize execution or record a real decision.

| Check | Required answer |
| --- | --- |
| Template contains required fields | All required fields exist as blank, allowed placeholder, or safe fixed boundary labels. |
| Decision values remain blank | No real decision value appears, is read, is inferred, or is requested from A1. |
| Authorization values remain hidden | No authorization value, confirmation phrase value, env value, secret value, credential value, or switch value appears or is read. |
| Placeholders are safe | All placeholders are visibly non-executable and value-hidden. |
| Candidate artifact stays reference-only | Candidate path may be named only if needed; candidate rows and row payloads are not read. |
| Payloads stay prohibited | Raw payloads, source payloads, row payloads, stock-id payloads, trade-date lists, per-date values, and market values are absent. |
| No execution occurred | SQL, Supabase connection, Supabase read/write, market-data fetch/import/ingest, staging creation, and `daily_prices` mutation are all absent. |
| Aggregate readback is readiness-only | Readback fields are aggregate placeholders only and do not perform or prove readback. |
| Rollback is readiness-only | Rollback fields are placeholders only; destructive rollback is `false` and separate execution gate is required. |
| Promotion remains locked | `publicDataSource=mock`, `scoreSource=mock`, `promotionAllowed=false`, and `rowCoverageScoringAllowed=false`. |
| Failure mode is closed | Missing, stale, unclear, expanded-scope, value-reading, row-reading, payload-reading, or execution-requesting states result in blocked or repair-required. |
| PM ownership is preserved | PM mainline owns any later decision, authorization, execution, readback, rollback, or promotion review. |

## Safe Handoff Summary

1. This file supports only the PM mainline `TWII real decision intake packet template gate`.
2. The prerequisite posture is reference-only/no-execution and template-shape-only.
3. Required fields may exist only as blanks, allowed placeholders, or safe fixed boundary labels.
4. Real decision values, authorization values, confirmation phrase values, env values, secrets, row payloads, raw payloads, stock-id payloads, and market values are stop-line content.
5. Aggregate readback and rollback readiness are placeholder prerequisites only; they do not perform readback, rollback, Supabase access, or `daily_prices` mutation.
6. The gate fails closed on any request for SQL, Supabase, secrets/env/authorization values, real decision values, candidate rows, payloads, market-data fetch/import/ingest, staging rows, `daily_prices` writes, `publicDataSource=supabase`, or `scoreSource=real`.
