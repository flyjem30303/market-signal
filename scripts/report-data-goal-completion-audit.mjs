import { spawnSync } from "node:child_process";

const readiness = runJson("scripts/report-data-goal-readiness.mjs");
const executionBridge = runJson("scripts/report-data-goal-execution-review-bridge.mjs");
const boundedAlignment = runJson("scripts/report-bounded-readonly-final-local-alignment.mjs");

const evidenceRowsOk = Array.isArray(readiness.evidenceCoverage) && readiness.evidenceCoverage.every((row) => row.ok === true);
const mockBoundaryOk = readiness.safety?.publicDataSource === "mock" && readiness.safety?.scoreSource === "mock";
const noRemoteAttempt = readiness.safety?.connectionAttempted === false;
const finalPreRemoteReady =
  readiness.status === "ready_at_final_pre_remote_decision_point" &&
  readiness.dataGoalReadinessPercent === 92 &&
  evidenceRowsOk &&
  executionBridge.status === "ready_for_explicit_authorized_one_attempt_flow" &&
  boundedAlignment.status === "ready_for_separately_named_bounded_readonly_decision" &&
  mockBoundaryOk;

const audit = {
  mode: "data_goal_completion_audit",
  status: finalPreRemoteReady ? "audit_passed_not_100_until_authorized_attempt" : "audit_blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  currentDataGoalReadinessPercent: readiness.dataGoalReadinessPercent,
  goalCompletionClaim: finalPreRemoteReady
    ? "Not complete at 100 because exactly one bounded Supabase readonly attempt has not been explicitly authorized or executed."
    : "Not complete because local readiness evidence does not yet prove the final pre-remote decision point.",
  requirements: [
    {
      id: "data-supabase-market-evidence-line",
      requirement: "Data / Supabase / Market Evidence line has explicit status.",
      evidence: "scripts/report-data-goal-readiness.mjs",
      status: readiness.completionDefinition?.dataSupabaseMarketEvidenceLine,
      result: readiness.completionDefinition?.dataSupabaseMarketEvidenceLine === "local_final_pre_remote_decision_ready" ? "proved" : "not_proved"
    },
    {
      id: "bounded-readonly-local-prerequisites",
      requirement: "Bounded readonly local prerequisites and execution conditions are ready.",
      evidence: "scripts/report-bounded-readonly-final-local-alignment.mjs",
      status: boundedAlignment.status,
      result: boundedAlignment.status === "ready_for_separately_named_bounded_readonly_decision" ? "proved" : "not_proved"
    },
    {
      id: "execution-to-post-run-review-bridge",
      requirement: "Authorized attempt path maps to immediate prechecks, exactly one runner, sanitized output, and post-run review.",
      evidence: "scripts/report-data-goal-execution-review-bridge.mjs",
      status: executionBridge.status,
      result: executionBridge.status === "ready_for_explicit_authorized_one_attempt_flow" ? "proved" : "not_proved"
    },
    {
      id: "a1-evidence-line",
      requirement: "A1 evidence, row coverage, source readiness, data quality, and mock/real boundary are explicit.",
      evidence: "scripts/report-data-goal-readiness.mjs evidenceCoverage",
      status: evidenceRowsOk ? "all_nine_evidence_rows_ok" : "evidence_rows_incomplete",
      result: evidenceRowsOk ? "proved" : "not_proved"
    },
    {
      id: "remote-readonly-attempt",
      requirement: "Exactly one bounded Supabase readonly attempt is completed if explicitly authorized.",
      evidence: "scripts/report-data-goal-readiness.mjs completionDefinition.remoteReadonlyAttempt",
      status: readiness.completionDefinition?.remoteReadonlyAttempt,
      result: readiness.completionDefinition?.remoteReadonlyAttempt === "not_run_requires_separate_named_authorization" ? "pending_authorization" : "requires_review"
    },
    {
      id: "public-source-boundary",
      requirement: "publicDataSource state is accurate and not promoted.",
      evidence: "scripts/report-data-goal-readiness.mjs safety",
      status: readiness.safety?.publicDataSource,
      result: readiness.safety?.publicDataSource === "mock" ? "proved" : "not_proved"
    },
    {
      id: "score-source-boundary",
      requirement: "scoreSource state is accurate and not promoted.",
      evidence: "scripts/report-data-goal-readiness.mjs safety",
      status: readiness.safety?.scoreSource,
      result: readiness.safety?.scoreSource === "mock" ? "proved" : "not_proved"
    }
  ],
  completionBlockers: finalPreRemoteReady
    ? [
        "Need explicit one-time authorization to execute exactly one bounded Supabase readonly row coverage attempt.",
        "Need sanitized post-run review from that attempt before 100% can be claimed.",
        "Need data-quality interpretation after sanitized post-run result.",
        "Need separate later gate before any publicDataSource=supabase or scoreSource=real promotion."
      ]
    : ["Repair local data-goal readiness evidence before asking for remote authorization."],
  nextShortestPath: finalPreRemoteReady
    ? "Chairman says: execute exactly one bounded Supabase readonly row coverage attempt. PM then runs immediate prechecks, one guarded runner, sanitized post-run review, and updates this audit."
    : "Repair failed local evidence rows, rerun data-goal readiness, then rerun completion audit.",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    providerTermsFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This completion audit does not execute Supabase, run SQL, write data, fetch market data, print secrets, promote publicDataSource=supabase, award row coverage points, lift data quality, or set scoreSource=real."
};

console.log(JSON.stringify(audit, null, 2));

function runJson(script) {
  const run = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    throw new Error(`${script} failed: ${run.stderr.trim()}`);
  }

  return JSON.parse(run.stdout);
}
