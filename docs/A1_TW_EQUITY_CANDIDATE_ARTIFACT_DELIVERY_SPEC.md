# A1 TW Equity Candidate Artifact Delivery Spec

Updated: 2026-06-06

Status: `a1_tw_equity_candidate_artifact_delivery_spec_ready_no_candidate_data`.

## Purpose

This spec tells A1 how to hand a sanitized TW equity candidate artifact to PM without guessing the contract.

It does not create a candidate artifact, fetch market data, store source payloads, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, promote public data source, award row coverage points, or set `scoreSource=real`.

## Delivery Path

Default PM intake path:

```text
data/candidates/tw-equity-staging-candidate.json
```

Alternate local path:

```text
A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH=<local-json-path>
```

The default path is intentionally empty until A1 supplies a real sanitized artifact. Do not commit a filled artifact unless CEO separately approves committing sanitized candidate data.

## Required Top-Level Fields

The artifact must be JSON and must include:

- `authorizationId` equal to `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- `targetRelation` equal to `staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- `sourceId` equal to `twse-stock-day`;
- `symbols` equal to `2330`, `2382`, `2308`;
- `maxRows` no greater than `180`;
- `sourcePayloadIncluded=false`;
- `sourceUrlPayloadIncluded=false`;
- `secretsIncluded=false`;
- `candidateRun`;
- `candidatePrices`.

## Required Candidate Run Fields

`candidateRun` must use normalized `staging_twse_stock_day_runs` field names and include:

- `run_id`;
- `run_type=staging_candidate`;
- `source_id=twse-stock-day`;
- `source_url_template`;
- `license_url`;
- `attribution_text`;
- requested, successful, failed, duplicate, missing-field, numeric-validity, note, and parser-flag counts;
- `zero_row_months`;
- `http_status_summary`;
- `rate_limit_policy`;
- `started_at`;
- `finished_at`;
- `created_by`;
- `review_status` as `draft` or `pending_review`;
- `decision=ready_for_review`.

## Required Candidate Price Fields

Each `candidatePrices` row must use normalized `staging_twse_stock_day_prices` field names and include:

- matching `run_id`;
- `source_id=twse-stock-day`;
- `exchange_code=TWSE`;
- one authorized symbol: `2330`, `2382`, or `2308`;
- `trade_date`;
- non-negative OHLC values;
- non-negative `volume`, `trade_value`, and `transaction_count`;
- `quality_flags` as an array;
- `source_fetched_at`;
- non-empty `source_row_hash`.

The validator rejects duplicate `(run_id, exchange_code, symbol, trade_date)` rows and rejects `high_price` lower than `low_price`.

## Forbidden Content

The artifact must not include:

- `rawSourcePayload`;
- `sourcePayload`;
- `sourceRows`;
- `rawRows`;
- `sourceUrlPayload`;
- `html`;
- `csv`;
- `secret`;
- `secrets`;
- service-role key material;
- row-level source output printed to console;
- public redistribution claims.

## PM Intake Commands

Default path:

```powershell
node scripts/report-a1-tw-equity-candidate-artifact-intake.mjs
node scripts/check-a1-tw-equity-candidate-artifact-intake.mjs
```

Alternate path:

```powershell
$env:A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH="<local-json-path>"
node scripts/report-a1-tw-equity-candidate-artifact-intake.mjs
node scripts/check-a1-tw-equity-candidate-artifact-intake.mjs
```

Passing intake only means PM may ask CEO whether to name exactly one bounded staging write attempt. It does not execute the write.

## Stop Line

No candidate artifact is created in this slice.

No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
