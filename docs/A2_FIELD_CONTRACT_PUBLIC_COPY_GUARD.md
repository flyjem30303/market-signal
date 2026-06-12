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

- `欄位對照仍在檢查`
- `大盤欄位對照`
- `上市個股欄位對照`
- `日期、收盤值與缺漏交易日規則仍在確認`
- `標的代碼、標的名稱、收盤價、成交量與成交金額仍在確認`
- `正式資料上線前只做示範閱讀`
- `不是即時行情`
- `不是投資建議`

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

When users see `欄位對照仍在檢查`, it should mean:

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
- 保證報酬宣稱。

## 6. PM Handoff

Recommended PM intake decision:

`accept_a2_field_contract_public_copy_guard_for_source_coverage_runtime`

Meaning:

PM may keep field-contract copy on public pages when it uses the approved phrase set, preserves mock-only boundaries, and improves 30-second/3-minute comprehension. PM should reject or repair copy that turns field-contract status into an engineering console, a real-data claim, or an investment recommendation.
