# A2 Shared Trust Copy Patch Ready Queue

Status: `a2_shared_trust_copy_patch_ready_queue`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Source plan: `docs/A2_PUBLIC_TRUST_COPY_PATCH_PLAN.md`
Mode: `local_only_copy_ready_queue`

## Purpose

This ready queue extracts the three highest-priority shared public trust copy patches from `docs/A2_PUBLIC_TRUST_COPY_PATCH_PLAN.md`.

The queue is limited to copy-only public readability work. It does not change runtime behavior, data source state, scoring, source approval, evidence gates, data ingestion, deployment state, PM mainline data gate files, or any A1/PM checker output.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, import, store, commit, or print raw market data.
- Do not read or output secrets.
- Do not touch PM mainline data gate files.
- Do not touch A1 source-rights artifacts, candidate artifacts, row-coverage artifacts, or checker outputs.
- Do not mutate `daily_prices` or any staging table.
- Do not run `db:*`, `fetch:*`, seed, ingestion, Supabase, readonly remote, or raw-market scripts.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim live market-data approval, complete coverage, source-rights approval, validated forecast quality, buy/sell/hold advice, or personalized investment advice.

## Ready Queue

| Priority | Patch | Modification scope | Suggested Chinese copy | Needed checker / verification | Deferrable UI polish | Non-executable boundary |
|---:|---|---|---|---|---|---|
| 1 | Shared runtime state strip | Copy in the shared runtime-state strip or shared public trust banner that appears across public routes. Keep technical flags visible as secondary support text. Do not alter state wiring, config, runtime source selection, scoring, or promotion gates. | `目前公開頁面為 Beta／mock-only 展示，資料來源仍是 publicDataSource=mock，分數來源仍是 scoreSource=mock。這代表畫面用來說明產品流程，不代表即時市場資料已核准、不代表覆蓋完整、不代表模型預測已驗證，也不是買進、賣出、持有或個人化投資建議。` | Run a local copy/readability check after implementation, preferably `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness` and `cmd.exe /c npm run check:a2-beta-phrase-set-and-shared-trust-surface-patch-scope`. If route rendering is touched later, add `cmd.exe /c npm run check:public-beta-core-route-quick-proof` or another local-only route health checker. | Icons, badge shape, strip spacing, tooltip phrasing, responsive hierarchy, and typography tuning can wait after the stop-line copy is accepted. | Copy-only. No runtime flag changes, no source promotion, no score promotion, no PM/A1 data gate edits, no Supabase, no SQL, no raw market data, no secrets. |
| 2 | Data freshness strip | Copy in the shared data freshness strip, freshness status copy, or freshness explanation near public market context. Keep it reader-facing and avoid implying freshness equals approval. Do not change freshness repository behavior, fallback logic, timestamps, or data files. | `資料新鮮度只提供畫面脈絡，不能解讀為即時行情已上線、資料品質已通過、來源權利已核准，或 real score 已啟用。若資料缺漏、延遲或暫時無法確認，頁面解讀應以 mock-only Beta 狀態為準。` | Run local freshness/copy checks only: `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness`, `cmd.exe /c npm run check:public-freshness-runtime-boundary`, and, only if UI wiring is touched later, `cmd.exe /c npm run check:freshness-state-ui`. Verification should confirm no remote read, no raw row output, and no source-state promotion. | Timestamp layout, skeleton state, badge color, hover details, compact/mobile copy variants, and richer unavailable-state visuals can wait. | Copy-only. No freshness fetch, no backfill, no data file update, no Supabase call, no readonly remote validation, no raw rows/timestamps from market payloads, no `DATA_FRESHNESS_SOURCE` promotion. |
| 3 | Footer | Public footer labels and shared disclosure text that appear globally. Keep links calm and clear. Do not change routes, analytics, consent, privacy behavior, or legal policy meaning. | `Beta／mock-only 展示。資料可能不完整、延遲或尚未取得公開使用核准；本服務內容不是買進、賣出、持有建議，也不是個人化投資建議。請搭配方法說明、免責聲明、隱私權政策與服務條款閱讀。` | Run local copy and route smoke checks after implementation: `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness`, `cmd.exe /c npm run check:a2-public-trust-launch-copy-handoff`, and, if footer routes/links are touched later, `cmd.exe /c npm run check:localhost-content-health` or `cmd.exe /c npm run check:public-beta-core-route-quick-proof`. | Link grouping, visual hierarchy, footer columns, responsive wrapping, icon polish, and legal-page layout cleanup can wait unless text clipping blocks readability. | Copy-only. No route contract changes, no tracking/analytics changes, no consent behavior changes, no policy commitment changes, no legal approval claims, no PM/A1 gate edits. |

## Patch Acceptance Criteria

- The patch changes only public copy or copy-token usage for the named shared surface.
- The copy says the public site remains Beta/mock-only and preserves `publicDataSource=mock` and `scoreSource=mock`.
- The copy explicitly avoids live-data approval, complete coverage, source-rights approval, validated forecast, and investment-advice claims.
- The diff does not touch PM mainline data gate files, A1 evidence/source-rights artifacts, candidate artifacts, data files, SQL files, secrets, environment files, or Supabase/runtime source code.
- Verification stays local-only and avoids `db:*`, `fetch:*`, seed, ingestion, Supabase, readonly remote, raw-market, and secret-loading commands.

## Handoff Note

This document is a queue artifact only. It did not execute SQL, connect to Supabase, write Supabase, fetch/import/store raw market data, print raw payloads, read secrets, change runtime flags, alter scoring, mutate `daily_prices`, or modify PM/A1 gate artifacts.
