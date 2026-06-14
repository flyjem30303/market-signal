# 指數燈號網站 BRIEF

Updated: 2026-06-14

Status: `index_signal_brief_phase_1_public_first_phase_2_membership_path`

Owner: CEO / PM

## CEO Decision

新版 BRIEF 拆成兩個階段執行：

- Phase 1：先完成所有人都可以使用的公開免費「指數燈號網站」。
- Phase 2：Phase 1 穩定後，再製作會員 MVP、會員內容與會員架構。
- Phase 1 是「所有人可以使用的公開免費指數燈號網站」。
- Phase 2 是「會員 MVP」。
- Phase 1 is the public free index-lighting site.
- Phase 2 is the membership MVP path.
- Phase 1 is current execution priority.
- Phase 2 should not delay Phase 1 launch readiness.

CEO 決策：目前不能讓會員登入、付款、watchlist、個人化警示與會員專屬內容拖慢公開 Beta。會員機制是產品方向，但不是 Phase 1 的阻塞條件。Phase 1 要先讓一般投資者進站後能快速理解市場氛圍、核心指標、風險提醒與資料更新狀態。

## 1. 目標

本專案目標是打造一個面向一般投資者的「指數燈號網站」，透過紅、黃、綠等視覺化狀態，協助使用者快速理解目前市場風險、趨勢強弱與觀察重點。

網站第一階段以「降低市場資訊理解門檻」為核心，讓使用者在短時間內看懂目前市場處於偏多、觀望、警戒或高風險狀態。

下一階段將導入會員機制，將網站從單純的市場資訊展示，升級為「免費市場總覽 + 會員深度解讀 + 個人化追蹤」的產品模式。

免費用戶主要取得即時燈號、基礎指標與市場狀態總覽；會員用戶則可取得更完整的市場解讀、盤後複盤、自選追蹤與個人化警示，提升回訪率、使用黏著度與付費轉換。

## 2. 背景

目前市場資訊分散在新聞、券商看盤工具、社群討論與個別數據網站中，使用者即使取得大量資訊，也常難以判斷哪些訊號真正重要。

指數燈號網站希望解決的問題是：把複雜的市場數據轉換成簡單、可理解、可追蹤的狀態提示，協助使用者建立固定的市場觀察流程。

但若網站只提供免費燈號與單層數據，長期容易停留在「查詢工具」定位，使用頻率與商業價值有限。因此下一階段需要規劃會員內容，將「看到燈號」延伸為「理解燈號」、「追蹤變化」與「建立自己的觀察紀錄」。

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
- 自選 watchlist
- 自訂警示條件
- 歷史燈號紀錄
- 關鍵指標變化原因
- 情境式風險提醒
- 會員專屬教學內容

會員 MVP 優先內容包含：

- 每日會員專區《市場三層解讀》：包含市場總觀、關鍵指標變化、後續觀察重點。
- 會員 watchlist + 自訂警示條件：讓使用者追蹤自己關心的指數、ETF 或指標。
- 盤後複盤報告：回顧當日燈號是否有效、哪些訊號值得隔日追蹤。

文案素材需維持中性、穩健、易懂，不使用誇大報酬、恐慌式警語或直接買賣建議。

## 4. 邊界

本網站定位為市場資訊整理、風險辨識與觀察輔助工具，不提供個股買賣建議、不提供保證獲利承諾，也不代替使用者做投資決策。

免費內容以市場總覽與基礎指標為主，需讓使用者清楚知道目前市場狀態，但不提供完整深度解讀與個人化追蹤。

會員內容可提供更深入的市場分析、警示原因、盤後複盤與個人化觀察工具，但仍須避免形成直接投資建議。所有會員內容應以「觀察」、「風險提醒」、「情境判斷」與「資料解讀」為核心。

會員功能初期不追求完整交易工具化，不做下單、不串接券商交易、不提供個人資產配置建議。若未來要擴充至更進階功能，需另行處理法規、資料授權與風險揭露。

資料面需明確標示來源、更新時間與可能延遲。若資料異常或未更新，前台需顯示清楚狀態，避免使用者誤判。

目前資料與執行邊界：

- `publicDataSource=mock`
- `scoreSource=mock`
- 不執行 SQL
- 不寫 Supabase
- 不建立 staging rows
- 不修改 `daily_prices`
- 不抓取、儲存或提交 raw market data
- 不印 secrets 或 raw payloads
- 不宣稱即時真實資料
- 不提供投資建議

## 5. 會員章節規劃

會員機制的產品定位是「讓使用者不只看到市場燈號，而是能理解燈號背後的原因，並建立自己的追蹤流程」。

會員內容可分為三層：

第一層：深度解讀

- 提供每日市場三層解讀、關鍵指標變化原因、燈號轉變說明與後續觀察重點。

第二層：個人化追蹤

- 提供 watchlist、自訂警示條件、個人關注指標、收藏紀錄與提醒功能。

第三層：複盤與學習

- 提供盤後複盤、歷史燈號案例、情境式風險說明、指標教學與會員專屬內容。

初期建議先以 MVP 會員內容驗證需求，不一次做太多進階功能。優先讓使用者感受到「付費後可以更快理解市場、更容易追蹤重點、更能回看判斷品質」。

## 6. Phase Plan

### Phase 1：公開免費指數燈號網站

Phase 1 是目前主線，目標是公開 Beta 可用。

Phase 1 必須完成：

- 首頁可顯示市場總覽燈號、核心指標、主要風險提示與資料更新時間。
- 使用者進入網站後，能快速理解目前市場狀態。
- 每個核心燈號具備狀態、原因、更新時間與簡短解釋。
- 所有公開頁具有必要的風險聲明與非投資建議提示。
- 資料來源、更新時間、可能延遲與示範資料狀態要清楚揭露。
- 核心頁面可正常載入，RWD 與可讀性達到公開 Beta 水準。

Phase 1 不包含：

- 會員登入
- 會員付款
- watchlist 儲存
- 自訂警示執行
- 會員專屬內容實作
- 券商下單或交易工具
- 真實資料 promotion

### Phase 2：會員 MVP

Phase 2 在 Phase 1 穩定後啟動。

會員 MVP 必須完成：

- 使用者可以註冊 / 登入會員。
- 使用者可以查看會員內容。
- 使用者可以建立 watchlist。
- 使用者可以設定至少一種警示條件。
- 使用者可以查看盤後複盤內容。
- 會員內容具備更完整的原因分析、觀察重點與複盤紀錄。

會員 MVP 三個優先模組：

- 每日市場三層解讀
- 會員 watchlist + 自訂警示條件
- 盤後複盤報告

商業完成定義：

- 能追蹤免費用戶到會員頁的點擊率。
- 能追蹤會員註冊率。
- 能追蹤會員內容閱讀率。
- 能追蹤 watchlist 使用率。
- 能追蹤盤後複盤回訪率。

## 7. Workstream Assignment

PM 主線：

- Phase 1 公開產品與 runtime 整合
- 首頁、briefing、weekly、stock、methodology、disclaimer、terms、privacy 的使用者可理解性
- 燈號狀態、原因、資料更新時間與下一步觀察
- 公開頁清理與整合
- Beta 驗收與狀態紀錄

A1 Data / Source / Coverage：

- 合法免費可自動化資料源
- 覆蓋率與 universe
- 欄位契約
- ingestion / backfill 前置
- aggregate-only 證據與 handoff

A2 Public Copy / Product Safety：

- 非投資建議
- 風險聲明
- 資料來源與更新時間文案
- 免費 / 會員內容邊界
- 公開頁用語檢查

A3 Launch / Production Engineering：

- Vercel / env / metadata / sitemap / robots
- smoke check
- monitoring
- rollback
- post-deploy packet

A4 Membership MVP Planning：

- Phase 2 會員 MVP 規劃
- watchlist / 警示 / 盤後複盤資料模型
- 免費 / 會員內容邊界
- 暫不進入實作，除非 CEO/PM 判定 Phase 1 已穩定

CEO 可隨時調整工作流數量與比例。原則是：Phase 1 不被 Phase 2 拖慢；資料線不阻塞公開可用性；信任文案不能落後於公開頁。

## 8. Current CEO Priority

1. 先把 Phase 1 公開免費網站做成一般投資者看得懂的產品，而不是內部專案看板。
2. 移除公開頁的內部工程語彙、治理語彙與使用者不需要看的資訊。
3. 確認 home、briefing、weekly、stock、methodology、disclaimer、terms、privacy 都能支撐「30 秒理解、3 分鐘判斷」。
4. A1 繼續資料來源與覆蓋率，但不阻塞 Phase 1 mock 公開 Beta。
5. A2/A3/A4 可同步進行，但不能把 Phase 2 功能提前變成 Phase 1 阻塞。

## 9. Checker Compatibility Anchors

These English anchors preserve existing local checks while the product brief uses Chinese Phase 1 / Phase 2 wording:

- understand the market mood within 30 seconds
- decide within 3 minutes
- Home includes three layers: full-market overview, core indicator panel, alert list
- Each alert includes status, cause, update time, impact level, and next step
