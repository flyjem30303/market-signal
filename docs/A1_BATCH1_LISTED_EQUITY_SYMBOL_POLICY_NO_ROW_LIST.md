# A1 Batch 1 Listed-Equity Symbol Policy No-Row-List

Updated: 2026-06-12

Status: `a1_batch1_listed_equity_symbol_policy_ready_no_row_list`

Owner: A1 Data / Source / Coverage support lane

Scope: `batch1_listed_equity_symbol_policy_no_fetch_no_row_list`

## 1. Purpose

This packet defines how PM may plan the first listed-equity Batch 1 universe without outputting a full stock-id list, fetching market rows, running SQL, connecting to Supabase, writing staging rows, mutating `daily_prices`, or promoting real public data.

The goal is to move the public Beta dashboard from a few hard-coded demo stocks toward a controlled first batch that supports stock-detail readability and 3-minute action judgment.

Runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- `rawMarketDataFetch=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## 2. Batch 1 Selection Principles

Batch 1 should be small, visible, and explainable.

| Principle | PM-safe meaning | Current state |
| --- | --- | --- |
| Product visibility | Prefer symbols already used on public mock routes or high-visibility dashboard paths. | `policy_ready_no_row_list` |
| Market relevance | Prefer large, well-known listed-equity names that users expect to inspect. | `policy_ready_no_row_list` |
| Sector balance | Avoid making Batch 1 look like a single-sector recommendation list. | `policy_ready_no_row_list` |
| Field clarity | Prefer symbols whose source fields can later map cleanly to date, close, name, volume, and turnover. | `policy_ready_no_row_list` |
| Public Beta safety | Keep the batch as demonstration coverage until source, field, quality, and promotion gates pass. | `policy_ready_no_row_list` |

## 3. Allowed Demo References

PM may reference already visible demo symbols as examples:

- `2330`
- `2382`
- `2308`

These examples are product anchors, not a live source universe, not candidate rows, and not proof of real coverage.

## 4. No-Row-List Rule

A1 must not output:

- the full listed-company universe;
- raw stock-id row lists;
- raw symbol dumps;
- endpoint payloads;
- source rows;
- candidate data rows;
- secret values;
- data-provider account details.

If PM needs a larger Batch 1 later, A1 should return selection criteria and category counts, not raw rows.

## 5. Instrument-Scope Boundaries

Batch 1 is listed equity only.

It must not silently include:

- ETF instruments such as `0050` or `006208`;
- index instruments such as `TWII`;
- OTC symbols;
- futures, options, warrants, funds, crypto, or overseas equities.

ETF, index, and OTC coverage need separate instrument-scope decisions and separate source/field/coverage gates.

## 6. Public Label Guidance

PM may keep these public labels:

- `上市個股批次：展示可用`
- `第一批示範標的`
- `不是完整上市股票覆蓋`
- `正式資料上線前只做示範閱讀`

PM must not claim:

- full listed-equity coverage;
- live quotes;
- official real-data promotion;
- buy/sell recommendations;
- guaranteed returns.

## 7. Next Handoff

Recommended PM intake decision:

`accept_a1_batch1_listed_equity_symbol_policy_no_row_list_for_public_beta_batch_planning`

Meaning:

PM may use this policy to keep the first listed-equity batch controlled and public-readable. This does not authorize full universe export, market-row fetch, SQL, Supabase work, staging rows, `daily_prices` mutation, candidate-row acceptance, real public data display, or real score promotion.

Next safe task:

`prepare_batch1_listed_equity_mock_runtime_policy_labels`

Definition of done:

- Batch 1 selection principles are recorded.
- Demo references are limited to already visible mock symbols.
- Full stock-id row-list output is explicitly blocked.
- ETF/index/OTC instruments are explicitly out of scope.
- Public labels remain mock-only and non-advice.
- Stop lines preserve no-fetch, no-SQL, no-Supabase, no-`daily_prices`, no-raw-data, `publicDataSource=mock`, and `scoreSource=mock`.
