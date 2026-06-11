# A1 TWII Rollback Readiness Contract Inputs

Status: `a1_twii_rollback_readiness_contract_inputs_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only input consolidation for the next PM mainline `TWII rollback readiness contract preflight`. This document provides safe contract inputs only. It does not execute SQL, connect to Supabase, write Supabase, read Supabase, mutate `daily_prices`, fetch market data, import market data, ingest market data, read candidate rows, output raw payloads, output row payloads, output stock-id payloads, output secrets, set `publicDataSource=supabase`, or set `scoreSource=real`.

This file is not an execution packet, authorization packet, credential gate, execute-switch gate, rollback execution, rollback dry run, readback proof, post-run review, row coverage scoring gate, promotion gate, or public launch readiness claim.

## Fixed Contract Inputs

| Field | Required safe input |
| --- | --- |
| `sourceGatePath` | `data/source-gates/twii-post-run-review-contract-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `contractMode` | `rollback_readiness_contract_preflight_no_execution` |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads` |
| `runtimeBoundary` | `publicDataSource=mock` |
| `scoringBoundary` | `scoreSource=mock` |

The rollback readiness contract scope must stay limited to the TWII index daily price missing-row lane. It must not expand to ETFs, Taiwan equity symbols, other index lanes, staging tables, unrelated `daily_prices` ranges, row coverage scoring, source promotion, public source switching, or real scoring.

## Source Gate Reference

| Reference | Safe use |
| --- | --- |
| `data/source-gates/twii-post-run-review-contract-preflight.json` | Source gate path for PM rollback readiness contract preflight input review only. |

The source gate path is a reference input. This A1 document does not edit it, execute it, validate credentials, import a Supabase client, connect to Supabase, perform rollback readiness execution, or advance any PM mainline gate/checker/status/board/package file.

## Post-Run Review Dependency

Rollback readiness must depend on a separately accepted PM post-run review contract. The dependency should remain aggregate-only and should carry only these dependency checks:

- `sourceGatePath=data/source-gates/twii-post-run-review-contract-preflight.json`
- `postRunReviewDependencyRequired=true`
- `postRunReviewDependencyAccepted=true` only if PM has accepted the post-run review contract.
- `postRunReviewDependencyScopeLocked=true`
- `postRunReviewDependencyAggregateOnly=true`
- `postRunReviewDependencyNoRowPayload=true`
- `postRunReviewDependencyNoRawPayload=true`
- `postRunReviewDependencyNoStockIdPayload=true`
- `postRunReviewDependencyNoSecrets=true`

If the post-run review dependency is absent, rejected, expanded beyond scope, or requires row/raw/stock-id/secret output, the rollback readiness contract must stay blocked.

## Rollback Scope Lock

The rollback readiness preflight must carry an explicit scope lock:

| Field | Required safe input |
| --- | --- |
| `rollbackScopeLocked` | `true` |
| `rollbackScope` | `twii_index_daily_prices_missing_rows` |
| `rollbackTargetTable` | `daily_prices` |
| `rollbackTargetLane` | `TWII` |
| `rollbackMaxRows` | `60` or lower |
| `rollbackRequiresSeparateExecutionGate` | `true` |
| `destructiveRollbackAllowed` | `false` |
| `rollbackOutputPolicy` | Aggregate-only counts and status. |

Rollback scope is locked to the same target scope as the future bounded TWII attempt. It must not include unrelated `daily_prices` rows, other lanes, other symbols, staging rows, source payloads, candidate rows, credential checks, or public scoring surfaces.

## Allowed Rollback Readiness States

The next PM rollback readiness contract preflight may allow only these state values:

- `ready_for_pm_review`
- `accepted`
- `rejected`
- `blocked`
- `repair_required`
- `failed_closed`
- `not_executed`

Any other readiness state should fail closed until PM explicitly repairs the contract. `accepted` means the aggregate-only rollback readiness contract shape is accepted for review; it does not mean rollback occurred, destructive action was approved, rows were deleted, rows were updated, rows were read, Supabase was connected, or `daily_prices` was mutated.

## Aggregate-Only Rollback Summary Fields

The rollback readiness contract may allow only sanitized aggregate fields:

- `rollbackReadinessId`
- `attemptId`
- `authorizationId`
- `postRunReviewId`
- `sourceGatePath`
- `targetTable`
- `targetLane`
- `targetScope`
- `maxRows`
- `rollbackReadinessState`
- `rollbackScopeLocked`
- `rollbackScope`
- `rollbackTargetTable`
- `rollbackTargetLane`
- `rollbackMaxRows`
- `rollbackDryRunRequired`
- `rollbackDryRunStatus`
- `rollbackReady`
- `rollbackScopeStatus`
- `rollbackCandidateRows`
- `rollbackEligibleRows`
- `rollbackProtectedRows`
- `rollbackSkippedRows`
- `rollbackBlockedRows`
- `rollbackStopLineResult`
- `destructiveRollbackAllowed`
- `rollbackRequiresSeparateExecutionGate`
- `sanitizedErrorCode`
- `sanitizedErrorCategory`

Rollback summary output must stay aggregate-only. It must not expose row bodies, trade-date lists, per-date values, source values, candidate row payloads, raw market payloads, stock-id payloads, credential-derived URLs, private dashboard links, copied source terms text, SQL text, SQL query results, or secrets.

## Promotion Lock Fields

The rollback readiness contract must carry explicit locks:

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

A passing rollback readiness contract preflight must not switch runtime data source, enable real scoring, grant row coverage points, close launch readiness, promote TWII evidence to public production use, or approve `daily_prices` mutation.

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
- `stockIdPayloadRead=false`
- `stockIdPayloadOutput=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `secretsOutput=false`
- `rollbackExecuted=false`
- `rollbackDryRunExecuted=false`
- `destructiveRollbackAllowed=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`

## Prohibited Fields

The rollback readiness contract, review output, or handoff must not include:

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
- rollback dry-run execution;
- destructive rollback authorization;
- deletion predicate output;
- update predicate output;
- rollback key list output;
- rollback row identifier output;
- aggregate readback execution without a separate accepted PM gate;
- post-run review execution without a separate accepted PM gate;
- rollback execution without a separate accepted PM gate;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim;
- PM mainline gate/checker/status/board/package file edits from this A1 local-only task.

## Ready-To-Hand-Off Summary

1. Fixed inputs are `sourceGatePath=data/source-gates/twii-post-run-review-contract-preflight.json`, `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`.
2. Rollback scope is locked to TWII missing-row readiness only and remains non-executable.
3. Rollback readiness output is aggregate-only and may include counts, state, scope status, stop-line result, and sanitized error category only.
4. Allowed readiness states are `ready_for_pm_review`, `accepted`, `rejected`, `blocked`, `repair_required`, `failed_closed`, and `not_executed`.
5. Post-run review acceptance remains a required upstream dependency before rollback readiness can be accepted.
6. Promotion locks remain `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, and `scoreSource=mock`.
7. This A1 file does not modify PM mainline gate/checker/status/board/package files and does not authorize rollback, SQL, Supabase access, market-data import, `daily_prices` mutation, public source promotion, or real scoring.
