# TWSE OpenAPI Bounded Metadata Terms Validation

Status: `twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows`

Date: 2026-06-12

Owner: PM mainline

Support lanes:

- A1: endpoint metadata and field-contract validation without market-row fetch
- A2: public attribution, delay, no-investment-advice, and source-gap copy guard
- D: source-rights / terms support only

## CEO Decision

CEO advances the data-realification route from completed `OFFICIAL-001` through `OFFICIAL-012` intake into a bounded OpenAPI metadata / terms validation packet.

This packet is intentionally metadata-only. It validates public source references, OpenAPI route existence, terms / attribution posture, field-contract readiness, and source-adapter design direction. It does not authorize endpoint data fetch, parser implementation against live rows, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, `publicDataSource=supabase`, `scoreSource=real`, or public real-data promotion.

Current outcome:

`metadata_terms_validated_adapter_design_ready_execution_still_blocked`

Next route:

`twse_openapi_source_adapter_contract_scaffold_no_data_fetch`

## Source References

Primary references:

- Data.gov Open Government Data License: `https://data.gov.tw/license`
- TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`
- Data.gov TWSE dataset: `https://data.gov.tw/dataset/11669`
- Data.gov TWSE dataset: `https://data.gov.tw/dataset/11548`
- Data.gov TWSE dataset: `https://data.gov.tw/dataset/11549`

Boundary references:

- TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`
- TWSE Trading Information use / contracts / fee standards: `https://www.twse.com.tw/zh/products/information/use.html`

## Terms / Public Use Validation

Accepted for this candidate route:

- Use the data.gov open-data route as the primary no-cost automatable source path.
- Preserve attribution to TWSE OpenAPI / data.gov open-data references.
- Preserve license reference to the Open Government Data License.
- Display normalized daily close / trading summaries and derived dashboard signals only after later validation and execution gates pass.
- Include update time, data-delay, source-gap, and no-investment-advice wording on public surfaces.
- Treat data availability, source changes, and withdrawn data as fail-closed events.

Not accepted by this packet:

- TWSE website crawling, scraping, scripted download, browser automation, or grey-area access.
- Raw payload storage, raw row payload output, stock-id payload dumps, or public raw-payload republication.
- Bulk downstream API resale or official endorsement implication.
- Real-time or second-level freshness claims.
- Any investment advice, buy/sell/hold instruction, or guaranteed-return claim.

## Metadata-Only OpenAPI Validation

PM performed a metadata-only check of `https://openapi.twse.com.tw/v1/swagger.json` on 2026-06-12.

Observed OpenAPI root metadata:

- Swagger version: `2.0`
- Title: `臺灣證券交易所 OpenAPI`
- Version: `1.0`
- Host: `openapi.twse.com.tw`
- Base path: `/v1`
- Scheme: `https`

Observed candidate paths:

| Path | Summary | Tag | Produces | Validation state |
| --- | --- | --- | --- | --- |
| `/indicesReport/MI_5MINS_HIST` | `發行量加權股價指數歷史資料` | `指數` | `application/json`, `text/csv` | accepted_metadata_route_for_twii_index_history |
| `/exchangeReport/STOCK_DAY_AVG_ALL` | `上市個股日收盤價及月平均價` | `證券交易` | `application/json`, `text/csv` | accepted_metadata_route_for_listed_stock_daily_close |
| `/exchangeReport/STOCK_DAY_ALL` | `上市個股日成交資訊` | `證券交易` | `application/json`, `text/csv` | accepted_metadata_route_for_listed_stock_daily_trading_info |
| `/exchangeReport/MI_INDEX` | `每日收盤行情-大盤統計資訊` | `證券交易` | `application/json`, `text/csv` | accepted_metadata_route_for_market_daily_statistics |

Important limitation:

- The Swagger metadata confirms route existence, summaries, tags, and response content types.
- The Swagger metadata does not provide a complete response field schema for these paths.
- Therefore field contract is accepted only at source-adapter design level, not as executable parser approval.

## Source Adapter Contract Direction

Allowed next engineering work:

- Create a no-fetch source adapter contract interface for TWSE OpenAPI routes.
- Define expected normalized output shapes for TWII index daily close and listed-stock daily close / trading information.
- Define parser input guards using unknown-source payloads in tests only, not live fetched market rows.
- Define attribution, update-time, delay, and source-gap metadata fields.
- Define fail-closed behavior for missing fields, missing sessions, schema drift, provider errors, and source withdrawal.
- Keep fixtures synthetic or aggregate-only until a later explicit bounded data-fetch authorization exists.

Not allowed next engineering work:

- Calling candidate endpoints for market rows.
- Storing candidate rows.
- Generating TWII / equity candidate artifacts from live rows.
- Writing Supabase.
- Mutating `daily_prices`.
- Promoting runtime from mock to real.

## Role Dispatch

PM mainline:

- Owns this packet, checker, review gate registration, `PROJECT_STATUS.md`, and next selector alignment.
- Owns the next no-fetch adapter contract scaffold.

A1:

- Prepare endpoint metadata / field-contract notes for TWII, listed stock daily close, listed stock daily trading info, and market statistics without market-row fetch.
- Keep output limited to path names, summaries, tags, content types, required normalized fields, and blocked execution notes.

A2:

- Prepare public copy guard for open-data attribution, delay wording, source-gap wording, no official endorsement, and no investment advice.
- Ensure public UI can explain why data may be delayed or unavailable without exposing developer process artifacts.

D:

- Review source-rights interpretation and flag if any public source wording should be tightened.

## Hard Stops

This packet does not authorize:

- SQL execution
- Supabase connection
- Supabase write
- staging row creation
- `daily_prices` mutation
- market-data endpoint fetch
- raw market-data ingest
- raw market-data storage
- raw market-data commit
- raw payload output
- row payload output
- stock id payload output
- secret output
- candidate artifact generation from live source rows
- parser implementation against live source rows
- public source promotion
- `publicDataSource=supabase`
- `scoreSource=real`
- investment-advice claims

## Completion State

`twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows`

This completes the bounded metadata / terms validation packet and opens the next local-only engineering route:

`twse_openapi_source_adapter_contract_scaffold_no_data_fetch`
