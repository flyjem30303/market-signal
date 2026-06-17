import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getDataQualityDowngradeSummary } from "@/lib/data-quality-downgrade";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const dataQuality = getDataQualityDowngradeSummary(freshness);
  const isSupabaseRuntime = marketSignalSourceStatus?.resolvedSource === "supabase";
  const isRealScore = marketSignalSourceStatus?.publicScoreSource === "real";
  const sourceLabel = isSupabaseRuntime ? "正式資料" : "示範資料";
  const scoreLabel = isRealScore ? "正式分數" : freshness.scoreSource === "mock" ? "示範分數" : freshness.scoreSourceLabel;
  const readonlyLabel = marketSignalSourceStatus?.supabaseRuntimeReads === "enabled" ? "已開啟" : "未開啟";
  const stateLabel = isSupabaseRuntime ? "Supabase 唯讀資料" : freshness.stateLabel;
  const stateClass = isSupabaseRuntime ? "ready" : freshness.state;
  const description = isSupabaseRuntime
    ? "正式資料模式使用 Supabase 唯讀資料；若資料缺漏或讀取失敗，前台會保守降級。"
    : freshness.description;
  const qualityLabel = isSupabaseRuntime ? "正式資料監控中" : dataQuality.displayLabel;
  const qualityReason = isSupabaseRuntime ? "資料來源、分數與更新時間已在前台揭露。" : dataQuality.reason;

  return (
    <aside className={`freshness-strip ${stateClass}`} aria-label="資料更新狀態">
      <strong>資料狀態：{stateLabel}</strong>
      <span>資料來源：{sourceLabel}</span>
      <span>更新日期：{freshness.asOfDate}</span>
      <span>
        市場：{freshness.market} / {freshness.currency}
      </span>
      <span className="freshness-description">{description}</span>
      <span className={`freshness-score-source ${isRealScore ? "real" : freshness.scoreSource}`}>
        分數來源：{scoreLabel}
      </span>
      <span>資料品質：{qualityLabel}</span>
      <span className="freshness-description">
        品質說明：{qualityLabel}，{qualityReason}
      </span>
      {marketSignalSourceStatus ? (
        <>
          <span className={`freshness-market-signal-source ${marketSignalSourceStatus.resolvedSource}`}>
            市場訊號來源：{sourceLabel}
          </span>
          <span>Supabase 唯讀：{readonlyLabel}</span>
          <span>分數狀態：{isRealScore ? "正式計算" : "示範分數"}</span>
          <span className="freshness-description">{marketSignalSourceStatus.reason}</span>
        </>
      ) : null}
      <span className="freshness-boundary">
        本站提供市場資訊整理與風險辨識，不提供個別買賣建議；正式資料若缺漏或過期，前台會保守降級顯示。
      </span>
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
