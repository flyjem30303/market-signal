import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md";
const readinessPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const routePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const rightsPath = "src/lib/etf-source-rights-review-packet.ts";
const handoffPath = "docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md";
const packagePath = "package.json";

const doc = read(docPath);
const readiness = read(readinessPath);
const route = read(routePath);
const rights = read(rightsPath);
const handoff = read(handoffPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `a1_etf_source_rights_outcome_decision_support_ready_blocked_pending`",
  "does not approve source rights",
  "keep ETF source rights blocked as `legal_and_redistribution_terms_unapproved`",
  "Target ETFs: `0050`, `006208`",
  "Combined ETF coverage: `2/120`",
  "Missing ETF rows: `118`",
  "`0050`: `1/60`, missing `59`",
  "`006208`: `1/60`, missing `59`",
  "`etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "`legal_and_redistribution_terms_unapproved`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`",
  "`blocked_for_ingestion`",
  "`candidate_requires_review`",
  "No lane is accepted by this packet",
  "Internal storage",
  "Retention",
  "Redistribution",
  "Attribution",
  "Derived analysis",
  "Rate limits",
  "Delayed / missing wording",
  "market-price `daily_prices` OHLCV/turnover coverage is separate from NAV",
  "Maintain `legal_and_redistribution_terms_unapproved`",
  "Do not enter ETF candidate generation",
  "Do not run a remote source probe or market-data fetch",
  "Keep ETF row coverage points blocked",
  "`blocked_pending_external_rights_evidence`",
  "blocked-route alternative map",
  "TWII readiness branch",
  "`TWII` `0/60`",
  "`source_lane_accepted_for_next_gate_only`",
  "This packet itself leaves the blocker at `legal_and_redistribution_terms_unapproved`"
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
  "does not produce ETF candidates",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "Current observed ETF rows: `2/120`",
  "Missing ETF rows: `118`",
  "Still blocked in this packet",
  "`legal_and_redistribution_terms_unapproved`",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`"
]) {
  if (!readiness.includes(phrase)) problems.push(`${readinessPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "legal_and_redistribution_terms_unapproved",
  "may not proceed to candidate generation or write execution until a source-rights decision accepts"
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
  "blocked_for_ingestion",
  "candidate_requires_review",
  "Storage, display, redistribution, and derived-score use are explicitly permitted",
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
  "ETF source-rights and redistribution terms remain unapproved"
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-etf-source-rights-outcome-decision-support"] !==
  "node scripts/check-a1-etf-source-rights-outcome-decision-support.mjs"
) {
  problems.push(`${packagePath} missing check:a1-etf-source-rights-outcome-decision-support script`);
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
  /source rights (are )?approved/iu,
  /rights (are )?passed/iu,
  /legal_and_redistribution_terms_approved/u,
  /candidate generation is approved/u,
  /SQL execution is approved/u,
  /Supabase connection is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /raw market data fetch is approved/u,
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
