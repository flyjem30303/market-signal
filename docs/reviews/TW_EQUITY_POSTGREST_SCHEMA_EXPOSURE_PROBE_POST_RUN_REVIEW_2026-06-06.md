# TW Equity PostgREST Schema Exposure Probe Post-Run Review

Date: 2026-06-06

Status: `tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete`.

## Scope

- Exactly one bounded PostgREST OpenAPI schema exposure probe was attempted.
- Target objects: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`.
- Evidence is sanitized schema metadata only.

## Repair Outcome Gate

- Repair outcome required: `accepted`.
- Repair outcome observed: `accepted`.
- Repair outcome recorded by: `CEO`.
- Repair outcome recorded at: `2026-06-06T15:39:30.702Z`.

## Sanitized Result

- OpenAPI reachable: `true`.
- OpenAPI parsed: `true`.
- Problems: `staging_twse_stock_day_runs_not_exposed_in_openapi_schema`, `staging_twse_stock_day_prices_not_exposed_in_openapi_schema`.

## Object Summary

- `staging_twse_stock_day_runs`: exposed=`false`, exposedExpectedColumnCount=`0`, expectedColumnCount=`25`, missingExpectedColumns=`attribution_text,created_by,decision,duplicate_trade_dates,failed_month_count,finished_at,http_status_summary,license_url,missing_required_field_count,non_numeric_price_count,non_numeric_volume_amount_count,parser_flag_count,rate_limit_policy,requested_month_count,requested_symbol_count,review_status,run_id,run_type,source_id,source_note_count,source_url_template,started_at,successful_month_count,total_candidate_row_count,zero_row_months`.
- `staging_twse_stock_day_prices`: exposed=`false`, exposedExpectedColumnCount=`0`, expectedColumnCount=`16`, missingExpectedColumns=`close_price,exchange_code,high_price,low_price,open_price,price_change,quality_flags,run_id,source_fetched_at,source_id,source_row_hash,symbol,trade_date,trade_value,transaction_count,volume`.

## Safety Confirmation

- no SQL execution;
- no migration execution;
- no insert/update/upsert/delete operation;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- `publicDataSource=mock`;
- `scoreSource=mock`.
