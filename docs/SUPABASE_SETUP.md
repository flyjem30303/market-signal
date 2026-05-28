# Supabase Setup

## 目前狀態

專案已具備：

- Supabase migration SQL
- 市場 / 交易所 metadata seed SQL
- 股票 seed SQL
- 最新每日行情 / 估值 seed SQL
- 匯入紀錄 seed SQL
- 單檔 bootstrap SQL 產生器
- Supabase client helper
- `.env.example`
- database types 草案

尚未建立實際 Supabase 專案。

## 建立專案

1. 到 Supabase 建立新專案。
2. 取得 Project URL。
3. 取得 anon public key。
4. 取得 service role key。
5. 在專案根目錄建立 `.env.local`。

```text
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
NEXT_PUBLIC_DATA_SOURCE=mock
```

注意：`SUPABASE_SERVICE_ROLE_KEY` 不可以暴露到瀏覽器。

完整執行步驟請看：

```text
docs/SUPABASE_EXECUTION_RUNBOOK.md
```

目前 UI repository 尚未切到 Supabase，請先保持：

```text
NEXT_PUBLIC_DATA_SOURCE=mock
```

等 `src/lib/repositories/supabase-market-signal-repository.ts` 完成後，再改成：

```text
NEXT_PUBLIC_DATA_SOURCE=supabase
```

若提前切換，系統會明確報錯，避免把 mock data 誤認為真實資料。

## 建立資料表

最簡單方式是在 Supabase SQL editor 執行單一 bootstrap 檔：

```bash
npm run db:bootstrap
```

然後複製以下檔案內容到 Supabase SQL editor 執行：

```text
supabase/bootstrap.sql
```

執行完成後，檔案底部會跑驗證查詢，應看到：

```text
stocks_count 約 1086
market_exchanges_count 約 4
daily_prices_count 約 1083
daily_fundamentals_count 約 1077
data_runs 會列出各資料表的來源、狀態、筆數與資料日期
latest_price_date 為最新 TWSE 交易日
latest_fundamental_date 為最新 TWSE 估值日
```

也可以在本機用 service role key 驗證：

```bash
npm run db:validate
```

此指令只讀取 Supabase 資料表，確認 bootstrap 是否成功，不會切換 UI 資料來源。

若要分步執行，可依序執行：

在 Supabase SQL editor 執行：

```text
supabase/migrations/0001_initial_schema.sql
```

## 匯入初始股票

在 Supabase SQL editor 執行：

```text
supabase/seed/001_seed_stocks.sql
```

如果修改 `data/seeds/stocks.seed.json`，可重新產生 seed SQL：

```bash
npm run seed:stocks
```

如果更新最新行情 / 估值，可重新產生：

```bash
npm run fetch:daily-market
npm run db:bootstrap
```

## 切換資料來源

目前正式 UI 仍使用 mock repository。

未來切換點：

```text
src/lib/repositories/market-signal-repository.ts
```

把 `mockMarketSignalRepository` 換成 Supabase repository。

## 建議順序

1. 先只接 `stocks`。
2. 確認股票頁可從 Supabase 讀主檔。
3. 再接 `daily_scores`。
4. 再接 `score_modules`。
5. 最後接新聞與會員收藏。
