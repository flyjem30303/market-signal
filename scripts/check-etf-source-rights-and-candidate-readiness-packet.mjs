import fs from "node:fs";

const problems = [];

const docPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const routePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const rightsPath = "src/lib/etf-source-rights-review-packet.ts";
const handoffPath = "docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md";
const packagePath = "package.json";

const doc = read(docPath);
const route = read(routePath);
const rights = read(rightsPath);
const handoff = read(handoffPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "Target symbols: `0050`, `006208`",
  "Expected ETF rows: `120`",
  "Current observed ETF rows: `2/120`",
  "Missing ETF rows: `118`",
  "`0050`: `1/60`, missing `59`",
  "`006208`: `1/60`, missing `59`",
  "`etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "`legal_and_redistribution_terms_unapproved`",
  "source-rights outcome intake",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`",
  "Internal storage of source-derived ETF market price rows is explicitly permitted",
  "Retention period and deletion obligations are documented",
  "Public display, sharing, export, and cached-value restrictions are documented",
  "Derived metrics and row coverage scoring use are explicitly allowed or kept blocked",
  "ETF daily_prices Field Contract",
  "`symbol`",
  "`trade_date`",
  "`open`",
  "`high`",
  "`low`",
  "`close`",
  "`volume`",
  "`turnover`",
  "NAV is out of scope",
  "Premium / discount is out of scope",
  "Holdings data is out of scope",
  "candidate_missing_rows",
  "`aggregate_only_no_raw_or_row_payloads`",
  "raw payload",
  "row payload",
  "stock id payload",
  "Future staging/write/readback work is not executable from this packet",
  "ETF source-rights outcome gate",
  "ETF sanitized candidate artifact gate",
  "ETF staging/write authorization gate",
  "one exact command string",
  "Any command drift must stop execution",
  "No exact executable command is provided by this packet",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
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
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "legal_and_redistribution_terms_unapproved",
  "Sanitized ETF candidate artifact with exactly `118` missing candidate rows",
  "combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria into one packet"
]) {
  if (!route.includes(phrase)) problems.push(`${routePath} missing: ${phrase}`);
}

for (const phrase of [
  "etf_source_rights_review_packet_prepared",
  "targetSymbols: [\"0050\", \"006208\"]",
  "legal_and_redistribution_terms_unapproved",
  "twse-mis-etf-surface",
  "issuer-official-pages",
  "licensed-vendor",
  "ETF row coverage credit remains blocked",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!rights.includes(phrase)) problems.push(`${rightsPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `a1_next_data_coverage_handoff_ready_local_only_pm_intake`",
  "ETF sub-scope: `2/120`",
  "Remaining ETF rows: `118`",
  "Create an ETF source-rights outcome and candidate artifact readiness packet for `0050` and `006208`",
  "sanitized candidate artifact shape for the remaining `118` ETF rows"
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:etf-source-rights-and-candidate-readiness-packet"] !==
  "node scripts/check-etf-source-rights-and-candidate-readiness-packet.mjs"
) {
  problems.push(`${packagePath} missing check:etf-source-rights-and-candidate-readiness-packet script`);
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
  /candidate generation is approved/u,
  /row coverage points awarded/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
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
