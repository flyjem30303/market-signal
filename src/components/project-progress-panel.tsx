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
        <section className="project-progress-design-gate">
          <span>{progress.dataCoverageRouteDecision.designGate.gateStatus}</span>
          <strong>{progress.dataCoverageRouteDecision.designGate.title}</strong>
          <p>
            Target {progress.dataCoverageRouteDecision.designGate.targetRelation}; missing rows{" "}
            {progress.dataCoverageRouteDecision.designGate.missingRows}; public source{" "}
            {progress.dataCoverageRouteDecision.designGate.publicDataSource}; score source{" "}
            {progress.dataCoverageRouteDecision.designGate.scoreSource}.
          </p>
          <div>
            {progress.dataCoverageRouteDecision.designGate.requirements.map((requirement) => (
              <article key={requirement.id}>
                <span>{requirement.owner}</span>
                <strong>{requirement.id}</strong>
                <p>{requirement.requirement}</p>
              </article>
            ))}
          </div>
          <p>{progress.dataCoverageRouteDecision.designGate.stopLine}</p>
        </section>
        <section className="project-progress-backfill-plan">
          <span>{progress.dataCoverageRouteDecision.backfillPlan.status}</span>
          <strong>Source lanes before row coverage can move</strong>
          <p>
            Observed {progress.dataCoverageRouteDecision.backfillPlan.observedRows} / expected{" "}
            {progress.dataCoverageRouteDecision.backfillPlan.expectedRows}; missing{" "}
            {progress.dataCoverageRouteDecision.backfillPlan.missingRows}; public source{" "}
            {progress.dataCoverageRouteDecision.backfillPlan.publicDataSource}; score source{" "}
            {progress.dataCoverageRouteDecision.backfillPlan.scoreSource}.
          </p>
          <div>
            {progress.dataCoverageRouteDecision.backfillPlan.lanes.map((lane) => (
              <article key={lane.id}>
                <span>{lane.owner}</span>
                <strong>{lane.coverageTarget}</strong>
                <p>
                  {lane.symbols.join(", ")} / {lane.readiness}
                </p>
                <p>{lane.reportOnlyNextStep}</p>
              </article>
            ))}
          </div>
          <p>{progress.dataCoverageRouteDecision.backfillPlan.stopLine}</p>
        </section>
        <section className="project-progress-source-readiness">
          <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.status}</span>
          <strong>
            Source readiness priority: {progress.dataCoverageRouteDecision.sourceReadinessPacket.priorityOrder.join(" -> ")}
          </strong>
          <p>
            Public source {progress.dataCoverageRouteDecision.sourceReadinessPacket.publicDataSource}; score source{" "}
            {progress.dataCoverageRouteDecision.sourceReadinessPacket.scoreSource}.
          </p>
          <div>
            {progress.dataCoverageRouteDecision.sourceReadinessPacket.lanes.map((lane) => (
              <article key={lane.id}>
                <span>
                  {lane.owner} / {lane.status}
                </span>
                <strong>
                  {lane.lane}: {lane.symbols.join(", ")}
                </strong>
                <p>{lane.decisionNeeded}</p>
                <p>{lane.nextSafeAction}</p>
              </article>
            ))}
          </div>
          <section className="project-progress-twii-source-selection">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.status}</span>
            <strong>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.targetSymbol} source
              selection / {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.priority}
            </strong>
            <p>
              Observed rows{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.observedRows}; public
              source {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.publicDataSource};
              score source {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.candidates.map(
                (candidate) => (
                  <article key={candidate.id}>
                    <span>{candidate.status}</span>
                    <strong>{candidate.label}</strong>
                    <p>{candidate.requiredReview.join(", ")}</p>
                  </article>
                )
              )}
            </div>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.nextSafeAction}</p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.stopLine}</p>
          </section>
          <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.stopLine}</p>
        </section>
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
