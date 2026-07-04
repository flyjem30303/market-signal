import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getMarketRegistry, productionCurrentMarketId, type MarketRegistryEntry } from "@/lib/market-registry";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const revalidate = 300;

export const metadata: Metadata = {
  description: "探索 Market Signal 已支援與規劃中的市場。台灣是目前唯一正式市場，其他市場仍等待合法資料、資料管線與方法論 gate。",
  title: "全球市場總覽"
};

export default async function MarketsPage() {
  const { repository } = await getMarketSignalRuntime();
  const marketSnapshot = getLatestSnapshot(repository.getSeries("TWII"));
  const marketRegistryEntries = getMarketRegistry();
  const productionMarketEntry = marketRegistryEntries.find((market) => market.id === productionCurrentMarketId);
  const plannedMarketEntries = marketRegistryEntries.filter((market) => market.id !== productionCurrentMarketId && market.publicAvailability !== "private-only");

  return (
    <main className="page-shell homepage-global-shell">
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "markets" }} />

      <section className="global-market-map global-market-map--explorer" aria-labelledby="markets-title">
        <div className="markets-explorer-hero">
          <div>
            <p className="eyebrow">Market Explorer</p>
            <h1 id="markets-title">全球市場總覽</h1>
            <p>探索各市場目前的風險、燈號與資料成熟度。這裡負責完整市場探索，首頁只保留每日重點與快速入口。</p>
          </div>
          <div className="markets-explorer-summary" aria-label="市場覆蓋摘要">
            <span>
              <small>正式市場</small>
              <strong>{productionMarketEntry ? 1 : 0}</strong>
            </span>
            <span>
              <small>規劃中</small>
              <strong>{plannedMarketEntries.length}</strong>
            </span>
            <span>
              <small>Global Composite</small>
              <strong>尚未啟用</strong>
            </span>
          </div>
        </div>

        <div className="markets-explorer-scope" aria-label="目前市場入口範圍">
          <span>目前完整列出已登錄市場與指數。</span>
          <span>至少 2 個正式市場通過 production gate 後，才會啟用全球綜合分數與跨市場排行。</span>
        </div>

        <section className="panel method-section" aria-labelledby="markets-how-to-use-title">
          <p className="eyebrow">How to use</p>
          <h2 id="markets-how-to-use-title">如何使用市場入口</h2>
          <p>
            這頁負責完整市場探索，不取代首頁的每日摘要。先從「目前可用市場」進入台灣市場風險指南針；
            規劃中市場只代表路線已登錄，尚未公開正式燈號，也不會用 mock 分數暗示市場狀態。
          </p>
          <div className="method-table" role="table" aria-label="市場入口使用方式">
            <div className="method-row method-head" role="row">
              <span>使用情境</span>
              <span>前往頁面</span>
              <span>說明</span>
            </div>
            <div className="method-row" role="row">
              <strong>看單一市場原因</strong>
              <TrackedLink eventName="nav_link_clicked" href="/markets/tw" label="台灣市場頁" payload={{ area: "markets-how-to-use" }}>
                台灣市場頁
              </TrackedLink>
              <span>查看今日變化、支撐風險、歷史位置與下一步觀察。</span>
            </div>
            <div className="method-row" role="row">
              <strong>查單一標的</strong>
              <TrackedLink eventName="nav_link_clicked" href="/stocks" label="標的觀察入口" payload={{ area: "markets-how-to-use" }}>
                標的觀察入口
              </TrackedLink>
              <span>搜尋股票、ETF 或指數，進入單一標的觀察頁。</span>
            </div>
          </div>
        </section>

        <div className="markets-explorer-production" aria-label="正式市場入口">
          <div className="markets-explorer-planned__head">
            <div>
              <strong>目前可用市場</strong>
              <span>通過正式資料與方法論 gate 的市場，才能進入完整市場解釋頁。</span>
            </div>
          </div>
          <div className="global-market-entry-grid global-market-entry-grid--explorer markets-explorer-production__grid" aria-label="正式市場">
            {productionMarketEntry ? (
              <ProductionMarketCard market={productionMarketEntry} marketSnapshot={marketSnapshot} />
            ) : null}
          </div>
        </div>

        <div className="markets-explorer-planned" aria-label="後續規劃市場入口">
          <div className="markets-explorer-planned__head">
            <div>
              <strong>後續規劃市場</strong>
              <span>這些市場已登錄在 registry，但仍等待合法資料、資料管線與方法論 gate。</span>
            </div>
            <small>{plannedMarketEntries.length} 個規劃中</small>
          </div>
          <div className="global-market-entry-grid global-market-entry-grid--explorer markets-explorer-planned__grid" aria-label="後續規劃市場">
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
        <strong>{market.nativeLabel}</strong>
        <b>正式</b>
      </div>
      <span>{getMarketScopeLabel(market)}</span>
      <div className="global-market-entry-card__metrics">
        <small>{marketSnapshot?.signal.title ?? "資料累積中"}</small>
        <small>綜合 {marketSnapshot?.compositeScore ?? "--"}</small>
        <small>風險 {marketSnapshot?.riskScore ?? "--"}</small>
      </div>
      <em>資料日期 {marketSnapshot?.date ?? "--"}</em>
      <div className="global-market-card__actions">
        <TrackedLink eventName="nav_link_clicked" href={market.canonicalMarketRoute} label="查看台灣市場" payload={{ area: "markets-index", market: market.id }}>
          市場頁
        </TrackedLink>
        <TrackedLink eventName="stock_link_clicked" href="/stocks/TWII" label="查看 TWII 標的頁" payload={{ area: "markets-index", symbol: "TWII" }}>
          標的頁
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
        <b>規劃中</b>
      </div>
      <span>{getMarketScopeLabel(market)}</span>
      <p>等待合法資料來源、資料管線與方法論 gate。尚未公開正式燈號，也不顯示 mock 分數。</p>
      <p className="markets-explorer-readiness">{getReadinessText(market)}</p>
    </article>
  );
}

function getLatestSnapshot(series: SignalSnapshot[]) {
  return series.at(-1) ?? null;
}

function getMarketScopeLabel(market: MarketRegistryEntry) {
  if (market.id === "tw") return "台灣市場";
  if (market.locale === "en-US") return "美國市場";
  if (market.locale === "ja-JP") return "日本市場";
  if (market.locale === "zh-HK") return "香港市場";
  if (market.locale === "ko-KR") return "韓國市場";
  if (market.locale === "en-GB") return "歐洲市場";
  return "市場指數";
}

function getReadinessText(market: MarketRegistryEntry) {
  if (market.routeStatus === "private-lab") return "內部 mock 參考，未開放公開導流";
  return "規劃於後續階段開放";
}
