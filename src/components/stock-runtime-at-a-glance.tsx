import { TrackedLink } from "@/components/tracked-link";
import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";
import type { SignalSnapshot } from "@/lib/signal-model";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";

type StockRuntimeAtAGlanceProps = {
  scoringLabel: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoringLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const dataReadiness = getPublicBetaDataReadinessStatus();
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const impactLevel = snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低";

  return (
    <section className="stock-runtime-at-a-glance" aria-label="標的狀態摘要">
      <div>
        <p className="eyebrow">公開 Beta 狀態</p>
        <p>
          目前使用示範資料呈現流程：30 秒內看懂標的狀態，3 分鐘內確認風險、資料更新時間與下一步觀察。
        </p>
        <p>個股燈號 / 一眼判讀：先看綜合分數與風險分數，再確認資料時間與使用邊界。</p>
        <p className="eyebrow">標的 30 秒快讀</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
        </h2>
        <p>這個頁面整理燈號、風險來源、資料更新時間與使用邊界，協助使用者先理解狀態，再決定是否加強觀察。</p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的決策摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "readying"}>
          <span>狀態</span>
          <strong>{snapshot.signal.title}</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "readying"}>
          <span>風險等級</span>
          <strong>{impactLevel}</strong>
          <p>資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
          <p>分數偏高時，請先確認風險是否集中在少數標的，或已經擴散到市場廣度。</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / 示範分數</strong>
          <p>正式資料尚未啟用；目前分數只用於產品閱讀流程。</p>
          <p>分數標籤：{scoringLabel}</p>
          <p>{toPublicDataStopLine(dataReadiness.stopLine)}</p>
        </article>
      </div>

      <div className="stock-runtime-headline-summary" aria-label="標的重點摘要">
        <div>
          <span>重點摘要</span>
          <strong>{headlineSummary.headline}</strong>
          <p>{headlineSummary.subhead}</p>
        </div>
        {headlineSummary.items.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="stock-runtime-headline-stop-line">{headlineSummary.stopLine}</p>
      </div>

      <nav className="runtime-next-links" aria-label="標的下一步">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="看市場快報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          看市場快報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="看方法說明"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          看方法說明
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

function toPublicDataStopLine(value: string) {
  return value
    .replace(/publicDataSource|scoreSource/gu, "正式資料與分數來源")
    .replace(new RegExp("promotion\\s+gates?", "gu"), "正式資料切換檢查");
}
