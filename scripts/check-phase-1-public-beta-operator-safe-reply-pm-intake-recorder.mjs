import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md";
const safeReplyPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md";
const readinessPath = "docs/PHASE_1_PUBLIC_BETA_NO_SECRET_MANUAL_PLATFORM_ACTION_READINESS.md";
const decisionPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_2026_06_13.md";
const postActionPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const safeReply = read(safeReplyPath);
const readiness = read(readinessPath);
const decision = read(decisionPath);
const postAction = read(postActionPath);
const monitoring = read(monitoringPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "ACCEPT_FOR_POST_PLATFORM_REPORT",
  "REPAIR_REQUIRED",
  "REJECT_UNSAFE_REPLY",
  "Intake Record Shape",
  "Accept Conditions",
  "Repair Conditions",
  "Reject Conditions",
  "PM Conversion To Post-Platform Report",
  "Required Local Checks",
  "Stop Lines",
  "fill_post_platform_action_report_or_repair_failed_operator_intake",
  "repair_failed_operator_safe_reply_then_recheck",
  "reject_and_request_safe_reply_again"
]);

for (const status of [
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
  "pmIntakeStatus",
  "sourceReplyStatus",
  "decisionId",
  "chairmanDecision",
  "safeFieldCompleteness",
  "forbiddenContentDetected",
  "routeSmokeSummary",
  "publicClaimSmokeSummary",
  "rollbackPathStatus",
  "actionResultSummary",
  "publicDataSource",
  "scoreSource",
  "repairOwner",
  "repairReason",
  "nextRoute"
]) {
  if (!doc.includes(field)) problems.push(`${docPath} missing intake field: ${field}`);
}

for (const repairReason of [
  "route_smoke_failed",
  "public_claim_failed",
  "rollback_missing",
  "incomplete_reply",
  "wrong_data_posture",
  "wrong_score_posture",
  "unsafe_content",
  "wrong_decision"
]) {
  if (!doc.includes(repairReason)) problems.push(`${docPath} missing repair reason: ${repairReason}`);
}

for (const forbiddenInstruction of [
  "secret values",
  "environment values",
  "API keys",
  "auth tokens",
  "private dashboard URLs",
  "raw market-data payloads",
  "database row payloads",
  "SQL snippets",
  "Supabase table row contents",
  "user account personal details"
]) {
  if (!doc.includes(forbiddenInstruction)) problems.push(`${docPath} missing reject forbidden content: ${forbiddenInstruction}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder",
  "cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-template",
  "cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(safeReplyPath, safeReply, [
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "operatorSafeReplyStatus: ready_for_pm_review",
  "fill_post_platform_action_report_or_repair_failed_smoke"
]);

requireIncludes(readinessPath, readiness, [
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure"
]);

requireIncludes(decisionPath, decision, [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "GO_WITH_DEFERRALS"
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
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "A3 launch/production engineering"
]);

const scriptName = "check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-operator-safe-reply-pm-intake-recorder.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-operator-safe-reply-pm-intake-recorder.mjs",
  "phase-1-public-beta-operator-safe-reply-pm-intake-recorder"
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
      guardedStatus: "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "fill_post_platform_action_report_or_repair_failed_operator_intake"
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
