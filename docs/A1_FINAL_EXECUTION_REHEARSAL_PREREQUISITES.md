# A1 Final Execution Rehearsal Prerequisites

Status: `a1_final_execution_rehearsal_prerequisites_ready_reference_only`

Date: 2026-06-11

Owner lane: A1 Data / Execution Prerequisites

Purpose: reference-only/no-execution gap summary for the PM mainline `public beta data-realization final execution rehearsal gate`. This file defines prerequisite gaps and fail-closed review expectations only. It does not authorize, rehearse, simulate, execute, read back, roll back, promote, score, or review any data mutation.

This A1 document does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, read env values, read secret values, read authorization values, read confirmation phrase values, read raw payloads, read row payloads, read stock-id payloads, fetch market data, import market data, ingest market data, write `daily_prices`, create staging rows, set `publicDataSource=supabase`, set `scoreSource=real`, edit PM mainline gate files, edit checker scripts, edit package files, edit `PROJECT_STATUS.md`, or edit `data/source-gates`.

Explicit hard boundary: every path, gate name, switch name, confirmation phrase name, data source name, score source name, table name, or artifact name in this file is a name-only reference. This A1 support task must not read its values, rows, payloads, credentials, secrets, SQL text, or authorization contents.

## Execution Prerequisites

The PM mainline final execution rehearsal gate should remain blocked unless all execution prerequisites below are present, current, owner-accepted, and still bounded to the approved public beta data-realization rehearsal scope.

| Prerequisite | Required reference-only state | Gap posture |
| --- | --- | --- |
| Scope lock | PM has recorded the exact target lane, table, scope, maximum row count, and allowed operation vocabulary for the rehearsal gate. | Block if missing, stale, expanded, or ambiguous. |
| Source-rights acceptance | Source-rights approval is recorded by the responsible owner lane without exposing copied source terms, raw source payloads, or credential-derived details. | Block if approval is absent or requires payload review by A1. |
| Field contract acceptance | The target field mapping is accepted for the bounded data-realization lane, including date, price/value, timezone, precision, duplicate, and missing-session handling. | Block if mapping needs reinterpretation during rehearsal. |
| Candidate artifact readiness | Candidate artifact may be named only as a path/reference; candidate rows, row payloads, raw payloads, and stock-id payloads remain unread by this A1 task. | Block if rehearsal requires A1 to inspect candidate contents. |
| Operator authorization shape | Required operator authorization, switch, and confirmation phrase checks are shape-only and value-hidden. | Block if any env, secret, switch, phrase, credential, or authorization value must be read, compared, printed, or derived. |
| Execution command boundary | Any future command is PM/operator-controlled, separately authorized, server-only, and outside this reference file. | Block if this file is treated as a runbook command list. |
| Promotion lock | Runtime remains `publicDataSource=mock`; scoring remains `scoreSource=mock`; no public/real promotion is granted by rehearsal readiness. | Block if rehearsal is used as source promotion or real scoring approval. |

Passing these prerequisites only means PM may continue gate review. It does not mean a rehearsal, dry run, write attempt, readback, rollback, promotion, or scoring action has occurred.

## Aggregate Readback Prerequisites

Any later PM-authorized execution rehearsal must have an aggregate-only readback contract ready before the attempt begins.

| Prerequisite | Required reference-only state | Gap posture |
| --- | --- | --- |
| Readback mode | Readback output is aggregate-only and excludes row bodies, raw payloads, stock-id payloads, source values, per-date values, SQL text, and secrets. | Block if row-level inspection is required. |
| Count fields | Contract defines allowed aggregate counts such as attempted, inserted, duplicate, rejected, skipped, already-existing, missing, and readback count summaries. | Block if count vocabulary is undefined or can expose row identity. |
| Scope consistency | Readback scope matches the same target lane, target table, target scope, and max-row boundary used by execution authorization. | Block if readback expands scope or becomes launch readiness evidence. |
| Error sanitization | Errors are represented by sanitized categories/codes only, without query text, payload snippets, credentials, dashboard links, or source response bodies. | Block if raw error output is required. |
| Ownership | PM/operator owns any later readback action; A1 provides prerequisite shape only. | Block if A1 is asked to connect, query, or verify live data. |

Aggregate readback readiness is not readback proof. It cannot be used to award row coverage, close launch readiness, promote `publicDataSource=supabase`, or enable `scoreSource=real`.

## Rollback Readiness Prerequisites

Rollback readiness must be established before any later PM-authorized rehearsal attempt, but this file does not authorize rollback execution or rollback dry-run execution.

| Prerequisite | Required reference-only state | Gap posture |
| --- | --- | --- |
| Rollback owner | PM/operator has identified the owner allowed to decide whether rollback is required after a bounded attempt. | Block if ownership is unclear. |
| Trigger vocabulary | Allowed rollback trigger labels are predefined and sanitized, such as failed readback, partial mutation, duplicate conflict, scope mismatch, or sanitized execution error. | Block if rollback triggers require row payloads, raw payloads, or SQL inspection. |
| Non-destructive review path | A non-destructive review path exists before any destructive action is considered. | Block if destructive rollback is implied by rehearsal readiness. |
| Scope lock | Rollback readiness is bounded to the same authorized target lane, table, scope, and max-row limit. | Block if rollback scope can expand. |
| Evidence policy | Rollback evidence remains aggregate-only and value-hidden. | Block if rollback review requires secrets, env values, authorization values, candidate rows, or payload contents. |

Rollback readiness is a prerequisite, not a permission. Any rollback action must be separately authorized and must fail closed if it requires crossing the hard boundary.

## Operator Stop Conditions

The operator must keep the final execution rehearsal gate blocked, rejected, or repair-required if any condition below is true, requested, implied, unclear, stale, or unverifiable without crossing the hard boundary:

- SQL execution is required or requested.
- Supabase connection, Supabase read, or Supabase write is required or requested.
- Importing `@supabase/supabase-js` is required or requested.
- Env values, secret values, credential values, authorization values, switch values, or confirmation phrase values must be read, validated, printed, copied, compared, or derived.
- Raw payloads, row payloads, stock-id payloads, candidate row bodies, source payloads, source response bodies, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, or stored.
- `daily_prices` must be inserted, updated, deleted, merged, accepted, repaired, or otherwise mutated.
- Staging rows must be created, read, or treated as rehearsal evidence.
- Rehearsal scope expands beyond the PM-approved public beta data-realization target.
- Aggregate readback, post-run review, rollback review, or rollback execution is requested from this A1 file.
- Row coverage scoring, launch-readiness closure, public source switching, real scoring, or production promotion is requested.
- `publicDataSource=supabase` or `scoreSource=real` is requested, implied, unlocked, or treated as a rehearsal output.
- A PM mainline file, checker script, package file, project status file, source-gate file, existing doc, or data file would need to be edited by this A1 support task.
- Any decision value, gate state, artifact state, approval state, or owner state is missing, stale, contradictory, unknown, or cannot be verified safely.

Default operator posture: fail closed until PM resolves the blocker through the proper owner lane without expanding A1 execution scope.

## Fail-Closed Checklist

Use this checklist as PM reference input only. Checking an item here does not authorize execution.

| Check | Required safe answer |
| --- | --- |
| Document mode | `reference_only_no_execution` |
| SQL executed | `false` |
| Supabase client imported | `false` |
| Supabase connection attempted | `false` |
| Supabase read attempted | `false` |
| Supabase write attempted | `false` |
| Env or secret values read | `false` |
| Authorization or confirmation phrase values read | `false` |
| Raw payloads or row payloads read | `false` |
| Stock-id payloads read | `false` |
| Market data fetched/imported/ingested | `false` |
| `daily_prices` mutated | `false` |
| Staging rows created | `false` |
| `publicDataSource=supabase` set | `false` |
| `scoreSource=real` set | `false` |
| Existing files modified by this A1 task | `false` |
| Unknown or expanded scope behavior | `fail_closed` |
| Missing owner acceptance behavior | `fail_closed` |
| Unrecognized decision vocabulary behavior | `fail_closed` |
| Value-reading requirement behavior | `fail_closed` |
| Payload-reading requirement behavior | `fail_closed` |

If any checklist item cannot be answered safely, the final execution rehearsal gate should remain blocked or repair-required.

## Post-Run Review Prerequisites

Any later PM-authorized rehearsal must define post-run review prerequisites before the attempt starts. This file performs no post-run review.

| Prerequisite | Required reference-only state | Gap posture |
| --- | --- | --- |
| Review mode | Post-run review is aggregate-only, sanitized, and bounded to the same authorized target scope. | Block if review requires row payloads, raw payloads, stock-id payloads, or secrets. |
| Required status fields | Review contract defines allowed labels for not executed, attempted, completed, partial, failed closed, rollback required, rollback not required, and repair required. | Block if status labels are open-ended or ambiguous. |
| Mutation summary | Review allows only sanitized aggregate mutation counts and status categories. | Block if per-row or per-date values are needed. |
| Readback summary | Review includes aggregate readback count/status fields without becoming row coverage scoring or launch readiness proof. | Block if readback summary is treated as promotion approval. |
| Rollback summary | Review records rollback readiness/status as sanitized aggregate metadata only. | Block if rollback action is triggered automatically. |
| Promotion boundary | Review explicitly preserves `publicDataSource=mock` and `scoreSource=mock` unless a separate approved promotion gate exists. | Block if review result implies public/real promotion. |
| Owner signoff | PM/operator has a place to record final post-run review disposition outside this A1 reference file. | Block if A1 is asked to decide final operational disposition. |

Post-run review readiness is not evidence that a run occurred. It is also not source-rights approval, row coverage closure, data quality certification, launch readiness, rollback execution, public source promotion, or real scoring authorization.

## Reference-Only Handoff Summary

1. This file supports only the PM mainline `public beta data-realization final execution rehearsal gate`.
2. The current A1 posture is prerequisite gap summary only: reference-only, no-execution, no-secret, no-payload, and no-row-inspection.
3. Execution prerequisites must be accepted before PM can consider a rehearsal gate ready, but acceptance here does not run or authorize anything.
4. Aggregate readback, rollback readiness, and post-run review must be prepared before any later PM/operator-controlled attempt.
5. All unknown, stale, expanded-scope, value-reading, payload-reading, SQL, Supabase, market-data, `daily_prices`, staging, source-promotion, or real-scoring conditions fail closed.
