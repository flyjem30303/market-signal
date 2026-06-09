import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-a1-twii-pm-intake-decision-summary.mjs";
const checkPath = "scripts/check-a1-twii-pm-intake-decision-summary.mjs";
const packagePath = "package.json";
const mainlinePath = "scripts/report-beta-mainline-current-route.mjs";
const mainlineCheckPath = "scripts/check-beta-mainline-current-route.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const mainlineSource = read(mainlinePath);
const mainlineCheckSource = read(mainlineCheckPath);
const projectStatus = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "a1_twii_pm_intake_decision_summary"],
  [reportPath, reportSource, "compress_a1_twii_evidence_intake_to_one_pm_decision_summary"],
  [reportPath, reportSource, "request_a1_bounded_no_secret_repairs_before_pm_classification"],
  [reportPath, reportSource, "postReplyOneRunnerProof"],
  [reportPath, reportSource, "focused_gate_registered_lightweight_proof_summary"],
  [reportPath, reportSource, "check:a1-twii-post-reply-pm-classification-once"],
  [reportPath, reportSource, "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate"],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "a1_twii_pm_intake_decision_summary_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:a1-twii-pm-intake-decision-summary"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-pm-intake-decision-summary"],
  [mainlinePath, mainlineSource, "a1PmIntakeDecisionSummary"],
  [mainlineCheckPath, mainlineCheckSource, "a1TwiiPmIntakeDecisionSummary"],
  [statusPath, projectStatus, "Latest A1 TWII PM intake decision summary slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-pm-intake-decision-summary"] !==
  "node scripts/report-a1-twii-pm-intake-decision-summary.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-pm-intake-decision-summary`);
}
if (
  pkg.scripts?.["check:a1-twii-pm-intake-decision-summary"] !==
  "node scripts/check-a1-twii-pm-intake-decision-summary.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-pm-intake-decision-summary`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-twii-pm-intake-decision-summary"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 240000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("PM intake decision summary report should exit 0");
if (!report) {
  problems.push("PM intake decision summary report should emit JSON");
} else {
  if (report.mode !== "a1_twii_pm_intake_decision_summary") problems.push("report mode mismatch");
  if (
    ![
      "a1_twii_pm_intake_decision_summary_ready_waiting_bounded_repairs",
      "a1_twii_pm_intake_ready_for_separate_outcome_gate_candidate"
    ].includes(report.status)
  ) {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.currentState?.pendingCount !== 4) {
    problems.push("current TWII state should still show four pending slots before A1 reply");
  }
  if (report.currentState?.canOpenTwiiOutcomeGate !== false) {
    problems.push("TWII outcome gate must remain closed in current state");
  }
  if (!Array.isArray(report.boundedRepairIntake?.repairRequests) || report.boundedRepairIntake.repairRequests.length !== 4) {
    problems.push("boundedRepairIntake must include four repair requests");
  }
  for (const slot of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    if (!report.currentState?.pendingSlotIds?.includes(slot)) problems.push(`missing pending slot ${slot}`);
    if (!report.boundedRepairIntake?.repairRequests?.some((request) => request.evidenceSlotId === slot)) {
      problems.push(`missing bounded repair request for ${slot}`);
    }
  }
  if (report.pmClassificationAfterA1Reply?.firstCommand !== "cmd.exe /c npm run check:a1-twii-evidence-response-shape") {
    problems.push("PM classification first command must be the shape guard");
  }
  if (report.pmClassificationAfterA1Reply?.oneRunnerCommand !== "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") {
    problems.push("PM classification one-runner command mismatch");
  }
  if (!Array.isArray(report.pmClassificationAfterA1Reply?.classificationOptions)) {
    problems.push("classification options must be present");
  }
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    if (!report.pmClassificationAfterA1Reply?.classificationOptions?.includes(option)) {
      problems.push(`classification option missing ${option}`);
    }
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (!report.postReplyOneRunnerProof) {
    problems.push("postReplyOneRunnerProof must be present");
  } else {
    if (report.postReplyOneRunnerProof.status !== "focused_gate_registered_lightweight_proof_summary") {
      problems.push("postReplyOneRunnerProof.status should be lightweight proof summary");
    }
    if (report.postReplyOneRunnerProof.focusedGateName !== "a1-twii-post-reply-pm-classification-once") {
      problems.push("postReplyOneRunnerProof.focusedGateName should be a1-twii-post-reply-pm-classification-once");
    }
    if (report.postReplyOneRunnerProof.proofCommand !== "cmd.exe /c npm run check:a1-twii-post-reply-pm-classification-once") {
      problems.push("postReplyOneRunnerProof.proofCommand should point to the A1 post-reply checker");
    }
    if (report.postReplyOneRunnerProof.routineRunnerCommand !== "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") {
      problems.push("postReplyOneRunnerProof.routineRunnerCommand should point to the A1 post-reply runner");
    }
    if (
      report.postReplyOneRunnerProof.currentPendingScenario?.expectedStatus !==
      "blocked_waiting_a1_twii_four_slot_no_secret_evidence"
    ) {
      problems.push("postReplyOneRunnerProof should preserve the current pending-evidence expected status");
    }
    if (
      !report.postReplyOneRunnerProof.currentPendingScenario?.expectedStepIds?.includes(
        "external-input-response-readiness"
      )
    ) {
      problems.push("postReplyOneRunnerProof current scenario should include response-readiness");
    }
    if (
      report.postReplyOneRunnerProof.currentPendingScenario?.expectedNextCommand !==
      "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
    ) {
      problems.push("postReplyOneRunnerProof current scenario should return to the four-slot reply request");
    }
    if (
      report.postReplyOneRunnerProof.acceptedFixtureScenario?.expectedStatus !==
      "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate"
    ) {
      problems.push("postReplyOneRunnerProof should preserve the accepted-fixture outcome-gate status");
    }
    for (const stepId of [
      "external-input-response-readiness",
      "a1-no-secret-shape-guard",
      "a1-pm-classification-route",
      "a1-reviewed-outcome-surface",
      "a1-source-rights-readiness-summary"
    ]) {
      if (!report.postReplyOneRunnerProof.acceptedFixtureScenario?.expectedStepIds?.includes(stepId)) {
        problems.push(`postReplyOneRunnerProof accepted fixture missing step ${stepId}`);
      }
    }
    if (
      report.postReplyOneRunnerProof.acceptedFixtureScenario?.expectedNextCommand !==
      "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
    ) {
      problems.push("postReplyOneRunnerProof accepted fixture should route to A1 outcome-gate candidate");
    }
    if (report.postReplyOneRunnerProof.ledgerModified !== false) {
      problems.push("postReplyOneRunnerProof.ledgerModified must be false");
    }
    if (report.postReplyOneRunnerProof.valuesAreFixtureOnly !== true) {
      problems.push("postReplyOneRunnerProof.valuesAreFixtureOnly must be true");
    }
    if (report.postReplyOneRunnerProof.runtimeBoundary?.publicDataSource !== "mock") {
      problems.push("postReplyOneRunnerProof publicDataSource must remain mock");
    }
    if (report.postReplyOneRunnerProof.runtimeBoundary?.scoreSource !== "mock") {
      problems.push("postReplyOneRunnerProof scoreSource must remain mock");
    }
    for (const flag of [
      "applyCommandEmitted",
      "candidateArtifactGenerated",
      "deploymentAuthorized",
      "evidenceRecorded",
      "marketDataFetched",
      "rowCoverageAwarded",
      "scoreSourceRealEnabled",
      "secretsPrinted",
      "sourceRightsApproved",
      "sqlExecuted",
      "supabaseReadsEnabled",
      "supabaseWritesEnabled"
    ]) {
      if (report.postReplyOneRunnerProof.safety?.[flag] !== false) {
        problems.push(`postReplyOneRunnerProof.safety.${flag} must remain false`);
      }
    }
  }
  for (const flag of [
    "applyCommandEmitted",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "deploymentAuthorized",
    "evidenceRecorded",
    "marketDataFetched",
    "publicSourcePromoted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourceRightsApproved",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must remain false`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_pm_intake_decision_summary_guard_ready",
      pendingCount: report.currentState.pendingCount,
      repairRequestCount: report.boundedRepairIntake.repairRequests.length,
      publicDataSource: report.runtimeBoundary.publicDataSource,
      scoreSource: report.runtimeBoundary.scoreSource
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`${filePath} missing`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function forbiddenPatterns() {
  return [
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}
