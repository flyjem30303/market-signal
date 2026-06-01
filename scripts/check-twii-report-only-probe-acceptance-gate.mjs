import fs from "node:fs";

const acceptancePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ACCEPTANCE_GATE_2026-06-01.md";
const packetPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_DECISION_PACKET_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const acceptance = fs.readFileSync(acceptancePath, "utf8");
const packet = fs.readFileSync(packetPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_acceptance_gate_recorded`",
  "The chairman accepted `TWII_REPORT_ONLY_PROBE_DECISION_PACKET_2026-06-01.md` by oral review in this thread.",
  "decision_packet: TWII_REPORT_ONLY_PROBE_DECISION_PACKET_2026-06-01.md",
  "decision_outcome: accepted",
  "recorded_by: CEO",
  "authorization_scope: prepare_guarded_one_attempt_runner_or_command_map",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "attempt_limit: exactly_one_future_attempt",
  "probe_state_after_acceptance: implementation_preparation_authorized",
  "execution_state: not_executed",
  "publicDataSource: mock",
  "scoreSource: mock",
  "prepare a guarded one-attempt TWII report-only probe runner or exact command map",
  "confirmation_token",
  "single_attempt_guard",
  "sanitized_aggregate_output_contract",
  "network_boundary",
  "failure_classes",
  "post_run_review_template",
  "stop_conditions",
  "must still keep the runner unexecuted",
  "GUARD-001 exact one-attempt limit remains required",
  "GUARD-002 sanitized aggregate-only output remains required",
  "GUARD-003 no SQL is allowed",
  "GUARD-004 no Supabase write is allowed",
  "GUARD-005 no staging rows are allowed",
  "GUARD-006 no daily_prices modification is allowed",
  "GUARD-007 no raw market data file is allowed",
  "GUARD-008 no raw payload logging is allowed",
  "GUARD-009 no source promotion is allowed",
  "GUARD-010 no scoreSource=real is allowed",
  "GUARD-011 no row coverage points are allowed",
  "GUARD-012 post-run review remains required immediately after any future execution",
  "GUARD-013 failure remains a review artifact, not a retry loop",
  "GUARD-014 publicDataSource remains mock",
  "GUARD-015 source rights remain unapproved until a separate rights decision exists",
  "This acceptance gate does not run SQL",
  "This acceptance gate does not connect to Supabase",
  "This acceptance gate does not write Supabase",
  "This acceptance gate does not create staging rows",
  "This acceptance gate does not modify `daily_prices`",
  "This acceptance gate does not fetch or ingest raw market data",
  "This acceptance gate does not probe an external endpoint",
  "This acceptance gate does not print secrets",
  "This acceptance gate does not print row payloads",
  "This acceptance gate does not print stock_id payloads",
  "This acceptance gate does not commit raw market data",
  "This acceptance gate does not approve source rights",
  "This acceptance gate does not approve a parser",
  "This acceptance gate does not approve ingestion",
  "This acceptance gate does not award row coverage points",
  "This acceptance gate does not promote `publicDataSource=supabase`",
  "This acceptance gate does not set `scoreSource=real`",
  "This acceptance gate does not promote CP3 readiness",
  "This acceptance gate does not approve public coverage claims",
  "ACCEPT_TWII_REPORT_ONLY_PROBE_DECISION_PACKET_FOR_IMPLEMENTATION_PREPARATION_ONLY",
  "Do not execute the probe in this acceptance-gate slice."
]) {
  if (!acceptance.includes(phrase)) {
    missing.push(`${acceptancePath}: ${phrase}`);
  }
}

for (const phrase of [
  "Status: `twii_report_only_probe_decision_packet_prepared`",
  "decision_status: pending_explicit_acceptance",
  "probe_state: not_authorized",
  "REQUEST_ACCEPT_OR_REJECT_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"
]) {
  if (!packet.includes(phrase)) {
    missing.push(`${packetPath}: ${phrase}`);
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
  /execution_state:\s*executed/i,
  /REQUEST_EXECUTE/i,
  /scoreSource:\s*real/i,
  /publicDataSource:\s*supabase/i
]) {
  if (pattern.test(acceptance)) {
    blocked.push(`${acceptancePath}: forbidden acceptance pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-report-only-probe-acceptance-gate"] !==
  "node scripts/check-twii-report-only-probe-acceptance-gate.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-acceptance-gate`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-acceptance-gate.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
