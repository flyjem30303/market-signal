import fs from "node:fs";

const packetPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_DECISION_PACKET_2026-06-01.md";
const findingsPath = "docs/reviews/TWII_RIGHTS_FIELD_REVIEW_ROLE_FINDINGS_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const packet = fs.readFileSync(packetPath, "utf8");
const findings = fs.readFileSync(findingsPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_decision_packet_prepared`",
  "TWII_RIGHTS_FIELD_REVIEW_ROLE_FINDINGS_2026-06-01.md",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "decision_status: pending_explicit_acceptance",
  "probe_state: not_authorized",
  "attempt_limit: exactly_one_after_acceptance",
  "output_contract: sanitized_aggregate_only",
  "observed_rows_before_probe: 0",
  "publicDataSource: mock",
  "scoreSource: mock",
  "The proposed future probe would answer only whether",
  "must not attempt to prove production readiness",
  "If this decision packet is explicitly accepted later",
  "exactly one report-only external source attempt",
  "sanitized aggregate evidence",
  "remoteAttempted",
  "connectionAttempted",
  "http_status_group",
  "parsed_row_count",
  "missing_session_count",
  "duplicate_trade_date_count",
  "field_parse_failure_count",
  "calendar_gap_count",
  "parser_flag_count",
  "failure_class",
  "must not report raw payloads",
  "raw endpoint parameters",
  "credential metadata",
  "GUARD-001 exact one-attempt limit is required",
  "GUARD-002 explicit acceptance is required before endpoint contact",
  "GUARD-003 sanitized aggregate-only output is required",
  "GUARD-004 no SQL is allowed",
  "GUARD-005 no Supabase write is allowed",
  "GUARD-006 no staging rows are allowed",
  "GUARD-007 no daily_prices modification is allowed",
  "GUARD-008 no raw market data file is allowed",
  "GUARD-009 no raw payload logging is allowed",
  "GUARD-010 no source promotion is allowed",
  "GUARD-011 no scoreSource=real is allowed",
  "GUARD-012 no row coverage points are allowed",
  "GUARD-013 post-run review is required immediately after execution",
  "GUARD-014 failure must remain a review artifact, not a retry loop",
  "GUARD-015 publicDataSource must remain mock",
  "Legal accepts that a one-attempt report-only probe may be used",
  "Data accepts the sanitized aggregate fields",
  "Engineering accepts that the attempt does not create a parser approval",
  "QA accepts the failure classes",
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
  "This packet does not approve ingestion",
  "This packet does not award row coverage points",
  "This packet does not promote `publicDataSource=supabase`",
  "This packet does not set `scoreSource=real`",
  "This packet does not promote CP3 readiness",
  "REQUEST_ACCEPT_OR_REJECT_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT",
  "wait for explicit accepted/rejected recording before any TWII endpoint is contacted"
]) {
  if (!packet.includes(phrase)) {
    missing.push(`${packetPath}: ${phrase}`);
  }
}

for (const phrase of [
  "PREPARE_TWII_REPORT_ONLY_PROBE_DECISION_PACKET",
  "explicit acceptance before any endpoint is contacted",
  "CEO-SYNTHESIS-005 next safe slice is a TWII report-only probe decision packet"
]) {
  if (!findings.includes(phrase)) {
    missing.push(`${findingsPath}: ${phrase}`);
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
  /decision_status:\s*accepted/i,
  /probe_state:\s*authorized/i,
  /probe_state:\s*approved/i,
  /REQUEST_EXECUTE/i
]) {
  if (pattern.test(packet)) {
    blocked.push(`${packetPath}: forbidden packet pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-report-only-probe-decision-packet"] !==
  "node scripts/check-twii-report-only-probe-decision-packet.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-decision-packet`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-decision-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-decision-packet.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
