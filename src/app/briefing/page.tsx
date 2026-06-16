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

export const metadata: Metadata = {
  title: "市場快報",
  description:
    "30 秒看懂市場燈號，3 分鐘把市場燈號拆成原因、風險分數與下一步觀察順序。Phase 1 使用示範資料，非投資建議。"
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

      <section className="hero briefing-public-summary" aria-label="市場快報">
        <p className="eyebrow">市場快報</p>
        <h1>30 秒看懂市場燈號</h1>
        <p>
          3 分鐘把市場燈號拆成原因：先看大盤燈號，再看風險分數、觀察清單與資料與風險邊界。
        </p>
        <p>
          目前示範市場為 {market.asset.name}，燈號為 {market.signal.title}，市場分數 {market.compositeScore}/100，
          風險分數 {market.riskScore}/100。這頁協助使用者整理觀察順序，不是買賣建議。
        </p>
        <p className="runtime-boundary-line">
          資料與風險邊界：正式資料尚未啟用，Phase 1 仍使用示範資料與示範分數。任何行動前都應確認資料來源、
          更新時間、覆蓋範圍與自身風險承受能力。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />

      <section className="briefing-executive-summary" aria-label="市場摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            市場分數 <strong>{market.compositeScore}</strong>/100
          </span>
          <span>
            風險分數 <strong>{market.riskScore}</strong>/100
          </span>
          <span>資料品質 {market.dataQualityGrade}</span>
        </aside>
      </section>

      <section className="briefing-grid" aria-label="市場拆解">
        <article className="panel">
          <p className="eyebrow">市場結構</p>
          <h2>偏多觀察 {breadth.constructiveCount} 項，風險觀察 {breadth.defensiveCount} 項</h2>
          <p>
            市場分數較高代表可以放入觀察清單；風險分數升高時，重點應改為確認原因、等待資料更新與降低誤判。
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險清單</p>
          <h2>{topRisk.asset.name}</h2>
          <p>
            風險分數 {topRisk.riskScore}/100。若市場分數上升但風險同步升高，代表需要加強觀察，而不是直接追價。
          </p>
        </article>
      </section>

      <section className="panel" aria-label="觀察清單">
        <div className="section-heading">
          <p className="eyebrow">後續觀察</p>
          <h2>先看分數，再看原因，最後才決定是否追蹤</h2>
        </div>
        <div className="signal-list">
          {strongest.map((item) => (
            <article className="signal-row" key={item.asset.symbol}>
              <div>
                <strong>{item.asset.name}</strong>
                <span>{item.asset.symbol}</span>
              </div>
              <p>
                {item.signal.title}，市場分數 {item.compositeScore}/100，風險分數 {item.riskScore}/100。
              </p>
              <TrackedLink
                className="text-link"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                label={`查看 ${item.asset.symbol}`}
                payload={{ symbol: item.asset.symbol }}
              >
                查看標的
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructiveCount += 1;
      if (snapshot.riskScore >= 55) summary.defensiveCount += 1;
      return summary;
    },
    { constructiveCount: 0, defensiveCount: 0 }
  );
}
