# Open Free Auto Data Source Gate

Status: `open_free_auto_data_source_gate_ready_for_pm_selection`

Date: 2026-06-12

Owner: PM mainline

Support lanes:

- A1: Data / source evidence confirmation
- A2: Public copy guard and attribution language

## CEO Decision

Before any further real-data promotion, Supabase write closure, `daily_prices` mutation, or `scoreSource=real` promotion, the project must first confirm a legal, free, no-manual-operation, automatable data source for daily close and same-day trading information.

The project will not rely on:

- unconsented TWSE website crawling, scraping, scripted download, or browser automation;
- manual daily download / manual upload as the primary operating model;
- paid vendor contracts;
- TWSE trading-information contract / paid authorization routes;
- any grey-area workaround.

## Candidate Source Classification

### Candidate 1: TWSE OpenAPI via data.gov open-data references

Status: `accepted_candidate_for_bounded_pm_validation`

Source references:

- Data.gov license: `https://data.gov.tw/license`
- TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`
- Data.gov dataset: `https://data.gov.tw/dataset/11669`
- Data.gov dataset: `https://data.gov.tw/dataset/11548`
- Data.gov dataset: `https://data.gov.tw/dataset/11549`

Observed OpenAPI paths:

- `/indicesReport/MI_5MINS_HIST`: TWSE capitalization weighted index historical data candidate.
- `/exchangeReport/STOCK_DAY_AVG_ALL`: listed stock daily close and monthly average candidate.
- `/exchangeReport/STOCK_DAY_ALL`: listed stock daily trading information candidate.
- `/exchangeReport/MI_INDEX`: market daily close / market statistics candidate.

Current acceptance:

- accepted: legal/free/automatable candidate for bounded PM validation;
- accepted: daily close and same-day trading-information coverage appears sufficient for listed securities and TWII baseline discovery;
- accepted: no human daily operation required in the target architecture;
- accepted: free open-data route is a better strategic fit than TWSE contract, paid vendor, or manual import;
- not accepted yet: Supabase write;
- not accepted yet: `daily_prices` mutation;
- not accepted yet: public real-data promotion;
- not accepted yet: `publicDataSource=supabase`;
- not accepted yet: `scoreSource=real`;
- not accepted yet: raw payload storage, row-payload commit, or public real-time claim.

Required next PM gate:

`twse_openapi_bounded_metadata_and_terms_validation`

The next gate may inspect metadata, API shape, rate posture, attribution requirement, and field contract. It must not store raw market rows or write Supabase.

### Candidate 2: TPEx OpenAPI for OTC / listed-over-counter expansion

Status: `accepted_candidate_for_later_parallel_validation`

Source references:

- TPEx OpenAPI swagger: `https://www.tpex.org.tw/openapi/swagger.json`

Observed OpenAPI paths:

- `/tpex_mainboard_daily_close_quotes`: OTC stock daily close quotes candidate.
- `/tpex_daily_trading_index`: OTC market daily trading index candidate.
- `/tpex_3insti_daily_trading`: OTC institutional trading candidate.

Current acceptance:

- accepted: parallel candidate for later OTC coverage expansion;
- not accepted yet: primary MVP source;
- not accepted yet: Supabase write, public real-data promotion, or real scoring.

## Operating Boundary

This gate does not authorize execution against production data or database writes. It only changes the project strategy:

- primary data-source path becomes `official_open_data_api`;
- manual import becomes fallback only;
- paid vendor / TWSE contract routes are no longer mainline;
- unconsented TWSE website crawling remains blocked;
- runtime remains `publicDataSource=mock`;
- score remains `scoreSource=mock`.

## Definition of Done For This Gate

- A legal/free/automatable source candidate is identified.
- The candidate has an official OpenAPI or machine-readable entrypoint.
- The candidate is tied to open-data/license references.
- The candidate covers daily close and same-day trading information.
- The next gate is bounded to metadata / terms / field-contract validation only.
- No SQL, Supabase write, staging row, `daily_prices` mutation, raw market-data storage, or public real-data promotion occurs.
