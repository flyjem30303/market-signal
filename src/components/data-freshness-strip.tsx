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
      <strong>資料狀態：{freshness.stateLabel}</strong>
      <span>資料來源：{sourceLabel}</span>
      <span>更新時間：{freshness.asOfDate}</span>
      <span>
        市場：{freshness.market} / {freshness.currency}
      </span>
      <span className={`freshness-score-source ${freshness.scoreSource}`}>分數來源：{scoreLabel}</span>
      <span className="freshness-boundary">
        目前公開版仍以示範資料呈現閱讀流程。正式資料、正式分數與投資解讀，必須等資料來源、覆蓋率與品質 gate 通過後才會啟用。
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
