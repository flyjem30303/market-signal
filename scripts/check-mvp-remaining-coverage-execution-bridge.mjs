import fs from "node:fs";

const docPath = "docs/MVP_REMAINING_COVERAGE_EXECUTION_BRIDGE.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfRoutePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const etfSourceGatePath = "data/source-gates/etf-source-gate.json";
const etfDueDiligencePath = "data/source-gates/etf-source-due-diligence.json";
const twiiProbePath = "scripts/run-twii-report-only-probe-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const files = Object.fromEntries(
  [
    docPath,
    scoringGatePath,
    etfRoutePath,
    etfSourceGatePath,
    etfDueDiligencePath,
    twiiProbePath,
    packagePath,
    reviewGatePath,
    fullHealthPath,
    statusPath
  ].map((path) => [path, fs.existsSync(path) ? fs.readFileSync(path, "utf8") : ""])
);

const requiredDocPhrases = [
  "Status: `mvp_remaining_coverage_execution_bridge_ready_source_rights_split`",
  "Level 1 MVP row coverage `360/360`",
  "`TWII` index lane: `60` missing rows",
  "ETF lane for `0050` and `006208`: `118` missing rows",
  "Observed rows: `182`",
  "Missing rows: `178`",
  "TW equity `2330`, `2382`, `2308` is `180/180`",
  "`TWII` is `0/60`",
  "`0050` is `1/60` and `006208` is `1/60`",
  "PM should prioritize the `TWII` lane first",
  "scripts/run-twii-report-only-probe-once.mjs",
  "`daily_prices` allows nullable `volume` and `turnover`",
  "move MVP coverage from `182/360` to `242/360`",
  "legal_and_redistribution_terms_unapproved",
  "Source-rights decision for `official-exchange-index`",
  "nullable policy for `daily_prices.volume` and `daily_prices.turnover`",
  "Sanitized candidate artifact shape for exactly `60` target sessions",
  "ETF source-rights decision outcome",
  "Sanitized ETF candidate artifact shape for exactly `118` missing rows",
  "data/source-gates/etf-source-gate.json",
  "data/source-gates/etf-source-due-diligence.json",
  "`authorization_id`",
  "`lane_id`",
  "`source_rights_status`",
  "`rows_sanitized_count`",
  "`post_run_review_path`",
  "does not approve:",
  "publicDataSource=mock",
  "scoreSource=mock",
  "next highest-value mainline slice is a `TWII` source-rights and candidate artifact readiness packet"
];

for (const phrase of requiredDocPhrases) {
  if (!read(docPath).includes(phrase)) {
    problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

const requiredExistingPhrases = [
  [scoringGatePath, "Full MVP row coverage"],
  [scoringGatePath, "observed rows: `182`"],
  [scoringGatePath, "`TWII`: `0/60`"],
  [scoringGatePath, "`0050`: `1/60`"],
  [scoringGatePath, "`006208`: `1/60`"],
  [etfRoutePath, "ETF sub-scope: `2/120`"],
  [etfRoutePath, "remaining ETF rows: `118`"],
  [etfSourceGatePath, "\"decision\": \"blocked\""],
  [etfDueDiligencePath, "\"decision\": \"blocked\""],
  [twiiProbePath, "CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"],
  [twiiProbePath, "mode: \"twii_report_only_probe\""],
  [packagePath, "\"check:mvp-remaining-coverage-execution-bridge\": \"node scripts/check-mvp-remaining-coverage-execution-bridge.mjs\""],
  [reviewGatePath, "scripts/check-mvp-remaining-coverage-execution-bridge.mjs"],
  [fullHealthPath, "scripts/check-mvp-remaining-coverage-execution-bridge.mjs"],
  [statusPath, "Latest MVP remaining coverage execution bridge slice"]
];

for (const [path, phrase] of requiredExistingPhrases) {
  if (!read(path).includes(phrase)) {
    problems.push(`${path} missing phrase: ${phrase}`);
  }
}

const forbiddenDocPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /market-data fetch is approved/u,
  /candidate artifact generation is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(read(docPath))) {
    problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      docPath,
      guardedStatus: "mvp_remaining_coverage_execution_bridge_ready_source_rights_split"
    },
    null,
    2
  )
);

function read(path) {
  return files[path] ?? "";
}
