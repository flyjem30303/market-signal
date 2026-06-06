import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_GATE.md";
const preExecutionPath = "docs/TW_EQUITY_WRITE_PRE_EXECUTION_SUMMARY.md";
const validatorPath = "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md";
const boundaryPath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_DESIGN_TO_CODE_BOUNDARY.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const preExecution = read(preExecutionPath);
const validator = read(validatorPath);
const boundary = read(boundaryPath);
const runner = read(runnerPath);
const writeImplementationCreated = runner.includes("tw_equity_staging_write_fail_closed_write_capable_runner");
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Implementation Final Authorization Gate",
  "tw_equity_write_implementation_final_authorization_gate_ready_not_approved",
  "last local authorization boundary",
  "does not create the write implementation",
  "separately named CEO approval",
  "What A Future Approval May Permit",
  "service-role Supabase client creation inside the server-side runner",
  "insert into `staging_twse_stock_day_runs`",
  "insert into `staging_twse_stock_day_prices`",
  "exactly one bounded staging write attempt",
  "rollback dry-run count before mutation",
  "What Remains Forbidden",
  "production `daily_prices` mutation",
  "public source promotion",
  "row coverage point award",
  "`scoreSource=real`",
  "retry after failure",
  "destructive rollback execution",
  "First Write Attempt Conditions",
  "writePreExecutionSummaryReady=true",
  "rollbackDryRunCountReady=true",
  "Post-Run Review Acceptance",
  "final decision: `accepted`, `rejected`, or `needs_cleanup_review`",
  "final authorization gate is ready for review but not accepted",
  "Real write implementation remains blocked",
  "No SQL, Supabase connection, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [preExecutionPath, preExecution, "tw_equity_write_pre_execution_summary_ready_not_mutating"],
  [preExecutionPath, preExecution, "`writePreExecutionSummaryReady`"],
  [validatorPath, validator, "tw_equity_sanitized_candidate_input_validator_ready_not_mutating"],
  [validatorPath, validator, "`candidateInputAccepted=true`"],
  [boundaryPath, boundary, "tw_equity_write_implementation_design_to_code_boundary_ready_not_mutating"],
  [boundaryPath, boundary, "must still refuse Supabase mutation"],
  [runnerPath, runner, writeImplementationCreated ? "executeBoundedStagingWrite" : "runner_skeleton_has_no_supabase_write_implementation"],
  [runnerPath, runner, writeImplementationCreated ? "writeImplementationReady: true" : "writeImplementationReady: false"],
  [runnerPath, runner, "writePreExecutionSummaryReady"],
  [runnerPath, runner, "connectionAttempted: false"],
  [runnerPath, runner, "mutations: false"],
  [runnerPath, runner, "sqlExecuted: false"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write implementation final authorization gate slice",
  "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_GATE.md",
  "tw_equity_write_implementation_final_authorization_gate_ready_not_approved",
  "final authorization gate is ready for review but not accepted",
  "future approval may permit only service-role server runner creation and inserts into staging_twse_stock_day_runs and staging_twse_stock_day_prices",
  "actual write implementation and bounded write attempt remain blocked until a separately named CEO approval accepts the gate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-implementation-final-authorization-gate"] !==
  "node scripts/check-tw-equity-write-implementation-final-authorization-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-implementation-final-authorization-gate");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-implementation-final-authorization-gate.mjs")) {
    problems.push(`${pathName} missing final authorization checker`);
  }
  if (!text.includes("tw-equity-write-implementation-final-authorization-gate")) {
    problems.push(`${pathName} missing tw-equity-write-implementation-final-authorization-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-implementation-final-authorization-gate"')) {
  problems.push("review gate core set missing tw-equity-write-implementation-final-authorization-gate");
}

const forbiddenPatterns = writeImplementationCreated
  ? [
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ]
  : [
      /@supabase\/supabase-js/u,
      /createClient/u,
      /\.from\(/u,
      /\.insert\(/u,
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden write-capable token before final approval: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
