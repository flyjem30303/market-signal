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
  const observed = rowCoverage.latestAttempt.observedTotalRows;
  const expected = rowCoverage.latestAttempt.expectedTotalRows;
  const missing = rowCoverage.latestAttempt.missingRows;

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>資料覆蓋率仍在補齊</h2>
        <p>{summary}</p>
      </div>
      <article className="readying">
        <span>目前狀態</span>
        <strong>公開頁維持示範資料</strong>
        <p>正式資料尚未啟用，避免使用者把示範分數誤認為正式市場訊號。</p>
      </article>
      <article className="readying">
        <span>可前進條件</span>
        <strong>來源、欄位、覆蓋率與回退流程都需清楚</strong>
        <p>資料上線前必須留下可追溯結果，並能在資料不足時清楚提示使用者。</p>
      </article>
      <article className="blocked">
        <span>覆蓋率缺口</span>
        <strong>
          已觀察 {observed} / {expected} 筆
        </strong>
        <p>目前尚缺 {missing} 筆，仍不可宣稱完整市場覆蓋。</p>
      </article>
      <article className="blocked">
        <span>資料邊界</span>
        <strong>示範資料 / 示範分數</strong>
        <p>正式資料與正式分數會在通過來源、品質、覆蓋與公開說明後才啟用。</p>
      </article>
      <article className="blocked">
        <span>待補項目</span>
        <strong>
          {rowCoverage.unresolved.length} {openItemSuffix}
        </strong>
        <p>{rowCoverage.unresolved[0] ?? "仍需確認資料來源、欄位與覆蓋率。"}</p>
      </article>
    </section>
  );
}
