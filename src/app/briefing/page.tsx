import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

const copy = {
  title: "\u4eca\u65e5\u7c21\u5831",
  marketFlash: "\u5e02\u5834\u5feb\u5831",
  description:
    "\u7528 30 \u79d2\u6574\u7406\u5e02\u5834\u71c8\u865f\u3001\u6838\u5fc3\u98a8\u96aa\u8207\u5f8c\u7e8c\u89c0\u5bdf\u91cd\u9ede\u3002Phase 1 \u4f7f\u7528\u793a\u7bc4\u8cc7\u6599\uff0c\u4e0d\u63d0\u4f9b\u6295\u8cc7\u5efa\u8b70\u3002",
  hero: "30 \u79d2\u770b\u61c2\u5e02\u5834\u71c8\u865f",
  heroSub: "3 \u5206\u9418\u628a\u5e02\u5834\u71c8\u865f\u62c6\u6210\u539f\u56e0",
  summary: "\u5e02\u5834\u6458\u8981",
  quick: "30 \u79d2\u6458\u8981",
  score: "\u5e02\u5834\u5206\u6578",
  risk: "\u6700\u9ad8\u98a8\u96aa\u89c0\u5bdf",
  structure: "\u5e02\u5834\u7d50\u69cb",
  constructive: "\u504f\u591a\u89c0\u5bdf",
  watch: "\u89c0\u671b\u6574\u7406",
  defensive: "\u98a8\u96aa\u504f\u9ad8",
  next: "\u4e0b\u4e00\u6b65\u884c\u52d5",
  nextTitle:
    "\u5148\u770b\u5927\u76e4\uff0c\u518d\u770b\u98a8\u96aa\u4f86\u6e90\uff0c\u6700\u5f8c\u78ba\u8a8d\u8cc7\u6599\u72c0\u614b",
  boundary: "\u8cc7\u6599\u8207\u98a8\u96aa\u908a\u754c",
  realDataNotEnabled: "\u6b63\u5f0f\u8cc7\u6599\u5c1a\u672a\u555f\u7528",
  watchList: "\u5e02\u5834\u89c0\u5bdf\u6e05\u55ae",
  strongList: "\u76f8\u5c0d\u504f\u5f37\u89c0\u5bdf",
  riskList: "\u512a\u5148\u98a8\u96aa\u89c0\u5bdf",
  marketWatch: "\u5e02\u5834\u89c0\u5bdf"
};

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label={copy.title}>
        <p className="eyebrow">{copy.marketFlash}</p>
        <h1>{copy.hero}</h1>
        <p>{copy.heroSub}</p>
        <p>
          {market.asset.name} {market.signal.title}。{copy.score} {market.compositeScore}/100，
          {copy.risk} {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          {copy.boundary}：{copy.realDataNotEnabled}。Phase 1 使用示範資料，不提供投資建議或買賣推薦。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label={copy.summary}>
        <div>
          <p className="eyebrow">{copy.quick}</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            <b>{copy.score}</b>
            <i>{market.compositeScore}/100</i>
          </span>
          <span>
            <b>{copy.risk}</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label={copy.structure}>
        <BreadthCard label={copy.constructive} tone="active" value={breadth.constructive} />
        <BreadthCard label={copy.watch} tone="hold" value={breadth.watch} />
        <BreadthCard label={copy.defensive} tone="blocked" value={breadth.defensive} />
      </section>

      <section className="panel stock-reading-summary" aria-label={copy.next}>
        <p className="eyebrow">{copy.next}</p>
        <h2>{copy.nextTitle}</h2>
        <p>先判斷整體市場，再複核風險最高的標的，最後確認資料更新時間與資料狀態。</p>
      </section>

      <section className="weekly-grid" aria-label={copy.watchList}>
        <BriefingList description="示範模型中相對偏強的觀察清單。" items={strongest} title={copy.strongList} />
        <BriefingList description="風險分數較高，適合優先複核。" items={[topRisk]} title={copy.riskList} />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />
      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.riskScore >= 65) summary.defensive += 1;
      else if (snapshot.compositeScore >= 65) summary.constructive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({ label, tone, value }: { label: string; tone: "active" | "blocked" | "hold"; value: number }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>依目前示範資料分類，用來協助快速掃描市場結構。</p>
    </article>
  );
}

function BriefingList({ description, items, title }: { description: string; items: SignalSnapshot[]; title: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">{copy.marketWatch}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="stock-chip-list">
        {items.map((item) => (
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.symbol}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: "briefing_list", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
