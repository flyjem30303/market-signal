import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_POST_DEPLOY_SMOKE_AND_MONITORING_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_post_deploy_smoke_and_monitoring_packet_ready",
  "Phase 1 Post-Deploy Smoke Routes",
  "Monitoring Owner And Alert Path",
  "Rollback Owner And Threshold",
  "Analytics Event Confirmation",
  "SEO And Share Metadata Confirmation",
  "prepare_phase_1_metadata_and_public_route_smoke_checker",
  "publicDataSource=supabase",
  "scoreSource=real"
];

const requiredRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050"
];

const requiredEvents = [
  "view_home_market_signal",
  "open_briefing_market_context",
  "open_stock_signal_detail",
  "open_methodology",
  "open_member_preview",
  "click_member_interest"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const route of requiredRoutes) {
  if (!doc.includes(`| \`${route}\``) && !doc.includes(`\`${route}\``)) {
    problems.push(`${docPath} missing route: ${route}`);
  }
}

for (const event of requiredEvents) {
  if (!doc.includes(`\`${event}\``)) problems.push(`${docPath} missing analytics event: ${event}`);
}

for (const phrase of [
  "no command strings are visible",
  "no local file paths are visible",
  "no internal role labels are visible",
  "no env placeholders are visible",
  "no secret values are visible",
  "no raw payload or database terms are visible",
  "no real-time market-data claim appears",
  "no investment-advice wording appears",
  "Data rollback is out of scope for this packet"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing smoke/rollback guard: ${phrase}`);
}

if (
  pkg.scripts?.["check:a3-phase-1-post-deploy-smoke-and-monitoring-packet"] !==
  "node scripts/check-a3-phase-1-post-deploy-smoke-and-monitoring-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-post-deploy-smoke-and-monitoring-packet script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-post-deploy-smoke-and-monitoring-packet.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 post-deploy smoke checker`);
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
      guardedStatus: "a3_phase_1_post_deploy_smoke_and_monitoring_packet_ready",
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
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
