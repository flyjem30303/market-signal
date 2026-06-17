import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場週報",
  description: "整理本週市場燈號、相對強勢標的、風險觀察與後續追蹤重點。"
};

export default async function WeeklyPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 3);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />

      <section className="hero">
        <p className="eyebrow">市場週報</p>
        <h1>本週市場燈號與風險觀察</h1>
        <p>週報協助使用者回看本週市場狀態、相對強勢標的與需要加強觀察的風險。</p>
        <p className="runtime-boundary-line">週報僅供市場資訊整理與風險辨識，不提供買賣建議。</p>
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
          <p>風險分數 {topRisk.riskScore}/100，適合列入後續觀察清單。</p>
        </article>
        <article>
          <span>資料日期</span>
          <strong>{market.date}</strong>
          <p>使用前請確認資料時間與是否有降級提示。</p>
        </article>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

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
