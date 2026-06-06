# TW Equity Write Implementation Design-To-Code Boundary

Updated: 2026-06-06

Status: `tw_equity_write_implementation_design_to_code_boundary_ready_not_mutating`.

## Purpose

This boundary moves the TW equity staging write lane from readiness planning toward implementation code without allowing any Supabase mutation.

It inherits:

- `docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md`;
- `scripts/run-tw-equity-staging-write-once.mjs`;
- `supabase/migrations/0003_twse_stock_day_staging.sql`.

## CEO Decision

CEO decision: implement the smallest local design-to-code boundary first. The runner may expose candidate input and rollback dry-run readiness fields, but must still refuse Supabase mutation until a separate one-attempt execution gate approves it.

## Candidate Input Artifact Contract

A future write-capable runner must not fetch market data directly. It may only consume a separate sanitized candidate input artifact that is explicitly authorized by a future gate.

The candidate input artifact must prove:

- `authorizationId` equals `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- `targetRelation` equals `staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- `sourceId` equals `twse-stock-day`;
- `symbols` equal `2330`, `2382`, `2308`;
- `maxRows` is at most `180`;
- no raw source payload is included;
- no source URL payload is included;
- no secret is included;
- rows are already sanitized and normalized to the staging table field names;
- each candidate price row has a non-empty `source_row_hash`;
- candidate row count does not exceed `maxRows`.

## Rollback Dry-Run Count Contract

Before any mutation, the runner must be able to compute or request a sanitized rollback dry-run count scoped by one `run_id`.

Rollback dry-run output may include only:

- `runId`;
- `candidateRunRows`;
- `candidatePriceRows`;
- `targetRelation`;
- `rollbackDryRunCountReady`;
- `destructiveRollbackAllowed=false`.

Destructive rollback execution remains blocked unless a separate rollback execution gate exists.

## Runner Output Boundary

The runner now may expose:

- `candidateInputArtifact`;
- `candidateInputAccepted`;
- `rollbackDryRunCountReady`;
- `writeImplementationReady=false`.

It must still keep:

- `connectionAttempted=false`;
- `executionAttempted=false`;
- `mutations=false`;
- `sqlExecuted=false`;
- `filesWritten=false`;
- `marketDataFetched=false`;
- `marketDataIngested=false`;
- `secretsPrinted=false`;
- `sourcePayloadsPrinted=false`;
- `rowPayloadsPrinted=false`;
- `publicDataSource=mock`;
- `scoreSource=mock`.

## Current Stop Line

Current decision: design-to-code boundary is ready and local runner output fields are exposed, but candidate input is not accepted, rollback dry-run count is not ready, and write implementation is not created.

No SQL, Supabase connection, Supabase write, staging row creation, production `daily_prices` mutation, market-data fetch, market-data ingestion, source payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred.
