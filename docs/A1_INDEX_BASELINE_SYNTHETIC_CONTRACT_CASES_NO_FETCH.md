# A1 Index Baseline Synthetic Contract Cases No-Fetch

Updated: 2026-06-12

Status: `a1_index_baseline_synthetic_contract_cases_ready_no_fetch`

Owner: A1 Data / Source / Coverage support lane

Scope: `index_baseline_synthetic_contract_cases_no_fetch`

## 1. Purpose

This packet gives PM a synthetic-only case matrix for the future index-baseline field contract.

It supports the BRIEF goal by clarifying how a future official-source parser should behave before any real market-row retrieval, SQL, Supabase write, `daily_prices` mutation, public source promotion, or real score promotion.

Runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- `rawMarketDataFetch=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## 2. Synthetic Case Matrix

| Case id | Synthetic input shape | Expected parser posture | PM-visible meaning |
| --- | --- | --- | --- |
| `index_valid_date_close` | Has normalized `trade_date` and `close_value` | Accept inside synthetic-only parser tests | `欄位對照測試可讀` |
| `index_missing_close` | Has `trade_date` but no `close_value` | Fail closed; no runtime point exported | `收盤值缺漏，暫停公開` |
| `index_duplicate_trade_date` | Two rows share one `trade_date` | Fail closed; duplicate row set quarantined | `日期重複，需重新確認` |
| `index_missing_optional_fields` | Required fields exist, optional volume / turnover / change fields absent | Keep required-point test readable; mark optional fields unconfirmed | `可示範閱讀，延伸欄位待補` |
| `index_revision_warning` | Same `trade_date` appears in a later synthetic revision package | Do not silently replace without revision policy | `修正規則待確認` |
| `index_timezone_session_gap` | Date order skips a possible trading session | Mark as calendar/session policy required | `交易日缺口待確認` |

These cases do not contain real market rows, raw source payloads, stock-id lists, secrets, or candidate values.

## 3. Required Assertions

Future local synthetic tests should prove:

1. valid `trade_date` and `close_value` can produce a mock-only index baseline point;
2. missing `close_value` never produces a runtime point;
3. duplicate `trade_date` never silently passes;
4. missing optional fields do not become invented values;
5. revision warnings do not overwrite prior values without policy;
6. timezone/session gaps remain visible as readiness issues;
7. public labels remain user-facing and avoid parser internals.

## 4. A1 Boundaries

A1 is not authorized by this packet to:

- fetch TWSE OpenAPI market rows;
- fetch fallback market data;
- run SQL;
- connect to Supabase;
- write Supabase;
- create staging rows;
- modify `daily_prices`;
- output stock-id row lists;
- store, print, transform, or commit raw market data;
- generate live candidate artifacts;
- switch `publicDataSource` away from `mock`;
- switch `scoreSource` away from `mock`;
- claim coverage, parser, ingestion, or public Beta data readiness is complete.

## 5. PM Handoff

Recommended PM intake decision:

`accept_a1_index_baseline_synthetic_contract_cases_no_fetch_for_mock_parser_planning`

Meaning:

PM may use this packet to keep the runtime label `欄位對照仍在檢查` honest and to prepare a later synthetic parser test. It does not authorize live data access, external execution, source-row fetch, SQL, Supabase work, candidate-row acceptance, or real public data display.

Next safe task:

`prepare_index_baseline_synthetic_parser_fixture_no_fetch`

Definition of done:

- Synthetic cases cover valid, missing close, duplicate date, optional-field, revision, and session-gap behavior.
- Stop lines preserve no-fetch, no-SQL, no-Supabase, no-`daily_prices`, no-raw-data, `publicDataSource=mock`, and `scoreSource=mock`.
- PM has a mock-only next route that improves runtime readiness without implying real-data promotion.
