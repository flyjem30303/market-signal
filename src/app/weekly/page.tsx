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
  description: "整理一週市場燈號、風險變化與後續觀察重點。"
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
        <h1>用較長時間脈絡檢查市場燈號</h1>
        <p>
          週報協助使用者回看市場狀態是否延續、風險是否集中，以及下一週需要優先觀察哪些指標。
        </p>
        <p className="runtime-boundary-line">目前仍為公開 Beta 示範資料，不宣稱即時真實資料或投資建議。</p>
      </section>

      <section className="weekly-quick-read" aria-label="週報快讀">
        <article>
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>最高風險樣本</span>
          <strong>{topRisk.asset.name}</strong>
          <p>
            風險分數 {topRisk.riskScore}/100。若風險分數持續升高，建議先保守觀察。
          </p>
        </article>
        <article>
          <span>資料提醒</span>
          <strong>示範資料</strong>
          <p>資料真實化 gate 完成前，週報只用來展示閱讀流程與資訊層級。</p>
        </article>
      </section>

      <section className="weekly-grid" aria-label="週報觀察清單">
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。請搭配市場總覽一起閱讀。
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
