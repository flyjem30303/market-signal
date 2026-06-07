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
請把目標推向「正式上線工程完成」。執行模式採三線並行：PM 是主線與唯一整合 owner；A1 是 Data / Supabase / Market Evidence 副線；A2 是 Frontend / UX Readability / Public Copy QA 副線。A1 或 A2 完成任務時，PM 要立刻審核為 accepted / rejected / needs_bounded_repair / blocked，並在有安全工作可做時重新指派下一個任務。PM 不必等待 A1/A2 才推進主線。

完成時應該是什麼狀態：
1. Level 1 MVP row coverage 有明確完成或阻塞狀態，目標仍是 360/360；任何資料補齊都要有 source-specific gate、sanitized aggregate evidence、post-run review、readback 或 scoring gate。
2. Runtime promotion gate 清楚記錄 mock-to-real 的條件；publicDataSource=mock / scoreSource=mock 在 promotion gate 通過前不得切換。
3. Ingestion / backfill 流程具備 candidate artifact、staging/write/readback、rollback、retention、duplicate/overlap policy 與 post-run review。
4. 投資指標與決策輔助只做 launch-safe 呈現；真實資料與正式分數未通過前，不宣稱正式投資建議或真實績效。
5. 公開網站信任與法務揭露可讀、可驗證，涵蓋 mock-only、partial coverage、missing/delayed data、資料新鮮度、模型限制、非投資建議。
6. 正式上線工程具備 env、Supabase/Vercel/Cloudflare 或同等平台、health check、monitoring、rollback、DNS/SSL、secret handling 與 launch checklist。

提供測試手段：
- 小型文件或 checker 切片：跑該切片 checker 與 git diff --check。
- JSON 或 package 變更：跑 check:json。
- A1/A2 整合：先跑該 lane checker，再由 PM 更新 project status / workstream board。
- Runtime / launch / data milestone：跑相關 checker 與 review gate。
- bounded remote attempt 或 write/readback：必須先有 precheck、exact one-attempt command、post-run review checker、aggregate readback verification。

禁區邊界：
- 沒有獨立 gate 不執行 SQL。
- 沒有獨立 gate 不寫 Supabase、不建立 staging rows、不修改 daily_prices。
- 不輸出 secrets、raw market payload、row payload、stock id payload。
- 不跳過 post-run review。
- promotion gate 未通過前，不設定 publicDataSource=supabase。
- promotion gate 未通過前，不設定 scoreSource=real。
- A1/A2 不獨立 commit；PM 是唯一整合 owner。

每步要記錄什麼：
- CEO decision。
- PM selected route。
- A1/A2 assignment 或 completion review。
- command executed 或 skipped reason。
- sanitized aggregate counts。
- accepted / rejected / needs_bounded_repair / blocked。
- mock / real promotion 狀態。
- next route。

卡住時要暫停並回報：
- 如果卡在 schema、credential、source-rights、Supabase relation、row conflict、DNS、secret、payment、account permission，先停止該遠端或權限動作並回報。
- 如果只是 local checker、文案、文件、UI 可讀性或 route health 問題，CEO/PM 可自行修正後繼續。
- 如果同一阻塞連續重複三次且無法安全推進，再標記 blocked。
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
