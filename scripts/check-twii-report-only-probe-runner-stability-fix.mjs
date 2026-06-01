import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_RUNNER_STABILITY_FIX_2026-06-02.md";
const postRunPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md";
const runnerPath = "scripts/run-twii-report-only-probe-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_runner_stability_fix_recorded`",
  "TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md",
  "UV_HANDLE_CLOSING",
  "runner: scripts/run-twii-report-only-probe-once.mjs",
  "fix_scope: local_process_tail_stability_only",
  "process_exit_removed: true",
  "process_exitCode_used: true",
  "settle_before_exit_added: true",
  "remote_attempt_reused: false",
  "publicDataSource: mock",
  "scoreSource: mock",
  "process.exitCode",
  "settleBeforeExit()",
  "VERIFY-001 guarded runner fail-closed check passes without confirmation",
  "VERIFY-004 review gate still does not execute the TWII probe runner",
  "VERIFY-005 no new remote attempt is executed by this fix",
  "This fix does not run SQL",
  "This fix does not connect to Supabase",
  "This fix does not write Supabase",
  "This fix does not create staging rows",
  "This fix does not modify `daily_prices`",
  "This fix does not fetch or ingest raw market data",
  "This fix does not probe an external endpoint",
  "This fix does not print secrets",
  "This fix does not print row payloads",
  "This fix does not print stock_id payloads",
  "This fix does not commit raw market data",
  "This fix does not approve source rights",
  "This fix does not approve a parser",
  "This fix does not approve ingestion",
  "This fix does not award row coverage points",
  "This fix does not promote `publicDataSource=supabase`",
  "This fix does not set `scoreSource=real`",
  "READY_FOR_TWII_PARSER_DESIGN_PREPARATION_LOCAL_ONLY",
  "Do not rerun the TWII probe without a new one-attempt execution decision gate."
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "processTailIssue: windows_uv_handle_closing_assertion_after_sanitized_output",
  "Do not rerun the TWII report-only probe until a new one-attempt execution decision gate is recorded"
]) {
  if (!postRun.includes(phrase)) {
    missing.push(`${postRunPath}: ${phrase}`);
  }
}

for (const phrase of [
  "process.exitCode = result.status === \"ready_for_review\" ? 0 : 1",
  "process.exitCode = 1",
  "await settleBeforeExit()",
  "function settleBeforeExit()"
]) {
  if (!runner.includes(phrase)) {
    missing.push(`${runnerPath}: ${phrase}`);
  }
}

for (const pattern of [
  /process\.exit\(/,
  /@supabase\/supabase-js/,
  /createClient/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /\.rpc\(/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /writeFileSync/,
  /appendFileSync/,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+[a-z_]+\s+set/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i
]) {
  if (pattern.test(runner)) {
    blocked.push(`${runnerPath}: forbidden runner pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-report-only-probe-runner-stability-fix"] !==
  "node scripts/check-twii-report-only-probe-runner-stability-fix.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-runner-stability-fix`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-runner-stability-fix.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-runner-stability-fix.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
