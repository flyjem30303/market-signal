import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const manualPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const manual = read(manualPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "Report Identity",
  "Pre-Action Evidence Snapshot",
  "Platform Action Outcome",
  "Post-Deploy Route Smoke Results",
  "Public Claim Smoke Results",
  "Rollback Result",
  "Final Launch Note",
  "Stop Lines",
  "prepare_phase_1_public_beta_monitoring_and_repair_runbook",
  "publicDataSource=supabase",
  "scoreSource=real",
  "`dataPosture` | `mock`",
  "`scorePosture` | `mock`",
  "`publicDataSource` | `mock`",
  "`scoreSource` | `mock`"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const field of [
  "reportId",
  "preparedBy",
  "preparedAt",
  "chairmanDecision",
  "platformActionType",
  "publicUrl",
  "deploymentLabel",
  "dataPosture",
  "scorePosture",
  "actionTaken",
  "operator",
  "actionStartedAt",
  "actionCompletedAt",
  "actionResult",
  "rollbackNeeded",
  "finalLaunchStatus",
  "acceptedDeferrals",
  "remainingHardBlockers",
  "nextRoute"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing field: ${field}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/robots.txt", "/sitemap.xml"]) {
  if (!doc.includes(`| \`${route}\` |`)) problems.push(`${docPath} missing route row: ${route}`);
}

for (const status of [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_release_go_no_go_packet_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing pre-action status: ${status}`);
}

for (const claimGuard of [
  "no command snippets visible",
  "no local file paths visible",
  "no development residue visible",
  "no internal role labels visible",
  "no environment placeholders visible",
  "no secret values visible",
  "no raw payload or database implementation language visible",
  "no live official market-data claim",
  "no complete-market-data claim",
  "no official endorsement claim",
  "no guaranteed-return claim",
  "no investment advice",
  "no buy/sell/hold recommendation"
]) {
  if (!doc.includes(claimGuard)) problems.push(`${docPath} missing claim guard: ${claimGuard}`);
}

if (!doc.includes("Public visible residue cleanup")) {
  problems.push(`${docPath} missing public visible residue cleanup pre-action evidence`);
}

if (!manual.includes("prepare_phase_1_public_beta_post_platform_action_report_template")) {
  problems.push(`${manualPath} missing post-platform report route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-post-platform-action-report-template"] !==
  "node scripts/check-a3-phase-1-public-beta-post-platform-action-report-template.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-post-platform-action-report-template script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-post-platform-action-report-template.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 post-platform report checker`);
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
      guardedStatus: "a3_phase_1_public_beta_post_platform_action_report_template_ready",
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
