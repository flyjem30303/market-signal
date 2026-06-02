import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_DESIGN_PREPARATION_ROLE_REVIEW_2026-06-02.md";
const prepPath = "docs/reviews/TWII_PARSER_DESIGN_PREPARATION_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const prep = fs.readFileSync(prepPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_design_preparation_role_review_recorded`",
  "TWII_PARSER_DESIGN_PREPARATION_2026-06-02.md",
  "review_type: role_review_only",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "evidence_source: sanitized_aggregate_evidence_only",
  "remote_attempt_reused: false",
  "publicDataSource: mock",
  "scoreSource: mock",
  "LEGAL-FINDING-001 parser-design preparation does not approve source rights",
  "LEGAL-FINDING-002 synthetic fixtures are acceptable for local parser contract work",
  "LEGAL-FINDING-003 raw source rows must not be stored or committed",
  "LEGAL-FINDING-005 ingestion remains blocked until a separate rights decision",
  "DATA-FINDING-001 ROC date to ISO date normalization is acceptable for parser contract design",
  "DATA-FINDING-002 numeric comma stripping is acceptable for parser contract design",
  "DATA-FINDING-003 index value is the only required future normalized market value at this stage",
  "DATA-FINDING-004 transaction fields remain review-only until field meaning is approved",
  "DATA-FINDING-005 market calendar gaps require a separate calendar source before claims",
  "ENGINEERING-FINDING-001 next implementation may create a local parser contract module",
  "ENGINEERING-FINDING-002 next implementation may create synthetic fixtures only",
  "ENGINEERING-FINDING-003 next implementation must not add a fetcher",
  "ENGINEERING-FINDING-004 next implementation must not write files at runtime",
  "ENGINEERING-FINDING-005 next implementation must not map into daily_prices",
  "ENGINEERING-FINDING-006 next implementation must not connect to Supabase",
  "ENGINEERING-FINDING-007 static checker must block raw market data fixtures",
  "QA-FINDING-001 synthetic tests should cover valid rows, bad dates, bad numerics, duplicates, and empty rows",
  "QA-FINDING-003 test fixtures must avoid real TWII market values and real row payloads",
  "QA-FINDING-005 review gate must not execute the TWII probe runner",
  "CEO-SYNTHESIS-001 parser-design preparation is accepted for local-only implementation planning",
  "CEO-SYNTHESIS-002 the next safe slice is a local parser contract module using synthetic rows only",
  "CEO-SYNTHESIS-003 source rights, ingestion, Supabase, daily_prices, row coverage, and public claims remain blocked",
  "CEO-SYNTHESIS-004 do not rerun the TWII probe without a new one-attempt execution decision gate",
  "CEO-SYNTHESIS-005 keep publicDataSource mock and scoreSource mock",
  "This role review does not run SQL",
  "This role review does not connect to Supabase",
  "This role review does not write Supabase",
  "This role review does not create staging rows",
  "This role review does not modify `daily_prices`",
  "This role review does not fetch or ingest raw market data",
  "This role review does not probe an external endpoint",
  "This role review does not print secrets",
  "This role review does not print row payloads",
  "This role review does not print stock_id payloads",
  "This role review does not commit raw market data",
  "This role review does not approve source rights",
  "This role review does not approve parser ingestion",
  "This role review does not approve ingestion",
  "This role review does not award row coverage points",
  "This role review does not promote `publicDataSource=supabase`",
  "This role review does not set `scoreSource=real`",
  "READY_FOR_TWII_LOCAL_PARSER_CONTRACT_MODULE_SYNTHETIC_ONLY",
  "synthetic rows only"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_DESIGN_ROLE_REVIEW_LOCAL_ONLY",
  "synthetic rows only, not raw market data",
  "This preparation does not fetch or ingest raw market data"
]) {
  if (!prep.includes(phrase)) {
    missing.push(`${prepPath}: ${phrase}`);
  }
}

for (const pattern of [
  /https?:\/\/[^\s)]+/i,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /https:\/\/[a-z0-9-]+\.supabase\.co/i,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /scoreSource:\s*real/i,
  /publicDataSource:\s*supabase/i
]) {
  if (pattern.test(review)) {
    blocked.push(`${reviewPath}: forbidden review pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-parser-design-preparation-role-review"] !==
  "node scripts/check-twii-parser-design-preparation-role-review.mjs"
) {
  missing.push(`${packagePath}: check:twii-parser-design-preparation-role-review`);
}
if (!reviewGate.includes("scripts/check-twii-parser-design-preparation-role-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-design-preparation-role-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
