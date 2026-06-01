import fs from "node:fs";

const commandMapPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md";
const acceptancePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ACCEPTANCE_GATE_2026-06-01.md";
const runnerPath = "scripts/run-twii-report-only-probe-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const commandMap = fs.readFileSync(commandMapPath, "utf8");
const acceptance = fs.readFileSync(acceptancePath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_command_map_recorded`",
  "TWII_REPORT_ONLY_PROBE_ACCEPTANCE_GATE_2026-06-01.md",
  "runner: scripts/run-twii-report-only-probe-once.mjs",
  "mode: twii_report_only_probe",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "confirmation_variable: TWII_REPORT_ONLY_PROBE_CONFIRMATION",
  "confirmation_token: CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT",
  "attempt_limit: exactly_one_future_attempt",
  "$env:TWII_REPORT_ONLY_PROBE_CONFIRMATION=\"CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT\"; $env:NEXT_PUBLIC_DATA_SOURCE=\"mock\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-twii-report-only-probe-once.mjs",
  "CHECK-001 npm run check:twii-report-only-probe-guarded-runner",
  "CHECK-002 npm run check:twii-report-only-probe-command-map",
  "CHECK-003 npm run check:twii-report-only-probe-post-run-template",
  "CHECK-004 npm run check:review-gates",
  "failureClass",
  "httpStatusGroup",
  "parsedRowCount",
  "dateRangeStart",
  "dateRangeEnd",
  "rowPayloadsPrinted",
  "stockIdPayloadsPrinted",
  "secretsPrinted",
  "sqlExecuted",
  "writesAttempted",
  "marketDataFilesWritten",
  "rowCoverageCreditAwarded",
  "scoreSourceRealEnabled",
  "Stop after one process execution",
  "Stop if confirmation is missing",
  "Stop if `NEXT_PUBLIC_DATA_SOURCE` is not `mock`",
  "This command map does not run SQL",
  "This command map does not connect to Supabase",
  "This command map does not write Supabase",
  "This command map does not create staging rows",
  "This command map does not modify `daily_prices`",
  "This command map does not fetch or ingest raw market data in this slice",
  "This command map does not probe an external endpoint in this slice",
  "This command map does not set `scoreSource=real`",
  "TWII_REPORT_ONLY_PROBE_RUNNER_READY_FOR_SEPARATE_ONE_ATTEMPT_EXECUTION_DECISION"
]) {
  if (!commandMap.includes(phrase)) {
    missing.push(`${commandMapPath}: ${phrase}`);
  }
}

if (!acceptance.includes("ACCEPT_TWII_REPORT_ONLY_PROBE_DECISION_PACKET_FOR_IMPLEMENTATION_PREPARATION_ONLY")) {
  missing.push(`${acceptancePath}: acceptance decision`);
}
if (!runner.includes("CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT")) {
  missing.push(`${runnerPath}: confirmation token`);
}

for (const pattern of [
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /REQUEST_EXECUTE/i,
  /execution_state:\s*executed/i
]) {
  if (pattern.test(commandMap)) {
    blocked.push(`${commandMapPath}: forbidden command-map pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-report-only-probe-command-map"] !==
  "node scripts/check-twii-report-only-probe-command-map.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-command-map`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-command-map.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-command-map.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
