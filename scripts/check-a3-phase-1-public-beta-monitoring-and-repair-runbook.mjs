import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const postPlatformPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const postPlatform = read(postPlatformPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Required Inputs",
  "Monitoring Cadence",
  "Route Health Review Owner",
  "Public Copy Regression Owner",
  "Rollback Verification Cadence",
  "Repair Priority Ladder",
  "Required Local Checks After Repair",
  "Workstream Loop",
  "Stop Lines",
  "prepare_phase_1_public_beta_release_ops_index",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Phase 2 membership and real-data promotion remain deferred"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_release_go_no_go_packet_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required input status: ${status}`);
}

for (const cadence of [
  "First 15 minutes after deploy",
  "First 60 minutes after deploy",
  "First 24 hours",
  "Every business day during Beta",
  "After each future deploy",
  "Weekly during Beta"
]) {
  if (!doc.includes(cadence)) problems.push(`${docPath} missing monitoring cadence: ${cadence}`);
}

for (const route of ["/", "/briefing", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/robots.txt", "/sitemap.xml"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing route: ${route}`);
}

for (const priority of ["P0", "P1", "P2"]) {
  if (!doc.includes(`| ${priority} |`)) problems.push(`${docPath} missing repair priority: ${priority}`);
}

for (const lane of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing workstream lane: ${lane}`);
}

for (const command of [
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:public-surface-user-facing-audit",
  "cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing repair check command: ${command}`);
}

for (const risk of [
  "implies live official market data",
  "implies complete-market coverage",
  "implies official endorsement",
  "implies guaranteed return",
  "investment advice",
  "buy/sell/hold guidance",
  "command snippets",
  "development residue",
  "local file paths",
  "env placeholders",
  "raw payload language",
  "database implementation language"
]) {
  if (!doc.includes(risk)) problems.push(`${docPath} missing copy regression risk: ${risk}`);
}

if (!doc.includes("public visible residue cleanup")) {
  problems.push(`${docPath} missing public visible residue cleanup monitoring wording`);
}

if (!doc.includes("visible development residue that harms trust")) {
  problems.push(`${docPath} missing development residue P0 trust condition`);
}

if (!postPlatform.includes("prepare_phase_1_public_beta_monitoring_and_repair_runbook")) {
  problems.push(`${postPlatformPath} missing monitoring runbook route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-monitoring-and-repair-runbook"] !==
  "node scripts/check-a3-phase-1-public-beta-monitoring-and-repair-runbook.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-monitoring-and-repair-runbook script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-monitoring-and-repair-runbook.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 monitoring repair checker`);
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
      guardedStatus: "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
      phase: "Phase 1 public free index-lighting site",
      monitoringPrepared: true,
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
