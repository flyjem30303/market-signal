import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getDataQualityDowngradeSummary } from "@/lib/data-quality-downgrade";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const scoreLabel = freshness.scoreSource === "mock" ? "示範分數" : freshness.scoreSourceLabel;
  const sourceLabel =
    marketSignalSourceStatus?.resolvedSource === "mock" || freshness.isMock ? "示範資料" : freshness.sourceName;

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料更新狀態">
      <strong>資料狀態：{freshness.stateLabel}</strong>
      <span>資料來源：{sourceLabel}</span>
      <span>更新時間：{freshness.asOfDate}</span>
      <span>
        市場：{freshness.market} / {freshness.currency}
      </span>
      <span className="freshness-description">{freshness.description}</span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>分數來源：{scoreLabel}</span>
      <span>資料品質閘門：{dataQuality.displayLabel}</span>
      <span className="freshness-description">
        品質狀態 {dataQuality.downgradeState}，{dataQuality.reason}
      </span>
      {marketSignalSourceStatus ? (
        <>
          <span>市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}</span>
          <span>要求來源 {marketSignalSourceStatus.requestedSource}</span>
          <span>後端唯讀狀態 {marketSignalSourceStatus.supabaseRuntimeReads}</span>
          <span className="freshness-description">{marketSignalSourceStatus.reason}</span>
        </>
      ) : null}
      <span className="freshness-boundary">
        公開頁目前使用示範資料與示範分數；正式每日資料啟用前，請以資料狀態與風險聲明一起閱讀。
      </span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="查看方法說明"
        payload={{ area: "data_freshness_strip" }}
      >
        方法說明
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="查看免責聲明"
        payload={{ area: "data_freshness_strip" }}
      >
        免責聲明
      </TrackedLink>
    </aside>
  );
}
