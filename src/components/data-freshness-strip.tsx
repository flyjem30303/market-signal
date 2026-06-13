import { TrackedLink } from "@/components/tracked-link";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

type DataFreshnessStripProps = {
  freshness: DataFreshnessSnapshot;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

export function DataFreshnessStrip({ freshness, marketSignalSourceStatus }: DataFreshnessStripProps) {
  const scoreLabel = freshness.scoreSource === "mock" ? "示範分數" : freshness.scoreSourceLabel;
  const sourceLabel =
    marketSignalSourceStatus?.resolvedSource === "mock" || freshness.isMock ? "示範資料" : freshness.sourceName;

  return (
    <aside className={`freshness-strip ${freshness.state}`} aria-label="資料更新狀態">
      <strong>資料狀態：{sourceLabel}</strong>
      <span>資料日期：{freshness.asOfDate}</span>
      <span>
        市場：{freshness.market} / {freshness.currency}
      </span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>分數來源：{scoreLabel}</span>
      <span className="freshness-boundary">
        目前燈號用於產品示範與閱讀流程驗證；正式資料、完整授權與真實分數尚未啟用，不構成投資建議。
      </span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="查看方法說明"
        payload={{ area: "data_freshness_strip" }}
      >
        查看方法說明
      </TrackedLink>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/disclaimer"
        label="查看風險聲明"
        payload={{ area: "data_freshness_strip" }}
      >
        查看風險聲明
      </TrackedLink>
    </aside>
  );
}
