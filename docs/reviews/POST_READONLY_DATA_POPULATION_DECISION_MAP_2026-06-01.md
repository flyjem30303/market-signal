# Post-Readonly Data Population Decision Map

Status: `post_readonly_data_population_decision_map_recorded`

Date: 2026-06-01

## Trigger

`POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md` recorded a bounded Supabase readonly row coverage attempt. The remote read path succeeded safely, but row coverage remained blocked.

## Latest Evidence

```text
target_relation: daily_prices
coverage_status: blocked
reason: aggregate_count_incomplete
expected_symbol_count: 6
required_trading_sessions: 60
expected_total_rows: 360
observed_total_rows: 5
missing_rows: 355
twii_observed_rows: 0
etf_0050_observed_rows: 1
etf_006208_observed_rows: 1
equity_2330_observed_rows: 1
equity_2382_observed_rows: 1
equity_2308_observed_rows: 1
publicDataSource: mock
scoreSource: mock
```

## CEO Diagnosis

```text
DIAGNOSIS-001 count_unavailable is no longer the primary blocker
DIAGNOSIS-002 stock_id aggregate count path works at remote-read level
DIAGNOSIS-003 row coverage is blocked by insufficient daily_prices population
DIAGNOSIS-004 TWII is the sharpest coverage gap because observed rows are zero
DIAGNOSIS-005 ETF and equity symbols have only one observed row each
DIAGNOSIS-006 no runtime source or score source may change from this evidence
```

## Decision Lanes

| Lane | Scope | Owner | Current state | Next decision |
| --- | --- | --- | --- | --- |
| Index | TWII | Data | Source required | Select and rights-review index source before any parser or write path |
| ETF | 0050, 006208 | Legal | Source rights required | Resolve ETF source rights and field coverage before any dry-run |
| Equity | 2330, 2382, 2308 | Engineering | Source design reference available | Prepare report-only backfill dry-run design from TWSE STOCK_DAY evidence |
| Storage | daily_prices | Engineering | Write path not authorized | Decide staging-first versus direct daily_prices after rollback plan |
| QA | row coverage validation | QA | Read path works, coverage blocked | Define acceptance thresholds and post-run review before any point award |

## Recommended Sequence

1. Prepare a source-specific backfill design packet, not a write runner.
2. Prioritize TWII source selection because current observed rows are zero.
3. Keep ETF source-rights review separate from equity source-depth work.
4. Use the existing TWSE STOCK_DAY evidence for equity report-only design, but do not fetch or ingest from this map.
5. Decide target write lane later: staging-first is preferred unless CEO explicitly accepts direct `daily_prices` write risk.
6. Require rollback, duplicate handling, date-range validation, and sanitized post-run review before any mutation gate.

## Explicit Non-Authorization

- This map does not run SQL.
- This map does not connect to Supabase.
- This map does not write Supabase.
- This map does not create staging rows.
- This map does not modify `daily_prices`.
- This map does not fetch or ingest raw market data.
- This map does not print secrets.
- This map does not print row payloads.
- This map does not print stock_id payloads.
- This map does not award row coverage points.
- This map does not promote `publicDataSource=supabase`.
- This map does not set `scoreSource=real`.
- This map does not promote CP3 readiness.
- This map does not approve public coverage claims.

## CEO/PM Decision

```text
PREPARE_SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET
```

The next useful slice is a source-specific backfill design packet that separates TWII, ETF, and equity decisions. Runtime and Supabase writes should remain blocked until that packet is accepted and followed by a separate execution gate.
