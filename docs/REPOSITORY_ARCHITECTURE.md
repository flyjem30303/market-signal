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

`NEXT_PUBLIC_DATA_SOURCE` 目前支援：

```text
mock
supabase
```

在 Supabase repository 完成前，請保持：

```text
NEXT_PUBLIC_DATA_SOURCE=mock
```

如果設定成 `supabase`，系統會明確報錯，不會 fallback 到 mock。這是刻意設計，避免正式環境誤以為已接真實資料。

## 未來 Supabase 實作

`supabase-market-signal-repository.ts` 已建立佔位。正式接資料庫時，會把查詢對應到：

- `stocks`
- `daily_scores`
- `score_modules`
- `news_items`
- `stock_news`

接 Supabase 時要先處理 async repository 介面，或建立 server-only data loader；目前同步介面是為了讓 mock MVP 快速運作。

## 原則

- React component 不直接查資料庫。
- React component 不直接知道資料來自 mock 還是 Supabase。
- 切換資料來源只改 `getMarketSignalRepository()`。
- 先保持同步介面，等 Server Components / API route 整理後再改成 async。
- 不允許 Supabase 未完成時靜默 fallback 到 mock。
