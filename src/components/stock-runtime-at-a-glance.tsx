import { TrackedLink } from "@/components/tracked-link";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import type { SignalSnapshot } from "@/lib/signal-model";

type StockRuntimeAtAGlanceProps = {
  scoringLabel?: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoringLabel = "示範分數", snapshot }: StockRuntimeAtAGlanceProps) {
  const decisionSummary = getRuntimeDecisionSummary();
  const impactLevel = snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低";
  const scoreSourceLabel = scoringLabel;

  return (
    <section className="stock-runtime-at-a-glance" aria-label="標的燈號快速閱讀">
      <div>
        <p className="eyebrow">標的燈號</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
        </h2>
        <p>使用者可先看狀態、原因與更新時間，再決定是否加強觀察。此頁目前維持示範資料與 {scoreSourceLabel}。</p>
        <p>
          {decisionSummary.decisionLabel}: {decisionSummary.currentProgressPercent}%；{decisionSummary.safetyStopLine}
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的公開決策摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "readying"}>
          <span>燈號</span>
          <strong>{snapshot.signal.title}</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "readying"}>
          <span>風險級別</span>
          <strong>{impactLevel}</strong>
          <p>更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
          <p>風險分數越高，越需要回看趨勢、成交量與市場廣度。</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / {scoreSourceLabel}</strong>
          <p>正式資料升級前，本頁不宣稱即時真實資料，也不提供買賣建議。</p>
        </article>
      </div>

      <nav className="runtime-next-links" aria-label="標的下一步閱讀">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/markets/tw"
          label="查看台灣市場"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看台灣市場
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看方法說明"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看方法說明
        </TrackedLink>
        <TrackedLink
          eventName="stock_link_clicked"
          href="/"
          label="回市場總覽"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回市場總覽
        </TrackedLink>
      </nav>
    </section>
  );
}

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
}
