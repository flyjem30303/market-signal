# Project Status

Current PM/A1/A2/I role ownership and parallel workstream boundaries are tracked in `docs/ROLE_WORKSTREAMS.md`.
Current autonomous runtime continuation rules and the next safe mainline slice are tracked in `docs/RUNTIME_AUTONOMY_HANDOFF.md`.
Use the MVP Launch PRD as the product baseline: `docs/MVP_LAUNCH_PRD.md`.

## Readable Current Status - 2026-06-04

- PM progress score: 83%.
- Current mainline: CEO / PM / Runtime Engineering.
- Current execution mode: larger local-only runtime product slices, with A1 and A2 as support lanes and PM as integration owner.
- Runtime state: public runtime remains mock-only.
- Public boundary: `publicDataSource=mock`.
- Score boundary: `scoreSource=mock`.
- Latest completed mainline slice: public runtime/readiness/action/legal copy was made readable, the `/briefing` PM progress panel was rebuilt with readable boundary and allowed/blocked action text, stale localhost 500 recovery was documented, home/stock runtime product summaries plus runtime next-step links were rebuilt with readable mock-only copy, runtime readiness / gate decision display fields were cleaned so guard summaries no longer depend on mojibake text, remaining PM progress panel labels were cleaned around allowed actions, blocked actions, approval boundaries, and execution preconditions, A2 public-copy QA now blocks urgent first-screen internal-token regressions, briefing / weekly / legal first screens now explain mock-only state in plain reader language without exposing raw source tokens, shared trust / freshness / public-state components now use readable Chinese public boundary wording, shared public runtime boundary helper copy was converted from machine phrasing to reader-facing mock-boundary language, home / stock runtime detail cards now use readable Chinese labels while preserving mock-only stop lines, the runtime UI cleanup removed mojibake from home runtime details, stock runtime governance, data freshness strip, runtime product summaries, localhost health config, and related checker contracts, briefing / weekly row coverage panels plus the shared row coverage readiness panel were reframed as reader-facing data-row coverage readiness while preserving bounded readonly and mock-source stop lines, the mainline readonly / row coverage integration gate now consolidates bounded readiness, packet bridge, preexecution packet, and attempt decision into one local-ready / remote-separate answer, site chrome readability now checks global nav, logo, footer trust copy, and mock-source boundaries, public visible language checker now detects private-use mojibake by code point instead of embedding corrupted literals, and shared freshness / public runtime boundary helpers now use readable labels such as `資料新鮮度`, `分數來源`, `新鮮度基準`, and `資料品質閘門` while keeping real-source promotion blocked.
- Latest data-goal slice: data-goal readiness is consolidated into `scripts/report-data-goal-readiness.mjs` and `scripts/check-data-goal-readiness.mjs`, registered in package scripts, localhost full health, and review gates. The report now treats the accepted bounded Supabase readonly post-run review as completed evidence, with data-goal readiness at 96% because the remote path worked but aggregate row coverage remains incomplete. This slice did not run SQL, write data, fetch or store market payloads, print secrets, promote publicDataSource, or set scoreSource=real.
- Latest data-goal evidence-chain update: `data-goal-readiness` now verifies ten evidence rows, adding the accepted bounded readonly post-run review to the bounded readonly, preexecution, provider terms, row coverage acceptance, data quality checklist, source-rights checklist, execution bridge, A1 handoff, and project snapshot checks. The status is `bounded_readonly_attempt_reviewed_aggregate_incomplete`.
- Latest data-goal execution bridge: `data-goal-readiness` still verifies `scripts/report-data-goal-execution-review-bridge.mjs`, which maps any future changed-purpose one-attempt authorization to immediate prechecks, exactly one guarded runner, sanitized aggregate output, immediate post-run review, no retry, and no promotion from the attempt alone. The current CEO posture is not to rerun the generic readonly attempt.
- Latest data-goal completion audit: `scripts/report-data-goal-completion-audit.mjs` now audits the goal requirements directly. It proves local final readiness, bounded readonly prerequisites, execution-to-review bridge, ten evidence rows, bounded readonly sanitized post-run review, publicDataSource boundary, and scoreSource boundary; the remaining blocker is a data coverage route because the accepted readonly result is aggregate_count_incomplete.
- Latest data freshness / quality readiness slice: `scripts/report-data-freshness-quality-mvp-readiness.mjs` and `scripts/check-data-freshness-quality-mvp-readiness.mjs` now consolidate field validity acceptance, data-quality score contract, report-only backfill planning, row coverage evidence acceptance, data-goal readiness, and source-rights placement. Data freshness and quality evidence moved from 64% to 76%; data-quality score lift, row coverage points, public source promotion, SQL, writes, ingestion, and `scoreSource=real` remain blocked.
- Latest data promotion prerequisites readiness slice: `scripts/report-data-freshness-quality-mvp-readiness.mjs` now also consolidates the promotion prerequisites gate, post-run review fields, remote evidence blockers, external approval blockers, and promotion locks. Data freshness and quality evidence moved from 76% to 80%; data-quality score lift, row coverage points, public source promotion, SQL, writes, ingestion, and `scoreSource=real` remain blocked.
- Latest overall-goal slice: `scripts/report-overall-project-100-readiness.mjs` and `scripts/check-overall-project-100-readiness.mjs` now define the current route from 75% overall progress to MVP 100% readiness. The report keeps data readiness at 96%, confirms mock boundaries, and names the highest-value gaps as investment credibility evidence, data coverage route closure, and source-rights disclosure. It explicitly deprioritizes broad visual polish until foundation gates stabilize.
- Latest investment-credibility slice: `scripts/report-investment-credibility-mvp-readiness.mjs` and `scripts/check-investment-credibility-mvp-readiness.mjs` now consolidate model credibility checklist, local Investment review, acceptance gate, and readable investor indicator roadmap evidence. Investment credibility moved from 16% to 46% as local MVP review material only; real scoring, ranking, advice, model confidence, and performance claims remain blocked.
- Latest investment evidence upgrade: `scripts/report-investment-credibility-evidence-upgrade.mjs` and `scripts/check-investment-credibility-evidence-upgrade.mjs` now tie the accepted non-advisory outcome, backtest method limits, stock/briefing action copy, source-rights readiness, and data-goal readiness into one local evidence upgrade. Investment credibility moved from 46% to 58%; real scoring, ranking, advice, model confidence, public professional indicator claims, and performance claims remain blocked.
- Latest formula downgrade readiness slice: `scripts/report-investment-formula-downgrade-readiness.mjs` and `scripts/check-investment-formula-downgrade-readiness.mjs` now consolidate local formula version posture, model credibility local review, fail-closed downgrade states, and data-quality score contracts. Investment credibility moved from 58% to 68%; formula version promotion, model confidence claims, public score use, `scoreSource=real`, and performance claims remain blocked.
- Latest investment public claim readiness slice: `scripts/report-investment-public-claim-readiness.mjs` and `scripts/check-investment-public-claim-readiness.mjs` now consolidate the CP3 public claim checklist, role review, claim-to-runtime-state mapping, formula downgrade posture, and source-rights placement. Investment credibility moved from 68% to 80% MVP review target as local-only evidence; real scoring, ranking, advice, model confidence, performance claims, Supabase public-source promotion, and `scoreSource=real` remain blocked.
- Latest source-rights readiness slice: `scripts/report-source-rights-mvp-readiness.mjs` and `scripts/check-source-rights-mvp-readiness.mjs` now consolidate the source-rights checklist, local review, acceptance gate, provider-specific terms packet, post-review rollup, and approval outcome ledger. Source-rights disclosure moved from a loose 50% gap to 68% local MVP-review readiness; external provider terms, redistribution, public source promotion, Supabase execution, SQL, ingestion, and `scoreSource=real` remain blocked.
- Latest source-rights public placement slice: `scripts/report-source-rights-public-placement-readiness.mjs` and `scripts/check-source-rights-public-placement-readiness.mjs` now map page-level attribution, delay/incompleteness/outage wording, redistribution/storage limits, and non-advisory public-claim placement. Source-rights disclosure moved from 68% to 78%; external provider terms, source license approval, redistribution, public source promotion, Supabase execution, SQL, ingestion, and `scoreSource=real` remain blocked.
- Latest source-rights specific classification slice: `scripts/report-source-rights-specific-classification-readiness.mjs` and `scripts/check-source-rights-specific-classification-readiness.mjs` now consolidate provider terms rollup, TWII rights/field contract packet, ETF source-rights packet, public placement, data coverage backfill plan, and public claim/runtime mapping. Source-rights disclosure moved from 78% to 88%; external provider terms, source license approval, redistribution, public source promotion, Supabase execution, SQL, ingestion, and `scoreSource=real` remain blocked.
- Latest slice record: goal is overall project 100% MVP readiness. This slice raised data freshness and quality readiness with promotion prerequisites evidence, kept project progress at 83%, moved data freshness and quality evidence to 80%, and registered the promotion prerequisites gate in localhost full health while preserving review gate coverage. It touched data/gate/documentation/progress scoring only; `publicDataSource=mock` and `scoreSource=mock` remain correct; no remote connection, SQL, write, raw data, or secret output occurred.
- Freshness boundary reminder: `DATA_FRESHNESS_SOURCE=supabase` plus `DATA_FRESHNESS_SUPABASE_READS=enabled` remains only a gated candidate path; failures must fallback 到 mock freshness; `NEXT_PUBLIC_DATA_SOURCE` remains mock unless a separate source-promotion gate passes.
- Latest CEO decision posture: keep PM on runtime engineering by default; only switch to a bounded Supabase readonly row coverage attempt if CEO explicitly names exactly one attempt as a separate action, with sanitized aggregate output and immediate post-run review.
- Latest product baseline posture: use `docs/MVP_LAUNCH_PRD.md` to avoid restarting discovery; F/UI work stays lightweight now and moves to full design polish near launch.
- Current gate status: full review gate returns `ok`; remote/source/ETF gates that are intentionally blocked are represented as expected blocked/not-ready items with `pass: true`.
- Local verification: production build, TypeScript, localhost full health, site chrome readability, public visible language quality, public runtime boundary coverage, public runtime state strip, trust runtime boundary notice, freshness UI runtime disclosure, A2 public-copy readability candidates, runtime readiness language quality, runtime gate decision brief, runtime product summary, runtime mock disclosure readability, mainline readonly row coverage integration, project progress score, project progress snapshot, CEO progress brief, and runtime autonomy handoff checks are passing.
- Next safe mainline work: continue local-only runtime readiness and product-facing state clarity; do not start Supabase, SQL, market-data fetch/ingestion, public source promotion, or `scoreSource=real` without a separately named CEO gate.
- Git status: do not stage or commit while the chairman is away; report pending uncommitted changes instead.

更新日期：2026-05-28

## 目前版本

靜態 HTML 原型 + Next.js 專案骨架。

## 目前最新版所在位置

```text
C:\Users\C0298\Documents\指數燈號
```

## 使用者搬移後偏好位置

```text
D:\指數燈號
```

目前執行環境可以讀取 D 槽資料夾，但寫入 D 槽時被拒絕。

## 已完成

- 多標的選擇。
- 愛心收藏。
- 四大頁籤。
- 雙分數模型。
- 2000 年起的模型資料。
- 初步 PM 文件。
- 資料庫 schema 草案。
- Sitemap 草案。
- MVP 任務清單。
- 換電腦檢查清單。
- Next.js App Router 骨架。
- React dashboard shell 雛形。
- 股票 SEO route `/stocks/[symbol]` 雛形。
- 週報頁 `/weekly` 雛形。
- Next.js 首頁、股票頁、週報頁已在 localhost 驗證。
- Next.js 版愛心收藏已支援 localStorage。
- Next.js 版標的搜尋已可用。
- Next.js 版四大頁籤已完成：今日燈號、區間變化、新聞信心、回測驗證。
- 已修正日期序列時區偏移。
- 已新增 repository 抽象層，UI 目前透過 mock repository 取資料。
- 已建立 Supabase repository 佔位。
- 已建立 Supabase client helpers 與 `.env.example`。
- Supabase 初始 schema migration。
- 股票 seed JSON 與 seed SQL。
- npm dependencies 已安裝，產生 package-lock.json。
- 已建立 A/B/C/D/E/F 協作模式：A = PM+開發者，B = 行銷企劃，C = 專業投資顧問，D = 法務顧問，E = CEO，F = 產品設計 / UIUX 設計。
- B 已提出第一批需求：股票頁 SEO 內容區塊、週報文章模板、追蹤事件規格。
- 已完成 B Request 001：股票頁 SEO 內容區塊與個股頁 metadata。
- 已完成 B Request 002：週報文章模板。
- 已完成 B Request 003：基礎追蹤事件規格與 `trackEvent()` helper。
- C 已提出第一批需求：評分方法論頁、模型資料品質欄位。
- D 已提出第一批風險提醒：免責聲明頁、聯盟揭露、新聞著作權。
- 已完成 C Request 001：評分方法論頁 `/methodology`。
- 已完成 C Request 002：模型資料品質欄位與今日燈號資料品質顯示。
- 已完成 D Review 001：免責聲明頁 `/disclaimer`。
- 已建立 SEO 技術基礎：`sitemap.xml`、`robots.txt`、個股頁 canonical / OpenGraph / JSON-LD。
- 已完成 D Review 004：隱私權政策 `/privacy` 與使用條款 `/terms` 草案。
- 已完成 D Review 002：廣告與聯盟行銷揭露格式，並建立商業合作預留區。
- E 已提出產品主軸：專案必須成為會讓人長期使用的工具，而不只是一次性股票查詢頁。
- 已完成 E Request 001：每日晨報 `/briefing`。
- 已完成 E Request 002：股票頁加入基礎行情層，定位為股市資料頁 + 智能解讀頁。
- 已完成股票頁第二階段：技術、成交量、股利 / 基本資料頁籤。
- 已完成股票頁新聞分頁與投資信心評論合併，加入新聞信心儀表。
- F 已提出設計主軸：專案需要更像成熟金融工具，提升信任感、資訊層級與長期使用舒適度。
- 已完成 F Request 001：設計系統基礎、Header 升級與晨報第一屏視覺升級。
- 已建立 TWSE 官方 OpenAPI 股票主檔抓取腳本 `npm run fetch:stocks`。
- 已將上市普通股主檔 seed 擴充為 1086 筆，並重產 Supabase seed SQL。
- 已建立 TWSE 官方 OpenAPI 最新每日行情 / 估值 SQL 產生腳本 `npm run fetch:daily-market`。
- 已建立 Supabase 單檔 bootstrap SQL 產生器 `npm run db:bootstrap`。
- CEO 已定調全球化策略：先以台股與台灣使用者為 wedge market，但資料模型、路由、語系、時區、幣別與評分模型必須從現在開始預留全球市場。
- 已將股票主檔 schema 與 seed 調整為全球化命名空間：`country + exchange + symbol`，並補 `currency`、`timezone`、`asset_type`。
- Repository data source 切換已改為明確模式：`mock` 可用，`supabase` 未完成前會報錯，不再靜默 fallback。
- 已建立 `market_exchanges` 市場 metadata registry，TWSE 先啟用，TPEx / NASDAQ / NYSE 作為未來全球擴張 placeholder。
- CEO 已要求建立專案 review checkpoint 制度；每到資料、模型、體驗、全球化、商業化或上線切點，A 暫停實作，由 A/B/C/D/E/F/I 深度討論，CEO 收斂後再推進。
- 已執行 CP1 Data Trust Checkpoint；CEO 決策為 `REVISE`，可建立 Supabase 並驗證資料庫，但暫不允許 UI 切換到 Supabase。
- 已建立 `data_runs` 匯入紀錄表與 bootstrap 驗證查詢，用於追蹤資料來源、筆數、狀態與資料日期。
- 已建立本機 Supabase bootstrap 驗證腳本 `npm run db:validate`；需 `.env.local`，只驗證資料庫，不切換 UI。
- 已建立 Supabase 執行 runbook，明確規定建立專案、執行 bootstrap、填 `.env.local`、驗證資料庫，以及 UI 繼續保持 mock。
- 已建立資料 freshness / source attribution UI 規格，作為未來切換 Supabase UI 前的必要條件。
- 已新增資料 freshness read model 與 UI strip，晨報與股票頁會明確顯示目前為模擬資料。
- 已新增 Supabase `data_runs` freshness snapshot helper，未來可由真實資料庫紀錄生成資料狀態。
- 已新增 Supabase freshness repository，可讀取 `market_exchanges` 與 `data_runs` 生成資料 freshness snapshot，但尚未接入前台 UI。
- 已新增 `npm run db:freshness` smoke test，供 `.env.local` 完成後驗證 Supabase freshness 讀取路徑。
- 已新增 `DATA_FRESHNESS_SOURCE`，讓晨報與股票頁可獨立切換 freshness 來源；主資料源仍維持 `NEXT_PUBLIC_DATA_SOURCE=mock`。
- 已完成 CP1 freshness source follow-up review；CEO 核准下一步只做 Supabase raw market read contract，不核准切換完整 UI repository。
- 已新增 Supabase raw market read model 與 repository contract，可讀 active markets、stock identity、latest price / fundamentals，但尚未接入 UI。
- 已新增 `npm run db:raw-market` smoke test，供 `.env.local` 完成後驗證 Supabase raw market read path。
- 已新增 Next.js server raw market loader，可在伺服器端讀 Supabase raw market snapshot，但尚未接入公開 UI。
- 已新增預設關閉的 internal raw market diagnostics route，可在 Next.js runtime 驗證 loader，不影響公開 UI。
- 已新增 mixed market adapter，可明確分離 real raw market data 與 mock score，避免使用者誤認模型分數已由真實資料計算。
- internal raw market diagnostics 已輸出 mixed adapter preview，供開發期檢查 real raw data + mock score 的混合狀態。
- 已完成 CP1 mixed adapter preview review；CEO 核准建立預設關閉、token 保護、noindex 的 internal preview page。
- 已新增 internal raw market preview page，可檢查 real raw data + mock score 的混合輸出，但不進公開導覽、不進 sitemap。
- 已新增 mixed data quality summary / caveat copy，將 adapter warnings 轉成 severity、label、legal caveat。
- 已完成 CP1 data-quality scoring review；CEO 核准先做 internal-only 的純資料品質分數 helper，不核准公開顯示。
- 已新增 internal-only mixed data quality score helper，會計算 internal quality score，但 `scoreCanBeShownPublicly` 仍固定為 false。
- 已新增 `npm run db:preflight`，用於 Supabase 實際驗證前檢查 `.env.local`、bootstrap SQL 與資料源設定。
- 已新增 `npm run db:split-bootstrap`，可將 Supabase bootstrap SQL 拆成較小的依序執行檔，降低 SQL Editor 操作風險。
- 已新增 `npm run env:init-local`，可安全建立本機 `.env.local` 範本且不覆蓋既有金鑰。
- Supabase bootstrap 已完成並通過 `db:validate` / `db:freshness` / `db:raw-market`；資料日期為 2026-05-27，2330 raw market smoke test 通過。
- 已完成 CP1 Supabase readiness review；CEO 核准只啟用受控 freshness 準備，不核准切換主資料源。
- Runtime freshness 現在採雙開關：`DATA_FRESHNESS_SOURCE=supabase` 只表達候選來源，必須再設定 `DATA_FRESHNESS_SUPABASE_READS=enabled` 才允許 runtime 讀 Supabase。
- 未開啟 `DATA_FRESHNESS_SUPABASE_READS=enabled` 或遠端讀取失敗時，`/briefing` 與 `/stocks/[symbol]` 必須 fallback 到 mock freshness；`NEXT_PUBLIC_DATA_SOURCE` 仍維持 `mock`。

## 下一次開工建議

1. 依 CP1 結論新增 `data_runs` schema 與資料匯入驗證流程。
2. 依 `docs/SUPABASE_EXECUTION_RUNBOOK.md` 建立 Supabase 專案並執行 bootstrap SQL。
3. 建立 `.env.local` 後執行 `npm run db:validate`。
4. 暫不切換 `NEXT_PUBLIC_DATA_SOURCE=supabase`。
5. 下一步為 CP1 freshness rollout 小檢討，決定是否開啟 bounded runtime-read checkpoint；未決前維持 `DATA_FRESHNESS_SUPABASE_READS` 不啟用，且仍不切換 `NEXT_PUBLIC_DATA_SOURCE=supabase`。

## 環境狀態

- Node.js：可用。
- npm：可用。
- Git：目前未安裝或不在 PATH。
- Git：使用 Visual Studio 內建 git 可執行，但目前因 ownership / safe.directory 設定暫停。
- npm dependencies：已安裝。
- Codex 沙盒限制：在沙盒內執行 `next build` / require node_modules 會遇到 `EPERM lstat C:\Users\C0298`，建議用一般 PowerShell 跑 Next.js。
- Supabase：尚未建立遠端專案。

## 重要決策

- 不先做會員，先做資料可信度與 SEO。
- 不先買新聞 API，先用官方資料與週報內容。
- 不先重度投放廣告，避免破壞金融工具信任感。
- 不把產品做成台灣限定架構；台灣是第一市場，不是長期邊界。
