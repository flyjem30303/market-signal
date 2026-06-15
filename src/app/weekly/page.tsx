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
  title: "市場週報",
  description: "用一週視角回看市場燈號、風險變化、相對強勢標的與資料更新狀態；目前為示範資料，不構成投資建議。"
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
        <p className="eyebrow">市場週報</p>
        <h1>用一週視角回看市場燈號與風險變化</h1>
        <p>
          週報協助使用者回看市場狀態、風險變化與相對強勢標的。正式資料上線前，本頁仍以示範資料呈現閱讀流程。
        </p>
        <p className="runtime-boundary-line">本頁不是投資建議，也不宣稱即時真實行情；請搭配資料時間與風險提示閱讀。</p>
      </section>

      <section className="weekly-quick-read" aria-label="週報摘要">
        <article>
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>本週優先複核</span>
          <strong>{topRisk.asset.name}</strong>
          <p>風險分數 {topRisk.riskScore}/100。請先確認資料狀態與主要風險來源，再延伸後續觀察。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料</strong>
          <p>資料更新狀態會顯示在頁面下方；正式資料流程啟用前，不把週報視為交易訊號。</p>
        </article>
      </section>

      <section className="weekly-grid" aria-label="週報觀察清單">
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              市場分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。適合放入一週觀察清單，但仍需回看成因與資料時間。
            </p>
            <TrackedLink
              eventName="weekly_link_clicked"
              href={`/stocks/${snapshot.asset.symbol}`}
              label={`查看 ${snapshot.asset.name}`}
              payload={{ area: "weekly", symbol: snapshot.asset.symbol }}
            >
              查看燈號
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
