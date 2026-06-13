import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md";
const metadataPacketPath = "docs/A3_PHASE_1_METADATA_AND_PUBLIC_ROUTE_SMOKE_CHECKER.md";
const postDeployPacketPath = "docs/A3_PHASE_1_POST_DEPLOY_SMOKE_AND_MONITORING_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const metadataPacket = read(metadataPacketPath);
const postDeployPacket = read(postDeployPacketPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_release_candidate_public_smoke_report_ready",
  "Release Candidate Identity",
  "Pre-Deploy Local Checks",
  "Remote Public URL Smoke Command",
  "Post-Deploy Public Route Smoke",
  "Public Claim Smoke",
  "Metadata And Share Smoke",
  "Rollback Readiness",
  "prepare_phase_1_public_beta_release_go_no_go_packet",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const field of [
  "releaseCandidateId",
  "commitOrBuildLabel",
  "preparedBy",
  "preparedAt",
  "targetEnvironment",
  "publicUrl",
  "dataPosture",
  "scorePosture"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing release candidate field: ${field}`);
}

for (const command of [
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:home-product-first-information-hierarchy",
  "cmd.exe /c npm run check:home-core-indicator-readout",
  "cmd.exe /c npm run check:weekly-market-action-summary",
  "cmd.exe /c npm run check:stock-product-first-runtime-readability",
  "cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment",
  "cmd.exe /c npm run check:public-beta-membership-mvp-roadmap",
  "cmd.exe /c npm run check:public-beta-core-route-quick-proof",
  'cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"',
  "cmd.exe /c npm run check:public-surface-user-facing-audit",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "cmd.exe /c npm run check:a3-phase-1-post-deploy-smoke-and-monitoring-packet",
  "cmd.exe /c npm run check:review-gates",
  "cmd.exe /c npm run build"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing pre-deploy command: ${command}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/robots.txt", "/sitemap.xml"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing route smoke entry: ${route}`);
}

for (const phrase of [
  "understand the market mood within 30 seconds",
  "decide whether to observe, review, or reduce risk within 3 minutes",
  "no development residue appears on public routes",
  "no Phase 1 / Phase 2 / Membership MVP internal labels are visible on public pages",
  "the free/member boundary is clear without opening member login, payment, watchlist persistence, alert execution, or member-only content during Phase 1",
  "stale_deployment_or_wrong_branch",
  "home title names `指數燈號`",
  "canonical URL uses `NEXT_PUBLIC_SITE_URL`",
  "Data rollback is out of scope for this report"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing launch smoke phrase: ${phrase}`);
}

for (const phrase of [
  "prepare_phase_1_release_candidate_public_smoke_report",
  "a3_phase_1_metadata_and_public_route_smoke_checker_ready"
]) {
  if (!metadataPacket.includes(phrase)) problems.push(`${metadataPacketPath} missing RC route linkage: ${phrase}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  if (!postDeployPacket.includes(`\`${route}\``)) problems.push(`${postDeployPacketPath} missing inherited route: ${route}`);
}

if (
  pkg.scripts?.["check:a3-phase-1-release-candidate-public-smoke-report"] !==
  "node scripts/check-a3-phase-1-release-candidate-public-smoke-report.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-release-candidate-public-smoke-report script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-release-candidate-public-smoke-report.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 release candidate smoke checker`);
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
      guardedStatus: "a3_phase_1_release_candidate_public_smoke_report_ready",
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
