import { spawnSync } from "node:child_process";
import fs from "node:fs";

const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const pmIntakeRecordPath = "data/source-gates/twii-sanitized-candidate-artifact-pm-intake.json";

const pmIntake = readJson(pmIntakeRecordPath);
const candidate = readJson(candidateArtifactPath);
const decisionGate = runReport("scripts/report-twii-report-only-dry-run-decision-gate.mjs");
const localRunner = runReport("scripts/report-twii-report-only-local-runner.mjs");
const postRunReview = runReport("scripts/report-twii-report-only-local-runner-post-run-review.mjs");

const candidateSummary = candidate?.aggregateValidation ?? {};
const pmIntakeStatus = pmIntake?.status ?? "blocked";
const decisionGateStatus = decisionGate.output?.status ?? "blocked";
const localRunnerStatus = localRunner.output?.status ?? "blocked";
const postRunReviewStatus = postRunReview.output?.status ?? "blocked";

const chainCompleted =
  pmIntakeStatus === "twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain" &&
  decisionGate.statusCode === 0 &&
  decisionGateStatus === "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision" &&
  localRunner.statusCode === 0 &&
  localRunnerStatus === "twii_report_only_local_runner_completed_aggregate_only" &&
  postRunReview.statusCode === 0 &&
  postRunReviewStatus === "twii_report_only_local_runner_post_run_review_completed_aggregate_only";

const safety = {
  publicDataSource: "mock",
  scoreSource: "mock",
  twiiExecutionAllowedNow: false,
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  sourceDerivedCandidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

const report = {
  status: chainCompleted
    ? "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only"
    : "twii_report_only_dry_run_chain_gate_blocked_before_execution_packet_readiness",
  ok: true,
  mode: "twii_report_only_dry_run_chain_gate",
  owner: "CEO/PM",
  candidateArtifactPath,
  pmIntakeStatus,
  decisionGateStatus,
  localRunnerStatus,
  postRunReviewStatus,
  expectedRows: candidateSummary.expectedRows ?? null,
  candidateRows: candidateSummary.candidateRows ?? null,
  duplicateRows: candidateSummary.duplicateRows ?? null,
  rejectedRows: candidateSummary.rejectedRows ?? null,
  missingRows: candidateSummary.missingRows ?? null,
  executedLocalReports: {
    decisionGate: decisionGate.statusCode === 0,
    localRunner: localRunner.statusCode === 0,
    postRunReview: postRunReview.statusCode === 0
  },
  nextPMRoute: chainCompleted
    ? "twii_bounded_execution_packet_readiness_gate"
    : "repair_twii_report_only_dry_run_chain_inputs",
  decisionMeaning: chainCompleted
    ? "ready_for_next_execution_packet_readiness_only_no_write_no_promotion"
    : "blocked_until_pm_intake_decision_gate_local_runner_and_post_run_review_pass",
  ...safety,
  safety,
  detail: {
    pmIntakeRecordPath,
    decisionGateCommand: "scripts/report-twii-report-only-dry-run-decision-gate.mjs",
    localRunnerCommand: "scripts/report-twii-report-only-local-runner.mjs",
    postRunReviewCommand: "scripts/report-twii-report-only-local-runner-post-run-review.mjs",
    envKey: "A1_TWII_CANDIDATE_ARTIFACT_PATH"
  }
};

console.log(JSON.stringify(report, null, 2));

function runReport(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TWII_CANDIDATE_ARTIFACT_PATH: candidateArtifactPath
    },
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  return {
    statusCode: result.status ?? 1,
    output: parseJson(result.stdout ?? "")
  };
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function parseJson(text) {
  const start = text.indexOf("{");
  if (start < 0) return {};
  try {
    return JSON.parse(text.slice(start));
  } catch {
    return {};
  }
}
