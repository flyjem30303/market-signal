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
  title: "週報",
  description: "整理本週市場燈號、風險重點與下一週觀察方向。"
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
        <p className="eyebrow">週報</p>
        <h1>市場週報：把一週市場狀態整理成可追蹤的觀察清單</h1>
        <p>
          週報用來回看市場燈號、風險分數與相對強弱，協助你建立固定的盤後或週末檢查流程。
        </p>
        <p className="runtime-boundary-line">目前仍是公開版示範資料，正式資料上線前不作投資建議。</p>
      </section>

      <section className="weekly-quick-read" aria-label="週報快讀">
        <article>
          <span>市場狀態</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>最高風險觀察</span>
          <strong>{topRisk.asset.name}</strong>
          <p>
            風險分數 {topRisk.riskScore}/100。若風險偏高，適合先檢查原因，再決定是否降低曝險。
          </p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料</strong>
          <p>資料真實化完成前，週報只用來展示閱讀流程與資訊層級。</p>
        </article>
      </section>

      <section className="weekly-grid" aria-label="週報觀察標的">
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。可作為本週相對強弱觀察項目。
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
