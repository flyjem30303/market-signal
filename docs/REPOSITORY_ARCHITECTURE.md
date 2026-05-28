# Repository Architecture

目標：讓 UI 不直接依賴 mock data，未來可以切換到 Supabase。

## 目前結構

```text
src/lib/repositories/types.ts
src/lib/repositories/mock-market-signal-repository.ts
src/lib/repositories/supabase-market-signal-repository.ts
src/lib/repositories/market-signal-repository.ts
```

## 介面

`MarketSignalRepository` 定義 UI 需要的資料操作：

- `getAssets()`
- `getAssetBySymbol(symbol)`
- `getSnapshot(symbol, date)`
- `getSeries(symbol, range)`
- `getRelatedNews(symbol, date)`
- `getBacktestBuckets(symbol)`

## 目前實作

目前 `getMarketSignalRepository()` 回傳 mock repository。

mock repository 仍使用本地模型：

```text
src/lib/assets.ts
src/lib/signal-model.ts
```

## 未來 Supabase 實作

`supabase-market-signal-repository.ts` 已建立佔位。正式接資料庫時，會把查詢對應到：

- `stocks`
- `daily_scores`
- `score_modules`
- `news_items`
- `stock_news`

## 原則

- React component 不直接查資料庫。
- React component 不直接知道資料來自 mock 還是 Supabase。
- 切換資料來源只改 `getMarketSignalRepository()`。
- 先保持同步介面，等 Server Components / API route 整理後再改成 async。

