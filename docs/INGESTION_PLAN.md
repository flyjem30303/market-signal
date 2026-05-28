# 資料匯入計畫

目標：把目前 mock model 逐步替換成真實資料。

## 匯入優先順序

### 1. 股票主檔

目的：建立所有可查詢標的。

範圍：

- 上市股票
- ETF
- 後續再加上櫃股票

欄位：

- symbol
- name
- market
- industry
- listed_date
- is_etf
- is_active

資料來源：

- TWSE OpenAPI
- TWSE ISIN / securities list
- TPEx OpenAPI，第二階段

更新頻率：

- 每日一次即可

### 2. 每日價格

目的：建立趨勢、回測、報酬、波動、均線。

欄位：

- open
- high
- low
- close
- volume
- turnover

更新頻率：

- 每個交易日收盤後

### 3. 估值資料

目的：建立估值風險度。

欄位：

- pe
- pb
- dividend_yield

更新頻率：

- 每日一次

### 4. 籌碼資料

目的：建立外資、融資、當沖與市場熱度。

欄位：

- foreign_net_buy
- investment_trust_net_buy
- dealer_net_buy
- margin_balance
- short_balance
- day_trade_ratio

更新頻率：

- 每日一次

### 5. 基本面資料

目的：建立獲利健康度。

欄位：

- monthly_revenue
- revenue_yoy
- eps_ttm
- gross_margin
- operating_margin

更新頻率：

- 月營收：每月
- 財報：每季

### 6. 國際與宏觀資料

目的：建立宏觀與產業上游壓力。

資料：

- NVIDIA
- SOX
- NASDAQ
- USD/TWD
- DXY
- US 10Y yield
- VIX

更新頻率：

- 每日一次

### 7. 新聞資料

目的：建立新聞信心評論。

初期策略：

- 不買 API
- 先做手動週報
- 對重大事件建立人工 news_items

中期策略：

- RSS 或合法 API
- 每則新聞建立 category、impact_score、relevance_score

## 初期批次流程

```text
fetch stock master
fetch daily prices
fetch valuation
fetch flows
calculate scores
generate weekly summary
```

## 目前進度

- 已建立 TWSE 官方 OpenAPI 股票主檔抓取腳本：`npm run fetch:stocks`。
- 目前股票主檔 seed 來源包含手動保留的指數 / ETF，以及 TWSE 上市普通股資料。
- TWSE `產業別` 目前保留官方代碼，後續再建立產業代碼對照表，不在匯入腳本中硬轉換。
- 已建立 TWSE 官方 OpenAPI 最新每日行情 / 估值 SQL 產生腳本：`npm run fetch:daily-market`。
- 最新每日行情腳本會產生 `supabase/seed/002_seed_latest_market_data.sql`，只包含股票主檔已存在的代號。
- 股票主檔已補全球化欄位：`country`、`exchange`、`currency`、`timezone`、`asset_type`。
- TWSE 每日行情 SQL 已改用 `country + exchange + symbol` 對應 `stocks`，避免未來全球市場 symbol 碰撞。

## 模型 v1 資料需求

| 模組 | 必要資料 |
|---|---|
| 價格趨勢 | close, volume |
| 獲利基本面 | revenue_yoy, eps_ttm |
| 估值壓力 | pe, pb, dividend_yield |
| 市場廣度 | 同產業上漲比例、站上均線比例 |
| 籌碼資金 | 三大法人、融資、當沖 |
| 宏觀上游 | SOX, NVDA, 10Y, DXY, USD/TWD |

## 每日更新時間建議

台灣時間：

- 15:30 後：價格與成交資料
- 17:00 後：法人資料
- 20:00 後：融資融券、當沖與彙整
- 隔日早上：美股與宏觀資料補完

## 錯誤處理

- 若某資料源失敗，不中斷整體更新。
- daily_scores 要記錄 model_version。
- daily_scores 要記錄 data_quality_score、data_quality_grade、stale_data_flags、missing_module_flags、last_updated_at。
- 缺資料時該模組降權或沿用最近有效值，但要標示資料品質。
