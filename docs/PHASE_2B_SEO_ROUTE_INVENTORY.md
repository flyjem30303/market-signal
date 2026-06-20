# Phase 2B SEO Route Inventory（路由 SEO 任務盤點）

版本：2026-06-20  
範圍：Phase 2 第一主線中的 SEO 基礎線（不含廣告、不含會員、不改資料源）

## 1) 公開核心頁路由

### 1. `/`

- 目前狀態
  - metadata：未明確定義（使用 layout default）
  - canonical：預設（建議補齊）
  - OG：未全站化
  - Twitter：未全站化
  - 結構化資料：未明確定義
- SEO 目的：提供站點介紹 + 導流到首頁觀點與策略頁
- 建議定位
  - SEO title：`台股燈號與市場風險分數 | 指數燈號 Market Signal`
  - Meta description：`指數燈號用紅黃綠燈與風險分數整理台股與主要市場觀察重點，協助投資人快速理解市場風險與趨勢強弱。`
  - Primary keyword：`台股燈號`
  - Secondary keywords：`市場風險燈號、台股風險、指數風險、風險分數、投資參考指標`
  - Search intent：資訊蒐集 / 市場概況快速判讀
  - canonical strategy：保留根目錄 `/`，301/302 前導向不需特殊設定，保留首選 URL 為根域名

### 2. `/briefing`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
  - OG/Twitter：局部
  - 結構化資料：未見
- SEO 目的：建立「每週/每日市場重點」的可重複入口
- 建議定位
  - SEO title：`市場 Briefing | 指數燈號今日重點與風險提醒`
  - Meta description：`每日/每週市場 Briefing，整理風險信號、趨勢重點與觀察重點，幫助快速決定關注方向。`
  - Primary keyword：`市場報告`
  - Secondary keywords：`每週重點、每日觀察、風險訊號、趨勢重點`
  - Search intent：資訊型、決策輔助前閱讀
  - canonical strategy：固定 `/briefing`

### 3. `/weekly`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
  - OG/Twitter：局部
  - 結構化資料：未見
- SEO 目的：聚焦「每週摘要」與規律更新內容入口
- 建議定位
  - SEO title：`每週市場觀察 | 指數燈號`
  - Meta description：`每週整理大盤與主流資產動態，提供可讀、可比較的市場觀察素材。`
  - Primary keyword：`每週市場報告`
  - Secondary keywords：`市場回顧、週報、風險總結`
  - Search intent：定期更新資訊需求
  - canonical strategy：固定 `/weekly`

### 4. `/methodology`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
  - OG/Twitter：局部
  - 結構化資料：未見
- SEO 目的：建立方法透明度與信任（E-E-A-T 相關基礎）
- 建議定位
  - SEO title：`方法論 | 指數燈號如何計算風險分數`
  - Meta description：`說明指數燈號風險分數的計算邏輯、資料來源邏輯與更新節奏，讓讀者了解風險訊號依據。`
  - Primary keyword：`市場風險方法論`
  - Secondary keywords：`信號計算方式、指標權重、風險判讀`
  - Search intent：信任建立、方法驗證
  - canonical strategy：固定 `/methodology`

### 5. `/disclaimer`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
- SEO 目的：法律/免責合規頁，降低誤導風險
- 建議定位
  - SEO title：`免責條款 | 指數燈號`
  - Meta description：`本頁說明資訊用途與風險揭露，指數燈號不提供投資建議，不保證特定回報。`
  - Primary keyword：`免責條款`
  - Secondary keywords：`投資風險揭露、非投資建議`
  - Search intent：規範資訊查詢
  - canonical strategy：固定 `/disclaimer`

### 6. `/privacy`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
- SEO 目的：隱私聲明，樹立合規可信度
- 建議定位
  - SEO title：`隱私權政策 | 指數燈號`
  - Meta description：`說明網站資料收集與使用範圍，包含 cookies、分析工具與使用者權益。`
  - Primary keyword：`隱私權政策`
  - Secondary keywords：`cookies 政策、數據保護`
  - Search intent：隱私合規查詢
  - canonical strategy：固定 `/privacy`

### 7. `/terms`

- 目前狀態
  - metadata：有 title / description
  - canonical：依預設
- SEO 目的：服務條款頁，降低信任疑慮
- 建議定位
  - SEO title：`服務條款 | 指數燈號`
  - Meta description：`網站使用規範與服務條款，包含內容使用、禁止用途與責任聲明。`
  - Primary keyword：`服務條款`
  - Secondary keywords：`網站條款、服務規範`
  - Search intent：合規與規則查詢
  - canonical strategy：固定 `/terms`

### 8. `/stocks/[symbol]`

- 目前狀態
  - metadata：`generateMetadata` 已有
  - canonical：動態生成
  - OG：有（動態）
  - Twitter：未完整一致（建議補齊）
  - 結構化資料：有 `FinancialProduct` JSON-LD
- SEO 目的：依股票符號提供可索引且可比較的風險摘要頁
- 建議定位（動態）
  - SEO title：`{股票名稱或代碼} 風險信號 | 指數燈號`
  - Meta description：`查看 {股票代碼} 當前風險分數、紅黃綠燈訊號與近期趨勢重點。`
  - Primary keyword：`{股票代碼} 風險訊號`
  - Secondary keywords：`紅綠燈 指數 燈號、走勢觀察、投資風險`
  - Search intent：長尾資訊需求、特定標的個別查詢
  - canonical strategy：
    - 有效資料才 output 且標註 canonical 為 `/stocks/{symbol}`
    - 缺資料/假資料/fallback/mock 則 `noindex, nofollow`
    - 第一批進 sitemap 的可索引標的上限為 `100`
    - 其餘股票頁可保留可訪問，但不得自動進 sitemap

## 2) 排除/內部路由

- `/internal/*`、`/api/internal`、`/membership`、`/watchlist`：保留 `noindex`，僅限內部或未對外功能。

## 3) 後續 2A 全球指數 URL 結構（保留）

以下為 Phase 2A 佈局保留，不在此階段實作資料：

- `/markets`
- `/markets/us`
- `/markets/jp`
- `/indices/spx`
- `/indices/nikkei-225`

建議規則：
- 預先建立靜態骨架 metadata（目的 + canonical）
- 內容實作可先與真實資料解耦，但不得只有 `Coming Soon`
- 若進入可索引狀態，每頁需有最低教育內容：市場定義、如何解讀、未來資料範圍、非投資建議聲明
- 避免一次大量索引薄內容頁，採步進式開放。

## 4) 每頁一致性檢查項目（建議自動化）

- 每頁要有：
  - 非空 title（不超長）
  - 非空 description（<180 字建議）
  - `canonical` 策略明確
  - OG title / description 基礎欄位
  - Twitter card type / title / description
- `/internal/*` 全部需維持 `index:false`。
- `/stocks/[symbol]` 需有「資料品質 gating」與 fallback 索引策略。
