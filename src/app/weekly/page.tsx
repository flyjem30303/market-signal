import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場週報",
  description: "整理本週市場狀態、主要風險與下一步觀察方向；內容不提供買賣建議。"
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

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />
      <section className="hero">
        <p className="eyebrow">市場週報</p>
        <h1>本週市場狀態：先看燈號，再看風險來源</h1>
        <p>
          本週市場狀態整理會把主燈號、最高風險項目與資料更新時間放在同一頁，讓使用者用 30 秒快速回顧市場變化。
        </p>
        <p className="runtime-boundary-line">
          週報僅提供市場資訊整理與觀察輔助，不提供買賣建議，也不保證任何投資結果。
        </p>
      </section>

      <section className="weekly-quick-read" aria-label="週報快讀">
        <article>
          <span>本週市場狀態</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>主要風險</span>
          <strong>{topRisk.riskScore >= 70 ? "高" : topRisk.riskScore >= 55 ? "中" : "低"}</strong>
          <p>
            {topRisk.asset.name} 風險分數 {topRisk.riskScore}/100。若風險升高，請先確認資料時間與成因。
          </p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料</strong>
          <p>正式資料尚未啟用，週報內容需搭配資料來源與更新時間閱讀。</p>
        </article>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "weekly" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href={`/stocks/${market.asset.symbol}`} label="查看市場主燈號" payload={{ area: "weekly" }}>
          查看市場主燈號
        </TrackedLink>
      </section>

      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}
