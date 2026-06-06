# GOAL Parallel Workstream Adjustment

Status: `goal_parallel_workstream_adjustment_ready_data_mainline_with_parallel_support`

Date: 2026-06-07

## CEO Decision

The current project goal should stay focused on finishing the MVP data coverage path, but it should no longer force every launch prerequisite into the same blocking lane.

The adjusted GOAL should use a two-layer structure:

1. Main success condition: complete Level 1 MVP row coverage from `182/360` to `360/360`.
2. Parallel support condition: let A1 and A2 prepare non-blocking packets that reduce the next-stage delay without redefining the current goal.

This keeps the critical path moving while avoiding another slow governance loop.

## PM Workstream Split

### PM Mainline

PM owns the current GOAL execution and integration.

Current focus:

- complete MVP row coverage for `TWII`, `0050`, and `006208`;
- keep bounded write/readback/post-run review discipline;
- keep `publicDataSource=mock`;
- keep `scoreSource=mock`;
- decide when A1/A2 outputs are accepted into mainline.

PM should not wait for A1/A2 when a safe mainline data step is available.

### A1 Background Lane

A1 is reassigned to the next data-expansion support lane:

- prepare the Level 2 Taiwan all-listed universe manifest packet;
- define all-listed denominator policy without reusing the MVP `360` denominator;
- keep stock master evidence such as `1086` listed-stock records visible;
- define batch, retry, gap, readback, and scoring readiness criteria;
- keep source-rights blockers explicit.

A1 must not execute SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch raw market data, store raw market data, print secrets, print row payloads, promote public source, or set real score source.

### A2 Background Lane

A2 is reassigned to launch-trust support while data coverage continues:

- prepare public trust and legal-disclosure copy worklists;
- keep users clear about mock/real state, data freshness, source coverage, missing data, risk limits, and non-investment-advice posture;
- separate now-safe copy work from final visual polish;
- avoid investment-indicator implementation until the data foundation is stable.

A2 must not edit A1 data evidence, Supabase scripts, runtime promotion toggles, score-source logic, raw market evidence, or data write paths.

## Revised GOAL Prompt

Use this as the next `/goal` objective when the active goal needs to be recreated:

```text
完成「資料覆蓋率補齊」主線，目標是把 Level 1 MVP row coverage universe 從目前 182/360 推進到 360/360，並保持 publicDataSource=mock 與 scoreSource=mock，直到另外的 runtime promotion gate 正式接受。

完成時應該是：
1. MVP universe 明確維持為 TWII、0050、006208、2330、2382、2308，每檔 60 個交易 session，分母 360。
2. TW equity 已完成 180/180 的證據被保留，剩餘 TWII、0050、006208 的缺口被用 bounded write/readback/post-run review 補齊或明確阻塞。
3. 每一次 Supabase/daily_prices 相關動作都只能在已有 gate、精確命令、sanitized aggregate output、post-run review 的條件下執行。
4. A1 可在背景準備 Level 2 台灣全上市 universe manifest packet，但不得把 Level 2 當成本 GOAL 完成條件。
5. A2 可在背景準備公開信任與揭露 copy worklist，但不得把 UI polish 或投資指標實裝放進本 GOAL 成功條件。

測試手段採輕量優先：
- 每個切片先跑該切片 checker。
- 只有在整合或高風險變更後才跑 review gate。
- 必要時跑 JSON check、readable status check、git diff --check。
- 不為了驗證而重跑遠端操作；遠端操作只能在 gate 明確允許且有一次性命令時執行。

禁區邊界：
- 不得未經 gate 跑 SQL。
- 不得未經 gate 寫 Supabase。
- 不得未經 gate 建立 staging rows 或修改 daily_prices。
- 不得抓取、儲存、提交 raw market payload。
- 不得輸出 secrets、row payload、stock id payload。
- 不得跳過 post-run review。
- 不得設定 publicDataSource=supabase。
- 不得設定 scoreSource=real。
- 不得把 staging 成功或部分 row coverage 直接宣稱為正式上線完成。

每步記錄：
- CEO decision。
- PM selected route。
- command executed 或 skipped reason。
- sanitized aggregate counts。
- accepted/rejected/blocked 狀態。
- mock/real promotion 狀態。
- next route。

卡住時：
- 若是 schema、credential、source-rights、資料品質、權限、缺口策略、Supabase 連線、row conflict、或安全邊界問題，停止該動作。
- 回報根因、目前已完成證據、可選路線，以及 CEO 建議。
- 不要用重跑遠端操作來嘗試碰運氣。
```

## Verification Policy

To avoid unnecessary slowdown:

- local document/checker slices may run only their own checker plus `git diff --check`;
- integration slices should run readable/current status checks;
- data write/readback slices must run their specific precheck, exact one-attempt command, and post-run review checker;
- full review gate should be reserved for milestone integration, not every small wording change.

## Current CEO Recommendation

Keep the active data-coverage GOAL conceptually unchanged, but operate it with this narrower success condition and parallel A1/A2 support lanes. The next PM mainline action should remain Level 1 MVP coverage completion, while A1 prepares Level 2 all-listed expansion and A2 prepares public trust/disclosure copy without blocking the data line.
