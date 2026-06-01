import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_RIGHTS_FIELD_REVIEW_ROLE_FINDINGS_2026-06-01.md";
const packetPath = "docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const packet = fs.readFileSync(packetPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_rights_field_review_role_findings_recorded`",
  "TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "review_state_before_findings: not_approved_for_probe_or_ingestion",
  "observed_rows: 0",
  "publicDataSource: mock",
  "scoreSource: mock",
  "LEGAL-FINDING-001 source rights are not approved by this role finding",
  "LEGAL-FINDING-002 automated access permission remains unresolved",
  "LEGAL-FINDING-003 storage permission remains unresolved",
  "LEGAL-FINDING-004 derived score use remains unresolved",
  "LEGAL-FINDING-005 redistribution and display limits remain unresolved",
  "LEGAL-FINDING-007 official exchange route may proceed only to a separate report-only probe gate",
  "DATA-FINDING-001 TWII remains the highest row coverage gap because observed rows are zero",
  "DATA-FINDING-002 historical date coverage must distinguish market holidays, source gaps, and parser gaps",
  "DATA-FINDING-003 index value meaning must be defined before mapping to daily_prices",
  "DATA-FINDING-006 no row coverage points can be awarded from this role finding",
  "ENGINEERING-FINDING-001 no parser is approved by this role finding",
  "ENGINEERING-FINDING-002 no endpoint probe is approved by this role finding",
  "ENGINEERING-FINDING-003 future TWII probe must be report-only and one-attempt gated",
  "ENGINEERING-FINDING-006 staging-first remains preferred before any production daily_prices write path",
  "QA-FINDING-001 any future probe must have a sanitized post-run review before readiness changes",
  "QA-FINDING-002 acceptance criteria must include observed sessions",
  "QA-FINDING-003 failure classes must distinguish source unavailable",
  "QA-FINDING-005 publicDataSource and scoreSource must remain mock",
  "CEO-SYNTHESIS-001 role findings support preparing a TWII report-only probe gate",
  "CEO-SYNTHESIS-002 role findings do not approve the probe itself",
  "CEO-SYNTHESIS-003 source rights remain unresolved",
  "CEO-SYNTHESIS-004 TWII remains first priority because it is the only zero-row coverage lane",
  "CEO-SYNTHESIS-005 next safe slice is a TWII report-only probe decision packet with explicit one-attempt limit",
  "This role finding does not run SQL",
  "This role finding does not connect to Supabase",
  "This role finding does not write Supabase",
  "This role finding does not create staging rows",
  "This role finding does not modify `daily_prices`",
  "This role finding does not fetch or ingest raw market data",
  "This role finding does not probe an external endpoint",
  "This role finding does not print secrets",
  "This role finding does not print row payloads",
  "This role finding does not print stock_id payloads",
  "This role finding does not commit raw market data",
  "This role finding does not approve source rights",
  "This role finding does not approve a parser",
  "This role finding does not approve a report-only probe",
  "This role finding does not award row coverage points",
  "This role finding does not promote `publicDataSource=supabase`",
  "This role finding does not set `scoreSource=real`",
  "This role finding does not promote CP3 readiness",
  "This role finding does not approve public coverage claims",
  "PREPARE_TWII_REPORT_ONLY_PROBE_DECISION_PACKET",
  "explicit acceptance before any endpoint is contacted"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "PREPARE_TWII_RIGHTS_AND_FIELD_REVIEW_ROLE_FINDINGS",
  "review_state: not_approved_for_probe_or_ingestion",
  "FIELD-010 sanitized report-only output contract: required before any probe"
]) {
  if (!packet.includes(phrase)) {
    missing.push(`${packetPath}: ${phrase}`);
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
  packageJson.scripts?.["check:twii-rights-field-review-role-findings"] !==
  "node scripts/check-twii-rights-field-review-role-findings.mjs"
) {
  missing.push(`${packagePath}: check:twii-rights-field-review-role-findings`);
}
if (!reviewGate.includes("scripts/check-twii-rights-field-review-role-findings.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-rights-field-review-role-findings.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
