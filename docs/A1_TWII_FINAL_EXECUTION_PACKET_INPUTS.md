# A1 TWII Final Execution Packet Inputs

Status: `a1_twii_final_execution_packet_inputs_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only input consolidation for the next PM mainline `TWII final execution packet preflight`. This document provides safe packet inputs only. It does not execute SQL, connect to Supabase, write Supabase, read Supabase, mutate `daily_prices`, fetch market data, import market data, ingest market data, read candidate rows, output raw payloads, output row payloads, output stock-id payloads, output secrets, set `publicDataSource=supabase`, or set `scoreSource=real`.

This file is not an execution packet, authorization packet, credential gate, execute-switch gate, write gate, rollback execution, rollback dry run, readback proof, post-run review, row coverage scoring gate, promotion gate, or public launch readiness claim.

## Fixed Packet Inputs

| Field | Required safe input |
| --- | --- |
| `sourceGatePath` | `data/source-gates/twii-rollback-readiness-contract-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `packetMode` | `final_execution_packet_preflight_no_execution` |
| `candidateInputPolicy` | `reference_only_no_candidate_rows_read` |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads` |
| `runtimeBoundary` | `publicDataSource=mock` |
| `scoringBoundary` | `scoreSource=mock` |

The final execution packet preflight scope must stay limited to TWII index daily price missing rows. It must not expand to ETFs, Taiwan equity symbols, other index lanes, staging tables, unrelated `daily_prices` ranges, row coverage scoring, source promotion, public source switching, or real scoring.

## Required Preflight Gates

The PM mainline should treat the final execution packet preflight as incomplete unless these prerequisite gates are separately present and accepted:

| Gate | Required state |
| --- | --- |
| `twii-source-rights-outcome-gate` | Accepted or explicitly allowed for this TWII lane without raw/source payload disclosure. |
| `twii-field-contract-gate` | Accepted for `twii-v1` / `daily_prices` mapping. |
| `twii-candidate-artifact-readiness-gate` | Accepted as sanitized aggregate-only and candidate reference-only for downstream packets. |
| `twii-credential-presence-shape-checker` | Accepted as shape-only; no credential values printed or read into this A1 document. |
| `twii-execute-switch-confirmation-preflight` | Accepted as requirement-name shape only. |
| `twii-bounded-insert-missing-only-contract-preflight` | Accepted for missing-only, skip-existing, reject-duplicates, and `maxRows=60`. |
| `twii-aggregate-readback-contract-preflight` | Accepted as aggregate-only readback contract; no readback execution from this document. |
| `twii-post-run-review-contract-preflight` | Accepted as aggregate-only post-run review contract; no post-run review execution from this document. |
| `twii-rollback-readiness-contract-preflight` | Accepted as aggregate-only rollback readiness contract; no rollback execution from this document. |

The source gate path for this A1 input packet is the rollback readiness preflight gate only:

- `data/source-gates/twii-rollback-readiness-contract-preflight.json`

This A1 file does not edit that gate, execute it, validate credentials, import a Supabase client, connect to Supabase, or advance any PM mainline gate/checker/status/board/package file.

## Execute Switch And Confirmation Requirements

The final execution packet preflight may name only the requirement names. It must not print, store, request, derive, or validate requirement values in this document.

| Requirement | Name only |
| --- | --- |
| Execute switch requirement | `TWII_ONE_ATTEMPT_EXECUTE` |
| Confirmation phrase requirement | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |

The confirmation phrase value, switch value, credential values, secret values, and any credential-derived URL are intentionally excluded. PM must keep value handling outside this local-only A1 input document and outside repo reports.

## Candidate Artifact Reference-Only

| Reference | Safe use |
| --- | --- |
| `data/candidates/twii-sanitized-candidate.json` | Candidate artifact path reference only. |

Candidate artifact use is reference-only for final packet preflight. The packet must not require reading, printing, copying, validating, accepting, transforming, or regenerating candidate rows from this A1 task.

Required candidate safety flags:

- `candidateArtifactReferenceOnly=true`
- `candidateArtifactRowsRead=false`
- `candidateRowsAccepted=false`
- `sourcePayloadRead=false`
- `rawPayloadRead=false`
- `rowPayloadRead=false`
- `stockIdPayloadRead=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `stockIdPayloadOutput=false`
- `secretsOutput=false`

Safe final packet references may name the candidate path and aggregate identifiers already accepted by prior gates, but must not expose trade-date lists, per-date values, source values, row bodies, raw market payloads, stock-id payloads, source URLs containing tokens, or credential-bearing links.

## Aggregate-Only Post-Run Review Contract

If a later PM gate separately authorizes an execution attempt, the post-run review contract must remain aggregate-only and may include only these field groups:

| Field group | Required aggregate-only content |
| --- | --- |
| Run identity | `attemptId`, `authorizationId`, runner reference, post-run review path |
| Scope | `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, `targetTable=daily_prices`, `maxRows=60` |
| Gate references | accepted final packet id, source gate path, candidate artifact path reference-only |
| Execution outcome | not executed, accepted, blocked, failed closed, or review required |
| Mutation summary | attempted, inserted, rejected, duplicate, missing-candidate, already-existing counts only |
| Rollback summary | rollback readiness state, rollback dry-run requirement, rollback scope status, rollback stop-line result |
| Readback summary | aggregate readback status, expected max rows, readback count, matched expected count boolean |
| Safety flags | SQL executed, Supabase client imported, Supabase connection attempted, Supabase writes enabled, market data fetched, market data ingested, raw payload output, row payload output, stock-id payload output, secrets output |
| Promotion locks | `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, `scoreSource=mock` |

The post-run review must not include source response bodies, source values, row values, per-date market values, full candidate rows, credential-derived URLs, copied source terms text, private dashboard links, SQL text, SQL query results, secrets, or stock-id payloads.

## Aggregate-Only Rollback Contract

Rollback readiness remains a prerequisite contract input only. It does not authorize rollback execution, destructive cleanup, deletion, update, truncate, SQL, Supabase connection, Supabase write, or `daily_prices` mutation.

| Field | Required safe input |
| --- | --- |
| `rollbackScopeLocked` | `true` |
| `rollbackScope` | `twii_index_daily_prices_missing_rows` |
| `rollbackTargetTable` | `daily_prices` |
| `rollbackTargetLane` | `TWII` |
| `rollbackMaxRows` | `60` or lower |
| `rollbackDryRunRequired` | `true` |
| `rollbackRequiresSeparateExecutionGate` | `true` |
| `destructiveRollbackAllowed` | `false` |
| `rollbackOutputPolicy` | Aggregate-only counts and status. |

Rollback contract output must not include rollback key lists, rollback row identifiers, deletion predicates, update predicates, row bodies, trade-date lists, source values, credential-derived URLs, SQL text, SQL query results, or private dashboard links.

## Aggregate-Only Readback Contract

The final packet should preserve the readback contract as a separate aggregate-only post-run proof. It must not execute readback from this A1 document.

Allowed aggregate readback fields:

- `attemptId`
- `authorizationId`
- `targetTable`
- `targetLane`
- `targetScope`
- `maxRows`
- `candidateArtifactPath`
- `candidateArtifactReferenceOnly`
- `expectedMaxRows`
- `candidateRows`
- `attemptedRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `alreadyExistingRows`
- `missingCandidateRows`
- `readbackRows`
- `readbackStatus`
- `readbackMatchedExpectedCount`
- `rollbackReady`
- `rollbackScopeStatus`
- `sanitizedErrorCode`
- `sanitizedErrorCategory`
- `promotionAllowed`
- `rowCoverageScoringAllowed`
- `publicDataSource`
- `scoreSource`

A passing aggregate readback contract does not award row coverage points, prove public launch readiness, approve source promotion, mutate `daily_prices`, or approve `scoreSource=real`.

## Promotion Locks

The final execution packet preflight must preserve these locks:

| Field | Required value |
| --- | --- |
| `promotionAllowed` | `false` |
| `publicPromotionAllowed` | `false` |
| `rowCoverageScoringAllowed` | `false` |
| `rowCoveragePointAwarded` | `false` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |
| `publicDataSourceSupabaseAllowed` | `false` |
| `scoreSourceRealAllowed` | `false` |
| `launchReadinessClaimAllowed` | `false` |

Accepting a final execution packet preflight shape must not switch runtime data source, enable real scoring, grant row coverage points, close launch readiness, promote TWII evidence to public production use, or approve `daily_prices` mutation outside a later explicit PM execution gate.

## Stop-Lines

Stop and keep the final execution packet preflight blocked if any next step requires or produces:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import for execution;
- credential presence check execution from this A1 task;
- credential value read;
- execute switch value output;
- confirmation phrase value output;
- secret output;
- raw payload read or output;
- row payload read or output;
- stock-id payload read or output;
- candidate row reading;
- candidate row acceptance;
- candidate row generation from source data;
- market-data fetch;
- market-data import;
- market-data ingestion;
- staging row creation;
- `daily_prices` mutation;
- rollback execution;
- rollback dry-run execution;
- destructive rollback authorization;
- deletion predicate output;
- update predicate output;
- rollback key list output;
- rollback row identifier output;
- aggregate readback execution without a separate accepted PM gate;
- post-run review execution without a separate accepted PM gate;
- final execution attempt without a separate accepted PM gate;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim;
- PM mainline gate/checker/status/board/package file edits from this A1 local-only task.

## Ready-To-Hand-Off Summary

1. Fixed inputs are `sourceGatePath=data/source-gates/twii-rollback-readiness-contract-preflight.json`, `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
2. Required prerequisite gates are source-rights, field-contract, sanitized candidate artifact readiness, credential shape, execute-switch confirmation shape, bounded insert, aggregate readback, post-run review, and rollback readiness.
3. Execute switch and confirmation phrase are requirement names only: `TWII_ONE_ATTEMPT_EXECUTE` and `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE`.
4. Candidate artifact use is reference-only at `data/candidates/twii-sanitized-candidate.json`; candidate rows are not read or accepted here.
5. Post-run review, rollback, and readback contracts remain aggregate-only and separately gated.
6. Runtime and scoring remain locked to `publicDataSource=mock` and `scoreSource=mock`.
7. This A1 file does not modify PM mainline gate/checker/status/board/package files and does not authorize execution, SQL, Supabase access, market-data import, `daily_prices` mutation, rollback, public source promotion, or real scoring.
