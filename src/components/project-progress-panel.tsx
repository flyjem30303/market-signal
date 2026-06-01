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
          Completed evidence: {progress.dataQualityEvidenceGate.completedEvidence.length}. Missing evidence:{" "}
          {progress.dataQualityEvidenceGate.missingEvidence.length}. scoreSource{" "}
          {progress.dataQualityEvidenceGate.scoreSource}; public source{" "}
          {progress.dataQualityEvidenceGate.publicDataSource}.
        </p>
        <p>Evidence progress: {progress.dataQualityEvidenceGate.evidenceProgressPercent}%.</p>
        <p>
          Quality score contract: {progress.dataQualityScoreContract.score}/
          {progress.dataQualityScoreContract.passThreshold}; next {progress.dataQualityScoreContract.nextLift}
        </p>
        <p>
          Row coverage: {progress.dataQualityScoreContract.rowCoverage.status}; missing requirements{" "}
          {progress.dataQualityScoreContract.rowCoverage.requirements.filter((item) => item.state === "missing").length};
          universe {progress.dataQualityScoreContract.rowCoverage.universePolicy.symbols.length} local-only symbols; window{" "}
          {progress.dataQualityScoreContract.rowCoverage.coverageWindowPolicy.requiredTradingSessions} trading sessions; expected{" "}
          {progress.dataQualityScoreContract.rowCoverage.expectedRowPolicy.expectedTotalRows} rows; tolerance{" "}
          {progress.dataQualityScoreContract.rowCoverage.missingRowTolerancePolicy.maxMissingRowsForCoverage} missing rows; calendar{" "}
          {progress.dataQualityScoreContract.rowCoverage.marketCalendarPolicy.calendarScope}.
        </p>
        <ul>
          {progress.dataQualityEvidenceGate.missingActions.slice(0, 4).map((action) => (
            <li key={action.code}>
              <b>{action.owner}</b> / {action.gate}: {action.nextAction}
            </li>
          ))}
        </ul>
        <p>{progress.dataQualityEvidenceGate.stopLine}</p>
      </div>
      <div
        className="project-progress-route-decision"
        aria-label={`Data coverage route decision ${progress.dataCoverageRouteDecision.status}`}
      >
        <span>Data coverage route</span>
        <strong>{progress.dataCoverageRouteDecision.recommendation}</strong>
        <p>
          Latest readonly result: {progress.dataCoverageRouteDecision.blockedReason}; observed{" "}
          {progress.dataCoverageRouteDecision.observedRows} / expected {progress.dataCoverageRouteDecision.expectedRows};
          missing {progress.dataCoverageRouteDecision.missingRows}.
        </p>
        <div>
          {progress.dataCoverageRouteDecision.options.map((option) => (
            <article className={option.priority} key={option.id}>
              <span>{option.owner}</span>
              <strong>{option.label}</strong>
              <p>{option.rationale}</p>
              <p>{option.nextAction}</p>
            </article>
          ))}
        </div>
        <p>{progress.dataCoverageRouteDecision.stopLine}</p>
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
