# TW Equity Sanitized Candidate Input Validator

Updated: 2026-06-06

Status: `tw_equity_sanitized_candidate_input_validator_ready_not_mutating`.

## Purpose

This slice adds a local validator for the future TW equity staging write candidate input artifact.

It does not create the candidate artifact, fetch market data, store raw payloads, connect to Supabase, or write staging rows. It only lets `scripts/run-tw-equity-staging-write-once.mjs` reject or accept a sanitized JSON artifact contract before any future write-capable implementation exists.

## CEO Decision

CEO decision: validate the sanitized candidate input boundary before implementing Supabase mutation. This reduces the future write runner blast radius because the runner will only accept a narrow, normalized, non-raw input artifact.

## Candidate Artifact Shape

The candidate input artifact must be JSON and must include:

- `authorizationId`;
- `targetRelation`;
- `sourceId`;
- `symbols`;
- `maxRows`;
- `sourcePayloadIncluded=false`;
- `sourceUrlPayloadIncluded=false`;
- `secretsIncluded=false`;
- `candidateRun`;
- `candidatePrices`.

The artifact must not include:

- `rawSourcePayload`;
- `sourcePayload`;
- `sourceRows`;
- `rawRows`;
- `sourceUrlPayload`;
- `html`;
- `csv`;
- `secret`;
- `secrets`.

## Candidate Run Contract

`candidateRun` must be normalized to `staging_twse_stock_day_runs` field names. The validator requires the key run metadata fields, including:

- `run_id` as a UUID-shaped value matching the staging migration `uuid` column contract;
- `run_type=staging_candidate`;
- `source_id=twse-stock-day`;
- `source_url_template`;
- `license_url`;
- `attribution_text`;
- symbol/month/count metrics;
- `zero_row_months`;
- `http_status_summary`;
- `rate_limit_policy`;
- `started_at`;
- `finished_at`;
- `created_by`;
- `review_status` in `draft` or `pending_review`;
- `decision=ready_for_review`.

## Candidate Price Contract

`candidatePrices` must be normalized to `staging_twse_stock_day_prices` field names. Each candidate price row must include:

- matching UUID-shaped `run_id`;
- `source_id=twse-stock-day`;
- `exchange_code=TWSE`;
- authorized `symbol`;
- `trade_date`;
- non-negative OHLC, volume, trade value, and transaction count values;
- `quality_flags` as an array;
- `source_fetched_at`;
- non-empty `source_row_hash`.

The validator rejects non-UUID run ids, duplicate `(run_id, exchange_code, symbol, trade_date)` candidate rows, and high prices below low prices.

## Runner Output Boundary

When the candidate input contract passes, the runner may output:

- `candidateInputAccepted=true`;
- `candidateInputRunRows=1`;
- `candidateInputPriceRows`;
- `rollbackDryRunCountReady=true` only when `--rollback-dry-run` is also present;
- rollback dry-run candidate counts.

Even when accepted, the runner must still keep:

- `writeImplementationReady=false`;
- `connectionAttempted=false`;
- `executionAttempted=false`;
- `mutations=false`;
- `sqlExecuted=false`;
- `filesWritten=false`;
- `marketDataFetched=false`;
- `marketDataIngested=false`;
- `sourcePayloadsPrinted=false`;
- `rowPayloadsPrinted=false`;
- `secretsPrinted=false`;
- `publicDataSource=mock`;
- `scoreSource=mock`.

## Current Stop Line

Current decision: sanitized candidate input validation is implemented locally, but no write-capable Supabase implementation exists.

No SQL, Supabase connection, Supabase write, staging row creation, production `daily_prices` mutation, market-data fetch, market-data ingestion, source payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred.
