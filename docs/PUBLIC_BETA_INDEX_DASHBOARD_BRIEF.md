# 指數燈號網站 BRIEF

Updated: 2026-06-14

Status: `index_signal_brief_phase_1_public_first_phase_2_membership_path`

Owner: CEO / PM

## CEO Decision

本 BRIEF 以兩階段推進：

- Phase 1 is the public free index-lighting site.
- Phase 2 is the membership MVP path.
- Phase 1 is current execution priority.
- Phase 2 should not delay Phase 1 launch readiness.

CEO 判斷：必須切成 Phase 1 / Phase 2。Phase 1 先把所有人可用的公開免費版做成可信、可理解、可上線；Phase 2 才製作會員可看的深度內容、登入、watchlist、自訂警示與盤後複盤架構。會員內容可以先做路線圖、預告與規格，但不得拖慢公開 Beta 的可用閉環。

## 1. 目標

本專案目標是打造一個面向一般投資者的「指數燈號網站」，透過紅、黃、綠等視覺化狀態，協助使用者快速理解目前市場風險、趨勢強弱與觀察重點。

網站第一階段以降低市場資訊理解門檻為核心，讓使用者在短時間內看懂目前市場處於偏多、觀望、警戒或高風險狀態。

下一階段將導入會員機制，將網站從單純的市場資訊展示，升級為「免費市場總覽 + 會員深度解讀 + 個人化追蹤」的產品模式。

免費用戶主要取得即時燈號、基礎指標與市場狀態總覽；會員用戶則可取得更完整的市場解讀、盤後複盤、自選追蹤與個人化警示，提升回訪率、使用黏著度與付費轉換。

## 2. 背景

市場資訊分散在新聞、券商看盤工具、社群討論與個別數據網站中，使用者即使取得大量資訊，也常難以判斷哪些訊號真正重要。

指數燈號網站要解決的問題是：把複雜的市場數據轉換成簡單、可理解、可追蹤的狀態提示，協助使用者建立固定的市場觀察流程。

若網站只提供免費燈號與單層數據，長期容易停留在查詢工具定位，使用頻率與商業價值有限。因此下一階段需要會員內容，把「看到燈號」延伸為「理解燈號」、「追蹤變化」與「建立自己的觀察紀錄」。

會員內容的設計重點不是提供買賣建議，而是提供更完整的風險解讀、歷史脈絡、盤後回顧與個人化觀察工具。

## 3. 素材

網站基礎素材包含市場指數、ETF、成交量、均線、漲跌幅、波動率、資金流向、產業表現、燈號判斷邏輯與資料更新時間。

免費內容素材包含：

- 市場總覽燈號
- 核心指數狀態
- 基礎風險提示
- 主要指標摘要
- 資料更新時間
- 基礎圖表與簡短說明文案

會員內容素材包含：

- 每日市場三層解讀
- 盤後複盤報告
- 自選追蹤與 watchlist
- 自訂警示條件
- 歷史燈號紀錄
- 關鍵指標變化原因
- 情境式風險提醒
- 會員專屬教學內容

會員 MVP 優先內容包含：

- 每日會員專區《市場三層解讀》：市場總觀、關鍵指標變化、後續觀察重點。
- 會員自選追蹤（watchlist）+ 自訂警示條件：讓使用者追蹤自己關心的指數、ETF 或指標。
- 盤後複盤報告：回顧當日燈號是否有效、哪些訊號值得隔日追蹤。

文案素材需維持中性、穩健、易懂，不使用誇大報酬、恐慌式警語或直接買賣建議。

## 4. 邊界

本網站定位為市場資訊整理、風險辨識與觀察輔助工具，不提供個股買賣建議、不提供保證獲利承諾，也不代替使用者做投資決策。

免費內容以市場總覽與基礎指標為主，需讓使用者清楚知道目前市場狀態，但不提供完整深度解讀與個人化追蹤。

會員內容可提供更深入的市場分析、警示原因、盤後複盤與個人化觀察工具，但仍須避免形成直接投資建議。所有會員內容應以觀察、風險提醒、情境判斷與資料解讀為核心。

會員功能初期不追求完整交易工具化，不做下單、不串接券商交易、不提供個人資產配置建議。若未來要擴充至更進階功能，需另行處理法規、資料授權與風險揭露。

資料面需明確標示來源、更新時間與可能延遲。若資料異常或未更新，前台需顯示清楚狀態，避免使用者誤判。

目前硬邊界：

- `publicDataSource=mock`
- `scoreSource=mock`
- 不執行 SQL
- 不寫 Supabase
- 不建立 staging rows
- 不修改 `daily_prices`
- 不抓取、儲存或提交 raw market data
- 不輸出 secrets 或 raw payloads
- 不宣稱即時真實資料
- 不宣稱官方背書
- 不提供投資建議

## 5. 會員章節規劃

會員機制的產品定位是讓使用者不只看到市場燈號，而是能理解燈號背後原因，並建立自己的追蹤流程。

會員內容可分為三層：

### 第一層：深度解讀

- 每日市場三層解讀
- 關鍵指標變化原因
- 燈號轉變說明
- 後續觀察重點

### 第二層：個人化追蹤

- watchlist
- 自訂警示條件
- 個人關注指標
- 收藏紀錄
- 提醒功能

### 第三層：複盤與學習

- 盤後複盤
- 歷史燈號案例
- 情境式風險說明
- 指標教學
- 會員專屬內容

初期建議先以 MVP 會員內容驗證需求，不一次做太多進階功能。優先讓使用者感受到「付費後可以更快理解市場、更容易追蹤重點、更能回看判斷品質」。

## 6. Phase Plan

### Phase 1：公開免費指數燈號網站

Phase 1 目標是完成可公開 Beta 的免費版：

- 首頁可顯示市場總覽燈號、核心指標、主要風險提示與資料更新時間。
- 使用者進入網站後，能快速理解目前市場狀態。
- 公開頁可清楚揭露示範資料、更新時間、資料邊界與非投資建議。
- 核心頁面包含首頁、簡報、週報、個股頁、方法、風險聲明、條款、隱私。
- 所有公開頁需避免亂碼、內部開發詞、工程指令與治理殘留。

Phase 1 不包含：

- 會員註冊或登入
- 付費訂閱
- watchlist 儲存
- 個人化警示執行
- 會員專屬內容
- 盤後複盤資料儲存
- 真實資料來源 promotion

### Phase 2：會員 MVP

Phase 2 只有在 Phase 1 公開版穩定後開啟。

會員 MVP 需完成：

- 使用者可以註冊/登入會員。
- 使用者可以查看會員內容。
- 使用者可以建立 watchlist。
- 使用者可以設定至少一種警示條件。
- 使用者可以查看盤後複盤內容。

商業驗收需追蹤：

- 免費用戶到會員頁點擊率
- 會員註冊率
- 會員內容閱讀率
- watchlist 使用率
- 盤後複盤回訪率

## 7. Workstream Assignment

PM 主線：

- Phase 1 public/free product-runtime integration.
- Home / briefing / weekly / stock / methodology / disclaimer / terms / privacy.
- Runtime 可理解性、公開頁清理、BRIEF 驗收、狀態紀錄與 Git 備份。

A1 Data / Source / Coverage：

- 合法免費可自動化資料源。
- Coverage universe.
- Field contracts.
- Ingestion / backfill readiness.
- Aggregate-only handoff.
- 不抓 raw market data、不寫 Supabase、不碰 `daily_prices`。

A2 Public Copy / Product Safety：

- 信任文案。
- 風險揭露。
- 資料來源、更新時間、延遲與示範資料說明。
- 免費 / 會員內容邊界。
- 非投資建議與無官方背書文字。

A3 Launch / Production Engineering：

- Vercel / env / metadata / sitemap / robots.
- Smoke checks.
- Monitoring.
- Rollback.
- Post-deploy packet.

A4 Membership MVP Planning：

- Phase 2 會員 MVP 藍圖。
- Free/member boundary.
- watchlist / alert / post-market review 的最小可行規格。
- 商業追蹤事件規格。
- 可平行做規劃與規格，不在 Phase 1 實作會員架構。

建議工作比例：

- PM 50%
- A1 20%
- A2 10%
- A3 15%
- A4 5% planning only

## 8. Current CEO Priority

1. 完成 Phase 1 公開免費版，先不要讓會員 MVP 拖慢公開 Beta。
2. 持續移除公開頁內部殘留：工程指令、治理代號、local path、角色代號、資料庫欄位名與亂碼。
3. 確認首頁、簡報、週報、個股頁、方法、聲明、條款、隱私都能在 30 秒內理解市場氛圍，並在 3 分鐘內得到觀察順序。
4. A1 持續資料線，不阻塞 Phase 1 mock public Beta。
5. A2 / A3 / A4 支援 PM，但不得讓治理或規劃過細拖慢主線。

## 9. Completion Definition

Phase 1 完成定義：

- 首頁完成三層視圖：全市場總覽、核心指標面板、警示清單。
- 每個警示必有狀態、成因、更新時間、影響級別。
- 所有關鍵指標有 30 秒可懂解釋與 100 字內風險提示。
- RWD 正常、文字對比與標題階層可讀。
- 載入錯誤時有替代資訊。
- 資料流程驗證包含來源、時間戳、快取、錯誤回退。
- 核心頁面可在預期時間內穩定載入，且無阻斷性錯誤。

Checker compatibility anchors:

- understand the market mood within 30 seconds
- decide within 3 minutes
- Home includes three layers: full-market overview, core indicator panel, alert list
- Each alert includes status, cause, update time, impact level, and next step
