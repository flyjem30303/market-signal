import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_REMOTE_MONITORING_KEEP_OPEN_DECISION.md";
const remoteMonitorPath = "docs/A3_PHASE_1_PUBLIC_BETA_REMOTE_MONITORING_SNAPSHOT.md";
const monitoringRunbookPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const releaseOpsPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md";
const splitPath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const remoteMonitor = read(remoteMonitorPath);
const monitoringRunbook = read(monitoringRunbookPath);
const releaseOps = read(releaseOpsPath);
const split = read(splitPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_remote_monitoring_keep_open_decision_ready",
  "Current Remote Monitor Decision",
  "KEEP_OPEN_WITH_DEFERRALS_FROM_REMOTE_MONITOR",
  "continue_remote_monitoring_cadence_and_repair_if_regression",
  "Keep-Open Conditions",
  "Repair / Pause Rules",
  "Monitoring Cadence",
  "Accepted Deferrals While Keep-Open",
  "Required Checks",
  "Stop Lines",
  "https://market-signal-two.vercel.app",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real"
]);

for (const status of [
  "a3_phase_1_public_beta_remote_monitoring_snapshot_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "a3_phase_1_public_beta_release_ops_index_ready",
  "phase_1_phase_2_execution_split_ready",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing upstream status: ${status}`);
}

for (const field of [
  "decisionId",
  "remoteBaseUrl",
  "remoteMonitoringStatus",
  "routeSmokeSummary",
  "publicClaimSmokeSummary",
  "publicVisibleResidueSummary",
  "membershipBoundarySummary",
  "publicDataSource",
  "scoreSource",
  "decision",
  "nextRoute"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing decision field: ${field}`);
}

for (const decision of [
  "KEEP_OPEN_WITH_DEFERRALS_FROM_REMOTE_MONITOR",
  "REPAIR_THEN_RECHECK_REMOTE_ROUTE",
  "REPAIR_THEN_RECHECK_PUBLIC_COPY",
  "REPAIR_THEN_RECHECK_MEMBERSHIP_BOUNDARY",
  "PAUSE_OR_ROLLBACK_UNTIL_REPAIRED",
  "KEEP_OPEN_ACCEPTED_DATA_DEFERRAL"
]) {
  if (!doc.includes(decision)) problems.push(`${docPath} missing decision outcome: ${decision}`);
}

for (const lane of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(lane)) problems.push(`${docPath} missing lane: ${lane}`);
}

for (const deferral of [
  "real-data promotion",
  "full Taiwan all-listed-equity coverage",
  "repeatable ingestion/backfill execution",
  "Phase 2 member login",
  "Phase 2 watchlist persistence",
  "Phase 2 custom alert execution",
  "Phase 2 member-only three-layer interpretation",
  "payment/subscription flow",
  "custom domain",
  "paid monitoring/analytics vendor",
  "global market expansion"
]) {
  if (!doc.includes(deferral)) problems.push(`${docPath} missing accepted deferral: ${deferral}`);
}

for (const command of [
  "cmd.exe /c npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot",
  "cmd.exe /c npm run check:phase-1-public-beta-remote-monitoring-keep-open-decision",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-release-ops-index",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

for (const stopLine of [
  "production deploy",
  "DNS change",
  "production env mutation",
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Phase 2 login"
]) {
  if (!doc.includes(stopLine)) problems.push(`${docPath} missing stop line: ${stopLine}`);
}

requireIncludes(remoteMonitorPath, remoteMonitor, [
  "a3_phase_1_public_beta_remote_monitoring_snapshot_ready",
  "Public Residue Stop Lines",
  "publicDataSource=mock",
  "scoreSource=mock"
]);

requireIncludes(monitoringRunbookPath, monitoringRunbook, [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Monitoring Cadence",
  "Repair Priority Ladder"
]);

requireIncludes(releaseOpsPath, releaseOps, [
  "a3_phase_1_public_beta_release_ops_index_ready",
  "A3_PHASE_1_PUBLIC_BETA_REMOTE_MONITORING_SNAPSHOT.md"
]);

requireIncludes(splitPath, split, [
  "phase_1_phase_2_execution_split_ready",
  "Phase 1",
  "Phase 2"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "pm_brief_runtime_mainline_goal_ready",
  "A1 data/source/coverage",
  "A2 public copy/product safety",
  "A3 launch/production engineering",
  "A4 membership MVP planning"
]);

const scriptName = "check:phase-1-public-beta-remote-monitoring-keep-open-decision";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-remote-monitoring-keep-open-decision.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-remote-monitoring-keep-open-decision.mjs",
  "phase-1-public-beta-remote-monitoring-keep-open-decision"
]);

for (const marker of findBadEncodingMarkers(doc)) {
  problems.push(`${docPath} contains ${marker}`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_public_beta_remote_monitoring_keep_open_decision_ready",
      remoteBaseUrl: "https://market-signal-two.vercel.app",
      decision: "KEEP_OPEN_WITH_DEFERRALS_FROM_REMOTE_MONITOR",
      nextRoute: "continue_remote_monitoring_cadence_and_repair_if_regression",
      publicDataSource: "mock",
      scoreSource: "mock"
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

function requireIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
  }
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /real-time official market data is provided/u,
    /official endorsement is provided/u,
    /guaranteed return is provided/u,
    /investment advice is provided/u,
    /buy\/sell\/hold recommendation is provided/u
  ];
}
