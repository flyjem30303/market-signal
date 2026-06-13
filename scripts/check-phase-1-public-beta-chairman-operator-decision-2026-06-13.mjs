import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_2026_06_13.md";
const readinessPacketPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_READINESS_PACKET_OR_REPAIR.md";
const recordTemplatePath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md";
const manualChecklistPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const readinessPacket = read(readinessPacketPath);
const recordTemplate = read(recordTemplatePath);
const manualChecklist = read(manualChecklistPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "Filled Decision Record",
  "phase1-public-beta-chairman-operator-decision-20260613-1",
  "Chairman-delegated CEO / PM",
  "`GO_WITH_DEFERRALS`",
  "Phase 1 public free index-lighting site only",
  "none_for_phase_1_local_decision_packet",
  "yes_manual_platform_checklist_only",
  "prepare_phase_1_public_beta_manual_platform_action_checklist",
  "repair_phase_1_public_beta_blocker_then_recheck",
  "`mock`",
  "Decision Rationale",
  "What This Allows",
  "What This Does Not Allow",
  "Required Recheck Before Any Manual Platform Action",
  "prepare_no_secret_manual_platform_action_or_repair_recheck_failure"
]);

for (const status of [
  "phase_1_phase_2_execution_split_ready",
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready",
  "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "phase_1_public_beta_public_status_surface_alignment_ready_mock_only",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing source status: ${status}`);
}

for (const deferral of [
  "Phase 2 member registration and login",
  "Phase 2 member-only daily three-layer interpretation",
  "Phase 2 watchlist persistence",
  "Phase 2 custom alert execution",
  "Phase 2 post-market review archive",
  "real-data promotion",
  "full Taiwan all-listed-equity coverage",
  "global market expansion",
  "complete source automation"
]) {
  if (!doc.includes(deferral)) problems.push(`${docPath} missing accepted deferral: ${deferral}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-2026-06-13",
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing recheck command: ${command}`);
}

requireIncludes(readinessPacketPath, readinessPacket, [
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "GO_WITH_DEFERRALS",
  "REPAIR_REQUIRED"
]);

requireIncludes(recordTemplatePath, recordTemplate, [
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "Decision Record Template",
  "operatorActionAllowed"
]);

requireIncludes(manualChecklistPath, manualChecklist, [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Manual Vercel / Platform Checklist"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready",
  "A3 launch/production engineering",
  "A4 membership MVP planning"
]);

const scriptName = "check:phase-1-public-beta-chairman-operator-decision-2026-06-13";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-chairman-operator-decision-2026-06-13.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-chairman-operator-decision-2026-06-13.mjs",
  "phase-1-public-beta-chairman-operator-decision-2026-06-13"
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
      guardedStatus: "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
      decision: "GO_WITH_DEFERRALS",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "prepare_no_secret_manual_platform_action_or_repair_recheck_failure"
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
