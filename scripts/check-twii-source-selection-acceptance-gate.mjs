import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md";
const sourcePacketPath = "src/lib/twii-source-selection-packet.ts";
const designPacketPath = "docs/reviews/SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const sourcePacket = fs.readFileSync(sourcePacketPath, "utf8");
const designPacket = fs.readFileSync(designPacketPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_source_selection_acceptance_gate_recorded`",
  "SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET_2026-06-01.md",
  "target_symbol: TWII",
  "observed_rows: 0",
  "selected_candidate: official-exchange-index",
  "candidate_label: Official exchange index history",
  "selection_status: accepted_for_rights_and_field_contract_review_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "TWII is the only tracked lane with zero observed rows",
  "official exchange index route",
  "parser, fetcher, SQL, Supabase, staging, and `daily_prices` work blocked",
  "REVIEW-001 source authority",
  "REVIEW-002 license and storage rights",
  "REVIEW-003 attribution and redistribution limits",
  "REVIEW-004 historical date coverage",
  "REVIEW-005 index value field contract",
  "REVIEW-006 missing-session and holiday behavior",
  "REVIEW-007 rate-limit and fair-use posture",
  "REVIEW-008 retention and audit trail",
  "REVIEW-009 sanitized report-only output contract",
  "REVIEW-010 separate one-attempt gate before any remote probe",
  "fallback_candidate_1: licensed-market-data-vendor",
  "fallback_candidate_2: internal-approved-feed",
  "This gate does not run SQL",
  "This gate does not connect to Supabase",
  "This gate does not write Supabase",
  "This gate does not create staging rows",
  "This gate does not modify `daily_prices`",
  "This gate does not fetch or ingest raw market data",
  "This gate does not probe an external endpoint",
  "This gate does not print secrets",
  "This gate does not print row payloads",
  "This gate does not print stock_id payloads",
  "This gate does not commit raw market data",
  "This gate does not award row coverage points",
  "This gate does not promote `publicDataSource=supabase`",
  "This gate does not set `scoreSource=real`",
  "This gate does not promote CP3 readiness",
  "This gate does not approve public coverage claims",
  "ACCEPT_OFFICIAL_EXCHANGE_INDEX_FOR_TWII_REVIEW_ONLY",
  "TWII source rights and field contract review packet"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const [file, content, phrase] of [
  [sourcePacketPath, sourcePacket, "official-exchange-index"],
  [sourcePacketPath, sourcePacket, "candidate_unverified"],
  [sourcePacketPath, sourcePacket, "observedRows: 0"],
  [sourcePacketPath, sourcePacket, "publicDataSource: \"mock\""],
  [sourcePacketPath, sourcePacket, "scoreSource: \"mock\""],
  [designPacketPath, designPacket, "PREPARE_TWII_SOURCE_SELECTION_AS_NEXT_SAFE_BACKFILL_SLICE"],
  [designPacketPath, designPacket, "twii_observed_rows: 0"]
]) {
  if (!content.includes(phrase)) {
    missing.push(`${file}: ${phrase}`);
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
  packageJson.scripts?.["check:twii-source-selection-acceptance-gate"] !==
  "node scripts/check-twii-source-selection-acceptance-gate.mjs"
) {
  missing.push(`${packagePath}: check:twii-source-selection-acceptance-gate`);
}
if (!reviewGate.includes("scripts/check-twii-source-selection-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-source-selection-acceptance-gate.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
