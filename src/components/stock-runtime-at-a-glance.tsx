import { TrackedLink } from "@/components/tracked-link";
import type { SignalSnapshot } from "@/lib/signal-model";

type StockRuntimeAtAGlanceProps = {
  scoringLabel: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoringLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const impactLevel = snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低";

  return (
    <section className="stock-runtime-at-a-glance" aria-label="標的快速狀態">
      <div>
        <p className="eyebrow">標的快速狀態</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
        </h2>
        <p>此區塊協助使用者快速理解標的燈號、風險程度與資料狀態，不提供買賣建議。</p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的狀態摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "readying"}>
          <span>燈號</span>
          <strong>{snapshot.signal.title}</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "readying"}>
          <span>風險程度</span>
          <strong>{impactLevel}</strong>
          <p>更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
          <p>風險分數越高，越需要確認市場是否出現擴散壓力。</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / {scoringLabel}</strong>
          <p>正式資料啟用前，本區塊只用於展示閱讀流程。</p>
        </article>
      </div>

      <nav className="runtime-next-links" aria-label="標的下一步">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="查看市場摘要"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看市場摘要
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
          label="回到市場總覽"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回到市場總覽
        </TrackedLink>
      </nav>
    </section>
  );
}

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
}
