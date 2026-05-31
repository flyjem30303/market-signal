import { getProjectProgressSummary } from "@/lib/project-progress-score";

export function ProjectProgressPanel() {
  const progress = getProjectProgressSummary();

  return (
    <section className="project-progress-panel" aria-label="PM project progress score">
      <div className="project-progress-summary">
        <p className="eyebrow">PM Progress Score</p>
        <h2>{progress.headline}</h2>
        <p>{progress.stage}</p>
        <strong>{progress.nextLift}</strong>
      </div>
      <div className="project-progress-meter" aria-label={`Project progress ${progress.adjustedScore}%`}>
        <span style={{ ["--progress" as string]: `${progress.adjustedScore}%` }} />
        <b>{progress.adjustedScore}%</b>
        <small>raw {progress.rawScore}%</small>
      </div>
      <div
        className={`project-progress-evidence ${progress.dataQualityEvidenceGate.status}`}
        aria-label={`Data quality evidence gate ${progress.dataQualityEvidenceGate.status}`}
      >
        <span>Data quality evidence gate</span>
        <strong>{progress.dataQualityEvidenceGate.status}</strong>
        <p>
          Missing evidence: {progress.dataQualityEvidenceGate.missingEvidence.length}. scoreSource{" "}
          {progress.dataQualityEvidenceGate.scoreSource}; public source{" "}
          {progress.dataQualityEvidenceGate.publicDataSource}.
        </p>
        <p>{progress.dataQualityEvidenceGate.stopLine}</p>
      </div>
      <div className="project-progress-lanes">
        {progress.lanes.map((lane) => (
          <article key={lane.label}>
            <div>
              <span>{lane.owner}</span>
              <strong>{lane.label}</strong>
            </div>
            <i style={{ ["--progress" as string]: `${lane.current}%` }} />
            <footer>
              <b>{lane.current}%</b>
              <small>weight {lane.weight}%</small>
            </footer>
            <p>{lane.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
