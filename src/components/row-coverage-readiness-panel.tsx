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
  const remoteAttemptText = rowCoverage.latestAttempt.remoteAttempted ? "已做過一次唯讀檢查" : "尚未做遠端檢查";

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{rowCoverage.headline}</h2>
        <p>{summary}</p>
      </div>
      <article className="readying">
        <span>目前狀態</span>
        <strong>{rowCoverage.readiness}</strong>
        <p>{rowCoverage.nextDecision}</p>
      </article>
      <article className="readying">
        <span>授權判斷</span>
        <strong>需要 CEO 另行命名一次唯讀檢查</strong>
        <p>{rowCoverage.goNoGo.decisionRequired}</p>
        <p>可前進條件：{rowCoverage.goNoGo.go.join("; ")}</p>
        <p>不可前進邊界：{rowCoverage.goNoGo.noGo.join("; ")}</p>
      </article>
      <article className="readying">
        <span>本地指令地圖</span>
        <strong>{rowCoverage.commandMap.packageCommand}</strong>
        <p>授權代碼：{rowCoverage.commandMap.approvalToken}</p>
        <code>{rowCoverage.commandMap.powershellCommand}</code>
        <p>{rowCoverage.commandMap.postRunReview}</p>
      </article>
      <article className="blocked">
        <span>最新覆蓋觀察</span>
        <strong>{rowCoverage.latestAttempt.reason}</strong>
        <p>
          目前觀察 {rowCoverage.latestAttempt.observedTotalRows} / 目標 {rowCoverage.latestAttempt.expectedTotalRows}
          ，仍缺 {rowCoverage.latestAttempt.missingRows} 筆。
        </p>
        <p>
          遠端檢查：{remoteAttemptText}；覆蓋狀態 {rowCoverage.latestAttempt.coverageStatus}。
        </p>
      </article>
      <article className="blocked">
        <span>來源與分數邊界</span>
        <strong>
          {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}
        </strong>
        <p>{rowCoverage.stopLine}</p>
      </article>
      <article className="blocked">
        <span>未決事項</span>
        <strong>
          {rowCoverage.unresolved.length} {openItemSuffix}
        </strong>
        <p>{rowCoverage.unresolved[0]}</p>
      </article>
    </section>
  );
}
