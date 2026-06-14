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
  description: "用 30 秒整理本週市場燈號、主要風險與觀察清單。內容為示範資料與資訊整理，非投資建議。"
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
        <h1>本週市場狀態與觀察重點</h1>
        <p>
          週報把一週市場氛圍、關鍵指標與風險提醒整理成固定閱讀流程。使用者可以在 30 秒內掌握方向，再用 3 分鐘確認需要追蹤或複核的標的。
        </p>
        <p className="runtime-boundary-line">
          目前週報仍使用示範資料，僅作為閱讀流程與資訊架構展示；正式資料接入前不宣稱即時真實行情。
        </p>
      </section>

      <section className="weekly-market-action-summary" aria-label="週報 3 分鐘行動判斷">
        <div>
          <p className="eyebrow">3 分鐘行動判斷</p>
          <h2>先回看市場燈號，再決定下週觀察順序</h2>
          <p>週報整理市場狀態、主要風險、資料更新時間與下一步觀察，協助使用者把每日燈號延伸成下週追蹤清單。</p>
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="weekly-market-action-summary" aria-label="週報市場行動摘要">
        <div>
          <p className="eyebrow">市場觀察摘要</p>
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
          <span>市場狀態</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>主要風險</span>
          <strong>{topRisk.riskScore}/100</strong>
          <p>風險分數最高的示範標的，適合放入本週複核清單。</p>
        </article>
        <article>
          <span>資料更新時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>若資料時間延遲或標示異常，應先暫緩解讀。示範資料不等於即時行情。</p>
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
