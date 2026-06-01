import fs from "node:fs";

const reviewPath = "docs/reviews/SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET_2026-06-01.md";
const decisionMapPath = "docs/reviews/POST_READONLY_DATA_POPULATION_DECISION_MAP_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const decisionMap = fs.readFileSync(decisionMapPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `source_specific_backfill_design_packet_recorded`",
  "POST_READONLY_DATA_POPULATION_DECISION_MAP_2026-06-01.md",
  "expected_total_rows: 360",
  "observed_total_rows: 5",
  "missing_rows: 355",
  "twii_observed_rows: 0",
  "etf_0050_observed_rows: 1",
  "etf_006208_observed_rows: 1",
  "equity_2330_observed_rows: 1",
  "equity_2382_observed_rows: 1",
  "equity_2308_observed_rows: 1",
  "publicDataSource: mock",
  "scoreSource: mock",
  "lane_id: twii-index",
  "source_packet: twii_source_selection_packet_prepared",
  "select_one_twii_source_candidate_for_rights_review",
  "lane_id: tw-etf",
  "source_packet: etf_source_rights_review_packet_prepared",
  "resolve_etf_source_rights_and_field_coverage",
  "lane_id: tw-equity",
  "source_packet: equity_report_only_dry_run_packet_prepared",
  "prepare_equity_report_only_backfill_dry_run_design",
  "lane_id: storage-boundary",
  "choose_staging_first_unless_ceo_accepts_direct_write_risk",
  "preferred_route: staging-first",
  "lane_id: qa-acceptance",
  "define_acceptance_thresholds_before_any_point_award",
  "write_authorization: not_authorized",
  "Every future execution must have a separate one-attempt gate",
  "Every future write path must have a rollback and retention plan",
  "Every future report must be sanitized and aggregate-only",
  "This packet does not run SQL",
  "This packet does not connect to Supabase",
  "This packet does not write Supabase",
  "This packet does not create staging rows",
  "This packet does not modify `daily_prices`",
  "This packet does not fetch or ingest raw market data",
  "This packet does not print secrets",
  "This packet does not print row payloads",
  "This packet does not print stock_id payloads",
  "This packet does not commit raw market data",
  "This packet does not award row coverage points",
  "This packet does not promote `publicDataSource=supabase`",
  "This packet does not set `scoreSource=real`",
  "This packet does not promote CP3 readiness",
  "This packet does not approve public coverage claims",
  "PREPARE_TWII_SOURCE_SELECTION_AS_NEXT_SAFE_BACKFILL_SLICE"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "PREPARE_SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET",
  "twii_observed_rows: 0",
  "observed_total_rows: 5",
  "missing_rows: 355"
]) {
  if (!decisionMap.includes(phrase)) {
    missing.push(`${decisionMapPath}: ${phrase}`);
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
  packageJson.scripts?.["check:source-specific-backfill-design-packet"] !==
  "node scripts/check-source-specific-backfill-design-packet.mjs"
) {
  missing.push(`${packagePath}: check:source-specific-backfill-design-packet`);
}
if (!reviewGate.includes("scripts/check-source-specific-backfill-design-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-specific-backfill-design-packet.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
