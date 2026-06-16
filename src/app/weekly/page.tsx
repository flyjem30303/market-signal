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
  description: "整理本週市場燈號、主要風險標的與資料更新狀態。Phase 1 使用示範資料，不提供買賣建議。",
  hero: "本週市場狀態回顧",
  summary: "本週快速閱讀",
  signal: "市場燈號",
  risk: "主要風險觀察",
  updateStatus: "資料更新狀態",
  list: "本週觀察清單",
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
          本頁用週報方式整理市場燈號、風險分數與資料更新狀態，協助使用者回看本週市場脈絡。
        </p>
        <p>這是公開 Beta 的週報示範，不是投資建議，也不是即時報價或個股買賣指令。</p>
        <p className="runtime-boundary-line">
          Phase 1 仍使用示範資料與示範分數；正式每日資料尚未啟用，請搭配資料邊界閱讀。
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
          <p>風險分數 {topRisk.riskScore}/100。建議先看風險來源，再看資料是否延遲。</p>
        </article>
        <article>
          <span>{copy.updateStatus}</span>
          <strong>示範資料</strong>
          <p>本週報目前使用示範資料，正式資料上線前不代表真實市場狀態。</p>
        </article>
      </section>

      <section className="weekly-grid" aria-label={copy.list}>
        {strongest.map((snapshot) => (
          <article className="panel" key={snapshot.asset.symbol}>
            <p className="eyebrow">{snapshot.asset.symbol}</p>
            <h2>{snapshot.asset.name}</h2>
            <p>
              綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。建議先看燈號原因，再確認資料更新時間。
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
