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

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{rowCoverage.headline}</h2>
        <p>{summary}</p>
      </div>
      <article className="readying">
        <span>Gate state</span>
        <strong>{rowCoverage.readiness}</strong>
        <p>{rowCoverage.nextDecision}</p>
      </article>
      <article className="readying">
        <span>Go / no-go</span>
        <strong>one bounded readonly attempt</strong>
        <p>{rowCoverage.goNoGo.decisionRequired}</p>
        <p>Go: {rowCoverage.goNoGo.go.join("; ")}</p>
        <p>No-go: {rowCoverage.goNoGo.noGo.join("; ")}</p>
      </article>
      <article className="blocked">
        <span>Public state</span>
        <strong>
          {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}
        </strong>
        <p>{rowCoverage.stopLine}</p>
      </article>
      <article className="blocked">
        <span>Open item</span>
        <strong>
          {rowCoverage.unresolved.length} {openItemSuffix}
        </strong>
        <p>{rowCoverage.unresolved[0]}</p>
      </article>
    </section>
  );
}
