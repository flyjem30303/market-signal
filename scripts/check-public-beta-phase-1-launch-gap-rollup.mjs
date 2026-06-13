import fs from "node:fs";

const docPath = "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredDocPhrases = [
  "public_beta_phase_1_launch_gap_rollup_ready_mock_only",
  "Phase 1 public free index-lighting site",
  "Phase 2 membership is a planned path, not a Phase 1 blocker",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE",
  "HOLD_FOR_REAL_DATA",
  "HOLD_FOR_PHASE_2_MEMBERSHIP",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase write",
  "PM mainline",
  "A1 data/source coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning",
  "phase_1_public_beta_mock_launch_candidate_status_summary",
  "A3 operator/platform review remains available only when a real platform action or post-deploy smoke record is needed"
];

const requiredEvidencePaths = [
  "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md",
  "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingDocPhrases = requiredDocPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  "\"check:public-beta-phase-1-launch-gap-rollup\": \"node scripts/check-public-beta-phase-1-launch-gap-rollup.mjs\""
);
const reviewGateRegistered = reviewGate.includes("scripts/check-public-beta-phase-1-launch-gap-rollup.mjs");
const focusedGateRegistered = reviewGate.includes("\"public-beta-phase-1-launch-gap-rollup\"");
const forbiddenHits = findForbiddenHits(doc);
const status =
  missingDocPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  forbiddenHits.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "public_beta_phase_1_launch_gap_rollup_ready_mock_only",
      missingDocPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      forbiddenHits,
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

function findForbiddenHits(text) {
  const hits = [];
  if (hasUnqualifiedForbiddenToken(text, "publicDataSource=supabase")) hits.push("publicDataSource=supabase");
  if (hasUnqualifiedForbiddenToken(text, "scoreSource=real")) hits.push("scoreSource=real");
  if (/GO\s+WITH\s+REAL\s+DATA/iu.test(text)) hits.push("go-with-real-data-claim");
  if (/official endorsement/iu.test(text) && !/No claim of official endorsement/u.test(text)) {
    hits.push("official-endorsement-claim");
  }
  return hits;
}

function hasUnqualifiedForbiddenToken(text, token) {
  return text
    .split(/\r?\n/u)
    .some((line) => line.includes(token) && !/^\s*-\s*No\s+/iu.test(line) && !/no\s+/iu.test(line.slice(0, 12)));
}
