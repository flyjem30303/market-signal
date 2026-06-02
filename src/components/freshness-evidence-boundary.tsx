import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";
import { getFreshnessRuntimeOperationDecisionSummary } from "@/lib/freshness-runtime-operation-decision";

type FreshnessEvidenceBoundaryProps = {
  freshness: DataFreshnessSnapshot;
};

export function FreshnessEvidenceBoundary({ freshness }: FreshnessEvidenceBoundaryProps) {
  const boundary = getFreshnessEvidenceBoundarySummary(freshness);
  const operationDecision = getFreshnessRuntimeOperationDecisionSummary(freshness);

  return (
    <section className="freshness-evidence-boundary" aria-label="Freshness evidence boundary">
      <div>
        <span>Evidence boundary</span>
        <strong>{boundary.headline}</strong>
        <p>{boundary.summary}</p>
      </div>
      {boundary.items.map((item) => (
        <article className={item.tone} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.body}</p>
        </article>
      ))}
      <p className="freshness-evidence-stop-line">{boundary.stopLine}</p>
      <div className="freshness-operation-decision" aria-label="Freshness runtime operation decision">
        <div>
          <span>Operation decision</span>
          <strong>{operationDecision.headline}</strong>
          <p>{operationDecision.nextAction}</p>
        </div>
        {operationDecision.decisions.map((decision) => (
          <article className={decision.state} key={decision.label}>
            <span>{decision.label}</span>
            <strong>{decision.value}</strong>
            <p>{decision.body}</p>
          </article>
        ))}
        <p className="freshness-operation-stop-line">{operationDecision.stopLine}</p>
      </div>
    </section>
  );
}
