import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-public-beta-goal-readiness-rollup.mjs";
const docPath = "docs/PUBLIC_BETA_GOAL_READINESS_ROLLUP.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
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
  [docPath, doc, "No SQL, Supabase read/write, deployment, raw market-data fetch/ingest, evidence recording, or source/score promotion is authorized."],
  [statusPath, status, "Latest public Beta goal readiness rollup slice"],
  [boardPath, board, "`report:public-beta-goal-readiness-rollup` is `accepted` as PM mainline GOAL-readiness rollup"],
  [reviewGatePath, reviewGate, "name: \"public-beta-goal-readiness-rollup\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "public_beta_goal_readiness_rollup",
  "public_beta_goal_not_ready_continue_parallel_work",
  "runtime_core_routes",
  "beta_platform_values_and_packet",
  "a1_source_rights_and_coverage_frontier",
  "a2_public_trust_copy",
  "promotion_boundary",
  "publicDataSource",
  "scoreSource",
  "deploymentAuthorized: false",
  "marketDataFetched: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
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
  if (report.currentRoute?.pmMainlineStatus !== "blocked_waiting_two_platform_values") {
    problems.push("pm mainline should currently be blocked waiting two platform values");
  }
  if (report.currentRoute?.pmDefaultWhenBlocked !== true) {
    problems.push("pmDefaultWhenBlocked should remain true");
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
  if (pattern.test(reportSource) || pattern.test(doc)) problems.push(`forbidden pattern ${String(pattern)}`);
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
