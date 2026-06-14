import fs from "node:fs";

const docPath = "docs/PHASE_1_HUMAN_UI_UX_ACCEPTANCE_CHECKLIST.md";
const polishCandidatePath = "docs/PHASE_1_FINAL_UI_UX_POLISH_CANDIDATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_human_ui_ux_acceptance_checklist_ready",
  "READY_FOR_FINAL_HUMAN_UI_UX_ACCEPTANCE_PASS",
  "understand the market or symbol state in 30 seconds",
  "review reason, risk, update time, data boundary, and next observation in 3 minutes",
  "not investment advice",
  "demonstrative / mock-only",
  "Must Pass Before Phase 1 Public Acceptance",
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/membership`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "`/stocks/TWII`",
  "`/stocks/2330`",
  "`/stocks/0050`",
  "Final Polish Allowed In This Pass",
  "Deferred Until After Phase 1 Acceptance",
  "Automated Evidence Required Before Human Acceptance",
  "check:phase-1-public-beta-final-readiness-rollup",
  "check:phase-1-public-beta-human-visual-review",
  "check:phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "check:phase-1-public-beta-chairman-visual-acceptance-record",
  "check:public-beta-core-route-quick-proof",
  "check:public-surface-user-facing-audit",
  "check:public-visible-language-quality",
  "check:phase-1-public-beta-public-visible-residue-cleanup",
  "npx tsc --noEmit",
  "ACCEPT_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX",
  "ACCEPT_WITH_DEFERRALS_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX",
  "REPAIR_REQUIRED_BEFORE_PHASE_1_PUBLIC_ACCEPTANCE",
  "does not authorize",
  "real-data promotion",
  "Supabase write",
  "`daily_prices` mutation",
  "raw market-data fetch/store/commit",
  "Phase 2 membership runtime implementation"
];

const polishRequired = [
  "check:phase-1-public-beta-final-readiness-rollup",
  "docs/PHASE_1_HUMAN_UI_UX_ACCEPTANCE_CHECKLIST.md",
  "Latest `check:review-gates` passed with `status=ok`, `executedCount=197`, and `failedCount=0`"
];

const forbiddenPatterns = [
  /publicDataSource\s*=\s*["']supabase["']/u,
  /scoreSource\s*=\s*["']real["']/u,
  /GO\s+WITH\s+REAL\s+DATA/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /raw market data fetch is approved/iu,
  /investment advice is provided/iu,
  /�/u,
  /蝘|銵|瘞|啁||/u
];

const doc = fs.readFileSync(docPath, "utf8");
const polishCandidate = fs.readFileSync(polishCandidatePath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingPolishPhrases = polishRequired.filter((phrase) => !polishCandidate.includes(phrase));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(`${doc}\n${polishCandidate}`)?.[0])
  .filter(Boolean);
const packageRegistered = packageJson.includes(
  '"check:phase-1-human-ui-ux-acceptance-checklist": "node scripts/check-phase-1-human-ui-ux-acceptance-checklist.mjs"'
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-human-ui-ux-acceptance-checklist.mjs");
const focusedGateRegistered = reviewGate.includes('"phase-1-human-ui-ux-acceptance-checklist"');

const status =
  missingPhrases.length === 0 &&
  missingPolishPhrases.length === 0 &&
  forbiddenHits.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      forbiddenHits,
      focusedGateRegistered,
      guardedStatus: "phase_1_human_ui_ux_acceptance_checklist_ready",
      missingPhrases,
      missingPolishPhrases,
      packageRegistered,
      reviewGateRegistered,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;
