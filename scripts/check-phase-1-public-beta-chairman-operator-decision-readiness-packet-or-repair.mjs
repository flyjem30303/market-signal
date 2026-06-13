import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_READINESS_PACKET_OR_REPAIR.md";
const refreshPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_DECISION_OR_MANUAL_PLATFORM_ACTION_READINESS_REFRESH.md";
const releaseSummaryPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_REVIEW_SUMMARY_FOR_CHAIRMAN.md";
const chairmanPacketPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md";
const decisionRecordPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md";
const manualChecklistPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const refresh = read(refreshPath);
const releaseSummary = read(releaseSummaryPath);
const chairmanPacket = read(chairmanPacketPath);
const decisionRecord = read(decisionRecordPath);
const manualChecklist = read(manualChecklistPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "Required Evidence Inputs",
  "Decision Packet",
  "Chairman / Operator Review Summary",
  "Repair Routing Conditions",
  "Workstream Assignment",
  "Required Checks",
  "Stop Lines",
  "record_chairman_operator_decision_or_repair_phase_1_public_beta_blocker",
  "record_chairman_operator_decision_then_manual_platform_checklist",
  "repair_phase_1_public_beta_blocker_then_recheck",
  "GO",
  "GO_WITH_DEFERRALS",
  "NO_GO",
  "REPAIR_REQUIRED",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Phase 2 membership implementation"
]);

for (const status of [
  "phase_1_phase_2_execution_split_ready",
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready",
  "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "phase_1_public_beta_public_status_surface_alignment_ready_mock_only",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required status: ${status}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair",
  "cmd.exe /c npm run check:phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh",
  "cmd.exe /c npm run check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-release-review-summary-for-chairman",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-review-packet",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-operator-decision-record",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(refreshPath, refresh, [
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready",
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair"
]);

requireIncludes(releaseSummaryPath, releaseSummary, [
  "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
  "GO_WITH_DEFERRALS_TO_OPERATOR_REVIEW",
  "Phase 2 membership remains planned but non-blocking"
]);

requireIncludes(chairmanPacketPath, chairmanPacket, [
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "GO_WITH_DEFERRALS",
  "Phase 2 member login and member-only content"
]);

requireIncludes(decisionRecordPath, decisionRecord, [
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "prepare_phase_1_public_beta_manual_platform_action_checklist",
  "repair_phase_1_public_beta_release_blocker"
]);

requireIncludes(manualChecklistPath, manualChecklist, [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Manual Vercel / Platform Checklist",
  "Post-Deploy Public Smoke"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh",
  "A3 launch/production engineering",
  "A4 membership MVP planning"
]);

const scriptName = "check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair.mjs",
  "phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair"
]);

for (const [filePath, source] of [[docPath, doc]]) {
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
      guardedStatus: "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "record_chairman_operator_decision_or_repair_phase_1_public_beta_blocker"
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
