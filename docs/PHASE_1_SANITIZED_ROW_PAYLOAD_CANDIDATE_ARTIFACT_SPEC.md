# Phase 1 Sanitized Row-Payload Candidate Artifact Spec

Status: `phase_1_sanitized_row_payload_candidate_artifact_spec_ready_no_market_rows`

Packet mode: `row_payload_candidate_artifact_spec_no_market_rows`

## CEO Decision

The current Phase 1 write-runner implementation candidate is correctly blocked by `candidate_row_payloads_missing`.

The next data-line task is not another aggregate artifact. A1 must provide separately accepted sanitized row-payload candidate artifacts for the remaining Level 1 rows, but those row files must stay out of committed source control unless PM explicitly accepts a storage policy.

This spec defines the format only. It does not create, fetch, store, print, or commit market rows.

## Required Artifact Delivery Mode

- `deliveryMode=local_or_external_path_only`
- `commitPolicy=do_not_commit_market_row_payloads_by_default`
- `validatorOutput=aggregate_counts_only`
- `rowPayloadAllowedForFutureValidator=true`
- `rowPayloadPrinted=false`
- `rawPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`

## Required Scope

- `boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only`
- `targetTable=daily_prices`
- `fullLevel1MissingRows=178`
- `twiiMissingRows=60`
- `etfMissingRows=118`
- symbols: `TWII`, `0050`, `006208`
- conflict key: `symbol,trade_date`
- insert mode: `missing_only`

## Required Top-Level Fields

Future row-payload candidate artifacts must include:

- `artifactId`
- `createdAt`
- `scope`
- `sourceRightsStatus`
- `fieldContractStatus`
- `sanitizedRowPayloadIncluded`
- `rawPayloadIncluded`
- `stockIdPayloadIncluded`
- `secretsIncluded`
- `expectedRows`
- `rows`

## Required Row Fields

Each row must include only normalized fields:

- `symbol`
- `trade_date`
- `close`
- `source_name`
- `source_updated_at`
- `source_row_hash`

Optional normalized fields:

- `open`
- `high`
- `low`
- `volume`

Forbidden row fields:

- `stock_id`
- raw source payloads
- raw URLs with query secrets
- authentication headers
- API keys
- unnormalized source row bodies
- investment recommendation labels

## Future Validator Requirements

The future validator may read the local candidate file only after PM names the path. It must output only:

- row count
- duplicate count
- rejected count
- symbols covered
- date bounds
- missing required-field count
- forbidden-field count
- safety flags

It must not print row bodies, raw payloads, stock ids, secrets, authorization values, confirmation phrases, or credential values.

## Hard Boundaries

- No SQL
- No Supabase client import
- No Supabase connection
- No Supabase read
- No Supabase write
- No `daily_prices` mutation
- No staging rows
- No market-data fetch
- No market-data ingestion
- No committed market row payloads
- No raw payload output
- No row payload output
- No secret output
- No public source promotion
- No score promotion
- No public real-data claim
- No investment advice

## A1 Assignment

A1 should prepare a local or external sanitized row-payload candidate artifact path for `TWII`, `0050`, and `006208` under this spec.

A1 must return only the path, artifact id, aggregate counts, symbols covered, date bounds, duplicate count, rejected count, forbidden-field count, and safety flags.

PM will not accept the artifact for writing until a separate validator and write gate pass.

