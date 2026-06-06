import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md";
const authPath = "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md";
const preflightPath = "docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md";
const reconciliationPath = "docs/reviews/TW_EQUITY_TARGET_RELATION_RECONCILIATION_REVIEW_2026-06-06.md";
const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const auth = read(authPath);
const preflight = read(preflightPath);
const reconciliation = read(reconciliationPath);
const migration = read(migrationPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write-Capable Runner Implementation Readiness Gate",
  "tw_equity_write_capable_runner_implementation_readiness_gate_ready_not_implemented",
  "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md",
  "docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md",
  "docs/reviews/TW_EQUITY_TARGET_RELATION_RECONCILIATION_REVIEW_2026-06-06.md",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "This gate does not implement writes",
  "target relation reconciliation is accepted",
  "runner_skeleton_has_no_supabase_write_implementation",
  "TW_EQUITY_STAGING_WRITE_CONFIRMATION=CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "load only `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`",
  "never print secret values",
  "keep `publicDataSource=mock`",
  "keep `scoreSource=mock`",
  "do not fetch market data in the write runner",
  "write only `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`",
  "never mutate `daily_prices`",
  "run_id",
  "enforce `maxRows=180`",
  "use service-role only after explicit confirmation",
  "dry-run cleanup count by `run_id`",
  "destructive rollback remains blocked",
  "print sanitized aggregate output",
  "no retry",
  "`writeImplementationReady`",
  "write-capable runner implementation is not created in this slice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrase] of [
  [authPath, auth, "target relation set | `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`"],
  [preflightPath, preflight, "tw_equity_one_attempt_staging_write_preflight_gate_reconciled_not_executed"],
  [reconciliationPath, reconciliation, "tw_equity_target_relation_reconciliation_accepted_not_executed"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_runs"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_prices"],
  [runnerPath, runner, "runner_skeleton_has_no_supabase_write_implementation"]
]) {
  if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write-capable runner implementation readiness gate slice",
  "docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md",
  "tw_equity_write_capable_runner_implementation_readiness_gate_ready_not_implemented",
  "target relation reconciliation is accepted",
  "required controls now cover confirmation, service-role allowlist, RLS posture, rollback dry-run, sanitized output, no retry, and canonical staging tables",
  "write-capable runner implementation is not created in this slice"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-capable-runner-implementation-readiness-gate"] !==
  "node scripts/check-tw-equity-write-capable-runner-implementation-readiness-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-capable-runner-implementation-readiness-gate");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-capable-runner-implementation-readiness-gate.mjs")) {
    problems.push(`${path} missing write-capable runner implementation readiness checker`);
  }
  if (!text.includes("tw-equity-write-capable-runner-implementation-readiness-gate")) {
    problems.push(`${path} missing tw-equity-write-capable-runner-implementation-readiness-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-capable-runner-implementation-readiness-gate"')) {
  problems.push("review gate core set missing tw-equity-write-capable-runner-implementation-readiness-gate");
}

const forbiddenDocPatterns = [
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /market-data ingestion is approved/u,
  /publicDataSource=supabase approved/u,
  /scoreSource=real approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
