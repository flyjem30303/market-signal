# Sitemap 草案

## 公開頁

```text
/
/briefing
/stocks
/stocks/[symbol]
/industries
/industries/[industry]
/ranking
/ranking/healthy-uptrend
/ranking/high-risk
/ranking/high-health-high-risk
/weekly
/weekly/[slug]
/about
/methodology
/privacy
/terms
/disclaimer
```

## 會員頁

```text
/login
/account
/watchlist
/alerts
/reports
/billing
```

## SEO 頁面優先順序

第一批：

- 0050
- 006208
- 台指
- 台積電
- 聯發科
- 鴻海
- 台達電
- 廣達
- 國泰金
- 中華電

第二批：

- 台灣 50 成分股。
- 高成交量股票。
- ETF。

第三批：

- 全上市。
- 全上櫃。

## 目前實作狀態

- `src/app/sitemap.ts` 已產生首頁、週報、方法論、免責聲明與目前 repository 內所有股票頁。
- `src/app/robots.ts` 已開放搜尋引擎讀取，並指向 sitemap。
- `/stocks/[symbol]` 已加入 canonical、OpenGraph 與 JSON-LD 結構化資料。
- 正式上線前請設定 `NEXT_PUBLIC_SITE_URL` 為正式網域。

## 股票頁內容模板

每個股票頁應包含：

- 股票名稱與代號。
- 今日燈號。
- 多頭健康度。
- 回檔風險度。
- 20 / 60 / 120 日分數變化。
- 六大模組分數。
- 同產業比較。
- 近期新聞信心評論。
- 回測摘要。
- 免責聲明。
