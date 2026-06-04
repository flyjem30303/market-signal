import { getBlockerClosureMap } from "@/lib/blocker-closure-map";
import { getDataEvidenceLadderSummary } from "@/lib/data-evidence-ladder";
import { getDataReadinessDecisionSummary } from "@/lib/data-readiness-decision-summary";
import { getProjectProgressSummary } from "@/lib/project-progress-score";
import { getRuntimeActionStatusSummary } from "@/lib/runtime-action-status";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export function ProjectProgressPanel() {
  const progress = getProjectProgressSummary();
  const dataReadiness = getDataReadinessDecisionSummary();
  const evidenceLadder = getDataEvidenceLadderSummary();
  const blockerClosure = getBlockerClosureMap();
  const actionStatus = getRuntimeActionStatusSummary();
  const runtime = getRuntimeReadinessSummary();
  const runtimeGate = getRuntimeGateDecisionBrief();

  const sourcePacket = progress.dataCoverageRouteDecision.sourceReadinessPacket;

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
            {runtime.score}% / {runtime.displayHeadline}
          </strong>
          <p>{runtime.displayNextDecision}</p>
        </article>
        <article className="active">
          <span>Default route</span>
          <strong>{runtimeGate.displayRouteTitle}</strong>
          <p>{runtimeGate.displayDecisionPoint}</p>
        </article>
        <article className="hold">
          <span>Remote trigger</span>
          <strong>{runtimeGate.displayStatus}</strong>
          <p>{runtimeGate.displayRemoteTrigger}</p>
        </article>
        <article className="blocked">
          <span>Source boundary</span>
          <strong>
            {runtimeGate.displaySourceBoundary} / {runtimeGate.displayScoreSource}
          </strong>
          <p>
            {runtimeGate.displayBlockedNowTitle}: {runtimeGate.blockedNow.slice(0, 4).join(", ")}.
          </p>
        </article>
        <article className="blocked">
          <span>Evidence gate</span>
          <strong>{progress.networkBlocker.status}</strong>
          <p>{progress.networkBlocker.currentFinding}</p>
        </article>
      </div>

      <section className="runtime-action-status-strip" aria-label="Runtime action status normalization">
        <div>
          <span>Action status</span>
          <strong>{actionStatus.headline}</strong>
          <p>{actionStatus.nextAction}</p>
        </div>
        {actionStatus.statuses.map((status) => (
          <article className={status.tone} key={status.id}>
            <span>
              {status.owner} / {status.id}
            </span>
            <strong>{status.label}</strong>
            <p>{status.detail}</p>
            <p>允許動作：{status.allowedAction}</p>
            <p>封鎖動作：{status.blockedAction}</p>
            <p>{formatNextGate(status.nextGate)}</p>
          </article>
        ))}
      </section>

      <section className="project-progress-data-readiness" aria-label="Post-readonly data readiness summary">
        <div>
          <span>Data Readiness</span>
          <strong>{dataReadiness.headline}</strong>
          <p>{dataReadiness.recommendation}</p>
          <p>{formatNextGate(dataReadiness.closestNextGate)}</p>
          <p>{formatBoundary(dataReadiness.safety.publicDataSource, dataReadiness.safety.scoreSource)}</p>
        </div>
        <div className="project-progress-data-readiness-lanes">
          {dataReadiness.lanes.map((lane) => (
            <article className={lane.state} key={lane.id}>
              <span>
                {lane.owner} / {lane.state}
              </span>
              <strong>{lane.label}</strong>
              <p>{lane.evidence}</p>
              <p>{lane.nextAction}</p>
            </article>
          ))}
        </div>
        <article className="project-progress-data-readiness-attempt">
          <span>{dataReadiness.boundedReadonlyAttempt.decision}</span>
          <strong>{dataReadiness.boundedReadonlyAttempt.command}</strong>
          <p>{dataReadiness.boundedReadonlyAttempt.reason}</p>
          <p>
            CEO 另行命名授權:{" "}
            {formatBoolean(dataReadiness.boundedReadonlyAttempt.requiresSeparateCeoNamedAction)}
          </p>
        </article>
        <div className="project-progress-data-readiness-integration">
          {dataReadiness.integrationQueue.map((item) => (
            <article className={item.status} key={item.id}>
              <span>
                {item.owner} / priority {item.priority}
              </span>
              <strong>{item.id}</strong>
              <p>{item.acceptanceSignal}</p>
              <p>{item.integrationAction}</p>
              <p>Blocked until: {item.blockedUntil}</p>
              <p>Source: {item.source}</p>
            </article>
          ))}
        </div>
        <p>{dataReadiness.stopLine}</p>
      </section>

      <section className="project-progress-data-foundation" aria-label="Data foundation gate">
        <div>
          <span>{dataReadiness.dataFoundationGate.status}</span>
          <strong>{dataReadiness.dataFoundationGate.headline}</strong>
          <p>
            Accepted {dataReadiness.dataFoundationGate.acceptedCount}/{dataReadiness.dataFoundationGate.totalCount};
            foundation {dataReadiness.dataFoundationGate.foundationPercent}%.
          </p>
          <p>
            {formatBoundary(
              dataReadiness.dataFoundationGate.publicDataSource,
              dataReadiness.dataFoundationGate.scoreSource
            )}
          </p>
          <p>{dataReadiness.dataFoundationGate.nextGate}</p>
        </div>
        <div className="project-progress-data-foundation-grid">
          {dataReadiness.dataFoundationGate.items.map((item) => (
            <article className={item.state} key={item.id}>
              <span>
                {item.owner} / {item.state}
              </span>
              <strong>{item.label}</strong>
              <p>{item.evidence}</p>
              <p>Blocker: {item.blocker}</p>
              <p>Next: {item.nextAction}</p>
            </article>
          ))}
        </div>
        <p>{dataReadiness.dataFoundationGate.stopLine}</p>
      </section>

      <section className="project-progress-evidence-ladder" aria-label="Data evidence ladder">
        <div>
          <span>Evidence Ladder</span>
          <strong>{evidenceLadder.headline}</strong>
          <p>{evidenceLadder.nextDecision}</p>
          <p>Active stage: {evidenceLadder.activeStage}</p>
          <p>{formatBoundary(evidenceLadder.publicDataSource, evidenceLadder.scoreSource)}</p>
        </div>
        <div className="project-progress-evidence-ladder-stages">
          {evidenceLadder.stages.map((stage) => (
            <article className={stage.state} key={stage.id}>
              <span>
                {stage.owner} / {stage.state}
              </span>
              <strong>{stage.label}</strong>
              <p>{stage.acceptedEvidence}</p>
              <p>Exit: {stage.exitCriteria}</p>
              <p>Blocked promotion: {stage.blockedPromotion}</p>
              <p>Next: {stage.nextAction}</p>
            </article>
          ))}
        </div>
        <p>{evidenceLadder.stopLine}</p>
      </section>

      <section className="project-progress-blocker-closure" aria-label="Blocker closure map">
        <div>
          <span>Blocker Closure</span>
          <strong>{blockerClosure.headline}</strong>
          <p>{blockerClosure.nextCeoMove}</p>
          <p>{formatBoundary(blockerClosure.publicDataSource, blockerClosure.scoreSource)}</p>
        </div>
        <div className="project-progress-blocker-closure-grid">
          {blockerClosure.sequence.map((item) => (
            <article className={item.lane} key={item.blockerId}>
              <span>
                {item.owner} / {item.status}
              </span>
              <strong>{item.blockerId}</strong>
              <p>{item.acceptedLocalEvidence}</p>
              <p>Next command: {item.nextCommand}</p>
              <p>Decision: {item.nextDecision}</p>
              <p>Blocked promotion: {item.blockedPromotion}</p>
            </article>
          ))}
        </div>

        <section className="project-progress-blocker-outcome-ledger">
          <span>{blockerClosure.blockerReviewDecisionOutcomeLedger.status}</span>
          <strong>Blocker review outcome / {blockerClosure.blockerReviewDecisionOutcomeLedger.mode}</strong>
          <p>
            All required outcomes accepted:{" "}
            {formatBoolean(blockerClosure.blockerReviewDecisionOutcomeLedger.allRequiredOutcomesAccepted)}
          </p>
          <p>
            {formatBoundary(
              blockerClosure.blockerReviewDecisionOutcomeLedger.safety.publicDataSource,
              blockerClosure.blockerReviewDecisionOutcomeLedger.safety.scoreSource
            )}
          </p>
          <div>
            {blockerClosure.blockerReviewDecisionOutcomeLedger.outcomes.map((outcome) => (
              <article className={outcome.outcome} key={outcome.blockerId}>
                <span>
                  {outcome.owner} / {outcome.recordedBy}
                </span>
                <strong>{outcome.outcome}</strong>
                <p>{outcome.decisionNote}</p>
                <p>{outcome.acceptedMeaning}</p>
                <p>{outcome.rejectedMeaning}</p>
                <p>{outcome.deferredMeaning}</p>
                <p>Record: {outcome.recordCommand}</p>
              </article>
            ))}
          </div>
          <p>Next decision {blockerClosure.blockerReviewDecisionOutcomeLedger.nextAllowedDecision}</p>
          <p>Still blocked: {blockerClosure.blockerReviewDecisionOutcomeLedger.stillBlocked.join(", ")}</p>
        </section>

        <section className="project-progress-blocker-readiness-gate">
          <span>{progress.blockerClosureReadinessGate.status}</span>
          <strong>{progress.blockerClosureReadinessGate.headline}</strong>
          <p>Closure readiness {progress.blockerClosureReadinessGate.closurePercent}%.</p>
          <p>
            {formatBoundary(
              progress.blockerClosureReadinessGate.publicDataSource,
              progress.blockerClosureReadinessGate.scoreSource
            )}
          </p>
          <p>{progress.blockerClosureReadinessGate.nextCeoMove}</p>
          <div>
            {progress.blockerClosureReadinessGate.items.map((item) => (
              <article className={item.closureState} key={item.blockerId}>
                <span>
                  {item.owner} / {item.closureState}
                </span>
                <strong>{item.blockerId}</strong>
                <p>{item.evidence}</p>
                <p>Blocked promotion: {item.promotionBlocked}</p>
              </article>
            ))}
          </div>
          <p>{progress.blockerClosureReadinessGate.stopLine}</p>
        </section>
        <p>{blockerClosure.stopLine}</p>
      </section>

      <div
        className={`project-progress-network-blocker ${progress.networkBlocker.status}`}
        aria-label={`Supabase evidence gate ${progress.networkBlocker.status}`}
      >
        <span>Supabase readonly evidence gate</span>
        <strong>{progress.networkBlocker.currentFinding}</strong>
        <p>{progress.networkBlocker.impact}</p>
        <p>{progress.networkBlocker.nextAction}</p>
      </div>

      <div
        className={`project-progress-evidence ${progress.dataQualityEvidenceGate.status}`}
        aria-label={`Data quality evidence gate ${progress.dataQualityEvidenceGate.status}`}
      >
        <span>Data quality evidence gate</span>
        <p>
          Completed evidence: {progress.dataQualityEvidenceGate.completedEvidence.length}; missing evidence:{" "}
          {progress.dataQualityEvidenceGate.missingEvidence.length}.
        </p>
        <p>
          {formatBoundary(
            progress.dataQualityEvidenceGate.publicDataSource,
            progress.dataQualityEvidenceGate.scoreSource
          )}
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
            {progress.dataCoverageRouteDecision.designGate.missingRows}.
          </p>
          <p>
            {formatBoundary(
              progress.dataCoverageRouteDecision.designGate.publicDataSource,
              progress.dataCoverageRouteDecision.designGate.scoreSource
            )}
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
            {progress.dataCoverageRouteDecision.backfillPlan.missingRows}.
          </p>
          <p>
            {formatBoundary(
              progress.dataCoverageRouteDecision.backfillPlan.publicDataSource,
              progress.dataCoverageRouteDecision.backfillPlan.scoreSource
            )}
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
          <span>{sourcePacket.status}</span>
          <strong>Source readiness priority: {sourcePacket.priorityOrder.join(" -> ")}</strong>
          <p>{formatBoundary(sourcePacket.publicDataSource, sourcePacket.scoreSource)}</p>
          <div>
            {sourcePacket.lanes.map((lane) => (
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
            <span>{sourcePacket.twiiSourceSelectionPacket.status}</span>
            <strong>
              {sourcePacket.twiiSourceSelectionPacket.targetSymbol} source selection /{" "}
              {sourcePacket.twiiSourceSelectionPacket.priority}
            </strong>
            <p>Observed rows {sourcePacket.twiiSourceSelectionPacket.observedRows}.</p>
            <p>
              {formatBoundary(
                sourcePacket.twiiSourceSelectionPacket.publicDataSource,
                sourcePacket.twiiSourceSelectionPacket.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.twiiSourceSelectionPacket.candidates.map((candidate) => (
                <article key={candidate.id}>
                  <span>{candidate.status}</span>
                  <strong>{candidate.label}</strong>
                  <p>{candidate.requiredReview.join(", ")}</p>
                </article>
              ))}
            </div>
            <p>{sourcePacket.twiiSourceSelectionPacket.nextSafeAction}</p>
            <p>{sourcePacket.twiiSourceSelectionPacket.stopLine}</p>
          </section>

          <section className="project-progress-etf-rights-review">
            <span>{sourcePacket.etfSourceRightsReviewPacket.status}</span>
            <strong>ETF rights review / {sourcePacket.etfSourceRightsReviewPacket.blocker}</strong>
            <p>Symbols {sourcePacket.etfSourceRightsReviewPacket.targetSymbols.join(", ")}.</p>
            <p>
              {formatBoundary(
                sourcePacket.etfSourceRightsReviewPacket.publicDataSource,
                sourcePacket.etfSourceRightsReviewPacket.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.etfSourceRightsReviewPacket.candidates.map((candidate) => (
                <article key={candidate.id}>
                  <span>{candidate.status}</span>
                  <strong>{candidate.label}</strong>
                  <p>{candidate.requiredReview.join(", ")}</p>
                </article>
              ))}
            </div>
            <p>{sourcePacket.etfSourceRightsReviewPacket.nextSafeAction}</p>
            <p>{sourcePacket.etfSourceRightsReviewPacket.stopLine}</p>
          </section>

          <section className="project-progress-equity-dry-run">
            <span>{sourcePacket.equityDryRunPacketReadiness.status}</span>
            <strong>Equity dry-run packet / {sourcePacket.equityDryRunPacketReadiness.sourceId}</strong>
            <p>Symbols {sourcePacket.equityDryRunPacketReadiness.targetSymbols.join(", ")}.</p>
            <p>
              {formatBoundary(
                sourcePacket.equityDryRunPacketReadiness.publicDataSource,
                sourcePacket.equityDryRunPacketReadiness.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.equityDryRunPacketReadiness.requirements.map((requirement) => (
                <article key={requirement.id}>
                  <span>{requirement.status}</span>
                  <strong>{requirement.id}</strong>
                  <p>{requirement.requirement}</p>
                </article>
              ))}
            </div>
            <p>{sourcePacket.equityDryRunPacketReadiness.nextSafeAction}</p>
            <p>{sourcePacket.equityDryRunPacketReadiness.stopLine}</p>
          </section>

          <section className="project-progress-equity-dry-run-packet">
            <span>{sourcePacket.equityReportOnlyDryRunPacket.status}</span>
            <strong>Equity report-only packet / {sourcePacket.equityReportOnlyDryRunPacket.sourceId}</strong>
            <p>
              Symbols {sourcePacket.equityReportOnlyDryRunPacket.targetSymbols.join(", ")}; window{" "}
              {sourcePacket.equityReportOnlyDryRunPacket.firstApprovedWindow.startMonth}
              {" -> "}
              {sourcePacket.equityReportOnlyDryRunPacket.firstApprovedWindow.endMonth}.
            </p>
            <p>
              {formatBoundary(
                sourcePacket.equityReportOnlyDryRunPacket.publicDataSource,
                sourcePacket.equityReportOnlyDryRunPacket.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.equityReportOnlyDryRunPacket.sections.map((section) => (
                <article key={section.id}>
                  <span>{section.owner}</span>
                  <strong>{section.id}</strong>
                  <p>{section.summary}</p>
                </article>
              ))}
            </div>
            <p>Allowed output: {sourcePacket.equityReportOnlyDryRunPacket.allowedOutput.join(", ")}</p>
            <p>Forbidden output: {sourcePacket.equityReportOnlyDryRunPacket.forbiddenOutput.join(", ")}</p>
            <p>{sourcePacket.equityReportOnlyDryRunPacket.nextSafeAction}</p>
            <p>{sourcePacket.equityReportOnlyDryRunPacket.stopLine}</p>
          </section>

          <section className="project-progress-equity-role-review">
            <span>{sourcePacket.equityPacketRoleReviewGate.status}</span>
            <strong>Equity role review / {sourcePacket.equityPacketRoleReviewGate.nextDecision}</strong>
            <p>Packet {sourcePacket.equityPacketRoleReviewGate.packetStatus}.</p>
            <p>
              {formatBoundary(
                sourcePacket.equityPacketRoleReviewGate.publicDataSource,
                sourcePacket.equityPacketRoleReviewGate.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.equityPacketRoleReviewGate.reviews.map((review) => (
                <article key={review.role}>
                  <span>{review.status}</span>
                  <strong>{review.role}</strong>
                  <p>{review.finding}</p>
                  <p>{review.requiredBeforeExecution}</p>
                </article>
              ))}
            </div>
            <p>Execution blockers: {sourcePacket.equityPacketRoleReviewGate.executionBlockers.join(", ")}</p>
            <p>{sourcePacket.equityPacketRoleReviewGate.stopLine}</p>
          </section>

          <section className="project-progress-equity-runner-approval">
            <span>{sourcePacket.equityRunnerImplementationApprovalGate.status}</span>
            <strong>
              Runner approval / {sourcePacket.equityRunnerImplementationApprovalGate.approvalState}
            </strong>
            <p>
              Request {sourcePacket.equityRunnerImplementationApprovalGate.requestedNextMove}; source{" "}
              {sourcePacket.equityRunnerImplementationApprovalGate.scope.sourceId}; mode{" "}
              {sourcePacket.equityRunnerImplementationApprovalGate.scope.runMode}; symbols{" "}
              {sourcePacket.equityRunnerImplementationApprovalGate.scope.targetSymbols.join(", ")}.
            </p>
            <div>
              {sourcePacket.equityRunnerImplementationApprovalGate.requirements.map((requirement) => (
                <article key={requirement.id}>
                  <span>{requirement.owner}</span>
                  <strong>{requirement.id}</strong>
                  <p>{requirement.requirement}</p>
                </article>
              ))}
            </div>
            <p>
              核准前禁止：{sourcePacket.equityRunnerImplementationApprovalGate.forbiddenUntilApproved.join(", ")}
            </p>
            <p>
              {formatBoundary(
                sourcePacket.equityRunnerImplementationApprovalGate.publicDataSource,
                sourcePacket.equityRunnerImplementationApprovalGate.scoreSource
              )}
            </p>
            <p>{sourcePacket.equityRunnerImplementationApprovalGate.stopLine}</p>
          </section>

          <section className="project-progress-runner-decision-request">
            <span>{sourcePacket.runnerApprovalDecisionRequestSummary.status}</span>
            <strong>
              Runner decision / {sourcePacket.runnerApprovalDecisionRequestSummary.currentRecommendation}
            </strong>
            <p>
              Question {sourcePacket.runnerApprovalDecisionRequestSummary.decisionQuestion}; approval{" "}
              {sourcePacket.runnerApprovalDecisionRequestSummary.approvalState}; 董事長審核是否需要{" "}
              {formatRequired(sourcePacket.runnerApprovalDecisionRequestSummary.chairReviewRequired)}.
            </p>
            <p>
              Scope {sourcePacket.runnerApprovalDecisionRequestSummary.requestedScope.sourceId}; mode{" "}
              {sourcePacket.runnerApprovalDecisionRequestSummary.requestedScope.runMode}; symbols{" "}
              {sourcePacket.runnerApprovalDecisionRequestSummary.requestedScope.targetSymbols.join(", ")}.
            </p>
            <div>
              {sourcePacket.runnerApprovalDecisionRequestSummary.options.map((option) => (
                <article className={option.recommendation} key={option.id}>
                  <span>{option.recommendation}</span>
                  <strong>{option.id}</strong>
                  <p>{option.outcome}</p>
                  <p>{option.risk}</p>
                </article>
              ))}
            </div>
            <p>
              {formatBoundary(
                sourcePacket.runnerApprovalDecisionRequestSummary.publicDataSource,
                sourcePacket.runnerApprovalDecisionRequestSummary.scoreSource
              )}
            </p>
            <p>{sourcePacket.runnerApprovalDecisionRequestSummary.stopLine}</p>
          </section>

          <section className="project-progress-runner-outcome-ledger">
            <span>{sourcePacket.runnerApprovalDecisionOutcomeLedger.status}</span>
            <strong>Runner approval outcome / {sourcePacket.runnerApprovalDecisionOutcomeLedger.mode}</strong>
            <p>
              Implementation approved:
              {formatBoolean(sourcePacket.runnerApprovalDecisionOutcomeLedger.implementationApproved)}
            </p>
            <p>
              {formatBoundary(
                sourcePacket.runnerApprovalDecisionOutcomeLedger.safety.publicDataSource,
                sourcePacket.runnerApprovalDecisionOutcomeLedger.safety.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.runnerApprovalDecisionOutcomeLedger.outcomes.map((outcome) => (
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
              ))}
            </div>
            <p>Next decision {sourcePacket.runnerApprovalDecisionOutcomeLedger.nextAllowedDecision}</p>
            <p>Still blocked: {sourcePacket.runnerApprovalDecisionOutcomeLedger.stillBlocked.join(", ")}</p>
          </section>

          <section className="project-progress-runner-execution-gate">
            <span>{sourcePacket.equityRunnerExecutionApprovalGate.status}</span>
            <strong>Execution gate / {sourcePacket.equityRunnerExecutionApprovalGate.approvalState}</strong>
            <p>
              Question {sourcePacket.equityRunnerExecutionApprovalGate.executionQuestion}; attempts{" "}
              {sourcePacket.equityRunnerExecutionApprovalGate.attemptLimit}; source{" "}
              {sourcePacket.equityRunnerExecutionApprovalGate.sourceId}; symbols{" "}
              {sourcePacket.equityRunnerExecutionApprovalGate.targetSymbols.join(", ")}.
            </p>
            <p>
              Confirmation {sourcePacket.equityRunnerExecutionApprovalGate.confirmationEnv}=
              {sourcePacket.equityRunnerExecutionApprovalGate.confirmationValue}
            </p>
            <p>Command {sourcePacket.equityRunnerExecutionApprovalGate.exactCommand}</p>
            <div>
              {sourcePacket.equityRunnerExecutionApprovalGate.prechecks.map((precheck) => (
                <article key={precheck.id}>
                  <span>{precheck.id}</span>
                  <strong>{precheck.command}</strong>
                  <p>執行前必須完成：{formatBoolean(precheck.requiredBeforeExecution)}</p>
                </article>
              ))}
            </div>
            <p>核准前禁止：{sourcePacket.equityRunnerExecutionApprovalGate.forbiddenUntilApproved.join(", ")}</p>
            <p>{sourcePacket.equityRunnerExecutionApprovalGate.stopLine}</p>
          </section>

          <section className="project-progress-source-checkpoint">
            <span>{sourcePacket.sourceReadinessCheckpointSummary.status}</span>
            <strong>CEO next move: {sourcePacket.sourceReadinessCheckpointSummary.primaryNextMove}</strong>
            <p>
              {formatBoundary(
                sourcePacket.sourceReadinessCheckpointSummary.publicDataSource,
                sourcePacket.sourceReadinessCheckpointSummary.scoreSource
              )}
            </p>
            <div>
              {sourcePacket.sourceReadinessCheckpointSummary.lanes.map((lane) => (
                <article key={lane.lane}>
                  <span>{lane.status}</span>
                  <strong>{lane.lane}</strong>
                  <p>{lane.ceoDecision}</p>
                  <p>{lane.pmAction}</p>
                </article>
              ))}
            </div>
            <p>
              執行前仍封鎖：{sourcePacket.sourceReadinessCheckpointSummary.blockedFromExecution.join(", ")}
            </p>
            <p>{sourcePacket.sourceReadinessCheckpointSummary.stopLine}</p>
          </section>
          <p>{sourcePacket.stopLine}</p>
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

function formatBoundary(publicDataSource: string, scoreSource: string) {
  return `公開資料來源：${publicDataSource}；分數來源：${scoreSource}`;
}

function formatBoolean(value: boolean) {
  return value ? "是" : "否";
}

function formatNextGate(nextGate: string) {
  return `下一個 gate：${nextGate}`;
}

function formatRequired(value: boolean) {
  return value ? "需要" : "不需要";
}
