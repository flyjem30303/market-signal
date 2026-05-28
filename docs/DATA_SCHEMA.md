# 資料庫 Schema 草案

建議正式網站使用 PostgreSQL。初期可用 Supabase。

## market_exchanges

市場 / 交易所 metadata。這是全球化擴張的基礎表，避免把幣別、時區與語系寫死在程式裡。

| 欄位 | 型別 | 說明 |
|---|---|---|
| country | text | 國家 / 地區代碼，例如 TW / US |
| exchange | text | 交易所，例如 TWSE / TPEx / NASDAQ / NYSE |
| name | text | 英文名稱 |
| display_name | text | 畫面顯示名稱 |
| currency | text | 主要交易幣別 |
| timezone | text | 交易所時區 |
| locale | text | 預設語系 |
| is_active | boolean | 是否已啟用資料覆蓋 |

主鍵：

```sql
primary key(country, exchange)
```

## data_runs

資料匯入紀錄。每次 bootstrap 或排程匯入都應記錄資料來源、目標表、狀態、筆數與資料日期範圍。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid | 主鍵 |
| run_key | text | 匯入識別鍵，例如 bootstrap-daily-prices |
| source_name | text | 資料來源名稱，例如 TWSE OpenAPI |
| source_url | text | 資料來源 URL |
| target_table | text | 寫入目標表 |
| status | text | success / partial / failed |
| row_count | integer | 匯入筆數 |
| data_start_date | date | 資料起始日期 |
| data_end_date | date | 資料結束日期 |
| started_at | timestamp | 匯入開始時間 |
| finished_at | timestamp | 匯入完成時間 |
| notes | text | 備註 |
| error_message | text | 錯誤訊息 |

此表是資料品質與 freshness UI 的基礎。正式切 Supabase repository 前，必須能查詢此表判斷資料是否過期或缺漏。

## stocks

股票主檔。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid | 主鍵 |
| symbol | text | 股票代號，例如 2330 |
| name | text | 股票名稱 |
| market | text | 市場分組，例如 TWSE / TPEx / INDEX |
| country | text | 國家 / 地區代碼，例如 TW / US |
| exchange | text | 交易所，例如 TWSE / TPEx / NASDAQ / NYSE |
| currency | text | 交易幣別，例如 TWD / USD |
| timezone | text | 交易所時區，例如 Asia/Taipei / America/New_York |
| asset_type | text | stock / etf / index |
| industry | text | 產業 |
| listed_date | date | 上市日 |
| is_etf | boolean | 是否 ETF |
| is_active | boolean | 是否仍交易 |
| created_at | timestamp | 建立時間 |
| updated_at | timestamp | 更新時間 |

## daily_prices

每日價格。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| trade_date | date | 交易日 |
| open | numeric | 開盤 |
| high | numeric | 最高 |
| low | numeric | 最低 |
| close | numeric | 收盤 |
| volume | numeric | 成交量 |
| turnover | numeric | 成交金額 |

建議索引：

```sql
unique(country, exchange, symbol)
```

注意：`symbol` 不可視為全球唯一鍵。台股 MVP 可繼續使用 `/stocks/2330`，但資料層必須以 `country + exchange + symbol` 作為全球擴張命名空間。

`stocks.country + stocks.exchange` 需對應 `market_exchanges`，讓每個標的都有明確的市場、幣別、時區與語系來源。

## daily_fundamentals

基本面與估值。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| trade_date | date | 日期 |
| pe | numeric | 本益比 |
| pb | numeric | 股價淨值比 |
| dividend_yield | numeric | 殖利率 |
| revenue_yoy | numeric | 月營收年增率 |
| eps_ttm | numeric | 近四季 EPS |

## daily_flows

籌碼資料。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| trade_date | date | 日期 |
| foreign_net_buy | numeric | 外資買賣超 |
| investment_trust_net_buy | numeric | 投信買賣超 |
| dealer_net_buy | numeric | 自營商買賣超 |
| margin_balance | numeric | 融資餘額 |
| short_balance | numeric | 融券餘額 |
| day_trade_ratio | numeric | 當沖比 |

## daily_scores

模型分數。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| trade_date | date | 日期 |
| health_score | integer | 多頭健康度 |
| risk_score | integer | 回檔風險度 |
| composite_score | integer | 綜合分 |
| data_quality_score | integer | 資料品質分數，0 到 100 |
| data_quality_grade | text | A / B / C / D |
| stale_data_flags | text[] | 延遲或過期資料標記 |
| missing_module_flags | text[] | 缺漏模組標記 |
| signal | text | green/yellow/orange/red/deep-red |
| model_version | text | 模型版本 |
| last_updated_at | timestamp | 分數最後更新時間 |

## score_modules

每日模組分數。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| trade_date | date | 日期 |
| module_key | text | trend / earnings / valuation / breadth / flow / macro |
| health | integer | 模組健康度 |
| risk | integer | 模組風險度 |
| weight | numeric | 權重 |

## news_items

新聞資料。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid | 主鍵 |
| published_at | timestamp | 發布時間 |
| source | text | 來源 |
| title | text | 標題 |
| summary | text | 摘要 |
| url | text | 原文連結 |
| category | text | 基本面 / 估值 / 籌碼 / 宏觀 / 情緒 |
| impact_score | integer | -3 到 +3 |

## stock_news

股票與新聞關聯。

| 欄位 | 型別 | 說明 |
|---|---|---|
| stock_id | uuid | stocks.id |
| news_id | uuid | news_items.id |
| relevance_score | numeric | 關聯度 |

## users

會員。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid | 主鍵 |
| email | text | 信箱 |
| plan | text | free / pro |
| created_at | timestamp | 建立時間 |

## user_favorites

愛心收藏。

| 欄位 | 型別 | 說明 |
|---|---|---|
| user_id | uuid | users.id |
| stock_id | uuid | stocks.id |
| created_at | timestamp | 收藏時間 |
