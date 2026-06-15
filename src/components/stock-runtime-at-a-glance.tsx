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
        <p className="eyebrow">標的 30 秒快讀</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
        </h2>
        <p>
          先看燈號，再看風險與資料時間。這個區塊協助使用者快速判斷要關注、加強觀察，或暫時降低依賴。
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的決策摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "readying"}>
          <span>狀態</span>
          <strong>{snapshot.signal.title}</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "readying"}>
          <span>風險級別</span>
          <strong>{impactLevel}</strong>
          <p>資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
          <p>若風險升高，請先確認是趨勢、資金、估值或資料品質造成。</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / 示範分數</strong>
          <p>目前尚未宣稱正式即時資料，請勿把示範分數視為投資建議。</p>
          <p>分數標籤：{scoringLabel}</p>
          <p>{toPublicDataStopLine(dataReadiness.stopLine)}</p>
        </article>
      </div>

      <div className="stock-runtime-user-contract" aria-label="標的頁使用說明">
        <p className="eyebrow">3 分鐘觀察流程</p>
        <h3>從燈號、原因、資料狀態到下一步觀察</h3>
        <p>
          標的頁不是交易工具。使用者應先理解市場狀態，再複核資料時間、主要風險與後續觀察條件。
        </p>
        <div className="hero-status-strip" aria-label="標的頁重點">
          <span>30 秒可讀</span>
          <span>3 分鐘可複核</span>
          <span>非投資建議</span>
          <span>資料狀態清楚揭露</span>
        </div>
      </div>

      <div className="stock-runtime-action-strip" aria-label="3 分鐘觀察步驟">
        <article className="active">
          <span>1</span>
          <strong>看燈號</strong>
          <p>先確認目前是偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="readying">
          <span>2</span>
          <strong>看風險來源</strong>
          <p>確認風險是否集中在趨勢、資金、估值或資料品質。</p>
        </article>
        <article className="blocked">
          <span>3</span>
          <strong>看資料狀態</strong>
          <p>若資料仍為示範或尚未更新，請不要用單一分數做判斷。</p>
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
          label="查看市場快報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看市場快報
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

function toPublicDataStopLine(value: string) {
  return value
    .replace(/publicDataSource|scoreSource/gu, "正式資料切換檢查")
    .replace(new RegExp("promotion\\s+gates?", "gu"), "正式資料切換檢查");
}
