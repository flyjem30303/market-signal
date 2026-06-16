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
  description: "用 30 秒看懂市場燈號、主要風險與下一步觀察順序。Phase 1 使用示範資料，不提供投資建議。"
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
          本頁把市場燈號、風險分數、資料邊界與下一步行動整理成一個閱讀順序，幫助使用者快速判斷要關注、加強觀察或降低風險。
        </p>
        <p>
          目前 {market.asset.name} 為「{market.signal.title}」，綜合分數 {market.compositeScore}/100，
          風險分數 {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料；正式每日資料尚未啟用。本頁不是投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />

      <section className="briefing-executive-summary" aria-label="市場摘要">
        <div>
          <p className="eyebrow">30 秒結論</p>
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

      <section className="briefing-grid" aria-label="市場觀察">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>偏強 {breadth.constructiveCount} 個，風險偏高 {breadth.defensiveCount} 個</h2>
          <p>用相對強勢與風險偏高標的，快速判斷市場是擴散上攻，還是集中在少數題材。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險焦點</p>
          <h2>{topRisk.asset.name}</h2>
          <p>風險分數 {topRisk.riskScore}/100。若風險升高，建議先檢查資料更新時間與市場背景。</p>
        </article>
      </section>

      <section className="panel" aria-label="下一步行動">
        <p className="eyebrow">下一步行動</p>
        <h2>先判斷狀態，再看原因，最後確認資料邊界</h2>
        <p>如果燈號轉強，可以關注後續是否擴散；如果風險升高，先降低單一訊號依賴並複核資料狀態。</p>
      </section>

      <section className="panel" aria-label="資料邊界">
        <p className="eyebrow">資料邊界</p>
        <h2>目前仍是公開 Beta 示範資料</h2>
        <p>正式資料上線前，所有燈號與分數都用來驗證產品體驗，不代表真實市場狀態。</p>
      </section>

      <section className="panel" aria-label="觀察清單">
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
                {item.signal.title}，綜合 {item.compositeScore}/100，風險 {item.riskScore}/100。
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
