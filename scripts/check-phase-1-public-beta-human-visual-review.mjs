import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_human_visual_review_ready",
  "PUBLIC_VISUAL_REVIEW_PASS_WITH_MOCK_BOUNDARY",
  "market-status product for general investors",
  "Reviewed Routes",
  "`/`",
  "`/briefing`",
  "`/stocks/2330`",
  "clear 30-second market mood language",
  "clear 3-minute action-judgment language",
  "source, update-time, and demonstrative-data boundaries",
  "non-investment-advice / no-buy-sell-advice wording",
  "Phase 2 membership roadmap as a deferred path",
  "no visible command snippets",
  "no visible local file paths",
  "no visible SQL, Supabase write, staging row, raw payload, secret, API key, token",
  "PASS_HUMAN_BROWSER_REVIEW_AS_MOCK_ONLY_PUBLIC_BETA",
  "check:phase-1-public-beta-candidate-final-public-readiness-scan",
  "check:public-beta-mock-launch-proof-bundle",
  "phase_1_public_beta_a3_no_secret_platform_checklist_or_chairman_visual_acceptance",
  "No SQL",
  "No Supabase write",
  "No `daily_prices` mutation",
  "No raw market data fetch, store, or commit",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`",
  "No investment advice claim"
];

const forbiddenPatterns = [
  /publicDataSource\s*=\s*["']supabase["']/u,
  /scoreSource\s*=\s*["']real["']/u,
  /GO\s+WITH\s+REAL\s+DATA/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /raw market data fetch is approved/iu,
  /investment advice is provided/iu
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(doc)?.[0])
  .filter(Boolean);
const packageRegistered = packageJson.includes(
  '"check:phase-1-public-beta-human-visual-review": "node scripts/check-phase-1-public-beta-human-visual-review.mjs"'
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-public-beta-human-visual-review.mjs");
const focusedGateRegistered = reviewGate.includes('"phase-1-public-beta-human-visual-review"');
const status =
  missingPhrases.length === 0 &&
  forbiddenHits.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_human_visual_review_ready",
      missingPhrases,
      forbiddenHits,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
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
