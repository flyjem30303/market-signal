import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getDataQualityDowngradeSummary } from "@/lib/data-quality-downgrade";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getFreshnessMetadataBoundarySummary } from "@/lib/freshness-metadata-boundary";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";
import { FreshnessEvidenceBoundary } from "@/components/freshness-evidence-boundary";
import { TrackedLink } from "@/components/tracked-link";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const reachabilityLabel = freshness.isMock ? "目前使用 mock freshness metadata" : "Supabase metadata 已可讀";
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const metadataBoundary = getFreshnessMetadataBoundarySummary(freshness);
  const metadataDisplayLabel = metadataBoundary.canDisplayFreshnessMetadata ? "可顯示 freshness metadata" : "不可顯示公開 freshness metadata";

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料 freshness 狀態">
      <strong>{freshness.isMock ? "目前為 mock freshness" : `資料 freshness：${freshness.stateLabel}`}</strong>
      <span className={freshness.isMock ? "freshness-runtime-source mock" : "freshness-runtime-source reachable"}>
        {reachabilityLabel}
      </span>
      <span>來源：{freshness.sourceName}</span>
      <span>資料日期：{freshness.asOfDate}</span>
      <span>市場：{freshness.market}</span>
      <span>幣別：{freshness.currency}</span>
      <span>時區：{freshness.timezone}</span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>分數來源：{freshness.scoreSourceLabel}</span>
      {marketSignalSourceStatus && (
        <span className={`freshness-market-signal-source ${marketSignalSourceStatus.resolvedSource}`}>
          市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}；要求來源 {marketSignalSourceStatus.requestedSource}
          ；Supabase 讀取 {marketSignalSourceStatus.supabaseRuntimeReads}
        </span>
      )}
      <span className="freshness-boundary">
        新鮮度基準：資料新鮮度 metadata 只說明顯示狀態；Freshness metadata only explains data recency and does
        not approve live scoring or real-data quality.
      </span>
      <span className="freshness-boundary">
        Interpretation baseline: {interpretation.baselineObject}; data_freshness role:{" "}
        {interpretation.dataFreshnessObjectRole}
      </span>
      <span className="freshness-boundary">{interpretation.stopLine}</span>
      <span className="freshness-boundary">
        資料品質閘門：Data quality display {dataQuality.displayLabel}; downgrade state:{" "}
        {dataQuality.downgradeState}
      </span>
      <span className="freshness-boundary">{dataQuality.stopLine}</span>
      <span className={`freshness-boundary freshness-metadata-boundary ${metadataBoundary.state}`}>
        Metadata boundary / Metadata 邊界：{metadataBoundary.state}; {metadataDisplayLabel}
      </span>
      <span className="freshness-boundary">{metadataBoundary.allowedPublicClaim}</span>
      <span className="freshness-boundary">{metadataBoundary.stopLine}</span>
      <FreshnessEvidenceBoundary freshness={freshness} />
      {marketSignalSourceStatus && <span className="freshness-boundary">{marketSignalSourceStatus.reason}</span>}
      <span className="freshness-description">{freshness.description}</span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="查看方法論"
        payload={{ area: "data_freshness_strip" }}
      >
        查看方法論
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="查看免責聲明"
        payload={{ area: "data_freshness_strip" }}
      >
        查看免責聲明
      </TrackedLink>
    </aside>
  );
}
