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
  description: "公開週報整理本週市場燈號、觀察重點與資料邊界。目前為模擬資料，不是投資建議。"
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
        <p className="eyebrow">公開週報</p>
        <h1>市場週報：一週一次整理市場燈號與觀察重點</h1>
        <p>
          週報把每日燈號整理成較長週期的觀察摘要，協助使用者用 30 秒回看市場狀態是否延續、風險是否升高，以及下週應該優先追蹤什麼。
        </p>
        <p className="runtime-boundary-line">目前週報使用模擬資料展示閱讀流程，不是投資建議，也不宣稱即時真實資料。</p>
      </section>

      <section className="weekly-quick-read" aria-label="週報快讀">
        <article>
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article>
          <span>影響級別</span>
          <strong>{topRisk.riskScore >= 70 ? "高" : topRisk.riskScore >= 55 ? "中" : "低"}</strong>
          <p>
            {topRisk.asset.name} 風險分數 {topRisk.riskScore}/100；若影響級別升高，下週先檢查資料更新時間與風險變化。
          </p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>模擬資料</strong>
          <p>正式資料上線前，週報只作為公開 Beta 的閱讀示範。</p>
        </article>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "weekly" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href={`/stocks/${market.asset.symbol}`} label="查看指數詳情" payload={{ area: "weekly" }}>
          查看指數詳情
        </TrackedLink>
      </section>

      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}
