# Tracking Events

目前先以 `console.info` 記錄事件，並暫存在 `window.__marketSignalEvents` 方便開發驗證。未來可改接 GA4、Vercel Analytics、Supabase events 或自建資料表。

## 事件清單

| Event | 觸發時機 | 主要 payload |
| --- | --- | --- |
| `asset_selected` | 使用者切換標的 | `symbol` |
| `favorite_added` | 加入愛心標的 | `symbol` |
| `favorite_removed` | 移除愛心標的 | `symbol` |
| `tab_changed` | 切換四大頁籤 | `symbol`, `tab` |
| `home_page_viewed` | 進入首頁 | `page` |
| `stock_page_viewed` | 進入股票頁 | `symbol`, `name`, `signal` |
| `briefing_page_viewed` | 進入晨報頁 | `page` |
| `disclaimer_page_viewed` | 進入免責聲明頁 | `page` |
| `methodology_page_viewed` | 進入方法論頁 | `page` |
| `privacy_page_viewed` | 進入隱私權政策頁 | `page` |
| `terms_page_viewed` | 進入使用條款頁 | `page` |
| `weekly_page_viewed` | 進入週報頁 | `page` |
| `news_date_changed` | 調整新聞日期 | `symbol`, `date` |

## 實作位置

- Helper：`src/lib/tracking.ts`
- 股票頁與儀表板互動：`src/components/dashboard-shell.tsx`
- 首頁、晨報、週報、方法論與信任頁瀏覽：`src/components/page-view-tracker.tsx`

## 後續接正式分析工具

保持 `trackEvent(name, payload)` 介面不變，只替換內部實作即可。正式上線前需同步補上隱私權政策與 Cookie / analytics 告知。
