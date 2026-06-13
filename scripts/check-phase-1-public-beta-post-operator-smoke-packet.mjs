import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_post_operator_smoke_packet_ready_mock_only",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA_AFTER_OPERATOR_SMOKE",
  "public_beta_phase_1_launch_gap_rollup_ready_mock_only",
  "a3_phase_1_public_beta_release_ops_index_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "Route Smoke Table",
  "Public Claim Smoke Table",
  "Workstream Outcome Table",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "PM mainline",
  "A1 data/source coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning",
  "phase_1_public_beta_keep_open_or_repair_decision"
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
  "/stocks/0050",
  "/robots.txt",
  "/sitemap.xml"
];

const requiredEvidencePaths = [
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md",
  "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingRoutes = requiredRoutes.filter((route) => !doc.includes(`\`${route}\``));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path) && !doc.includes(path.split("/").at(-1)));
const packageRegistered = packageJson.includes(
  "\"check:phase-1-public-beta-post-operator-smoke-packet\": \"node scripts/check-phase-1-public-beta-post-operator-smoke-packet.mjs\""
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-public-beta-post-operator-smoke-packet.mjs");
const focusedGateRegistered = reviewGate.includes("\"phase-1-public-beta-post-operator-smoke-packet\"");
const unsafeAllowHits = findUnsafeAllowHits(doc);

const status =
  missingPhrases.length === 0 &&
  missingRoutes.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  unsafeAllowHits.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_post_operator_smoke_packet_ready_mock_only",
      missingPhrases,
      missingRoutes,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      unsafeAllowHits,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function readText(path) {
  if (!fs.existsSync(path)) return "";
  return fs.readFileSync(path, "utf8");
}

function findUnsafeAllowHits(text) {
  const hits = [];
  if (/KEEP_OPEN_WITH_DEFERRALS[\s\S]{0,500}publicDataSource=supabase/iu.test(text)) {
    hits.push("keep-open-allows-publicDataSource-supabase");
  }
  if (/KEEP_OPEN_WITH_DEFERRALS[\s\S]{0,500}scoreSource=real/iu.test(text)) {
    hits.push("keep-open-allows-scoreSource-real");
  }
  if (/KEEP_OPEN_WITH_DEFERRALS[\s\S]{0,500}Supabase write/iu.test(text)) {
    hits.push("keep-open-allows-supabase-write");
  }
  if (/KEEP_OPEN_WITH_DEFERRALS[\s\S]{0,500}SQL/iu.test(text)) {
    hits.push("keep-open-allows-sql");
  }
  return hits;
}
