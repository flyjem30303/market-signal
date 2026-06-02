import { getProjectProgressSummary } from "@/lib/project-progress-score";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export function ProjectProgressPanel() {
  const progress = getProjectProgressSummary();
  const runtime = getRuntimeReadinessSummary();
  const runtimeGate = getRuntimeGateDecisionBrief();

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
      <div className="project-progress-runtime-strip" aria-label="CEO PM runtime progress alignment">
        <article>
          <span>Runtime</span>
          <strong>
            {runtime.score}% / {runtime.status}
          </strong>
          <p>{runtime.nextDecision}</p>
        </article>
        <article className="active">
          <span>Default route</span>
          <strong>{runtimeGate.currentDefaultRoute}</strong>
          <p>{runtimeGate.ceoRecommendation}</p>
        </article>
        <article className="hold">
          <span>Remote trigger</span>
          <strong>{runtimeGate.separateRemoteTrigger}</strong>
          <p>{runtimeGate.requiredAuthorization}</p>
        </article>
        <article className="blocked">
          <span>Source boundary</span>
          <strong>
            {runtimeGate.publicDataSource} / {runtimeGate.scoreSource}
          </strong>
          <p>{runtimeGate.blockedNow.slice(0, 4).join(", ")} remain blocked.</p>
        </article>
        <article className="blocked">
          <span>Network blocker</span>
          <strong>{progress.networkBlocker.status}</strong>
          <p>{progress.networkBlocker.currentFinding}</p>
        </article>
      </div>
      <div
        className={`project-progress-network-blocker ${progress.networkBlocker.status}`}
        aria-label={`Supabase network blocker ${progress.networkBlocker.status}`}
      >
        <span>Supabase readonly blocker</span>
        <strong>{progress.networkBlocker.currentFinding}</strong>
        <p>{progress.networkBlocker.impact}</p>
        <p>{progress.networkBlocker.nextAction}</p>
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
      <details
        className="project-progress-route-decision"
        aria-label={`Data coverage route decision ${progress.dataCoverageRouteDecision.status}`}
      >
        <summary>Data coverage route / source readiness details</summary>
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
          <section className="project-progress-etf-rights-review">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.status}</span>
            <strong>
              ETF rights review /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.blocker}
            </strong>
            <p>
              Symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.targetSymbols.join(
                ", "
              )}; public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.publicDataSource};
              score source {progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.candidates.map(
                (candidate) => (
                  <article key={candidate.id}>
                    <span>{candidate.status}</span>
                    <strong>{candidate.label}</strong>
                    <p>{candidate.requiredReview.join(", ")}</p>
                  </article>
                )
              )}
            </div>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.nextSafeAction}</p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.stopLine}</p>
          </section>
          <section className="project-progress-equity-dry-run">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.status}</span>
            <strong>
              Equity dry-run packet /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.sourceId}
            </strong>
            <p>
              Symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.targetSymbols.join(
                ", "
              )}; public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.publicDataSource};
              score source {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.requirements.map(
                (requirement) => (
                  <article key={requirement.id}>
                    <span>{requirement.status}</span>
                    <strong>{requirement.id}</strong>
                    <p>{requirement.requirement}</p>
                  </article>
                )
              )}
            </div>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.nextSafeAction}</p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.stopLine}</p>
          </section>
          <section className="project-progress-equity-dry-run-packet">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.status}</span>
            <strong>
              Equity report-only packet /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.sourceId}
            </strong>
            <p>
              Symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.targetSymbols.join(
                ", "
              )}; window{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.firstApprovedWindow.startMonth}
              {" -> "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.firstApprovedWindow.endMonth}
              ; public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.publicDataSource};
              score source {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.sections.map(
                (section) => (
                  <article key={section.id}>
                    <span>{section.owner}</span>
                    <strong>{section.id}</strong>
                    <p>{section.summary}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Allowed:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.allowedOutput.join(
                ", "
              )}
            </p>
            <p>
              Forbidden:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.forbiddenOutput.join(
                ", "
              )}
            </p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.nextSafeAction}</p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.stopLine}</p>
          </section>
          <section className="project-progress-equity-role-review">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.status}</span>
            <strong>
              Equity role review /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.nextDecision}
            </strong>
            <p>
              Packet{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.packetStatus}; public
              source {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.publicDataSource};
              score source {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.reviews.map(
                (review) => (
                  <article key={review.role}>
                    <span>{review.status}</span>
                    <strong>{review.role}</strong>
                    <p>{review.finding}</p>
                    <p>{review.requiredBeforeExecution}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Execution blockers:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.executionBlockers.join(
                ", "
              )}
            </p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.stopLine}</p>
          </section>
          <section className="project-progress-equity-runner-approval">
            <span>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.status}
            </span>
            <strong>
              Runner approval /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.approvalState}
            </strong>
            <p>
              Request{" "}
              {
                progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate
                  .requestedNextMove
              }
              ; source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.scope.sourceId};
              mode{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.scope.runMode};
              symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.scope.targetSymbols.join(
                ", "
              )}
              .
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.requirements.map(
                (requirement) => (
                  <article key={requirement.id}>
                    <span>{requirement.owner}</span>
                    <strong>{requirement.id}</strong>
                    <p>{requirement.requirement}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Forbidden until approved:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.forbiddenUntilApproved.join(
                ", "
              )}
            </p>
            <p>
              Public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.publicDataSource};
              score source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.scoreSource}.
            </p>
            <p>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.stopLine}
            </p>
          </section>
          <section className="project-progress-runner-decision-request">
            <span>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.status}
            </span>
            <strong>
              Runner decision /{" "}
              {
                progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary
                  .currentRecommendation
              }
            </strong>
            <p>
              Question{" "}
              {
                progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary
                  .decisionQuestion
              }
              ; approval{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.approvalState};
              chair review{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary
                .chairReviewRequired
                ? "required"
                : "not required"}
              .
            </p>
            <p>
              Scope{" "}
              {
                progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.requestedScope
                  .sourceId
              }
              ; mode{" "}
              {
                progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.requestedScope
                  .runMode
              }
              ; symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.requestedScope.targetSymbols.join(
                ", "
              )}
              .
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.options.map(
                (option) => (
                  <article className={option.recommendation} key={option.id}>
                    <span>{option.recommendation}</span>
                    <strong>{option.id}</strong>
                    <p>{option.outcome}</p>
                    <p>{option.risk}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.publicDataSource};
              score source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.scoreSource}.
            </p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.stopLine}</p>
          </section>
          <section className="project-progress-runner-outcome-ledger">
            <span>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.status}
            </span>
            <strong>
              Runner approval outcome /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.mode}
            </strong>
            <p>
              Implementation approved{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger
                .implementationApproved
                ? "yes"
                : "no"}
              ; public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.safety
                .publicDataSource}
              ; score source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.safety
                .scoreSource}
              .
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.outcomes.map(
                (outcome) => (
                  <article className={outcome.outcome} key={outcome.id}>
                    <span>
                      {outcome.owner} / {outcome.recordedBy}
                    </span>
                    <strong>{outcome.outcome}</strong>
                    <p>{outcome.decisionNote}</p>
                    <p>{outcome.acceptedMeaning}</p>
                    <p>{outcome.rejectedMeaning}</p>
                    <p>{outcome.deferredMeaning}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Next decision{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.nextAllowedDecision}
            </p>
            <p>
              Still blocked:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.stillBlocked.join(
                ", "
              )}
            </p>
          </section>
          <section className="project-progress-runner-execution-gate">
            <span>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.status}
            </span>
            <strong>
              Execution gate /{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.approvalState}
            </strong>
            <p>
              Question{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.executionQuestion};
              attempts{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.attemptLimit};
              source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.sourceId};
              symbols{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.targetSymbols.join(
                ", "
              )}
              .
            </p>
            <p>
              Confirmation{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.confirmationEnv}
              ={
                progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate
                  .confirmationValue
              }
            </p>
            <p>
              Command{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.exactCommand}
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.prechecks.map(
                (precheck) => (
                  <article key={precheck.id}>
                    <span>{precheck.id}</span>
                    <strong>{precheck.command}</strong>
                    <p>Required before execution: {precheck.requiredBeforeExecution ? "yes" : "no"}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Forbidden until approved:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.forbiddenUntilApproved.join(
                ", "
              )}
            </p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerExecutionApprovalGate.stopLine}</p>
          </section>
          <section className="project-progress-source-checkpoint">
            <span>{progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.status}</span>
            <strong>
              CEO next move:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.primaryNextMove}
            </strong>
            <p>
              Public source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.publicDataSource};
              score source{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.scoreSource}.
            </p>
            <div>
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.lanes.map(
                (lane) => (
                  <article key={lane.lane}>
                    <span>{lane.status}</span>
                    <strong>{lane.lane}</strong>
                    <p>{lane.ceoDecision}</p>
                    <p>{lane.pmAction}</p>
                  </article>
                )
              )}
            </div>
            <p>
              Blocked execution:{" "}
              {progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.blockedFromExecution.join(
                ", "
              )}
            </p>
            <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.stopLine}</p>
          </section>
          <p>{progress.dataCoverageRouteDecision.sourceReadinessPacket.stopLine}</p>
        </section>
        <p>{progress.dataCoverageRouteDecision.stopLine}</p>
      </details>
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
