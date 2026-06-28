import type { Metadata } from "next";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";

export const revalidate = 300;

export const metadata: Metadata = {
  description: "搜尋台灣股票、ETF 或指數標的，建立最多 5 筆追蹤清單，快速進入單一標的觀察頁。",
  title: "標的觀察入口"
};

export default async function StocksIndexPage() {
  const watchlistItems = await getMarketSignalSearchItems();

  return (
    <main className="page-shell homepage-global-shell">
      <PageViewTracker eventName="stock_page_viewed" payload={{ page: "stocks_index" }} />

      <section className="global-home-search stock-index-search" aria-labelledby="stocks-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Target Finder</p>
            <h1 id="stocks-title">搜尋標的</h1>
          </div>
          <p>這裡是標的觀察入口，不預設進入任何單一股號。先搜尋股票代號、ETF 或指數，再進入標的頁看價格、分數、風險與原因拆解。</p>
        </div>
        <MarketWatchlistPanel
          description="最多追蹤 5 檔；強勢與風險排行會優先依追蹤清單排序。"
          eyebrow=""
          heading="搜尋股票，建立觀察清單"
          items={watchlistItems}
          loadItemsEndpoint="/api/watchlist/search-items"
          variant="compact-stock"
        />
      </section>
    </main>
  );
}
