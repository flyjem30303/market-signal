import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";

type DataFreshnessStripProps = {
  fallbackAsOfDate?: string;
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ fallbackAsOfDate, freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const isSupabaseRuntime = marketSignalSourceStatus?.resolvedSource === "supabase";
  const sourceLabel = formatPublicSourceLabel(freshness.sourceName, isSupabaseRuntime);
  const stateClass = isSupabaseRuntime ? "ready" : freshness.state;
  const asOfDate = isSupabaseRuntime && freshness.isMock ? fallbackAsOfDate ?? "正式資料日期待確認" : freshness.asOfDate;

  return (
    <aside className={`freshness-strip ${stateClass}`} aria-label="資料更新狀態">
      <strong>更新至：{asOfDate}</strong>
      <span>引用來源：{sourceLabel}</span>
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

function formatPublicSourceLabel(sourceName: string | undefined, isSupabaseRuntime: boolean) {
  if (!isSupabaseRuntime) return "示範資料";
  if (sourceName && sourceName !== "正式資料") return sourceName;
  return "TWSE OpenAPI";
}
