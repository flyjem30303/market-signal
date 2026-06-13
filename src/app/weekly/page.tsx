import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildWeeklyMarketActionSummary } from "@/lib/weekly-market-action-summary";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場週報",
  description: "公開 Beta 市場週報，整理市場燈號、ETF 狀態、風險觀察與資料更新狀態。"
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
        <p className="eyebrow">市場週報</p>
        <h1>市場週報</h1>
        <p>
          週報把每日燈號拉成一個更穩定的觀察框架，協助使用者用 30 秒先回看市場氣氛、ETF 狀態與風險熱度。公開 Beta
          仍以示範資料呈現閱讀流程，屬於非投資建議，不提供買賣建議。
        </p>
        <p className="runtime-boundary-line">
          若資料未更新或品質偏低，請先降低判斷權重；正式資料會在來源、覆蓋與品質條件完成後另行升級，
          會員深度複盤則屬於下一階段路線。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="weekly" />
      <RouteLocalTrustCopyPanel context="weekly" />

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

      <section className="panel stock-reading-summary" aria-label="週報資料狀態">
        <p className="eyebrow">資料狀態</p>
        <h2>週報目前先示範閱讀方式</h2>
        <p>
          週報的第一階段目標，是讓使用者快速看懂本週市場氣氛、ETF 參考、風險熱度與資料更新時間。
          正式資料來源、完整覆蓋率與更新流程完成前，所有分數與燈號都只作為市場觀察流程示範。
        </p>
        <div className="briefing-actions">
          <article>
            <strong>目前可用</strong>
            <p>用 30 秒回看市場偏多、觀望或防守，再用 3 分鐘複核成因與資料狀態。</p>
          </article>
          <article>
            <strong>需要保守</strong>
            <p>資料更新時間、資料來源與覆蓋狀態未完整前，不把週報視為正式行情或完整市場資料庫。</p>
          </article>
          <article>
            <strong>下一階段</strong>
            <p>會員版本會加入盤後複盤、歷史燈號回看與個人 watchlist，但仍維持非投資建議定位。</p>
          </article>
        </div>
      </section>

      <section className="weekly-quick-read" aria-label="週報快速閱讀">
        <article>
          <span>本週市場狀態整理</span>
          <strong>
            {breadth.constructive} 個偏多、{breadth.watch} 個觀望、{breadth.defensive} 個防守
          </strong>
          <p>30 秒先看市場廣度，再判斷目前是擴散偏強、局部過熱，或需要降低風險。</p>
        </article>
        <article>
          <span>3 分鐘判斷</span>
          <strong>先看主燈號，再看風險熱度與 ETF 參考</strong>
          <p>週報適合用來確認每日燈號是否延續，而不是把單日分數當作立即決策。</p>
        </article>
        <article>
          <span>資料提醒</span>
          <strong>示範資料、正式資料尚未啟用</strong>
          <p>資料更新時間：{freshness.asOfDate}；資料來源、授權與完整覆蓋完成前，週報只呈現產品閱讀方式與風險揭露。</p>
        </article>
      </section>

      <nav aria-label="週報閱讀路徑" className="experience-flow-nav">
        <span>閱讀路徑</span>
        <TrackedLink eventName="weekly_link_clicked" href="/" label="市場總覽" payload={{ area: "experience_flow", target: "home" }}>
          市場總覽
        </TrackedLink>
        <TrackedLink eventName="weekly_link_clicked" href="/briefing" label="每日晨報" payload={{ area: "experience_flow", target: "briefing" }}>
          每日晨報
        </TrackedLink>
        <TrackedLink
          eventName="weekly_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="指數細節"
          payload={{ area: "experience_flow", target: "market_status", symbol: market.asset.symbol }}
        >
          指數細節
        </TrackedLink>
        <TrackedLink eventName="weekly_link_clicked" href="/methodology" label="方法說明" payload={{ area: "experience_flow", target: "methodology" }}>
          方法說明
        </TrackedLink>
        <TrackedLink eventName="weekly_link_clicked" href="/disclaimer" label="風險聲明" payload={{ area: "experience_flow", target: "disclaimer" }}>
          風險聲明
        </TrackedLink>
      </nav>

      <section className="panel weekly-article">
        <p className="eyebrow">下一步觀察</p>
        <h2>週報要回答的是「這週市場狀態是否值得延續關注」</h2>
        <p>
          若偏多標的增加、風險熱度未同步升高，可列入下週關注清單；若風險標的擴散或資料狀態不完整，應先回到防守與等待更新。
          下一階段會員版本會再加入盤後複盤、歷史燈號回看與個人 watchlist。
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
