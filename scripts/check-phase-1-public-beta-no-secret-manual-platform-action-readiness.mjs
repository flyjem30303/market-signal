import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_NO_SECRET_MANUAL_PLATFORM_ACTION_READINESS.md";
const decisionPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_2026_06_13.md";
const readinessPacketPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_READINESS_PACKET_OR_REPAIR.md";
const manualPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const postActionPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const decision = read(decisionPath);
const readinessPacket = read(readinessPacketPath);
const manual = read(manualPath);
const postAction = read(postActionPath);
const monitoring = read(monitoringPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "Required Upstream Evidence",
  "Operator May Verify",
  "Required Environment Presence Check",
  "Local Recheck Before Operator Action",
  "Decision If Recheck Fails",
  "Manual Action Boundary",
  "Stop Lines",
  "operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure",
  "GO_WITH_DEFERRALS",
  "names and presence only",
  "Do not report",
  "environment values",
  "repair_phase_1_public_beta_blocker_then_recheck",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
]);

for (const status of [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing upstream status: ${status}`);
}

for (const envName of [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DATA_SOURCE",
  "DATA_FRESHNESS_SOURCE",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "INTERNAL_DIAGNOSTICS_ENABLED",
  "INTERNAL_DIAGNOSTICS_TOKEN"
]) {
  if (!doc.includes(`\`${envName}\``)) problems.push(`${docPath} missing env presence row: ${envName}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness",
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-2026-06-13",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(decisionPath, decision, [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "GO_WITH_DEFERRALS",
  "yes_manual_platform_checklist_only"
]);

requireIncludes(readinessPacketPath, readinessPacket, [
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "record_chairman_operator_decision_or_repair_phase_1_public_beta_blocker"
]);

requireIncludes(manualPath, manual, [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Manual Vercel / Platform Checklist",
  "Required Environment Names",
  "Post-Deploy Public Smoke"
]);

requireIncludes(postActionPath, postAction, [
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "Post-Deploy Route Smoke Results",
  "Public Claim Smoke Results"
]);

requireIncludes(monitoringPath, monitoring, [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Monitoring Cadence",
  "Rollback Verification Cadence"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "A3 launch/production engineering",
  "A4 membership MVP planning"
]);

const scriptName = "check:phase-1-public-beta-no-secret-manual-platform-action-readiness";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-no-secret-manual-platform-action-readiness.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-no-secret-manual-platform-action-readiness.mjs",
  "phase-1-public-beta-no-secret-manual-platform-action-readiness"
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
      guardedStatus: "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
      decision: "GO_WITH_DEFERRALS",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure"
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
