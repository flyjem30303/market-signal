# A1 Operator Authorization Acceptance Prerequisites

Status: `a1_operator_authorization_acceptance_prerequisites_reference_only_no_execution`

Date: 2026-06-11

Owner lane: A1 Operator Authorization Acceptance Prerequisites Support Line

Purpose: reference-only support for the PM mainline `TWII operator authorization acceptance gate preflight`. This document defines prerequisites for accepting, rejecting, or requiring repair on an operator authorization gate. It does not authorize, execute, simulate, validate, read back, roll back, review, promote, score, or repair any real execution.

This A1 file does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, read env values, read secret values, read authorization values, read confirmation phrase values, read raw payloads, read row payloads, read stock-id payloads, fetch market data, write `daily_prices`, create staging rows, set `publicDataSource=supabase`, set `scoreSource=real`, edit PM mainline files, edit checker scripts, edit package files, edit project status files, or edit `data/source-gates`.

Explicit hard boundary: all paths, gate names, switch names, confirmation phrase names, artifact names, authorization labels, and status labels in this document are name-only references for PM review. They must not be opened, read, compared, printed, derived, or copied for row values, payload values, credential values, authorization values, confirmation phrase values, source values, or execution evidence by this A1 support task.

## Decision Prerequisites

The PM mainline operator authorization acceptance gate should fail closed unless the decision can be recorded from reference-only, value-hidden, aggregate-only inputs. These prerequisites define decision eligibility only; they do not make a decision for PM and do not authorize execution.

| Decision | Required prerequisite state | A1 execution allowed here |
| --- | --- | --- |
| `accepted` | All locked-scope prerequisites are present, current, non-contradictory, and value-hidden; source-rights, field-contract, candidate-artifact, runtime-gate, rollback-readiness, aggregate-readback, and post-run-review references are accepted or explicitly allowed by their owner lanes; no stop condition is present. | `false` |
| `rejected` | One or more prerequisites are clearly incompatible with the locked TWII scope, cannot be made value-hidden, would require prohibited execution or prohibited reads, or would require promotion to `publicDataSource=supabase` or `scoreSource=real`. | `false` |
| `repair_required` | One or more prerequisites are missing, stale, ambiguous, incomplete, owner-unconfirmed, wording-inconsistent, or not yet mapped to aggregate-only post-run review fields, but the issue may be repaired without SQL, Supabase, secrets, authorization values, confirmation phrase values, row payloads, raw payloads, stock-id payloads, market-data fetches, `daily_prices` writes, staging rows, public source promotion, or real scoring. | `false` |

Default decision posture: when the gate cannot distinguish safely between `accepted`, `rejected`, and `repair_required`, the result must be `repair_required` or `rejected`, never `accepted`.

## Acceptance Prerequisite Checklist

All checks below must be satisfied before PM may consider an `accepted` decision.

| Check | Required reference-only state |
| --- | --- |
| Scope lock | Target remains `TWII`, target table remains `daily_prices`, target scope remains `twii_index_daily_prices_missing_rows`, and maximum row count remains `60` or lower. |
| Source-rights posture | TWII source-rights decision is accepted or explicitly allowed by the owner lane without exposing source payloads, raw payloads, row payloads, stock-id payloads, source values, or per-row evidence. |
| Field contract posture | TWII index field contract is accepted for the intended `daily_prices` mapping without requiring row payload, stock-id payload, raw payload, trade-date list, or per-date value inspection. |
| Candidate artifact posture | Candidate artifact may be named only as a sanitized aggregate reference; candidate rows, row bodies, row payloads, stock-id payloads, and raw payloads remain unread. |
| Operator authorization shape | Required operator authorization, execute switch, and confirmation phrase checks are shape-only and value-hidden; no values are read, compared, printed, derived, copied, or confirmed by this file. |
| Runtime gate posture | Runtime execution gate remains separate, server-only, fail-closed, and PM/operator-controlled; this file is not an executable runbook. |
| Aggregate readback readiness | Aggregate-only readback fields are pre-defined for a later separately authorized run; no readback occurs here. |
| Rollback readiness | Rollback readiness is present as a prerequisite contract only; no rollback execution or rollback dry run occurs here. |
| Post-run review readiness | Post-run review fields are pre-defined as aggregate-only, sanitized, and non-promotional. |
| Promotion locks | Runtime remains `publicDataSource=mock`; scoring remains `scoreSource=mock`; row coverage scoring and launch-readiness closure remain blocked. |

An `accepted` decision means only that the operator authorization acceptance gate is ready for PM-controlled next review. It is not a write authorization, not a go decision, not proof that credentials or operator phrases are correct, and not proof that real execution is safe.

## Rejection Prerequisites

PM should record `rejected` when any condition below is clearly true and cannot be repaired within the current value-hidden, reference-only boundary.

- The requested scope expands beyond `TWII`, `daily_prices`, `twii_index_daily_prices_missing_rows`, or `maxRows=60`.
- SQL execution, Supabase connection, Supabase read, Supabase write, or `@supabase/supabase-js` import is required.
- Env values, secret values, credential values, authorization values, execute switch values, or confirmation phrase values must be read, compared, printed, derived, copied, or confirmed by this A1 task.
- Raw payloads, row payloads, stock-id payloads, source payloads, row bodies, trade-date lists, per-date market values, source values, or candidate rows must be read or output.
- Market data must be fetched, imported, ingested, transformed, stored, refreshed, or committed.
- `daily_prices` must be inserted, updated, deleted, merged, accepted, repaired, or otherwise mutated.
- Staging rows must be created, read, accepted, repaired, promoted, or deleted by this A1 task.
- Aggregate readback, rollback, rollback dry run, post-run review, or final execution is requested from this file.
- Public runtime switching, source promotion, `publicDataSource=supabase`, real scoring, `scoreSource=real`, row coverage scoring, row coverage point award, or launch-readiness closure is requested or implied.

## Repair-Required Prerequisites

PM should record `repair_required` when the gate may become acceptable after bounded document repair, owner confirmation, or reference-chain cleanup that stays inside the hard boundary.

| Repair area | Repair requirement |
| --- | --- |
| Missing owner state | The responsible owner lane must provide a value-hidden accepted/rejected/repair-required state without exposing prohibited values or payloads. |
| Ambiguous scope | Scope wording must be clarified back to `TWII`, `daily_prices`, `twii_index_daily_prices_missing_rows`, and `maxRows=60` or lower. |
| Stale references | PM must refresh reference labels or document statuses without asking A1 to read credentials, authorization values, confirmation phrase values, rows, payloads, or market data. |
| Incomplete review fields | Aggregate readback, rollback readiness, or post-run review fields must be made explicit before acceptance. |
| Contradictory promotion language | Any wording that implies `publicDataSource=supabase`, `scoreSource=real`, row coverage scoring, or launch closure must be corrected to locked/mock posture. |
| Unclear failure mode | The gate must state that missing, stale, ambiguous, expanded-scope, value-reading, payload-reading, row-reading, or execution-requesting states fail closed. |

`repair_required` is not permission to inspect values or execute repairs against data. It only identifies document-level or owner-state repair needed before PM can consider acceptance.

## Decision Record Fields

If PM records a decision, the record should be aggregate-only and value-hidden. The record may use the fields below; any field that would require prohibited values or payloads must be omitted or marked blocked.

| Field | Allowed content |
| --- | --- |
| `decisionId` | PM-generated label only; no credential, phrase, token, row, or source value. |
| `decisionTimestamp` | Human-readable timestamp of PM decision recording. |
| `decisionOwner` | Role or lane name, not a secret, credential, token, or personal authorization value. |
| `targetLane` | `TWII`. |
| `targetTable` | `daily_prices`. |
| `targetScope` | `twii_index_daily_prices_missing_rows`. |
| `maxRows` | `60` or lower. |
| `decision` | One of `accepted`, `rejected`, or `repair_required`. |
| `decisionReasonCategory` | Sanitized category such as `all_prerequisites_reference_ready`, `scope_mismatch`, `prohibited_value_required`, `prohibited_payload_required`, `execution_requested`, `promotion_requested`, `missing_owner_state`, or `stale_reference`. |
| `sourceRightsState` | Owner-lane state label only; no source terms text, source payload, or raw evidence. |
| `fieldContractState` | Owner-lane state label only; no row values or per-date values. |
| `candidateArtifactState` | Sanitized artifact readiness label only; no candidate row contents. |
| `authorizationShapeState` | Shape-only status; no authorization value, confirmation phrase value, execute switch value, credential, secret, token, or env value. |
| `aggregateReadbackReadiness` | Readiness label only; no readback execution or query result. |
| `rollbackReadiness` | Readiness label only; no rollback predicates, keys, row lists, or dry-run result. |
| `postRunReviewReadiness` | Readiness label only; no post-run execution evidence. |
| `stopConditionPresent` | Boolean or sanitized category only. |
| `repairRequiredItems` | Document-level repair categories only. |
| `promotionLockState` | `publicDataSource=mock`, `scoreSource=mock`, `promotionAllowed=false`, and `rowCoverageScoringAllowed=false`. |
| `executionAuthorizedByThisDecision` | Must be `false`. |

The decision record must not include SQL text, query results, credentials, env values, secret values, authorization values, confirmation phrase values, execute switch values, raw payloads, row payloads, stock-id payloads, source payloads, row bodies, trade-date lists, per-date values, candidate rows, market data, deletion predicates, update predicates, or staging row contents.

## Aggregate Readback Readiness

Aggregate readback readiness must be present before an operator authorization acceptance can be considered complete, but this file performs no readback.

| Readback check | Required posture |
| --- | --- |
| Separate authorization | Readback may occur only after a separate PM/operator-authorized execution attempt. |
| Aggregate-only output | Allowed output is limited to counts, statuses, sanitized error categories, and scope booleans. |
| No payload exposure | Raw payloads, row payloads, stock-id payloads, row bodies, trade-date lists, per-date values, source values, SQL text, and query results remain prohibited. |
| Scope consistency | Readback scope must match the authorized TWII `daily_prices` missing-row scope and row cap. |
| Fail-closed result | Missing, ambiguous, stale, expanded, row-level, payload-level, value-revealing, or promotion-implying readback requirements block acceptance. |
| No promotion effect | Readback cannot switch `publicDataSource`, enable `scoreSource=real`, award row coverage points, close launch readiness, or prove public readiness. |

## Rollback Readiness

Rollback readiness must be available as a PM-reviewed contract before an operator authorization acceptance decision can be recorded as accepted.

| Rollback check | Required posture |
| --- | --- |
| Scope lock | Rollback scope is limited to the same TWII `daily_prices` missing-row scope and row cap. |
| Separate gate | Rollback execution, destructive rollback, cleanup, delete, update, truncate, or repair requires a separate explicit PM gate. |
| Aggregate-only evidence | Rollback readiness may name only aggregate counts, status labels, blocked-row counts, skipped-row counts, and sanitized error categories. |
| No predicates or keys | Deletion predicates, update predicates, row keys, trade-date lists, stock IDs, row payloads, and raw payloads are prohibited. |
| Dry-run boundary | Rollback dry-run execution is not performed by this file and must not be inferred from readiness language. |
| Fail-closed result | If rollback readiness is absent, unclear, stale, value-revealing, destructive, or broader than scope, the acceptance decision remains blocked or repair-required. |

Rollback readiness does not authorize rollback. It only prevents PM from accepting an authorization gate without a pre-agreed recovery posture.

## Operator Stop Conditions

The operator or PM mainline should stop and keep the gate blocked if any condition below is true, requested, implied, required, unclear, stale, or impossible to verify without crossing the boundary:

- SQL execution is needed.
- Supabase connection, Supabase read, or Supabase write is needed.
- `@supabase/supabase-js` import is needed.
- Env, secret, credential, token, project, URL, execute switch, confirmation phrase, or authorization values must be read, compared, printed, derived, copied, or confirmed.
- Raw payloads, row payloads, stock-id payloads, source payloads, row bodies, trade-date lists, per-date market values, candidate rows, or source values must be read or output.
- Market data must be fetched, imported, ingested, transformed, stored, refreshed, or committed.
- `daily_prices` must be inserted, updated, deleted, merged, accepted, repaired, or otherwise mutated.
- Staging rows must be created, read, accepted, repaired, promoted, or deleted.
- Candidate artifact rows or row-level contents must be opened or inspected.
- Scope expands beyond `TWII`, `daily_prices`, `twii_index_daily_prices_missing_rows`, or `maxRows=60`.
- Aggregate readback, rollback, rollback dry run, post-run review, final execution, or real execution is requested from this A1 file.
- `publicDataSource=supabase` or `scoreSource=real` is requested, implied, or treated as unlocked.
- Row coverage scoring, row coverage point award, source promotion, public launch closure, or production readiness claim is requested.
- Any PM mainline file, package file, checker script, status file, or `data/source-gates` file would need to be edited by this A1 support task.

Default operator posture: fail closed to `repair_required`, `rejected`, `blocked`, or `no_go` until PM resolves the condition without expanding this A1 task.

## Fail-Closed Checklist

Use this checklist as the operator authorization acceptance gate's reference-only safety posture.

| Check | Required value |
| --- | --- |
| `sqlExecuted` | `false` |
| `supabaseClientImported` | `false` |
| `supabaseConnectionAttempted` | `false` |
| `supabaseReadAttempted` | `false` |
| `supabaseWriteAttempted` | `false` |
| `envValuesRead` | `false` |
| `secretValuesRead` | `false` |
| `authorizationValuesRead` | `false` |
| `confirmationPhraseValuesRead` | `false` |
| `executeSwitchValuesRead` | `false` |
| `rawPayloadRead` | `false` |
| `rowPayloadRead` | `false` |
| `stockIdPayloadRead` | `false` |
| `candidateRowsRead` | `false` |
| `marketDataFetched` | `false` |
| `dailyPricesMutated` | `false` |
| `stagingRowsCreated` | `false` |
| `aggregateReadbackExecuted` | `false` |
| `rollbackExecuted` | `false` |
| `rollbackDryRunExecuted` | `false` |
| `postRunReviewExecuted` | `false` |
| `realExecutionAuthorizedByThisFile` | `false` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |
| `publicDataSourceSupabaseAllowed` | `false` |
| `scoreSourceRealAllowed` | `false` |
| `rowCoverageScoringAllowed` | `false` |
| `launchReadinessClosureAllowed` | `false` |
| `executionAllowedByThisFile` | `false` |

Any missing, contradictory, stale, expanded-scope, row-revealing, payload-revealing, credential-revealing, authorization-revealing, confirmation-phrase-revealing, switch-value-revealing, promotion-implying, or execution-requesting state fails closed.

## Post-Run Review Readiness

Post-run review readiness must be defined before operator authorization acceptance can advance, but it remains non-executing here.

| Review check | Required posture |
| --- | --- |
| Separate PM review | Review happens only after a separately authorized run and separately allowed aggregate readback. |
| Mutation summary | Permitted fields are aggregate counts and status only, such as attempted rows, inserted rows, duplicate rows, rejected rows, skipped rows, and sanitized error category. |
| Readback summary | Permitted fields are aggregate readback counts, expected max rows, scope booleans, and sanitized readback error category. |
| Recovery posture | Rollback readiness status is included as aggregate readiness only, not as rollback authorization. |
| Decision trace | The accepted/rejected/repair-required operator authorization decision can be linked by label only, without exposing hidden values. |
| Promotion lock | Review cannot promote source, switch public data source, enable real score, award row coverage points, or close launch readiness. |
| Stop condition | If review would require row bodies, raw payloads, stock-id payloads, SQL text, query results, secrets, env values, credential-derived values, authorization values, confirmation phrase values, or execute switch values, acceptance remains blocked or repair-required. |

This document performs no post-run review and does not claim that a run succeeded, failed, partially succeeded, or occurred.

## What Remains Blocked Before Real Execution

The following items remain blocked before any real execution can occur:

- PM/operator must separately approve the operator authorization acceptance decision and any later execution authorization packet.
- Any execute switch, confirmation phrase, credential, and authorization value check must be performed outside this A1 reference file by the approved operator-controlled path.
- Server-only execution path must remain separately owned, reviewed, and authorized.
- SQL execution remains outside this task and is not authorized here.
- Supabase connection, read behavior, and write behavior remain outside this task and are not validated here.
- Candidate row contents remain unread by this task.
- Raw market data, source payloads, row payloads, stock-id payloads, row bodies, trade-date lists, and per-date values remain unread by this task.
- `daily_prices` remains unmodified by this task.
- Staging rows remain uncreated by this task.
- Aggregate readback remains unperformed until a separate authorized run exists.
- Rollback readiness remains a prerequisite contract, not an executed recovery action.
- Rollback execution and rollback dry run remain separately gated and unperformed here.
- Post-run review remains unperformed until a separate authorized run and aggregate readback exist.
- Public promotion remains blocked; `publicDataSource=supabase` is not set.
- Real scoring remains blocked; `scoreSource=real` is not set.
- Row coverage scoring, row coverage point award, production-readiness claim, and launch-readiness closure remain blocked.

## Safe Handoff Summary

1. This file supports only the PM mainline `TWII operator authorization acceptance gate preflight`.
2. The checklist is reference-only, no-execution, aggregate-only, value-hidden, and fail-closed.
3. Accepted, rejected, and repair-required decision prerequisites are defined as decision-readiness criteria only, not as authorization to execute.
4. Decision records may contain labels, statuses, sanitized categories, aggregate readiness, and promotion locks only.
5. Operator stop conditions block SQL, Supabase, env/secrets/authorization values, confirmation phrase values, execute switch values, raw payloads, row payloads, stock-id payloads, market-data fetches, `daily_prices` writes, staging rows, public source promotion, and real scoring.
6. Real execution remains blocked until PM/operator authorization occurs through a separate approved path outside this A1 support document.
