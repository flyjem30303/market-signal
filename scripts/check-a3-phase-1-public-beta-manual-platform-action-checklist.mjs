import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const chairmanPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const chairman = read(chairmanPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Required Decision Before Use",
  "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md",
  "phase_1_public_beta_chairman_visual_acceptance_recorded",
  "`GO`",
  "`GO_WITH_DEFERRALS`",
  "`NO_GO`",
  "Pre-Platform Local Evidence",
  "Manual Vercel / Platform Checklist",
  "Required Environment Names",
  "Deployment Action Boundary",
  "chairman visual acceptance record is `phase_1_public_beta_chairman_visual_acceptance_recorded`",
  "Post-Deploy Public Smoke",
  "Core remote route command",
  "stale or the wrong branch/artifact is live",
  "Post-Deploy Public Claim Smoke",
  "Rollback Trigger",
  "Stop Lines",
  "prepare_phase_1_public_beta_post_platform_action_report_template",
  "publicDataSource=supabase",
  "scoreSource=real",
  "data posture remains `mock`",
  "score posture remains `mock`"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const command of [
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:public-surface-user-facing-audit",
  "cmd.exe /c npm run check:phase-1-public-beta-candidate-final-public-readiness-scan",
  "cmd.exe /c npm run check:phase-1-public-beta-human-visual-review",
  "cmd.exe /c npm run check:phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-visual-acceptance-record",
  "cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "cmd.exe /c npm run check:a3-phase-1-release-candidate-public-smoke-report",
  "cmd.exe /c npm run check:a3-phase-1-core-route-reading-contract-rollup",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-release-go-no-go-packet",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-review-packet",
  'cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"',
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing pre-platform command: ${command}`);
}

for (const phrase of [
  "Public visible residue cleanup",
  "public visible residue cleanup passed and no development residue appears on public routes",
  "core route reading contract rollup passed, proving Home, Briefing, and Stock share the 30-second / 3-minute reading path",
  "development residue"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing residue cleanup phrase: ${phrase}`);
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
  if (!doc.includes(`\`${envName}\``)) problems.push(`${docPath} missing env name: ${envName}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/robots.txt", "/sitemap.xml"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing post-deploy route: ${route}`);
}

for (const platformItem of [
  "Project",
  "Framework",
  "Root directory",
  "Build command",
  "Install command",
  "Node version",
  "Branch",
  "Public URL",
  "Rollback"
]) {
  if (!doc.includes(`| ${platformItem} |`)) problems.push(`${docPath} missing platform checklist item: ${platformItem}`);
}

for (const contractPhrase of [
  "Home, Briefing, and Stock share the public reading contract",
  "30-second market or stock-state quick read",
  "3-minute decision / risk review path",
  "data timing and source-coverage boundary",
  "no-advice reminder"
]) {
  if (!doc.includes(contractPhrase)) problems.push(`${docPath} missing reading contract smoke phrase: ${contractPhrase}`);
}

for (const rollbackField of [
  "failed route or claim",
  "deployment label rolled back from",
  "last known good deployment label",
  "route smoke result after rollback",
  "next repair route"
]) {
  if (!doc.includes(rollbackField)) problems.push(`${docPath} missing rollback field: ${rollbackField}`);
}

if (!chairman.includes("prepare_phase_1_public_beta_manual_platform_action_checklist")) {
  problems.push(`${chairmanPath} missing manual platform route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-manual-platform-action-checklist"] !==
  "node scripts/check-a3-phase-1-public-beta-manual-platform-action-checklist.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-manual-platform-action-checklist script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-manual-platform-action-checklist.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 manual platform checker`);
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
      guardedStatus: "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
      phase: "Phase 1 public free index-lighting site",
      platformActionExecuted: false,
      productionDeployAuthorized: false,
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
