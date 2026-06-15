import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場快報",
  description: "用 30 秒掌握目前市場燈號、主要風險與下一步觀察重點。"
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場快報摘要">
        <p className="eyebrow">市場快報</p>
        <h1>30 秒看懂市場燈號，3 分鐘決定下一步觀察</h1>
        <p>
          30 秒看市場狀態：目前 {market.asset.name} 顯示「{market.signal.title}」，綜合分數 {market.compositeScore}/100，風險分數{" "}
          {market.riskScore}/100。這份快報協助你先判斷市場氣氛，再決定要關注、加強觀察或降低風險。
        </p>
        <p className="runtime-boundary-line">
          目前仍是公開版示範資料，不是即時真實市場資料，也不是投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="市場快讀">
        <div>
          <p className="eyebrow">30 秒快讀</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            <b>市場分數</b>
            <i>{market.compositeScore}/100</i>
          </span>
          <span>
            <b>最高風險觀察</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="警戒" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="panel stock-reading-summary" aria-label="下一步行動">
        <p className="eyebrow">下一步行動</p>
        <h2>先看市場狀態，再檢查風險來源</h2>
        <div className="briefing-actions">
          <article>
            <strong>1. 看方向</strong>
            <p>先用綜合分數判斷市場偏多、觀望或警戒，不急著看單一標的。</p>
          </article>
          <article>
            <strong>2. 看風險</strong>
            <p>再看風險分數與異常提示，確認是否需要降低曝險或等待更清楚訊號。</p>
          </article>
          <article>
            <strong>3. 看細節</strong>
            <p>進入指數、ETF 或個股頁面，確認該標的的燈號原因與更新時間。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid" aria-label="市場觀察清單">
        <BriefingList description="綜合分數較強的觀察標的。" items={strongest} title="相對強勢" />
        <BriefingList description="風險分數最高，適合優先複核。" items={[topRisk]} title="最高風險" />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />
      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.riskScore >= 65) summary.defensive += 1;
      else if (snapshot.compositeScore >= 65) summary.constructive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({ label, tone, value }: { label: string; tone: "active" | "blocked" | "hold"; value: number }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>符合條件的觀察項目數</p>
    </article>
  );
}

function BriefingList({ description, items, title }: { description: string; items: SignalSnapshot[]; title: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">市場觀察</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="stock-chip-list">
        {items.map((item) => (
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.symbol}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: "briefing_list", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
