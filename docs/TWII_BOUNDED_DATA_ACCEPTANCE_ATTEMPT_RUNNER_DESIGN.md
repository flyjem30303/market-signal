# TWII Bounded Data Acceptance Attempt Runner Design

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_attempt_runner_design_ready_no_execution`

## Purpose

This design defines the command contract for a future single TWII bounded data acceptance attempt after CEO names the attempt.

It is not an implementation of the attempt. It does not execute SQL, read or write Supabase, fetch market data, mutate `daily_prices`, accept candidate rows, score row coverage, promote public source, or set `scoreSource=real`.

## Future Command Shape

The future command must remain disabled until a separate execution GOAL explicitly authorizes it:

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-attempt -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview
```

## Required Inputs

- `attemptId`;
- `candidateArtifactPath`;
- `mode=no-write-preview` for the first implementation;
- `targetLane=TWII`;
- `targetScope=twii_index_daily_prices_missing_rows`;
- `maxCandidateRows=60`;
- PM/CEO named-attempt decision reference;
- post-run review command;
- rollback or no-write stop line.

## Required Output

The future attempt report must include:

- `attemptId`;
- `mode`;
- `candidateArtifactPath`;
- `candidateRowsReviewed`;
- `candidateRowsAcceptedNow=false`;
- `dailyPricesMutated=false`;
- `supabaseConnectionAttempted=false`;
- `sqlExecuted=false`;
- `rowCoverageScoringAllowed=false`;
- `publicDataSource=mock`;
- `scoreSource=mock`;
- post-run review status.

## Stop Line

No TWII bounded data acceptance attempt is implemented or executed in this slice.

No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL, staging row creation, production `daily_prices` mutation, candidate row acceptance, source payload output, secret output, row coverage point award, public source promotion, or `scoreSource=real` occurred.
