import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
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
  description: "用週報回看市場燈號、核心風險、ETF 觀察與資料更新狀態。內容為資訊整理與風險辨識，不提供買賣建議。"
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
          週報用來回看一週市場燈號、核心風險與後續觀察重點。使用者可以先用 30 秒確認市場氣氛，再用 3 分鐘行動判斷複核風險最高標的與資料狀態。
        </p>
        <p className="runtime-boundary-line">
          目前公開頁使用示範資料呈現閱讀流程；正式資料尚未啟用，不提供買賣建議，也不應作為交易指令。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="weekly-market-action-summary" aria-label="週報市場行動摘要">
        <div>
          <p className="eyebrow">市場行動摘要</p>
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

      <section className="weekly-quick-read" aria-label="週報快速閱讀">
        <article>
          <span>市場主燈號</span>
          <strong>{market.signal.title}</strong>
          <p>先確認市場目前是偏多、觀望還是警戒，再決定是否需要深入看個別標的。</p>
        </article>
        <article>
          <span>最高風險分數</span>
          <strong>{topRisk.riskScore}/100</strong>
          <p>3 分鐘判斷時，優先複核風險最高標的的成因與資料狀態。</p>
        </article>
        <article>
          <span>資料更新時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>資料可能延遲或尚未正式啟用，請先看資料邊界再解讀燈號。</p>
        </article>
      </section>

      <RouteLocalTrustCopyPanel context="weekly" />
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
