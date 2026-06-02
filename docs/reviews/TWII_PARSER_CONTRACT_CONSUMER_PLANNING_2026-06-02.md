# TWII Parser Contract Consumer Planning

Status: `twii_parser_contract_consumer_planning_recorded`

Date: 2026-06-02

## Trigger

`TWII_LOCAL_PARSER_CONTRACT_IMPLEMENTATION_REVIEW_2026-06-02.md` marked the local synthetic-only parser contract as ready for local-only consumer planning.

## Planning Scope

```text
source_module: src/lib/twii-parser-contract.ts
consumer_type: future_staging_first_review_consumer
planning_only: true
target_symbol: TWII
source_candidate: official-exchange-index
fixture_policy: synthetic_rows_only
publicDataSource: mock
scoreSource: mock
```

## Future Consumer Responsibilities

```text
CONSUMER-001 accept TwiiParserContractResult only after parser contract checks pass
CONSUMER-002 read normalizedDate and normalizedIndexValue as review-stage fields only
CONSUMER-003 surface duplicateTradeDateCount and fieldParseFailureCount as blocking review signals
CONSUMER-004 keep failureClass visible to staging review
CONSUMER-005 preserve assetMapping as TWII_internal_market_asset_pending
CONSUMER-006 refuse to award row coverage credit
CONSUMER-007 refuse to set scoreSource=real
CONSUMER-008 refuse to map rows into daily_prices
CONSUMER-009 require separate rights decision before ingestion
CONSUMER-010 require separate staging schema decision before storage
```

## Future Review States

```text
STATE-001 parser_contract_ready_for_review
STATE-002 parser_contract_blocked_by_field_mismatch
STATE-003 parser_contract_blocked_by_duplicate_dates
STATE-004 parser_contract_blocked_by_no_rows
STATE-005 parser_contract_waiting_for_rights_decision
STATE-006 parser_contract_waiting_for_staging_schema
STATE-007 parser_contract_not_runtime_ready
```

## Explicit Non-Authorization

- This consumer planning does not run SQL.
- This consumer planning does not connect to Supabase.
- This consumer planning does not write Supabase.
- This consumer planning does not create staging rows.
- This consumer planning does not modify `daily_prices`.
- This consumer planning does not fetch or ingest raw market data.
- This consumer planning does not probe an external endpoint.
- This consumer planning does not print secrets.
- This consumer planning does not print row payloads.
- This consumer planning does not print stock_id payloads.
- This consumer planning does not commit raw market data.
- This consumer planning does not approve source rights.
- This consumer planning does not approve parser ingestion.
- This consumer planning does not approve ingestion.
- This consumer planning does not award row coverage points.
- This consumer planning does not promote `publicDataSource=supabase`.
- This consumer planning does not set `scoreSource=real`.
- This consumer planning does not promote CP3 readiness.
- This consumer planning does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_PARSER_CONTRACT_CONSUMER_ROLE_REVIEW_LOCAL_ONLY
```

CEO recommendation: next safe slice is a role review of this consumer plan. After that, the project may add a local consumer-state helper that uses synthetic parser results only and remains disconnected from runtime ingestion.
