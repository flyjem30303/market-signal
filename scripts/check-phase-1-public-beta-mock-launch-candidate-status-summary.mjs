import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredDocPhrases = [
  "phase_1_public_beta_mock_launch_candidate_status_summary_ready",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE",
  "Phase 1 can move as a public free index-lighting site candidate while the runtime stays mock-only.",
  "What Can Go Public Now",
  "30-second market mood reading",
  "3-minute action judgment",
  "alert list with status, cause, update time, impact level, and next step",
  "What Remains Deferred",
  "real data promotion",
  "complete Taiwan market coverage",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Candidate Evidence",
  "check:public-beta-phase-1-launch-gap-rollup",
  "check:public-beta-mock-launch-proof-bundle",
  "check:public-beta-core-route-quick-proof",
  "check:public-visible-language-quality",
  "check:public-surface-user-facing-audit",
  "check:public-beta-alert-list-actionability",
  "check:public-beta-membership-mvp-roadmap",
  "A3 Resume Conditions",
  "a real Vercel/platform action is about to be performed",
  "Workstream Assignments",
  "A1 data/source/coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning",
  "Stop Lines",
  "No SQL",
  "No Supabase write",
  "No `daily_prices` mutation",
  "No raw market data fetch, store, or commit",
  "No investment advice claim",
  "phase_1_public_beta_candidate_final_public_readiness_scan"
];

const requiredEvidencePaths = [
  "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md",
  "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md",
  "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingDocPhrases = requiredDocPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  "\"check:phase-1-public-beta-mock-launch-candidate-status-summary\": \"node scripts/check-phase-1-public-beta-mock-launch-candidate-status-summary.mjs\""
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-mock-launch-candidate-status-summary.mjs"
);
const focusedGateRegistered = reviewGate.includes("\"phase-1-public-beta-mock-launch-candidate-status-summary\"");
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
      guardedStatus: "phase_1_public_beta_mock_launch_candidate_status_summary_ready",
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
  if (/publicDataSource\s*=\s*["']supabase["']/u.test(text)) hits.push("publicDataSource assignment");
  if (/scoreSource\s*=\s*["']real["']/u.test(text)) hits.push("scoreSource assignment");
  if (/GO\s+WITH\s+REAL\s+DATA/iu.test(text)) hits.push("go-with-real-data-claim");
  if (/SQL execution is approved/iu.test(text)) hits.push("sql-approved");
  if (/Supabase writes are approved/iu.test(text)) hits.push("supabase-write-approved");
  if (/raw market data fetch is approved/iu.test(text)) hits.push("raw-fetch-approved");
  if (/investment advice is provided/iu.test(text)) hits.push("investment-advice-claim");
  return hits;
}
