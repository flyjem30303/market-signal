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
      <div className="blocker-acceleration-strip" aria-label="Runtime unblock acceleration">
        <article>
          <span>Acceleration status</span>
          <strong>{summary.accelerationPlan.status}</strong>
          <p>{summary.accelerationPlan.recommendedWorkMix}</p>
        </article>
        <article className="blocked">
          <span>Current blockers</span>
          <strong>{summary.accelerationPlan.currentBlockers.length} active</strong>
          <p>{summary.accelerationPlan.currentBlockers.slice(0, 2).join("; ")}.</p>
        </article>
      </div>
      <div className="blocker-closure-gap-summary" aria-label="PM acceptance gap summary">
        <article>
          <span>PM acceptance gap</span>
          <strong>{summary.closureGapSummary.overallState}</strong>
          <p>{summary.closureGapSummary.summary}</p>
          <small>
            Next PM move: {summary.closureGapSummary.nextPmAcceptanceMove} / blocked promotion gaps:{" "}
            {summary.closureGapSummary.blockedPromotionCount} / mock only:{" "}
            {summary.closureGapSummary.stillMockOnly ? "yes" : "no"}
          </small>
        </article>
        <article>
          <span>A1 support</span>
          <p>{summary.closureGapSummary.a1Support}</p>
        </article>
        <article>
          <span>A2 support</span>
          <p>{summary.closureGapSummary.a2Support}</p>
        </article>
        <article>
          <span>Remaining blockers</span>
          <p>{summary.closureGapSummary.remainingBlockers.join("; ")}.</p>
        </article>
      </div>
      <div className="blocker-closure-runtime-rollup" aria-label="Blocker closure runtime rollup">
        <article>
          <span>Closure rollup</span>
          <strong>{summary.closureRuntimeRollup.status}</strong>
          <p>{summary.closureRuntimeRollup.summary}</p>
          <small>
            accepted local packets: {summary.closureRuntimeRollup.acceptedLocalPackets} / promotion unblocked:{" "}
            {summary.closureRuntimeRollup.promotionUnblockedCount}
          </small>
        </article>
        <article>
          <span>Ready local owners</span>
          <p>{summary.closureRuntimeRollup.readyLocalOwners.join(", ")}</p>
          <strong>{summary.closureRuntimeRollup.nextGateCandidate}</strong>
        </article>
        <article>
          <span>Next PM action</span>
          <p>{summary.closureRuntimeRollup.nextPmAction}</p>
        </article>
        <article>
          <span>Promotion still blocked by</span>
          <p>{summary.closureRuntimeRollup.blockedPromotionDecisions.join("; ")}.</p>
        </article>
      </div>
      <div className="next-narrow-gate-comparison" aria-label="Next narrow gate comparison">
        <article>
          <span>Next gate recommendation</span>
          <strong>{summary.nextNarrowGateComparison.recommendedOption}</strong>
          <p>{summary.nextNarrowGateComparison.ceoRecommendation}</p>
          <small>{summary.nextNarrowGateComparison.stopLine}</small>
        </article>
        {summary.nextNarrowGateComparison.options.map((option) => (
          <article className={option.status} key={option.id}>
            <span>
              {option.owner} / {option.id}
            </span>
            <strong>{option.status}</strong>
            <p>{option.summary}</p>
            <p>{option.blockerReduced}</p>
            <small>
              remote attempt: {option.requiresRemoteAttempt ? "yes" : "no"} / local now:{" "}
              {option.canRunLocallyNow ? "yes" : "no"} / risk: {option.risk}
            </small>
            <code>{option.command}</code>
          </article>
        ))}
      </div>
      <div className="next-executable-packet" aria-label="Next executable local packet">
        <article>
          <span>Next executable packet</span>
          <strong>{summary.nextExecutablePacket.id}</strong>
          <p>{summary.nextExecutablePacket.summary}</p>
          <small>{summary.nextExecutablePacket.stopLine}</small>
        </article>
        <article>
          <span>
            {summary.nextExecutablePacket.owner} / {summary.nextExecutablePacket.status}
          </span>
          <code>{summary.nextExecutablePacket.reportCommand}</code>
          <code>{summary.nextExecutablePacket.checkCommand}</code>
        </article>
        <article>
          <span>Post-review / {summary.nextExecutablePacket.postReviewStatus}</span>
          <code>{summary.nextExecutablePacket.postReviewReportCommand}</code>
          <code>{summary.nextExecutablePacket.postReviewCheckCommand}</code>
        </article>
      </div>
      <div className="data-quality-acceptance-summary" aria-label="Data quality local acceptance summary">
        <article>
          <span>Data quality gate</span>
          <strong>{summary.dataQualityAcceptance.status}</strong>
          <p>{summary.dataQualityAcceptance.decision}</p>
          <small>
            accepted as: {summary.dataQualityAcceptance.acceptedAs} / source:{" "}
            {summary.dataQualityAcceptance.publicDataSource} / score: {summary.dataQualityAcceptance.scoreSource}
          </small>
        </article>
        <article>
          <span>Accepted local evidence</span>
          <p>{summary.dataQualityAcceptance.acceptedEvidenceIds.join(", ")}</p>
          <code>{summary.dataQualityAcceptance.gateDocument}</code>
        </article>
        <article>
          <span>Next narrow question</span>
          <p>{summary.dataQualityAcceptance.nextNarrowQuestion}</p>
        </article>
        <article>
          <span>Still blocked</span>
          <p>{summary.dataQualityAcceptance.blockedDecisions.join("; ")}.</p>
        </article>
      </div>
      <div className="source-rights-acceptance-summary" aria-label="Source rights local acceptance summary">
        <article>
          <span>Source rights gate</span>
          <strong>{summary.sourceRightsAcceptance.status}</strong>
          <p>{summary.sourceRightsAcceptance.decision}</p>
          <small>
            accepted as: {summary.sourceRightsAcceptance.acceptedAs} / source:{" "}
            {summary.sourceRightsAcceptance.publicDataSource} / score: {summary.sourceRightsAcceptance.scoreSource}
          </small>
        </article>
        <article>
          <span>Accepted local evidence</span>
          <p>{summary.sourceRightsAcceptance.acceptedEvidenceIds.join(", ")}</p>
          <code>{summary.sourceRightsAcceptance.gateDocument}</code>
        </article>
        <article>
          <span>Next narrow question</span>
          <p>{summary.sourceRightsAcceptance.nextNarrowQuestion}</p>
        </article>
        <article>
          <span>Still blocked</span>
          <p>{summary.sourceRightsAcceptance.blockedDecisions.join("; ")}.</p>
        </article>
      </div>
      <div className="model-credibility-acceptance-summary" aria-label="Model credibility local acceptance summary">
        <article>
          <span>Model credibility gate</span>
          <strong>{summary.modelCredibilityAcceptance.status}</strong>
          <p>{summary.modelCredibilityAcceptance.decision}</p>
          <small>
            accepted as: {summary.modelCredibilityAcceptance.acceptedAs} / source:{" "}
            {summary.modelCredibilityAcceptance.publicDataSource} / score:{" "}
            {summary.modelCredibilityAcceptance.scoreSource}
          </small>
        </article>
        <article>
          <span>Accepted local evidence</span>
          <p>{summary.modelCredibilityAcceptance.acceptedEvidenceIds.join(", ")}</p>
          <code>{summary.modelCredibilityAcceptance.gateDocument}</code>
        </article>
        <article>
          <span>Next narrow question</span>
          <p>{summary.modelCredibilityAcceptance.nextNarrowQuestion}</p>
        </article>
        <article>
          <span>Still blocked</span>
          <p>{summary.modelCredibilityAcceptance.blockedDecisions.join("; ")}.</p>
        </article>
      </div>
      <div className="blocker-fastest-path" aria-label="Fastest safe unblock path">
        {summary.accelerationPlan.fastestSafePath.map((step) => (
          <article className={step.canRunNow ? "ready" : "hold"} key={step.step}>
            <span>
              Step {step.step} / {step.owner}
            </span>
            <strong>{step.canRunNow ? "can run locally" : "hold"}</strong>
            <p>{step.action}</p>
            <code>{step.command}</code>
            <small>Still blocked: {step.stillDoesNotAuthorize.join(", ")}</small>
          </article>
        ))}
      </div>
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
