import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-beta-launch-remaining-blockers.mjs";
const checkPath = "scripts/check-beta-launch-remaining-blockers.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_remaining_blockers_one_page"],
  [reportPath, reportSource, "buildAfterPlatformValuesProofPath()"],
  [reportPath, reportSource, "pm_git_snapshot_or_backup"],
  [reportPath, reportSource, "PM/Git snapshot safeguard"],
  [reportPath, reportSource, "beta_platform_two_values"],
  [reportPath, reportSource, "report:public-beta-external-input-request"],
  [reportPath, reportSource, "a1_twii_four_slot_evidence"],
  [reportPath, reportSource, "a1PmIntakeDecisionSummary"],
  [reportPath, reportSource, "postReplyOneRunnerProof"],
  [reportPath, reportSource, "focused_gate_registered_lightweight_proof_summary"],
  [reportPath, reportSource, "check:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "public_beta_post_reply_route_ready_for_packet_review_a1_pending"],
  [reportPath, reportSource, "report:a1-twii-pm-intake-decision-summary"],
  [reportPath, reportSource, "request_a1_bounded_no_secret_repairs_before_pm_classification"],
  [reportPath, reportSource, "treat_git_snapshot_as_safeguard_not_public_beta_input"],
  [reportPath, reportSource, "No required public Beta input; Git backup remains a recommended safeguard, not a hard blocker."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "beta_launch_remaining_blockers_ready"],
  [packagePath, JSON.stringify(pkg), "report:beta-launch-remaining-blockers"],
  [packagePath, JSON.stringify(pkg), "check:beta-launch-remaining-blockers"],
  [reviewGatePath, reviewGate, "name: \"beta-launch-remaining-blockers\""],
  [reviewGatePath, reviewGate, "\"beta-launch-remaining-blockers\""],
  [statusPath, status, "Latest Beta launch remaining blockers one-page slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (/runJson\(\[[^\]]*"report:beta-mainline-current-route"/u.test(reportSource)) {
  problems.push(`${reportPath} must not call report:beta-mainline-current-route; remaining-blockers must stay lightweight and non-circular`);
}

if (pkg.scripts?.["report:beta-launch-remaining-blockers"] !== "node scripts/report-beta-launch-remaining-blockers.mjs") {
  problems.push(`${packagePath} missing report:beta-launch-remaining-blockers`);
}

if (pkg.scripts?.["check:beta-launch-remaining-blockers"] !== "node scripts/check-beta-launch-remaining-blockers.mjs") {
  problems.push(`${packagePath} missing check:beta-launch-remaining-blockers`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-launch-remaining-blockers"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:beta-launch-remaining-blockers should exit 0");
if (!report) {
  problems.push("report:beta-launch-remaining-blockers should emit JSON");
} else {
  if (report.mode !== "public_beta_remaining_blockers_one_page") {
    problems.push("report mode should be public_beta_remaining_blockers_one_page");
  }
  if (!["blocked_waiting_two_public_beta_inputs", "ready_for_beta_packet_window_proof_map"].includes(report.status)) {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.summary?.totalBlockers !== 3) problems.push("summary.totalBlockers must be 3");
  if (report.afterPlatformValuesProofPath?.status !== "ready_after_two_safe_platform_values") {
    problems.push("afterPlatformValuesProofPath.status should be ready_after_two_safe_platform_values");
  }
  if (report.afterPlatformValuesProofPath?.expectedProofMapOutcomeWithSafeValues !== "reviewed_artifact_template_ready_pending_pm_review") {
    problems.push("afterPlatformValuesProofPath should document reviewed artifact template outcome after safe values");
  }
  if (report.afterPlatformValuesProofPath?.gitSafeguardBlocksPublicBeta !== false) {
    problems.push("afterPlatformValuesProofPath.gitSafeguardBlocksPublicBeta should be false");
  }
  if (report.afterPlatformValuesProofPath?.hardBlocker !== false) {
    problems.push("afterPlatformValuesProofPath.hardBlocker should be false");
  }
  if (!report.afterPlatformValuesProofPath?.nextCommands?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("afterPlatformValuesProofPath.nextCommands should include the public Beta post-reply one-runner");
  }
  if (report.afterPlatformValuesProofPath?.nextCommands?.includes("cmd.exe /c npm run validate:beta-platform-two-values")) {
    problems.push("afterPlatformValuesProofPath should not expose the validator as a routine PM step");
  }
  if (report.afterPlatformValuesProofPath?.nextCommands?.includes("cmd.exe /c npm run run:beta-packet-window-proof-map")) {
    problems.push("afterPlatformValuesProofPath should not expose the lower-level packet proof map as a routine PM step");
  }
  if (report.afterPlatformValuesProofPath?.publicDataSource !== "mock") {
    problems.push("afterPlatformValuesProofPath publicDataSource must remain mock");
  }
  if (report.afterPlatformValuesProofPath?.scoreSource !== "mock") {
    problems.push("afterPlatformValuesProofPath scoreSource must remain mock");
  }
  if (!report.postReplyOneRunnerProof) {
    problems.push("report.postReplyOneRunnerProof should be present");
  } else {
    if (report.postReplyOneRunnerProof.status !== "focused_gate_registered_lightweight_proof_summary") {
      problems.push("postReplyOneRunnerProof.status should be the lightweight proof summary");
    }
    if (report.postReplyOneRunnerProof.focusedGateName !== "public-beta-post-reply-route-once") {
      problems.push("postReplyOneRunnerProof.focusedGateName should name the focused review gate");
    }
    if (report.postReplyOneRunnerProof.proofCommand !== "cmd.exe /c npm run check:public-beta-post-reply-route-once") {
      problems.push("postReplyOneRunnerProof.proofCommand should point to the focused proof checker");
    }
    if (report.postReplyOneRunnerProof.routineRunnerCommand !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
      problems.push("postReplyOneRunnerProof.routineRunnerCommand should point to the routine one-runner");
    }
    if (
      report.postReplyOneRunnerProof.safePlatformFixtureScenario?.expectedStatus !==
      "public_beta_post_reply_route_ready_for_packet_review_a1_pending"
    ) {
      problems.push("postReplyOneRunnerProof should preserve the safe-platform/A1-pending expected status");
    }
    if (
      !report.postReplyOneRunnerProof.safePlatformFixtureScenario?.expectedStepIds?.includes(
        "platform-two-value-proof-map-once"
      )
    ) {
      problems.push("postReplyOneRunnerProof should preserve the platform proof-map step");
    }
    if (
      !report.postReplyOneRunnerProof.safePlatformFixtureScenario?.expectedPacketReviewCommand?.includes(
        "record:beta-packet-window-reviewed-artifact-outcome -- --dry-run"
      )
    ) {
      problems.push("postReplyOneRunnerProof should keep packet review on dry-run recorder");
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
    for (const [flag, expected] of Object.entries({
      deploymentAuthorized: false,
      deploymentExecuted: false,
      evidenceRecorded: false,
      hostingMutated: false,
      marketDataFetched: false,
      packetArtifactWritten: false,
      rowCoverageAwarded: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sourceRightsApproved: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false,
      valuesStored: false
    })) {
      if (report.postReplyOneRunnerProof.safety?.[flag] !== expected) {
        problems.push(`postReplyOneRunnerProof.safety.${flag} must be ${String(expected)}`);
      }
    }
  }
  const blockers = new Map(report.blockers?.map((blocker) => [blocker.id, blocker]) ?? []);
  for (const id of ["pm_git_snapshot_or_backup", "beta_platform_two_values", "a1_twii_four_slot_evidence"]) {
    if (!blockers.has(id)) problems.push(`missing blocker ${id}`);
  }
  if (!["ready", "safeguard_deferred"].includes(blockers.get("pm_git_snapshot_or_backup")?.status)) {
    problems.push("worktree safeguard should be ready or explicitly deferred, not blocked");
  }
  if (blockers.get("pm_git_snapshot_or_backup")?.currentState?.hardBlocker !== false) {
    problems.push("worktree safeguard must not be a public Beta hard blocker");
  }
  if (blockers.get("pm_git_snapshot_or_backup")?.canMoveWithoutUserInput !== true) {
    problems.push("worktree safeguard should allow movement without user input while Git is outside this GOAL");
  }
  if (blockers.get("beta_platform_two_values")?.currentState?.valuesAreNotPrinted !== true) {
    problems.push("platform values must remain unprinted");
  }
  if (blockers.get("beta_platform_two_values")?.nextCommand !== "cmd.exe /c npm run report:public-beta-external-input-request") {
    problems.push("platform blocker should route to the public beta external input request while missing");
  }
  if (!report.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-request")) {
    problems.push("remaining blockers nextCommands should include public beta external input request");
  }
  if (!blockers.get("beta_platform_two_values")?.currentState?.missingValues?.includes("BETA_HOSTING_PROJECT_NAME")) {
    problems.push("platform blocker should include BETA_HOSTING_PROJECT_NAME while missing");
  }
  if (!blockers.get("beta_platform_two_values")?.currentState?.missingValues?.includes("BETA_TEMPORARY_URL")) {
    problems.push("platform blocker should include BETA_TEMPORARY_URL while missing");
  }
  if (blockers.get("a1_twii_four_slot_evidence")?.currentState?.pending !== 4) {
    problems.push("A1 blocker should show four pending TWII slots");
  }
  if (blockers.get("a1_twii_four_slot_evidence")?.currentState?.acceptedCount !== 0) {
    problems.push("A1 blocker should show zero accepted TWII slots before A1 reply");
  }
  if (blockers.get("a1_twii_four_slot_evidence")?.currentState?.boundedRepairRequestCount !== 4) {
    problems.push("A1 blocker should show four bounded repair requests");
  }
  if (blockers.get("a1_twii_four_slot_evidence")?.currentState?.canOpenOutcomeGate !== false) {
    problems.push("A1 outcome gate must remain closed");
  }
  if (
    blockers.get("a1_twii_four_slot_evidence")?.currentState?.currentDecision !==
    "request_a1_bounded_no_secret_repairs_before_pm_classification"
  ) {
    problems.push("A1 blocker should route to bounded no-secret repairs before PM classification");
  }
  if (blockers.get("a1_twii_four_slot_evidence")?.nextCommand !== "cmd.exe /c npm run report:a1-twii-pm-intake-decision-summary") {
    problems.push("A1 blocker should route to the PM intake decision summary");
  }
  if (!report.a1PmIntakeDecisionSummary) {
    problems.push("report.a1PmIntakeDecisionSummary should be present");
  } else {
    if (report.a1PmIntakeDecisionSummary.status !== "a1_twii_pm_intake_decision_summary_ready_waiting_bounded_repairs") {
      problems.push("a1PmIntakeDecisionSummary.status should show bounded repairs are waiting");
    }
    if (report.a1PmIntakeDecisionSummary.pendingCount !== 4) {
      problems.push("a1PmIntakeDecisionSummary.pendingCount should be 4");
    }
    if (report.a1PmIntakeDecisionSummary.repairRequestCount !== 4) {
      problems.push("a1PmIntakeDecisionSummary.repairRequestCount should be 4");
    }
    if (report.a1PmIntakeDecisionSummary.boundedRepairCommand !== "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request") {
      problems.push("a1PmIntakeDecisionSummary.boundedRepairCommand should route to bounded repair request");
    }
    if (report.a1PmIntakeDecisionSummary.postReplyOneRunnerCommand !== "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") {
      problems.push("a1PmIntakeDecisionSummary.postReplyOneRunnerCommand should route to the A1 one-runner");
    }
  }
  if (report.runtimeReadyEvidence?.allRoutesHttp200 !== true) {
    problems.push("runtime route evidence should remain all HTTP 200");
  }
  if (report.runtimeReadyEvidence?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeReadyEvidence?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (!Array.isArray(report.stopLines) || report.stopLines.length < 10) problems.push("stopLines must be present");
  for (const sourceReport of [
    "betaDeploymentQuickstart",
    "pmWorktreeReviewPreflight",
    "a1SourceRightsReviewedOutcomeSurface",
    "a1TwiiPmIntakeDecisionSummary",
    "publicBetaCoreRouteQuickProof"
  ]) {
    if (!report.sourceReports?.[sourceReport]?.parsedJson) {
      problems.push(`sourceReports.${sourceReport} should parse`);
    }
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_launch_remaining_blockers_ready",
      blockerCount: report.summary.blockerCount,
      nextBestAction: report.summary.nextBestAction,
      publicDataSource: report.runtimeReadyEvidence.publicDataSource,
      scoreSource: report.runtimeReadyEvidence.scoreSource
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
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
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /git",\s*"reset"/iu,
    /git",\s*"checkout"/iu,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
