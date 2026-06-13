import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_operator_review_summary_ready_mock_only",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA_AFTER_OPERATOR_SMOKE",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 membership remains planned but deferred",
  "Public routes load",
  "mock/formal-data boundary",
  "source status",
  "coverage status",
  "update time",
  "non-investment-advice",
  "publicDataSource=mock",
  "scoreSource=mock",
  "SQL execution is required",
  "Supabase write is required",
  "publicDataSource=supabase",
  "scoreSource=real",
  "official endorsement",
  "complete Taiwan market coverage",
  "real-time precision",
  "investment advice",
  "PM mainline",
  "A1 data/source coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning",
  "phase_1_public_beta_post_operator_smoke_packet"
];

const requiredEvidencePaths = [
  "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md",
  "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  "\"check:phase-1-public-beta-operator-review-summary\": \"node scripts/check-phase-1-public-beta-operator-review-summary.mjs\""
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-public-beta-operator-review-summary.mjs");
const focusedGateRegistered = reviewGate.includes("\"phase-1-public-beta-operator-review-summary\"");
const unsafeAllowHits = findUnsafeAllowHits(doc);
const status =
  missingPhrases.length === 0 &&
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
      guardedStatus: "phase_1_public_beta_operator_review_summary_ready_mock_only",
      missingPhrases,
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
  if (/Proceed with\s+publicDataSource=supabase/iu.test(text)) hits.push("allows-publicDataSource-supabase");
  if (/Proceed with\s+scoreSource=real/iu.test(text)) hits.push("allows-scoreSource-real");
  if (/Operator may proceed[\s\S]{0,500}Supabase write/iu.test(text)) hits.push("operator-go-includes-supabase-write");
  if (/Operator may proceed[\s\S]{0,500}SQL/iu.test(text)) hits.push("operator-go-includes-sql");
  return hits;
}
