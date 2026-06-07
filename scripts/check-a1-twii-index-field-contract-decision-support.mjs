import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const twiiReadinessPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const twiiSelectionPath = "src/lib/twii-source-selection-packet.ts";
const twiiAcceptancePath = "docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md";
const twiiRightsPath = "docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md";
const packagePath = "package.json";

const doc = read(docPath);
const twiiReadiness = read(twiiReadinessPath);
const scoringGate = read(scoringGatePath);
const twiiSelection = read(twiiSelectionPath);
const twiiAcceptance = read(twiiAcceptancePath);
const twiiRights = read(twiiRightsPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`",
  "does not approve source rights",
  "does not approve a parser",
  "does not approve a report-only probe",
  "does not generate TWII candidates",
  "Level 1 MVP overall: `182/360`",
  "`TWII`: `0/60`",
  "Selected first candidate: `official-exchange-index`",
  "Selection status: `accepted_for_rights_and_field_contract_review_only`",
  "Review state: `not_approved_for_probe_or_ingestion`",
  "Observed rows: `0`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`trade_date`",
  "`index_close`",
  "`index_open`",
  "`index_high`",
  "`index_low`",
  "`turnover`",
  "`source_label`",
  "`source_rights_status`",
  "`validation_status`",
  "`batch_id`",
  "Minimum viable field contract",
  "`asset_type=index`",
  "Optional fields must not block the minimum contract",
  "Calendar And Session Rules",
  "Expected TWII rows remain `60`",
  "Observed TWII rows remain `0`",
  "Missing TWII rows remain `60`",
  "Missing session must mean the trading session is expected but absent",
  "Source gap must mean the source failed",
  "Timezone And Timestamp Rules",
  "Expected timezone: `Asia/Taipei`",
  "Precision And Rounding Rules",
  "daily_prices Mapping",
  "TWII must remain an `index` asset lane",
  "Mapping to an internal stock id or market asset id remains unresolved",
  "Stock id payload is forbidden",
  "Missing-Session Vs Source-Gap Decision",
  "`calendar_gap`",
  "`source_gap`",
  "`field_contract_gap`",
  "`rights_gap`",
  "`validation_gap`",
  "No gap class awards row coverage points",
  "safe asset-id mapping without exposing stock id payload",
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
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not produce TWII candidates",
  "does not probe external endpoint",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "Full MVP row coverage: `182/360`",
  "`TWII`: `0/60`",
  "Selected first candidate: `official-exchange-index`",
  "Selection status: `accepted_for_rights_and_field_contract_review_only`",
  "Review state: `not_approved_for_probe_or_ingestion`",
  "`index_close`",
  "TWII mapping to an internal stock id or market asset id remains unresolved"
]) {
  if (!twiiReadiness.includes(phrase)) problems.push(`${twiiReadinessPath} missing: ${phrase}`);
}

for (const phrase of [
  "observed rows: `182`",
  "full-scope status: `blocked_incomplete`",
  "`TWII`: `0/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_source_selection_packet_prepared",
  "targetSymbol: \"TWII\"",
  "observedRows: 0",
  "official-exchange-index",
  "candidate_unverified",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!twiiSelection.includes(phrase)) problems.push(`${twiiSelectionPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `twii_source_selection_acceptance_gate_recorded`",
  "selected_candidate: official-exchange-index",
  "selection_status: accepted_for_rights_and_field_contract_review_only",
  "observed_rows: 0",
  "publicDataSource: mock",
  "scoreSource: mock"
]) {
  if (!twiiAcceptance.includes(phrase)) problems.push(`${twiiAcceptancePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `twii_source_rights_field_contract_review_packet_recorded`",
  "review_state: not_approved_for_probe_or_ingestion",
  "FIELD-001 date field and calendar basis: unresolved",
  "FIELD-002 index close value or official index value: unresolved",
  "FIELD-003 intraday versus end-of-day meaning: unresolved",
  "FIELD-004 holiday and missing-session behavior: unresolved",
  "FIELD-005 revision or correction behavior: unresolved",
  "FIELD-006 numeric precision and rounding: unresolved",
  "FIELD-007 source timezone: Asia/Taipei expected, unresolved until source review",
  "FIELD-008 field mapping to daily_prices: unresolved",
  "FIELD-009 TWII mapping to internal stock_id or market asset id: unresolved",
  "FIELD-010 sanitized report-only output contract: required before any probe",
  "does not print stock_id payloads",
  "does not modify `daily_prices`"
]) {
  if (!twiiRights.includes(phrase)) problems.push(`${twiiRightsPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-index-field-contract-decision-support"] !==
  "node scripts/check-a1-twii-index-field-contract-decision-support.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-index-field-contract-decision-support script`);
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
