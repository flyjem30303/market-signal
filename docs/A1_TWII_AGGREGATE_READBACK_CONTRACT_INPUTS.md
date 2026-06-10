# A1 TWII Aggregate Readback Contract Inputs

Status: `a1_twii_aggregate_readback_contract_inputs_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only input consolidation for the next PM mainline `TWII aggregate readback contract preflight`. This document provides safe contract inputs only. It does not execute SQL, connect to Supabase, write Supabase, read Supabase, mutate `daily_prices`, fetch market data, ingest market data, read candidate rows, output raw payloads, output row payloads, output stock-id payloads, output secrets, set `publicDataSource=supabase`, or set `scoreSource=real`.

This file is not an execution packet, authorization packet, credential gate, execute-switch gate, readback proof, post-run review, rollback execution, row coverage scoring gate, promotion gate, or public launch readiness claim.

## Fixed Contract Inputs

| Field | Required safe input |
| --- | --- |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `contractMode` | `aggregate_readback_contract_preflight_no_execution` |
| `insertModeContext` | `missing_only` |
| `duplicatePolicyContext` | `reject_duplicates` |
| `runtimeBoundary` | `publicDataSource=mock` |
| `scoringBoundary` | `scoreSource=mock` |

The readback preflight scope must stay limited to the TWII index daily price missing-row lane. It must not expand to ETFs, Taiwan equity symbols, other index lanes, staging tables, unrelated `daily_prices` ranges, row coverage scoring, source promotion, or real scoring.

## Source Gate Reference

| Reference | Safe use |
| --- | --- |
| `data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json` | Source gate path for PM readback contract preflight input review only. |

The source gate path is a reference input. This A1 document does not edit it, execute it, validate credentials, import a Supabase client, connect to Supabase, or advance any PM mainline gate/checker/status/board/package file.

## Candidate Path Reference-Only

| Reference | Safe use |
| --- | --- |
| `data/candidates/twii-sanitized-candidate.json` | Candidate artifact path reference only. |

Candidate artifact use is reference-only for this preflight. The readback contract must not require reading, printing, copying, validating, accepting, or transforming candidate rows. Safe references may name the candidate path and aggregate identifiers already accepted for review, but must not expose trade-date lists, source values, row bodies, raw market payloads, stock-id payloads, or credential-bearing URLs.

Required candidate safety flags:

- `candidateArtifactReferenceOnly=true`
- `candidateArtifactRowsRead=false`
- `candidateRowsAccepted=false`
- `rowPayloadRead=false`
- `rawPayloadRead=false`
- `sourcePayloadRead=false`
- `stockIdPayloadOutput=false`
- `secretsOutput=false`

## Readback Aggregate-Only Fields

The next PM readback contract preflight may allow only sanitized aggregate fields:

- `attemptId`
- `authorizationId`
- `readbackContractId`
- `targetTable`
- `targetLane`
- `targetScope`
- `maxRows`
- `candidateArtifactPath`
- `candidateArtifactReferenceOnly`
- `expectedMaxRows`
- `preflightStatus`
- `readbackStatus`
- `candidateRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `alreadyExistingRows`
- `missingCandidateRows`
- `readbackRows`
- `readbackMatchedExpectedCount`
- `rollbackReady`
- `rollbackScopeStatus`
- `sanitizedErrorCode`
- `sanitizedErrorCategory`
- `promotionAllowed`
- `rowCoverageScoringAllowed`
- `publicDataSource`
- `scoreSource`

Readback output must remain aggregate-only. A passing aggregate readback contract preflight must not become row coverage evidence, public launch readiness, source promotion, `daily_prices` mutation approval, or `scoreSource=real` approval.

## Post-Run Review Aggregate Fields

If a later PM gate separately authorizes a run, the immediate post-run review should allow only these aggregate field groups:

| Field group | Required aggregate-only fields |
| --- | --- |
| Run identity | `attemptId`, `authorizationId`, `readbackContractId`, runner reference, post-run review path |
| Scope | `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, `targetTable=daily_prices`, `maxRows=60` |
| Gate references | source gate path, candidate artifact path reference-only, accepted preflight id |
| Execution outcome | not executed, accepted, blocked, failed closed, or review required |
| Mutation summary | attempted, inserted, duplicate, rejected, already-existing, missing-candidate counts only |
| Readback summary | readback status, readback count, expected max rows, matched expected count boolean |
| Rollback summary | rollback dry-run required, rollback ready, rollback scope status, rollback stop-line result |
| Safety flags | SQL executed, Supabase client imported, Supabase connection attempted, Supabase reads enabled, Supabase writes enabled, market data fetched, market data ingested, raw payload output, row payload output, stock-id payload output, secrets output |
| Promotion locks | `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, `scoreSource=mock` |
| Follow-up route | accept aggregate review, repair readback contract, repair bounded insert contract, or keep blocked |

The post-run review must not include source response bodies, source values, row values, per-date market values, full candidate rows, credential-derived URLs, copied source terms text, private dashboard links, secrets, or stock-id payloads.

## Rollback Readiness Fields

The readback preflight should preserve these rollback readiness inputs before any future execution can be considered:

| Field | Required safe input |
| --- | --- |
| `rollbackDryRunRequired` | `true` |
| `rollbackReady` | Aggregate boolean only; no rollback execution implied. |
| `rollbackScope` | `twii_index_daily_prices_missing_rows` |
| `rollbackTargetTable` | `daily_prices` |
| `rollbackTargetLane` | `TWII` |
| `rollbackMaxRows` | `60` or lower |
| `rollbackOutputPolicy` | Aggregate-only counts and status. |
| `rollbackScopeStatus` | in-scope, blocked, or repair required |
| `rollbackStopLine` | Stop if scope expands, max rows exceed 60, row payload output is required, raw payload output is required, or destructive action is requested without a separate explicit PM gate. |
| `destructiveRollbackAllowed` | `false` |

Rollback readiness is a prerequisite contract input only. It does not authorize deletion, update, truncate, destructive cleanup, SQL, Supabase connection, Supabase write, or `daily_prices` mutation.

## Prohibited Fields

The readback contract, post-run review, or handoff must not include:

- raw source payloads;
- source response bodies;
- raw market values;
- full row bodies;
- candidate row payloads;
- row-level `daily_prices` payloads;
- stock-id payloads;
- trade-date lists;
- per-date market values;
- credential values;
- secret names paired with values;
- credential-derived URLs;
- private dashboard links;
- copied source terms text;
- SQL text;
- Supabase connection strings;
- Supabase access tokens;
- source URLs containing tokens or credentials.

## Stop-Lines

Stop and keep the preflight blocked if any next step requires or produces:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import for execution;
- credential presence check execution;
- credential value read;
- secret output;
- raw payload read or output;
- row payload read or output;
- stock-id payload read or output;
- candidate row acceptance;
- candidate row generation from source data;
- market-data fetch;
- market-data import;
- market-data ingestion;
- staging row creation;
- `daily_prices` mutation;
- rollback execution;
- destructive rollback authorization;
- aggregate readback execution without a separate accepted PM gate;
- post-run review execution without a separate accepted PM gate;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim;
- PM mainline gate/checker/status/board/package file edits from this A1 local-only task.

## Ready-To-Hand-Off Summary

1. Fixed inputs are `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
2. Source gate path is `data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json`.
3. Candidate path is reference-only: `data/candidates/twii-sanitized-candidate.json`.
4. Readback and post-run review fields are aggregate-only and must not expose row, raw, stock-id, secret, or source payloads.
5. Rollback readiness must be aggregate-only and non-destructive unless a later explicit PM gate changes that boundary.
6. Runtime and scoring remain locked to `publicDataSource=mock` and `scoreSource=mock`.
7. This A1 file does not modify PM mainline gate/checker/status/board/package files and does not authorize execution.
