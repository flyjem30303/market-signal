import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getFreshnessRuntimeActivationSummary } from "@/lib/freshness-runtime-activation";
import { getRuntimeHardeningExitCriteria } from "@/lib/runtime-hardening-exit-criteria";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";
import { getSupabaseReadonlyDecision } from "@/lib/supabase-readonly-decision";
import { getSupabaseReadonlyExecutionPreview } from "@/lib/supabase-readonly-execution-preview";
import { getSupabaseReadonlyLocalPreflight } from "@/lib/supabase-readonly-local-preflight";
import { buildFreshnessReadonlySmokeReport } from "@/lib/freshness-readonly-smoke-report";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";
import { getRuntimeFailClosedSummary } from "@/lib/runtime-fail-closed";
import { getRuntimeReadonlyDecisionCard } from "@/lib/runtime-readonly-decision-card";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export function RuntimeReadinessPanel() {
  const readiness = getRuntimeReadinessSummary();
  const preflight = getSupabaseReadonlyLocalPreflight();
  const decision = getSupabaseReadonlyDecision(preflight);
  const executionPreview = getSupabaseReadonlyExecutionPreview(decision);
  const freshnessActivation = getFreshnessRuntimeActivationSummary();
  const runtimeHardeningExit = getRuntimeHardeningExitCriteria();
  const readonlySmokeReport = buildFreshnessReadonlySmokeReport();
  const freshnessLatestEvidence = getFreshnessReadonlyLatestEvidenceSummary();
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();
  const runtimeGateBrief = getRuntimeGateDecisionBrief();
  const runtimeDeliveryCadence = getRuntimeDeliveryCadence();
  const runtimeStateConsistency = getRuntimeStateConsistencySummary();
  const failClosed = getRuntimeFailClosedSummary();
  const readonlyDecisionCard = getRuntimeReadonlyDecisionCard(preflight, decision, executionPreview);
  const postReadonlyRuntime = getPostReadonlyRuntimeState();
  const readonlyFinalPrepReady =
    preflight.status === "ready_for_guarded_readonly_decision" &&
    decision.status === "ready_for_ceo_decision" &&
    executionPreview.status === "ready_for_manual_ceo_run";

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
      <RuntimeSectionLabel
        title="Top decision"
        text="Current public state, blocked actions, and CEO/PM next step."
      />
      <div className="runtime-delivery-cadence" aria-label="Runtime delivery cadence adjustment">
        <article>
          <span>Delivery cadence</span>
          <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
          <p>{runtimeDeliveryCadence.reason}</p>
          <p>{runtimeDeliveryCadence.adjustment}</p>
        </article>
        <article className="ready">
          <span>Next slice size</span>
          <strong>{runtimeDeliveryCadence.targetSliceSize}</strong>
          <p>Mode: {runtimeDeliveryCadence.nextExecutionMode}.</p>
          <p>Verdict: {runtimeDeliveryCadence.verdict}.</p>
        </article>
        <article className="hold">
          <span>Mandatory cutpoints remain</span>
          <ul>
            {runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 4).map((cutpoint) => (
              <li key={cutpoint}>{cutpoint}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="runtime-route-snapshot" aria-label="Runtime route snapshot">
        <article>
          <span>Current default route</span>
          <strong>{runtimeGateBrief.currentDefaultRoute}</strong>
          <p>{runtimeGateBrief.decisionPoint}</p>
        </article>
        {runtimeGateBrief.routeOptions.map((option) => (
          <article className={option.status === "default_now" ? "ready" : "hold"} key={option.id}>
            <span>{option.status}</span>
            <strong>{option.title}</strong>
            <p>{option.reason}</p>
            <p>{option.nextStep}</p>
          </article>
        ))}
      </div>
      <div className="runtime-state-strip" aria-label="Runtime state summary">
        <article className="runtime-state-pill ready">
          <span>Public source</span>
          <strong>{runtimeGateBrief.publicDataSource}</strong>
        </article>
        <article className="runtime-state-pill ready">
          <span>Score source</span>
          <strong>{runtimeGateBrief.scoreSource}</strong>
        </article>
        <article className="runtime-state-pill hold">
          <span>Remote action</span>
          <strong>separate authorization</strong>
        </article>
        <article className="runtime-state-pill ready runtime-consistency-card">
          <span>State consistency</span>
          <strong>{runtimeStateConsistency.consistencyState}</strong>
          <p>{runtimeStateConsistency.statusLine}</p>
        </article>
        <article className="runtime-state-pill hold runtime-fail-closed-card">
          <span>Fail-closed guard</span>
          <strong>{failClosed.failClosedState}</strong>
          <p>{failClosed.stopLine}</p>
        </article>
      </div>
      <div className="runtime-decision-snapshot" aria-label="Runtime decision snapshot">
        <article>
          <span>Allowed now</span>
          <ul>
            {runtimeGateBrief.allowedNow.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="blocked">
          <span>Still blocked</span>
          <ul>
            {runtimeGateBrief.blockedNow.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>CEO/PM next step</span>
          <p>{runtimeGateBrief.pmNextStep}</p>
          <p>{runtimeGateBrief.requiredAuthorization}.</p>
          <p>Remote trigger: {runtimeGateBrief.separateRemoteTrigger}.</p>
        </article>
      </div>
      <div className="runtime-final-prep-card" aria-label="Supabase readonly final prep decision summary">
        <article className={readonlyFinalPrepReady ? "ready" : "hold"}>
          <span>Supabase readonly final prep</span>
          <strong>{readonlyFinalPrepReady ? "ready_for_ceo_oral_review" : "hold"}</strong>
          <p>
            Preflight {preflight.status}; decision {decision.status}; execution preview {executionPreview.status}.
          </p>
          <p>
            Next human step:{" "}
            {readonlyFinalPrepReady
              ? "CEO may orally summarize and separately name exactly one manual read-only attempt."
              : "PM fixes local blockers before any manual read-only attempt is named."}
          </p>
        </article>
        <article className="hold">
          <span>Required confirmation</span>
          <strong>{executionPreview.requiredConfirmation}</strong>
          <p>Command preview: {executionPreview.exactCommandPreview ?? "blocked until final prep is ready"}.</p>
          <p>Remote validator executed: false. Automated remote run: false.</p>
        </article>
        <article className="blocked">
          <span>Post-run review</span>
          <strong>{executionPreview.postRunReviewTarget}</strong>
          <p>Readiness promotion remains {executionPreview.readinessPromotionBlocked ? "blocked" : "open"}.</p>
          <p>Still blocked: {executionPreview.blockedPromotions.slice(0, 3).join(", ")}.</p>
        </article>
      </div>
      <div className="runtime-readonly-decision-card" aria-label="Runtime readonly decision card">
        <article className={readonlyDecisionCard.decisionState === "ready_for_ceo_oral_review" ? "ready" : "hold"}>
          <span>Readonly decision</span>
          <strong>{readonlyDecisionCard.decisionState}</strong>
          <p>{readonlyDecisionCard.headline}</p>
          <p>{readonlyDecisionCard.statusLine}</p>
        </article>
        <article className="ready">
          <span>Allowed local checks</span>
          <ul>
            {readonlyDecisionCard.allowedLocalChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="blocked">
          <span>Blocked remote actions</span>
          <ul>
            {readonlyDecisionCard.blockedRemoteActions.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="hold">
          <span>CEO wording</span>
          <p>{readonlyDecisionCard.requiredCeoWording}</p>
          <p>{readonlyDecisionCard.postRunReviewRequirement}</p>
          <p>Automated remote run: {readonlyDecisionCard.automatedRemoteRun ? "true" : "false"}.</p>
        </article>
      </div>
      <div className="runtime-post-run-prep-card" aria-label="Post-run review preparation summary">
        <article className="ready">
          <span>Post-readonly runtime</span>
          <strong>{postReadonlyRuntime.state}</strong>
          <p>{postReadonlyRuntime.userFacingSummary}</p>
          <p>
            Row coverage {postReadonlyRuntime.rowCoverage.coverageStatus}:{" "}
            {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows,
            missing {postReadonlyRuntime.rowCoverage.missingRows}. {postReadonlyRuntime.rowCoverage.reason}.
          </p>
          <p>
            Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
          </p>
        </article>
        <article>
          <span>Accepted result classes</span>
          <strong>{executionPreview.postRunAcceptedOutcomeCategories.length} categories</strong>
          <p>{executionPreview.postRunAcceptedOutcomeCategories.slice(0, 3).join(", ")}.</p>
        </article>
        <article className="blocked">
          <span>Cannot promote after run</span>
          <strong>{executionPreview.blockedPromotions.length} promotions blocked</strong>
          <p>{executionPreview.blockedPromotions.join(", ")}.</p>
        </article>
        <article className="hold">
          <span>Immediate next review</span>
          <strong>post-run review first</strong>
          <p>Record one sanitized attempt outcome, no secrets, no row payloads, then keep readiness promotion blocked.</p>
        </article>
      </div>
      <details className="runtime-remote-guard-details">
        <summary>遠端唯讀嘗試守門（需 CEO 另行點名）</summary>
        <p>這裡保留單次 readonly attempt 的命令預覽、停止條件與 post-run review；目前不會自動連線或執行 SQL。</p>
        <RuntimeSectionLabel
          title="One-attempt guard"
          text="Manual readonly attempt preview, stop rules, and required post-run review."
        />
        <div className="runtime-single-attempt-card" aria-label="Single-attempt authorization command card">
          <article>
            <span>Single-attempt command card</span>
            <strong>{executionPreview.approvalStatus}</strong>
            <p>
              Required confirmation: {executionPreview.requiredConfirmation}. Automated remote run remains{" "}
              {executionPreview.safety.automatedRemoteRun ? "enabled" : "disabled"}.
            </p>
            <code>{executionPreview.exactCommandPreview ?? "blocked until CEO names one bounded readonly attempt"}</code>
          </article>
          <article>
            <span>Prerequisites</span>
            <ul>
              {executionPreview.manualRunPrerequisites.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="blocked">
            <span>Stop conditions</span>
            <ul>
              {executionPreview.stopConditions.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="runtime-post-run-review-card" aria-label="Post-run review readiness card">
          <article>
            <span>Post-run review target</span>
            <strong>{executionPreview.postRunReviewTarget}</strong>
            <p>Readiness promotion remains {executionPreview.readinessPromotionBlocked ? "blocked" : "open"}.</p>
          </article>
          <article>
            <span>Accepted outcomes</span>
            <ul>
              {executionPreview.postRunAcceptedOutcomeCategories.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="blocked">
            <span>Blocked promotions</span>
            <ul>
              {executionPreview.blockedPromotions.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </details>
      <details className="runtime-evidence-details">
        <summary>Evidence details / work lanes（PM / 工程）</summary>
        <p>本區保留 local preflight、readonly evidence、freshness evidence 與 owner lane，避免 briefing 第一屏過度治理化。</p>
        <RuntimeSectionLabel
          title="Evidence details"
          text="Local preflight, readonly evidence, freshness status, and execution preview."
        />
        <div className="runtime-readiness-command">
          <article>
            <span>Local preflight</span>
            <code>{readiness.localPreflightCommand}</code>
            <p>{readiness.localPreflightState}</p>
          </article>
          <article>
            <span>Next guarded decision</span>
            <code>{readiness.nextRemoteCommand}</code>
            <p>只作為 CEO 手動 gate 的命令提示；不得由 UI 或 review gate 自動執行。</p>
          </article>
        </div>
        <div className="runtime-preflight-status">
          <article
            aria-label={`Runtime hardening exit ${runtimeHardeningExit.status}`}
            className="readying"
          >
            <span>Runtime hardening exit</span>
            <strong>{runtimeHardeningExit.stage}</strong>
            <p>
              Accepted {runtimeHardeningExit.acceptedCount}; blocked {runtimeHardeningExit.blockedCount}.{" "}
              Public {runtimeHardeningExit.publicDataSource}; score {runtimeHardeningExit.scoreSource}.
            </p>
            <p>{runtimeHardeningExit.nextAction}</p>
            <p>{runtimeHardeningExit.stopLine}</p>
            <div className="runtime-public-boundary-summary" aria-label={runtimeHardeningExit.publicBoundaryLabel}>
              {runtimeHardeningExit.publicBoundaryItems.map((item) => (
                <span className={item.state} key={item.label}>
                  <b>{item.label}</b>
                  <i>{item.publicMessage}</i>
                </span>
              ))}
            </div>
          </article>
          <article className="active" aria-label="Supabase readonly evidence accepted">
            <span>Readonly evidence</span>
            <strong>{readonlyEvidence.evidenceStatus}</strong>
            <p>{readonlyEvidence.acceptedScope}</p>
            <p>Objects reachable: {readonlyEvidence.objects.length}. Next: {readonlyEvidence.nextRuntimeGate}.</p>
            <p>{readonlyEvidence.stopLine}</p>
          </article>
          <article className="readying" aria-label="CEO next runtime move">
            <span>CEO next move</span>
            <strong>
              Runtime {decision.recommendedWorkMix.runtime}% / Supabase readonly{" "}
              {decision.recommendedWorkMix.supabaseReadonly}%
            </strong>
            <p>
              {decision.requiredHumanStep}. Manual approval{" "}
              {executionPreview.manualApprovalRequired ? "required" : "not required"}; automated remote run{" "}
              {executionPreview.safety.automatedRemoteRun ? "enabled" : "disabled"}.
            </p>
            <p>Stop first: {executionPreview.stopConditions[0]}.</p>
          </article>
          <article className="readying runtime-gate-decision-brief" aria-label={`Runtime gate decision ${runtimeGateBrief.status}`}>
            <span>Runtime gate decision</span>
            <strong>{runtimeGateBrief.status}</strong>
            <p>
              Public {runtimeGateBrief.publicDataSource}; score {runtimeGateBrief.scoreSource}.{" "}
              {runtimeGateBrief.requiredAuthorization}.
            </p>
            <p>{runtimeGateBrief.ceoRecommendation}</p>
            <p>Blocked: {runtimeGateBrief.blockedNow.slice(0, 5).join(", ")}.</p>
            <p>Post-run: {runtimeGateBrief.postRunReview.slice(0, 2).join("; ")}.</p>
          </article>
          <article
            aria-label={`Freshness runtime activation ${freshnessActivation.state}`}
            className={freshnessActivation.state === "blocked" ? "blocked" : "readying"}
          >
            <span>Freshness runtime activation</span>
            <strong>{freshnessActivation.state}</strong>
            <p>
              DATA_FRESHNESS_SOURCE={freshnessActivation.dataFreshnessSource} / reads{" "}
              {freshnessActivation.supabaseRuntimeReads} / public {freshnessActivation.publicDataSource}.
            </p>
            <p>{freshnessActivation.decision}</p>
            <p>{freshnessActivation.stopLine}</p>
          </article>
          <article
            aria-label={`Freshness readonly latest evidence ${freshnessLatestEvidence.evidenceStatus}`}
            className="active"
          >
            <span>Freshness latest evidence</span>
            <strong>{freshnessLatestEvidence.evidenceStatus}</strong>
            <p>
              {freshnessLatestEvidence.market} / {freshnessLatestEvidence.asOfDate} /{" "}
              {freshnessLatestEvidence.sourceName}; scoreSource {freshnessLatestEvidence.scoreSource}; public{" "}
              {freshnessLatestEvidence.publicDataSource}.
            </p>
            <p>{freshnessLatestEvidence.acceptedScope}</p>
            <p>{freshnessLatestEvidence.stopLine}</p>
          </article>
          <article
            aria-label={`Freshness readonly smoke report ${readonlySmokeReport.outcome}`}
            className={readonlySmokeReport.outcome === "blocked" ? "blocked" : "readying"}
          >
            <span>Freshness readonly smoke</span>
            <strong>{readonlySmokeReport.outcome}</strong>
            <p>
              Activation {readonlySmokeReport.activation.state}; connection{" "}
              {readonlySmokeReport.activation.connectionAttempted ? "attempted" : "not attempted"}; SQL{" "}
              {readonlySmokeReport.activation.sqlExecuted ? "executed" : "not executed"}.
            </p>
            <p>
              Secrets printed: {readonlySmokeReport.safety.secretsPrinted ? "true" : "false"} / row payloads printed:{" "}
              {readonlySmokeReport.safety.rowPayloadsPrinted ? "true" : "false"}.
            </p>
            <p>{readonlySmokeReport.stopLine}</p>
          </article>
          <article
            aria-label={`Runtime ${decision.recommendedWorkMix.runtime}% / Supabase readonly ${decision.recommendedWorkMix.supabaseReadonly}%`}
            className={decision.status === "blocked" ? "blocked" : "readying"}
          >
            <span>CEO decision packet</span>
            <strong>{decision.decision}</strong>
            <p>
              Runtime {decision.recommendedWorkMix.runtime}% / Supabase readonly{" "}
              {decision.recommendedWorkMix.supabaseReadonly}%. Warnings {decision.warningCount}.{" "}
              {decision.requiredHumanStep}.
            </p>
          </article>
          <article className={preflight.status === "blocked" ? "blocked" : "readying"}>
            <span>Local preflight status</span>
            <strong>{preflight.status === "blocked" ? "blocked" : "ready for guarded decision"}</strong>
            <p>
              {preflight.status === "blocked"
                ? `缺少 ${preflight.missingEnv.length} 個必要環境值，遠端唯讀驗證維持 blocked。`
                : "本地檢查已具備條件；安全開關仍預設 disabled，需 CEO 單次手動 gate。"}
            </p>
          </article>
          <article
            aria-label={`Execution preview automated remote run ${
              executionPreview.safety.automatedRemoteRun ? "true" : "false"
            }; Stop conditions ${executionPreview.stopConditions.length} active`}
            className={executionPreview.status === "blocked" ? "blocked" : "readying"}
          >
            <span>Execution preview</span>
            <strong>{executionPreview.approvalStatus}</strong>
            <p>
              Manual approval: {executionPreview.manualApprovalRequired ? "required" : "not required"} /{" "}
              {executionPreview.manualApprovalState}.
            </p>
            <p>
              Manual prerequisites: {executionPreview.manualRunPrerequisites.length} active. First:{" "}
              {executionPreview.manualRunPrerequisites[0]}.
            </p>
            <p>
              Post-run target: {executionPreview.postRunReviewTarget}. Outcome categories:{" "}
              {executionPreview.postRunAcceptedOutcomeCategories.length}.
            </p>
            <p>
              Readiness promotion: {executionPreview.readinessPromotionBlocked ? "blocked" : "open"}.
              Blocked promotions: {executionPreview.blockedPromotions.length}.
            </p>
            <p>
              Automated remote run: {executionPreview.safety.automatedRemoteRun ? "true" : "false"}.
              Command preview: {executionPreview.nextRemoteCommand ?? "blocked"}.
            </p>
            <p>
              Stop conditions: {executionPreview.stopConditions.length} active. First:{" "}
              {executionPreview.stopConditions[0]}.
            </p>
          </article>
          {preflight.boundaries.map((boundary) => (
            <article className={boundary.status} key={boundary.name}>
              <span>{boundary.name}</span>
              <strong>{boundary.observed}</strong>
              <p>expected: {boundary.expected}</p>
            </article>
          ))}
        </div>
        <RuntimeSectionLabel
          title="Work lanes"
          text="Owner-level runtime lanes and remaining local progress."
        />
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
      </details>
    </section>
  );
}

function RuntimeSectionLabel({ text, title }: { text: string; title: string }) {
  return (
    <div className="runtime-section-label" aria-label={`Runtime section ${title}`}>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
