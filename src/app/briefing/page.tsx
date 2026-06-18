import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報 | 指數燈號",
  description: "用 30 秒看懂台股市場氛圍，再用 3 分鐘拆解狀態、原因、風險與下一步觀察重點。"
};

const snapshotDate = "2026-05-28";

export default async function BriefingPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const sourceLabel = marketSignalSourceStatus.resolvedSource === "supabase" ? "正式資料" : "示範資料";
  const scoreLabel = marketSignalSourceStatus.publicScoreSource === "real" ? "正式分數" : "示範分數";

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場簡報">
        <p className="eyebrow">市場簡報</p>
        <h1>3 分鐘拆解市場狀態、原因與風險</h1>
        <p>
          先看市場主燈號，再看強弱分布、風險集中處與資料更新狀態。這份簡報協助使用者建立固定觀察流程，不提供買賣建議。
        </p>
        <p>
          目前 {market.asset.name} 為 {market.signal.title}，綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          資料來源：{sourceLabel}；分數來源：{scoreLabel}。所有內容皆為市場資訊整理與風險辨識。
        </p>
      </section>

      <DataFreshnessStrip
        fallbackAsOfDate={market.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />
      <PublicDataSourceBoundaryNotice context="briefing" />

      <section className="briefing-executive-summary" aria-label="市場摘要">
        <div>
          <p className="eyebrow">30 秒判讀</p>
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
            強勢標的 {breadth.constructiveCount} 檔，風險偏高 {breadth.defensiveCount} 檔
          </h2>
          <p>用整體標的分布輔助判斷市場是否只由少數標的支撐，避免只看單一指數。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險觀察</p>
          <h2>{topRisk.asset.name}</h2>
          <p>風險分數 {topRisk.riskScore}/100。若風險分數偏高，建議優先確認資料時間、波動與自身承受度。</p>
        </article>
      </section>

      <section className="panel" aria-label="下一步行動">
        <p className="eyebrow">下一步</p>
        <h2>先看狀態，再看原因，最後決定是否加強觀察</h2>
        <p>如果燈號與風險分數分歧，先回到資料更新時間與方法說明，不要把單一分數當成交易指令。</p>
        <div className="briefing-actions">
          <TrackedLink eventName="briefing_link_clicked" href="/" label="回首頁" payload={{ area: "briefing_next" }}>
            回首頁
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看風險標的"
            payload={{ area: "briefing_next", symbol: topRisk.asset.symbol }}
          >
            查看風險標的
          </TrackedLink>
        </div>
      </section>

      <section className="panel" aria-label="強勢標的">
        <div className="section-heading">
          <p className="eyebrow">相對強勢</p>
          <h2>用來觀察市場主軸，不等於買進清單</h2>
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
