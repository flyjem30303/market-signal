import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_DECISION_OR_MANUAL_PLATFORM_ACTION_READINESS_REFRESH.md";
const splitPath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const statusAlignmentPath = "docs/PHASE_1_PUBLIC_BETA_PRE_OPERATOR_KEEP_OPEN_STATUS_DASHBOARD_ALIGNMENT.md";
const decisionPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md";
const manualPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const rollupPath = "docs/A3_PHASE_1_PUBLIC_BETA_KEEP_OPEN_REPAIR_OR_NO_GO_RESULT_ROLLUP.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const split = read(splitPath);
const statusAlignment = read(statusAlignmentPath);
const decision = read(decisionPath);
const manual = read(manualPath);
const rollup = read(rollupPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready",
  "Routing Decision",
  "Chairman/Operator Decision Readiness",
  "Manual Platform Action Readiness",
  "Repair Before Operator Action",
  "Workstream Assignment",
  "Required Checks",
  "Stop Lines",
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair",
  "request_chairman_operator_go_or_go_with_deferrals_decision",
  "follow_no_secret_manual_platform_action_checklist",
  "repair_phase_1_public_beta_blocker_then_recheck",
  "hold_or_no_go_until_separate_authorization",
  "NEXT_PUBLIC_SITE_URL",
  "Public pages do not expose internal execution states",
  "Phase 2 membership remains deferred and non-blocking"
]);

for (const status of [
  "phase_1_phase_2_execution_split_ready",
  "phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready",
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "phase_1_public_beta_public_status_surface_alignment_ready_mock_only",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required input status: ${status}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment",
  "cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-operator-decision-record",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup",
  "cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(splitPath, split, [
  "phase_1_phase_2_execution_split_ready",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 implementation must not block Phase 1 public Beta readiness"
]);

requireIncludes(statusAlignmentPath, statusAlignment, [
  "phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready",
  "Public user-facing status",
  "PM/A3 internal status"
]);

requireIncludes(decisionPath, decision, [
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "GO",
  "GO_WITH_DEFERRALS",
  "NO_GO",
  "prepare_phase_1_public_beta_manual_platform_action_checklist"
]);

requireIncludes(manualPath, manual, [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Pre-Platform Local Evidence",
  "Manual Vercel / Platform Checklist",
  "Post-Deploy Public Smoke",
  "Rollback Trigger"
]);

requireIncludes(rollupPath, rollup, [
  "a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "NOT_RUN"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh",
  "A3 launch/production engineering",
  "A4 membership MVP planning"
]);

const scriptName = "check:phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh.mjs",
  "phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh"
]);

for (const [filePath, source] of [
  [docPath, doc],
  [statusAlignmentPath, statusAlignment]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }
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
      guardedStatus: "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair"
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
    /buy\/sell recommendation is provided/u
  ];
}
