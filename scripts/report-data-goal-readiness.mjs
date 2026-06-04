import { spawnSync } from "node:child_process";

const boundedFinalAlignment = runJson("scripts/report-bounded-readonly-final-local-alignment.mjs");
const rowCoveragePreexecution = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");
const providerTermsRollup = runJson("scripts/report-provider-specific-terms-post-review-rollup.mjs");
const a1Handoff = runJson("scripts/report-a1-supabase-market-evidence-handoff-candidate.mjs");
const projectSnapshot = runJson("scripts/report-project-progress-snapshot.mjs");

const localReady =
  boundedFinalAlignment.status === "ready_for_separately_named_bounded_readonly_decision" &&
  rowCoveragePreexecution.status === "ready_to_present_not_execute" &&
  providerTermsRollup.readyForNextReadonlyDecision === true &&
  a1Handoff.currentA1EvidenceLine?.handoffPacket === "ready_for_mainline_review_not_promotion" &&
  a1Handoff.currentA1EvidenceLine?.readonlyLocalPreflight === "ready_for_guarded_readonly_decision" &&
  a1Handoff.currentA1EvidenceLine?.readonlyDecisionPacket === "ready_for_ceo_decision" &&
  a1Handoff.currentA1EvidenceLine?.rowCoveragePreexecutionPacket === "ready_to_present_not_execute" &&
  projectSnapshot.safety?.publicDataSource === "mock" &&
  projectSnapshot.safety?.scoreSource === "mock";

const remoteAttemptCompleted =
  boundedFinalAlignment.safety?.connectionAttempted === true ||
  projectSnapshot.safety?.connectionAttempted === true;

const dataGoalReadinessPercent = localReady ? (remoteAttemptCompleted ? 100 : 92) : 78;

const report = {
  mode: "data_goal_readiness",
  status: localReady
    ? remoteAttemptCompleted
      ? "data_goal_remote_readonly_review_required"
      : "ready_at_final_pre_remote_decision_point"
    : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  dataGoalReadinessPercent,
  ceoSummary: localReady
    ? "Data/Supabase/Market Evidence is locally aligned for the final pre-remote decision point. Data-side 100% now depends on a separately named exactly-one bounded readonly attempt or a chairman decision to stop at pre-execution readiness."
    : "Data-side readiness is not locally aligned; repair the failed local packets before discussing remote Supabase readonly execution.",
  pmNextShortestPath: localReady
    ? "If the chairman explicitly authorizes the named action, run exactly one bounded Supabase readonly attempt after immediate prechecks, then record sanitized post-run review. Otherwise keep publicDataSource and scoreSource mock and continue runtime work."
    : "Run this report's source checkers, repair failed local evidence, and rerun data-goal readiness.",
  completionDefinition: {
    dataSupabaseMarketEvidenceLine: localReady ? "local_final_pre_remote_decision_ready" : "not_ready",
    boundedReadonlyLocalPrerequisites: boundedFinalAlignment.status,
    rowCoveragePreexecutionPacket: rowCoveragePreexecution.status,
    providerTermsPostReviewRollup: providerTermsRollup.status,
    a1EvidenceLine: a1Handoff.currentA1EvidenceLine,
    remoteReadonlyAttempt: remoteAttemptCompleted
      ? "detected_requires_sanitized_post_run_review"
      : "not_run_requires_separate_named_authorization",
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  remainingAuthorizationItems: remoteAttemptCompleted
    ? [
        "Review sanitized post-run result before any data-quality lift.",
        "Keep runtime promotion blocked until separate promotion gates pass."
      ]
    : [
        "Separately name exactly one bounded Supabase readonly row coverage attempt.",
        "Confirm immediate prechecks will run before the attempt.",
        "Confirm sanitized aggregate output only.",
        "Confirm immediate post-run review.",
        "Confirm no retry in the same slice."
      ],
  evidenceCoverage: [
    {
      id: "bounded-readonly-final-local-alignment",
      status: boundedFinalAlignment.status,
      ok: boundedFinalAlignment.status === "ready_for_separately_named_bounded_readonly_decision"
    },
    {
      id: "row-coverage-readonly-preexecution-packet",
      status: rowCoveragePreexecution.status,
      ok: rowCoveragePreexecution.status === "ready_to_present_not_execute"
    },
    {
      id: "provider-specific-terms-post-review-rollup",
      status: providerTermsRollup.status,
      ok: providerTermsRollup.readyForNextReadonlyDecision === true
    },
    {
      id: "a1-supabase-market-evidence-handoff-candidate",
      status: a1Handoff.status,
      ok:
        a1Handoff.currentA1EvidenceLine?.handoffPacket === "ready_for_mainline_review_not_promotion" &&
        a1Handoff.currentA1EvidenceLine?.readonlyLocalPreflight === "ready_for_guarded_readonly_decision" &&
        a1Handoff.currentA1EvidenceLine?.readonlyDecisionPacket === "ready_for_ceo_decision" &&
        a1Handoff.currentA1EvidenceLine?.rowCoveragePreexecutionPacket === "ready_to_present_not_execute"
    },
    {
      id: "project-progress-snapshot",
      status: projectSnapshot.status,
      ok: projectSnapshot.safety?.publicDataSource === "mock" && projectSnapshot.safety?.scoreSource === "mock"
    }
  ],
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
  stillBlocked: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets",
    "printing row payloads or internal identifiers",
    "publicDataSource=supabase",
    "scoreSource=real",
    "data-quality score lift",
    "runtime promotion"
  ],
  sourceReports: [
    "scripts/report-bounded-readonly-final-local-alignment.mjs",
    "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
    "scripts/report-provider-specific-terms-post-review-rollup.mjs",
    "scripts/report-a1-supabase-market-evidence-handoff-candidate.mjs",
    "scripts/report-project-progress-snapshot.mjs"
  ],
  stopLine:
    "This data-goal readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, execute readonly attempts, promote publicDataSource=supabase, lift data-quality score, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));

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
