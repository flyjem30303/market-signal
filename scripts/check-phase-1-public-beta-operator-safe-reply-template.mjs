import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md";
const readinessPath = "docs/PHASE_1_PUBLIC_BETA_NO_SECRET_MANUAL_PLATFORM_ACTION_READINESS.md";
const postActionPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const monitoringPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const readiness = read(readinessPath);
const postAction = read(postActionPath);
const monitoring = read(monitoringPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "Safe Reply Block",
  "operatorSafeReplyStatus: ready_for_pm_review",
  "decisionId: phase1-public-beta-chairman-operator-decision-20260613-1",
  "chairmanDecision: GO_WITH_DEFERRALS",
  "platformProjectLabel",
  "repositoryLabel",
  "branchLabel",
  "publicUrl: https://example.vercel.app",
  "deploymentLabel",
  "rollbackLabel",
  "publicDataSource: mock",
  "scoreSource: mock",
  "fill_post_platform_action_report_or_repair_failed_smoke",
  "Do Not Include",
  "PM Intake Rule",
  "Required Local Checks",
  "Stop Lines"
]);

for (const status of [
  "phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded",
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "pm_brief_runtime_mainline_goal_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing upstream status: ${status}`);
}

for (const field of [
  "envPresence_NEXT_PUBLIC_SITE_URL",
  "envPresence_NEXT_PUBLIC_DATA_SOURCE",
  "envPresence_DATA_FRESHNESS_SOURCE",
  "envPresence_NEXT_PUBLIC_SUPABASE_URL",
  "envPresence_NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "envPresence_SUPABASE_SERVICE_ROLE_KEY",
  "envPresence_INTERNAL_DIAGNOSTICS_ENABLED",
  "envPresence_INTERNAL_DIAGNOSTICS_TOKEN",
  "routeSmokeHome",
  "routeSmokeBriefing",
  "routeSmokeWeekly",
  "routeSmokeMethodology",
  "routeSmokeDisclaimer",
  "routeSmokeTerms",
  "routeSmokePrivacy",
  "routeSmokeStocksTWII",
  "routeSmokeStocks2330",
  "routeSmokeStocks0050",
  "routeSmokeRobotsTxt",
  "routeSmokeSitemapXml",
  "publicClaimSmokeNoSecrets",
  "publicClaimSmokeNoInternalResidue",
  "publicClaimSmokeNoLiveOfficialDataClaim",
  "publicClaimSmokeNoCompleteMarketCoverageClaim",
  "publicClaimSmokeNoInvestmentAdvice",
  "publicClaimSmokeNoBuySellHoldRecommendation",
  "rollbackNeeded",
  "rollbackPathVisible",
  "actionTaken",
  "actionResult"
]) {
  if (!doc.includes(field)) problems.push(`${docPath} missing safe reply field: ${field}`);
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
  "Supabase table row contents"
]) {
  if (!doc.includes(forbiddenInstruction)) problems.push(`${docPath} missing forbidden instruction: ${forbiddenInstruction}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-template",
  "cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

requireIncludes(readinessPath, readiness, [
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure"
]);

requireIncludes(postActionPath, postAction, [
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "Platform Action Outcome",
  "Public Claim Smoke Results"
]);

requireIncludes(monitoringPath, monitoring, [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Rollback Verification Cadence"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_no_secret_manual_platform_action_readiness_ready",
  "A3 launch/production engineering"
]);

const scriptName = "check:phase-1-public-beta-operator-safe-reply-template";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-operator-safe-reply-template.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-operator-safe-reply-template.mjs",
  "phase-1-public-beta-operator-safe-reply-template"
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
      guardedStatus: "phase_1_public_beta_operator_safe_reply_template_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "fill_post_platform_action_report_or_repair_failed_smoke"
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
