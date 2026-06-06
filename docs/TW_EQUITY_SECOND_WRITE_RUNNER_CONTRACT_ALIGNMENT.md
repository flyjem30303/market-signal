# TW Equity Second Write Runner Contract Alignment

Date: 2026-06-06

Status: `tw_equity_second_write_runner_contract_aligned_not_executed`.

Decision: `RUNNER_ACCEPTS_AUTH_002_CONTRACT_LOCAL_MOCK_ONLY`

Trigger: `docs/TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_DECISION.md` named a second bounded staging write retry and required runner contract alignment before any execution slice.

## Scope

This slice aligns the guarded write runner command contract for the second bounded retry. It does not execute a real Supabase write. It does not run SQL. It uses local mock Supabase behavior only to prove the second command contract is accepted by the runner and remains fail-closed behind explicit confirmation, candidate input, rollback dry-run, and exact command fields.

## Alignment Summary

`scripts/run-tw-equity-staging-write-once.mjs` now recognizes two explicit attempt contracts:

- `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001` with confirmation `CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE` and post-run review `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md`;
- `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002` with confirmation `CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE` and post-run review `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md`.

The second contract intentionally allows the accepted sanitized candidate artifact whose embedded authorization id remains `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`. This preserves data artifact immutability while allowing a separately named retry decision to reuse the same reviewed candidate rows.

## Local Mock Verification Command

```powershell
$env:TW_EQUITY_STAGING_WRITE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE'
$env:TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE='enabled'
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md" --candidate-input "data/candidates/tw-equity-staging-candidate.json" --rollback-dry-run --execute
```

Execution count: `1`

Exit code: `0`

## Sanitized Local Result

```json
{
  "authorizationId": "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  "candidateInputAccepted": true,
  "candidateInputPriceRows": 180,
  "candidateInputRunRows": 1,
  "connectionAttempted": false,
  "confirmationPresent": true,
  "exactCommandMatched": true,
  "executionAttempted": true,
  "mockSupabaseUsed": true,
  "mutations": true,
  "postRunReview": "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  "publicDataSource": "mock",
  "scoreSource": "mock",
  "secretsPrinted": false,
  "sqlExecuted": false,
  "writeAttempted": true,
  "writePreExecutionSummaryReady": true,
  "writtenPriceRows": 180,
  "writtenRunRows": 1
}
```

The `mutations=true` value above is mock-only and proves only that the local guarded insert path would be reached under the second command contract. It is not a remote Supabase mutation and awards no row coverage points.

## Stop Confirmation

- STOP-001 no real Supabase connection occurred.
- STOP-002 no real Supabase write occurred.
- STOP-003 no SQL or migration command was run.
- STOP-004 no staging rows were created remotely.
- STOP-005 no `daily_prices` mutation occurred.
- STOP-006 no market-data fetch or ingestion occurred.
- STOP-007 no raw payload, row payload, source payload, or secret was printed.
- STOP-008 public-facing data source remains `publicDataSource=mock`.
- STOP-009 scoring remains `scoreSource=mock`.
- STOP-010 row coverage points remain unawarded.
- STOP-011 second retry execution still requires a separate execution slice.

## Role Review

CEO finding: The blocker has moved from runner contract mismatch to execution authorization. The project can now proceed to a single bounded second retry execution slice if CEO chooses to cross that line.

PM finding: The next slice should run the exact `AUTH-002` command once without mock mode, capture the fresh post-run review, and then stop. No automatic retry is allowed.

Engineering finding: The runner now supports explicit attempt contracts instead of a single hard-coded attempt. Existing `AUTH-001` behavior remains covered by existing local checks, and `AUTH-002` behavior is covered by `scripts/check-tw-equity-second-write-runner-contract-alignment.mjs`.

Data finding: The accepted candidate artifact remains unchanged at 1 run row and 180 price rows. No new data collection or candidate artifact generation is needed before the second retry.

Security finding: Secret values were not printed. The local mock verification did not connect to Supabase.

Investment finding: This alignment does not change public investment evidence. Real-data claims remain blocked until a real successful post-run review and separate promotion decision.

## CEO Verdict

Accepted as a completed runner contract alignment slice. The runner is ready for a separately authorized second bounded staging write retry execution.

## Next Slice

NEXT-SLICE-001 execute exactly one `AUTH-002` bounded staging write retry without mock mode if CEO approves execution.

NEXT-SLICE-002 immediately record `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md`.

NEXT-SLICE-003 stop after the one attempt regardless of success or failure.
