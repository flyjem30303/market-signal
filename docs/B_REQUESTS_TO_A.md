# B Requests To A

這份文件記錄行銷企劃 B 主動向 PM/開發者 A 提出的需求。

## Request 001：股票頁需要 SEO 內容區塊

提出者：B  
狀態：Done  
優先度：高

### 背景

目前 `/stocks/[symbol]` 已有 dashboard，但內容仍偏工具，SEO 文字內容不足。

### B 的需求

請 A 在股票頁加入 `StockSeoContent` 區塊，至少包含：

- 今日燈號摘要。
- 多頭健康度解讀。
- 回檔風險度解讀。
- 新聞信心評論摘要。
- 回測摘要。
- 免責聲明。

### 驗收標準

- `/stocks/2330` 頁面至少有 500 字以上可被搜尋引擎讀取的中文內容。
- H1 是股票代號 + 股票名稱 + 燈號。
- metadata title 包含股票代號、股票名稱、燈號。
- description 包含多頭健康度與回檔風險。

### A 的完成紀錄

- 已建立 `StockSeoContent`，個股頁包含今日燈號摘要、多頭健康度解讀、回檔風險度解讀、新聞信心評論、回測摘要與免責聲明。
- `/stocks/[symbol]` metadata 已納入股票代號、股票名稱與目前燈號。
- SEO 內容只掛在個股頁，首頁維持儀表板入口。

## Request 002：需要週報文章模板

提出者：B  
狀態：Done  
優先度：高

### 背景

週報是 SEO 與回訪的重要來源。

### B 的需求

請 A 建立週報模板頁，包含：

- 本週台股總覽。
- 健康度排行。
- 風險升溫排行。
- ETF 加碼節奏。
- AI/半導體觀察。
- 下週觀察重點。

### 驗收標準

- `/weekly` 頁面不是只有排行，要有可閱讀段落。
- 每個排行項目能連到股票頁。
- 頁面底部有免責聲明。

### A 的完成紀錄

- `/weekly` 已升級為週報文章模板，包含台股總覽、健康度排行、風險升溫排行、ETF 加碼節奏、AI/半導體觀察與下週觀察重點。
- 排行項目已連到各股票頁。
- 頁面底部已加入投資免責聲明。

## Request 003：需要基礎追蹤事件規格

提出者：B  
狀態：Done  
優先度：中

### 背景

未來要做廣告、會員與聯盟行銷，需要知道使用者行為。

### B 的需求

請 A 先定義追蹤事件名稱，不一定要馬上接 GA。

事件：

- `asset_selected`
- `favorite_added`
- `favorite_removed`
- `tab_changed`
- `stock_page_viewed`
- `weekly_page_viewed`
- `news_date_changed`

### 驗收標準

- 建立 tracking 文件。
- 前端有 `trackEvent()` helper。
- 目前可先 `console.info`，之後再接 GA。

### A 的完成紀錄

- 已建立 `src/lib/tracking.ts`，先用 `console.info` 輸出事件。
- 已在標的切換、愛心加入/移除、頁籤切換、股票頁瀏覽、週報頁瀏覽、新聞日期調整時觸發事件。
- 已建立 `docs/TRACKING_EVENTS.md` 作為後續接 GA / 事件資料表的規格。
