# TWII Bounded Data Acceptance Attempt Dry-Run Wrapper

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_attempt_dry_run_wrapper_ready_no_write`

## Purpose

This slice implements the first executable local wrapper for a future TWII bounded data acceptance attempt.

The wrapper is deliberately limited to `no-write-preview`. It validates the command shape, verifies that a local candidate artifact path exists, records sanitized file metadata, and writes a post-run review shell. It does not read, parse, print, accept, score, promote, fetch, or write any market data.

## Command

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-attempt -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview
```

Optional output override:

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-attempt -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview --out tmp/twii-bounded-data-acceptance-attempt-<ATTEMPT_ID>.json
```

## What It May Do

- Confirm `attemptId` format.
- Confirm `mode=no-write-preview`.
- Confirm `candidateArtifactPath` points to an existing local file.
- Record sanitized artifact metadata: basename, byte size, modified time.
- Write a sanitized dry-run summary JSON.
- Include a post-run review shell that points back to `docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md`.

## What It Must Not Do

- No SQL execution.
- No Supabase connection, read, write, insert, update, delete, or upsert.
- No remote TWII probe.
- No market-data fetch, ingestion, storage, or commit.
- No `daily_prices` mutation.
- No staging row creation.
- No candidate row acceptance.
- No row coverage scoring.
- No raw source payload, row payload, stock-id payload, or secret output.
- No public source promotion.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.

## Required Output Signals

The wrapper output must include:

- `status=twii_bounded_data_acceptance_attempt_dry_run_ready_no_write`;
- `mode=no-write-preview`;
- `candidateArtifact.rawContentRead=false`;
- `candidateArtifact.rawContentParsed=false`;
- `candidateArtifact.rawPayloadPrinted=false`;
- `candidateRowsAcceptedNow=false`;
- `dailyPricesMutated=false`;
- `stagingRowsCreated=false`;
- `rowCoverageScoringAllowed=false`;
- `sqlExecuted=false`;
- `supabaseConnectionAttempted=false`;
- `publicDataSource=mock`;
- `scoreSource=mock`;
- `requiredReviewStatus=pending_pm_ceo_post_run_review`.

## Stop Line

This wrapper is executable, but it is still a no-write dry-run. It does not authorize or perform a real TWII data acceptance attempt.

No SQL, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, candidate row acceptance, source promotion, or `scoreSource=real` occurred.
