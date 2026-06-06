# TW Equity Post-Merge Row Coverage Readback Post-Run Review

Status: `tw_equity_post_merge_row_coverage_readback_executed_overall_blocked_tw_equity_complete`

Date: 2026-06-07

## Scope

This review records exactly one bounded readonly row coverage readback after the accepted TW equity insert-missing merge. It connected to Supabase for sanitized aggregate counts only.

It did not run SQL, did not write Supabase, did not mutate `daily_prices`, did not fetch or ingest market data, did not print secrets, did not print row payloads, did not print stock ids, did not promote the public source, did not set real score source, and did not award public row coverage readiness.

## Command Attempted

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION='CP3_ROW_COVERAGE_READONLY_VALIDATE'; node --env-file=.env.local scripts/run-row-coverage-readonly-once.mjs
```

Execution count: `1`

Exit code: `1`

Exit code `1` is expected for this post-merge readback because the full MVP universe remains incomplete.

## Sanitized Aggregate Counts

- expected symbol count: `6`;
- required trading sessions: `60`;
- expected total rows: `360`;
- observed total rows: `182`;
- missing rows: `178`;
- coverage status: `blocked`;
- reason: `aggregate_count_incomplete`;
- preflight status: `ready_for_guarded_readonly_decision`.

## Sanitized Symbol Counts

- `TWII`: observed rows `0` of `60`;
- `0050`: observed rows `1` of `60`;
- `006208`: observed rows `1` of `60`;
- `2330`: observed rows `60` of `60`;
- `2382`: observed rows `60` of `60`;
- `2308`: observed rows `60` of `60`.

## Outcome Classification

Outcome category: `overall_row_coverage_blocked_tw_equity_subscope_complete`.

The post-merge readback is accepted as production aggregate evidence for the TW equity sub-scope because the three TW equity symbols each reached `60/60` rows.

The post-merge readback is rejected as full MVP row coverage readiness because `TWII`, `0050`, and `006208` remain incomplete and the total observed rows are `182/360`.

## Safety Confirmation

- remoteAttempted: `true`;
- connectionAttempted: `true`;
- mutations: `false`;
- filesWritten: `false`;
- sqlExecuted: `false`;
- rowPayloadsPrinted: `false`;
- secretsPrinted: `false`;
- publicDataSource: `mock`;
- scoreSource: `mock`;
- canAwardRowCoveragePoints: `false`;
- canClaimCoverage: `false`;
- canSetScoreSourceReal: `false`.

## Next Slice

Create the row coverage scoring gate that accepts the TW equity sub-scope as complete, keeps full MVP row coverage blocked at `182/360`, and directs the next data work toward `TWII`, `0050`, and `006208`.
