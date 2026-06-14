import fs from "node:fs";

const docPath = "docs/PHASE_1_UI_UX_STYLE_DIRECTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_ui_ux_style_direction_ready",
  "LIGHT_FINANCIAL_DASHBOARD_WITH_FOCUSED_STATUS_EMPHASIS",
  "ui-ux-pro-max",
  "Real-Time Monitoring",
  "clean light financial dashboard",
  "focused status emphasis",
  "ordinary investors",
  "not professional traders",
  "First Screen Must Behave Like A Dashboard",
  "Status Must Not Rely On Color Alone",
  "Cards Should Be Calm, Dense, And Scannable",
  "Charts Are Later, But Their Direction Is Fixed",
  "line chart",
  "Phase 2 preview",
  "no developer-process wording appears in public routes",
  "no route has mobile horizontal overflow",
  "Phase 2 membership remains preview-only",
  "Do not begin with global CSS redesign"
];

const forbiddenPatterns = [
  /full dark-mode redesign is approved/iu,
  /member dashboard UI is approved/iu,
  /login, payment, persisted watchlist.*approved/iu,
  /real-data promotion is approved/iu,
  /Supabase write.*approved/iu,
  /SQL.*approved/iu,
  /daily_prices.*mutation.*approved/iu,
  /raw market data.*approved/iu,
  /investment advice is provided/iu,
  /provides investment advice/iu,
  /投資建議已啟用/u
];

const doc = fs.readFileSync(docPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(doc)?.[0])
  .filter(Boolean);
const packageRegistered = packageJson.includes(
  '"check:phase-1-ui-ux-style-direction": "node scripts/check-phase-1-ui-ux-style-direction.mjs"'
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-ui-ux-style-direction.mjs");
const focusedGateRegistered = reviewGate.includes('"phase-1-ui-ux-style-direction"');

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
      focusedGateRegistered,
      forbiddenHits,
      guardedStatus: "phase_1_ui_ux_style_direction_ready",
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
