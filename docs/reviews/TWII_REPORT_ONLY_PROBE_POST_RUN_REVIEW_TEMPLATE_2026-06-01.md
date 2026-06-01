# TWII Report-Only Probe Post-Run Review Template

Status: `twii_report_only_probe_post_run_review_template_recorded`

Date: 2026-06-01

## Trigger

This template is required before any future execution of `scripts/run-twii-report-only-probe-once.mjs`.

## Required Sanitized Run Summary

```text
command: $env:TWII_REPORT_ONLY_PROBE_CONFIRMATION="CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; & 'C:\Program Files\nodejs\node.exe' scripts\run-twii-report-only-probe-once.mjs
mode: twii_report_only_probe
status: pending_run
failureClass: pending_run
remoteAttempted: pending_run
connectionAttempted: pending_run
targetSymbol: TWII
selectedCandidate: official-exchange-index
httpStatusGroup: pending_run
parsedRowCount: pending_run
dateRangeStart: pending_run
dateRangeEnd: pending_run
missingSessionCount: pending_run
duplicateTradeDateCount: pending_run
fieldParseFailureCount: pending_run
calendarGapCount: pending_run
parserFlagCount: pending_run
publicDataSource: mock
scoreSource: mock
```

## Required Safety Flags

```text
rowPayloadsPrinted: false
stockIdPayloadsPrinted: false
secretsPrinted: false
sqlExecuted: false
writesAttempted: false
marketDataFilesWritten: false
rowCoverageCreditAwarded: false
scoreSourceRealEnabled: false
```

## Required Review Questions

1. Did the runner execute exactly once?
2. Did it return sanitized JSON only?
3. Did it avoid raw row, raw payload, stock_id payload, secret, and raw endpoint parameter output?
4. Did it avoid SQL, Supabase writes, staging writes, `daily_prices` writes, and market-data file writes?
5. Does the result support parser-design discussion, or does it require fallback source review?
6. Should the next slice be parser-design preparation, source-rights rejection, or fallback-source selection?

## Explicit Non-Authorization

- This template does not run SQL.
- This template does not connect to Supabase.
- This template does not write Supabase.
- This template does not create staging rows.
- This template does not modify `daily_prices`.
- This template does not fetch or ingest raw market data.
- This template does not probe an external endpoint.
- This template does not print secrets.
- This template does not print row payloads.
- This template does not print stock_id payloads.
- This template does not commit raw market data.
- This template does not approve source rights.
- This template does not approve a parser.
- This template does not approve ingestion.
- This template does not award row coverage points.
- This template does not promote `publicDataSource=supabase`.
- This template does not set `scoreSource=real`.
- This template does not promote CP3 readiness.
- This template does not approve public coverage claims.

## CEO/PM Decision

```text
POST_RUN_REVIEW_TEMPLATE_READY_BEFORE_TWII_REPORT_ONLY_PROBE_EXECUTION
```

CEO recommendation: do not execute the probe unless this template and all local guarded-runner checks pass first.
