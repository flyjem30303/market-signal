# A1 TWII Final Runtime Execution Gate Inputs

Status: `a1_twii_final_runtime_execution_gate_inputs_ready_reference_only`

Date: 2026-06-11

Owner lane: A1 Runtime / Data Execution Support

Purpose: no-secret/reference-only input consolidation for the PM mainline `TWII final runtime execution gate preflight` after bounded one-attempt execution review. This file lists only safe gate inputs and checklist requirements. It does not authorize execution.

This A1 document does not read env values, read phrase values, read candidate rows, connect to Supabase, import `@supabase/supabase-js`, execute SQL, create staging rows, write `daily_prices`, accept rows, perform row coverage scoring, fetch market data, import market data, ingest market data, output secrets, output env values, output raw payloads, output row payloads, output stock-id payloads, change `publicDataSource`, change `scoreSource`, or edit any PM mainline gate/checker/status/board/package file.

Explicit boundary: this file does not read env values, does not read the phrase value, does not read candidate rows, does not connect to Supabase, and does not write `daily_prices`.

## Fixed Gate Inputs

| Field | Required safe input |
| --- | --- |
| `sourceExecutionReviewGatePath` | `data/source-gates/twii-bounded-one-attempt-execution-review-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `candidateArtifactPath` | `data/candidates/twii-sanitized-candidate.json` |
| `candidateArtifactPolicy` | `reference_only_no_candidate_rows_read` |
| `requiredExecuteSwitchName` | `TWII_ONE_ATTEMPT_EXECUTE` |
| `requiredConfirmationPhraseName` | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |
| `requiredConfirmationPhraseReference` | `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` |
| `gateMode` | `final_runtime_execution_gate_preflight_no_execution` |
| `defaultDecision` | `rejected` |
| `defaultBehavior` | `fail_closed_until_operator_review_accepts_current_inputs` |

The candidate artifact path is reference-only. The final runtime execution gate may name `data/candidates/twii-sanitized-candidate.json`, but this A1 file must not read, print, copy, transform, validate, accept, or regenerate candidate rows or row payloads.

## Runtime Decision Vocabulary

The final runtime execution gate preflight may use only these runtime decision values:

| Decision value | Meaning for this gate |
| --- | --- |
| `ready_for_final_operator_review` | The bounded one-attempt execution review reference and fixed gate inputs are ready for PM/operator review, without exposing secrets, env values, phrase values, candidate rows, or row payloads. |
| `rejected` | The final runtime execution gate is denied or defaults closed. No execution may proceed. |
| `repair_required` | One or more required references, locks, or checklist items are incomplete or inconsistent and must be repaired before a later review. |
| `expired_or_not_current` | The execution review gate, candidate artifact reference, execute-switch requirement, confirmation phrase reference, or decision context is stale and must be refreshed before any later review. |

No other runtime decision vocabulary is introduced by this A1 file. Any unknown decision value must fail closed.

## Required Reference Chain

| Required reference | Safe use |
| --- | --- |
| `data/source-gates/twii-bounded-one-attempt-execution-review-preflight.json` | Source execution review gate path for PM final runtime execution gate preflight only. |
| `data/candidates/twii-sanitized-candidate.json` | Candidate artifact path reference only; no candidate rows may be read or accepted. |
| `TWII_ONE_ATTEMPT_EXECUTE` | Execute switch requirement name only; do not read or output its value. |
| `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` | Confirmation phrase requirement name only; do not read or output its value. |
| `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` | Confirmation phrase reference label only; do not read, derive, compare, or print the actual phrase value. |

This document must not request, read, print, store, derive, validate, or compare the execute switch value or confirmation phrase value. It must not read `.env`, process env, credential files, local secrets, Supabase URLs, Supabase keys, dashboard links, or credential-derived strings.

## Required Checklist For PM Mainline Gate

These items remain requirements for the future PM/operator-controlled final runtime execution gate. They are not executed by this A1 file:

| Requirement | Gate expectation | Executed by this file |
| --- | --- | --- |
| Server-only boundary | Any future runtime action must remain server-only and must not expose credentials, env values, phrase values, row payloads, raw payloads, stock-id payloads, or Supabase details to client/public surfaces. | `false` |
| Fail-closed default | Missing, stale, expanded-scope, unknown-vocabulary, value-reading, row-reading, or secret-reading conditions must default to `rejected` or `repair_required`. | `false` |
| Post-run review | Any later authorized execution attempt must require an immediate aggregate-only post-run review. | `false` |
| Aggregate readback | Any later authorized execution attempt must require aggregate readback only, with no row payloads, no raw payloads, no stock-id payloads, and no secrets. | `false` |
| Rollback readiness | Any later authorized execution attempt must preserve rollback readiness as a prerequisite, without authorizing destructive rollback from this file. | `false` |

The checklist above is input guidance only. It is not a run result, not post-run evidence, not readback proof, not rollback execution, not row coverage evidence, and not launch readiness.

## Scope Locks

The final runtime execution gate preflight must remain bounded to:

- `targetTable=daily_prices`
- `targetLane=TWII`
- `targetScope=twii_index_daily_prices_missing_rows`
- `maxRows=60`
- `candidateArtifactPath=data/candidates/twii-sanitized-candidate.json` as reference-only

It must not expand to ETFs, Taiwan equity symbols, other index lanes, unrelated `daily_prices` ranges, staging tables, source promotion, public data source switching, real scoring, row coverage scoring, launch readiness, rollback execution, or post-run review execution.

## Required Safety Flags

The final runtime execution gate preflight should preserve these fail-closed booleans:

- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
- `marketDataFetched=false`
- `marketDataImported=false`
- `marketDataIngested=false`
- `dailyPricesMutated=false`
- `stagingRowsCreated=false`
- `candidateRowsAccepted=false`
- `candidateArtifactReferenceOnly=true`
- `candidateArtifactRowsRead=false`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `credentialValuesRead=false`
- `envValueOutput=false`
- `sourcePayloadRead=false`
- `rawPayloadRead=false`
- `rowPayloadRead=false`
- `stockIdPayloadOutput=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `secretsOutput=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`
- `finalRuntimeExecutionAllowedNow=false`
- `promotionAllowed=false`
- `rowCoverageScoringAllowed=false`
- `publicDataSource=mock`
- `scoreSource=mock`
- `publicDataSourceSupabaseAllowed=false`
- `scoreSourceRealAllowed=false`

## Hard Stop-Lines

Stop and keep the gate blocked if any next step requires or produces:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- `@supabase/supabase-js` import;
- credential presence check execution;
- credential value read;
- env value read or output;
- execute switch value read or output;
- confirmation phrase value read or output;
- secret output;
- raw payload read or output;
- row payload read or output;
- stock-id payload read or output;
- candidate row read;
- candidate row acceptance;
- candidate row generation from source data;
- market-data fetch;
- market-data import;
- market-data ingestion;
- staging row creation;
- `daily_prices` mutation;
- accepting rows;
- rollback execution;
- destructive rollback authorization;
- aggregate readback execution from this A1 file;
- post-run review execution from this A1 file;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim;
- PM mainline gate/checker/status/board/package file edits from this A1 support task.

## Prohibited Output Fields

The final runtime execution gate preflight, A1 handoff, or checklist must not include:

- raw source payloads;
- source response bodies;
- raw market values;
- full row bodies;
- candidate row payloads;
- row-level `daily_prices` payloads;
- stock-id payloads;
- trade-date lists;
- per-date market values;
- source values;
- env values;
- credential values;
- phrase values;
- execute switch values;
- secret names paired with values;
- credential-derived URLs;
- private dashboard links;
- copied source terms text;
- SQL text;
- SQL query results;
- Supabase connection strings;
- Supabase access tokens;
- Supabase project identifiers derived from credentials;
- source URLs containing tokens or credentials.

## Ready-To-Hand-Off Summary

1. Source execution review gate path is `data/source-gates/twii-bounded-one-attempt-execution-review-preflight.json`.
2. Fixed target inputs are `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
3. Candidate artifact path is `data/candidates/twii-sanitized-candidate.json` and is reference-only.
4. Required authorization references are `TWII_ONE_ATTEMPT_EXECUTE`, `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE`, and `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A`.
5. Runtime decision vocabulary is limited to `ready_for_final_operator_review`, `rejected`, `repair_required`, and `expired_or_not_current`.
6. Server-only boundary, fail-closed default, post-run review, aggregate readback, and rollback readiness remain requirements, not completed actions.
7. This A1 file does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, read secrets/env values/phrase values/candidate rows, write `daily_prices`, accept rows, score row coverage, fetch/import market data, create staging rows, or modify PM mainline files.
