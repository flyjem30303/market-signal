# 指數燈號網站 BRIEF

Updated: 2026-06-16

Status: `index_signal_brief_phase_1_public_first_phase_2_membership_path`

Owner: CEO / PM

## CEO Decision

本 BRIEF 是目前產品目標。

- Phase 1 是公開免費的指數燈號網站。
- Phase 2 是會員 MVP 路線。
- Phase 1 是目前執行優先順序。
- Phase 2 可以平行規劃，但不得拖慢 Phase 1 上線準備。

CEO execution rule: Phase 1 is a launchable public product, not a governance exercise. Phase 2 is a product expansion path. Any workstream may run in parallel only when it shortens the path to a clearer public site, safer data boundary, or better launch readiness.

## 1. 目標

本專案目標是打造一個面向一般投資者的「指數燈號網站」，透過紅、黃、綠等視覺化狀態，協助使用者快速理解目前市場風險、趨勢強弱與觀察重點。

Phase 1 以降低市場資訊理解門檻為核心，讓使用者在短時間內看懂目前市場處於偏多、觀望、警戒或高風險狀態。

Phase 2 將導入會員機制，將網站從單純的市場資訊展示，升級為：

- 免費市場總覽；
- 會員深度解讀；
- 個人化追蹤。

免費用戶主要取得燈號、基礎指標、風險提示與資料更新時間。會員用戶未來可取得更完整的市場解讀、盤後複盤、watchlist 與個人化警示規劃。

## 2. 背景

市場資訊分散在新聞、券商工具、社群討論與個別數據網站中。使用者即使取得大量資訊，也常難以判斷哪些訊號真正重要。

指數燈號網站要解決的問題是：把複雜的市場數據轉換成簡單、可理解、可追蹤的狀態提示，協助使用者建立固定的市場觀察流程。

若網站只提供免費燈號與單層數據，長期容易停留在查詢工具定位。因此 Phase 2 會員內容規劃會把「看到燈號」延伸為「理解燈號」、「追蹤變化」與「回看判斷品質」。

會員內容不得變成買賣建議。它應聚焦風險解讀、歷史脈絡、盤後回顧與個人化觀察工具。

## 3. 素材

Phase 1 基礎素材：

- 市場指數；
- ETF；
- 成交量；
- 均線；
- 漲跌幅；
- 波動率；
- 已驗證來源下的資金流向；
- 已驗證來源下的產業或板塊表現；
- 燈號判斷邏輯；
- 資料更新時間。

免費內容素材：

- 市場總覽燈號；
- 核心指數狀態；
- 基礎風險提示；
- 主要指標摘要；
- 資料更新時間；
- 基礎圖表或表格；
- 簡短說明文案。

Phase 2 會員內容素材：

- 每日市場三層解讀；
- 盤後複盤報告；
- watchlist；
- 自訂警示條件；
- 歷史燈號紀錄；
- 關鍵指標變化原因；
- 情境式風險提醒；
- 會員專屬教學內容。

文案語氣：

- 中性；
- 穩健；
- 易懂；
- 不誇大報酬；
- 不使用恐慌式警語；
- 不提供直接買賣建議。

## 4. 邊界

本網站定位為市場資訊整理、風險辨識與觀察輔助工具。

網站不得：

- 提供個股買賣建議；
- 承諾保證獲利；
- 代替使用者執行交易；
- 代替使用者做投資決策；
- 暗示資料來源官方背書；
- 在資料延遲或示範狀態下宣稱即時精準；
- 在獨立 gate 通過前推進 `publicDataSource=supabase` 或 `scoreSource=real`。

免費內容要讓使用者清楚知道目前市場狀態，但不提供完整會員深度解讀與個人化追蹤。

會員內容未來可提供更深入的市場分析、警示原因、盤後複盤與個人化觀察工具，但仍須以觀察、風險提醒、情境判斷與資料解讀為核心。

Phase 1 不實作券商交易、資產配置建議、登入、付款、持久化 watchlist、個人化警示執行或會員內容 gating。

資料面需明確標示來源狀態、更新時間、延遲或示範資料邊界。若資料過期或不可用，前台需以清楚文案 fail closed。

## 5. 會員規劃

會員機制的定位是讓使用者不只看到燈號，而是理解燈號背後原因。

Phase 2 會員內容分為三層：

1. 深度解讀：每日市場總觀、關鍵指標變化、燈號轉變說明與後續觀察重點。
2. 個人化追蹤：watchlist、自訂警示條件、個人關注指標、收藏紀錄與提醒。
3. 複盤與學習：盤後複盤、歷史燈號案例、情境式風險說明、指標教學與會員專屬內容。

Phase 2 應在 Phase 1 穩定後才開始 MVP 實作：

- 每日市場三層解讀；
- watchlist 加至少一種自訂警示條件；
- 盤後複盤報告。

## 6. Phase Plan

### Phase 1：公開免費指數燈號網站

Phase 1 應完成公開免費版：

- 首頁市場總覽燈號；
- 核心指標面板；
- 警示清單；
- 重要警示具備狀態、原因、更新時間、影響級別與下一步觀察；
- 清楚的資料來源與更新時間邊界；
- 非投資建議聲明；
- 穩定公開路由；
- 公開頁不得出現內部開發殘留。

Phase 1 不實作：

- 會員登入；
- 付款；
- 持久化 watchlist；
- 個人化警示執行；
- 會員內容 gating；
- 未通過 gate 的真實資料 promotion。

### Phase 2：會員 MVP

Phase 2 只有在 Phase 1 穩定且公開免費路由可用後開始。

Phase 2 MVP 可包含：

- 使用者註冊與登入；
- 會員內容查看；
- watchlist 建立；
- 至少一種自訂警示條件；
- 盤後複盤內容；
- 轉換指標追蹤。

Phase 2 planning may continue during Phase 1, but implementation must not block:

- public market-light readability;
- public route health;
- source/update-time disclosure;
- mock/real boundary clarity;
- launch engineering readiness;
- residue cleanup on public pages.

## 7. Workstream Assignment

PM owns:

- Phase 1 public/free product-runtime integration;
- home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy routes;
- runtime readability;
- BRIEF alignment;
- checks and Git backup.

A1 Data / Source / Coverage owns:

- legal/free automated data-source evidence;
- coverage universe;
- field contracts;
- ingestion and backfill readiness;
- aggregate-only handoff.

A2 Public Copy / Product Safety owns:

- public trust copy;
- delay and source wording;
- non-investment-advice wording;
- no-official-endorsement wording;
- free/member boundary wording.

A3 Launch / Production Engineering owns:

- Vercel and environment readiness;
- metadata, sitemap, and robots;
- smoke checks;
- monitoring;
- rollback;
- post-deploy packet.

A4 Membership MVP Planning owns:

- Phase 2 membership MVP plan;
- free/member boundary;
- watchlist, alert, and post-market review scope;
- conversion metrics.

Default allocation:

- PM mainline: 50%;
- A1 data/source/coverage: 20%;
- A2 public copy/product safety: 10%;
- A3 launch engineering: 15%;
- A4 membership MVP planning: 5%.

PM may rebalance these ratios during execution. If a support lane creates extra ceremony without removing a real blocker, PM should pause it and return capacity to Phase 1.

## 8. Current CEO Priority

1. 先完成 Phase 1 公開免費路由可用性，再進入 Phase 2 實作。
2. 移除公開頁中的內部開發殘留。
3. 持續守住 30 秒理解市場狀態、3 分鐘做出觀察判斷的產品承諾。
4. A1 資料線可平行推進，但未完成真實資料不得阻塞 mock public Beta。
5. A2、A3、A4 只在能移除具體風險或準備未來 gate 時投入。

## 9. Completion Definition

Phase 1 完成條件：

- 首頁顯示市場總覽燈號、核心指標、風險提示與更新時間；
- 核心警示具備狀態、原因、更新時間、影響級別與下一步觀察；
- 重要指標有 30 秒可懂解釋與短風險提示；
- 手機與桌面版可正常閱讀；
- 載入或資料錯誤時有替代資訊；
- 資料來源、更新時間、延遲或示範邊界、非投資建議文案清楚可見；
- 公開路由不含內部角色標籤、local path、命令片段、raw data identifiers 或治理 packet 語言。

Phase 2 會員 MVP 完成條件：

- 使用者可註冊與登入；
- 使用者可查看會員內容；
- 使用者可建立 watchlist；
- 使用者可設定至少一種警示條件；
- 使用者可查看盤後複盤內容；
- 免費與會員邊界、非投資建議聲明仍清楚。

## Current GOAL Execution Interpretation

- Push Phase 1 public Beta readiness first.
- Keep Phase 2 membership MVP as planning/specification until Phase 1 is stable.
- Use A1 for data/source/coverage, A2 for public trust copy, A3 for launch engineering, and A4 for membership MVP planning.
- Do not promote real data, real score, SQL, Supabase write, raw market data, login, payment, persisted watchlist, personalized alert execution, or member-only content gating inside Phase 1.

## Checker Compatibility Anchors

- understand the market mood within 30 seconds
- decide within 3 minutes
- Home includes three layers: full-market overview, core indicator panel, alert list
- Each alert includes status, cause, update time, impact level, and next step
