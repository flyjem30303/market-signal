# A1 TWII Post-Run Review Contract Inputs

Status: `a1_twii_post_run_review_contract_inputs_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only input consolidation for the next PM mainline `TWII post-run review contract preflight`. This document provides safe contract inputs only. It does not execute SQL, connect to Supabase, write Supabase, read Supabase, mutate `daily_prices`, fetch market data, import market data, ingest market data, read candidate rows, output raw payloads, output row payloads, output stock-id payloads, output secrets, set `publicDataSource=supabase`, or set `scoreSource=real`.

This file is not an execution packet, authorization packet, credential gate, execute-switch gate, run result, readback proof, rollback execution, row coverage scoring gate, promotion gate, or public launch readiness claim.

## Fixed Contract Inputs

| Field | Required safe input |
| --- | --- |
| `sourceGatePath` | `data/source-gates/twii-aggregate-readback-contract-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `contractMode` | `post_run_review_contract_preflight_no_execution` |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads` |
| `runtimeBoundary` | `publicDataSource=mock` |
| `scoringBoundary` | `scoreSource=mock` |

The post-run review contract scope must stay limited to the TWII index daily price missing-row lane. It must not expand to ETFs, Taiwan equity symbols, other index lanes, staging tables, unrelated `daily_prices` ranges, row coverage scoring, source promotion, public source switching, or real scoring.

## Source Gate Reference

| Reference | Safe use |
| --- | --- |
| `data/source-gates/twii-aggregate-readback-contract-preflight.json` | Source gate path for PM post-run review contract preflight input review only. |

The source gate path is a reference input. This A1 document does not edit it, execute it, validate credentials, import a Supabase client, connect to Supabase, or advance any PM mainline gate/checker/status/board/package file.

## Review Outcome Allowed Values

The next PM post-run review contract preflight may allow only these outcome values:

- `accepted`
- `rejected`
- `blocked`
- `failed_closed`
- `not_executed`

Any other outcome label should fail closed until PM explicitly repairs the contract. `accepted` means the aggregate-only post-run review contract shape is accepted for review; it does not mean a run occurred, rows were written, readback was performed, promotion was granted, or real scoring was enabled.

## Aggregate-Only Mutation Summary Fields

The post-run review contract may allow only sanitized mutation counts and status fields:

- `attemptId`
- `authorizationId`
- `postRunReviewId`
- `sourceGatePath`
- `targetTable`
- `targetLane`
- `targetScope`
- `maxRows`
- `reviewOutcome`
- `mutationAttempted`
- `attemptedRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `alreadyExistingRows`
- `missingCandidateRows`
- `skippedRows`
- `mutationStatus`
- `sanitizedErrorCode`
- `sanitizedErrorCategory`

Mutation summary output must stay aggregate-only. It must not expose row bodies, trade-date lists, per-date values, source values, candidate row payloads, raw market payloads, stock-id payloads, credential-derived URLs, private dashboard links, copied source terms text, SQL text, or secrets.

## Aggregate-Only Readback Summary Fields

The post-run review contract may allow only sanitized readback counts and status fields:

- `readbackStatus`
- `readbackAttempted`
- `readbackRows`
- `expectedMaxRows`
- `readbackMatchedExpectedCount`
- `readbackCountWithinMaxRows`
- `readbackScopeLocked`
- `readbackNoRowPayload`
- `readbackNoRawPayload`
- `readbackNoStockIdPayload`
- `readbackNoSecrets`
- `sanitizedReadbackErrorCode`
- `sanitizedReadbackErrorCategory`

Readback summary output must not become row coverage evidence, public launch readiness, source promotion evidence, `daily_prices` mutation approval, or `scoreSource=real` approval.

## Rollback Readiness Fields

The post-run review contract should preserve these rollback readiness inputs before any future execution can be considered complete:

| Field | Required safe input |
| --- | --- |
| `rollbackDryRunRequired` | `true` |
| `rollbackDryRunStatus` | Aggregate status only; no rollback execution implied. |
| `rollbackReady` | Aggregate boolean only. |
| `rollbackScope` | `twii_index_daily_prices_missing_rows` |
| `rollbackTargetTable` | `daily_prices` |
| `rollbackTargetLane` | `TWII` |
| `rollbackMaxRows` | `60` or lower |
| `rollbackOutputPolicy` | Aggregate-only counts and status. |
| `rollbackScopeStatus` | `in_scope`, `blocked`, or `repair_required` |
| `rollbackStopLineResult` | Stop if scope expands, max rows exceed 60, row payload output is required, raw payload output is required, or destructive action is requested without a separate explicit PM gate. |
| `destructiveRollbackAllowed` | `false` |

Rollback readiness is a prerequisite contract input only. It does not authorize deletion, update, truncate, destructive cleanup, SQL, Supabase connection, Supabase read, Supabase write, or `daily_prices` mutation.

## Promotion Lock Fields

The post-run review contract must carry explicit locks:

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

A passing post-run review contract preflight must not switch runtime data source, enable real scoring, grant row coverage points, close launch readiness, or promote TWII evidence to public production use.

## Required Safety Flags

The contract should preserve these fail-closed booleans:

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
- `candidateArtifactRowsRead=false`
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

## Prohibited Fields

The post-run review contract, review output, or handoff must not include:

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

1. Source gate path is `data/source-gates/twii-aggregate-readback-contract-preflight.json`.
2. Fixed inputs are `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
3. Allowed review outcomes are `accepted`, `rejected`, `blocked`, `failed_closed`, and `not_executed`.
4. Mutation and readback summaries are aggregate-only and must not expose row, raw, stock-id, secret, source, or credential payloads.
5. Rollback readiness must be aggregate-only and non-destructive unless a later explicit PM gate changes that boundary.
6. Promotion remains locked: `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, and `scoreSource=mock`.
7. This A1 file does not modify PM mainline gate/checker/status/board/package files and does not authorize execution.
