import fs from "node:fs";

const docPath =
  "docs/PHASE_1_PUBLIC_BETA_POST_PLATFORM_REPORT_FILLED_PLACEHOLDER_OR_REPAIR_SCAFFOLD.md";
const intakePath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md";
const safeReplyPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md";
const postActionPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const intake = read(intakePath);
const safeReply = read(safeReplyPath);
const postAction = read(postActionPath);
const monitoring = read(monitoringPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready",
  "Accepted Intake To Filled Placeholder",
  "Repair Scaffold",
  "Reject Scaffold",
  "Required Upstream Statuses",
  "Required Local Checks",
  "Stop Lines",
  "READY_TO_FILL_FROM_SAFE_REPLY",
  "REPAIR_REQUIRED",
  "REJECT_UNSAFE_REPLY",
  "continue_phase_1_public_beta_monitoring_or_repair_after_report_fill"
]);

for (const status of [
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing upstream status: ${status}`);
}

for (const field of [
  "reportFillStatus",
  "sourcePmIntakeStatus",
  "reportId",
  "chairmanDecision",
  "platformActionType",
  "publicUrl",
  "deploymentLabel",
  "rollbackLabel",
  "dataPosture",
  "scorePosture",
  "routeSmokeSummary",
  "publicClaimSmokeSummary",
  "acceptedDeferrals",
  "remainingHardBlockers",
  "repairOwner",
  "repairReason",
  "nextRoute"
]) {
  if (!doc.includes(field)) problems.push(`${docPath} missing field: ${field}`);
}

for (const reason of [
  "route_smoke_failed",
  "public_claim_failed",
  "rollback_missing",
  "incomplete_reply",
  "wrong_data_posture",
  "wrong_score_posture",
  "wrong_decision",
  "unsafe_content"
]) {
  if (!doc.includes(reason)) problems.push(`${docPath} missing repair/reject reason: ${reason}`);
}

for (const forbiddenReply of [
  "secret values",
  "environment values",
  "API keys",
  "auth tokens",
  "private dashboard URLs",
  "raw market-data payloads",
  "database row payloads",
  "SQL snippets",
  "Supabase table row contents",
  "user account personal details",
  "local filesystem paths",
  "screenshots with private values"
]) {
  if (!doc.includes(forbiddenReply)) problems.push(`${docPath} missing forbidden reply content: ${forbiddenReply}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold",
  "cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder",
  "cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(intakePath, intake, [
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "ACCEPT_FOR_POST_PLATFORM_REPORT",
  "fill_post_platform_action_report_or_repair_failed_operator_intake"
]);

requireIncludes(safeReplyPath, safeReply, [
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "operatorSafeReplyStatus: ready_for_pm_review"
]);

requireIncludes(postActionPath, postAction, [
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "Platform Action Outcome",
  "Public Claim Smoke Results"
]);

requireIncludes(monitoringPath, monitoring, [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Repair Priority Ladder"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "pm_brief_runtime_mainline_goal_ready",
  "Phase 1",
  "Phase 2"
]);

const scriptName =
  "check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold.mjs",
  "phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold"
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
      guardedStatus:
        "phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "continue_phase_1_public_beta_monitoring_or_repair_after_report_fill"
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
