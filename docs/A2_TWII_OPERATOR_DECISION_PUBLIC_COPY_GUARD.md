# A2 TWII Operator Decision Public Copy Guard

Status: `a2_twii_operator_decision_public_copy_guard_ready`

Date: 2026-06-13

Owner: A2 Public Copy / Product Safety support lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This A2 guard defines safe wording for TWII operator readonly decision readiness. It helps PM describe the decision packet without implying real data activation, source-rights approval, execution, official endorsement, complete coverage, or investment advice.

This guard is copy-only. It does not approve source rights, does not authorize execution, does not connect to Supabase, does not call TWSE OpenAPI, does not fetch market rows, and does not promote runtime data.

## Applies To

This guard applies to:

- Home data-readiness copy;
- `/briefing` data-readiness copy;
- stock runtime source/cadence copy;
- internal PM status summaries;
- launch board summaries;
- future operator packet labels.

It does not apply to:

- SQL;
- Supabase reads;
- Supabase writes;
- market-data endpoint calls;
- data ingestion;
- row acceptance;
- source promotion;
- score promotion.

## Allowed Wording

Allowed public or PM-safe wording:

- `TWII 來源證據已整理，仍等待明確操作決策`
- `目前只顯示 mock 狀態，尚未啟用真實資料`
- `資料來源與欄位契約正在進入決策準備`
- `若未來授權，也會先經過單次 bounded readonly 檢查與 post-run review`
- `公開頁不提供買賣建議，也不保證即時性或完整覆蓋`
- `目前分數來源仍是 mock`
- `目前公開資料來源仍是 mock`
- `TWII 更新節奏以每日收盤後資料為候選方向，尚未切換到正式資料源`
- `operator decision packet 是決策準備，不是執行結果`

Allowed internal PM wording:

- `operator readonly decision packet ready no-execution`
- `waiting for explicit operator decision`
- `A1 prerequisites ready no-execution`
- `A2 copy guard ready`
- `publicDataSource=mock`
- `scoreSource=mock`
- `real promotion blocked`

## Blocked Wording

Blocked public or internal wording:

- `TWII 真實資料已啟用`
- `已取得官方授權`
- `已完成 Supabase 讀取`
- `已寫入 daily_prices`
- `已完成 row coverage`
- `已可即時追蹤 TWII`
- `官方認證資料`
- `保證資料完整`
- `已切換 publicDataSource=supabase`
- `已切換 scoreSource=real`
- `系統建議買進`
- `系統建議賣出`
- `保證報酬`
- `已執行 bounded readonly attempt`

## Public Copy Pattern

Preferred public copy pattern:

1. Name the visible state.
2. Explain what is known.
3. Explain what is not yet active.
4. Give the safe next observation.

Example:

> TWII 來源證據已整理，仍等待明確操作決策。目前頁面維持 mock 資料與 mock 分數；若未來授權，會先經過單次 bounded readonly 檢查與 post-run review，再決定是否能進入下一階段。

## PM Summary Pattern

Preferred PM summary pattern:

> TWII operator readonly decision packet is ready for future review only. A1 prerequisites are no-execution and A2 copy guard is ready. The current runtime remains `publicDataSource=mock` and `scoreSource=mock`; no SQL, Supabase read/write, market-data fetch, `daily_prices` mutation, source promotion, score promotion, or investment advice is authorized.

## A2 Acceptance Rules

A2 may accept copy only if it:

- preserves mock-only runtime state;
- says the packet is readiness or decision preparation, not execution;
- avoids official endorsement claims;
- avoids complete coverage claims;
- avoids real-time claims;
- avoids buy/sell advice;
- avoids row payload or raw source references;
- keeps update cadence as candidate wording;
- keeps promotion gated and separate.

A2 must reject or repair copy if it:

- implies data is already live;
- implies legal/source-rights approval is complete;
- implies Supabase read/write has occurred;
- implies `daily_prices` was modified;
- implies real score has replaced mock score;
- implies users should trade based on the signal;
- exposes raw market data, source payloads, stock-id lists, secrets, or row payloads.

## PM Route

PM route after accepting this A2 guard:

`operator_decision_copy_guard_ready_wait_for_explicit_operator_decision`

If PM later integrates public wording, PM must keep it:

- brief,
- reader-facing,
- non-investment-advice,
- mock-only,
- no-execution,
- no-real-time,
- no-official-endorsement.

## Hard Stop Lines

This guard does not authorize:

- SQL execution,
- Supabase connection,
- Supabase reads,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- OpenAPI call,
- CSV download,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- runner execution,
- parser execution,
- candidate market-row artifact generation,
- raw payload output,
- row payload output,
- stock-id row-list output,
- secret output,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- official endorsement claims,
- investment advice claims.

## Completion Definition

This A2 guard is complete when:

- allowed wording is named;
- blocked wording is named;
- public copy pattern is named;
- PM summary pattern is named;
- A2 acceptance rules are named;
- PM next route is named;
- hard stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
