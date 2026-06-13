import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md";
const runbookPath = "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const runbook = read(runbookPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const artifactStatusPairs = [
  ["docs/A3_LAUNCH_ENGINEERING_HANDOFF.md", "handoff ready"],
  ["docs/A3_PUBLIC_BETA_PHASE_1_LAUNCH_READINESS_CHECKLIST.md", "a3_public_beta_phase_1_launch_readiness_checklist_ready"],
  ["docs/A3_NO_SECRET_PRODUCTION_ENV_AND_ROLLBACK_CHECKLIST.md", "a3_no_secret_production_env_and_rollback_checklist_ready"],
  ["docs/A3_PHASE_1_POST_DEPLOY_SMOKE_AND_MONITORING_PACKET.md", "a3_phase_1_post_deploy_smoke_and_monitoring_packet_ready"],
  ["docs/A3_PHASE_1_METADATA_AND_PUBLIC_ROUTE_SMOKE_CHECKER.md", "a3_phase_1_metadata_and_public_route_smoke_checker_ready"],
  ["docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md", "a3_phase_1_release_candidate_public_smoke_report_ready"],
  ["docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md", "a3_phase_1_public_beta_release_go_no_go_packet_ready"],
  ["docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md", "a3_phase_1_public_beta_chairman_review_packet_ready"],
  ["docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md", "a3_phase_1_public_beta_manual_platform_action_checklist_ready"],
  ["docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md", "a3_phase_1_public_beta_post_platform_action_report_template_ready"],
  ["docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md", "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready"]
];

const requiredPhrases = [
  "a3_phase_1_public_beta_release_ops_index_ready",
  "A3 Artifact Chain",
  "Current A3 Readiness Status",
  "Manual Platform Action Still Required",
  "Accepted Deferrals",
  "Required Checks",
  "Stop Lines",
  "CEO Recommendation",
  "prepare_phase_1_public_beta_release_review_summary_for_chairman",
  "publicDataSource=supabase",
  "scoreSource=real",
  "A3 launch operations are locally ready for a chairman/operator review"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [artifact, status] of artifactStatusPairs) {
  if (!doc.includes(`\`${artifact}\``)) problems.push(`${docPath} missing artifact: ${artifact}`);
  if (!doc.includes(status)) problems.push(`${docPath} missing status: ${status}`);
  if (!fs.existsSync(artifact)) problems.push(`missing referenced artifact: ${artifact}`);
}

for (const readiness of [
  "Phase 1 launch planning",
  "No-secret env inventory",
  "Route smoke scope",
  "Metadata/share smoke",
  "Public visible residue cleanup",
  "Go/no-go decision",
  "Chairman review",
  "Manual platform action",
  "Post-platform report",
  "Monitoring and repair",
  "Production deployment",
  "Real-data promotion",
  "Real-score promotion",
  "Phase 2 membership"
]) {
  if (!doc.includes(`| ${readiness} |`)) problems.push(`${docPath} missing readiness row: ${readiness}`);
}

for (const phrase of [
  "Must pass before chairman review, platform action, post-platform report, and monitoring keep-open decisions",
  "confirm public visible residue cleanup before and after platform action",
  "A3 launch operations are locally ready for a chairman/operator review after public visible residue cleanup remains `status=ok`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing public residue ops phrase: ${phrase}`);
}

for (const command of [
  "cmd.exe /c npm run check:a3-public-beta-phase-1-launch-readiness-checklist",
  "cmd.exe /c npm run check:a3-no-secret-production-env-and-rollback-checklist",
  "cmd.exe /c npm run check:a3-phase-1-post-deploy-smoke-and-monitoring-packet",
  "cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:a3-phase-1-release-candidate-public-smoke-report",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-release-go-no-go-packet",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-review-packet",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-release-ops-index",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

for (const deferral of [
  "custom domain",
  "paid monitoring vendor",
  "paid analytics vendor wiring",
  "Phase 2 login/member-only pages",
  "Phase 2 member-only daily three-layer interpretation",
  "Phase 2 watchlist persistence",
  "Phase 2 custom alert execution",
  "Phase 2 post-market review archive",
  "real-data promotion",
  "full Taiwan all-listed-equity coverage",
  "global market expansion"
]) {
  if (!doc.includes(deferral)) problems.push(`${docPath} missing deferral: ${deferral}`);
}

if (!runbook.includes("prepare_phase_1_public_beta_release_ops_index")) {
  problems.push(`${runbookPath} missing release ops index route linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-release-ops-index"] !==
  "node scripts/check-a3-phase-1-public-beta-release-ops-index.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-release-ops-index script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-release-ops-index.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 release ops index checker`);
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
      guardedStatus: "a3_phase_1_public_beta_release_ops_index_ready",
      phase: "Phase 1 public free index-lighting site",
      artifactCount: artifactStatusPairs.length,
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
