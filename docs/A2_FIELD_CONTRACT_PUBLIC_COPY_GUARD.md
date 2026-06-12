# A2 Field Contract Public Copy Guard

Updated: 2026-06-12

Status: `a2_field_contract_public_copy_guard_ready`

Owner: A2 Public Copy / Product Safety lane

Scope: `field_contract_public_copy_guard_for_source_coverage_runtime`

## 1. Purpose

This guard keeps field-contract readiness understandable for general investors.

The public surface should explain that formal data fields are still being checked without exposing parser internals, execution language, raw-data workflow, SQL, Supabase, or investment-advice claims.

## 2. Approved Public Phrases

Use these phrases when field-contract status appears on public pages:

- `欄位契約`
- `大盤欄位對照`
- `上市個股欄位對照`
- `大盤資料至少需要交易日與收盤值，才能支撐首頁與 briefing 的市場狀態判讀。`
- `第一批個股需要日期、收盤、成交量與基本識別欄位；缺欄時只能維持 mock 或降級顯示。`
- `資料來源與覆蓋範圍`
- `publicDataSource=mock`
- `scoreSource=mock`

## 3. Avoided Public Phrases

Do not expose these concepts on public pages unless they are inside non-public engineering docs or internal checker output:

- parser internals;
- raw payload;
- row payload;
- staging rows;
- SQL;
- Supabase write;
- `daily_prices`;
- operator authorization;
- execution packet;
- preflight;
- post-run;
- real score;
- complete coverage;
- buy/sell direction.

## 4. Reader Meaning

When users see `欄位契約` or `大盤欄位對照`, it should mean:

1. the page is safe to read as a demonstration;
2. the displayed signal is not formal market data;
3. formal data needs date, close value, instrument identity, session-gap, and revision handling before promotion;
4. the user should use it as observation context, not as a trading instruction.

## 5. Boundaries

This guard does not authorize:

- SQL execution;
- Supabase connection or write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, storage, output, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- buy/sell recommendations;
- investment advice.

## 6. PM Handoff

Recommended PM intake decision:

`accept_a2_field_contract_public_copy_guard_for_source_coverage_runtime`

Meaning:

PM may keep field-contract copy on public pages when it uses the approved phrase set, preserves mock-only boundaries, and improves 30-second/3-minute comprehension. PM should reject or repair copy that turns field-contract status into an engineering console, a real-data claim, or an investment recommendation.
