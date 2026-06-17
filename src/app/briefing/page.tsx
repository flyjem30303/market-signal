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
  description: "用 3 分鐘把市場燈號拆成原因、風險與下一步觀察。目前使用示範資料，不提供投資建議。"
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
        <p className="eyebrow">晨報快速判讀</p>
        <h1>3 分鐘把市場燈號拆成原因</h1>
        <p>先看目前市場燈號，再看風險最高標的、市場廣度與資料更新狀態。這頁的目的，是把「現在該觀察什麼」排出順序。</p>
        <p>
          目前 {market.asset.name} 是「{market.signal.title}」，市場分數 {market.compositeScore}/100，
          風險分數 {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          資料與風險邊界：正式資料尚未啟用，目前使用示範資料，不是即時報價，也不是投資建議。
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

      <section className="briefing-grid" aria-label="市場觀察">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>
            偏強標的 {breadth.constructiveCount} 個，風險偏高 {breadth.defensiveCount} 個
          </h2>
          <p>如果強勢集中在少數標的，要比全面擴散更保守解讀；如果風險擴散，應提高警覺。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險來源</p>
          <h2>{topRisk.asset.name}</h2>
          <p>風險分數 {topRisk.riskScore}/100。請先確認這個風險是否只是單一標的，或已經影響整體市場氣氛。</p>
        </article>
      </section>

      <section className="panel" aria-label="下一步觀察">
        <p className="eyebrow">下一步觀察</p>
        <h2>先看市場方向，再看風險是否擴散</h2>
        <p>若市場分數維持偏強，可觀察強勢標的是否延續；若風險分數上升，先確認資料時間與風險來源。</p>
      </section>

      <section className="panel" aria-label="資料與風險邊界">
        <p className="eyebrow">資料與風險邊界</p>
        <h2>正式資料尚未啟用</h2>
        <p>目前市場分數、風險分數與標的資料都用於示範閱讀流程。正式資料上線前，不宣稱即時資料或完整市場覆蓋。</p>
      </section>

      <section className="panel" aria-label="觀察標的">
        <div className="section-heading">
          <p className="eyebrow">觀察標的</p>
          <h2>查看目前相對強勢的示範標的</h2>
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
                查看燈號
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
