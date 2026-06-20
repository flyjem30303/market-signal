import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";

type DataFreshnessStripProps = {
  fallbackAsOfDate?: string;
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ fallbackAsOfDate, freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const isOfficialRuntime = marketSignalSourceStatus?.resolvedSource === "supabase";
  const sourceLabel = formatPublicSourceLabel(freshness.sourceName, isOfficialRuntime);
  const stateClass = isOfficialRuntime ? "complete" : freshness.state;
  const asOfDate = getDisplayDate(freshness.asOfDate, fallbackAsOfDate, isOfficialRuntime);

  return (
    <aside className={`freshness-strip ${stateClass}`} aria-label="資料更新與引用來源">
      <strong>更新日期：{asOfDate}</strong>
      <span>引用來源：{sourceLabel}</span>
      {!isOfficialRuntime && <span className="freshness-boundary">目前為示範資料，僅供閱讀流程參考。</span>}
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="方法說明"
        payload={{ area: "data_freshness_strip" }}
      >
        方法說明
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="風險提示"
        payload={{ area: "data_freshness_strip" }}
      >
        風險提示
      </TrackedLink>
    </aside>
  );
}

function formatPublicSourceLabel(sourceName: string | undefined, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return "示範資料";
  if (!sourceName || sourceName === "正式資料" || sourceName.toLowerCase().includes("supabase")) return "TWSE OpenAPI";
  return sourceName;
}

function getDisplayDate(freshnessDate: string, fallbackAsOfDate: string | undefined, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return freshnessDate;
  if (!fallbackAsOfDate) return freshnessDate || "資料更新中";
  if (!freshnessDate || freshnessDate === "示範資料") return fallbackAsOfDate;
  return fallbackAsOfDate > freshnessDate ? fallbackAsOfDate : freshnessDate;
}
