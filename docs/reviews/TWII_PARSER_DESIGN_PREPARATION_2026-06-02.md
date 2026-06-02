# TWII Parser Design Preparation

Status: `twii_parser_design_preparation_recorded`

Date: 2026-06-02

## Trigger

`TWII_REPORT_ONLY_PROBE_RUNNER_STABILITY_FIX_2026-06-02.md` recorded that the TWII report-only probe runner process-tail stability fix passed local checks and that the project may proceed to parser-design preparation using already recorded sanitized aggregate evidence.

## Evidence Inputs

```text
post_run_review: TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md
stability_fix: TWII_REPORT_ONLY_PROBE_RUNNER_STABILITY_FIX_2026-06-02.md
target_symbol: TWII
selected_candidate: official-exchange-index
httpStatusGroup: 2xx
parsedRowCount: 20
dateRangeStart: 2026-05-04
dateRangeEnd: 2026-05-29
duplicateTradeDateCount: 0
fieldParseFailureCount: 0
parserFlagCount: 0
publicDataSource: mock
scoreSource: mock
```

## Parser Design Objective

Prepare the local design for a future TWII index-history parser without executing another remote probe and without storing market data.

The parser design may define field names, normalization rules, validation rules, failure categories, and staging-first mapping assumptions. It must not implement ingestion, approve rights, write rows, or promote runtime scoring.

## Candidate Field Contract

```text
source_row_contract: array_row
field_001_source_date: roc_date_string
field_002_index_value: numeric_string
field_003_change: numeric_string
field_004_transaction_value_or_amount: numeric_string_or_review_only
field_005_transaction_volume_or_count: numeric_string_or_review_only
normalized_date: iso_date
normalized_index_value: decimal
timezone: Asia/Taipei_assumed_pending_final_rights_review
asset_mapping: TWII_internal_market_asset_pending
```

## Normalization Rules

```text
NORMALIZE-001 convert ROC date strings into ISO dates
NORMALIZE-002 remove comma separators from numeric cells
NORMALIZE-003 reject empty strings and dash-only cells
NORMALIZE-004 preserve source precision until staging mapping is approved
NORMALIZE-005 do not infer missing sessions from the probe alone
NORMALIZE-006 do not map to daily_prices until staging-first design is approved
NORMALIZE-007 do not calculate score inputs from this evidence alone
NORMALIZE-008 do not store raw source rows
```

## Validation Rules

```text
VALIDATE-001 parsed row count must be positive for source feasibility
VALIDATE-002 duplicate normalized dates must be counted
VALIDATE-003 invalid date cells must increment fieldParseFailureCount
VALIDATE-004 invalid numeric cells must increment fieldParseFailureCount
VALIDATE-005 date range must remain aggregate-only in reports
VALIDATE-006 parser flags must be reported as sanitized counts only
VALIDATE-007 market calendar gaps require a separate calendar source before claims
VALIDATE-008 source revisions require a later policy before ingestion
```

## Failure Classes

```text
FAILURE-001 no_rows
FAILURE-002 field_mismatch
FAILURE-003 duplicate_dates
FAILURE-004 calendar_gap_unresolved
FAILURE-005 source_unavailable
FAILURE-006 rights_unapproved
FAILURE-007 process_tail_error
FAILURE-008 parser_design_blocked
```

## Explicit Non-Authorization

- This preparation does not run SQL.
- This preparation does not connect to Supabase.
- This preparation does not write Supabase.
- This preparation does not create staging rows.
- This preparation does not modify `daily_prices`.
- This preparation does not fetch or ingest raw market data.
- This preparation does not probe an external endpoint.
- This preparation does not print secrets.
- This preparation does not print row payloads.
- This preparation does not print stock_id payloads.
- This preparation does not commit raw market data.
- This preparation does not approve source rights.
- This preparation does not approve a parser implementation.
- This preparation does not approve ingestion.
- This preparation does not award row coverage points.
- This preparation does not promote `publicDataSource=supabase`.
- This preparation does not set `scoreSource=real`.
- This preparation does not promote CP3 readiness.
- This preparation does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_PARSER_DESIGN_ROLE_REVIEW_LOCAL_ONLY
```

CEO recommendation: continue with a role review of this parser-design preparation. After that, the next safe implementation slice may be a local parser contract module and unit-style fixture built from synthetic rows only, not raw market data.
