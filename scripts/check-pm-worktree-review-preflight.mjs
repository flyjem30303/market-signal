import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-pm-worktree-review-preflight.mjs";
const checkPath = "scripts/check-pm-worktree-review-preflight.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const phrase of [
  "pm_review_required_before_packet_creation",
  "clean_worktree_ready_for_packet_creation",
  "packetCandidateAllowed",
  "a1DataEvidenceSupport",
  "a1-twii-local-evidence",
  "a1-twii-pm-intake",
  "a1-twii-post-reply",
  "betaDeploymentAndPacketChain",
  "projectStatusAndTooling",
  "pmAcceptanceSummary",
  "accept_current_beta_readiness_worktree_for_backup_then_packet_candidate",
  "acceptedForBetaReadinessBackupCount",
  "canProceedToBackupDecision",
  "pmDecisionSurface",
  "excludedFromBetaLaunchPacket",
  "exclude_non_beta_packet_items_and_continue_pm_review",
  "docs/PROJECT_STARTUP_DOC_TRACKING.md",
  "exclude_or_separately_accept_unrelated_or_unclear_items_before_packet_candidate",
  "publicRuntimeAndTrustSurface",
  "unrelatedOrNeedsPmDecision",
  "No git add, commit, push, reset, or checkout is executed by this report.",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "pm_worktree_review_preflight_ready",
  "pm_review_required_before_packet_creation",
  "No git add, commit, push, reset, or checkout is executed"
]) {
  if (!checkSource.includes(phrase)) problems.push(`${checkPath} missing self-contract phrase: ${phrase}`);
}

if (pkg.scripts?.["report:pm-worktree-review-preflight"] !== "node scripts/report-pm-worktree-review-preflight.mjs") {
  problems.push(`${packagePath} missing report:pm-worktree-review-preflight`);
}

if (pkg.scripts?.["check:pm-worktree-review-preflight"] !== "node scripts/check-pm-worktree-review-preflight.mjs") {
  problems.push(`${packagePath} missing check:pm-worktree-review-preflight`);
}

for (const phrase of [
  "scripts/check-pm-worktree-review-preflight.mjs",
  "name: \"pm-worktree-review-preflight\"",
  "\"pm-worktree-review-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

if (!status.includes("Latest PM worktree review preflight slice")) {
  problems.push(`${statusPath} missing Latest PM worktree review preflight slice`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 240000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push(`${reportPath} should exit 0`);
if (!report) {
  problems.push(`${reportPath} should emit JSON`);
} else {
  if (!["pm_review_required_before_packet_creation", "clean_worktree_ready_for_packet_creation"].includes(report.status)) {
    problems.push(`${reportPath} emitted unexpected status ${String(report.status)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (!Array.isArray(report.stopLines) || !report.stopLines.join("\n").includes("No git add, commit, push, reset, or checkout is executed")) {
    problems.push("stopLines must forbid git mutation");
  }
  if (
    !report.groups?.betaDeploymentAndPacketChain ||
    !report.groups?.excludedFromBetaLaunchPacket ||
    !report.groups?.projectStatusAndTooling ||
    !report.groups?.publicRuntimeAndTrustSurface
  ) {
    problems.push("report groups must include beta deployment, project tooling, and public runtime buckets");
  }
  if (typeof report.pmDecisionSurface?.decisionNeeded !== "boolean") {
    problems.push("pmDecisionSurface decisionNeeded must be boolean");
  }
  if (typeof report.pmAcceptanceSummary?.canProceedToBackupDecision !== "boolean") {
    problems.push("pmAcceptanceSummary canProceedToBackupDecision must be boolean");
  }
  if (typeof report.pmAcceptanceSummary?.acceptedForBetaReadinessBackupCount !== "number") {
    problems.push("pmAcceptanceSummary acceptedForBetaReadinessBackupCount must be a number");
  }
  if (report.groups?.unrelatedOrNeedsPmDecision?.length === 0 && report.pmAcceptanceSummary?.canProceedToBackupDecision !== true) {
    problems.push("pmAcceptanceSummary should allow backup decision when no unresolved items remain");
  }
  if (report.pmAcceptanceSummary?.canProceedToPacketCandidate !== false) {
    problems.push("pmAcceptanceSummary must keep packet candidate blocked until worktree backup/snapshot is handled");
  }
  if (report.groups?.unrelatedOrNeedsPmDecision?.length > 0 && report.pmDecisionSurface?.decisionNeeded !== true) {
    problems.push("pmDecisionSurface must require decision when unrelated items exist");
  }
  if (report.groups?.unrelatedOrNeedsPmDecision?.length === 0 && report.pmDecisionSurface?.decisionNeeded !== false) {
    problems.push("pmDecisionSurface must not require decision when only excluded packet items remain");
  }
  const excludedItems = report.pmDecisionSurface?.excludedFromBetaLaunchPacket ?? [];
  if (!Array.isArray(excludedItems)) {
    problems.push("pmDecisionSurface excludedFromBetaLaunchPacket must be an array");
  }
}

for (const pattern of [
  /run\(\["git",\s*"add"/iu,
  /run\(\["git",\s*"commit"/iu,
  /run\(\["git",\s*"push"/iu,
  /run\(\["git",\s*"reset"/iu,
  /run\(\["git",\s*"checkout"/iu,
  /createClient/iu,
  /\.from\(/iu,
  /\bfetch\(/iu,
  /scoreSource:\s*"real"/u,
  /publicDataSource:\s*"supabase"/u
]) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "pm_worktree_review_preflight_ready",
      outcome: report?.status ?? "unknown"
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
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
