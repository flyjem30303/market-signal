import { FreshnessEvidenceBoundary } from "@/components/freshness-evidence-boundary";
import { TrackedLink } from "@/components/tracked-link";
import { getDataQualityDowngradeSummary } from "@/lib/data-quality-downgrade";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getFreshnessMetadataBoundarySummary } from "@/lib/freshness-metadata-boundary";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const reachabilityLabel = freshness.isMock ? "目前使用示範資料" : "新鮮度 metadata 可讀";
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const metadataBoundary = getFreshnessMetadataBoundarySummary(freshness);
  const metadataDisplayLabel = metadataBoundary.canDisplayFreshnessMetadata
    ? "metadata 可作為狀態顯示"
    : "metadata 不能支撐公開評分";

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料新鮮度邊界">
      <strong>{freshness.isMock ? "資料新鮮度 metadata：示範資料" : `資料新鮮度 metadata：${freshness.stateLabel}`}</strong>
      <span className={freshness.isMock ? "freshness-runtime-source mock" : "freshness-runtime-source reachable"}>
        {reachabilityLabel}
      </span>
      <span>
        新鮮度 metadata 只作顯示脈絡；不是即時市場核准、完整覆蓋率或正式分數證據。
      </span>
      <span>來源：{freshness.sourceName}</span>
      <span>資料日期：{freshness.asOfDate}</span>
      <span>市場：{freshness.market}</span>
      <span>幣別：{freshness.currency}</span>
      <span>時區：{freshness.timezone}</span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>
        分數來源：{freshness.scoreSourceLabel}
      </span>
      {marketSignalSourceStatus && (
        <span
          className={`freshness-market-signal-source ${marketSignalSourceStatus.resolvedSource}`}
          data-contract={`market-signal-source=${marketSignalSourceStatus.resolvedSource}; requested=${marketSignalSourceStatus.requestedSource}; supabaseRuntimeReads=${marketSignalSourceStatus.supabaseRuntimeReads}`}
        >
          市場訊號來源：{marketSignalSourceStatus.resolvedSource}；要求來源{" "}
          {marketSignalSourceStatus.requestedSource}；Supabase runtime reads{" "}
          {String(marketSignalSourceStatus.supabaseRuntimeReads)}.
        </span>
      )}
      <span className="freshness-boundary">
        新鮮度 metadata 只作顯示脈絡，不代表市場資料品質、投資宣稱或正式分數來源已核准。
      </span>
      <span className="freshness-boundary">
        新鮮度基準物件：{interpretation.baselineObject}；data_freshness 角色：{" "}
        {interpretation.dataFreshnessObjectRole}.
      </span>
      <span className="freshness-boundary">{interpretation.stopLine}</span>
      <span className="freshness-boundary">
        資料品質降級：{dataQuality.displayLabel}；狀態 {dataQuality.downgradeState}.
      </span>
      <span className="freshness-boundary">{dataQuality.stopLine}</span>
      <span className={`freshness-boundary freshness-metadata-boundary ${metadataBoundary.state}`}>
        Metadata 邊界：{metadataBoundary.state}；{metadataDisplayLabel}.
      </span>
      <span className="freshness-boundary">{metadataBoundary.allowedPublicClaim}</span>
      <span className="freshness-boundary">{metadataBoundary.stopLine}</span>
      <span className="freshness-boundary">
        資料缺漏、延遲與覆蓋率不足都應降低信心；本頁不構成投資建議。
      </span>
      <FreshnessEvidenceBoundary freshness={freshness} />
      {marketSignalSourceStatus && <span className="freshness-boundary">{marketSignalSourceStatus.reason}</span>}
      <span className="freshness-description">{freshness.description}</span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="閱讀方法說明"
        payload={{ area: "data_freshness_strip" }}
      >
        閱讀方法說明
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="閱讀風險揭露"
        payload={{ area: "data_freshness_strip" }}
      >
        閱讀風險揭露
      </TrackedLink>
    </aside>
  );
}
