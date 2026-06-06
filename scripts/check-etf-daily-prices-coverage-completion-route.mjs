import fs from "node:fs";

const problems = [];

const docPath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const etfRightsPath = "src/lib/etf-source-rights-review-packet.ts";
const readbackPath = "docs/reviews/TW_EQUITY_POST_MERGE_ROW_COVERAGE_READBACK_POST_RUN_REVIEW_2026-06-07.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const etfRights = read(etfRightsPath);
const readback = read(readbackPath);
const scoringGate = read(scoringGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "CEO selects the ETF lane as the next data-coverage completion route",
  "full MVP observed rows: `182`",
  "full MVP missing rows: `178`",
  "TW equity sub-scope: `180/180`",
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "`TWII`: `0/60`",
  "symbols: `0050`, `006208`",
  "expected total ETF rows: `120`",
  "current observed ETF rows: `2`",
  "target missing ETF rows: `118`",
  "staging-first posture: required",
  "legal_and_redistribution_terms_unapproved",
  "Sanitized ETF candidate artifact with exactly `118` missing candidate rows",
  "combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria into one packet",
  "stop before any remote fetch, ingestion, SQL, Supabase write, or `daily_prices` mutation",
  "ETF market-data fetch",
  "row coverage points",
  "real score source promotion"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "etf_source_rights_review_packet_prepared",
  "targetSymbols: [\"0050\", \"006208\"]",
  "legal_and_redistribution_terms_unapproved",
  "twse-mis-etf-surface",
  "issuer-official-pages",
  "licensed-vendor",
  "ETF row coverage credit remains blocked"
]) {
  if (!etfRights.includes(phrase)) problems.push(`${etfRightsPath} missing: ${phrase}`);
}

for (const phrase of [
  "observed total rows: `182`",
  "missing rows: `178`",
  "`0050`: observed rows `1` of `60`",
  "`006208`: observed rows `1` of `60`",
  "`2330`: observed rows `60` of `60`",
  "`2382`: observed rows `60` of `60`",
  "`2308`: observed rows `60` of `60`"
]) {
  if (!readback.includes(phrase)) problems.push(`${readbackPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked",
  "full-scope status: `blocked_incomplete`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:etf-daily-prices-coverage-completion-route"] !==
  "node scripts/check-etf-daily-prices-coverage-completion-route.mjs"
) {
  problems.push(`${packagePath} missing check:etf-daily-prices-coverage-completion-route`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-etf-daily-prices-coverage-completion-route.mjs")) {
    problems.push(`${pathName} missing ETF coverage route checker command`);
  }
  if (!text.includes("etf-daily-prices-coverage-completion-route")) {
    problems.push(`${pathName} missing ETF coverage route checker name`);
  }
}

for (const phrase of [
  "Latest ETF daily_prices coverage completion route slice",
  "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md",
  "scripts/check-etf-daily-prices-coverage-completion-route.mjs",
  "etf_daily_prices_coverage_completion_route_ready_source_rights_blocked",
  "ETF sub-scope is `2/120` with `118` missing rows",
  "`0050` `1/60` and `006208` `1/60`",
  "next ETF slice should combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria"
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
