import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export function RuntimeReadinessPanel() {
  const readiness = getRuntimeReadinessSummary();

  return (
    <section className={`runtime-readiness-panel ${readiness.status}`} aria-label="Runtime readiness">
      <div className="runtime-readiness-summary">
        <p className="eyebrow">Runtime Readiness</p>
        <h2>{readiness.headline}</h2>
        <p>{readiness.nextDecision}</p>
      </div>
      <div className="runtime-readiness-score" aria-label={`Runtime readiness ${readiness.score}%`}>
        <span style={{ ["--progress" as string]: `${readiness.score}%` }} />
        <b>{readiness.score}%</b>
        <small>bounded readiness</small>
      </div>
      <div className="runtime-readiness-command">
        <article>
          <span>Local preflight</span>
          <code>{readiness.localPreflightCommand}</code>
          <p>{readiness.localPreflightState}</p>
        </article>
        <article>
          <span>Next guarded decision</span>
          <code>{readiness.nextRemoteCommand}</code>
          <p>只有 CEO 開 gate 後才可執行；目前不在自動 review gate 內執行。</p>
        </article>
      </div>
      <div className="runtime-readiness-lanes">
        {readiness.lanes.map((lane) => (
          <article className={lane.state} key={lane.label}>
            <header>
              <span>{lane.owner}</span>
              <b>{lane.current}%</b>
            </header>
            <strong>{lane.label}</strong>
            <i style={{ ["--progress" as string]: `${lane.current}%` }} />
            <p>{lane.nextAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
