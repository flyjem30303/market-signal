import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";

export function BlockerReadinessPanel() {
  const summary = getBlockerReadinessSummary();

  return (
    <section className="blocker-readiness-panel" aria-label="Blocker readiness">
      <div className="blocker-readiness-summary">
        <p className="eyebrow">Blocker Readiness</p>
        <h2>{summary.headline}</h2>
        <p>{summary.ceoRecommendation}</p>
        <strong>{summary.stopLine}</strong>
      </div>
      <aside className="blocker-readiness-state">
        <span>Status</span>
        <b>{summary.status}</b>
        <small>
          source: {summary.publicDataSource} / score: {summary.scoreSource}
        </small>
      </aside>
      <div className="blocker-priority-strip" aria-label="Blocker priority order">
        <article>
          <span>First move</span>
          <strong>
            {summary.firstMove.owner}: {summary.firstMove.id}
          </strong>
          <p>{summary.firstMove.reason}</p>
          <code>{summary.firstMove.command}</code>
        </article>
        {summary.parallelMoves.map((move) => (
          <article key={move.id}>
            <span>Parallel move</span>
            <strong>
              {move.owner}: {move.id}
            </strong>
            <p>{move.targetSections.join(", ")}</p>
            <code>{move.command}</code>
          </article>
        ))}
      </div>
      <div className="blocker-readiness-grid">
        {summary.lanes.map((lane) => (
          <article key={lane.blockerId}>
            <header>
              <span>{lane.owner}</span>
              <b>{lane.weight}%</b>
            </header>
            <strong>{lane.label}</strong>
            <em>{lane.localReviewState}</em>
            <p>{lane.approvedScope}</p>
            <p>{lane.remainingDecision}</p>
            <p>{lane.nextAction}</p>
            <code>{lane.checklistCommand}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
