# Project Status

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
- CEO 已要求建立專案 review checkpoint 制度；每到資料、模型、體驗、全球化、商業化或上線切點，A 暫停實作，由 A/B/C/D/E/F 深度討論，CEO 收斂後再推進。
- 已執行 CP1 Data Trust Checkpoint；CEO 決策為 `REVISE`，可建立 Supabase 並驗證資料庫，但暫不允許 UI 切換到 Supabase。
- 已建立 `data_runs` 匯入紀錄表與 bootstrap 驗證查詢，用於追蹤資料來源、筆數、狀態與資料日期。
- 已建立本機 Supabase bootstrap 驗證腳本 `npm run db:validate`；需 `.env.local`，只驗證資料庫，不切換 UI。
- 已建立 Supabase 執行 runbook，明確規定建立專案、執行 bootstrap、填 `.env.local`、驗證資料庫，以及 UI 繼續保持 mock。
- 已建立資料 freshness / source attribution UI 規格，作為未來切換 Supabase UI 前的必要條件。
- 已新增資料 freshness read model 與 UI strip，晨報與股票頁會明確顯示目前為模擬資料。
- 已新增 Supabase `data_runs` freshness snapshot helper，未來可由真實資料庫紀錄生成資料狀態。
- 已新增 Supabase freshness repository，可讀取 `market_exchanges` 與 `data_runs` 生成資料 freshness snapshot，但尚未接入前台 UI。
- 已新增 `npm run db:freshness` smoke test，供 `.env.local` 完成後驗證 Supabase freshness 讀取路徑。

## 下一次開工建議

1. 依 CP1 結論新增 `data_runs` schema 與資料匯入驗證流程。
2. 依 `docs/SUPABASE_EXECUTION_RUNBOOK.md` 建立 Supabase 專案並執行 bootstrap SQL。
3. 建立 `.env.local` 後執行 `npm run db:validate`。
4. 暫不切換 `NEXT_PUBLIC_DATA_SOURCE=supabase`。
5. 完成資料 freshness / source attribution / validation 後，再進入下一個 checkpoint。

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
