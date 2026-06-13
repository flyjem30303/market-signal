import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_OPERATOR_ACTION_OR_REPAIR_RESULT.md";
const operatorPath = "docs/A3_PHASE_1_PUBLIC_BETA_OPERATOR_EXECUTION_PATH_RUNBOOK.md";
const decisionPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md";
const postPlatformPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const keepOpenPath = "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const operator = read(operatorPath);
const decision = read(decisionPath);
const postPlatform = read(postPlatformPath);
const keepOpen = read(keepOpenPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_operator_action_or_repair_result_ready",
  "Required Inputs",
  "Result Identity",
  "Accepted Path Result",
  "Rejected Path Result",
  "Minimum Evidence Rules",
  "Required Checks Before Closing Result",
  "Stop Lines",
  "phase_1_public_beta_keep_open_repair_or_no_go_result_rollup",
  "operator_action_result",
  "repair_result",
  "not_run",
  "publicDataSource",
  "scoreSource",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_public_beta_operator_execution_path_runbook_ready",
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required input status: ${status}`);
}

for (const field of [
  "resultId",
  "preparedAt",
  "preparedBy",
  "sourceDecision",
  "resultType",
  "publicDataSource",
  "scoreSource",
  "manualChecklistUsed",
  "platformActionTaken",
  "postPlatformReportFilled",
  "postPlatformReportPath",
  "routeSmokeResult",
  "publicClaimSmokeResult",
  "publicVisibleResidueCleanupResult",
  "rollbackNeeded",
  "keepOpenDecision",
  "blockerCount",
  "blockerSummary",
  "repairOwner",
  "repairScope",
  "repairApplied",
  "recheckCommands",
  "recheckResult",
  "decisionRecordReopened"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing field: ${field}`);
}

for (const command of [
  "cmd.exe /c npm run check:a3-phase-1-public-beta-operator-execution-path-runbook",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-operator-decision-record",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:phase-1-public-beta-keep-open-or-repair-decision",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
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

if (!operator.includes("phase_1_public_beta_operator_action_or_repair_execution_result")) {
  problems.push(`${operatorPath} missing result route linkage`);
}

if (!decision.includes("operator_follows_phase_1_public_beta_manual_platform_action_checklist_or_pm_repairs_blocker")) {
  problems.push(`${decisionPath} missing operator path route linkage`);
}

if (!postPlatform.includes("no development residue visible")) {
  problems.push(`${postPlatformPath} missing public residue result evidence`);
}

if (!keepOpen.includes("KEEP_OPEN_WITH_DEFERRALS")) {
  problems.push(`${keepOpenPath} missing keep-open decision`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-operator-action-or-repair-result"] !==
  "node scripts/check-a3-phase-1-public-beta-operator-action-or-repair-result.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-operator-action-or-repair-result script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-operator-action-or-repair-result.mjs")) {
  problems.push(`${reviewGatePath} missing operator action or repair result checker`);
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
      guardedStatus: "a3_phase_1_public_beta_operator_action_or_repair_result_ready",
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
