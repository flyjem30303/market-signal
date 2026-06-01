# Equity 2330 Single Failed Month Local Diagnostic Plan

Status: `equity_2330_single_failed_month_local_diagnostic_plan_recorded`

Date: 2026-06-01

## Trigger

`EQUITY_REPORT_ONLY_RUNNER_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md` recorded a useful but blocked one-attempt report-only runner result. The only symbol-level anomaly was 2330.

## Observed Anomaly

```text
symbol: 2330
failed_month_count: 1
zero_row_month_count: 1
parser_flag_count: 1
http_status_summary: 200: 38, error: 1
parsed_row_count: 761
first_observed_trade_date: 2023-01-03
last_observed_trade_date: 2026-05-29
publicDataSource: mock
scoreSource: mock
row_coverage_credit_awarded: false
```

## Safe Local Hypotheses

These hypotheses are allowed because they use only the sanitized aggregate post-run record:

1. One transient HTTP, network, timeout, or endpoint availability issue may have occurred.
2. One request-level error may have occurred for a single 2330 month.
3. The endpoint may have returned a non-JSON, unavailable, empty, or otherwise parser-unusable response for one month.
4. The parser may have received no rows for one month even though other 2330 months were parseable.

## What Cannot Be Concluded

The current sanitized output does not include the exact failed month key. Therefore this plan must not claim:

- which exact 2330 month failed;
- that TWSE has a source data gap;
- that the local parser has a confirmed data quality defect;
- that row coverage evidence has been accepted;
- that `publicDataSource=supabase` is ready;
- that `scoreSource=real` is ready.

## Next Safe Action

Before any second runner execution is proposed, update the future runner output contract to include sanitized failed-month metadata only:

```text
failedMonthKeys: [
  {
    symbol: string,
    month: YYYY-MM,
    errorCategory: sanitized_category,
    httpStatus: number_or_null,
    parsedRowCount: number
  }
]
```

The future output contract must still avoid raw rows, row-level numeric market fields, secrets, SQL, Supabase writes, staging rows, `daily_prices` writes, raw market data commits, row coverage promotion, `publicDataSource=supabase`, and `scoreSource=real`.

## Stop Lines

- Do not rerun `scripts/run-equity-report-only-runner-once.mjs` from this plan.
- Do not fetch TWSE from this plan.
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

## CEO/PM Decision

```text
CONTINUE_WITH_OUTPUT_CONTRACT_HARDENING
```

The anomaly is narrow enough to keep momentum, but the exact failed month cannot be diagnosed from the current aggregate record. The next slice should harden the runner's sanitized output contract first, then require a new one-attempt execution decision gate before any second remote attempt.
