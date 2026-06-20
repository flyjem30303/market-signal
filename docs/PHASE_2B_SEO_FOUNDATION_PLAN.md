# Phase 2B SEO 基礎方案（SEO Foundation）

版本：2026-06-20  
負責人：A3（Phase 2B）  
範圍：Phase 1 / 1.1 已上線頁面之 SEO 技術與內容基礎盤點，不做 Google Ads、不做會員、不改資料來源，不改 Supabase，不改核心資料模型。

## 0. 任務邊界與原則

- 不改變「是否提供投資建議」定位：不使用誇大收益、保證報酬、即時報價字眼，維持風險提示。
- 不一次打開超大量薄弱頁面索引。
- 優先確保「可控、可解釋、可治理」的 SEO 骨架：`metadata`、`sitemap`、`robots`、`canonical`、結構化資料、Open Graph / Twitter Card。
- 先使用 `https://market-signal-two.vercel.app/`，待基礎 SEO 打牢後再導入正式網域。
- 先建立治理文件與腳本，再逐步實作 slice（Phase 2B Engineering Slice）。

## 0.1 CEO 決議（2026-06-20）

- 決議 A：同意停止 `/stocks/*` 全量索引，改採品質門檻與分批放量。
- 決議 B：第一批股票頁 sitemap 上限採 `100`，但必須由可驗證品質條件產生，不採純手動堆頁。
- 決議 C：首頁關鍵字策略改為「台股燈號」為核心，同時保留未來美股/全球指數擴展空間。
- 決議 D：OG / Twitter baseline 本週納入 P0，不等待 Phase 3。
- 決議 E：正式網域暫不立即切換，待 SEO 基礎、sitemap、canonical、GSC 檢查穩定後再導入。
- 決議 F：`/markets` 與 `/indices` 可先建立最低內容頁，但不可只有 `Coming Soon`；內容必須是教育型、合規、非即時行情、非投資建議。

## 1. 目前 SEO 盤點（基準版）

### A. metadata / title / description

- 全域 metadata 設定位於 `src/app/layout.tsx`，目前有 `metadataBase`（依賴 `NEXT_PUBLIC_SITE_URL`，未設時退回 localhost），並使用標題模板 `%s | 指數燈號`。
- 目前已有個別路由 metadata：
  - `/briefing`：有 `title`/`description`
  - `/weekly`：有 `title`/`description`
  - `/methodology`：有 `title`/`description`
  - `/disclaimer`：有 `title`/`description`
  - `/privacy`：有 `title`/`description`
  - `/terms`：有 `title`/`description`
  - `/stocks/[symbol]`：使用 `generateMetadata`（動態 title、description、openGraph）。
- `/`（首頁）目前未在 page 層設定明確 metadata，僅靠 layout template。

### B. canonical

- 有部分頁面未明確宣告 `alternates.canonical`，多依賴 framework 預設生成。
- `/stocks/[symbol]` 使用動態 canonical（以 symbol 形成 URL），結構上可控但尚未有 `noindex` 邊界條件。

### C. sitemap

- `src/app/sitemap.ts` 已具備靜態路由，並依 `repository.getAssets()` 生成 `/stocks/[symbol]` 動態清單。
- 現況會將所有種子符號輸出至 sitemap（目前 stock 筆數約 1,086）→ 風險：大量同質頁面被完整索引。

### D. robots.txt

- `src/app/robots.ts` 有 `allow: "/"`，並明確 disallow:
  - `/internal`
  - `/api/internal`
  - `/membership`
  - `/watchlist`
- 內部頁 `/internal/*` 已各頁面宣告 `index: false`，不影響公開索引。

### E. structured data

- `/stocks/[symbol]` 有 JSON-LD，type 當前採 `FinancialProduct`。
- 其他核心頁面未普遍放置結構化資料。

### F. Open Graph / Twitter card

- 部分頁面已有 Open Graph 設定（動態頁較完整），但全域預設未集中定義 OG/Twitter 全站 baseline。
- Twitter card 不一致；缺少全站統一 `twitter` 欄位（如 `summary_large_image` 等）。

### G. route-level 一致性

- 核心公開頁 metadata 基本到位，但「首頁」與「非首頁核心頁」間格式不一致（有些有完整 `openGraph/titles/description`，有些無）。
- `/internal/*` 已排除，`/stocks/[symbol]` 仍屬高風險群組（index 大量化 + 品質門檻不足）。

## 2. Phase 2B 目標（不改資料、不改交易模型）

- 建立可控 SEO 骨幹（先準確，再大量擴展）。
- 先解決 index 資質與品質控制，再逐步放量。
- 先補齊 `/` 與核心靜態頁的元資料一致性與社群卡片。
- 先定義 `/stocks/[symbol]` 的「可索引」條件，預設只給「高品質 / 高意圖」頁索引。

## 3. SEO 工程切片（Phase 2B）

### Slice 1（MVP）：SEO 安全底盤（建議第一批）

1. 補齊全站 meta 基線
   - 在 `layout.tsx` 加入全站 Open Graph / Twitter card baseline（站名、站點簡介、預設圖片）。
2. 補首頁元資料
   - `src/app/page.tsx` 加入 `metadata`：title / description / openGraph / twitter。
   - 首頁主軸採「台股燈號」與「市場風險燈號」並行，避免過早限縮未來全球指數定位。
3. 釐清 canonical 邊界
- 明確規劃每個核心頁 canonical policy（見 route inventory）。
4. robots + sitemap + 檢測指標
   - 明確 disallow: `/internal/*`、`/api/*`（視情再分層）
   - sitemap 先維持核心頁穩定，股票頁採條件式輸出（第一批上限 `100`）。
5. 引入檢查腳本
   - 新增 `scripts/check-phase-2b-seo-foundation.mjs`，每次 PR 做 SEO smoke check。
   - P0 驗收門檻：`FAIL = 0`。`WARN` 先保留為治理提醒，不作為第一輪阻斷，待 baseline 完成後再收斂。

### Slice 2（接著）

1. `/stocks/[symbol]` 分階段索引門檻
   - 加入 `shouldIndex` 判斷條件：有基礎資料、正式標的、排除 fallback/mock。
   - 第一批 sitemap 上限：`100`。
2. 低品質頁 noindex
   - `generateMetadata` 中加入條件式 `robots: { index: false, follow: false }`（缺資料、缺歷史、疑似測試/占位）。
3. 結構化資料擴充
   - 全站頁面補充 `WebPage`、`BreadcrumbList`（分頁級）、`WebSite`（主站）。

### Slice 3（第二期）

1. 關鍵字與內容頁策略
   - 以「市場指數 + 風險訊號 + 指標解讀」為主的主題聚類（避免以單純 symbol 列表為主）。
2. 國際市場路由預留
   - 預留 `/markets/*`、`/indices/*` 架構，並以靜態教育內容頁先補充基礎元資料（不實作資料）。
   - 不允許純 `Coming Soon` 頁進入索引；每頁需有清楚說明、風險邊界、非投資建議聲明。

## 4. `/stocks/[symbol]` 的索引策略（重點）

- 不建議目前將全部股票頁一次全量索引。
- 建議先用 `sitemap` + `generateMetadata` 的條件 gate，僅輸出「高價值頁」：
  - 有主要行情摘要與指標欄位
  - 非 fallback/mock
  - 類型為正式 stock/大盤指標/經 CEO 批准的 ETF 或指數頁（避免測試符號）
  - 已定義完整標題與描述模板
- CEO 已決議：第一批可索引股票頁上限為 `100`。
- 其餘頁面保留可訪問（200）但 `noindex`，避免稀釋主題權重與出現薄頁群集。
- 當資料與資源可承載後，再逐步放寬至第二梯隊（建議每次增加 100~200 頁，待成效穩定再擴大）。

## 5. 5. 正式網域導入與 SEO 時機建議

- CEO 決議：不在 Phase 2B 初期直接導入正式網域。
- 建議順序：
  1. 完成 `canonical` / `sitemap` / `robots`/ OG / Twitter / `noindex` 基本規範。
  2. 並建立 SEO 檢查腳本，連續至少 1 週觀察 `/stocks` 索引與核心頁點擊/展現分布。
  3. 完成 GSC 連結與驗證（至少提交 sitemap 並確認未報錯）。
  4. 以最小風險內容（首頁+核心資訊頁）可穩定被爬取為前提，才導入正式網域。
- 簡答：**在 SEO 施作穩定後導入正式網域（非「一開始」），優先排在「sitemap/canonical 完整」與「GSC 檢核通過」之後**。

## 6. 監測基礎（建議但不強制一次到位）

- 建議導入（最小化階段）：
  - Google Search Console（必做）
  - GA4（站內行為與受眾）
  - Vercel Analytics（效能與流量熱點）
  - Microsoft Clarity（行為路徑）
- Event tracking 建議：
  - page_view / stock_detail_view / weekly_view / disclaimer_view / methodology_view
  - 搜索意圖轉換事件：`cta_click_newsletter`, `cta_click_detailed_analysis`
- Privacy 邊界：
  - 事件欄位不得回傳個資、持倉、身份識別、投資建議結果。
  - 保留既有風險揭露，不混淆為金融建議信號。

## 7. 可立即落地的最小待辦（可當作 2B backlog）

1. 完成 `docs/PHASE_2B_SEO_ROUTE_INVENTORY.md` 並確認每頁 SEO 目的。
2. 實作全站 OG/Twitter baseline（layout + 首頁 metadata）。
3. 建立 `scripts/check-phase-2b-seo-foundation.mjs`。
4. 將 `/stocks/[symbol]` 引入分層索引條件（第一批 `100`）。
5. 先將 sitemap 中股票頁限縮為高品質條件集合（非 mock、不缺資料）。

## 8. 需要 PM/CEO 後續補齊的決策

- 第一批 `100` 個可索引標的的選取規則：市值、成交量、搜尋需求、既有資料完整度，需至少選一個主要排序依據。
- 首張全站 OG 圖的品牌文案與語言：建議以「指數燈號」為主，英文 `Market Signal` 為副標。
- `/markets` 與 `/indices` 的最低內容頁是否排入 P1，或先等 2A 全球指數資料線完成後再公開。
