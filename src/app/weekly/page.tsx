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

const copy = {
  title: "\u5e02\u5834\u9031\u5831",
  description:
    "\u7528\u4e00\u9031\u8996\u89d2\u6574\u7406\u5e02\u5834\u71c8\u865f\u3001\u98a8\u96aa\u4f86\u6e90\u8207\u89c0\u5bdf\u6e05\u55ae\u3002Phase 1 \u4f7f\u7528\u793a\u7bc4\u8cc7\u6599\uff0c\u4e0d\u63d0\u4f9b\u6295\u8cc7\u5efa\u8b70\u3002",
  hero: "\u7528\u4e00\u9031\u8996\u89d2\u770b\u5e02\u5834\u71c8\u865f\u8207\u98a8\u96aa\u8b8a\u5316",
  summary: "\u9031\u5831\u6458\u8981",
  signal: "\u5e02\u5834\u71c8\u865f",
  risk: "\u6700\u9ad8\u98a8\u96aa\u89c0\u5bdf",
  data: "\u8cc7\u6599\u72c0\u614b",
  updateStatus: "\u8cc7\u6599\u66f4\u65b0\u72c0\u614b",
  list: "\u9031\u5831\u89c0\u5bdf\u6e05\u55ae",
  viewSignal: "\u67e5\u770b\u71c8\u865f"
};

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description
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
        <p className="eyebrow">{copy.title}</p>
        <h1>{copy.hero}</h1>
        <p>週報把每日燈號放進較長的觀察脈絡，協助使用者整理市場主軸、風險來源與後續追蹤清單。</p>
        <p className="runtime-boundary-line">Phase 1 使用示範資料，不提供投資建議或買賣推薦。</p>
      </section>

      <section className="weekly-quick-read" aria-label={copy.summary}>
        <article>
          <span>{copy.signal}</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>{copy.risk}</span>
          <strong>{topRisk.asset.name}</strong>
          <p>風險分數 {topRisk.riskScore}/100。請先確認風險原因與資料狀態。</p>
        </article>
        <article>
          <span>{copy.updateStatus}</span>
          <strong>示範資料</strong>
          <p>正式資料上線前，不宣稱即時或完整市場資料。</p>
        </article>
      </section>

      <section className="weekly-grid" aria-label={copy.list}>
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              市場分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。此排序只作為示範觀察。
            </p>
            <TrackedLink
              eventName="weekly_link_clicked"
              href={`/stocks/${snapshot.asset.symbol}`}
              label={`${copy.viewSignal} ${snapshot.asset.name}`}
              payload={{ area: "weekly", symbol: snapshot.asset.symbol }}
            >
              {copy.viewSignal}
            </TrackedLink>
          </article>
        ))}
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="weekly" />
      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}
