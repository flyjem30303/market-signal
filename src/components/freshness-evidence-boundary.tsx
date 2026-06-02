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
      <div className="freshness-readonly-candidate-card" aria-label="Freshness readonly attempt candidate preflight">
        <div>
          <span>Readonly candidate</span>
          <strong>{operationDecision.attemptCandidate.headline}</strong>
          <p>Preflight summary only. It cannot execute remote reads or change runtime source mode.</p>
        </div>
        {operationDecision.attemptCandidate.items.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="freshness-readonly-candidate-stop-line">{operationDecision.attemptCandidate.stopLine}</p>
      </div>
      <div className="freshness-route-summary" aria-label="Freshness runtime route choice summary">
        <div>
          <span>Route choice</span>
          <strong>{operationDecision.routeSummary.headline}</strong>
          <p>Default: {operationDecision.routeSummary.defaultRoute}</p>
        </div>
        {operationDecision.routeSummary.options.map((option) => (
          <article className={option.state} key={option.label}>
            <span>{option.label}</span>
            <strong>{option.value}</strong>
            <p>{option.body}</p>
          </article>
        ))}
        <p className="freshness-route-stop-line">{operationDecision.routeSummary.stopLine}</p>
      </div>
    </section>
  );
}
