# CEO / Chairman Batch 1 Bounded Readonly Operator Decision

Status: `ceo_chairman_batch1_bounded_readonly_operator_decision_named_not_executed`

Date: 2026-06-12

Decision owner: CEO under chairman-delegated authority

Execution owner if later authorized: PM mainline

## 1. Named Decision

CEO/Chairman explicitly names exactly one future bounded readonly attempt:

`batch1_row_coverage_bounded_readonly_once`

Purpose:

> Run exactly one guarded readonly aggregate row-coverage attempt, only after same-slice local prechecks pass, to observe sanitized aggregate readiness for Batch 1 / row-coverage evidence without exposing row payloads, raw market payloads, protected identifiers, secrets, SQL text, or real decision values.

This decision names the attempt and prepares the operator boundary. It does not execute the attempt in this slice.

## 2. Execution Command Preview

Package command:

```powershell
npm run run:row-coverage-readonly
```

Guarded direct command preview:

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION="CP3_ROW_COVERAGE_READONLY_VALIDATE"; & 'C:\Program Files\nodejs\node.exe' scripts\run-row-coverage-readonly-once.mjs
```

Confirmation token:

```text
CP3_ROW_COVERAGE_READONLY_VALIDATE
```

Command drift policy:

Any command drift stops execution.

Attempt limit:

Exactly one attempt. No retry in the same slice.

## 3. Immediate Local Prechecks Required Before Any Remote Access

These must pass in the same execution slice before the guarded runner is allowed:

```powershell
node scripts/check-row-coverage-contract.mjs
node scripts/check-row-coverage-readonly-validation-contract.mjs
node scripts/check-row-coverage-readonly-local-preflight.mjs
node scripts/check-row-coverage-readonly-guarded-runner.mjs
node scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs
node scripts/check-review-gates.mjs
node node_modules/typescript/bin/tsc --noEmit
```

Current local status from this decision slice:

- `report:row-coverage-readonly-preexecution-packet`: `ready_to_present_not_execute`
- `report:bounded-row-coverage-readonly-attempt-decision`: `ready_for_explicit_one_attempt_decision`
- `report-data-goal-execution-review-bridge`: `ready_for_explicit_authorized_one_attempt_flow`
- `check:row-coverage-readonly-local-preflight`: `ok`

## 4. Allowed Sanitized Output

Only these aggregate fields may be recorded:

- attempt status
- aggregate coverage status
- observed total row count
- expected total row count
- missing row count
- sanitized blocker reason
- remoteAttempted boolean
- safety flags

The output may not include:

- Supabase URL
- service role key
- anon key
- auth headers
- env values
- SQL text
- raw row payloads
- `stock_id` values
- raw market data
- provider payloads
- exact market values
- candidate row bodies

## 5. Runtime And Promotion Boundary

This operator decision preserves:

- `publicDataSource=mock`
- `scoreSource=mock`
- `sqlExecuted=false` for this decision slice
- `connectionAttempted=false` for this decision slice
- `supabaseWritesEnabled=false`
- `dailyPricesMutated=false`
- `rowPayloadsPrinted=false`
- `secretsPrinted=false`

Even if a later attempt succeeds, it does not by itself authorize:

- row coverage points
- data-quality score lift
- source-rights closure
- public data source promotion
- `publicDataSource=supabase`
- `scoreSource=real`
- write/backfill work
- public real-data claim

## 6. Post-Run Review Requirement

If PM later executes the named attempt, PM must immediately record a sanitized post-run review before any readiness, row coverage, source, score, runtime, write, or promotion decision.

Post-run decision map:

| Output category | Next decision |
| --- | --- |
| `ok` | Record sanitized post-run review; keep runtime mock; evaluate data-quality evidence separately. |
| `blocked` | Record sanitized post-run review; repair blocker; do not retry in the same slice. |
| `preflight_blocked` | Stop before remote connection; repair local preflight or environment; do not mutate secrets or database. |

## 7. PM Decision

Decision: `accepted_operator_decision_named_not_executed`

PM may proceed to the next slice only as one of two paths:

1. **Execution path:** explicitly run the named single bounded readonly attempt with immediate prechecks and post-run review.
2. **Non-execution path:** continue local public copy cleanup, source-rights closure, field contract closure, or readiness UI work.

This document closes the naming gap only. It is not proof that a remote attempt occurred.

