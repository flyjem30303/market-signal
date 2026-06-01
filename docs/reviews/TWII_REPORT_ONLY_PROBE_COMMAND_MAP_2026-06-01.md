# TWII Report-Only Probe Command Map

Status: `twii_report_only_probe_command_map_recorded`

Date: 2026-06-01

## Trigger

`TWII_REPORT_ONLY_PROBE_ACCEPTANCE_GATE_2026-06-01.md` authorized implementation preparation for a guarded one-attempt TWII report-only probe runner or command map.

## Runner

```text
runner: scripts/run-twii-report-only-probe-once.mjs
mode: twii_report_only_probe
target_symbol: TWII
selected_candidate: official-exchange-index
confirmation_variable: TWII_REPORT_ONLY_PROBE_CONFIRMATION
confirmation_token: CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT
attempt_limit: exactly_one_future_attempt
publicDataSource: mock
scoreSource: mock
```

## Exact Future Command

```powershell
$env:TWII_REPORT_ONLY_PROBE_CONFIRMATION="CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; & 'C:\Program Files\nodejs\node.exe' scripts\run-twii-report-only-probe-once.mjs
```

## Required Local Checks Before Any Future Execution

```text
CHECK-001 npm run check:twii-report-only-probe-guarded-runner
CHECK-002 npm run check:twii-report-only-probe-command-map
CHECK-003 npm run check:twii-report-only-probe-post-run-template
CHECK-004 npm run check:review-gates
```

## Sanitized Output Contract

```text
mode
status
failureClass
remoteAttempted
connectionAttempted
targetSymbol
selectedCandidate
httpStatusGroup
parsedRowCount
dateRangeStart
dateRangeEnd
missingSessionCount
duplicateTradeDateCount
fieldParseFailureCount
calendarGapCount
parserFlagCount
publicDataSource
scoreSource
rowPayloadsPrinted
stockIdPayloadsPrinted
secretsPrinted
sqlExecuted
writesAttempted
marketDataFilesWritten
rowCoverageCreditAwarded
scoreSourceRealEnabled
```

## Stop Conditions

- Stop after one process execution, regardless of success or failure.
- Stop if confirmation is missing.
- Stop if `NEXT_PUBLIC_DATA_SOURCE` is not `mock`.
- Stop if output is not parseable sanitized JSON.
- Stop if any raw row, raw payload, raw endpoint parameter, stock_id payload, secret, SQL result, or market-data file is produced.
- Stop if the result is blocked; do not retry inside the same authorization.

## Explicit Non-Authorization

- This command map does not run SQL.
- This command map does not connect to Supabase.
- This command map does not write Supabase.
- This command map does not create staging rows.
- This command map does not modify `daily_prices`.
- This command map does not fetch or ingest raw market data in this slice.
- This command map does not probe an external endpoint in this slice.
- This command map does not print secrets.
- This command map does not print row payloads.
- This command map does not print stock_id payloads.
- This command map does not commit raw market data.
- This command map does not approve source rights.
- This command map does not approve a parser.
- This command map does not approve ingestion.
- This command map does not award row coverage points.
- This command map does not promote `publicDataSource=supabase`.
- This command map does not set `scoreSource=real`.
- This command map does not promote CP3 readiness.
- This command map does not approve public coverage claims.

## CEO/PM Decision

```text
TWII_REPORT_ONLY_PROBE_RUNNER_READY_FOR_SEPARATE_ONE_ATTEMPT_EXECUTION_DECISION
```

CEO recommendation: after checks pass, the next slice may request exactly one execution of the command above and must perform an immediate post-run review.
