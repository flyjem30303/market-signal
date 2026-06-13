import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_chairman_visual_acceptance_recorded",
  "ACCEPT_PHASE_1_MOCK_ONLY_PUBLIC_BETA_VISUAL_CANDIDATE",
  "public visual/product readiness",
  "Phase 1 public free index-lighting website",
  "30-second market mood comprehension",
  "3-minute observation / risk-reduction judgment support",
  "visible source, update-time, and demonstrative-data boundaries",
  "visible non-investment-advice / no-buy-sell-advice posture",
  "Phase 2 membership MVP path as deferred roadmap",
  "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
  "phase_1_public_beta_human_visual_review_ready",
  "phase_1_public_beta_visual_acceptance_and_a3_handoff_ready",
  "phase_1_public_beta_mock_launch_candidate_status_summary_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "Accepted Deferrals",
  "Not Authorized By This Acceptance",
  "check:phase-1-public-beta-chairman-visual-acceptance-record",
  "check:phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "check:phase-1-public-beta-human-visual-review",
  "PHASE_1_MOCK_ONLY_PUBLIC_BETA_VISUAL_CANDIDATE_ACCEPTED",
  "phase_1_public_beta_a3_manual_platform_action_if_deployment_proceeds",
  "No SQL",
  "No Supabase write",
  "No `daily_prices` mutation",
  "No raw market data fetch, store, or commit",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`"
];

const requiredFiles = [
  "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md",
  "docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md",
  "docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md",
  "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md"
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
const missingFiles = requiredFiles.filter((path) => !fs.existsSync(path));
const missingFileReferences = requiredFiles.filter((path) => !doc.includes(path));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(doc)?.[0])
  .filter(Boolean);
const packageRegistered = packageJson.includes(
  '"check:phase-1-public-beta-chairman-visual-acceptance-record": "node scripts/check-phase-1-public-beta-chairman-visual-acceptance-record.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-chairman-visual-acceptance-record.mjs"
);
const focusedGateRegistered = reviewGate.includes('"phase-1-public-beta-chairman-visual-acceptance-record"');
const status =
  missingPhrases.length === 0 &&
  missingFiles.length === 0 &&
  missingFileReferences.length === 0 &&
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
      guardedStatus: "phase_1_public_beta_chairman_visual_acceptance_recorded",
      missingPhrases,
      missingFiles,
      missingFileReferences,
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
