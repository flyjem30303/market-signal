import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { WeeklyRowCoverageStatus } from "@/components/weekly-row-coverage-status";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildWeeklyMarketActionSummary } from "@/lib/weekly-market-action-summary";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "Weekly Report | Taiwan Market Signal",
  description:
    "公開 Beta 週報：以示範資料、示範分數與 mock runtime 邊界，整理市場總覽、ETF、風險樣本與下週觀察重點。"
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
  const topEtf = snapshots
    .filter((item) => item.asset.group === "ETF")
    .sort((a, b) => b.healthScore - a.healthScore)[0] ?? market;
  const breadth = buildWeeklyBreadth(snapshots);
  const actionSummary = buildWeeklyMarketActionSummary(market, topRisk, topEtf, breadth);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />
      <section className="hero">
        <p className="eyebrow">Weekly Report</p>
        <h1>公開 Beta 週報</h1>
        <p>
          本週以示範資料呈現公開閱讀流程：先看全市場氛圍，再看 ETF 與風險樣本，最後決定下週要觀察、複核或暫停追價。
          正式市場資料尚未啟用，所有分數都只是示範分數。
        </p>
        <p className="runtime-boundary-line">
          重要聲明：publicDataSource=mock；scoreSource=mock。本頁為非投資建議，不提供買賣建議，也不宣稱即時或完整市場覆蓋。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="weekly" />
      <RouteLocalTrustCopyPanel context="weekly" />

      <section className="weekly-market-action-summary" aria-label="Market Action Summary">
        <div>
          <p className="eyebrow">Market Action Summary</p>
          <h2>{actionSummary.headline}</h2>
          <p>{actionSummary.weeklyLine}</p>
          <p>{actionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={actionSummary.primary.tone}
          eventName="weekly_link_clicked"
          href={actionSummary.primary.href}
          label={actionSummary.primary.title}
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
          label={actionSummary.secondary.title}
          payload={{ area: "weekly_market_action_secondary", symbol: actionSummary.secondary.symbol }}
        >
          <span>{actionSummary.secondary.label}</span>
          <strong>{actionSummary.secondary.title}</strong>
          <p>{actionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <WeeklyRowCoverageStatus />

      <section className="weekly-quick-read" aria-label="週報 30 秒閱讀">
        <article>
          <span>30 秒市場氛圍</span>
          <strong>{breadth.constructive} 個偏強、{breadth.defensive} 個偏防守</strong>
          <p>先確認市場是偏進攻、偏觀察，還是需要降低風險。若防守數量增加，先複核風險成因。</p>
        </article>
        <article>
          <span>3 分鐘行動判斷</span>
          <strong>觀察、複核、等待</strong>
          <p>使用者應先讀總覽，再打開一個 ETF 與一個高風險樣本；若兩者訊號衝突，暫時等待更多資料。</p>
        </article>
        <article>
          <span>下週觀察重點</span>
          <strong>資料來源與覆蓋率仍是主線</strong>
          <p>下週優先追蹤資料來源權利、欄位契約、覆蓋率與 promotion gate，而不是急著宣稱真實資料上線。</p>
        </article>
      </section>

      <section className="panel weekly-article">
        <p className="eyebrow">重要聲明</p>
        <h2>本週以示範資料呈現公開閱讀流程</h2>
        <p>
          週報的目標是降低資訊擷取時間，讓一般投資者先形成市場觀察順序。內容不是個股買賣建議，也不保證資料即時、完整或正確。
        </p>
        <p>
          若未來 A1 資料線完成合法免費可自動化來源、欄位契約與覆蓋率驗證，週報才會進入 real-data promotion 評估。
        </p>
      </section>
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
