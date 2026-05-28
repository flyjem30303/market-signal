# MVP 任務清單

## A. 專案基礎

- [ ] 整理 Git ownership / safe.directory。
- [ ] 建立正式 Git repo。
- [x] 建立 Next.js 專案骨架。
- [ ] 設定 TypeScript。
- [ ] 設定 ESLint / Prettier。
- [ ] 建立 Vercel 專案。
- [ ] 建立 Supabase 專案。
- [x] 補全球化資料模型欄位規格：country / exchange / currency / timezone / asset_type。

## B. 資料庫

- [x] 建立 market_exchanges 表草案。
- [x] 建立市場 / 交易所 metadata seed。
- [ ] 建立 data_runs 匯入紀錄表。
- [ ] 建立 Supabase bootstrap 驗證流程。
- [x] 建立 stocks 表草案。
- [x] 將 stocks 唯一命名空間調整為 country + exchange + symbol。
- [x] 產生完整上市股票主檔 seed。
- [x] 建立 Supabase bootstrap SQL 產生器。
- [ ] 匯入完整上市股票主檔到 Supabase。
- [x] 建立 daily_prices 表草案。
- [x] 建立 daily_scores 表草案。
- [x] 建立 user_favorites 表草案。

## C. 資料更新

- [x] 建立股票主檔更新腳本。
- [x] 建立最新每日價格 / 估值 SQL 產生腳本。
- [ ] 建立歷史每日價格更新腳本。
- [ ] 建立分數計算腳本。
- [ ] 建立排程。

## D. 前端頁面

- [x] 首頁。
- [x] 每日晨報 `/briefing`。
- [x] 股票搜尋。
- [x] 股票頁 `/stocks/[symbol]`。
- [x] 股票頁基礎行情摘要。
- [x] 今日燈號元件。
- [x] 區間圖表元件。
- [x] 新聞信心元件。
- [x] 回測摘要元件。
- [x] Repository 抽象層。
- [x] Repository data source 明確切換，不允許 Supabase 未完成時 fallback 到 mock。
- [x] 股票頁技術分析分頁。
- [x] 股票頁成交量分頁。
- [x] 股票頁股利 / 基本資料分頁。
- [x] 股票頁新聞信心儀表。

## E. SEO

- [x] 建立 metadata。
- [x] 建立 sitemap.xml。
- [x] 建立 robots.txt。
- [x] 建立股票頁結構化資料。
- [x] 建立方法論頁。
- [x] 建立週報文章模板。
- [x] 股票頁 SEO 內容區塊。
- [x] 免責聲明區塊。

## F. 法務與信任

- [x] 免責聲明。
- [x] 免責聲明獨立頁。
- [x] 隱私權政策。
- [x] 使用條款。
- [x] 聯盟行銷揭露格式。

## H. 投資模型可信度

- [x] 評分標準文件。
- [x] 方法論頁。
- [x] 資料品質欄位。
- [ ] 股票 / ETF 分開校準規格。
- [ ] 市場別模型校準規格：TW / US / ETF / INDEX。
- [ ] 回測揭露規格。

## I. 設計與體驗

- [x] 設計系統基礎。
- [x] Header 視覺升級。
- [x] 晨報第一屏視覺升級。
- [ ] 股票頁資訊層級重整。
- [ ] 手機版可讀性檢查。

## G. 會員與商業化

- [ ] 登入。
- [ ] 雲端愛心收藏。
- [ ] Email 週報。
- [ ] AdSense 預留版位。
- [ ] 付費會員規格。
- [x] 基礎追蹤事件規格。
