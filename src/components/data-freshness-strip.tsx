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
  const asOfDate = getDisplayDate(freshness.asOfDate, fallbackAsOfDate, isSupabaseRuntime);

  return (
    <aside className={`freshness-strip ${stateClass}`} aria-label="資料更新狀態">
      <strong>更新至: {asOfDate}</strong>
      <span>引用來源: {sourceLabel}</span>
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
        label="查看風險聲明"
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

function getDisplayDate(freshnessDate: string, fallbackAsOfDate: string | undefined, isSupabaseRuntime: boolean) {
  if (!isSupabaseRuntime) return freshnessDate;
  if (!fallbackAsOfDate) return freshnessDate || "正式資料日期待確認";
  if (!freshnessDate || freshnessDate === "示範資料") return fallbackAsOfDate;
  return fallbackAsOfDate > freshnessDate ? fallbackAsOfDate : freshnessDate;
}
