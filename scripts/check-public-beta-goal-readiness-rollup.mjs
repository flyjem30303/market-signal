import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-public-beta-goal-readiness-rollup.mjs";
const helperPath = "scripts/lib/public-beta-goal-readiness-rollup.mjs";
const docPath = "docs/PUBLIC_BETA_GOAL_READINESS_ROLLUP.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const helperSource = read(helperPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

if (
  pkg.scripts?.["report:public-beta-goal-readiness-rollup"] !==
  "node scripts/report-public-beta-goal-readiness-rollup.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-goal-readiness-rollup`);
}

if (
  pkg.scripts?.["check:public-beta-goal-readiness-rollup"] !==
  "node scripts/check-public-beta-goal-readiness-rollup.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-goal-readiness-rollup`);
}

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `public_beta_goal_readiness_rollup_ready_currently_not_complete`"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-goal-readiness-rollup"],
  [docPath, doc, "runtime_core_routes"],
  [docPath, doc, "beta_platform_values_and_packet"],
  [docPath, doc, "a1_source_rights_and_coverage_frontier"],
  [docPath, doc, "a2_public_trust_copy"],
  [docPath, doc, "promotion_boundary"],
  [docPath, doc, "operational_goal_v3_execution_first"],
  [docPath, doc, "close only the active external blocker chain"],
  [docPath, doc, "directly advances platform values, packet proof, A1 evidence classification, or runtime route health"],
  [docPath, doc, "prefer existing one-runner commands"],
  [docPath, doc, "No SQL, Supabase read/write, deployment, raw market-data fetch/ingest, evidence recording, or source/score promotion is authorized."],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-response-readiness"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [docPath, doc, "The reply-file route chooses the template, copy packet, bounded A1 repair, workflow proof, or lower-level response-readiness path."],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [statusPath, status, "Latest public Beta goal readiness rollup slice"],
  [boardPath, board, "`report:public-beta-goal-readiness-rollup` is `accepted` as PM mainline GOAL-readiness rollup"],
  [reviewGatePath, reviewGate, "name: \"public-beta-goal-readiness-rollup\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "buildPublicBetaGoalReadinessRollup",
  "betaMainlineCurrentRoute",
  "parsedJson",
  "stderrPrinted"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "public_beta_goal_readiness_rollup",
  "public_beta_goal_not_ready_continue_parallel_work",
  "operational_goal_v3_execution_first",
  "Close only the active external blocker chain",
  "hardBlockers",
  "executionBias",
  "keep_reviewed_artifact_recording_dry_run_until_separate_pm_apply_decision",
  "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
  "cmd.exe /c npm run report:public-beta-external-reply-file-route",
  "cmd.exe /c npm run run:public-beta-post-reply-route-once",
  "runtime_core_routes",
  "beta_platform_values_and_packet",
  "a1_source_rights_and_coverage_frontier",
  "a2_public_trust_copy",
  "launchBlockingStatus",
  "keep_stable_only_unless_launch_blocking_regression",
  "P2 polish",
  "promotion_boundary",
  "publicDataSource",
  "scoreSource",
  "deploymentAuthorized: false",
  "marketDataFetched: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false"
]) {
  if (!helperSource.includes(phrase)) problems.push(`${helperPath} missing phrase: ${phrase}`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-goal-readiness-rollup"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 300000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0 || !report) {
  problems.push("report:public-beta-goal-readiness-rollup should emit JSON");
} else {
  if (report.status !== "public_beta_goal_not_ready_continue_parallel_work") {
    problems.push(`unexpected status ${report.status}`);
  }
  if (
    !["blocked_waiting_two_platform_values", "blocked_waiting_external_input_response"].includes(
      report.currentRoute?.pmMainlineStatus
    )
  ) {
    problems.push("pm mainline should currently be blocked waiting external input");
  }
  if (report.currentRoute?.pmDefaultWhenBlocked !== true) {
    problems.push("pmDefaultWhenBlocked should remain true");
  }
  if (report.ceoDecision !== "use_execution_first_goal_writing_mainline_platform_values_packet_a1_only") {
    problems.push("ceoDecision should use execution-first goal writing");
  }
  if (report.goalWriting?.style !== "operational_goal_v3_execution_first") {
    problems.push("goalWriting style should be operational_goal_v3_execution_first");
  }
  for (const blocker of [
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "A1_TWII_FOUR_SLOT_NO_SECRET_SOURCE_RIGHTS_EVIDENCE"
  ]) {
    if (!report.goalWriting?.hardBlockers?.includes(blocker)) {
      problems.push(`goalWriting hardBlockers should include ${blocker}`);
    }
  }
  if (!report.goalWriting?.executionBias?.includes("prefer_existing_one_runner_commands")) {
    problems.push("goalWriting executionBias should prefer existing one-runner commands");
  }
  if (!report.goalWriting?.executionBias?.includes("keep_reviewed_artifact_recording_dry_run_until_separate_pm_apply_decision")) {
    problems.push("goalWriting executionBias should keep reviewed-artifact recording dry-run until separate PM apply decision");
  }
  if (!report.nextBestActions?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("nextBestActions should include the external reply file route immediately after external replies");
  }
  if (!report.nextBestActions?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    problems.push("nextBestActions should include response-readiness immediately after external replies");
  }
  const routeIndex = report.nextBestActions?.indexOf("cmd.exe /c npm run report:public-beta-external-reply-file-route") ?? -1;
  const responseReadinessIndex =
    report.nextBestActions?.indexOf("cmd.exe /c npm run report:public-beta-external-input-response-readiness") ?? -1;
  if (!(routeIndex >= 0 && responseReadinessIndex > routeIndex)) {
    problems.push("nextBestActions should order external reply file route before response-readiness");
  }
  if (!report.nextBestActions?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("nextBestActions should include the combined public Beta post-reply one-runner");
  }
  if (report.nextBestActions?.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
    problems.push("nextBestActions should not expose the lower-level platform proof runner as the routine next command");
  }
  const byId = new Map(report.completionItems?.map((item) => [item.id, item]) ?? []);
  if (byId.get("runtime_core_routes")?.status !== "ready") problems.push("runtime_core_routes should be ready");
  if (byId.get("beta_platform_values_and_packet")?.status !== "blocked") {
    problems.push("beta_platform_values_and_packet should currently be blocked");
  }
  if (byId.get("a1_source_rights_and_coverage_frontier")?.status !== "blocked") {
    problems.push("a1_source_rights_and_coverage_frontier should currently be blocked");
  }
  if (byId.get("a2_public_trust_copy")?.status !== "ready") problems.push("a2_public_trust_copy should be ready");
  if (!String(byId.get("a2_public_trust_copy")?.evidence ?? "").includes("launchBlockingStatus is clear")) {
    problems.push("a2_public_trust_copy evidence should use launchBlockingStatus clear wording");
  }
  if (!String(byId.get("a2_public_trust_copy")?.nextAction ?? "").includes("defer P2 polish")) {
    problems.push("a2_public_trust_copy nextAction should defer P2 polish");
  }
  if (byId.get("promotion_boundary")?.status !== "held") problems.push("promotion_boundary should be held");
  for (const id of ["beta_platform_values_and_packet", "a1_source_rights_and_coverage_frontier"]) {
    if (!report.blockedItems?.includes(id)) problems.push(`blockedItems should include ${id}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock" || report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("runtimeBoundary must remain mock/mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "deploymentAuthorized",
    "evidenceRecorded",
    "ingestionStarted",
    "marketDataFetched",
    "rawPayloadPrinted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource) || pattern.test(helperSource) || pattern.test(doc)) {
    problems.push(`forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_goal_readiness_rollup_ready_currently_not_complete",
      currentRollupStatus: report.status,
      blockedItems: report.blockedItems
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
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /deploymentAuthorized: true/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
