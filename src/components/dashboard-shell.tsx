import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";
import {
  createStaticMarketSignalRepository,
  type MarketSignalRepositoryData
} from "@/lib/repositories/static-market-signal-repository";
import type { NewsEvent, SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
  repositoryData?: MarketSignalRepositoryData;
};

const fallbackSnapshotDate = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus,
  repositoryData
}: DashboardShellProps) {
  const repository = repositoryData ? createStaticMarketSignalRepository(repositoryData) : mockMarketSignalRepository;
  const freshness = freshnessSnapshot ?? buildMockDataFreshnessSnapshot();
  const assets = repository.getAssets();
  const activeSnapshotDate = repositoryData?.snapshotDate ?? fallbackSnapshotDate;
  const selected = repository.getAssetBySymbol(initialSymbol) ?? assets[0];
  const snapshot =
    repository.getSnapshot(selected.symbol, activeSnapshotDate) ??
    repository.getSeries(selected.symbol).at(-1) ??
    repository.getSnapshot(assets[0].symbol, activeSnapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, activeSnapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const relatedNews = repository.getRelatedNews(selected.symbol, activeSnapshotDate);
  const isStockPage = includeSeoContent;
  const publicSourceLabel = formatPublicSourceLabel(freshness.sourceName, marketSignalSourceStatus?.resolvedSource === "supabase");
  const scoreSourceLabel = marketSignalSourceStatus?.publicScoreSource === "real" ? "正式分數" : "示範分數";

  return (
    <main className="page-shell">
      <PageViewTracker
        eventName={isStockPage ? "stock_page_viewed" : "home_page_viewed"}
        payload={{ page: isStockPage ? "stock" : "home", symbol: selected.symbol }}
      />

      <Hero
        isStockPage={isStockPage}
        market={market}
        publicSourceLabel={publicSourceLabel}
        selected={selected}
        snapshot={snapshot}
        snapshotDate={activeSnapshotDate}
      />

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary market={market} />
          <MarketWatchlistPanel snapshots={snapshots} />
        </>
      )}

      {isStockPage && (
        <>
          <StockAtAGlance scoreSourceLabel={scoreSourceLabel} snapshot={snapshot} />
          <StockMarketFacts snapshot={snapshot} />
          <StockEventContext news={relatedNews} />
        </>
      )}

      <DataFreshnessStrip
        fallbackAsOfDate={snapshot.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>
          本站提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議、保證報酬或個人化資產配置。
          請搭配資料日期、引用來源與自身風險承受度使用。
        </p>
      </article>
    </main>
  );
}

function Hero({
  isStockPage,
  market,
  publicSourceLabel,
  selected,
  snapshot,
  snapshotDate
}: {
  isStockPage: boolean;
  market: SignalSnapshot;
  publicSourceLabel: string;
  selected: Asset;
  snapshot: SignalSnapshot;
  snapshotDate: string;
}) {
  const focus = isStockPage ? snapshot : market;

  return (
    <section className="hero dashboard-hero">
      <p className="eyebrow">{isStockPage ? "標的燈號 / 市場觀察" : "公開 Beta / 指數狀態儀表站"}</p>
      <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂台股市場氣氛"}</h1>
      <p>
        {isStockPage
          ? `${selected.name} 目前為 ${snapshot.signal.title}，綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。`
          : `${market.asset.name} 目前為 ${market.signal.title}，綜合分數 ${market.compositeScore}/100，風險分數 ${market.riskScore}/100。`}
        本頁先整理狀態、原因、更新時間與風險提醒，協助使用者建立固定的市場觀察流程。
      </p>
      <div className="hero-status-strip" aria-label="市場狀態摘要">
        <span>{isStockPage ? "標的狀態" : "市場狀態"}: {focus.signal.title}</span>
        <span>更新至: {snapshotDate}</span>
        <span>引用來源: {publicSourceLabel}</span>
      </div>
    </section>
  );
}

function formatPublicSourceLabel(sourceName: string | undefined, isSupabaseRuntime: boolean) {
  if (!isSupabaseRuntime) return "示範資料";
  if (sourceName && sourceName !== "正式資料") return sourceName;
  return "TWSE OpenAPI";
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場快速判讀">
      <p className="eyebrow">市場快速判讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場閱讀順序">
        <article>
          <strong>先看狀態</strong>
          <p>用燈號與分數快速判斷市場偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <strong>再看原因</strong>
          <p>確認趨勢、資金、風險與資料品質，不只看單一數字。</p>
        </article>
        <article>
          <strong>最後決定行動</strong>
          <p>選擇觀察、複核或降低風險，而不是直接轉成買賣指令。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數狀態"
          payload={{ area: "home_first_screen" }}
        >
          查看指數狀態
        </TrackedLink>
      </div>
    </section>
  );
}

function StockAtAGlance({ scoreSourceLabel, snapshot }: { scoreSourceLabel: string; snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-runtime-at-a-glance" aria-label="標的狀態摘要">
      <p className="eyebrow">標的狀態</p>
      <h2>{snapshot.asset.name}: {snapshot.signal.title}</h2>
      <p>{snapshot.signal.text}</p>
      <div className="briefing-actions">
        <article>
          <strong>綜合分數</strong>
          <p>{snapshot.compositeScore}/100</p>
        </article>
        <article>
          <strong>風險分數</strong>
          <p>{snapshot.riskScore}/100</p>
        </article>
        <article>
          <strong>分數來源</strong>
          <p>{scoreSourceLabel}</p>
        </article>
      </div>
    </section>
  );
}

function StockMarketFacts({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-public-summary" aria-label="標的市場資料">
      <article className="panel">
        <p className="eyebrow">標的分類</p>
        <h2>{snapshot.asset.group}</h2>
        <p>本頁整理公開市場資料與燈號狀態，協助使用者理解目前觀察重點。</p>
      </article>
      {snapshot.marketFacts.map((fact) => (
        <article className="panel" key={fact.label}>
          <p className="eyebrow">{fact.label}</p>
          <h2>{fact.value}</h2>
          <p>{fact.note}</p>
        </article>
      ))}
    </section>
  );
}

function StockEventContext({ news }: { news: NewsEvent[] }) {
  const latestNews = news[0];

  return (
    <section className="panel stock-reading-summary" aria-label="市場脈絡提示">
      <p className="eyebrow">市場脈絡 / 觀察提示</p>
      <h2>用事件脈絡輔助閱讀燈號</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有可顯示的市場脈絡提示。請先以燈號、分數、更新時間與引用來源作為主要觀察依據。</p>
      )}
    </section>
  );
}
