# Tracking Events

目前先以 `console.info` 記錄事件，並暫存在 `window.__marketSignalEvents` 方便開發驗證。未來可改接 GA4、Vercel Analytics、Supabase events 或自建資料表。

## 事件清單

| Event | 觸發時機 | 主要 payload |
| --- | --- | --- |
| `asset_selected` | 使用者切換標的 | `symbol` |
| `asset_search_changed` | 使用者搜尋標的 | `activeGroup`, `queryLength`, `resultCount`, `symbol` |
| `asset_search_cleared` | 使用者清除標的搜尋 | `activeGroup`, `source`, `symbol` |
| `asset_group_changed` | 使用者切換標的群組篩選 | `group`, `symbol` |
| `favorite_added` | 加入愛心標的 | `symbol` |
| `favorite_removed` | 移除愛心標的 | `symbol` |
| `tab_changed` | 切換四大頁籤 | `symbol`, `tab` |
| `chart_mode_changed` | 切換趨勢圖分數模式 | `symbol`, `mode` |
| `home_page_viewed` | 進入首頁 | `page` |
| `home_cta_clicked` | 點擊首頁 Quick Start 行動 | `action`, `href`, `symbol` |
| `nav_link_clicked` | 點擊主導覽連結 | `from`, `href`, `label` |
| `site_chrome_link_clicked` | 點擊全站固定區塊連結 | `area`, `href`, `label` |
| `trust_link_clicked` | 點擊方法論、資料狀態或法務信任導流連結 | `area`, `href`, `label` |
| `commercial_disclosure_link_clicked` | 點擊商業揭露區信任連結 | `context`, `href`, `label` |
| `stock_page_viewed` | 進入股票頁 | `symbol`, `name`, `signal` |
| `stock_link_clicked` | 點擊股票頁與首頁股票導流連結 | `area`, `href`, `label`, `symbol` |
| `briefing_page_viewed` | 進入晨報頁 | `page` |
| `briefing_link_clicked` | 點擊晨報頁導流連結 | `area`, `href`, `label`, `symbol` |
| `disclaimer_page_viewed` | 進入免責聲明頁 | `page` |
| `methodology_page_viewed` | 進入方法論頁 | `page` |
| `privacy_page_viewed` | 進入隱私權政策頁 | `page` |
| `terms_page_viewed` | 進入使用條款頁 | `page` |
| `weekly_page_viewed` | 進入週報頁 | `page` |
| `weekly_link_clicked` | 點擊週報頁導流連結 | `area`, `href`, `label`, `symbol` |
| `news_date_changed` | 調整新聞日期 | `symbol`, `date` |

## 實作位置

- Helper：`src/lib/tracking.ts`
- 主導覽點擊：`src/components/site-nav.tsx`
- 商業揭露區信任連結：`src/components/commercial-slot.tsx`
- 可追蹤導流連結：`src/components/tracked-link.tsx`
- 股票頁與儀表板互動：`src/components/dashboard-shell.tsx`
- 首頁、晨報、週報、方法論與信任頁瀏覽：`src/components/page-view-tracker.tsx`

## 後續接正式分析工具

保持 `trackEvent(name, payload)` 介面不變，只替換內部實作即可。正式上線前需同步補上隱私權政策與 Cookie / analytics 告知。
