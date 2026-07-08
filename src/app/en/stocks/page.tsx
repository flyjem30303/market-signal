import type { Metadata } from "next";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";
import { buildRouteMetadata } from "@/lib/seo";

export const revalidate = 300;

const stocksTitle = "Target Observation";
const stocksDescription =
  "Search Taiwan stocks, ETFs, and index targets in Market Signal. Target pages support observation, not buy or sell recommendations.";

export const metadata: Metadata = buildRouteMetadata({
  description: stocksDescription,
  path: "/en/stocks",
  title: stocksTitle
});
metadata.alternates = buildI18nAlternates("stocks", SECONDARY_LOCALE);
metadata.openGraph = { ...metadata.openGraph, locale: "en_US", url: "/en/stocks" };

export default async function EnglishStocksPage() {
  const watchlistItems = await getMarketSignalSearchItems();

  return (
    <main className="page-shell homepage-global-shell">
      <PageViewTracker eventName="stock_page_viewed" payload={{ page: "en_stocks_index" }} />

      <section className="global-home-search stock-index-search" aria-labelledby="stocks-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Target Finder</p>
            <h1 id="stocks-title">Search Targets</h1>
          </div>
          <p>This is the target entry page. It does not automatically open any single symbol. Search by code or name, then open a target page for price, scores, risk, and explanation context.</p>
        </div>
        <MarketWatchlistPanel
          description="Track up to 5 targets; strength and risk rankings prioritize your tracked list."
          eyebrow=""
          heading="Search stocks and build an observation list"
          items={watchlistItems}
          loadItemsEndpoint="/api/watchlist/search-items"
          locale="en"
          variant="compact-stock"
        />
      </section>
    </main>
  );
}
