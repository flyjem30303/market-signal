import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_POST_REPORT_MONITORING_OR_REPAIR_DECISION_LOOP.md";
const scaffoldPath =
  "docs/PHASE_1_PUBLIC_BETA_POST_PLATFORM_REPORT_FILLED_PLACEHOLDER_OR_REPAIR_SCAFFOLD.md";
const intakePath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md";
const postActionPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const rollupPath = "docs/A3_PHASE_1_PUBLIC_BETA_KEEP_OPEN_REPAIR_OR_NO_GO_RESULT_ROLLUP.md";
const splitPath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const scaffold = read(scaffoldPath);
const intake = read(intakePath);
const postAction = read(postActionPath);
const monitoring = read(monitoringPath);
const rollup = read(rollupPath);
const split = read(splitPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_post_report_monitoring_or_repair_decision_loop_ready",
  "Decision Inputs",
  "Decision Outcomes",
  "Owner-Specific Repair Queue",
  "Monitoring Cadence To Start After Keep-Open",
  "Public Beta Keep-Open Record Shape",
  "Required Local Checks",
  "Stop Lines",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "NOT_RUN",
  "keep_open_monitoring_cadence_or_repair_then_recheck_phase_1_public_beta"
]);

for (const status of [
  "phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready",
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
  "phase_1_phase_2_execution_split_ready",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing upstream status: ${status}`);
}

for (const field of [
  "postReportDecisionStatus",
  "reportFillStatus",
  "reportId",
  "routeSmokeSummary",
  "publicClaimSmokeSummary",
  "rollbackLabel",
  "publicDataSource",
  "scoreSource",
  "remainingHardBlockers",
  "acceptedDeferrals",
  "repairOwner",
  "repairReason",
  "nextRoute"
]) {
  if (!doc.includes(field)) problems.push(`${docPath} missing field: ${field}`);
}

for (const route of [
  "keep_open_monitoring_cadence",
  "repair_then_recheck_post_report_decision_loop",
  "rollback_or_no_go_until_repaired",
  "wait_for_operator_safe_reply"
]) {
  if (!doc.includes(route)) problems.push(`${docPath} missing decision nextRoute: ${route}`);
}

for (const owner of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(owner)) problems.push(`${docPath} missing owner lane: ${owner}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-post-report-monitoring-or-repair-decision-loop",
  "cmd.exe /c npm run check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup",
  "cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(scaffoldPath, scaffold, [
  "phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready",
  "continue_phase_1_public_beta_monitoring_or_repair_after_report_fill"
]);

requireIncludes(intakePath, intake, [
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "ACCEPT_FOR_POST_PLATFORM_REPORT"
]);

requireIncludes(postActionPath, postAction, [
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "continue_phase_1_public_beta_monitoring_or_repair"
]);

requireIncludes(monitoringPath, monitoring, [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Repair Priority Ladder",
  "Monitoring Cadence"
]);

requireIncludes(rollupPath, rollup, [
  "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO"
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
  "A3 launch/production engineering"
]);

const scriptName = "check:phase-1-public-beta-post-report-monitoring-or-repair-decision-loop";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-post-report-monitoring-or-repair-decision-loop.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-post-report-monitoring-or-repair-decision-loop.mjs",
  "phase-1-public-beta-post-report-monitoring-or-repair-decision-loop"
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
      guardedStatus: "phase_1_public_beta_post_report_monitoring_or_repair_decision_loop_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "keep_open_monitoring_cadence_or_repair_then_recheck_phase_1_public_beta"
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
