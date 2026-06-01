import { getNarrowApprovalOutcomeLedger } from "@/lib/narrow-approval-outcome-ledger";

const outcomeLabels = {
  accepted: "Accepted",
  pending: "Pending",
  rejected: "Rejected"
} as const;

export function NarrowApprovalOutcomePanel() {
  const ledger = getNarrowApprovalOutcomeLedger();

  return (
    <section className="narrow-approval-outcome-panel" aria-label="Narrow approval outcomes">
      <div className="narrow-approval-outcome-summary">
        <p className="eyebrow">Narrow Approval</p>
        <h2>Legal / Investment oral outcomes are explicit gates</h2>
        <p>{ledger.nextAllowedDecision}</p>
        <strong>
          Current state: {ledger.status}. Public data and score sources remain {ledger.safety.publicDataSource} /{" "}
          {ledger.safety.scoreSource}.
        </strong>
      </div>
      <aside className={ledger.allRequiredOutcomesAccepted ? "ready" : "pending"}>
        <span>Readonly attempt gate</span>
        <b>{ledger.allRequiredOutcomesAccepted ? "eligible for separate CEO decision" : "paused"}</b>
        <small>SQL, writes, ingestion, and scoreSource=real remain blocked.</small>
      </aside>
      <div className="narrow-approval-outcome-grid">
        {ledger.outcomes.map((item) => (
          <article className={item.outcome} key={item.id}>
            <header>
              <span>{item.owner}</span>
              <b>{outcomeLabels[item.outcome]}</b>
            </header>
            <strong>{item.id}</strong>
            <p>{item.decisionNote}</p>
            <small>
              If accepted: {item.acceptedMeaning} Still not authorized: {item.stillDoesNotAuthorize.join(", ")}.
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
