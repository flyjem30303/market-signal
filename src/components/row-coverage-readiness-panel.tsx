import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";

type RowCoverageReadinessPanelProps = {
  ariaLabel: string;
  className: string;
  eyebrow: string;
  openItemSuffix: string;
  summary: string;
};

export function RowCoverageReadinessPanel({
  ariaLabel,
  className,
  eyebrow,
  openItemSuffix,
  summary
}: RowCoverageReadinessPanelProps) {
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const latestAttemptText = rowCoverage.latestAttempt.remoteAttempted
    ? "已完成一次限定範圍的唯讀檢查"
    : "尚未進行外部資料檢查";

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{rowCoverage.headline}</h2>
        <p>{summary}</p>
      </div>
      <article className="readying">
        <span>目前狀態</span>
        <strong>本頁仍使用示範資料</strong>
        <p>{rowCoverage.nextDecision}</p>
      </article>
      <article className="readying">
        <span>下一步條件</span>
        <strong>先補齊缺口，再評估資料升級</strong>
        <p>{rowCoverage.goNoGo.decisionRequired}</p>
        <p>可前進條件：{rowCoverage.goNoGo.go.join("；")}</p>
        <p>不可前進邊界：{rowCoverage.goNoGo.noGo.join("；")}</p>
      </article>
      <article className="blocked">
        <span>覆蓋率缺口</span>
        <strong>{rowCoverage.latestAttempt.reason}</strong>
        <p>
          目前可驗證 {rowCoverage.latestAttempt.observedTotalRows} / 目標{" "}
          {rowCoverage.latestAttempt.expectedTotalRows} 筆，尚缺 {rowCoverage.latestAttempt.missingRows} 筆。
        </p>
        <p>
          {latestAttemptText}，結果狀態：{rowCoverage.latestAttempt.coverageStatus}
        </p>
      </article>
      <article className="blocked">
        <span>資料邊界</span>
        <strong>
          {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}
        </strong>
        <p>{rowCoverage.stopLine}</p>
      </article>
      <article className="blocked">
        <span>待補項目</span>
        <strong>
          {rowCoverage.unresolved.length} {openItemSuffix}
        </strong>
        <p>{rowCoverage.unresolved[0]}</p>
      </article>
    </section>
  );
}
