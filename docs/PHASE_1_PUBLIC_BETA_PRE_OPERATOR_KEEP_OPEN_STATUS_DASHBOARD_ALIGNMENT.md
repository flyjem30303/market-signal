# Phase 1 Public Beta Pre-Operator Keep-Open Status Dashboard Alignment

Updated: 2026-06-13

Status: `phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready`

Owner: CEO / PM / A2 / A3

## Purpose

This artifact translates the internal keep-open, repair, no-go, and not-run result model into a safe status-dashboard alignment before any operator action or keep-open decision is used.

It keeps two surfaces separate:

- PM/A3 internal status: may use explicit execution states such as `KEEP_OPEN_WITH_DEFERRALS`, `REPAIR_THEN_RECHECK`, `ROLLBACK_OR_NO_GO`, and `NOT_RUN`.
- Public user-facing status: must use plain investor language and must not expose execution-state names, operator workflow, packet language, SQL/Supabase details, raw payload wording, or role labels.

## Internal State To Public Message Map

| Internal state | PM meaning | Public status language |
| --- | --- | --- |
| `KEEP_OPEN_WITH_DEFERRALS` | Phase 1 can stay open while accepted deferrals continue in parallel. | `目前可用：可用 30 秒快讀市場氣氛；資料仍為示範，正式資料條件完成前請保守解讀。` |
| `REPAIR_THEN_RECHECK` | A bounded route, copy, metadata, runtime, or platform repair is required before keep-open. | `暫時保守：部分資訊正在校正，請以已顯示的更新時間與風險提示為準。` |
| `ROLLBACK_OR_NO_GO` | Public Beta should be held or rolled back because a hard stop line is touched. | `暫不開放：公開頁需完成修復後才會恢復完整顯示。` |
| `NOT_RUN` | No operator action or repair result has been executed yet. | `尚未執行上線確認：目前仍維持公開 Beta 前的示範狀態。` |

## Public Surface Requirements

Public pages may show:

- `目前公開使用狀態`
- `市場氣氛快讀`
- `資料狀態需複核`
- `會員功能下一階段`
- clear update-time and source-status wording
- clear non-investment-advice wording, including `不提供買賣建議`
- clear statement that member-only functions are Phase 2

Public pages must not show:

- `KEEP_OPEN_WITH_DEFERRALS`
- `REPAIR_THEN_RECHECK`
- `ROLLBACK_OR_NO_GO`
- `NOT_RUN`
- `operator`
- `smoke`
- `packet`
- `go/no-go`
- `rollback`
- `publicDataSource`
- `scoreSource`
- `Supabase`
- `SQL`
- `daily_prices`
- `raw market data`
- `raw payload`
- `PM`, `A1`, `A2`, `A3`, or `A4` as user-facing status labels

## PM/A3 Internal Dashboard Requirements

Internal PM/A3 status artifacts may show the execution-state names, but must also record:

- whether route smoke passed;
- whether public claim smoke passed;
- whether public visible residue cleanup passed;
- whether mock/formal-data boundary remains visible;
- whether source/update boundary remains visible;
- whether non-advice boundary remains visible;
- whether accepted deferrals are recorded;
- whether rollback path is known;
- which lane owns repair if the result is not keep-open.

## Workstream Assignment

PM mainline:

- owns the alignment between internal result and public status surface;
- keeps Phase 1 public pages user-facing and readable;
- chooses the next route after pre-operator status alignment.

A1 data/source/coverage:

- continues data-source and coverage work separately;
- does not open raw market-row fetch or Supabase write from this status alignment.

A2 public copy/product safety:

- reviews public wording for non-advice, no real-time claim, no complete-coverage claim, and no official endorsement claim;
- ensures Phase 2 member-only language is future-oriented and non-blocking.

A3 launch/production engineering:

- keeps the operator result, monitoring, rollback, and repair chain internal;
- uses this artifact before reporting keep-open, repair, no-go, or not-run status.

A4 membership MVP planning:

- remains Phase 2 planning-only;
- does not implement login, member-only content, watchlist, alerts, payment, or persistence during this Phase 1 alignment.

## Required Checks

- `cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment`
- `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`
- `cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup`
- `cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
- `cmd.exe /c npx tsc --noEmit`

## Stop Lines

This alignment does not authorize:

- platform deploy;
- DNS change;
- production environment mutation;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- secret or raw payload output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- investment advice;
- buy/sell/hold recommendation;
- Phase 2 membership implementation.

## Next Route

`phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh`

After this alignment passes, PM can return to the A3 operator decision path or refresh the manual platform action checklist without exposing internal status codes to public pages.
