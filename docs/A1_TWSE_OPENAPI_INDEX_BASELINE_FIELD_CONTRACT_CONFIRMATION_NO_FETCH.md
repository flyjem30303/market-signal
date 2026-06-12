# A1 TWSE OpenAPI Index Baseline Field Contract Confirmation No-Fetch

Updated: 2026-06-12

Status: `a1_twse_openapi_index_baseline_field_contract_confirmation_ready_local_only`

Owner: A1 Data / Source / Coverage support lane

Scope: `twse_openapi_index_baseline_and_batch1_listed_equity_field_contract_no_fetch`

## 1. Purpose

This packet confirms what PM can safely treat as the next no-fetch field-contract planning layer for the public Beta source/coverage runtime.

It narrows the next data-line work from broad source/coverage labels into two bounded field-contract tracks:

1. `index_baseline`: market atmosphere / TWII-style index baseline for 30-second market mood.
2. `listed_equity_batch1`: first listed-equity demo batch for stock-detail readability and 3-minute observation flow.

This packet does not approve live endpoint calls, market-row retrieval, SQL, Supabase connection, Supabase writes, staging rows, `daily_prices` mutation, raw payload storage, public real-data promotion, or real scoring.

Runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- `rawMarketDataFetch=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## 2. Field-Contract Tracks

| Track | Runtime role | Candidate source route | PM-safe public label | Current state |
| --- | --- | --- | --- | --- |
| `index_baseline` | 30-second market atmosphere, briefing market anchor, source/coverage label layer | `/indicesReport/MI_5MINS_HIST` or accepted TWSE index-history route equivalent | `大盤基準：檢查中` | `field_contract_confirmation_required_no_fetch` |
| `listed_equity_batch1` | stock detail readability for selected demo symbols and later Batch 1 expansion | `/exchangeReport/STOCK_DAY_AVG_ALL` and/or `/exchangeReport/STOCK_DAY_ALL` after route-level terms confirmation | `上市個股批次：展示可用` | `field_contract_confirmation_required_no_fetch` |

PM may use the above labels only as mock runtime explanation. They are not proof of route acceptance, field acceptance, coverage sufficiency, backfill readiness, ingestion readiness, or public real-data readiness.

## 3. Required Normalized Fields

| Normalized field | Index baseline expectation | Listed-equity Batch 1 expectation | Confirmation state |
| --- | --- | --- | --- |
| `trade_date` | Required. Must normalize date format, timezone, missing-session behavior, and correction policy. | Required. Must normalize date format, timezone, missing-session behavior, and correction policy. | `required_not_confirmed` |
| `close_value` | Required. Must confirm closing index semantics and precision. | Required. Must confirm closing price semantics, price unit, and precision. | `required_not_confirmed` |
| `instrument_code` | Optional or derived for index baseline, but PM must not invent official identifiers before confirmation. | Required before any real listed-equity runtime. Must not output stock-id row lists. | `required_for_equity_not_confirmed` |
| `instrument_name` | Required for public display if source provides index name; otherwise PM needs a safe display alias. | Required for public display if source provides listed-equity name; otherwise PM needs a safe display alias. | `display_required_not_confirmed` |
| `volume` | Optional and route-specific; do not assume availability or index meaning. | Optional or required depending on selected endpoint; unit must be confirmed. | `optional_not_confirmed` |
| `turnover` | Optional and route-specific; currency/unit must be confirmed. | Optional or required depending on selected endpoint; currency/unit must be confirmed. | `optional_not_confirmed` |
| `source_lane` | Internal label only. | Internal label only. | `mock_label_only` |
| `source_terms_status` | Internal label only. | Internal label only. | `mock_label_only` |
| `coverage_scope` | Internal label only. | Internal label only. | `mock_label_only` |

## 4. Optional Field Handling

Optional fields must stay fail-closed:

- `open_value`
- `high_value`
- `low_value`
- `volume`
- `turnover`
- `change_value`
- `change_percent`

If an optional field is missing, malformed, renamed, unit-ambiguous, or route-specific, the future parser must:

1. keep the row out of any real runtime promotion;
2. mark the field status as `optional_field_unconfirmed`;
3. keep public display on mock/source-coverage labels only;
4. avoid filling values from another source without a separate accepted source matrix.

## 5. Missing Session And Revision Policy

Before any real parser or backfill route is accepted, A1/PM must confirm:

| Policy item | Required decision | Current state |
| --- | --- | --- |
| Trading calendar | How to distinguish non-trading days from missing source rows | `policy_required_no_fetch` |
| Missing-session handling | Whether missing sessions produce gaps, warnings, or blocked rows | `policy_required_no_fetch` |
| Corrections / revisions | How source corrections replace, append, or invalidate prior values | `policy_required_no_fetch` |
| Timezone | Whether all dates are interpreted in Taiwan market calendar time | `policy_required_no_fetch` |
| Duplicate dates | Future parser must reject or quarantine duplicate `trade_date` values before write | `policy_required_no_fetch` |

PM may show this publicly only as `資料來源與覆蓋狀態：檢查中`; PM must not claim a daily update process is operational.

## 6. Batch 1 Listed-Equity Planning Rules

The first listed-equity batch must stay no-fetch until a later accepted execution packet exists.

Planning constraints:

- Batch 1 can reference product-visible demo symbols already used in mock pages, such as `2330`, `2382`, and `2308`, without treating them as live source rows.
- A1 must not output a full stock-id list or raw symbol universe dump.
- Batch rules should prioritize product usefulness: market-cap relevance, sector representation, homepage/stock-page visibility, and low ambiguity in field semantics.
- Batch 1 cannot imply full listed-equity coverage.
- ETF rows must not be silently folded into listed-equity Batch 1 without a separate ETF instrument-scope decision.

PM-safe labels:

- `listed_equity_batch1=demo_readable_only`
- `listed_equity_full=future_expansion_blocked`
- `core_etf_context=instrument_scope_required`

## 7. PM-Usable Runtime Handoff

PM can consume this packet as:

| Runtime concept | PM-safe value | Meaning |
| --- | --- | --- |
| `indexFieldContractStatus` | `required_not_confirmed` | Index baseline is useful for product planning but not executable. |
| `listedEquityBatch1FieldContractStatus` | `required_not_confirmed` | Batch 1 can be planned, not promoted. |
| `missingSessionPolicyStatus` | `policy_required_no_fetch` | Daily close continuity is not launch-ready. |
| `revisionPolicyStatus` | `policy_required_no_fetch` | Corrections and replacements are not launch-ready. |
| `parserRuntimeStatus` | `synthetic_or_mock_only` | Parser/runtime remains mock-only. |
| `publicDisplayStatus` | `mock_display_only` | Public display cannot show real source values. |
| `promotionStatus` | `blocked_until_terms_field_coverage_quality_readback` | Real promotion remains blocked. |

## 8. A2 Public Copy Guard Notes

A2 should keep the public surface in plain language:

- Keep: `資料來源與覆蓋狀態`, `檢查中`, `展示可用`, `暫停公開`, `示範資料`, `不是即時行情`, `不是投資建議`.
- Avoid: SQL, staging, raw payload, operator authorization, runbook, preflight, post-run, real score, approved real data, complete coverage.
- If PM needs to expose field-contract status publicly, translate it as `欄位對照仍在檢查`, not as parser internals.

## 9. Stop Lines

- Do not fetch TWSE OpenAPI market rows.
- Do not fetch market data from a fallback source.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not output stock-id row lists.
- Do not store, commit, print, or transform raw market data.
- Do not print raw response bodies, candidate rows, source rows, or secrets.
- Do not generate live candidate artifacts.
- Do not switch `publicDataSource` away from `mock`.
- Do not switch `scoreSource` away from `mock`.
- Do not claim index baseline field contract is executable.
- Do not claim listed-equity Batch 1 field contract is executable.
- Do not claim public Beta coverage is complete.

## 10. Next Handoff

Recommended PM intake decision:

`accept_a1_twse_openapi_index_baseline_field_contract_confirmation_no_fetch_for_next_mock_runtime_planning`

Meaning: PM may use this packet to show field-contract planning status and to assign the next no-fetch A1 task. This does not authorize endpoint calls, source-row fetch, SQL, Supabase work, `daily_prices` mutation, candidate-row acceptance, real public data display, or real score promotion.

Next bounded tasks:

| Owner | Task | Output |
| --- | --- | --- |
| A1 | `prepare_index_baseline_synthetic_contract_cases_no_fetch` | Synthetic-only field-contract cases for `trade_date`, `close_value`, duplicate dates, missing optional fields, and revision warnings |
| A1 | `prepare_batch1_listed_equity_symbol_policy_no_row_list` | Batch 1 selection rulebook without raw stock-id row lists |
| A2 | `prepare_field_contract_public_copy_guard` | Public wording for `欄位對照仍在檢查` and source/coverage states |
| PM | `route_health_and_field_contract_status_mock_labeling` | Route-safe mock label integration only if it improves public comprehension |

Definition of done:

- Index baseline and Batch 1 field-contract tracks are separated.
- Required normalized fields are listed.
- Optional field handling is fail-closed.
- Missing-session and revision policies are explicitly not confirmed.
- Batch 1 listed-equity planning avoids raw symbol-list output.
- PM has mock-only runtime labels.
- A2 has public copy guard notes.
- Stop lines preserve no-fetch, no-SQL, no-Supabase, no-`daily_prices`, no-raw-data, `publicDataSource=mock`, and `scoreSource=mock`.
