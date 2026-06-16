import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_EXTERNAL_AUTHORIZATION_QUICKSTART_NO_EXECUTION.md";
const externalIntakeCheckerPath =
  "scripts/check-phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const externalIntake = runJson(externalIntakeCheckerPath);

validateDependency();
validateDoc();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_external_authorization_quickstart_no_execution_ready"
        : "phase_1_runtime_promotion_external_authorization_quickstart_no_execution_blocked",
      decision: "GUIDE_EXTERNAL_AUTHORIZATION_FILE_KEEP_MOCK",
      externalAuthorizationResponseCommitted: false,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? "external_authorization_validated_then_create_fresh_pm_go_no_go_or_keep_mock" : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateDependency() {
  expect(externalIntake.status, "ok", "externalIntake.status");
  expect(
    externalIntake.guardedStatus,
    "phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution_ready",
    "externalIntake.guardedStatus"
  );
  expect(externalIntake.acceptedAuthorizationResponsePresentNow, false, "externalIntake.acceptedAuthorizationResponsePresentNow");
  expect(externalIntake.freshPmGoNoGoForExecutionPresentNow, false, "externalIntake.freshPmGoNoGoForExecutionPresentNow");
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_runtime_promotion_external_authorization_quickstart_no_execution_ready`",
    "Decision: `GUIDE_EXTERNAL_AUTHORIZATION_FILE_KEEP_MOCK`",
    "D:\\指數燈號\\tmp\\phase-1-runtime-promotion-bounded-write-authorization-response.local.json",
    "`responseMode=phase_1_runtime_promotion_bounded_write_authorization_response`",
    "`responseLabel=PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION`",
    "`operatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
    "`targetTable=daily_prices`",
    "`targetScope=twii_and_etf_phase_1_missing_row_closure_only`",
    "`maxRowsPerAttempt=178`",
    "`confirmationCompleteness=complete`",
    "All required confirmations must be `true`.",
    "check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs --response",
    "Passing this validator still does not execute any write.",
    "`boundedAttemptExecutableNow=false`",
    "`writeGateExecutableNow=false`",
    "`runnerExecutableNow=false`",
    "`promotionAllowedNow=false`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "Do not commit a filled accepted authorization response.",
    "external_authorization_validated_then_create_fresh_pm_go_no_go_or_keep_mock"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-runtime-promotion-external-authorization-quickstart-no-execution"] !==
    "node scripts/check-phase-1-runtime-promotion-external-authorization-quickstart-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-external-authorization-quickstart-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-external-authorization-quickstart-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing external authorization quickstart checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-external-authorization-quickstart-no-execution"')) {
    problems.push(`${reviewGatePath} missing external authorization quickstart focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Runtime Promotion External Authorization Quickstart",
    "phase_1_runtime_promotion_external_authorization_quickstart_no_execution_ready",
    "GUIDE_EXTERNAL_AUTHORIZATION_FILE_KEEP_MOCK"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [projectStatusPath, projectStatus]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}: ${run.stderr || run.stdout}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
  }
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
