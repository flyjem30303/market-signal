# A1 Public Beta Source Coverage Runtime No-Fetch Handoff

Updated: 2026-06-12

Status: `a1_public_beta_source_coverage_runtime_no_fetch_handoff_ready_local_only`

Owner: A1 Data / Source / Coverage support lane

Scope: `public_beta_index_dashboard_source_coverage_runtime_support_no_fetch`

## 1. PM Summary

This handoff supports the BRIEF goal of a public Beta index-state dashboard without retrieving, storing, committing, or printing market rows.

Recommended PM route:

1. Keep TWSE OpenAPI as the first legal/free/automatable candidate lane for daily close and daily trading information.
2. Let PM mainline wire only mock runtime consumers against source-lane labels, coverage categories, and synthetic field contracts.
3. Keep A1 focused on coverage universe readiness for index, ETF, listed equity, and later OTC lanes.
4. Keep A2 focused on public attribution, delayed-data wording, mock boundary wording, and non-advice copy.
5. Preserve `publicDataSource=mock` and `scoreSource=mock` until separate source-rights, field-contract, coverage, quality, write/readback, and public disclosure gates are accepted.

PM decision that can be accepted now:

`accept_a1_public_beta_source_coverage_runtime_no_fetch_handoff`

Meaning: PM may use this as the data-line support map for mock runtime wiring and source/coverage planning. It does not authorize market-row retrieval, SQL, Supabase connection, staging writes, `daily_prices` mutation, public real-data promotion, or real scoring.

## 2. Current Source Candidate Posture

| Lane | Purpose | Current posture | Next no-fetch readiness action |
| --- | --- | --- | --- |
| `twse_openapi_official_candidate` | TWSE daily close, daily trading information, TWII/index baseline discovery | Accepted candidate for bounded validation only; not accepted for ingestion | Build a terms, attribution, cadence, and field-contract matrix without market rows |
| `twse_index_official_candidate` | TWII and exchange-level index daily close | Highest first repair value for the public Beta market atmosphere card | Prepare index-specific field contract for `trade_date`, index close, timezone, revision, and missing-session handling |
| `twse_equity_daily_candidate` | Listed equity daily close and trading facts | Candidate for listed-stock coverage universe; not ready for full coverage claims | Define batch rules for listed equities without printing symbol row lists |
| `twse_etf_daily_candidate` | ETF daily close and trading facts, starting with core ETF context | Candidate after index lane; ETF terms and field contract must be explicit | Prepare ETF-specific source owner, field mapping, and attribution checks |
| `tpex_official_candidate` | OTC expansion after TWSE listed-equity lane | Later parallel lane, not public Beta priority | Keep as metadata-only future expansion route |

## 3. Coverage Universe Roadmap

The public Beta should not claim "all Taiwan market data" until the universe is explicit and measured.

| Coverage layer | Public Beta role | No-fetch readiness target | Promotion blocker |
| --- | --- | --- | --- |
| Index baseline | 30-second market atmosphere and risk context | TWII daily close contract and synthetic mock consumer shape | Source terms, attribution, field contract, bounded execution authorization |
| Core ETF context | Bridge from market atmosphere to investable broad-market proxy | ETF daily close/trading field contract for selected core ETFs | ETF source-rights and attribution evidence |
| Batch 1 listed equities | Explainable initial stock detail coverage | Batch-selection policy: liquidity, market-cap, sector representation, existing product-visible symbols | Universe definition and source/field acceptance |
| Full listed equities | Later broad Taiwan stock coverage | Partition by exchange/listing state and batch windows | Rights, rate/fair-use, backfill strategy, quality/readback proof |
| OTC/TPEx expansion | Later market completeness | Separate TPEX source and field matrix | TPEX rights and field contract |

## 4. Mock Runtime Consumer Readiness

PM mainline can safely prepare these runtime concepts now:

- Source lane labels: `twse_openapi_official_candidate`, `twse_index_official_candidate`, `twse_equity_daily_candidate`, `twse_etf_daily_candidate`, `tpex_official_candidate`.
- Coverage categories: `index_baseline`, `core_etf_context`, `listed_equity_batch1`, `listed_equity_full`, `otc_future_expansion`.
- Field-contract placeholders: `trade_date`, `close_value`, `volume`, `turnover`, `source_lane`, `source_terms_status`, `coverage_scope`, `updated_at`.
- Gate states: `mock_consumer_ready`, `terms_review_required`, `field_contract_required`, `coverage_universe_required`, `pm_execution_authorization_required`, `blocked_for_real_runtime`.
- Public copy states: "示範資料", "官方開放資料候選來源審核中", "尚未啟用真實資料", "非投資建議".

These labels are safe for local UI, checks, and handoffs only. They must not be treated as source acceptance or data promotion.

## 5. A1 / A2 / PM Split

| Lane | Owner | Next task | Output |
| --- | --- | --- | --- |
| A1 data/source/coverage | A1 | `prepare_twse_openapi_terms_field_coverage_matrix_no_fetch` | No-fetch matrix for TWSE OpenAPI terms, attribution, cadence, field contract, and coverage universe |
| A1 coverage universe | A1 | `prepare_public_beta_coverage_universe_batch_rules_no_fetch` | Batch rules for index, ETF, listed equity, and later OTC without market rows or stock-id payloads |
| A2 public copy guard | A2 | `prepare_official_candidate_public_copy_guard` | User-facing wording for candidate source, delayed data, mock boundary, attribution placeholder, and non-advice |
| PM runtime mainline | PM | `wire_mock_runtime_source_coverage_labels` | Runtime/UI consumes only synthetic labels and gate states while keeping mock/mock |

## 6. Stop Lines

- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch market rows.
- Do not store market rows.
- Do not commit market rows.
- Do not print raw payloads.
- Do not print secrets.
- Do not output stock-id row lists.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not claim TWSE OpenAPI is accepted for ingestion.
- Do not claim public Beta real-data coverage is complete.

## 7. Definition of Done for This Handoff

- PM has a no-fetch source and coverage map for the public Beta runtime.
- A1 has the next source-rights and coverage-universe tasks.
- A2 has the next public copy and attribution task.
- Runtime can prepare mock-only source labels without real-data promotion.
- No market row retrieval, Supabase operation, SQL, staging write, `daily_prices` mutation, raw payload, secret, or real score promotion occurred.

## 8. Next Recommended A1 Task

`prepare_twse_openapi_terms_field_coverage_matrix_no_fetch`

Expected output:

- `docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md`
- Optional checker: `scripts/check-a1-twse-openapi-terms-field-coverage-matrix-no-fetch.mjs`

Task requirements:

- Use source references and metadata summaries only.
- Record terms location, attribution requirement, automation/cadence posture, public display/redistribution posture, and field-contract gaps.
- Include index, ETF, listed equity, and later OTC coverage layers.
- Do not retrieve or store market rows.
- Keep runtime `publicDataSource=mock` and `scoreSource=mock`.
