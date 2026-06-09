# TWII Bounded Data Acceptance Dry-Run Review Chain

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_dry_run_review_chain_ready`

## Purpose

This chain provides one local command that runs the TWII no-write dry-run wrapper and immediately reviews its sanitized output through the PM/CEO post-run review gate.

It is an execution convenience for the existing no-write controls. It does not create new data privileges.

## Command

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview
```

Optional output directory:

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview --out-dir tmp
```

## Chain Steps

1. Run `run:twii-bounded-data-acceptance-attempt`.
2. Write a sanitized dry-run summary.
3. Run `report:twii-bounded-data-acceptance-post-run-review`.
4. Write a PM/CEO post-run review result.
5. Write a chain summary with `twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write` when both steps pass.

## Accepted Output

The chain may return `accepted_no_write_chain` only when:

- wrapper status is `twii_bounded_data_acceptance_attempt_dry_run_ready_no_write`;
- post-run review status is `twii_bounded_data_acceptance_post_run_review_accepted_no_write`;
- mode is `no-write-preview`;
- `publicDataSource=mock`;
- `scoreSource=mock`.

## Stop Line

No SQL.

No Supabase.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No public source or real-score promotion.
