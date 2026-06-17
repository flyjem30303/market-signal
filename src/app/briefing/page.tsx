import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRuntime
} from "@/lib/repositories/market-signal-repository";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場訊號晨報",
  description: "用 30 秒摘要與 3 分鐘閱讀流程，快速理解目前市場燈號、風險與下一步觀察重點。"
};

export default async function BriefingPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const decisionSummary = getRuntimeDecisionSummary();
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

      <section className="hero briefing-public-summary" aria-label="市場訊號晨報">
        <p className="eyebrow">市場快報</p>
        <h1>3 分鐘把市場燈號拆成原因</h1>
        <p>
          先看市場燈號，再看風險來源，最後決定是否關注、加強觀察或降低風險。這不是投資建議，而是市場資訊整理。
        </p>
        <p>
          目前 {market.asset.name} 為「{market.signal.title}」，綜合分數 {market.compositeScore}/100，
          風險分數 {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          {decisionSummary.userFacingNow} {decisionSummary.decisionLabel}: {decisionSummary.safetyStopLine}
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
            綜合分數 <strong>{market.compositeScore}</strong>/100
          </span>
          <span>
            風險分數 <strong>{market.riskScore}</strong>/100
          </span>
          <span>資料品質 {market.dataQualityGrade}</span>
        </aside>
      </section>

      <section className="briefing-grid" aria-label="市場觀察重點">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>
            相對強勢 {breadth.constructiveCount} 檔；風險觀察 {breadth.defensiveCount} 檔
          </h2>
          <p>若強勢集中在少數標的，燈號仍需搭配成交量、廣度與資料更新時間一起閱讀。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險焦點</p>
          <h2>{topRisk.asset.name}</h2>
          <p>風險分數 {topRisk.riskScore}/100。若分數偏高，適合加強觀察而不是把單一燈號當成交易指令。</p>
        </article>
      </section>

      <section className="panel" aria-label="下一步觀察">
        <p className="eyebrow">資料與風險邊界</p>
        <h2>先看狀態，再看原因，最後才決定行動</h2>
        <p>若燈號偏多，仍需確認風險是否同步下降；若燈號轉弱，應先檢查持有標的、資料更新時間與市場廣度。</p>
        <div className="briefing-actions">
          <TrackedLink eventName="briefing_link_clicked" href="/" label="查看市場頁" payload={{ area: "briefing_next" }}>
            查看市場頁
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看高風險標的"
            payload={{ area: "briefing_next", symbol: topRisk.asset.symbol }}
          >
            查看高風險標的
          </TrackedLink>
        </div>
      </section>

      <section className="panel" aria-label="強勢標的">
        <div className="section-heading">
          <p className="eyebrow">相對強勢</p>
          <h2>先用燈號篩選，再回看風險</h2>
        </div>
        <div className="signal-list">
          {strongest.map((item) => (
            <article className="signal-row" key={item.asset.symbol}>
              <div>
                <strong>{item.asset.name}</strong>
                <span>{item.asset.symbol}</span>
              </div>
              <p>
                {item.signal.title}，綜合 {item.compositeScore}/100，風險 {item.riskScore}/100。
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

      <PublicBetaSourceCoverageBridge context="briefing" />
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
