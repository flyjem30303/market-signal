import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getMarketRegistry, productionCurrentMarketId, type MarketRegistryEntry } from "@/lib/market-registry";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { buildRouteMetadata } from "@/lib/seo";
import type { SignalSnapshot } from "@/lib/signal-model";

export const revalidate = 300;

const marketsTitle = "Global Market Overview";
const marketsDescription =
  "Explore market risk, signal status, and data maturity. Taiwan is the current production market; global markets remain planned until approved data and methodology gates are complete.";

export const metadata: Metadata = buildRouteMetadata({
  description: marketsDescription,
  path: "/en/markets",
  title: marketsTitle
});
metadata.alternates = buildI18nAlternates("markets", SECONDARY_LOCALE);
metadata.openGraph = { ...metadata.openGraph, locale: "en_US", url: "/en/markets" };

export default async function EnglishMarketsPage() {
  const { repository } = await getMarketSignalRuntime();
  const marketSnapshot = getLatestSnapshot(repository.getSeries("TWII"));
  const marketRegistryEntries = getMarketRegistry();
  const productionMarketEntry = marketRegistryEntries.find((market) => market.id === productionCurrentMarketId);
  const plannedMarketEntries = marketRegistryEntries.filter((market) => market.id !== productionCurrentMarketId && market.publicAvailability !== "private-only");

  return (
    <main className="page-shell homepage-global-shell">
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "en_markets" }} />

      <section className="global-market-map global-market-map--explorer" aria-labelledby="markets-title">
        <div className="markets-explorer-hero">
          <div>
            <p className="eyebrow">Market Explorer</p>
            <h1 id="markets-title">Global Market Overview</h1>
            <p>Explore market risk, signal status, and data maturity. This page owns full market exploration while the homepage stays focused on daily decision entry.</p>
          </div>
          <div className="markets-explorer-summary" aria-label="Market coverage summary">
            <span>
              <small>Production markets</small>
              <strong>{productionMarketEntry ? 1 : 0}</strong>
            </span>
            <span>
              <small>Planned</small>
              <strong>{plannedMarketEntries.length}</strong>
            </span>
            <span>
              <small>Global Composite</small>
              <strong>Not active</strong>
            </span>
          </div>
        </div>

        <div className="markets-explorer-scope" aria-label="Current market entry scope">
          <span>Registered markets and indices are listed here.</span>
          <span>Global composite and cross-market rankings unlock after at least 2 production markets pass their gates.</span>
        </div>

        <div className="markets-explorer-production" aria-label="Production market entries">
          <div className="markets-explorer-planned__head">
            <div>
              <strong>Available market</strong>
              <span>Only markets that pass production data and methodology gates open into full market explanation pages.</span>
            </div>
          </div>
          <div className="global-market-entry-grid global-market-entry-grid--explorer markets-explorer-production__grid" aria-label="Production markets">
            {productionMarketEntry ? (
              <ProductionMarketCard market={productionMarketEntry} marketSnapshot={marketSnapshot} />
            ) : null}
          </div>
        </div>

        <div className="markets-explorer-planned" aria-label="Planned market entries">
          <div className="markets-explorer-planned__head">
            <div>
              <strong>Planned market entries</strong>
              <span>These markets are registered, but still wait for legal data, pipeline, and methodology gates.</span>
            </div>
            <small>{plannedMarketEntries.length} planned</small>
          </div>
          <div className="global-market-entry-grid global-market-entry-grid--explorer markets-explorer-planned__grid" aria-label="Planned markets">
            {plannedMarketEntries.map((market) => (
              <PlannedMarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductionMarketCard({
  market,
  marketSnapshot
}: {
  market: MarketRegistryEntry;
  marketSnapshot: SignalSnapshot | null;
}) {
  return (
    <article className="global-market-entry-card global-market-entry-card--live">
      <div className="global-market-entry-card__top">
        <strong>{market.label}</strong>
        <b>Production</b>
      </div>
      <span>{getMarketScopeLabel(market)}</span>
      <div className="global-market-entry-card__metrics">
        <small>{translateSignalTitle(marketSnapshot?.signal.title)}</small>
        <small>Composite {marketSnapshot?.compositeScore ?? "--"}</small>
        <small>Risk {marketSnapshot?.riskScore ?? "--"}</small>
      </div>
      <em>Data date {marketSnapshot?.date ?? "--"}</em>
      <div className="global-market-card__actions">
        <TrackedLink eventName="nav_link_clicked" href={getEnglishRoute(market.canonicalMarketRoute)} label="View Taiwan market" payload={{ area: "en-markets-index", market: market.id }}>
          Market page
        </TrackedLink>
        <TrackedLink eventName="stock_link_clicked" href="/en/stocks/TWII" label="View TWII target page" payload={{ area: "en-markets-index", symbol: "TWII" }}>
          Target page
        </TrackedLink>
      </div>
    </article>
  );
}

function PlannedMarketCard({ market }: { market: MarketRegistryEntry }) {
  return (
    <article className="global-market-entry-card global-market-entry-card--planned">
      <div className="global-market-entry-card__top">
        <strong title={market.label}>{market.label}</strong>
        <b>Planned</b>
      </div>
      <span>{getMarketScopeLabel(market)}</span>
      <p>Waiting for legal data source, pipeline, and methodology gates. Mock scores are not shown as production signals.</p>
      <p className="markets-explorer-readiness">{getReadinessText(market)}</p>
    </article>
  );
}

function getLatestSnapshot(series: SignalSnapshot[]) {
  return series.at(-1) ?? null;
}

function translateSignalTitle(signalTitle?: string) {
  if (!signalTitle) return "Data accumulating";
  if (signalTitle.includes("偏強")) return "Constructive";
  if (signalTitle.includes("觀望")) return "Watch";
  if (signalTitle.includes("警戒")) return "Caution";
  if (signalTitle.includes("高風險")) return "High risk";
  if (signalTitle.includes("轉弱")) return "Weakening";
  return "Watch";
}

function getMarketScopeLabel(market: MarketRegistryEntry) {
  if (market.id === "tw") return "Taiwan market";
  if (market.locale === "en-US") return "US market";
  if (market.locale === "ja-JP") return "Japan market";
  if (market.locale === "zh-HK") return "Hong Kong market";
  if (market.locale === "ko-KR") return "Korea market";
  if (market.locale === "en-GB") return "Europe market";
  return "Market index";
}

function getReadinessText(market: MarketRegistryEntry) {
  if (market.routeStatus === "private-lab") return "Private mock reference; not opened for public navigation";
  return "Planned for a later phase";
}

function getEnglishRoute(route: string) {
  return `/en${route}`;
}
