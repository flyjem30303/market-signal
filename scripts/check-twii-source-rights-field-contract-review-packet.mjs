import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md";
const acceptancePath = "docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const acceptance = fs.readFileSync(acceptancePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_source_rights_field_contract_review_packet_recorded`",
  "TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "candidate_label: Official exchange index history",
  "review_state: not_approved_for_probe_or_ingestion",
  "observed_rows: 0",
  "publicDataSource: mock",
  "scoreSource: mock",
  "RIGHTS-001 source authority: unresolved",
  "RIGHTS-002 automated access permission: unresolved",
  "RIGHTS-003 storage permission: unresolved",
  "RIGHTS-004 derived score use: unresolved",
  "RIGHTS-005 redistribution and display limits: unresolved",
  "RIGHTS-006 attribution wording: unresolved",
  "RIGHTS-007 retention and audit trail: unresolved",
  "RIGHTS-008 rate-limit and fair-use posture: unresolved",
  "RIGHTS-009 commercial use constraints: unresolved",
  "RIGHTS-010 fallback route if official source is rejected",
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
  "Legal accepts storage, derived-use, attribution, and redistribution constraints",
  "Data accepts historical date coverage",
  "Engineering accepts a field contract",
  "QA accepts aggregate-only validation",
  "CEO accepts a separate one-attempt report-only probe gate",
  "This packet does not run SQL",
  "This packet does not connect to Supabase",
  "This packet does not write Supabase",
  "This packet does not create staging rows",
  "This packet does not modify `daily_prices`",
  "This packet does not fetch or ingest raw market data",
  "This packet does not probe an external endpoint",
  "This packet does not print secrets",
  "This packet does not print row payloads",
  "This packet does not print stock_id payloads",
  "This packet does not commit raw market data",
  "This packet does not approve source rights",
  "This packet does not approve a parser",
  "This packet does not approve a report-only probe",
  "This packet does not award row coverage points",
  "This packet does not promote `publicDataSource=supabase`",
  "This packet does not set `scoreSource=real`",
  "This packet does not promote CP3 readiness",
  "This packet does not approve public coverage claims",
  "PREPARE_TWII_RIGHTS_AND_FIELD_REVIEW_ROLE_FINDINGS"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "ACCEPT_OFFICIAL_EXCHANGE_INDEX_FOR_TWII_REVIEW_ONLY",
  "selected_candidate: official-exchange-index",
  "TWII source rights and field contract review packet"
]) {
  if (!acceptance.includes(phrase)) {
    missing.push(`${acceptancePath}: ${phrase}`);
  }
}

for (const pattern of [
  /open_price/i,
  /close_price/i,
  /high_price/i,
  /low_price/i,
  /trade_value/i,
  /volume/i,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /https:\/\/[a-z0-9-]+\.supabase\.co/i,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i
]) {
  if (pattern.test(review)) {
    blocked.push(`${reviewPath}: forbidden review pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-source-rights-field-contract-review-packet"] !==
  "node scripts/check-twii-source-rights-field-contract-review-packet.mjs"
) {
  missing.push(`${packagePath}: check:twii-source-rights-field-contract-review-packet`);
}
if (!reviewGate.includes("scripts/check-twii-source-rights-field-contract-review-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-source-rights-field-contract-review-packet.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
