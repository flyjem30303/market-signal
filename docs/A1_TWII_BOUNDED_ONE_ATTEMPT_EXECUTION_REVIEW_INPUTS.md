# A1 TWII Bounded One-Attempt Execution Review Inputs

Status: `a1_twii_bounded_one_attempt_execution_review_inputs_ready_reference_only`

Date: 2026-06-11

Owner lane: A1 Data / Execution Evidence

Purpose: no-secret/reference-only input consolidation for the PM mainline `TWII bounded one-attempt execution review preflight`. This document carries only safe review inputs from the one-attempt authorization intake into bounded one-attempt execution review. It does not authorize, perform, simulate, or validate an execution attempt.

This A1 document does not read env values, read phrase values, read candidate rows, connect to Supabase, import `@supabase/supabase-js`, execute SQL, create staging rows, write `daily_prices`, accept rows, perform row coverage scoring, fetch market data, import market data, ingest market data, output secrets, output env values, output raw payloads, output row payloads, output stock-id payloads, change `publicDataSource`, change `scoreSource`, or edit any PM mainline gate/checker/status/board/package file.

## Fixed Review Inputs

| Field | Required safe input |
| --- | --- |
| `sourceAuthorizationIntakeGatePath` | `data/source-gates/twii-one-attempt-authorization-intake-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `candidateArtifactPath` | `data/candidates/twii-sanitized-candidate.json` |
| `candidateArtifactPolicy` | `reference_only_no_candidate_rows_read` |
| `requiredExecuteSwitchName` | `TWII_ONE_ATTEMPT_EXECUTE` |
| `requiredConfirmationPhraseName` | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |
| `requiredConfirmationPhraseReference` | `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` |

The candidate artifact path is reference-only. This review input file may name `data/candidates/twii-sanitized-candidate.json`, but it must not read, print, copy, transform, validate, accept, regenerate, score, or summarize candidate rows or row payloads.

## Source Authorization Intake Reference

| Reference | Safe use |
| --- | --- |
| `data/source-gates/twii-one-attempt-authorization-intake-preflight.json` | Source authorization intake gate path for PM bounded one-attempt execution review preflight input review only. |

The source authorization intake gate path is a reference input. This A1 document does not edit it, execute it, validate credentials, import a Supabase client, connect to Supabase, evaluate env state, read confirmation phrase values, or advance any PM mainline gate/checker/status/board/package file.

## Review Decision Vocabulary

The PM mainline bounded one-attempt execution review preflight may use only these review decision values:

| Decision value | Meaning for this review |
| --- | --- |
| `ready_for_operator_review` | The reference-only input package is complete enough for a human operator review, without exposing secrets, env values, phrase values, candidate rows, row payloads, raw payloads, stock-id payloads, or Supabase state. |
| `rejected` | The bounded one-attempt execution review is denied and must not proceed to an operator-run step. |
| `repair_required` | The reference-only input package is incomplete, inconsistent, expanded beyond scope, or missing required preflight dependencies and requires bounded repair before any later decision. |
| `expired_or_not_current` | The authorization intake gate, candidate artifact reference, required switch name, required phrase reference, or review context is no longer current. |

No other decision vocabulary is introduced by this A1 file.

## Required No-Secret Requirement References

The execution review may name requirement names and the fixed confirmation phrase reference only:

| Requirement | Allowed reference |
| --- | --- |
| Execute switch requirement name | `TWII_ONE_ATTEMPT_EXECUTE` |
| Confirmation phrase requirement name | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |
| Confirmation phrase reference label | `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` |

This document must not request, read, print, store, derive, validate, or compare the execute switch value or confirmation phrase value. It must not read `.env`, process env, credential files, local secrets, Supabase URLs, Supabase keys, dashboard links, or credential-derived strings.

## Scope Lock

The bounded one-attempt execution review scope is locked to:

| Scope item | Required value |
| --- | --- |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `candidateArtifactReferenceOnly` | `true` |
| `executionAllowedByThisFile` | `false` |
| `operatorRunAllowedByThisFile` | `false` |
| `implementationAllowedByThisFile` | `false` |

The scope must not expand to ETFs, Taiwan equity symbols, other index lanes, unrelated `daily_prices` ranges, staging tables, source promotion, row coverage scoring, public source switching, real scoring, launch readiness, rollback execution, post-run review execution, or aggregate readback execution.

## Still-Required Post-Run Controls

These items remain requirements for any later separately authorized run. They are not executed, satisfied, proven, or claimed by this A1 reference-only document:

| Requirement | Current status in this file |
| --- | --- |
| Post-run review | Requirement only; not executed and not satisfied here. |
| Aggregate readback | Requirement only; not executed and not satisfied here. |
| Rollback readiness | Requirement only; not executed and not satisfied here. |

A `ready_for_operator_review` decision can only mean the bounded review input package is ready for human operator review. It must not mean rows were written, post-run review occurred, aggregate readback occurred, rollback readiness was proven, rollback dry run occurred, rollback execution was authorized, row coverage scoring was performed, or public promotion was approved.

## Required Safety Flags

The bounded one-attempt execution review preflight should preserve these fail-closed booleans:

- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
- `envValuesRead=false`
- `phraseValueRead=false`
- `candidateArtifactReferenceOnly=true`
- `candidateArtifactRowsRead=false`
- `candidateRowsAccepted=false`
- `sourcePayloadRead=false`
- `rawPayloadRead=false`
- `rowPayloadRead=false`
- `stockIdPayloadRead=false`
- `stockIdPayloadOutput=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `secretsOutput=false`
- `marketDataFetched=false`
- `marketDataImported=false`
- `marketDataIngested=false`
- `stagingRowsCreated=false`
- `dailyPricesMutated=false`
- `rowCoverageScoringAllowed=false`
- `postRunReviewExecuted=false`
- `aggregateReadbackExecuted=false`
- `rollbackReadinessExecuted=false`
- `rollbackExecuted=false`
- `publicDataSourceSupabaseAllowed=false`
- `scoreSourceRealAllowed=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`

## Prohibited Inputs and Outputs

The bounded one-attempt execution review preflight, review output, or handoff must not include:

- env values;
- confirmation phrase values;
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
- credential values;
- secret names paired with values;
- credential-derived URLs;
- private dashboard links;
- copied source terms text;
- SQL text;
- SQL query results;
- Supabase connection strings;
- Supabase access tokens;
- Supabase project identifiers derived from credentials;
- source URLs containing tokens or credentials;
- rollback row identifiers;
- rollback key lists;
- deletion predicates;
- update predicates.

## Stop-Lines

Stop and keep the preflight blocked if any next step requires or produces:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import;
- `@supabase/supabase-js` import;
- credential presence check execution;
- credential value read;
- env value read or output;
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
- PM mainline gate/checker/status/board/package file edits from this A1 reference-only task.

## Ready-To-Hand-Off Summary

1. Source authorization intake gate is `data/source-gates/twii-one-attempt-authorization-intake-preflight.json`.
2. Fixed scope is `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
3. Candidate artifact is reference-only: `data/candidates/twii-sanitized-candidate.json`.
4. Required no-secret requirement names are `TWII_ONE_ATTEMPT_EXECUTE` and `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE`.
5. Required confirmation phrase reference is `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A`.
6. Review decision vocabulary is limited to `ready_for_operator_review`, `rejected`, `repair_required`, and `expired_or_not_current`.
7. Post-run review, aggregate readback, and rollback readiness remain requirements only; they are not executed or satisfied by this file.
8. This A1 file does not read env values, read phrase values, read candidate rows, connect to Supabase, write `daily_prices`, or modify PM mainline gate/checker/status/board/package files.
