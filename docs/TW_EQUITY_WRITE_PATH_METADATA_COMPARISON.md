# TW Equity Write-Path Metadata Comparison

Date: 2026-06-06

Status: `tw_equity_write_path_metadata_comparison_local_insert_contract_clean_remote_write_path_unresolved`.

## Purpose

This local-only comparison narrows the current Supabase staging blocker after the metadata diagnostic confirmed readonly metadata is reachable. It compares:

- the sanitized candidate artifact fields;
- the local staging migration table contracts;
- the bounded staging write runner target tables;
- the latest bounded metadata diagnostic post-run review.

## Finding

The local insert contract is clean: candidate insert columns match the local migration contract, the write runner targets `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`, and the latest readonly metadata diagnostic shows both canonical staging objects reachable.

The remaining unresolved area is remote write-path schema exposure or PostgREST insert-path metadata behavior. CEO should not run a third write attempt until a bounded write-path schema exposure comparison or equivalent dashboard/API schema evidence is reviewed.

This comparison must be accepted before any third write attempt.

## Next Decision

`prepare_bounded_postgrest_write_path_schema_exposure_probe_or_dashboard_api_schema_comparison_before_third_write_attempt`

## Safety Confirmation

- No Supabase connection;
- no SQL execution;
- no migration execution;
- no write attempt;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- `publicDataSource=mock`;
- `scoreSource=mock`.
