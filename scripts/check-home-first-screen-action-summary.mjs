import { readFileSync } from "node:fs";

const dashboardPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const dashboard = readFileSync(dashboardPath, "utf8");
const packageJson = readFileSync(packagePath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const homeStart = dashboard.indexOf("function HomeProductOverview");
const homeEnd = dashboard.indexOf("function getInvestorIndicatorStatusLabel", homeStart);
const home = homeStart >= 0 && homeEnd > homeStart ? dashboard.slice(homeStart, homeEnd) : "";

const required = [
  [home, "Quick Start", "first screen quick start label"],
  [home, "Market Action Summary", "market action summary label"],
  [home, "Decision Compass", "decision compass label"],
  [home, "home-market-action-summary", "market action summary section"],
  [home, "home-decision-strip", "decision strip section"],
  [home, "actionSummary.headline", "market status headline"],
  [home, "actionSummary.marketBreadthLine", "market breadth line"],
  [home, "actionSummary.stopLine", "mock boundary stop line"],
  [home, "actionSummary.primaryAction", "primary next action"],
  [home, "actionSummary.secondaryAction", "secondary next action"],
  [home, "home_market_action_primary", "primary action tracking"],
  [home, "home_market_action_secondary", "secondary action tracking"],
  [home, "decision_compass_briefing", "briefing decision tracking"],
  [home, "decision_compass_market", "market decision tracking"],
  [home, "decision_compass_target", "target decision tracking"],
  [home, "mock-only 閱讀模式", "mock-only reading-mode disclosure"],
  [home, "scoreSourceLabel", "score source label"],
  [home, "gapCount", "data gap count"],
  [packageJson, '"check:home-first-screen-action-summary"', "package script"],
  [reviewGate, "scripts/check-home-first-screen-action-summary.mjs", "review gate wiring"]
];

const forbidden = [
  [home, "scoreSource=real", "real score source claim"],
  [home, "publicDataSource=supabase", "public supabase claim"],
  [home, "claimApproval=approved", "approved claim"],
  [home, "createClient(", "direct Supabase client"],
  [home, "fetch(", "remote fetch"]
];

const missing = [
  ...(home ? [] : [`${dashboardPath}: HomeProductOverview slice`]),
  ...required.filter(([source, token]) => !source.includes(token)).map(([, token, label]) => `${label}: ${token}`)
];
const blocked = forbidden.filter(([source, token]) => source.includes(token)).map(([, token, label]) => `${label}: ${token}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
