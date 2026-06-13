import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md";
const rcReportPath = "docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const rcReport = read(rcReportPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_release_go_no_go_packet_ready",
  "Decision Options",
  "`GO`",
  "`GO_WITH_DEFERRALS`",
  "`NO_GO`",
  "Required GO Evidence",
  "Hard Blockers",
  "Accepted Deferrals",
  "Phase 2 Membership Deferral",
  "Lane Assignments",
  "Stop Lines",
  "CEO Recommendation",
  "prepare_phase_1_public_beta_chairman_review_packet",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Data posture remains `mock`",
  "Score posture remains `mock`"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing route: ${route}`);
}

for (const command of [
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command reference: ${command}`);
}

for (const phrase of [
  "Public route smoke is ok",
  "Metadata and share smoke is ok",
  "Public visible-language checks are ok",
  "Public visible residue cleanup is ok",
  "Legal and trust routes are reachable",
  "Rollback path is documented",
  "No SQL execution occurred",
  "No Supabase read/write occurred",
  "No staging row was created",
  "No `daily_prices` mutation occurred",
  "No raw market-data fetch, ingest, storage, logging, or commit occurred"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing GO evidence: ${phrase}`);
}

for (const phrase of [
  "custom domain",
  "paid monitoring vendor",
  "paid analytics vendor wiring",
  "Phase 2 login/member-only pages",
  "Phase 2 member-only daily three-layer interpretation",
  "Phase 2 watchlist persistence",
  "Phase 2 custom alert execution",
  "Phase 2 post-market review archive",
  "real-data promotion",
  "full Taiwan all-listed-equity row coverage",
  "global-market expansion"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing accepted deferral: ${phrase}`);
}

for (const lane of ["PM", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing lane assignment: ${lane}`);
}

if (!rcReport.includes("prepare_phase_1_public_beta_release_go_no_go_packet")) {
  problems.push(`${rcReportPath} missing go/no-go route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-release-go-no-go-packet"] !==
  "node scripts/check-a3-phase-1-public-beta-release-go-no-go-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-release-go-no-go-packet script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-release-go-no-go-packet.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 public beta release go/no-go checker`);
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
      guardedStatus: "a3_phase_1_public_beta_release_go_no_go_packet_ready",
      phase: "Phase 1 public free index-lighting site",
      decisionOptions: ["GO", "GO_WITH_DEFERRALS", "NO_GO"],
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
