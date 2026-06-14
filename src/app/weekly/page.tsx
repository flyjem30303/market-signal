import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";
import { buildWeeklyMarketActionSummary } from "@/lib/weekly-market-action-summary";

export const metadata: Metadata = {
  title: "市場週報",
  description: "整理本週市場燈號、核心指標與下週觀察重點，協助一般投資者快速理解市場狀態。"
};

export default async function WeeklyPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const topEtf =
    snapshots
      .filter((snapshot) => snapshot.asset.group === "ETF")
      .slice()
      .sort((a, b) => b.healthScore - a.healthScore)[0] ?? market;
  const breadth = buildWeeklyBreadth(snapshots);
  const actionSummary = buildWeeklyMarketActionSummary(market, topRisk, topEtf, breadth);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />
      <section className="hero">
        <p className="eyebrow">市場週報</p>
        <h1>本週市場狀態整理</h1>
        <p>
          用一頁回看本週燈號變化、核心指標與下週觀察重點。使用者可以先用 30 秒掌握市場氣氛，再用 3 分鐘檢查下週風險。
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用；目前仍使用示範資料與示範分數。正式資料流程完成前，本頁不宣稱即時、完整或可作為交易依據，且不提供買賣建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="weekly-market-action-summary" aria-label="週報行動摘要">
        <div>
          <p className="eyebrow">週報行動摘要</p>
          <h2>{actionSummary.headline}</h2>
          <p>{actionSummary.weeklyLine}</p>
          <p>{actionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={actionSummary.primary.tone}
          eventName="weekly_link_clicked"
          href={actionSummary.primary.href}
          label={actionSummary.primary.label}
          payload={{ area: "weekly_market_action_primary", symbol: actionSummary.primary.symbol }}
        >
          <span>{actionSummary.primary.label}</span>
          <strong>{actionSummary.primary.title}</strong>
          <p>{actionSummary.primary.body}</p>
        </TrackedLink>
        <TrackedLink
          className={actionSummary.secondary.tone}
          eventName="weekly_link_clicked"
          href={actionSummary.secondary.href}
          label={actionSummary.secondary.label}
          payload={{ area: "weekly_market_action_secondary", symbol: actionSummary.secondary.symbol }}
        >
          <span>{actionSummary.secondary.label}</span>
          <strong>{actionSummary.secondary.title}</strong>
          <p>{actionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <section className="weekly-quick-read" aria-label="本週快速判讀">
        <article>
          <span>燈號狀態</span>
          <strong>{market.signal.title}</strong>
          <p>先確認市場偏多、觀望或警戒，再回看造成變化的主要指標。</p>
        </article>
        <article>
          <span>風險分數</span>
          <strong>{topRisk.riskScore}/100</strong>
          <p>3 分鐘行動判斷：分數越高代表越需要降低解讀信心，並複核資料更新時間與異常原因。</p>
        </article>
        <article>
          <span>資料更新時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>資料延遲或異常時，前台會維持示範邊界，不升級為真實交易訊號。</p>
        </article>
      </section>

      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildWeeklyBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructive += 1;
      else if (snapshot.riskScore >= 60 || snapshot.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}
