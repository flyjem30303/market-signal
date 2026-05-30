import type { DataFreshnessSnapshot } from "@/lib/data-freshness";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
};

export function DataFreshnessStrip({ freshness }: DataFreshnessStripProps) {
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
      <span className="freshness-boundary">Freshness metadata 不等於真實評分或資料品質核准</span>
      <span className="freshness-description">{freshness.description}</span>
    </aside>
  );
}
