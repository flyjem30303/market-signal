# TWII Report-Only Probe One-Attempt Execution Decision Gate

Status: `twii_report_only_probe_one_attempt_execution_decision_gate_recorded`

Date: 2026-06-02

## Trigger

`TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md` recorded that the guarded TWII report-only probe runner is ready for a separate one-attempt execution decision.

## Decision Question

```text
approve_exactly_one_twii_report_only_probe_attempt_after_guarded_runner_prep
```

## Current Decision State

```text
approval_state: accepted
approved_by: CEO_under_chairman_delegation
approved_at: 2026-06-02T00:00:00+08:00
attempt_limit: 1
remote_execution_allowed_now: true
target_symbol: TWII
selected_candidate: official-exchange-index
publicDataSource: mock
scoreSource: mock
```

## Exact Command If Prechecks Pass

```powershell
$env:TWII_REPORT_ONLY_PROBE_CONFIRMATION="CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; & 'C:\Program Files\nodejs\node.exe' scripts\run-twii-report-only-probe-once.mjs
```

## Required Prechecks Immediately Before Execution

1. `npm run check:twii-report-only-probe-guarded-runner`
2. `npm run check:twii-report-only-probe-command-map`
3. `npm run check:twii-report-only-probe-post-run-template`
4. `npm run check:twii-report-only-probe-one-attempt-execution-decision-gate`
5. `npm run check:review-gates`

## Expected Sanitized Output Only

The one attempt may report only these aggregate fields:

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

## Stop Lines

- This gate approves exactly one TWII report-only probe attempt.
- Do not run more than one TWII report-only probe attempt from this gate.
- Do not use this gate after one attempt has been executed.
- Do not retry if the attempt is blocked or fails.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not print secrets.
- Do not print row payloads.
- Do not print stock_id payloads.
- Do not write market-data files.
- Do not commit raw market data.
- Do not approve source rights.
- Do not approve a parser.
- Do not approve ingestion.
- Do not award row coverage credit.
- Do not promote `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not promote CP3 readiness.
- Do not approve public coverage claims.

## Required Post-Run Review

Immediately after the single execution, record a post-run review based on `TWII_REPORT_ONLY_PROBE_POST_RUN_REVIEW_TEMPLATE_2026-06-01.md`.

The post-run review must decide only whether the result supports parser-design preparation, source-rights rejection, or fallback-source selection. It must not claim row coverage, production readiness, source-rights approval, or public-data readiness.

## CEO/PM Recommendation

```text
ACCEPTED_FOR_EXACTLY_ONE_TWII_REPORT_ONLY_PROBE_ATTEMPT
```

CEO recommendation: execute this exact command once only after the prechecks pass, then immediately record the sanitized post-run review. The goal is source-depth evidence for TWII, not data ingestion.
