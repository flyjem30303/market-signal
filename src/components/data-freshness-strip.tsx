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
      <strong>資料可信度：{freshness.stateLabel}</strong>
      <span>資料來源：{sourceLabel}</span>
      <span>資料更新時間：{freshness.asOfDate}</span>
      <span>
        市場：{freshness.market} / {freshness.currency}
      </span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>燈號分數：{scoreLabel}</span>
      <span className="freshness-boundary">
        資料限制：目前公開頁仍以示範資料說明閱讀流程，正式資料通過來源、覆蓋率與品質檢查前，不宣稱即時真實資料。
      </span>
      <TrackedLink
        className="freshness-link"
        eventName="trust_link_clicked"
        href="/methodology"
        label="查看燈號方法"
        payload={{ area: "data_freshness_strip" }}
      >
        燈號方法
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
