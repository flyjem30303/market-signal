# A1 Public Beta Source Coverage Gap Matrix No-Fetch

Updated: 2026-06-13

Status: `a1_public_beta_source_coverage_gap_matrix_no_fetch_ready`

Owner: A1 Data / Source / Coverage support lane

Scope: `public_beta_source_coverage_gap_matrix_without_market_row_fetch`

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## 1. Purpose

This matrix turns the BRIEF data-realification lane into a concrete no-fetch coverage map.

The public Beta product can keep improving runtime comprehension while data work advances in a controlled order. This document does not prove real data coverage. It tells PM which lanes can be shown as mock-ready, which lanes are candidate real-data lanes, and which lanes remain blocked or future expansion.

This artifact is planning-only. It does not contain market rows, price values, raw payloads, endpoint output, stock-id row lists, API keys, or Supabase records.

## 2. Coverage Matrix

| Lane | Public purpose | Current source candidate | Source-rights status | Field-contract readiness | Public display posture | Next no-fetch task |
| --- | --- | --- | --- | --- | --- | --- |
| `index_baseline` | 30-second broad market atmosphere. | TWSE OpenAPI index-related metadata and already recorded TWII planning evidence. | `candidate` | date, close/level, instrument identity, source timestamp, revision policy, and missing-session policy need PM acceptance before real promotion. | `mock_ready_real_candidate` | prepare TWII source attribution and bounded readonly execution packet only after explicit operator decision. |
| `core_etf_context` | 3-minute action context for investable market proxies. | TWSE/TPEX/public ETF market-price sources remain under review. | `checking` | date, market close price, volume, turnover, instrument identity, attribution, NAV exclusion, holdings exclusion, and premium-discount exclusion remain incomplete. | `mock_only_blocked_for_real_display` | separate ETF market price from NAV, holdings, and issuer-specific fund data before any real display. |
| `listed_equity_batch1` | Stock-detail reading flow anchors for familiar symbols. | Visible demo anchors: 2330, 2382, 2308. | `checking` | date, close, volume, turnover, exchange, symbol identity, sector label, attribution, and corporate-action policy remain incomplete. | `mock_demo_only` | keep Batch 1 small; do not output or infer a full listed-company universe. |
| `listed_equity_full` | All listed companies for scalable coverage. | Not selected. | `future` | universe definition, listing lifecycle, corporate action handling, source cadence, attribution, and delayed-data wording are not ready. | `not_public_ready` | define universe source and rights path after Batch 1 field contract is stable. |
| `otc_future_expansion` | Future OTC and broader Taiwan market expansion. | Not selected. | `future` | OTC universe, field contract, cadence, attribution, and coverage policy are not ready. | `not_public_ready` | open only after listed-equity full coverage rules are accepted. |
| `sector_industry_context` | Explain whether market pressure is broad or concentrated. | Taxonomy source not selected. | `future` | sector taxonomy, membership source, revision policy, and public explanation rules are not ready. | `mock_explanation_only` | prepare taxonomy-source decision packet later; do not block public Beta runtime shell. |
| `derived_indicator_layer` | Explain risk, trend, momentum, and capital-flow style signals. | Depends on accepted base data lanes. | `blocked` | formula, threshold, missing-data handling, lookback windows, attribution, and non-advice copy remain incomplete. | `mock_explanation_only` | define formula contract only after base source lanes are stable. |

## 3. PM-Safe Public Labels

PM may use these labels while runtime stays mock:

- `資料來源與覆蓋範圍仍在準備中`
- `目前是 mock 示範，不是即時真實資料`
- `TWII 可作為第一個市場氣氛候選來源`
- `ETF 與個股仍需分開確認來源與欄位`
- `完整上市股票覆蓋尚未開放`
- `不提供買賣建議`

PM should avoid these labels until a future separate promotion gate passes:

- `資料已完整上線`
- `即時市場資料`
- `TWSE 已授權本網站使用`
- `所有上市櫃股票已覆蓋`
- `publicDataSource=supabase 已啟用`
- `scoreSource=real 已啟用`
- `建議買進`
- `建議賣出`

## 4. Runtime Intake Decision

Recommended PM intake decision:

`accept_a1_public_beta_source_coverage_gap_matrix_no_fetch`

Meaning:

PM may use this matrix to improve public runtime labels and status summaries. PM may not use it to claim real data, complete coverage, source-rights approval, or investment advice.

Recommended next PM route:

`wire_source_coverage_gap_matrix_into_public_runtime_readiness_labels`

Recommended next A1 route:

`prepare_etf_market_price_source_scope_no_fetch`

Recommended next A2 route:

`review_source_coverage_gap_matrix_public_copy_safety`

## 5. Hard Boundaries

This artifact does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint output;
- stock-id row-list output;
- candidate row acceptance;
- row coverage points;
- secret output;
- source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## 6. Completion Evidence

This artifact is complete when a checker proves:

1. all seven coverage lanes are present;
2. every lane has source-rights status, field-contract readiness, public display posture, and next no-fetch task;
3. PM-safe public labels are present;
4. blocked public claims remain listed as avoid labels;
5. the runtime remains `publicDataSource=mock` and `scoreSource=mock`;
6. the artifact is registered in `package.json` and `scripts/check-review-gates.mjs`.
