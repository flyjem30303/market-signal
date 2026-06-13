import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_KEEP_OPEN_REPAIR_OR_NO_GO_RESULT_ROLLUP.md";
const resultPath = "docs/A3_PHASE_1_PUBLIC_BETA_OPERATOR_ACTION_OR_REPAIR_RESULT.md";
const keepOpenPath = "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const result = read(resultPath);
const keepOpen = read(keepOpenPath);
const monitoring = read(monitoringPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
  "Required Inputs",
  "Rollup Identity",
  "Final State Rules",
  "Evidence Summary Template",
  "Workstream Follow-Up",
  "Required Checks Before Closing Rollup",
  "Stop Lines",
  "phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "NOT_RUN",
  "publicDataSource",
  "scoreSource",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_public_beta_operator_action_or_repair_result_ready",
  "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required input status: ${status}`);
}

for (const field of [
  "rollupId",
  "preparedAt",
  "preparedBy",
  "sourceResultId",
  "finalState",
  "publicDataSource",
  "scoreSource",
  "routeSmokeResult",
  "publicClaimSmokeResult",
  "publicVisibleResidueCleanupResult",
  "mockBoundaryVisible",
  "sourceUpdateBoundaryVisible",
  "nonAdviceBoundaryVisible",
  "acceptedDeferralsRecorded",
  "rollbackPathKnown",
  "remainingHardBlockers"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing field: ${field}`);
}

for (const command of [
  "cmd.exe /c npm run check:a3-phase-1-public-beta-operator-action-or-repair-result",
  "cmd.exe /c npm run check:phase-1-public-beta-keep-open-or-repair-decision",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

for (const lane of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing lane: ${lane}`);
}

for (const stopLine of [
  "production deploy by itself",
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "secret or raw payload output",
  "live official market-data claim",
  "personalized investment advice",
  "Phase 2 login, payment, watchlist persistence, alert execution, or member-only content as a Phase 1 requirement"
]) {
  if (!doc.includes(stopLine)) problems.push(`${docPath} missing stop line: ${stopLine}`);
}

if (!result.includes("phase_1_public_beta_keep_open_repair_or_no_go_result_rollup")) {
  problems.push(`${resultPath} missing rollup route linkage`);
}

if (!keepOpen.includes("development residue harms public trust")) {
  problems.push(`${keepOpenPath} missing public trust rollback condition`);
}

if (!monitoring.includes("visible development residue that harms trust")) {
  problems.push(`${monitoringPath} missing monitoring residue repair condition`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup"] !==
  "node scripts/check-a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup.mjs")) {
  problems.push(`${reviewGatePath} missing keep-open repair no-go rollup checker`);
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
      guardedStatus: "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
      phase: "Phase 1 public free index-lighting site",
      platformActionExecuted: false,
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
    /buy\/sell recommendation is provided/u
  ];
}
