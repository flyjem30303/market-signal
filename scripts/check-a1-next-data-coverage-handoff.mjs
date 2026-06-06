import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfRoutePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const roadmapPath = "docs/COVERAGE_UNIVERSE_ROADMAP.md";
const dataGoalPath = "scripts/report-data-goal-readiness.mjs";
const packagePath = "package.json";

const doc = read(docPath);
const scoringGate = read(scoringGatePath);
const etfRoute = read(etfRoutePath);
const roadmap = read(roadmapPath);
const dataGoal = read(dataGoalPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `a1_next_data_coverage_handoff_ready_local_only_pm_intake`",
  "This handoff is not a new governance system",
  "Full MVP universe: `182/360`",
  "Missing rows: `178`",
  "Full-scope status: `blocked_incomplete`",
  "TW equity sub-scope: `180/180`",
  "ETF sub-scope: `2/120`",
  "Remaining ETF rows: `118`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "`tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`",
  "`etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "`bounded_readonly_attempt_reviewed_aggregate_incomplete`",
  "source-rights outcome intake",
  "ETF `daily_prices` field contract",
  "sanitized candidate artifact shape for the remaining `118` ETF rows",
  "execution-readiness criteria",
  "staging row creation",
  "`daily_prices` mutation",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "does not output stock id payload"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "does not run SQL",
  "does not connect to Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not modify `daily_prices`",
  "does not fetch raw market data",
  "does not ingest raw market data",
  "does not store raw market data",
  "does not commit raw market data",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not generate ETF candidates from remote/source data",
  "does not award row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing boundary: ${phrase}`);
}

for (const phrase of [
  "Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`",
  "observed rows: `182`",
  "missing rows: `178`",
  "full-scope status: `blocked_incomplete`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "CEO selects the ETF lane as the next data-coverage completion route",
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria into one packet",
  "stop before any remote fetch, ingestion, SQL, Supabase write, or `daily_prices` mutation"
]) {
  if (!etfRoute.includes(phrase)) problems.push(`${etfRoutePath} missing: ${phrase}`);
}

for (const phrase of [
  "Level 1 - MVP Row Coverage Universe",
  "Denominator: `6 x 60 = 360` rows",
  "Current evidence: `182/360`",
  "Level 2 - Taiwan Listed Company Universe",
  "Taiwan all-listed coverage is the next major expansion stage"
]) {
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

for (const phrase of [
  "bounded_readonly_attempt_reviewed_aggregate_incomplete",
  "Do not rerun the generic bounded readonly attempt",
  "publicDataSource",
  "scoreSource",
  "printing row payloads or internal identifiers"
]) {
  if (!dataGoal.includes(phrase)) problems.push(`${dataGoalPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-next-data-coverage-handoff"] !==
  "node scripts/check-a1-next-data-coverage-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a1-next-data-coverage-handoff script`);
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
  /Supabase connection is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /raw market data fetch is approved/u,
  /raw market data ingestion is approved/u,
  /source rights are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
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
