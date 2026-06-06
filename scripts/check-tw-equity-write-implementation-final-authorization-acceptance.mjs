import fs from "node:fs";

const problems = [];

const acceptancePath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_ACCEPTANCE.md";
const gatePath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_GATE.md";
const preExecutionPath = "docs/TW_EQUITY_WRITE_PRE_EXECUTION_SUMMARY.md";
const validatorPath = "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const acceptance = read(acceptancePath);
const gate = read(gatePath);
const preExecution = read(preExecutionPath);
const validator = read(validatorPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Implementation Final Authorization Acceptance",
  "tw_equity_write_implementation_final_authorization_accepted_implementation_only",
  "Chairman oral decision: accepted",
  "accepted for implementation work only",
  "What This Acceptance Permits Next",
  "service-role Supabase client creation inside the server-side runner only",
  "insert into `staging_twse_stock_day_runs`",
  "insert into `staging_twse_stock_day_prices`",
  "What This Acceptance Does Not Permit",
  "does not itself execute the write",
  "writing Supabase before the implementation checker passes",
  "mutating production `daily_prices`",
  "fetching market data",
  "printing secrets",
  "`scoreSource=real`",
  "Next Implementation Boundary",
  "no client-side service role usage exists",
  "dry-run/no-execute mode never connects or mutates",
  "implementation authorization is accepted, but actual bounded write execution is still not performed",
  "No SQL, Supabase connection, Supabase write"
]) {
  if (!acceptance.includes(phrase)) problems.push(`${acceptancePath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [gatePath, gate, "tw_equity_write_implementation_final_authorization_gate_ready_not_approved"],
  [gatePath, gate, "What A Future Approval May Permit"],
  [preExecutionPath, preExecution, "tw_equity_write_pre_execution_summary_ready_not_mutating"],
  [preExecutionPath, preExecution, "`writePreExecutionSummaryReady`"],
  [validatorPath, validator, "tw_equity_sanitized_candidate_input_validator_ready_not_mutating"],
  [runnerPath, runner, "runner_skeleton_has_no_supabase_write_implementation"],
  [runnerPath, runner, "writeImplementationReady: false"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write implementation final authorization acceptance slice",
  "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_ACCEPTANCE.md",
  "tw_equity_write_implementation_final_authorization_accepted_implementation_only",
  "Chairman oral decision is accepted for implementation work only",
  "PM may proceed to implement the narrow server-side staging write path in the next slice",
  "actual bounded write execution is still not performed and remains blocked until implementation checks pass"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-implementation-final-authorization-acceptance"] !==
  "node scripts/check-tw-equity-write-implementation-final-authorization-acceptance.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-implementation-final-authorization-acceptance");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-implementation-final-authorization-acceptance.mjs")) {
    problems.push(`${pathName} missing final authorization acceptance checker`);
  }
  if (!text.includes("tw-equity-write-implementation-final-authorization-acceptance")) {
    problems.push(`${pathName} missing tw-equity-write-implementation-final-authorization-acceptance name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-implementation-final-authorization-acceptance"')) {
  problems.push("review gate core set missing tw-equity-write-implementation-final-authorization-acceptance");
}

for (const pattern of [
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
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} must remain non-write-capable during acceptance slice: ${pattern}`);
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
