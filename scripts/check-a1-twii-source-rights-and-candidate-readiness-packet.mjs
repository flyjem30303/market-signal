import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfRoutePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const twiiSelectionPath = "src/lib/twii-source-selection-packet.ts";
const twiiAcceptancePath = "docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md";
const twiiRightsPath = "docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md";
const packagePath = "package.json";

const doc = read(docPath);
const scoringGate = read(scoringGatePath);
const etfRoute = read(etfRoutePath);
const twiiSelection = read(twiiSelectionPath);
const twiiAcceptance = read(twiiAcceptancePath);
const twiiRights = read(twiiRightsPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "ETF coverage is currently blocked by `legal_and_redistribution_terms_unapproved`",
  "does not approve source rights",
  "Full MVP row coverage: `182/360`",
  "Missing rows: `178`",
  "Full-scope status: `blocked_incomplete`",
  "ETF sub-scope: `2/120`",
  "ETF blocker: `legal_and_redistribution_terms_unapproved`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "TWII is therefore a local-only alternative branch",
  "Selected first candidate: `official-exchange-index`",
  "Selection status: `accepted_for_rights_and_field_contract_review_only`",
  "Review state: `not_approved_for_probe_or_ingestion`",
  "Fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`",
  "Source authority",
  "Automated access permission",
  "Internal storage",
  "Retention and audit trail",
  "Redistribution and display limits",
  "Attribution wording",
  "Derived analysis",
  "Rate limits and fair use",
  "Commercial use constraints",
  "If any item remains unresolved, TWII stays `not_approved_for_probe_or_ingestion`",
  "Index daily_prices Field Contract",
  "`asset_type`",
  "`index_close`",
  "`index_open`",
  "`index_high`",
  "`index_low`",
  "TWII mapping to an internal stock id or market asset id remains unresolved",
  "`twii_index_daily_prices_missing_rows`",
  "`expected_rows`",
  "`already_observed_rows`",
  "`candidate_missing_rows`",
  "currently `60`",
  "`aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`",
  "Future TWII staging/write/readback work is not executable from this packet",
  "TWII source-rights outcome gate",
  "TWII index field contract gate",
  "TWII sanitized candidate artifact gate",
  "TWII staging/write authorization gate",
  "one exact command string",
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
  "does not generate TWII candidates",
  "does not probe an external endpoint",
  "does not approve source rights",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
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
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "legal_and_redistribution_terms_unapproved",
  "may not proceed to candidate generation or write execution"
]) {
  if (!etfRoute.includes(phrase)) problems.push(`${etfRoutePath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_source_selection_packet_prepared",
  "targetSymbol: \"TWII\"",
  "priority: \"highest_row_coverage_gap\"",
  "observedRows: 0",
  "official-exchange-index",
  "licensed-market-data-vendor",
  "internal-approved-feed",
  "candidate_unverified",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "does not run SQL",
  "connect to Supabase",
  "write Supabase",
  "fetch or ingest market data",
  "modify daily_prices",
  "award row coverage points"
]) {
  if (!twiiSelection.includes(phrase)) problems.push(`${twiiSelectionPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `twii_source_selection_acceptance_gate_recorded`",
  "observed_rows: 0",
  "selected_candidate: official-exchange-index",
  "selection_status: accepted_for_rights_and_field_contract_review_only",
  "fallback_candidate_1: licensed-market-data-vendor",
  "fallback_candidate_2: internal-approved-feed",
  "does not run SQL",
  "does not connect to Supabase",
  "does not modify `daily_prices`"
]) {
  if (!twiiAcceptance.includes(phrase)) problems.push(`${twiiAcceptancePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `twii_source_rights_field_contract_review_packet_recorded`",
  "review_state: not_approved_for_probe_or_ingestion",
  "observed_rows: 0",
  "RIGHTS-001 source authority: unresolved",
  "RIGHTS-003 storage permission: unresolved",
  "RIGHTS-005 redistribution and display limits: unresolved",
  "RIGHTS-008 rate-limit and fair-use posture: unresolved",
  "FIELD-008 field mapping to daily_prices: unresolved",
  "FIELD-009 TWII mapping to internal stock_id or market asset id: unresolved",
  "does not approve source rights",
  "does not award row coverage points"
]) {
  if (!twiiRights.includes(phrase)) problems.push(`${twiiRightsPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-source-rights-and-candidate-readiness-packet"] !==
  "node scripts/check-a1-twii-source-rights-and-candidate-readiness-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-source-rights-and-candidate-readiness-packet script`);
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
  /not_approved_for_probe_or_ingestion is resolved/u,
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
