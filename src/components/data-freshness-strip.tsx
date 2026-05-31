import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";
import { TrackedLink } from "@/components/tracked-link";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const reachabilityLabel = freshness.isMock ? "模擬 metadata" : "Supabase metadata 可達";

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料狀態">
      <strong>{freshness.isMock ? "目前為模擬資料" : `資料狀態：${freshness.stateLabel}`}</strong>
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
          市場訊號：{marketSignalSourceStatus.resolvedSource} / requested {marketSignalSourceStatus.requestedSource} / reads{" "}
          {marketSignalSourceStatus.supabaseRuntimeReads}
        </span>
      )}
      <span className="freshness-boundary">Freshness metadata 不等於真實評分或資料品質核准</span>
      {marketSignalSourceStatus && <span className="freshness-boundary">{marketSignalSourceStatus.reason}</span>}
      <span className="freshness-description">{freshness.description}</span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="看方法論"
        payload={{ area: "data_freshness_strip" }}
      >
        看方法論
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="看免責聲明"
        payload={{ area: "data_freshness_strip" }}
      >
        看免責聲明
      </TrackedLink>
    </aside>
  );
}
