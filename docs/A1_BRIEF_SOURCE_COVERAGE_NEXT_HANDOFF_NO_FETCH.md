# A1 BRIEF Source Coverage Next Handoff No-Fetch

Updated: 2026-06-13

Status: `a1_brief_source_coverage_next_handoff_no_fetch_ready`

Owner: A1 Data / Source / Coverage support lane

Scope: `brief_source_coverage_next_handoff_without_market_row_fetch`

## 1. Current Source And Coverage Summary

The public Beta can continue product/runtime work while data realification stays in a controlled mock boundary.

Current posture:

- `TWSE OpenAPI` remains the preferred legal/free/automatable candidate lane for daily close and daily trading information.
- `TWII` remains the first index-baseline lane because it supports the 30-second market atmosphere card.
- `0050` and `006208` remain core ETF context candidates, but ETF-specific source rights, attribution, and field contracts are not complete.
- `2330`, `2382`, and `2308` remain Batch 1 listed-equity mock anchors only; they are not proof of full listed-equity coverage.
- Full listed-equity and OTC coverage are future universe-expansion lanes, not current public real-data claims.

This handoff is aggregate/planning-only. It does not contain market rows, stock-id row lists, raw payloads, secrets, endpoint output, or source-derived price values.

## 2. Next Smallest Data Task

Recommended next A1 task:

`prepare_public_beta_source_coverage_gap_matrix_no_fetch`

Expected output:

- source lane list: `index_baseline`, `core_etf_context`, `listed_equity_batch1`, `listed_equity_full`, `otc_future_expansion`;
- per-lane source-rights status: `candidate`, `checking`, `blocked`, or `future`;
- per-lane field-contract readiness: date, close, volume, turnover, instrument identity, source timestamp, revision policy, missing-session policy;
- per-lane public display posture: mock-only, delayed display candidate, attribution required, or blocked;
- PM-safe runtime labels that can be shown without real-data promotion.

The output should stay no-fetch and no-execution. It may cite already recorded local planning docs, but it must not retrieve or store market rows.

## 3. PM Runtime Integration Language

PM may use these phrases on public runtime surfaces:

- `資料來源與覆蓋範圍仍在準備中`
- `目前是 mock 示範，不是即時真實資料`
- `大盤基準優先，其次是核心 ETF 與第一批個股`
- `完整上市股票覆蓋尚未開放`
- `來源、欄位、更新節奏與公開引用都通過後，才會考慮資料升級`
- `不提供買賣建議`

PM should avoid these phrases on public runtime surfaces:

- `來源已核准`
- `全市場資料已完成`
- `TWSE OpenAPI 已可正式 ingestion`
- `Supabase 已寫入`
- `scoreSource=real`
- `即時真實資料`
- `買進` or `賣出`

## 4. Boundaries

This handoff does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- stock-id row-list output;
- secrets or API keys;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- investment advice.

Runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`

## 5. Suggested Checker

Suggested checker:

`scripts/check-a1-brief-source-coverage-next-handoff-no-fetch.mjs`

The checker should verify:

1. this document exists and has status `a1_brief_source_coverage_next_handoff_no_fetch_ready`;
2. the source and coverage lanes are present;
3. the next task is `prepare_public_beta_source_coverage_gap_matrix_no_fetch`;
4. PM-safe runtime language includes mock boundary, source/coverage limits, and non-advice wording;
5. forbidden execution or promotion language is absent;
6. the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.

## 6. PM Decision

Recommended PM intake decision:

`accept_a1_brief_source_coverage_next_handoff_no_fetch`

Meaning:

PM may use this as the next A1 background task definition and may integrate only the public-safe labels into runtime surfaces. This decision does not approve data fetching, SQL, Supabase read/write, staging writes, `daily_prices`, real scoring, or public real-data promotion.
