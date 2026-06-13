import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_visual_acceptance_and_a3_handoff_ready",
  "VISUAL_ACCEPTANCE_READY_THEN_A3_NO_SECRET_HANDOFF",
  "record chairman visual acceptance",
  "hand the candidate to A3",
  "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
  "phase_1_public_beta_human_visual_review_ready",
  "phase_1_public_beta_mock_launch_candidate_status_summary_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "pm_brief_runtime_mainline_goal_ready",
  "phase_1_public_beta_visual_acceptance_and_a3_handoff",
  "A3 No-Secret Handoff Criteria",
  "chairman decision is `GO` or `GO_WITH_DEFERRALS`",
  "final public readiness scan remains `status=ok`",
  "human/browser visual review remains `status=ok`",
  "TypeScript passes",
  "no secret values, API keys, tokens, raw payloads, platform env values, or private screenshots",
  "READY_FOR_CHAIRMAN_VISUAL_ACCEPTANCE_OR_A3_NO_SECRET_CHECKLIST",
  "check:phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "check:phase-1-public-beta-human-visual-review",
  "check:phase-1-public-beta-candidate-final-public-readiness-scan",
  "check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "No SQL",
  "No Supabase write",
  "No Supabase read without a separate explicit read-only gate",
  "No `daily_prices` mutation",
  "No raw market data fetch, store, or commit",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`",
  "phase_1_public_beta_chairman_visual_acceptance_record_or_a3_manual_platform_action"
];

const requiredFiles = [
  "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md",
  "docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md",
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
  '"check:phase-1-public-beta-visual-acceptance-and-a3-handoff": "node scripts/check-phase-1-public-beta-visual-acceptance-and-a3-handoff.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-visual-acceptance-and-a3-handoff.mjs"
);
const focusedGateRegistered = reviewGate.includes('"phase-1-public-beta-visual-acceptance-and-a3-handoff"');
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
      guardedStatus: "phase_1_public_beta_visual_acceptance_and_a3_handoff_ready",
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
