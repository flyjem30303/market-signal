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
  const reachabilityLabel = freshness.isMock ? "Mock data is being used" : "Freshness metadata is reachable";
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const metadataBoundary = getFreshnessMetadataBoundarySummary(freshness);
  const metadataDisplayLabel = metadataBoundary.canDisplayFreshnessMetadata
    ? "Metadata can be displayed"
    : "Metadata cannot support public scoring";

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料新鮮度 / Data freshness boundary">
      <strong>{freshness.isMock ? "資料新鮮度：Mock" : `資料新鮮度：${freshness.stateLabel}`}</strong>
      <span className={freshness.isMock ? "freshness-runtime-source mock" : "freshness-runtime-source reachable"}>
        {reachabilityLabel}
      </span>
      <span>後端資料新鮮度已可讀：{freshness.isMock ? "否，使用 mock" : "是，僅作 metadata 顯示"}</span>
      <span>Source: {freshness.sourceName}</span>
      <span>As of: {freshness.asOfDate}</span>
      <span>Market: {freshness.market}</span>
      <span>Currency: {freshness.currency}</span>
      <span>Timezone: {freshness.timezone}</span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>
        分數來源：{freshness.scoreSourceLabel}
      </span>
      {marketSignalSourceStatus && (
        <span
          className={`freshness-market-signal-source ${marketSignalSourceStatus.resolvedSource}`}
          data-contract="市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}; 要求來源 {marketSignalSourceStatus.requestedSource}; 後端唯讀狀態 {marketSignalSourceStatus.supabaseRuntimeReads}"
        >
          市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}；要求來源{" "}
          {marketSignalSourceStatus.requestedSource}；後端唯讀狀態{" "}
          {String(marketSignalSourceStatus.supabaseRuntimeReads)}。
        </span>
      )}
      <span className="freshness-boundary">
        Freshness metadata is display context only. It does not approve market-data quality, investment claims, or
        real score source.
      </span>
      <span className="freshness-boundary">
        新鮮度基準：{interpretation.baselineObject}; data_freshness role:{" "}
        {interpretation.dataFreshnessObjectRole}.
      </span>
      <span className="freshness-boundary">{interpretation.stopLine}</span>
      <span className="freshness-boundary">
        資料品質閘門：{dataQuality.displayLabel}; state {dataQuality.downgradeState}.
      </span>
      <span className="freshness-boundary">{dataQuality.stopLine}</span>
      <span className={`freshness-boundary freshness-metadata-boundary ${metadataBoundary.state}`}>
        Metadata 邊界：{metadataBoundary.state}; {metadataDisplayLabel}.
      </span>
      <span className="freshness-boundary">{metadataBoundary.allowedPublicClaim}</span>
      <span className="freshness-boundary">{metadataBoundary.stopLine}</span>
      <span className="freshness-boundary">資料時間狀態只說明顯示狀態，不能升級成資料品質或正式分數。</span>
      <FreshnessEvidenceBoundary freshness={freshness} />
      {marketSignalSourceStatus && <span className="freshness-boundary">{marketSignalSourceStatus.reason}</span>}
      <span className="freshness-description">{freshness.description}</span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="Read methodology"
        payload={{ area: "data_freshness_strip" }}
      >
        Read methodology
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="Read disclaimer"
        payload={{ area: "data_freshness_strip" }}
      >
        Read disclaimer
      </TrackedLink>
    </aside>
  );
}
