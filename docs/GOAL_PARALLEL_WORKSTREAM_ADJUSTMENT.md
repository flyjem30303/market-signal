# GOAL Parallel Workstream Adjustment

Status: `goal_launch_engineering_parallel_workstreams_ready`

Date: 2026-06-07

Owner: CEO / PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO sets the active GOAL to push the project toward `pre_launch_executable_state`, not toward a narrow document-only checkpoint.

The project should move as a formal launch-engineering program with parallel lanes:

1. PM owns the mainline, integration, runtime, launch engineering, and acceptance decisions.
2. A1 owns the data / Supabase / market evidence support lane.
3. A2 owns the public trust / UX readability / disclosure support lane.
4. I stays as launch / ops guard for deployment, environment, credentials, DNS, monitoring, rollback, and account risks.
5. PM must assign new A1/A2 tasks whenever their current background tasks finish.
6. The GOAL should move toward formal launch engineering, including data realification, Supabase closed loop, coverage closure, runtime promotion readiness, public Beta readiness, and launch preflight.

This avoids the previous bottleneck where row coverage, runtime readiness, public trust copy, and Beta deployment preparation were treated as one slow sequential lane.

## Current GOAL Definition

Use this as the durable GOAL prompt if the active goal must be recreated:

```text
目標：把專案推進到「正式上線前可執行狀態」，完成資料真實化、Supabase 寫入/讀回閉環、資料覆蓋率主路徑、Runtime real promotion gate、公開 Beta 部署準備與上線工程前置檢查。

1. 完成時應該是什麼狀態
網站核心頁可正常瀏覽；資料面有可驗證的真實化閉環；Supabase write/readback/post-run review/rollback 流程可操作；Coverage Universe Roadmap 已可驅動補齊工作；Runtime 能清楚判斷 mock/real 狀態；promotion gate 能決定何時切到 real；公開 Beta 部署前需要的 operator values、env、rollback、monitoring、法務揭露與信任文案已準備到可執行。

2. 測試手段
小切片跑 focused checker；資料/DB/Runtime 邊界變更跑對應 gate；Runtime 或 TypeScript 變更才跑 route health / tsc；重要里程碑跑 review gate。避免每一步都做全量驗證，驗證要服務推進，不讓治理拖慢主線。

3. 禁區邊界
可以：做 bounded Supabase readonly attempt、sanitized artifact、schema/cache/readiness 檢查、no-secret operator packet、local checker、文件與 gate、mock/real promotion 準備。
不可以：輸出 secret、commit raw market data、未經 gate 直接設定 publicDataSource=supabase 或 scoreSource=real、未經安全界線大量寫入 daily_prices、跳過 rollback/post-run review 直接宣稱 real 上線完成。

4. 每步要記錄什麼
記錄 CEO decision、PM route、A1/A2 任務分派、執行結果、accepted/rejected、mock/real 狀態、Supabase/資料覆蓋率影響、下一步 route、是否影響正式上線百分比。

5. 卡住時要暫停並回報
本機錯誤、checker、文件、Runtime 問題由 PM 自行修到可推進；只有遇到帳號權限、金鑰、付款、DNS、法務授權、資料來源權利、不可安全處理的 Supabase write 風險時才暫停回報。
```

## Execution Ratio

CEO sets the default execution ratio as a rolling baseline, not a fixed rule:

| Lane | Default ratio | Current route | PM adjustment rule |
| --- | ---: | --- | --- |
| PM mainline | 60% | Runtime, launch engineering, integration, gates, local health | Raise to 80% when A1/A2 are externally blocked |
| A1 | 30% | Coverage, source rights, Supabase/data evidence, sanitized artifacts | Raise when a bounded data/readback step is ready |
| A2 | 10% | Launch-blocking trust copy and public readability | Raise only when public comprehension or legal trust is blocked |

Visual polish and design micro-tuning remain after runtime, data, and launch-readiness foundations unless the issue blocks comprehension, legal clarity, or route usability.

## Mainline PM Route

PM should move the mainline in this order when safe work is available:

1. Keep core public pages browsable and free of Internal Server Error.
2. Keep runtime state readable: `publicDataSource=mock`, `scoreSource=mock`, coverage state, freshness limits, and promotion blockers.
3. Turn accepted data evidence into promotion-gate inputs without promoting public source or score.
4. Prepare executable Beta launch packets only after safe non-secret operator values are available.
5. Run focused local checks for small slices and review gate for milestone integration.
6. Record every route decision in project files when it changes launch direction.

Current PM next route: `runtime_local_route_health_refresh_before_executable_packet_or_data_gate`.

## A1 Support Lane

A1 owns Data / Supabase / Market Evidence.

Current A1 route:

- TWII source-rights intake or vendor fallback evidence.
- ETF source-rights outcome support when evidence exists.
- TW equity candidate artifact hygiene when PM asks for data-readiness proof.
- Coverage closure support from `182/360` toward `360/360`.

A1 must stop before SQL execution, Supabase writes, staging row creation, broad `daily_prices` mutation, raw market-data fetch/ingestion/storage, secret output, row payload output, stock id payload output, public source promotion, or `scoreSource=real`.

## A2 Support Lane

A2 owns Frontend / UX Readability / Public Copy QA.

Current A2 route:

- Keep public trust copy understandable for mock-only, partial coverage, missing/delayed data, model limits, freshness limits, and non-investment-advice wording.
- Repair only launch-blocking public copy regressions.
- Defer visual polish unless comprehension or legal clarity is blocked.

A2 must stop before data evidence edits, Supabase logic, source promotion toggles, score-source promotion, raw market evidence, or visual-only redesign.

## Dynamic Reassignment Rule

When A1 or A2 completes a task:

1. PM reviews the output and checker result.
2. PM records `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`.
3. PM integrates accepted output only after the relevant local checker passes.
4. PM immediately assigns the next highest-value side-lane task when useful work remains.
5. PM continues mainline work without waiting when safe.

## Verification Policy

To keep velocity:

- local document/checker slices may run only their own checker plus `git diff --check`;
- JSON or package script edits should run `check:json` only when JSON shape is affected;
- A1/A2 output integration should run that lane checker before PM accepts it;
- Runtime / launch / data milestones should run the focused checker plus `check:review-gates`;
- Runtime or TypeScript edits should run route health or `tsc` only when they are actually touched;
- bounded remote attempts or write/readback slices must run their specific precheck, exact one-attempt command, post-run review, and aggregate readback verification;
- full review gate is reserved for milestone integration, not every wording or status note.

## Current Accepted Baseline

- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Current Level 1 MVP row coverage is `182/360`.
- TW equity first closed loop is accepted at `180/180`.
- TWII remains `0/60` and not approved for probe or ingestion.
- ETF remains `2/120`, with `118` missing rows.
- Public Beta can continue as mock-visible local Beta preparation.
- Real data and real score promotion remain blocked until separate gates pass.

## Hard Stops

This GOAL adjustment does not authorize:

- SQL execution;
- Supabase write;
- staging row creation;
- broad `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- secret output;
- raw payload, row payload, or stock id payload output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- deployment, DNS, SSL, platform env, or hosting project mutation;
- public launch completion claim.

Any later remote/read/write/deploy step must have its own named gate, exact command, post-run review, sanitized aggregate evidence, rollback path, and stop line.

## CEO Recommendation

Continue under this GOAL with larger coherent slices. Do not spend more time on broad governance unless it unlocks a concrete execution step. The next best mainline slice is `runtime_local_route_health_refresh_before_executable_packet_or_data_gate`, while A1 keeps source-rights and coverage evidence warm and A2 handles only launch-blocking public trust readability.

## Verification

Focused verification:

- `node scripts/check-goal-parallel-workstream-adjustment.mjs`
- `cmd.exe /c npm run check:goal-parallel-workstream-adjustment`
- `git diff --check`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
