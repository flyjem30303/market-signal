import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export function SourceDepthBlockerPanel() {
  const summary = getSourceDepthBlockerSummary();

  return (
    <section className="source-depth-blocker-panel" aria-label="來源深度阻塞摘要">
      <div className="source-depth-blocker-summary">
        <p className="eyebrow">Source Depth</p>
        <h2>{summary.headline}</h2>
        <p>{summary.nextAction}</p>
        <strong>{summary.stopLine}</strong>
      </div>
      <div className="source-depth-blocker-state">
        <span>Source depth</span>
        <b>{summary.sourceDepthState}</b>
        <small>scoreSource: {summary.scoreSource}</small>
      </div>
      <div className="source-depth-blocker-grid">
        {summary.blockers.map((blocker) => (
          <article className={blocker.state} key={blocker.id}>
            <span>{blocker.owner}</span>
            <strong>{blocker.label}</strong>
            <p>{blocker.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
