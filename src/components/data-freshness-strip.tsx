import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getDataQualityDowngradeSummary } from "@/lib/data-quality-downgrade";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";

type DataFreshnessStripProps = {
  fallbackAsOfDate?: string;
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ fallbackAsOfDate, freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const isSupabaseRuntime = marketSignalSourceStatus?.resolvedSource === "supabase";
  const isRealScore = marketSignalSourceStatus?.publicScoreSource === "real";
  const sourceLabel = isSupabaseRuntime ? "正式資料" : "示範資料";
  const scoreLabel = isRealScore ? "正式分數" : freshness.scoreSource === "mock" ? "示範分數" : freshness.scoreSourceLabel;
  const stateLabel = isSupabaseRuntime ? "資料已連線" : freshness.stateLabel;
  const stateClass = isSupabaseRuntime ? "ready" : freshness.state;
  const asOfDate = isSupabaseRuntime && freshness.isMock ? fallbackAsOfDate ?? "正式資料日期待確認" : freshness.asOfDate;
  const fallbackSummary = getDataQualityDowngradeSummary(freshness);
  const statusNote = isSupabaseRuntime ? "非即時行情，僅供市場觀察" : fallbackSummary.stopLine;

  return (
    <aside className={`freshness-strip ${stateClass}`} aria-label="資料更新狀態">
      <strong>資料狀態：{stateLabel}</strong>
      <span>來源：{sourceLabel}</span>
      <span>更新：{asOfDate}</span>
      <span>Supabase 唯讀：{marketSignalSourceStatus?.supabaseRuntimeReads === "enabled" ? "已開啟" : "未開啟"}</span>
      <span>分數狀態：{scoreLabel}</span>
      <span className="freshness-description">{statusNote}</span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="前往方法說明"
        payload={{ area: "data_freshness_strip" }}
      >
        方法說明
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="前往風險聲明"
        payload={{ area: "data_freshness_strip" }}
      >
        風險聲明
      </TrackedLink>
    </aside>
  );
}
