# Equity Report-Only Runner Second One-Attempt Execution Decision Gate

Status: `equity_report_only_runner_second_one_attempt_execution_decision_required`

Date: 2026-06-01

## Trigger

The first one-attempt report-only runner execution ended as `BLOCKED_BUT_USEFUL` because 2330 had one failed month and one zero-row month. A local-only diagnostic plan then concluded that the exact failed month cannot be identified from the original aggregate output.

The runner output contract has now been hardened to include sanitized `failedMonthKeys` and `zeroRowMonthKeys`.

## Decision Question

```text
approve_exactly_one_second_equity_report_only_runner_attempt_after_month_key_output_hardening
```

## Current Decision State

```text
approval_state: accepted
approved_by: Chairman
approved_at: 2026-06-01T15:05:00+08:00
attempt_limit: 1
remote_execution_allowed_now: true
```

## Exact Future Command If Approved

```text
EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION=CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION NEXT_PUBLIC_DATA_SOURCE=mock node scripts/run-equity-report-only-runner-once.mjs
```

## Required Prechecks Before Any Second Attempt

1. `npm run check:equity-report-only-runner-implementation`
2. `npm run check:equity-2330-single-failed-month-local-diagnostic-plan`
3. `npm run check:equity-report-only-runner-second-one-attempt-execution-decision-gate`
4. `npm run check:review-gates`

## Expected Sanitized Output Additions

The second attempt, if approved later, may include only these diagnostic metadata arrays:

```text
failedMonthKeys: [{ symbol, month, errorCategory, httpStatus, parsedRowCount }]
zeroRowMonthKeys: [{ symbol, month, errorCategory, httpStatus, parsedRowCount }]
```

These arrays are for diagnostic routing only. They do not create row coverage evidence, do not prove source completeness, and do not permit public claim promotion.

## Stop Lines

- This gate approves exactly one second report-only runner attempt.
- Do not run more than one second attempt from this gate.
- Do not use this gate after one second attempt has been executed.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not print secrets.
- Do not print row payloads.
- Do not commit raw market data.
- Do not award row coverage credit.
- Do not promote `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## CEO/PM Recommendation

```text
ACCEPTED_FOR_EXACTLY_ONE_SECOND_ATTEMPT
```

Chairman accepted one bounded second attempt after the above prechecks pass. The goal is not data ingestion; the goal is to identify the exact failed 2330 month through sanitized month-key metadata.
