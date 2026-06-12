# A1 TWSE OpenAPI Terms Field Coverage Matrix No-Fetch

Updated: 2026-06-12

Status: `a1_twse_openapi_terms_field_coverage_matrix_ready_local_only`

Owner: A1 Data / Source / Coverage support lane

Scope: `public_beta_twse_openapi_terms_field_coverage_matrix_no_fetch`

## 1. Purpose

This document prepares the bounded TWSE OpenAPI source, terms, field, and coverage matrix that PM can use for public Beta source/coverage runtime labels.

It is a no-fetch planning artifact. It does not approve market-row retrieval, SQL, Supabase connection, Supabase writes, staging rows, `daily_prices` mutation, raw payload storage, public real-data promotion, or real scoring.

PM may use this document to wire mock runtime labels, public copy placeholders, coverage states, and next-review handoffs while preserving:

- `publicDataSource=mock`
- `scoreSource=mock`
- `rawMarketDataFetch=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## 2. TWSE OpenAPI Candidate Sources

| Source lane | Candidate route / reference | Public Beta role | Current no-fetch posture | PM runtime label |
| --- | --- | --- | --- | --- |
| `twse_openapi_official_candidate` | TWSE OpenAPI root / official OpenAPI host | Official open-data source lane for future adapter planning | Candidate only; route metadata can inform mock labels and contracts, but no row access is approved | `source_lane=twse_openapi_official_candidate` |
| `twse_index_official_candidate` | `/indicesReport/MI_5MINS_HIST` | TWII / index baseline daily close context | Metadata/contract planning lane only; index close field contract remains pending for executable use | `coverage_scope=index_baseline` |
| `twse_equity_daily_candidate` | `/exchangeReport/STOCK_DAY_AVG_ALL` | Listed equity daily close candidate | Candidate field route for listed stocks; no symbol row list or row payload may be emitted | `coverage_scope=listed_equity_batch1` |
| `twse_equity_trading_candidate` | `/exchangeReport/STOCK_DAY_ALL` | Listed equity daily OHLC / volume / turnover candidate | Candidate route for richer trading facts; field semantics and terms must be confirmed before any runtime promotion | `coverage_scope=listed_equity_full_future` |
| `twse_market_statistics_candidate` | `/exchangeReport/MI_INDEX` | Market daily statistics and index dashboard context | Candidate route for market-level values; index names, units, and close semantics remain field-contract review items | `coverage_scope=index_or_market_statistics` |
| `twse_etf_daily_candidate` | TWSE listed-stock/ETF routes, if ETF instruments are covered by the same accepted route terms | Core ETF context for broad-market Beta panels | Possible only after ETF instrument scope and attribution are confirmed; do not infer ETF acceptance from generic route existence | `coverage_scope=core_etf_context` |
| `tpex_official_candidate` | Separate TPEX source lane, not TWSE OpenAPI | OTC / TPEx later expansion | Out of current TWSE OpenAPI source contract; keep as future separate source matrix | `coverage_scope=otc_future_expansion` |

## 3. Terms Location Pending Fields

| Terms / rights field | Candidate location to verify later | No-fetch status | PM-safe label |
| --- | --- | --- | --- |
| Governing license | Data.gov Open Government Data License and dataset-level notices | `terms_location_pending_confirmation` | `source_terms_status=terms_review_required` |
| TWSE route notice | TWSE OpenAPI swagger metadata and TWSE official source pages | `route_notice_pending_confirmation` | `source_terms_status=route_notice_required` |
| TWSE site terms | TWSE Terms of Use | `site_terms_pending_confirmation` | `source_terms_status=site_terms_review_required` |
| Trading information terms | TWSE trading information use / contract / fee standard pages | `trading_info_terms_pending_confirmation` | `source_terms_status=trading_info_review_required` |
| Attribution wording | Data.gov / TWSE source wording and placement rules | `attribution_pending_confirmation` | `attribution_status=attribution_required` |
| Public display permission | License and dataset-specific display/reuse clauses | `public_display_pending_confirmation` | `public_display_status=display_review_required` |
| Redistribution / retention | License, data.gov dataset terms, and TWSE-specific constraints | `redistribution_pending_confirmation` | `redistribution_status=blocked_until_confirmed` |
| Automation / cadence | API fair-use, rate, refresh, retry, and schedule rules | `automation_cadence_pending_confirmation` | `cadence_status=cadence_review_required` |
| Dataset withdrawal / correction | Data.gov/TWSE update, revision, withdrawal, and schema-change notices | `revision_policy_pending_confirmation` | `schema_drift_status=fail_closed_required` |

## 4. Attribution / Cadence / Display / Redistribution Posture

| Area | Current support posture | PM public Beta handling |
| --- | --- | --- |
| Attribution | Required before public real-data display. The runtime can prepare source-label placeholders now. | Show only mock-safe text such as `official_source_candidate` or `terms_review_required`; final wording belongs to A2/PM after terms confirmation. |
| Cadence | Candidate daily cadence only. No endpoint calls were made here. | Use `update_cadence_status=mock_daily_shape_only`; do not claim real freshness, real-time service, or completed daily update. |
| Public display | Future delayed daily values and derived summaries may be possible only after accepted terms and execution gates. | Use `public_display_status=mock_display_only` until accepted. |
| Redistribution | Raw payload republication, downstream resale, bulk export, and official endorsement implication remain blocked. | Use `redistribution_status=not_allowed_by_this_packet`. |
| Derived indicators | Product can design derived indicator shells from synthetic fixtures only. | Use `indicator_source_status=synthetic_or_mock_only`. |
| Source gaps | Missing route, schema drift, withdrawn data, or unconfirmed terms must fail closed. | Use `source_gap_status=fail_closed`. |

## 5. Coverage Layers

| Coverage layer | Candidate TWSE OpenAPI support | Public Beta runtime label PM can use | Current blocker |
| --- | --- | --- | --- |
| Index baseline | TWII/index routes are the highest-value first lane for market atmosphere | `coverage_layer=index_baseline`, `coverage_status=mock_consumer_ready_terms_required` | Terms, attribution, index field contract, missing-session handling, bounded execution authorization |
| Core ETF | Possible through TWSE-listed ETF instrument coverage if endpoint terms and instrument scope confirm ETFs | `coverage_layer=core_etf_context`, `coverage_status=instrument_scope_required` | ETF route/instrument confirmation, ETF source-rights, market-close vs NAV distinction |
| Listed equity | Candidate listed-stock daily close/trading routes exist at planning level | `coverage_layer=listed_equity_batch1`, `coverage_status=batch_rules_required` | Universe definition, batch policy, symbol handling without payload dumps, field contract |
| Full listed equity | Later expansion after Batch 1 evidence and quality gates | `coverage_layer=listed_equity_full_future`, `coverage_status=future_expansion_blocked` | Coverage sufficiency, rate/fair-use, backfill strategy, quality/readback proof |
| OTC later | Not covered by TWSE OpenAPI matrix; requires TPEX matrix | `coverage_layer=otc_future_expansion`, `coverage_status=separate_source_required` | Separate TPEX terms, field contract, attribution, and coverage universe |

## 6. Field-Contract Gaps

| Normalized field | Candidate source field(s) | Gap to close before executable parser approval | Mock runtime placeholder |
| --- | --- | --- | --- |
| `trade_date` | `Date` | Calendar, timezone, ROC/ISO/compact formats, holiday/missing-session behavior, corrections | `trade_date=synthetic_trade_date` |
| `close_value` | `ClosingIndex`, `ClosingPrice` | Index close vs equity close semantics, precision, comma parsing, null/dash handling | `close_value=synthetic_close_value` |
| `open_value` | `OpeningIndex`, `OpeningPrice` | Optional vs required status by route; missing optional behavior | `open_value=synthetic_optional_value` |
| `high_value` | `HighestIndex`, `HighestPrice` | Optional vs required status by route; unit and precision | `high_value=synthetic_optional_value` |
| `low_value` | `LowestIndex`, `LowestPrice` | Optional vs required status by route; unit and precision | `low_value=synthetic_optional_value` |
| `volume` | `TradeVolume` | Unit, availability by route, index-volume semantics vs equity volume | `volume=synthetic_optional_volume` |
| `turnover` | `TradeValue` | Currency/unit, precision, availability by route | `turnover=synthetic_optional_turnover` |
| `instrument_code` | `Code`, index code/name if provided | Symbol format, ETF inclusion, listed equity universe, no public stock-id row dumps | `instrument_code=synthetic_code` |
| `instrument_name` | `Name`, `IndexName` | Language, aliasing, display-safe labels, no raw row payload | `instrument_name=synthetic_name` |
| `source_lane` | Internal normalized label | Must remain candidate/mock label until source acceptance | `source_lane=twse_openapi_official_candidate` |
| `source_terms_status` | Internal normalized label | Must remain review-required until terms accepted | `source_terms_status=terms_review_required` |
| `coverage_scope` | Internal normalized label | Must match index / ETF / listed equity / OTC layers without implying real coverage | `coverage_scope=index_baseline|core_etf_context|listed_equity_batch1|otc_future_expansion` |

Fail-closed field states PM can consume:

- `field_contract_status=field_contract_required`
- `schema_status=schema_metadata_incomplete`
- `schema_drift_status=fail_closed_required`
- `missing_session_status=blocked_until_policy_confirmed`
- `parser_runtime_status=synthetic_fixture_only`

## 7. PM-Receivable Mock Runtime Labels

PM mainline may wire the following labels in local/mock runtime only:

| Runtime label | Allowed value(s) | Meaning |
| --- | --- | --- |
| `publicDataSource` | `mock` | Public runtime remains mock-only. |
| `scoreSource` | `mock` | Score runtime remains mock-only. |
| `source_lane` | `twse_openapi_official_candidate`, `twse_index_official_candidate`, `twse_equity_daily_candidate`, `twse_equity_trading_candidate`, `twse_market_statistics_candidate`, `twse_etf_daily_candidate`, `tpex_official_candidate` | Candidate source lane display and routing labels only. |
| `source_terms_status` | `terms_review_required`, `route_notice_required`, `site_terms_review_required`, `trading_info_review_required`, `blocked_until_confirmed` | Legal/source-rights status labels only. |
| `coverage_layer` | `index_baseline`, `core_etf_context`, `listed_equity_batch1`, `listed_equity_full_future`, `otc_future_expansion` | Coverage planning layer, not real coverage proof. |
| `coverage_status` | `mock_consumer_ready_terms_required`, `instrument_scope_required`, `batch_rules_required`, `future_expansion_blocked`, `separate_source_required` | Mock UI and planning states. |
| `field_contract_status` | `field_contract_required`, `synthetic_fixture_only`, `schema_metadata_incomplete`, `fail_closed_required` | Parser/field readiness state without live data. |
| `public_display_status` | `mock_display_only`, `display_review_required`, `not_approved_for_real_values` | Public display guardrail. |
| `redistribution_status` | `not_allowed_by_this_packet`, `blocked_until_confirmed` | Redistribution guardrail. |
| `execution_status` | `execution_still_blocked_no_fetch`, `pm_authorization_required`, `bounded_packet_required` | Stop-line labels for any later real-data work. |

These labels are safe for product wiring, local checks, PM planning, and A2 copy guard work. They are not source acceptance, data ingestion approval, row coverage proof, or public real-data promotion.

## 8. Stop Lines

- Do not fetch TWSE OpenAPI market rows.
- Do not fetch market data from any fallback source.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not store, commit, print, or transform raw market data.
- Do not print raw response bodies, source row bodies, candidate row bodies, or stock-id row lists.
- Do not print secrets or environment values.
- Do not generate candidate artifacts from live source rows.
- Do not switch `publicDataSource` away from `mock`.
- Do not switch `scoreSource` away from `mock`.
- Do not claim TWSE OpenAPI is accepted for ingestion.
- Do not claim public Beta real-data coverage is complete.
- Do not imply official endorsement, real-time freshness, investment advice, or buy/sell/hold guidance.

## 9. Next Handoff

Recommended PM intake decision:

`accept_a1_twse_openapi_terms_field_coverage_matrix_no_fetch_for_mock_runtime_labels`

Meaning: PM may use this matrix for source/coverage runtime labels and next review routing while keeping the runtime mock-only. This decision does not authorize data access, SQL, Supabase work, `daily_prices` mutation, live parser execution, public real-data display, redistribution, or real scoring.

Next owner split:

| Owner | Next bounded task | Output |
| --- | --- | --- |
| PM mainline | Wire mock runtime labels and gate states from this matrix | Local/mock runtime source and coverage status display |
| A1 | Prepare field-contract confirmation packet for index baseline and Batch 1 listed-equity planning | No-fetch field-contract review packet |
| A1 | Prepare coverage universe batch rules for index baseline, core ETF, listed equity, and OTC later | No row-list coverage batch plan |
| A2 | Prepare public copy guard for attribution, delayed data, source gaps, mock boundary, and non-advice | Public Beta wording guard |
| D / source-rights | Confirm governing terms, attribution, display, cadence, redistribution, retention, and fail-closed clauses | Source-rights decision support, no secrets |

Definition of done for this document:

- Purpose is explicit and local-only.
- TWSE OpenAPI candidate lanes are mapped.
- Terms location pending fields are recorded.
- Attribution, cadence, public display, and redistribution posture are bounded.
- Coverage layers cover index baseline, core ETF, listed equity, and OTC later.
- Field-contract gaps are listed without live rows.
- PM has mock runtime labels.
- Stop lines preserve no-fetch, no-SQL, no-Supabase, no-`daily_prices`, no-raw-data, `publicDataSource=mock`, and `scoreSource=mock`.
