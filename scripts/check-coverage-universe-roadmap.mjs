import fs from "node:fs";

const problems = [];

const docPath = "docs/COVERAGE_UNIVERSE_ROADMAP.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfRoutePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const ingestionPlanPath = "docs/INGESTION_PLAN.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const scoringGate = read(scoringGatePath);
const etfRoute = read(etfRoutePath);
const ingestionPlan = read(ingestionPlanPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "Status: `coverage_universe_roadmap_ready_mvp_now_all_listed_next`",
  "Current GOAL completion means the MVP row coverage universe reaches `360/360`",
  "Product end-state coverage means Taiwan listed company coverage",
  "Taiwan all-listed coverage is the next major expansion stage",
  "Level 0 - Runtime / Mock Surface",
  "Level 1 - MVP Row Coverage Universe",
  "Symbols: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`",
  "Denominator: `6 x 60 = 360` rows",
  "Current evidence: `182/360`",
  "Completed sub-scope: TW equity `2330`, `2382`, `2308` is `180/180`",
  "`TWII` is `0/60`, `0050` is `1/60`, and `006208` is `1/60`",
  "Level 2 - Taiwan Listed Company Universe",
  "all active TWSE listed common stocks from the seeded stock master",
  "stock master seed has been expanded to `1086` listed-stock records",
  "active TWSE listed common stocks x 60 sessions",
  "This level is not allowed to reuse the MVP `360` denominator",
  "Level 3 - Taiwan ETF / Index / TPEx Expansion",
  "Level 4 - Global Market Universe",
  "Finish Level 1 MVP row coverage at `360/360`",
  "Create the Level 2 Taiwan all-listed universe manifest and denominator",
  "does not run SQL",
  "does not connect to Supabase",
  "does not mutate `daily_prices`",
  "Continue the active GOAL with Level 1 until `360/360` is complete"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Full MVP row coverage:",
  "expected rows: `360`",
  "observed rows: `182`",
  "missing rows: `178`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!etfRoute.includes(phrase)) problems.push(`${etfRoutePath} missing: ${phrase}`);
}

for (const phrase of ["上市股票", "目前股票主檔 seed", "TWSE"]) {
  if (!ingestionPlan.includes(phrase)) problems.push(`${ingestionPlanPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:coverage-universe-roadmap"] !==
  "node scripts/check-coverage-universe-roadmap.mjs"
) {
  problems.push(`${packagePath} missing check:coverage-universe-roadmap`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-coverage-universe-roadmap.mjs")) {
    problems.push(`${pathName} missing coverage universe roadmap checker command`);
  }
  if (!text.includes("coverage-universe-roadmap")) {
    problems.push(`${pathName} missing coverage universe roadmap checker name`);
  }
}

for (const phrase of [
  "Latest coverage universe roadmap slice",
  "docs/COVERAGE_UNIVERSE_ROADMAP.md",
  "scripts/check-coverage-universe-roadmap.mjs",
  "coverage_universe_roadmap_ready_mvp_now_all_listed_next",
  "current active GOAL remains MVP row coverage `360/360`",
  "Taiwan all-listed common-stock coverage is the next major expansion stage",
  "stock master seed evidence remains `1086` listed-stock records"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
