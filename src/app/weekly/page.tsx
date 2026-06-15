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
  title: "市場週報",
  description: "整理本週市場狀態、主要燈號、風險最高標的與資料更新狀態。Phase 1 使用示範資料，不提供買賣建議。",
  hero: "本週市場狀態整理",
  summary: "週報快速閱讀",
  signal: "市場總燈號",
  risk: "風險最高標的",
  updateStatus: "資料更新時間",
  list: "市場行動摘要",
  viewSignal: "查看燈號"
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
        <p>
          用 30 秒確認市場燈號，再用 3 分鐘複核風險最高標的、資料狀態與下一步觀察重點。
          週報僅提供市場資訊整理，不提供買賣建議。
        </p>
        <p>週報行動摘要：本頁是非投資建議，只協助使用者整理本週觀察順序。</p>
        <p className="runtime-boundary-line">
          Phase 1 仍使用示範資料與示範分數；正式資料尚未啟用，請以資料更新時間與資料狀態作為閱讀前提。
        </p>
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
          <p>
            風險分數 {topRisk.riskScore}/100。分數較高時，先降低單一訊號判斷，改以資料狀態、
            市場背景與後續觀察重點一起複核。
          </p>
        </article>
        <article>
          <span>{copy.updateStatus}</span>
          <strong>示範資料</strong>
          <p>
            資料更新狀態：目前公開頁以 mock 資料呈現閱讀流程；正式每日資料上線前，不宣稱即時、完整或可作為交易依據。
          </p>
        </article>
      </section>

      <section className="weekly-grid" aria-label={copy.list}>
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              燈號分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。先看狀態，
              再確認原因與資料邊界，避免只用單一分數做判斷。
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
