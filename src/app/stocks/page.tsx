import type { Metadata } from "next";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";

export const revalidate = 300;

export const metadata: Metadata = {
  description: "搜尋台灣股票、ETF 或指數標的，建立最多 5 筆觀察清單，快速進入單一標的頁查看價格、分數、風險與資料日期。",
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

      <section className="panel method-section" aria-labelledby="stocks-scope-title">
        <p className="eyebrow">Search Scope</p>
        <h2 id="stocks-scope-title">這頁可以搜尋什麼？</h2>
        <p>
          標的觀察入口支援台灣上市股票、ETF 與主要指數搜尋。你可以輸入代號或名稱，例如 2330、0050 或 TWII，
          再進入標的頁查看價格、資料日期、分數與風險拆解。
        </p>
        <div className="method-table" role="table" aria-label="標的觀察搜尋範圍">
          <div className="method-row method-head" role="row">
            <span>類型</span>
            <span>範例</span>
            <span>用途</span>
          </div>
          <div className="method-row" role="row">
            <strong>股票</strong>
            <span>2330、2317</span>
            <span>快速進入單一股票觀察頁。</span>
          </div>
          <div className="method-row" role="row">
            <strong>ETF</strong>
            <span>0050、006208</span>
            <span>查看 ETF 價格、漲跌與觀察狀態。</span>
          </div>
          <div className="method-row" role="row">
            <strong>指數</strong>
            <span>TWII</span>
            <span>回到市場層級的風險脈絡。</span>
          </div>
        </div>
        <p className="runtime-boundary-line">
          觀察清單與排行是市場觀察輔助，不是投資建議；完整股票頁索引仍維持 gated，不會一次開放全市場 SEO。
        </p>
      </section>
    </main>
  );
}
