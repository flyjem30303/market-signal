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
      <div className="blocker-readiness-grid">
        {summary.lanes.map((lane) => (
          <article key={lane.blockerId}>
            <header>
              <span>{lane.owner}</span>
              <b>{lane.weight}%</b>
            </header>
            <strong>{lane.label}</strong>
            <p>{lane.nextAction}</p>
            <code>{lane.checklistCommand}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
