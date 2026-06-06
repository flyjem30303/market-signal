# GOAL Parallel Workstream Adjustment

Status: `goal_launch_engineering_parallel_workstreams_ready`

Date: 2026-06-07

## CEO Decision

CEO changes the next GOAL direction from a single data-coverage lane into a formal launch-engineering program.

The data-coverage work remains important, but the project should now move toward official launch readiness through parallel lanes:

1. PM owns the mainline and integration.
2. A1 owns the data / Supabase / market evidence support lane.
3. A2 owns the public trust / UX readability / disclosure support lane.
4. PM must assign new A1/A2 tasks whenever their current background tasks finish.
5. The GOAL should move toward formal launch engineering, not only toward row coverage.

This avoids the previous bottleneck where data coverage delayed runtime, public trust, launch readiness, and promotion-gate preparation.

## Revised Operating Model

### PM Mainline

PM owns CEO direction, launch-engineering sequencing, runtime/promotion integration, review-gate registration, final acceptance, and Git backup.

PM mainline priority:

- keep Level 1 MVP data coverage moving toward `360/360`;
- prepare runtime promotion gates from mock to real;
- coordinate launch-readiness engineering;
- integrate A1/A2 outputs when their local checks pass;
- keep public source and score source blocked until separate promotion gates pass.

PM should not wait for A1/A2 if a safe mainline task is available.

### A1 Support Lane

A1 owns Data / Supabase / Market Evidence.

Current A1 task type:

- TWII source-rights and candidate artifact readiness;
- ETF source-rights outcome intake;
- Level 2 Taiwan all-listed universe manifest preparation;
- data-quality, readback, row-coverage, source-rights, and sanitized aggregate evidence support.

A1 must stop before SQL, Supabase writes, staging row creation, `daily_prices` mutation, raw market-data fetch/ingestion/storage, secret output, row payload output, public source promotion, or `scoreSource=real`.

### A2 Support Lane

A2 owns Frontend / UX Readability / Public Copy QA.

Current A2 task type:

- public trust and disclosure copy readiness;
- mock/real state wording;
- coverage, freshness, missing-data, risk, and non-investment-advice explanations;
- launch-blocking readability issues;
- post-promotion copy replacement criteria.

A2 must stop before data evidence edits, Supabase logic, source promotion toggles, score-source promotion, raw market evidence, or visual polish that does not unblock launch readiness.

## Dynamic Reassignment Rule

When A1 or A2 completes a task:

1. PM reviews the output.
2. PM accepts, rejects, or asks for a bounded repair.
3. PM immediately assigns the next highest-value side-lane task.
4. PM records the assignment in project docs or status notes.
5. PM continues mainline work without waiting when safe.

A1 and A2 are not passive roles. They are rolling support lanes. Their job is to remove future blockers while PM pushes the main launch path.

## Revised GOAL Prompt

Use this as the next `/goal` objective when the active goal needs to be recreated:

```text
把專案往「正式上線工程完成」推進。採多線進行：PM 是主線與整合 owner；A1 是 Data / Supabase / Market Evidence 副線；A2 是 Frontend / UX Readability / Public Copy QA 副線。當 A1 或 A2 完成任務時，PM 必須即時審核、整合或退回修正，並立刻指派下一個最高價值任務，不能讓副線閒置。

完成時應該是：
1. Level 1 MVP row coverage 從目前狀態推進到 360/360，且每次資料寫入、讀回、計分都有 gate、sanitized aggregate evidence、post-run review。
2. Runtime promotion gate 完成，能清楚判斷何時可從 publicDataSource=mock / scoreSource=mock 進入正式 real-source / real-score；未通過前不得切換。
3. 真實資料 ingestion / backfill 流程具備來源權利、候選 artifact、staging/write/readback、缺口處理、失敗分類與 rollback/retention 規則。
4. 投資指標與決策輔助至少完成 launch-safe 的規格、資料依賴與不誤導使用者的呈現規則；正式實裝不得早於資料與 promotion gate。
5. 公開網站信任與法務揭露完成 launch-ready 文案：資料來源、資料新鮮度、覆蓋率、缺值/延遲、風險、模型限制、非投資建議。
6. 正式上線工程完成部署前置：環境變數、Supabase/Vercel/Cloudflare 或等效平台、健康檢查、監控、rollback、DNS/SSL、secret handling、launch checklist。
7. PM 持續管理 A1/A2 任務：A1 完成後補派資料/來源/證據任務；A2 完成後補派公開信任/可讀性/launch copy 任務；PM 只在整合或風險升級時等待副線。

測試手段：
- 小切片先跑自己的 checker 與 git diff --check。
- JSON 或文件變更跑 check:json 或對應文件 checker。
- runtime / launch / data 整合節點才跑 review gate。
- 資料寫入或 bounded remote attempt 必須跑 precheck、exact one-attempt command、post-run review checker、readback verification。
- 不為了驗證而反覆重跑遠端操作。

禁區邊界：
- 未經明確 gate 不得跑 SQL。
- 未經明確 gate 不得寫 Supabase。
- 未經明確 gate 不得建立 staging rows 或修改 daily_prices。
- 不得輸出 secrets、raw market payload、row payload、stock id payload。
- 不得跳過 post-run review。
- 不得未經 promotion gate 設定 publicDataSource=supabase。
- 不得未經 promotion gate 設定 scoreSource=real。
- 不得把 staging 成功、部分 coverage、或 mock UI 完成宣稱為正式上線完成。
- A1/A2 不得自行 commit 或跨線改動；PM 是唯一整合 owner。

每步要記錄：
- CEO decision。
- PM selected route。
- A1/A2 assignment 或 completion review。
- command executed 或 skipped reason。
- sanitized aggregate counts。
- accepted / rejected / blocked 狀態。
- mock / real promotion 狀態。
- next route。

卡住時：
- 若是 schema、credential、source-rights、資料品質、權限、Supabase 連線、row conflict、部署、DNS、secret、法務揭露、或安全邊界問題，停止該動作。
- 回報根因、已完成證據、可選路線、CEO 建議。
- 若同一阻塞連續三次仍無法推進，才依 blocked audit 規則標記 blocked。
```

## Verification Policy

To keep velocity:

- local document/checker slices may run only their own checker plus `git diff --check`;
- A1/A2 output integration should run that lane's checker before PM accepts it;
- launch-engineering milestones should run readable status, route health, and review gate;
- data write/readback slices must run their specific precheck, exact one-attempt command, post-run review, and aggregate readback verification;
- full review gate should be reserved for milestone integration, not every small wording change.

## Current CEO Recommendation

Recreate the active `/goal` with the launch-engineering prompt above when ready. Until then, PM should operate under this updated file as the project baseline: continue mainline MVP coverage toward `360/360`, assign A1 the next TWII/data-source readiness task, assign A2 the next launch-trust/readability task, and keep moving toward official launch readiness.
