import { TrackedLink } from "@/components/tracked-link";
import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";
import type { SignalSnapshot } from "@/lib/signal-model";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";

type StockRuntimeAtAGlanceProps = {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoreSourceLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const dataReadiness = getPublicBetaDataReadinessStatus();
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const impactLevel = snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低";

  return (
    <section className="stock-runtime-at-a-glance" aria-label="標的即時摘要">
      <div>
        <p className="eyebrow">標的 30 秒摘要</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name}：{snapshot.signal.title}
        </h2>
        <p>
          用市場狀態、成因、影響級別與資料更新時間，協助你在 3 分鐘內完成「觀察、複核、等待」的初步判斷。
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的決策摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "readying"}>
          <span>狀態</span>
          <strong>{snapshot.signal.title}</strong>
          <p>成因：趨勢、品質、評價、廣度、資金與總體風險共同形成目前燈號。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "readying"}>
          <span>影響級別</span>
          <strong>{impactLevel}</strong>
          <p>資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
          <p>下一步：先複核風險分數與資料邊界，再決定是否加強觀察。</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>展示資料 / 示範分數</strong>
          <p>目前前台仍使用展示資料與示範分數，尚未切換到正式資料來源。</p>
          <p>分數來源：{scoreSourceLabel}</p>
        <p>{dataReadiness.stopLine.replace(/publicDataSource|scoreSource|promotion gate/gu, "正式資料切換")}</p>
        </article>
      </div>

      <div className="stock-runtime-action-strip" aria-label="3 分鐘判斷順序">
        <article className="active">
          <span>1</span>
          <strong>看狀態</strong>
          <p>先確認目前是偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="readying">
          <span>2</span>
          <strong>看成因與影響級別</strong>
          <p>再確認燈號是由哪些指標造成，以及風險是否升高。</p>
        </article>
        <article className="blocked">
          <span>3</span>
          <strong>看資料更新時間</strong>
          <p>資料未完成上線前，不應直接視為個股買賣建議。</p>
        </article>
      </div>

      <div className="stock-runtime-headline-summary" aria-label="標的閱讀摘要">
        <div>
          <span>閱讀摘要</span>
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
          label="查看市場簡報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看市場簡報
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
