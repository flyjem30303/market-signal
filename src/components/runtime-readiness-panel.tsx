import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getFreshnessRuntimeActivationSummary } from "@/lib/freshness-runtime-activation";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";
import { getSupabaseReadonlyDecision } from "@/lib/supabase-readonly-decision";
import { getSupabaseReadonlyExecutionPreview } from "@/lib/supabase-readonly-execution-preview";
import { getSupabaseReadonlyLocalPreflight } from "@/lib/supabase-readonly-local-preflight";

export function RuntimeReadinessPanel() {
  const readiness = getRuntimeReadinessSummary();
  const preflight = getSupabaseReadonlyLocalPreflight();
  const decision = getSupabaseReadonlyDecision(preflight);
  const executionPreview = getSupabaseReadonlyExecutionPreview(decision);
  const freshnessActivation = getFreshnessRuntimeActivationSummary();
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();

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
          <p>只作為 CEO 手動 gate 的命令提示；不得由 UI 或 review gate 自動執行。</p>
        </article>
      </div>
      <div className="runtime-preflight-status">
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
