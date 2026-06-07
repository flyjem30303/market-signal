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
  const reachabilityLabel = freshness.isMock ? "Mock data is being used" : "Freshness metadata is reachable";
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const metadataBoundary = getFreshnessMetadataBoundarySummary(freshness);
  const metadataDisplayLabel = metadataBoundary.canDisplayFreshnessMetadata
    ? "Metadata can be displayed"
    : "Metadata cannot support public scoring";

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="Data freshness boundary">
      <strong>{freshness.isMock ? "Data freshness metadata: mock" : `Data freshness metadata: ${freshness.stateLabel}`}</strong>
      <span className={freshness.isMock ? "freshness-runtime-source mock" : "freshness-runtime-source reachable"}>
        {reachabilityLabel}
      </span>
      <span>
        Freshness metadata is display context only; it is not live market approval, complete coverage, or real-score
        evidence.
      </span>
      <span>Source: {freshness.sourceName}</span>
      <span>As of: {freshness.asOfDate}</span>
      <span>Market: {freshness.market}</span>
      <span>Currency: {freshness.currency}</span>
      <span>Timezone: {freshness.timezone}</span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>
        Score source: {freshness.scoreSourceLabel}
      </span>
      {marketSignalSourceStatus && (
        <span
          className={`freshness-market-signal-source ${marketSignalSourceStatus.resolvedSource}`}
          data-contract={`market-signal-source=${marketSignalSourceStatus.resolvedSource}; requested=${marketSignalSourceStatus.requestedSource}; supabaseRuntimeReads=${marketSignalSourceStatus.supabaseRuntimeReads}`}
        >
          Market signal source: {marketSignalSourceStatus.resolvedSource}; requested{" "}
          {marketSignalSourceStatus.requestedSource}; Supabase runtime reads{" "}
          {String(marketSignalSourceStatus.supabaseRuntimeReads)}.
        </span>
      )}
      <span className="freshness-boundary">
        Freshness metadata is display context only. It does not approve market-data quality, investment claims, or
        real score source.
      </span>
      <span className="freshness-boundary">
        Freshness baseline object: {interpretation.baselineObject}; data_freshness role:{" "}
        {interpretation.dataFreshnessObjectRole}.
      </span>
      <span className="freshness-boundary">{interpretation.stopLine}</span>
      <span className="freshness-boundary">
        Data quality downgrade: {dataQuality.displayLabel}; state {dataQuality.downgradeState}.
      </span>
      <span className="freshness-boundary">{dataQuality.stopLine}</span>
      <span className={`freshness-boundary freshness-metadata-boundary ${metadataBoundary.state}`}>
        Metadata boundary: {metadataBoundary.state}; {metadataDisplayLabel}.
      </span>
      <span className="freshness-boundary">{metadataBoundary.allowedPublicClaim}</span>
      <span className="freshness-boundary">{metadataBoundary.stopLine}</span>
      <span className="freshness-boundary">
        Missing/delayed data and partial coverage should lower confidence. This page remains non-investment advice.
      </span>
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
