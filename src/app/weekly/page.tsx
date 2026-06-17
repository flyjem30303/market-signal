import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
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
  description: "回看本週市場燈號、風險焦點與後續觀察重點。"
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
        <h1>回看市場燈號與風險焦點</h1>
        <p>週報用於複盤與學習，協助使用者看見燈號變化、風險集中處與下週觀察重點。</p>
        <p className="runtime-boundary-line">目前週報使用示範資料；正式資料升級尚未開放。</p>
      </section>

      <section className="weekly-quick-read" aria-label="週報摘要">
        <p className="eyebrow">週報摘要</p>
        <article>
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>主要風險</span>
          <strong>{topRisk.asset.name}</strong>
          <p>風險分數 {topRisk.riskScore}/100。若風險集中在少數標的，仍需回看市場廣度。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料</strong>
          <p>週報目前不宣稱即時真實資料，也不提供投資建議。</p>
        </article>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <RouteLocalTrustCopyPanel context="weekly" />
      <TrustRuntimeBoundaryNotice context="weekly" />

      <section className="weekly-grid" aria-label="週報觀察標的">
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              {snapshot.signal.title}，綜合 {snapshot.compositeScore}/100，風險 {snapshot.riskScore}/100。
            </p>
            <TrackedLink
              className="text-link"
              eventName="weekly_link_clicked"
              href={`/stocks/${snapshot.asset.symbol}`}
              label={`查看 ${snapshot.asset.symbol}`}
              payload={{ symbol: snapshot.asset.symbol }}
            >
              查看標的
            </TrackedLink>
          </article>
        ))}
      </section>

      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}
