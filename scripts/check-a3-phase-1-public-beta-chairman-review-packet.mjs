import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md";
const goNoGoPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const goNoGo = read(goNoGoPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "CEO Recommendation Shape",
  "`GO`",
  "`GO_WITH_DEFERRALS`",
  "`NO_GO`",
  "Current default recommendation until a real release review is filled: `GO_WITH_DEFERRALS`",
  "Phase 1 Business Summary",
  "30 seconds: understand current market atmosphere",
  "3 minutes: decide whether to observe, review, or reduce risk",
  "Evidence To Review",
  "Chairman Decision Boundaries",
  "Accepted Deferrals For Chairman Review",
  "Workstream Decisions",
  "Review Output Template",
  "prepare_phase_1_public_beta_manual_platform_action_checklist",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_release_candidate_public_smoke_report_ready",
  "a3_phase_1_metadata_and_public_route_smoke_checker_ready",
  "a3_phase_1_public_beta_release_go_no_go_packet_ready"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing evidence status: ${status}`);
}

for (const route of ["/disclaimer", "/terms", "/privacy"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing trust route: ${route}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

if (!doc.includes("Public visible residue cleanup")) {
  problems.push(`${docPath} missing public visible residue cleanup evidence row`);
}

if (!doc.includes("public visible residue cleanup as required pre-release evidence")) {
  problems.push(`${docPath} missing chairman acceptance boundary for public visible residue cleanup`);
}

for (const field of ["chairmanDecision", "decisionTimestamp", "acceptedDeferrals", "hardBlockers", "nextRoute"]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing review output field: ${field}`);
}

for (const lane of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing lane decision: ${lane}`);
}

for (const deferral of [
  "custom domain",
  "paid monitoring vendor",
  "paid analytics vendor wiring",
  "Phase 2 member login and member-only content",
  "Phase 2 watchlist persistence and custom alert execution",
  "Phase 2 post-market review archive",
  "real-data promotion",
  "full Taiwan all-listed-equity coverage",
  "global market expansion"
]) {
  if (!doc.includes(deferral)) problems.push(`${docPath} missing deferral: ${deferral}`);
}

if (!goNoGo.includes("prepare_phase_1_public_beta_chairman_review_packet")) {
  problems.push(`${goNoGoPath} missing chairman review route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-chairman-review-packet"] !==
  "node scripts/check-a3-phase-1-public-beta-chairman-review-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-chairman-review-packet script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-chairman-review-packet.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 chairman review checker`);
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
      guardedStatus: "a3_phase_1_public_beta_chairman_review_packet_ready",
      defaultRecommendation: "GO_WITH_DEFERRALS",
      phase: "Phase 1 public free index-lighting site",
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
