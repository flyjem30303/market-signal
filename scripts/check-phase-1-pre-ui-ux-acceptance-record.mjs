import fs from "node:fs";

const docPath = "docs/PHASE_1_PRE_UI_UX_ACCEPTANCE_RECORD.md";
const checklistPath = "docs/PHASE_1_HUMAN_UI_UX_ACCEPTANCE_CHECKLIST.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = fs.readFileSync(docPath, "utf8");
const checklist = fs.readFileSync(checklistPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "phase_1_pre_ui_ux_acceptance_record_ready",
  "READY_FOR_FINAL_UI_UX_POLISH_AND_CHAIRMAN_ACCEPTANCE",
  "ACCEPT_WITH_DEFERRALS_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX",
  "30 seconds: a general investor can understand the market or symbol state",
  "3 minutes: the user can review reason, risk, update time, data boundary, and next observation",
  "not investment advice",
  "demonstrative / mock-only",
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
  "check:phase-1-human-ui-ux-acceptance-checklist",
  "check:phase-1-public-beta-final-readiness-rollup",
  "check:public-beta-core-route-quick-proof",
  "check:public-surface-user-facing-audit",
  "check:public-visible-language-quality",
  "check:phase-1-public-beta-public-visible-residue-cleanup",
  "npx tsc --noEmit",
  "check:review-gates",
  "docs/PHASE_1_HUMAN_UI_UX_ACCEPTANCE_CHECKLIST.md",
  "SQL",
  "Supabase write",
  "`daily_prices` mutation",
  "Raw market-data fetch/store/commit",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Investment advice claim",
  "Phase 2 membership runtime implementation",
  "Do not start broad visual redesign"
];

const checklistRequired = [
  "phase_1_human_ui_ux_acceptance_checklist_ready",
  "READY_FOR_FINAL_HUMAN_UI_UX_ACCEPTANCE_PASS",
  "ACCEPT_WITH_DEFERRALS_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX"
];

const forbiddenPatterns = [
  /publicDataSource\s*=\s*["']supabase["']/u,
  /scoreSource\s*=\s*["']real["']/u,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /raw market data fetch is approved/iu,
  /investment advice is provided/iu,
  /嚙/u,
  /�/u
];

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingChecklistPhrases = checklistRequired.filter((phrase) => !checklist.includes(phrase));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(`${doc}\n${checklist}`)?.[0])
  .filter(Boolean);

const packageRegistered = packageJson.includes(
  '"check:phase-1-pre-ui-ux-acceptance-record": "node scripts/check-phase-1-pre-ui-ux-acceptance-record.mjs"'
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-pre-ui-ux-acceptance-record.mjs");
const focusedGateRegistered = reviewGate.includes('"phase-1-pre-ui-ux-acceptance-record"');

const status =
  missingPhrases.length === 0 &&
  missingChecklistPhrases.length === 0 &&
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
      guardedStatus: "phase_1_pre_ui_ux_acceptance_record_ready",
      missingChecklistPhrases,
      missingPhrases,
      packageRegistered,
      reviewGateRegistered,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;
