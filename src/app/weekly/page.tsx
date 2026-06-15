import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "每週市場觀察",
  description: "整理本週市場燈號、主要風險、觀察重點與資料邊界。"
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
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 3);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />

      <section className="hero">
        <p className="eyebrow">每週市場觀察</p>
        <h1>用一頁回看市場燈號、風險與下週觀察重點</h1>
        <p>
          每週頁把本週市場狀態整理成可追蹤的觀察流程：先看主燈號，再看風險是否集中，最後確認資料是否足以支撐判斷。
        </p>
        <p className="runtime-boundary-line">
          目前仍為公開 Beta 示範資料；正式每日資料與回補流程完成前，本頁不宣稱即時真實資料，也不提供投資建議。
        </p>
      </section>

      <section className="weekly-quick-read" aria-label="每週快速閱讀">
        <article>
          <span>市場主燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>最高風險</span>
          <strong>{topRisk.riskScore >= 70 ? "高風險" : topRisk.riskScore >= 55 ? "需觀察" : "穩定"}</strong>
          <p>
            {topRisk.asset.name} 風險分數 {topRisk.riskScore}/100；若風險升高，先複核資料時間與燈號原因。
          </p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料</strong>
          <p>正式資料尚未啟用，本頁只用來驗證公開 Beta 的閱讀流程與風險揭露。</p>
        </article>
      </section>

      <section className="panel stock-reading-summary" aria-label="每週行動摘要">
        <p className="eyebrow">每週行動摘要</p>
        <h2>下週先追蹤市場方向、風險集中度與資料更新</h2>
        <p>
          本頁不是投資建議，而是協助使用者把市場狀態轉成固定觀察流程：先看燈號，再看原因，最後看資料邊界。
        </p>
        <div className="briefing-actions">
          <article>
            <strong>本週市場分數</strong>
            <p>
              {market.asset.name} 市場分數 {market.compositeScore}/100；{topRisk.asset.name} 風險分數 {topRisk.riskScore}/100。
            </p>
          </article>
          <article>
            <strong>下週觀察</strong>
            <p>觀察趨勢是否延續、風險是否擴散，以及正式資料啟用前的資料時間與來源狀態。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid" aria-label="每週觀察清單">
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              市場分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。請搭配資料更新時間閱讀。
            </p>
            <TrackedLink
              eventName="weekly_link_clicked"
              href={`/stocks/${snapshot.asset.symbol}`}
              label={`查看 ${snapshot.asset.name}`}
              payload={{ area: "weekly", symbol: snapshot.asset.symbol }}
            >
              查看標的燈號
            </TrackedLink>
          </article>
        ))}
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="weekly" />
      <PublicNextReadingFlow context="weekly" />
    </main>
  );
}
