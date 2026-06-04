import { spawnSync } from "node:child_process";

const boundedFinalAlignment = runJson("scripts/report-bounded-readonly-final-local-alignment.mjs");
const rowCoveragePreexecution = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");
const providerTermsRollup = runJson("scripts/report-provider-specific-terms-post-review-rollup.mjs");
const a1Handoff = runJson("scripts/report-a1-supabase-market-evidence-handoff-candidate.mjs");
const projectSnapshot = runJson("scripts/report-project-progress-snapshot.mjs");
const rowCoverageEvidenceAcceptance = runJson("scripts/report-row-coverage-evidence-acceptance.mjs");
const dataQualityChecklist = runJson("scripts/report-data-quality-evidence-checklist.mjs");
const sourceRightsChecklist = runJson("scripts/report-source-rights-disclosure-checklist.mjs");
const executionReviewBridge = runJson("scripts/report-data-goal-execution-review-bridge.mjs");
const boundedReadonlyPostRunReview = runJson("scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs");

const localReady =
  boundedFinalAlignment.status === "ready_for_separately_named_bounded_readonly_decision" &&
  rowCoveragePreexecution.status === "ready_to_present_not_execute" &&
  providerTermsRollup.readyForNextReadonlyDecision === true &&
  rowCoverageEvidenceAcceptance.status === "accepted_for_next_decision" &&
  dataQualityChecklist.status === "local_checklist_ready_remote_evidence_missing" &&
  sourceRightsChecklist.status === "local_checklist_ready_external_rights_unverified" &&
  executionReviewBridge.status === "ready_for_explicit_authorized_one_attempt_flow" &&
  boundedReadonlyPostRunReview.status === "ok" &&
  a1Handoff.currentA1EvidenceLine?.handoffPacket === "ready_for_mainline_review_not_promotion" &&
  a1Handoff.currentA1EvidenceLine?.readonlyLocalPreflight === "ready_for_guarded_readonly_decision" &&
  a1Handoff.currentA1EvidenceLine?.readonlyDecisionPacket === "ready_for_ceo_decision" &&
  a1Handoff.currentA1EvidenceLine?.rowCoveragePreexecutionPacket === "ready_to_present_not_execute" &&
  projectSnapshot.safety?.publicDataSource === "mock" &&
  projectSnapshot.safety?.scoreSource === "mock";

const remoteAttemptCompleted = boundedReadonlyPostRunReview.status === "ok";

const dataGoalReadinessPercent = localReady ? (remoteAttemptCompleted ? 96 : 92) : 78;

const report = {
  mode: "data_goal_readiness",
  status: localReady
    ? remoteAttemptCompleted
      ? "bounded_readonly_attempt_reviewed_aggregate_incomplete"
      : "ready_at_final_pre_remote_decision_point"
    : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  dataGoalReadinessPercent,
  ceoSummary: localReady
    ? remoteAttemptCompleted
      ? "Data/Supabase/Market Evidence has passed local readiness and has one accepted bounded Supabase readonly post-run review. The remote path worked, but aggregate row coverage is incomplete, so data-side 100% now depends on a coverage/backfill route instead of another generic readonly attempt."
      : "Data/Supabase/Market Evidence is locally aligned for the final pre-remote decision point. Data-side 100% now depends on a separately named exactly-one bounded readonly attempt or a chairman decision to stop at pre-execution readiness."
    : "Data-side readiness is not locally aligned; repair the failed local packets before discussing remote Supabase readonly execution.",
  pmNextShortestPath: localReady
    ? remoteAttemptCompleted
      ? "Do not rerun the generic bounded readonly attempt. Use the accepted aggregate-incomplete evidence to choose a data coverage route: source-specific backfill design, controlled ingestion design, or keep mock runtime while coverage remains incomplete."
      : "If the chairman explicitly authorizes the named action, run exactly one bounded Supabase readonly attempt after immediate prechecks, then record sanitized post-run review. Otherwise keep publicDataSource and scoreSource mock and continue runtime work."
    : "Run this report's source checkers, repair failed local evidence, and rerun data-goal readiness.",
  completionDefinition: {
    dataSupabaseMarketEvidenceLine: localReady ? "local_final_pre_remote_decision_ready" : "not_ready",
    boundedReadonlyLocalPrerequisites: boundedFinalAlignment.status,
    rowCoveragePreexecutionPacket: rowCoveragePreexecution.status,
    providerTermsPostReviewRollup: providerTermsRollup.status,
    rowCoveragePostRunAcceptanceRules: rowCoverageEvidenceAcceptance.status,
    dataQualityGate: dataQualityChecklist.status,
    sourceReadinessGate: sourceRightsChecklist.status,
    executionReviewBridge: executionReviewBridge.status,
    boundedReadonlyPostRunReview: boundedReadonlyPostRunReview.status,
    a1EvidenceLine: a1Handoff.currentA1EvidenceLine,
    remoteReadonlyAttempt: remoteAttemptCompleted
      ? "completed_with_sanitized_aggregate_incomplete_review"
      : "not_run_requires_separate_named_authorization",
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  remainingAuthorizationItems: remoteAttemptCompleted
    ? [
        "Choose the data coverage route before any data-quality lift.",
        "Keep runtime promotion blocked until row coverage, source rights, QA, and promotion gates pass.",
        "Do not rerun the generic readonly attempt without a new one-attempt decision gate and a changed diagnostic purpose."
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
      id: "row-coverage-evidence-acceptance",
      status: rowCoverageEvidenceAcceptance.status,
      ok: rowCoverageEvidenceAcceptance.status === "accepted_for_next_decision"
    },
    {
      id: "data-quality-evidence-checklist",
      status: dataQualityChecklist.status,
      ok: dataQualityChecklist.status === "local_checklist_ready_remote_evidence_missing"
    },
    {
      id: "source-rights-disclosure-checklist",
      status: sourceRightsChecklist.status,
      ok: sourceRightsChecklist.status === "local_checklist_ready_external_rights_unverified"
    },
    {
      id: "data-goal-execution-review-bridge",
      status: executionReviewBridge.status,
      ok: executionReviewBridge.status === "ready_for_explicit_authorized_one_attempt_flow"
    },
    {
      id: "row-coverage-bounded-readonly-attempt-post-run-review",
      status: boundedReadonlyPostRunReview.status,
      ok: boundedReadonlyPostRunReview.status === "ok"
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
    "scripts/report-row-coverage-evidence-acceptance.mjs",
    "scripts/report-data-quality-evidence-checklist.mjs",
    "scripts/report-source-rights-disclosure-checklist.mjs",
    "scripts/report-data-goal-execution-review-bridge.mjs",
    "scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs",
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
